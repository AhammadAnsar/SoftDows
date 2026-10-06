const fs = require('fs');

function addListAttr(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Regex to add list="serviceOptions" to item-desc input if not already present
  c = c.replace(/(class="[^"]*item-desc"[^>]*?)(\s*\/>)/g, (match, p1, p2) => {
    if (p1.includes('list=')) return match;
    return p1 + ' list="serviceOptions"' + p2;
  });
  
  c = c.replace(/(class="[^"]*item-desc"[^>]*?)(\s*required\s*\/>)/g, (match, p1, p2) => {
    if (p1.includes('list=')) return match;
    return p1 + ' list="serviceOptions"' + p2;
  });

  c = c.replace(/value="\$\{item\.description\}"\s*required\s*\/>/g, 'value="${item.description}" list="serviceOptions" required />');
  c = c.replace(/value="\$\{item\.description\.replace\(\/"\/g,\s*'&quot;'\)\}"\s*required\s*placeholder="Item description"\s*\/>/g, 'value="${item.description.replace(/\\"/g, \'&quot;\')}" list="serviceOptions" required placeholder="Item description" />');


  fs.writeFileSync(filePath, c);
}

const files = [
  'src/pages/admin/invoices/new.astro',
  'src/pages/admin/quotations/new.astro',
  'src/pages/admin/invoices/[id]/edit.astro',
  'src/pages/admin/quotations/[id]/edit.astro'
];

files.forEach(addListAttr);
