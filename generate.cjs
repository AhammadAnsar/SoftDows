const fs = require('fs');
const path = require('path');
const adminDir = './src/pages/admin';
const portalDir = './src/pages/portal';
const createDir = (dir) => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); };

function generateAdminIndex(entity, table, pluralName, fields) {
  createDir(path.join(adminDir, entity));
  let trHeaders = fields.map(f => '<th class="px-6 py-4 text-xs font-bold text-[#64748b] uppercase tracking-wider">' + f.label + '</th>').join('');
  let tdData = fields.map(f => '<td class="px-6 py-4 text-sm text-[#242a56]">{item.' + f.key + '}</td>').join('');
  
  const content = `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { db } from '../../../lib/db';
import { ${table} } from '../../../lib/db/schema';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { desc } from 'drizzle-orm';
import AdminIcon from '../../../components/ui/AdminIcon.astro';

const auth = getAuth(env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session || !['super_admin', 'admin', 'finance', 'support'].includes(session.user.role)) {
  return Astro.redirect('/admin/access-denied');
}

const items = await db.select().from(${table});
---
<AdminLayout title="${pluralName}" user={session.user}>
  <div class="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#242a56]">${pluralName}</h1>
      <a href="/admin/${entity}/new" class="px-4 py-2 bg-[#242a56] hover:bg-[#1a1e3e] text-white text-sm font-medium rounded-lg transition-colors">
        Add New
      </a>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-[#f8fafc] border-b border-[#e2e8f0]">
            ${trHeaders}
            <th class="px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e2e8f0]">
          {items.map((item: any) => (
            <tr class="hover:bg-[#f8fafc] transition-colors">
              ${tdData}
              <td class="px-6 py-4 text-right">
                <a href={\`/admin/${entity}/\${item.id}\`} class="text-[#6878d6] hover:text-[#242a56] text-sm font-medium">View</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
`;
  
  fs.writeFileSync(path.join(adminDir, entity, 'index.astro'), content);
}

generateAdminIndex('projects', 'projects', 'Projects', [{label: 'Name', key: 'name'}, {label: 'Status', key: 'status'}]);
generateAdminIndex('quotations', 'quotations', 'Quotations', [{label: 'Quote #', key: 'quotationNumber'}, {label: 'Status', key: 'status'}]);
generateAdminIndex('invoices', 'invoices', 'Invoices', [{label: 'Invoice #', key: 'invoiceNumber'}, {label: 'Total', key: 'total'}]);
generateAdminIndex('payments', 'payments', 'Payments', [{label: 'Amount', key: 'amount'}, {label: 'Method', key: 'paymentMethod'}]);
generateAdminIndex('tickets', 'supportTickets', 'Support Tickets', [{label: 'Subject', key: 'subject'}, {label: 'Status', key: 'status'}]);
generateAdminIndex('staff', 'user', 'Staff Management', [{label: 'Name', key: 'name'}, {label: 'Role', key: 'role'}]);

createDir(portalDir);
const portalContent = `---
import AdminLayout from '../../layouts/AdminLayout.astro';
import { getAuth } from '../../lib/auth';
import { env } from 'cloudflare:workers';
const auth = getAuth(env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session || session.user.role !== 'client') {
  return Astro.redirect('/login');
}
---
<AdminLayout title="Client Portal" user={session.user}>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-[#242a56]">Client Portal</h1>
    <p>Welcome to your portal. Only your data is visible here.</p>
  </div>
</AdminLayout>
`;
fs.writeFileSync(path.join(portalDir, 'index.astro'), portalContent);

console.log('CRM modules generated.');
