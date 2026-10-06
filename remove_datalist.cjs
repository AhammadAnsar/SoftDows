const fs = require('fs');

function removeDatalist(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Remove datalist
  c = c.replace(/<datalist id="serviceOptions">.*?<\/datalist>\s*/g, '');
  
  // Remove list="serviceOptions"
  c = c.replace(/\s*list="serviceOptions"/g, '');

  fs.writeFileSync(filePath, c);
}

const files = [
  'src/pages/admin/invoices/new.astro',
  'src/pages/admin/quotations/new.astro',
  'src/pages/admin/invoices/[id]/edit.astro',
  'src/pages/admin/quotations/[id]/edit.astro'
];

files.forEach(removeDatalist);
