const fs = require('fs');
const file = 'src/pages/admin/projects/[id]/index.astro';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/import \{ invoices, quotations \} from '\.\.\/\.\.\/\.\.\/\.\.\/lib\/db\/schema\/billing';\s*\nimport \{ invoices, quotations \} from '\.\.\/\.\.\/\.\.\/\.\.\/lib\/db\/schema\/billing';/, 
"import { invoices, quotations } from '../../../../lib/db/schema/billing';");

fs.writeFileSync(file, c);
