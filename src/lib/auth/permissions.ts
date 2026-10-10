import { createAccessControl } from 'better-auth/plugins/access';

// Define all business resources and their possible actions
const customStatements = {
  // Built-in Better Auth admin statements required for admin plugin
  user: ['create', 'update', 'delete', 'setRole', 'ban', 'impersonate'],
  session: ['revoke'],
  
  // Custom Business Resources
  dashboard: ['read'],
  content: ['read', 'create', 'update', 'delete', 'publish', 'archive'],
  services: ['read', 'create', 'update', 'delete', 'publish'],
  case_studies: ['read', 'create', 'update', 'delete', 'publish'],
  insights: ['read', 'create', 'update', 'delete', 'publish'],
  media: ['read', 'create', 'delete'],
  
  // Agency / CRM Resources
  leads: ['read', 'create', 'update', 'delete'],
  clients: ['read', 'create', 'update', 'delete', 'manage_access'],
  projects: ['read', 'create', 'update', 'delete'],
  
  // Finance Resources
  quotations: ['read', 'create', 'update', 'issue', 'delete'],
  invoices: ['read', 'create', 'update', 'issue', 'delete'],
  payments: ['read', 'record'],
  
  // General
  files: ['read', 'create', 'delete'],
  support: ['read', 'create', 'update', 'resolve'],
  settings: ['read', 'update'],
  audit_logs: ['read'],
};

export const ac = createAccessControl(customStatements);

/**
 * 1. SUPER ADMIN
 * Full staff-level platform authority.
 */
const superAdmin = ac.newRole({
  user: ['all'],
  session: ['all'],
  dashboard: ['all'],
  content: ['all'],
  services: ['all'],
  case_studies: ['all'],
  insights: ['all'],
  media: ['all'],
  leads: ['all'],
  clients: ['all'],
  projects: ['all'],
  quotations: ['all'],
  invoices: ['all'],
  payments: ['all'],
  files: ['all'],
  support: ['all'],
  settings: ['all'],
  audit_logs: ['all'],
});

/**
 * 2. ADMIN
 * General agency manager.
 * Cannot manage other admins or super_admins (enforced in helpers/API),
 * but has standard user management.
 */
const admin = ac.newRole({
  user: ['create', 'update', 'delete', 'setRole'], // Business rules will restrict promoting to super_admin
  session: ['revoke'],
  dashboard: ['read'],
  content: ['all'],
  services: ['all'],
  case_studies: ['all'],
  insights: ['all'],
  media: ['all'],
  leads: ['all'],
  clients: ['all'],
  projects: ['all'],
  quotations: ['all'],
  invoices: ['all'],
  payments: ['all'],
  files: ['all'],
  support: ['all'],
  // No settings or audit_logs access
});

/**
 * 3. CONTENT EDITOR
 * Content-focused staff.
 */
const contentEditor = ac.newRole({
  dashboard: ['read'],
  content: ['all'],
  services: ['all'],
  case_studies: ['all'],
  insights: ['all'],
  media: ['all'],
  files: ['read', 'create'],
});

/**
 * 4. FINANCE
 * Finance-focused staff.
 */
const finance = ac.newRole({
  dashboard: ['read'],
  clients: ['read'],
  projects: ['read'],
  quotations: ['all'],
  invoices: ['all'],
  payments: ['all'],
  files: ['read'],
});

/**
 * 5. SUPPORT
 * Support-focused staff.
 */
const support = ac.newRole({
  dashboard: ['read'],
  clients: ['read'],
  projects: ['read'],
  support: ['all'],
  files: ['read', 'create'],
});

/**
 * 6. CLIENT
 * Client Portal user.
 * Restricted strictly to their own data via Server-Side Client Context resolution.
 */
const client = ac.newRole({
  // Clients have NO administrative user management powers.
  // Permitted actions only apply to their owned records.
  projects: ['read'],
  quotations: ['read'],
  invoices: ['read'],
  support: ['read', 'create', 'update'],
  files: ['read', 'create'],
});

export const roles = {
  super_admin: superAdmin,
  admin: admin,
  content_editor: contentEditor,
  finance: finance,
  support: support,
  client: client,
} as const;

export type AppRole = keyof typeof roles;
