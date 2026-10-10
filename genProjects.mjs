import fs from 'fs';
import path from 'path';

const outDir = './src/pages/admin/projects';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// INDEX
fs.writeFileSync(path.join(outDir, 'index.astro'), `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { db } from '../../../lib/db';
import { projects, clients } from '../../../lib/db/schema';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { desc, eq } from 'drizzle-orm';
import AdminIcon from '../../../components/admin/AdminIcon.astro';

const auth = getAuth(env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session || !['super_admin', 'admin', 'finance', 'support'].includes(session.user.role)) {
  return Astro.redirect('/admin/access-denied');
}

const allProjects = await db.select({
  id: projects.id,
  name: projects.name,
  projectCode: projects.projectCode,
  status: projects.status,
  priority: projects.priority,
  progress: projects.progressPercentage,
  clientName: clients.name
}).from(projects).leftJoin(clients, eq(projects.clientId, clients.id)).orderBy(desc(projects.createdAt));
---
<AdminLayout title="Projects" user={session.user}>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-[#242a56]">Projects</h1>
      <a href="/admin/projects/new" class="px-4 py-2 bg-[#242a56] text-white rounded-lg hover:bg-[#1a1e3e]">New Project</a>
    </div>
    
    <div class="bg-white rounded-xl shadow-sm border border-[#e2e8f0] overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-[#f8fafc] border-b">
          <tr>
            <th class="px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Project</th>
            <th class="px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Client</th>
            <th class="px-6 py-4 text-xs font-bold text-[#64748b] uppercase">Status / Progress</th>
            <th class="px-6 py-4 text-right"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e2e8f0]">
          {allProjects.map(p => (
            <tr class="hover:bg-[#f8fafc]">
              <td class="px-6 py-4">
                <div class="font-bold text-[#242a56]">{p.name}</div>
                {p.projectCode && <div class="text-xs text-slate-500">{p.projectCode}</div>}
              </td>
              <td class="px-6 py-4 text-sm">{p.clientName}</td>
              <td class="px-6 py-4 text-sm">
                <span class="inline-block px-2 py-1 rounded text-xs bg-slate-100">{p.status}</span>
                <span class="ml-2 text-xs text-slate-500">{p.progress}%</span>
              </td>
              <td class="px-6 py-4 text-right">
                <a href={\`/admin/projects/\${p.id}\`} class="text-[#6878d6] hover:underline text-sm font-medium">Manage</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</AdminLayout>
`);

// NEW
fs.writeFileSync(path.join(outDir, 'new.astro'), `---
import AdminLayout from '../../../layouts/AdminLayout.astro';
import { db } from '../../../lib/db';
import { projects, clients, user } from '../../../lib/db/schema';
import { getAuth } from '../../../lib/auth';
import { env } from 'cloudflare:workers';
import { crypto } from '@cloudflare/workers-types'; // Or standard web crypto
import { eq } from 'drizzle-orm';
import { requirePermission } from '../../../lib/auth/authorization';

const _env = env as any;
const auth = getAuth(_env);
const session = await auth.api.getSession({ headers: Astro.request.headers });
if (!session) return Astro.redirect('/login');
requirePermission(session.user.role as any, 'projects', 'create');

let error = '';

if (Astro.request.method === 'POST') {
  try {
    const data = await Astro.request.formData();
    const name = data.get('name')?.toString();
    const clientId = data.get('clientId')?.toString();
    const status = data.get('status')?.toString() || 'planning';
    
    if (!name || !clientId) {
      error = 'Name and Client are required.';
    } else {
      // Validate client
      const clientCheck = await db.select().from(clients).where(eq(clients.id, clientId)).limit(1);
      if (!clientCheck.length) {
         error = 'Invalid client selected.';
      } else {
         const newId = crypto.randomUUID();
         await db.insert(projects).values({
           id: newId,
           name,
           clientId,
           projectCode: data.get('projectCode')?.toString() || null,
           description: data.get('description')?.toString() || null,
           status: status as any,
           priority: (data.get('priority')?.toString() || 'medium') as any,
           budget: parseInt(data.get('budget')?.toString() || '0') * 100, // minor units
         });
         return Astro.redirect(\`/admin/projects/\${newId}\`);
      }
    }
  } catch (err: any) {
    error = err.message || 'Error creating project';
  }
}

const allClients = await db.select({ id: clients.id, name: clients.name }).from(clients);
---
<AdminLayout title="New Project" user={session.user}>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">New Project</h1>
    {error && <div class="mb-4 p-4 bg-red-50 text-red-600 rounded">{error}</div>}
    
    <form method="POST" class="bg-white p-6 rounded-xl shadow-sm border space-y-4">
      <div>
        <label class="block text-sm font-bold mb-1">Project Name *</label>
        <input type="text" name="name" required class="w-full px-3 py-2 border rounded" />
      </div>
      <div>
        <label class="block text-sm font-bold mb-1">Client *</label>
        <select name="clientId" required class="w-full px-3 py-2 border rounded">
          {allClients.map(c => <option value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-bold mb-1">Project Code</label>
          <input type="text" name="projectCode" class="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm font-bold mb-1">Status</label>
          <select name="status" class="w-full px-3 py-2 border rounded">
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>
      </div>
      <div>
        <button type="submit" class="px-4 py-2 bg-[#242a56] text-white rounded mt-4">Create Project</button>
      </div>
    </form>
  </div>
</AdminLayout>
`);

console.log('Project templates written.');
