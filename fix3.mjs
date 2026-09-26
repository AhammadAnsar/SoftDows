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

  // Calculate correct relative path to src/
  const depth = file.split(path.sep).length - 2; // e.g. src/pages/portal/index.astro -> 4 parts. depth = 2 (out of portal, out of pages).
  const up = '../'.repeat(depth);

  // Replace any number of ../ with the correct amount
  content = content.replace(/(\.\.\/)+lib\//g, `${up}lib/`);
  content = content.replace(/(\.\.\/)+components\//g, `${up}components/`);
  content = content.replace(/(\.\.\/)+layouts\//g, `${up}layouts/`);

  // Fix implicit any by adding : any
  content = content.replace(/\(ticket\)/g, '(ticket: any)');
  content = content.replace(/\(invoice\)/g, '(invoice: any)');
  content = content.replace(/\(project\)/g, '(project: any)');
  content = content.replace(/\(p\)/g, '(p: any)');

  // Fix object is of type unknown
  content = content.replace(/result\.error/g, '(result as any).error');
  content = content.replace(/result\.ticketId/g, '(result as any).ticketId');
  content = content.replace(/\(await res\.json\(\)\)\.error/g, '((await res.json()) as any).error');

  fs.writeFileSync(file, content);
}
