import fs from 'fs';
import path from 'path';

const assert = (condition, message) => {
  if (!condition) {
    console.error(`? INTEGRITY TEST FAILED: ${message}`);
    process.exit(1);
  }
};

const readTsFile = (filepath) => {
  return fs.readFileSync(path.resolve(process.cwd(), filepath), 'utf8');
};

console.log('--- RUNNING ECOSYSTEM INTEGRITY VERIFICATION ---');

// 1. Verify 6 Software Products
const productsTs = readTsFile('src/lib/content/products.ts');
const requiredProducts = ['biddalok', 'eduweb', 'smarttutor', 'mymosque', 'experthunter', 'easywebdev'];
requiredProducts.forEach(product => {
  assert(productsTs.includes(`slug: '${product}'`), `Software Product '${product}' is missing from products.ts`);
});

// 2. Verify 8 Services
const servicesTs = readTsFile('src/lib/content/service-details.ts');
const requiredServices = [
  'website-design-development', 'custom-software-web-applications', 'ecommerce-development',
  'ui-ux-design', 'seo-digital-visibility', 'website-maintenance-support',
  'domain-registration-management', 'managed-web-hosting'
];
requiredServices.forEach(service => {
  assert(servicesTs.includes(`'${service}': {`), `Service '${service}' is missing from service-details.ts`);
  const astroFile = path.resolve(process.cwd(), `src/pages/services/${service}.astro`);
  assert(fs.existsSync(astroFile), `Service Astro page missing: ${astroFile}`);
});

// 3. Verify 5 Ventures
const venturesTs = readTsFile('src/lib/content/ventures.ts');
const requiredVentures = ['banglanotice', 'bidyashikhi', 'nicetrix', 'gulfhive', 'baharimart'];
requiredVentures.forEach(venture => {
  assert(venturesTs.includes(`slug: '${venture}'`), `Venture '${venture}' is missing from ventures.ts`);
});

// 4. Verify Navigation entries
const navTs = readTsFile('src/config/navigation.ts');
const requiredNav = [...requiredProducts, ...requiredServices, 'banglanotice', 'bidyashikhi', 'nicetrix', 'baharimart'];
requiredNav.forEach(slug => {
  // Gulfhive is hidden, so skip it from nav check
  if (slug === 'gulfhive') return;
  assert(navTs.includes(`${slug}`), `Slug '${slug}' is missing from navigation.ts mega menu.`);
});

console.log('? INTEGRITY TEST PASSED: All Software Products, Services, and Ventures are present.');
