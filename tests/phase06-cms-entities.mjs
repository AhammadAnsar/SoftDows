import test from 'node:test';
import assert from 'node:assert';
import { getDb } from '../src/lib/db/index.js';
import { services } from '../src/lib/db/schema/agency.js';
import { softwareProducts, ventures, teamMembers } from '../src/lib/db/schema/cms.js';
import { eq } from 'drizzle-orm';
import { Miniflare } from 'miniflare';
import path from 'path';

test('Phase 06 - Canonical Entities Exist in D1', async (t) => {
  const db = getDb(process.env.DB);
  
  await t.test('All 8 canonical Services exist', async () => {
    const requiredSlugs = [
      'website-design-development',
      'custom-software-web-applications',
      'ecommerce-development',
      'ui-ux-design',
      'seo-digital-visibility',
      'website-maintenance-support',
      'domain-registration-management',
      'managed-web-hosting'
    ];
    
    for (const slug of requiredSlugs) {
      const found = await db.select().from(services).where(eq(services.slug, slug)).get();
      assert.ok(found, `Missing required Service: ${slug}`);
    }
  });

  await t.test('All 6 canonical Software Products exist', async () => {
    const requiredSlugs = [
      'biddalok', 'eduweb', 'smarttutor', 'mymosque', 'experthunter', 'easywebdev'
    ];
    for (const slug of requiredSlugs) {
      const found = await db.select().from(softwareProducts).where(eq(softwareProducts.slug, slug)).get();
      assert.ok(found, `Missing required Product: ${slug}`);
    }
  });

  await t.test('All 5 canonical Ventures exist', async () => {
    const requiredSlugs = [
      'banglanotice', 'bidyashikhi', 'nicetrix', 'gulfhive', 'baharimart'
    ];
    for (const slug of requiredSlugs) {
      const found = await db.select().from(ventures).where(eq(ventures.slug, slug)).get();
      assert.ok(found, `Missing required Venture: ${slug}`);
      
      if (slug === 'gulfhive') {
        assert.strictEqual(found.externalUrl, null, 'GulfHive must have externalUrl unset/unlinked');
      }
    }
  });

  await t.test('Founder Ansar Ahammad exists as canonical Team record', async () => {
    const found = await db.select().from(teamMembers).where(eq(teamMembers.slug, 'ansar-ahammad')).get();
    assert.ok(found, 'Missing Founder record: ansar-ahammad');
    assert.strictEqual(found.role, 'Founder');
  });
});
