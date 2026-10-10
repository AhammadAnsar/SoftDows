const fs = require('fs');
let q = fs.readFileSync('src/pages/admin/quotations/index.astro', 'utf8');
fs.writeFileSync('src/pages/admin/quotations/index.astro', q.replace("'finance'", "'quotations'"));

let i = fs.readFileSync('src/pages/admin/invoices/index.astro', 'utf8');
fs.writeFileSync('src/pages/admin/invoices/index.astro', i.replace("'finance'", "'invoices'"));

let p = fs.readFileSync('src/pages/admin/payments/index.astro', 'utf8');
fs.writeFileSync('src/pages/admin/payments/index.astro', p.replace("'finance'", "'payments'"));
console.log('Fixed permissions');
