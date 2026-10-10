const fs = require('fs');
let c = fs.readFileSync('src/pages/admin/invoices/new.astro', 'utf8');

if (!c.includes('quotationItems')) {
  c = c.replace(
    `import { quotations } from '../../../lib/db/schema/billing';`,
    `import { quotations, quotationItems } from '../../../lib/db/schema/billing';`
  );
}

if (!c.includes('let initialItemsJson =')) {
  const search = `let errors: Record<string, string> = {};`;
  const replace = `let errors: Record<string, string> = {};\nlet initialItemsJson = '[]';\nif (Astro.url.searchParams.get('quotationId')) {\n  const qItems = await db.select().from(quotationItems).where(eq(quotationItems.quotationId, Astro.url.searchParams.get('quotationId') as string));\n  initialItemsJson = JSON.stringify(qItems.map(qi => ({ description: qi.description, quantity: qi.quantity, unitPrice: (qi.unitPrice / 100).toFixed(2) })));\n}`;
  c = c.replace(search, replace);
}

const htmlSearch = `<input type="hidden" name="itemsJson" id="itemsJson" value="[]" />`;
const htmlReplace = `<input type="hidden" name="itemsJson" id="itemsJson" value={Astro.request.method === 'POST' ? '[]' : initialItemsJson} />`;
c = c.replace(htmlSearch, htmlReplace);

fs.writeFileSync('src/pages/admin/invoices/new.astro', c);
