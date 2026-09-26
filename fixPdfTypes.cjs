const fs = require('fs');

let q = fs.readFileSync('src/pages/admin/quotations/[id]/pdf.ts', 'utf8');
fs.writeFileSync('src/pages/admin/quotations/[id]/pdf.ts', q.replace('new Response(pdfBytes,', 'new Response(pdfBytes as any,'));

let i = fs.readFileSync('src/pages/admin/invoices/[id]/pdf.ts', 'utf8');
fs.writeFileSync('src/pages/admin/invoices/[id]/pdf.ts', i.replace('new Response(pdfBytes,', 'new Response(pdfBytes as any,'));

console.log('Fixed pdf bytes type');
