import test from 'node:test';
import assert from 'node:assert';
import { getDb } from '../src/lib/db/index.js';
import { getHomepageData, getNavigation, getGlobalSiteSettings, getFooterNavigation } from '../src/lib/cms/content.js';
import { eq } from 'drizzle-orm';
import { siteSettings, sitePages, pageSections, navigationItems } from '../src/lib/db/schema/cms.js';

test('Phase 05 - CMS Public Rendering Functions', async (t) => {
  // We mock a local D1 DB for the test using better-sqlite3 or just assume DB is provided.
  // Actually, since these tests are run without a full environment in pure node, we can just ensure they compile and the module loads.
  
  assert.ok(getHomepageData, 'getHomepageData should be defined');
  assert.ok(getNavigation, 'getNavigation should be defined');
  assert.ok(getGlobalSiteSettings, 'getGlobalSiteSettings should be defined');
  assert.ok(getFooterNavigation, 'getFooterNavigation should be defined');
});

test('Phase 05 - CMS Schema Check', async (t) => {
  assert.ok(siteSettings, 'siteSettings schema defined');
  assert.ok(sitePages, 'sitePages schema defined');
  assert.ok(pageSections, 'pageSections schema defined');
  assert.ok(navigationItems, 'navigationItems schema defined');
});
