$ErrorActionPreference = 'Stop'

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  SoftDows Version Bootstrap Utility" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$email = Read-Host "Enter Admin Email"
$securePass = Read-Host "Enter Admin Password" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
$password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
$securePass = $null

$tokenBytes = [byte[]]::new(32)
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($tokenBytes)
$bootstrapToken = [BitConverter]::ToString($tokenBytes).Replace("-","").ToLower()

$secretsPath = Join-Path $PSScriptRoot "secrets.json"
$secretsContent = '{"BOOTSTRAP_TOKEN":"' + $bootstrapToken + '"}'
Set-Content -Path $secretsPath -Value $secretsContent

Write-Host "
[+] Uploading temporary bootstrap version..." -ForegroundColor Yellow

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$wranglerCmd = Join-Path $projectRoot "node_modules\.bin\wrangler.cmd"
$configPath = Join-Path $PSScriptRoot "wrangler.json"

try {
    $wranglerOutput = & $wranglerCmd versions upload --config $configPath --name softdows --keep-vars --secrets-file $secretsPath --preview-alias admin-bootstrap 2>&1 | Out-String

    $urlMatch = [regex]::match($wranglerOutput, 'Version Preview Alias URL:\s+(https://\S+)')
    if (-not $urlMatch.Success) {
        throw "Failed to extract Version Preview URL from Wrangler output."
    }
    $versionUrl = $urlMatch.Groups[1].Value

    Write-Host "[+] Version uploaded successfully: $versionUrl" -ForegroundColor Green
    Write-Host "[+] Sending secure bootstrap POST request..." -ForegroundColor Yellow

    $bodyObj = @{ email = $email; password = $password }
    $bodyStr = $bodyObj | ConvertTo-Json -Compress

    $response = Invoke-WebRequest -Uri "$versionUrl/bootstrap" -Method POST -Headers @{ "X-Bootstrap-Token" = $bootstrapToken; "Content-Type" = "application/json" } -Body $bodyStr -UseBasicParsing -ErrorAction Stop

    Write-Host "
======================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Super Admin Created." -ForegroundColor Green
    Write-Host "======================================" -ForegroundColor Green
    Write-Host $response.Content -ForegroundColor DarkGray

} catch {
    Write-Host "
======================================" -ForegroundColor Red
    Write-Host "  ERROR! Bootstrap failed." -ForegroundColor Red
    Write-Host "======================================" -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        Write-Host $reader.ReadToEnd()
    }
} finally {
    Write-Host "
[+] Cleaning up..." -ForegroundColor Yellow
    Remove-Item -Path $secretsPath -Force -ErrorAction SilentlyContinue
    
    $password = $null
    $email = $null
    $bootstrapToken = $null
    $bodyStr = $null
    $bodyObj = $null
    
    Write-Host "[+] Clean up complete. Password cleared." -ForegroundColor Green
}
