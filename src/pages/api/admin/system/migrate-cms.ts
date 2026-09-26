import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getAuth } from '../../../../lib/auth';
import { requirePermission } from '../../../../lib/auth/authorization';
import { getDb } from '../../../../lib/db';
import { siteSettings, sitePages, pageSections, navigationItems } from '../../../../lib/db/schema/cms';
import { homeContent } from '../../../../lib/content/home';
import { eq } from 'drizzle-orm';

export const POST: APIRoute = async ({ request, locals }) => {
  const _env = (locals as any).runtime?.env || (globalThis as any).process?.env || env as any;
  const auth = getAuth(_env);
  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) return new Response('Unauthorized', { status: 401 });
  if (!requirePermission(session.user.role as any, 'content', 'update')) {
    return new Response('Forbidden', { status: 403 });
  }

  const db = getDb(_env.DB);

  // 1. Migrate Site Settings
  const defaultSettings = [
    { key: 'site_title', value: homeContent.seo.title, description: 'Default SEO Title' },
    { key: 'site_description', value: homeContent.seo.description, description: 'Default SEO Description' },
    { key: 'contact_email', value: 'hello@softdows.com', description: 'Primary Contact Email' },
    { key: 'contact_phone', value: '+8801700000000', description: 'Primary Contact Phone' },
    { key: 'footer_copyright', value: '© 2026 SoftDows. All rights reserved.', description: 'Footer Copyright' }
  ];

  for (const s of defaultSettings) {
    const exists = await db.select().from(siteSettings).where(eq(siteSettings.key, s.key)).get();
    if (!exists) {
      await db.insert(siteSettings).values({ id: crypto.randomUUID().replace(/-/g, ''), ...s });
    }
  }

  // 2. Migrate Homepage
  let homePage = await db.select().from(sitePages).where(eq(sitePages.slug, '/')).get();
  if (!homePage) {
    const pageId = crypto.randomUUID().replace(/-/g, '');
    await db.insert(sitePages).values({
      id: pageId,
      slug: '/',
      title: 'Homepage',
      seoTitle: homeContent.seo.title,
      seoDescription: homeContent.seo.description,
      status: 'published'
    });
    homePage = await db.select().from(sitePages).where(eq(sitePages.slug, '/')).get();
  }

  if (homePage) {
    // We only insert sections if they don't exist
    const insertSection = async (identifier: string, data: any) => {
      const exists = await db.select().from(pageSections)
        .where(eq(pageSections.sectionIdentifier, identifier)) // Need to add pageId filter ideally, but we assume unique across homepage
        .get();
      if (!exists) {
        await db.insert(pageSections).values({
          id: crypto.randomUUID().replace(/-/g, ''),
          pageId: homePage!.id,
          sectionIdentifier: identifier,
          ...data
        });
      }
    };

    // Hero
    await insertSection('hero', {
      heading: homeContent.hero.heading,
      subheading: homeContent.hero.eyebrow,
      content: homeContent.hero.description,
      ctaText: homeContent.hero.primaryCta.label,
      ctaLink: homeContent.hero.primaryCta.url,
      displayOrder: 1,
      structuredData: { secondaryCta: homeContent.hero.secondaryCta }
    });

    // Services Preview
    await insertSection('services', {
      heading: homeContent.services.heading,
      content: homeContent.services.description,
      displayOrder: 2,
      // The items are now entity references. We will just leave them empty for now in structuredData and let them render from canonical sources.
      // But we can store the raw items temporarily as fallback if canonical isn't linked yet.
      structuredData: { items: homeContent.services.items }
    });

    // Why SoftDows / Ecosystem
    await insertSection('ecosystem', {
      heading: homeContent.whySoftDows.heading,
      content: homeContent.whySoftDows.description,
      displayOrder: 3,
      structuredData: { 
        features: homeContent.whySoftDows.features,
        capabilityApproach: homeContent.whySoftDows.capabilityApproach
      }
    });

    // Products Preview (no direct section in home.ts except the static ones in Astro, but we can create a section)
    await insertSection('products', {
      heading: 'Products',
      displayOrder: 4,
      structuredData: {} // Will load featured products from canonical records
    });

    // Ventures Preview
    await insertSection('ventures', {
      heading: 'Ventures',
      content: 'SoftDows actively builds and operates internal platforms and brands addressing regional audiences.',
      displayOrder: 5,
      structuredData: {} // Will load featured ventures from canonical records
    });

    // Process
    await insertSection('process', {
      heading: homeContent.process.heading,
      content: homeContent.process.description,
      displayOrder: 6,
      structuredData: { steps: homeContent.process.steps }
    });

    // Team
    await insertSection('team', {
      heading: 'The Team Behind SoftDows',
      content: 'Meet the people and specialists engineering our solutions.',
      ctaText: 'Meet the Team',
      ctaLink: '/team/',
      displayOrder: 7,
      structuredData: {} // Will load featured team members from canonical
    });

    // Final CTA
    await insertSection('final_cta', {
      heading: homeContent.finalCta.heading,
      content: homeContent.finalCta.description,
      ctaText: homeContent.finalCta.primaryCta.label,
      ctaLink: homeContent.finalCta.primaryCta.url,
      displayOrder: 8,
      structuredData: { secondaryCta: homeContent.finalCta.secondaryCta }
    });
  }

  // 3. Migrate Navigation Items (if none exist)
  const navCount = await db.select().from(navigationItems).all();
  if (navCount.length === 0) {
    const navs = [
      { label: 'Home', customUrl: '/', groupKey: 'header', displayOrder: 1 },
      { label: 'Services', customUrl: '/services/', groupKey: 'header', displayOrder: 2 },
      { label: 'Products', customUrl: '/products/', groupKey: 'header', displayOrder: 3 },
      { label: 'Ventures', customUrl: '/ventures/', groupKey: 'header', displayOrder: 4 },
      { label: 'Company', customUrl: '/about/', groupKey: 'header', displayOrder: 5 }
    ];

    for (const n of navs) {
      await db.insert(navigationItems).values({
        id: crypto.randomUUID().replace(/-/g, ''),
        ...n
      });
    }
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
};
