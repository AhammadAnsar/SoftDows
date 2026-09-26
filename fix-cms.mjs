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

// 1. Settings API
fixFile('pages/api/admin/website/settings.ts', [
  { search: /data\[key\]/g, replace: '(data as any)[key]' },
  { search: /'settings:update'/g, replace: "'settings', 'update'" },
  { search: /!requirePermission\(role, 'settings', 'update'\)/g, replace: "!requirePermission(role as any, 'settings', 'update')" }
]);

// 2. Settings UI
fixFile('pages/admin/website/settings/index.astro', [
  { search: /requirePermission\(user\.role, 'settings', 'read'\)/g, replace: "requirePermission(user.role as any, 'settings', 'update')" }
]);

// 3. Homepage API
fixFile('pages/api/admin/website/homepage/[id].ts', [
  { search: /data\./g, replace: '(data as any).' },
  { search: /!requirePermission\(role, 'system', 'manage'\) && !requirePermission\(role, 'website', 'manage'\)/g, replace: "!requirePermission(role as any, 'content', 'update')" }
]);

// 4. Homepage Index UI
fixFile('pages/admin/website/homepage/index.astro', [
  { search: /!requirePermission\(user\.role, 'system', 'manage'\) && !requirePermission\(user\.role, 'website', 'manage'\)/g, replace: "!requirePermission(user.role as any, 'content', 'update')" }
]);

// 5. Homepage Edit UI
fixFile('pages/admin/website/homepage/[id].astro', [
  { search: /!requirePermission\(user\.role, 'system', 'manage'\) && !requirePermission\(user\.role, 'website', 'manage'\)/g, replace: "!requirePermission(user.role as any, 'content', 'update')" }
]);

// 6. Navigation Create API
fixFile('pages/api/admin/website/navigation/create.ts', [
  { search: /db\.insert\(navigationItems\)\.values\(\{/g, replace: "db.insert(navigationItems).values({ id: crypto.randomUUID().replace(/-/g, '')," },
  { search: /!requirePermission\(role, 'content', 'create'\)/g, replace: "!requirePermission(role as any, 'content', 'create')" }
]);

// 7. Navigation Update/Delete API
fixFile('pages/api/admin/website/navigation/[id].ts', [
  { search: /data\./g, replace: '(data as any).' },
  { search: /!requirePermission\(role, 'content', 'update'\)/g, replace: "!requirePermission(role as any, 'content', 'update')" },
  { search: /!requirePermission\(role, 'content', 'delete'\)/g, replace: "!requirePermission(role as any, 'content', 'delete')" }
]);

// 8. Navigation UI
fixFile('pages/admin/website/navigation/index.astro', [
  { search: /!requirePermission\(user\.role, 'content', 'read'\)/g, replace: "!requirePermission(user.role as any, 'content', 'read')" }
]);

// Fix the schema error in navigationItems create (if any leftover from earlier missing id)
console.log('Fixed files');
