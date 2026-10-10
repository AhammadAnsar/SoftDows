import fs from 'fs';
import path from 'path';

function fixFile(file, replacements) {
  const p = path.join('src', file);
  if (!fs.existsSync(p)) return;
  let content = fs.readFileSync(p, 'utf8');
  for (const r of replacements) {
    content = content.replace(r.search, r.replace);
  }
  fs.writeFileSync(p, content);
}

fixFile('pages/api/admin/website/settings.ts', [
  { search: /id:\s*id\(\)/g, replace: "id: crypto.randomUUID().replace(/-/g, '')" }
]);

fixFile('pages/api/admin/system/migrate-cms.ts', [
  { search: /requirePermission\(session\.user\.role as any, 'system', 'manage'\)/g, replace: "requirePermission(session.user.role as any, 'content', 'update')" }
]);

fixFile('pages/admin/website/homepage/index.astro', [
  { search: /!requirePermission\(role, 'system', 'manage'\) && !requirePermission\(role, 'website', 'manage'\)/g, replace: "!requirePermission(role as any, 'content', 'update')" }
]);

fixFile('pages/admin/website/homepage/[id].astro', [
  { search: /!requirePermission\(role, 'system', 'manage'\) && !requirePermission\(role, 'website', 'manage'\)/g, replace: "!requirePermission(role as any, 'content', 'update')" }
]);

fixFile('pages/admin/website/navigation/index.astro', [
  { search: /data\.error/g, replace: '(data as any).error' }
]);

fixFile('pages/admin/website/settings/index.astro', [
  { search: /error\.error/g, replace: '(error as any).error' }
]);
