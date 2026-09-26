import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.astro') || file.endsWith('.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/pages/portal');
const apiFiles = walk('./src/pages/api/portal');

for (const file of [...files, ...apiFiles]) {
  let content = fs.readFileSync(file, 'utf8');

  // Revert the bad casts
  content = content.replace(/ctx\.clientId! as string as string/g, 'ctx.clientId');
  content = content.replace(/!ctx\.clientId!/g, '!ctx.clientId');
  content = content.replace(/ctx\.clientId!/g, 'ctx.clientId');
  
  // Fix imports level
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib/g, '../../../../lib');
  content = content.replace(/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/lib/g, '../../../../../lib');

  // Apply cast safely only where eq is called
  content = content.replace(/eq\(([^,]+),\s*ctx\.clientId\)/g, 'eq($1, ctx.clientId as string)');

  fs.writeFileSync(file, content);
}
