const fs = require('fs');
const path = require('path');

const outDir1 = './src/pages/admin/quotations';
const outDir2 = './src/pages/admin/invoices';
const outDir3 = './src/pages/admin/payments';
[outDir1, outDir2, outDir3].forEach(d => { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); });

fs.writeFileSync(path.join(outDir1, 'index.astro'), `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { getDb } from '../../../lib/db';
import { quotations } from '../../../lib/db/schema/billing';
import { clients } from '../../../lib/db/schema/crm';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { eq, desc } from 'drizzle-orm';
import { requirePermission } from '../../../lib/auth/authorization';

const _env = env as any;
const auth = getAuth(_env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session) return Astro.redirect('/login');
requirePermission(session.user.role as any, 'finance', 'read');

const db = getDb(_env.DB);
const items = await db.select({
  id: quotations.id,
  num: quotations.quotationNumber,
  status: quotations.status,
  total: quotations.total,
  clientName: clients.name
}).from(quotations).leftJoin(clients, eq(quotations.clientId, clients.id)).orderBy(desc(quotations.createdAt));
---
<AdminLayout title="Quotations" user={session.user as any}>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Quotations</h1>
    <div class="bg-white rounded border overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr><th>Number</th><th>Client</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody class="divide-y">
          {items.map((i: any) => (
            <tr>
              <td class="p-4">{i.num}</td><td class="p-4">{i.clientName}</td>
              <td class="p-4">{(i.total / 100).toFixed(2)}</td><td class="p-4">{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
`);

fs.writeFileSync(path.join(outDir2, 'index.astro'), `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { getDb } from '../../../lib/db';
import { invoices } from '../../../lib/db/schema/billing';
import { clients } from '../../../lib/db/schema/crm';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { eq, desc } from 'drizzle-orm';
import { requirePermission } from '../../../lib/auth/authorization';

const _env = env as any;
const auth = getAuth(_env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session) return Astro.redirect('/login');
requirePermission(session.user.role as any, 'finance', 'read');

const db = getDb(_env.DB);
const items = await db.select({
  id: invoices.id,
  num: invoices.invoiceNumber,
  status: invoices.status,
  total: invoices.total,
  due: invoices.balanceDue,
  clientName: clients.name
}).from(invoices).leftJoin(clients, eq(invoices.clientId, clients.id)).orderBy(desc(invoices.createdAt));
---
<AdminLayout title="Invoices" user={session.user as any}>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Invoices</h1>
    <div class="bg-white rounded border overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr><th>Number</th><th>Client</th><th>Total</th><th>Due</th><th>Status</th></tr>
        </thead>
        <tbody class="divide-y">
          {items.map((i: any) => (
            <tr>
              <td class="p-4">{i.num}</td><td class="p-4">{i.clientName}</td>
              <td class="p-4">{(i.total / 100).toFixed(2)}</td>
              <td class="p-4">{(i.due / 100).toFixed(2)}</td>
              <td class="p-4">{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
`);

fs.writeFileSync(path.join(outDir3, 'index.astro'), `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { getDb } from '../../../lib/db';
import { payments, invoices } from '../../../lib/db/schema/billing';
import { clients } from '../../../lib/db/schema/crm';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { eq, desc } from 'drizzle-orm';
import { requirePermission } from '../../../lib/auth/authorization';

const _env = env as any;
const auth = getAuth(_env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session) return Astro.redirect('/login');
requirePermission(session.user.role as any, 'finance', 'read');

const db = getDb(_env.DB);
const items = await db.select({
  id: payments.id,
  amount: payments.amount,
  status: payments.status,
  invoiceNum: invoices.invoiceNumber,
  clientName: clients.name
}).from(payments)
  .leftJoin(invoices, eq(payments.invoiceId, invoices.id))
  .leftJoin(clients, eq(payments.clientId, clients.id))
  .orderBy(desc(payments.createdAt));
---
<AdminLayout title="Payments" user={session.user as any}>
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Payments</h1>
    <div class="bg-white rounded border overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-slate-50 border-b">
          <tr><th>Client</th><th>Invoice</th><th>Amount</th><th>Status</th></tr>
        </thead>
        <tbody class="divide-y">
          {items.map((i: any) => (
            <tr>
              <td class="p-4">{i.clientName}</td><td class="p-4">{i.invoiceNum}</td>
              <td class="p-4">{(i.amount / 100).toFixed(2)}</td>
              <td class="p-4">{i.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
`);
console.log('Finance endpoints generated.');
