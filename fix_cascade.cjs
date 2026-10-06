const fs = require('fs');

function fixDeleteClient(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  const search = `    if (action === 'delete_client') {
      await db.delete(clients).where(eq(clients.id, id as string));
      return Astro.redirect('/admin/clients');
    }`;
  
  const replace = `    if (action === 'delete_client') {
      // Manual cascade delete because of 'restrict' constraints in schema
      await db.delete(clientContacts).where(eq(clientContacts.clientId, id as string));
      await db.delete(payments).where(eq(payments.clientId, id as string));
      await db.delete(invoiceItems).where(
        inArray(invoiceItems.invoiceId, db.select({ id: invoices.id }).from(invoices).where(eq(invoices.clientId, id as string)))
      );
      await db.delete(invoices).where(eq(invoices.clientId, id as string));
      await db.delete(quotationItems).where(
        inArray(quotationItems.quotationId, db.select({ id: quotations.id }).from(quotations).where(eq(quotations.clientId, id as string)))
      );
      await db.delete(quotations).where(eq(quotations.clientId, id as string));
      await db.delete(projects).where(eq(projects.clientId, id as string));
      await db.update(leads).set({ convertedClientId: null as any }).where(eq(leads.convertedClientId, id as string));
      
      await db.delete(clients).where(eq(clients.id, id as string));
      return Astro.redirect('/admin/clients');
    }`;

  if (c.includes(search)) {
    c = c.replace(search, replace);
    c = c.replace(`import { eq, desc } from 'drizzle-orm';`, `import { eq, desc, inArray } from 'drizzle-orm';`);
    c = c.replace(`import { invoices, quotations, payments } from '../../../../lib/db/schema/billing';`, `import { invoices, invoiceItems, quotations, quotationItems, payments } from '../../../../lib/db/schema/billing';`);
    fs.writeFileSync(filePath, c);
  }
}

function fixDeleteProject(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  const search = `    if (action === 'delete_project') {
      await db.delete(projects).where(eq(projects.id, id as string));
      return Astro.redirect('/admin/projects');
    }`;
  
  const replace = `    if (action === 'delete_project') {
      // Unlink invoices and quotations
      await db.update(invoices).set({ projectId: null as any }).where(eq(invoices.projectId, id as string));
      await db.update(quotations).set({ projectId: null as any }).where(eq(quotations.projectId, id as string));
      await db.delete(projects).where(eq(projects.id, id as string));
      return Astro.redirect('/admin/projects');
    }`;

  if (c.includes(search)) {
    c = c.replace(search, replace);
    c = c.replace(`import { projects, projectMilestones, projectMembers, projectUpdates } from '../../../../lib/db/schema/agency';`, `import { projects, projectMilestones, projectMembers, projectUpdates } from '../../../../lib/db/schema/agency';\nimport { invoices, quotations } from '../../../../lib/db/schema/billing';`);
    fs.writeFileSync(filePath, c);
  }
}

function fixDeleteLead(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  const search = `    if (action === 'delete_lead') {
      await db.delete(leads).where(eq(leads.id, id as string));
      return Astro.redirect('/admin/leads');
    }`;
  
  const replace = `    if (action === 'delete_lead') {
      // Unlink projects and quotations
      await db.update(projects).set({ leadId: null as any }).where(eq(projects.leadId, id as string));
      await db.update(quotations).set({ leadId: null as any }).where(eq(quotations.leadId, id as string));
      await db.delete(leads).where(eq(leads.id, id as string));
      return Astro.redirect('/admin/leads');
    }`;

  if (c.includes(search)) {
    c = c.replace(search, replace);
    c = c.replace(`import { leads } from '../../../../lib/db/schema/crm';`, `import { leads } from '../../../../lib/db/schema/crm';\nimport { projects } from '../../../../lib/db/schema/agency';\nimport { quotations } from '../../../../lib/db/schema/billing';`);
    fs.writeFileSync(filePath, c);
  }
}

fixDeleteClient('src/pages/admin/clients/[id]/index.astro');
fixDeleteProject('src/pages/admin/projects/[id]/index.astro');
fixDeleteLead('src/pages/admin/leads/[id]/index.astro');

