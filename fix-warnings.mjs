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

fixFile('pages/portal/profile/index.astro', [
  { search: /import { clientContacts, clients } from '\.\.\/\.\.\/\.\.\/lib\/db\/schema\/crm';/g, replace: "import { clients } from '../../../lib/db/schema/crm';" }
]);

fixFile('pages/portal/support/index.astro', [
  { search: /import AdminIcon from '\.\.\/\.\.\/\.\.\/components\/admin\/AdminIcon\.astro';\n/g, replace: '' }
]);
