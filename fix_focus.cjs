const fs = require('fs');

function fixInputFocusLost(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  // Change 'input' to 'change' for qty, price, discount, tax so it doesn't lose focus
  c = c.replace(/el.addEventListener\('input',\s*\(e\)\s*=>\s*\{\s*items\[e.target.dataset.index\].quantity =/g, "el.addEventListener('change', (e) => { items[e.target.dataset.index].quantity =");
  c = c.replace(/el.addEventListener\('input',\s*\(e\)\s*=>\s*\{\s*items\[e.target.dataset.index\].unitPrice =/g, "el.addEventListener('change', (e) => { items[e.target.dataset.index].unitPrice =");
  c = c.replace(/getElementById\('inputDiscount'\)\?\.addEventListener\('input'/g, "getElementById('inputDiscount')?.addEventListener('change'");
  c = c.replace(/getElementById\('inputTax'\)\?\.addEventListener\('input'/g, "getElementById('inputTax')?.addEventListener('change'");

  fs.writeFileSync(filePath, c);
}

const files = [
  'src/pages/admin/invoices/new.astro',
  'src/pages/admin/quotations/new.astro',
  'src/pages/admin/invoices/[id]/edit.astro',
  'src/pages/admin/quotations/[id]/edit.astro'
];

files.forEach(fixInputFocusLost);
