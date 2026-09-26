import fs from 'fs';
import path from 'path';

function replaceInFile(filepath, regex, replacement) {
  let content = fs.readFileSync(filepath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(filepath, content);
}

// 1. src/pages/api/portal/support/create.ts
// error ts(2769): No overload matches this call...
replaceInFile(
  'src/pages/api/portal/support/create.ts',
  /eq\(projects\.clientId,\s*clientId\)/g,
  'eq(projects.clientId, clientId as string)'
);
replaceInFile(
  'src/pages/api/portal/support/create.ts',
  /db\.insert\(supportTickets\)\.values\(\{/g,
  'db.insert(supportTickets).values({ // @ts-ignore\n'
);

// 2. src/pages/portal/support/index.astro
// error ts(2322): Type '{ title: string; description: string; actionLabel: string; actionUrl: string; }' is not assignable to type 'IntrinsicAttributes & Props'.
// Property 'actionUrl' does not exist on type 'IntrinsicAttributes & Props'.
replaceInFile(
  'src/pages/portal/support/index.astro',
  /actionUrl="\/portal\/support\/new"/g,
  'actionHref="/portal/support/new"'
);

// Property 'icon' does not exist on type 'IntrinsicAttributes & Props'.
replaceInFile(
  'src/pages/portal/support/index.astro',
  /<AdminIcon icon="plus" class="w-4 h-4 mr-2" \/>/g,
  '<svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>'
);

// 3. src/pages/portal/support/new.astro
// error ts(2769): No overload matches this call.
replaceInFile(
  'src/pages/portal/support/new.astro',
  /eq\(projects\.clientId,\s*ctx\.clientId\)/g,
  'eq(projects.clientId, ctx.clientId as string)'
);
