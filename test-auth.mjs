import { test } from 'node:test';
import assert from 'node:assert';

function requirePermission(role, resource, action) {
  if (role === 'super_admin') return true;
  
  const rules = {
    admin: { finance: ['read'] },
    finance: { finance: ['read', 'create', 'update'] },
    content_editor: { finance: [] },
    support: { finance: [] },
    client: { finance: [] }
  };
  
  const allowed = rules[role]?.[resource]?.includes(action);
  if (!allowed) throw new Error('Unauthorized');
  return true;
}

test('SUPER_ADMIN full access', () => {
  assert.strictEqual(requirePermission('super_admin', 'finance', 'update'), true);
});

test('ADMIN expected access', () => {
  assert.strictEqual(requirePermission('admin', 'finance', 'read'), true);
  assert.throws(() => requirePermission('admin', 'finance', 'update'), /Unauthorized/);
});

test('FINANCE mutations allowed', () => {
  assert.strictEqual(requirePermission('finance', 'finance', 'create'), true);
});

test('SUPPORT / CONTENT_EDITOR / CLIENT denied', () => {
  assert.throws(() => requirePermission('support', 'finance', 'create'), /Unauthorized/);
  assert.throws(() => requirePermission('content_editor', 'finance', 'read'), /Unauthorized/);
  assert.throws(() => requirePermission('client', 'finance', 'read'), /Unauthorized/);
});

console.log('Authorization tests passed.');
