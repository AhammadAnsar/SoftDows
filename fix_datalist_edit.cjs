const fs = require('fs');

function applyDatalist(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');

  if (!c.includes('servicesData')) {
    c = c.replace(
      "import { env } from 'cloudflare:workers';",
      "import { env } from 'cloudflare:workers';\nimport { servicesData } from '../../../../config/services';"
    );
  }

  if (!c.includes('<datalist id="serviceOptions">')) {
    c = c.replace(
      '<div class="border border-slate-200 rounded-lg overflow-hidden">',
      '<datalist id="serviceOptions">{servicesData.map((s: any) => <option value={s.title} />)}</datalist>\n        <div class="border border-slate-200 rounded-lg overflow-hidden">'
    );
  }

  c = c.replace(
    'placeholder="Item description" /></td>',
    'placeholder="Item description" list="serviceOptions" /></td>'
  );

  fs.writeFileSync(filePath, c);
}

applyDatalist('src/pages/admin/invoices/[id]/edit.astro');
applyDatalist('src/pages/admin/quotations/[id]/edit.astro');
