import { getDb } from '../db';
import { leads, clients } from '../db/schema/crm';
import { projects } from '../db/schema/agency';
import { invoices } from '../db/schema/billing';
import { supportTickets } from '../db/schema/support';
import { eq, inArray, sql } from 'drizzle-orm';

export type DashboardMetrics = {
  newLeads: number;
  activeClients: number;
  activeProjects: number;
  unpaidInvoices: number;
  openSupportTickets: number;
};

export async function getDashboardMetrics(env: any): Promise<DashboardMetrics> {
  const db = getDb(env.DB);

  // Run counts concurrently for performance
  const [
    leadsCount,
    clientsCount,
    projectsCount,
    invoicesCount,
    ticketsCount
  ] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(leads).where(eq(leads.status, 'new')),
    db.select({ count: sql<number>`count(*)` }).from(clients).where(eq(clients.status, 'active')),
    db.select({ count: sql<number>`count(*)` }).from(projects).where(eq(projects.status, 'active')),
    db.select({ count: sql<number>`count(*)` }).from(invoices).where(inArray(invoices.status, ['issued', 'partially_paid', 'overdue'])),
    db.select({ count: sql<number>`count(*)` }).from(supportTickets).where(inArray(supportTickets.status, ['open', 'in_progress', 'waiting_for_client']))
  ]);

  return {
    newLeads: Number(leadsCount[0]?.count || 0),
    activeClients: Number(clientsCount[0]?.count || 0),
    activeProjects: Number(projectsCount[0]?.count || 0),
    unpaidInvoices: Number(invoicesCount[0]?.count || 0),
    openSupportTickets: Number(ticketsCount[0]?.count || 0),
  };
}
