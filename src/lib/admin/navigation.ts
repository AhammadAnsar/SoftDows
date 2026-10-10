import type { AppRole } from '../auth/permissions';
import { requirePermission } from '../auth/authorization';
import { ac } from '../auth/permissions';

export type NavItem = {
  label: string;
  href: string;
  icon: string; // SVG string or identifier
  resource?: keyof typeof ac.statements;
  action?: string;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const adminNavigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: 'dashboard', resource: 'dashboard', action: 'read' },
    ]
  },
  {
    label: 'Business',
    items: [
      { label: 'Leads', href: '/admin/leads', icon: 'users', resource: 'leads', action: 'read' },
      { label: 'Clients', href: '/admin/clients', icon: 'briefcase', resource: 'clients', action: 'read' },
      { label: 'Projects', href: '/admin/projects', icon: 'folder', resource: 'projects', action: 'read' },
    ]
  },
  {
    label: 'Finance',
    items: [
      { label: 'Quotations', href: '/admin/quotations', icon: 'file-text', resource: 'quotations', action: 'read' },
      { label: 'Invoices', href: '/admin/invoices', icon: 'receipt', resource: 'invoices', action: 'read' },
      { label: 'Payments', href: '/admin/payments', icon: 'credit-card', resource: 'payments', action: 'read' },
    ]
  },
  {
    label: 'Support',
    items: [
      { label: 'Tickets', href: '/admin/support', icon: 'life-buoy', resource: 'support', action: 'read' },
    ]
  },
  {
    label: 'Administration',
    items: [
      { label: 'Users & Staff', href: '/admin/users', icon: 'shield', resource: 'user', action: 'setRole' },
      { label: 'Settings', href: '/admin/settings', icon: 'settings', resource: 'settings', action: 'read' },
      { label: 'Audit Log', href: '/admin/audit', icon: 'activity', resource: 'audit_logs', action: 'read' },
    ]
  }
];

export function getAuthorizedNavigation(role: AppRole): NavGroup[] {
  return adminNavigation.map(group => {
    return {
      ...group,
      items: group.items.filter(item => {
        if (!item.resource || !item.action) return true;
        return requirePermission(role, item.resource, item.action);
      })
    };
  }).filter(group => group.items.length > 0);
}

