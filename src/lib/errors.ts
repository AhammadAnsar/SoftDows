/**
 * Professional Error Handling Foundation
 * 
 * Future usage:
 * Use this module to safely handle server-side errors without leaking
 * stack traces, internal SQL errors, or secrets to the public frontend.
 */

export class AppError extends Error {
  public statusCode: number;
  public isPublic: boolean;

  constructor(message: string, statusCode: number = 500, isPublic: boolean = false) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    // Only set to true if the message is safe to display to a user
    this.isPublic = isPublic;
  }
}

// Future implementation will include structured logging
export function handleServerError(error: unknown, request?: Request) {
  // Log securely to internal systems (e.g., Cloudflare Tail or Axiom)
  console.error("Internal Server Error:", error);

  const isApi = request?.url ? new URL(request.url).pathname.startsWith('/api/') : false;
  
  if (error instanceof AppError && error.isPublic) {
    if (!isApi && request) {
       return renderHtmlError(error.message, error.statusCode);
    }
    return new Response(JSON.stringify({ error: error.message }), {
      status: error.statusCode,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generic fallback for unhandled or private errors
  const fallbackMessage = 'An unexpected error occurred. Please try again later.';
  if (!isApi && request) {
    return renderHtmlError(fallbackMessage, 500);
  }
  return new Response(JSON.stringify({ error: fallbackMessage }), {
    status: 500,
    headers: { 'Content-Type': 'application/json' }
  });
}

function renderHtmlError(message: string, status: number) {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Error ${status} - SoftDows</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; background-color: #f8fafc; color: #0f172a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
        .container { text-align: center; background: white; padding: 3rem; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); max-width: 28rem; width: 100%; }
        h1 { font-size: 1.5rem; font-weight: 600; margin-bottom: 0.5rem; }
        p { color: #64748b; margin-bottom: 2rem; }
        a { display: inline-flex; align-items: center; justify-content: center; padding: 0.5rem 1rem; font-size: 0.875rem; font-weight: 500; color: white; background-color: #2563eb; border-radius: 0.375rem; text-decoration: none; }
        a:hover { background-color: #1d4ed8; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Something went wrong</h1>
        <p>${message}</p>
        <a href="/">Return to Homepage</a>
      </div>
    </body>
    </html>
  `;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
