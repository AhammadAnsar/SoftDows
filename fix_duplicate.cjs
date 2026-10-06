const fs = require('fs');

let c = fs.readFileSync('src/pages/admin/projects/[id]/index.astro', 'utf8');
c = c.replace(
  "import { invoices, quotations } from '../../../../lib/db/schema/billing';\nimport { invoices, quotations } from '../../../../lib/db/schema/billing';",
  "import { invoices, quotations } from '../../../../lib/db/schema/billing';"
);
fs.writeFileSync('src/pages/admin/projects/[id]/index.astro', c);
