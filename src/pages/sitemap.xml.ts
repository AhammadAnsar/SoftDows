import { getPublishedVentures } from '../lib/content/ventures';
import { getPublishedProducts } from '../lib/content/products';
import { getCollection } from 'astro:content';

const BASE_URL = 'https://softdows.com';

export const prerender = true;
export async function GET() {
  const publishedVentures = getPublishedVentures();
  const allProducts = getPublishedProducts();
  const allWork = await getCollection('work');
  const allInsights = await getCollection('insights');

  const staticPages = [
    '',
    '/about',
    '/contact',
    '/services',
    '/services/custom-software-web-applications',
    '/services/website-design-development',
    '/services/ecommerce-development',
    '/services/ui-ux-design',
    '/services/seo-digital-visibility',
    '/services/website-maintenance-support',
    '/services/domain-registration-management',
    '/services/business-email-cloud-hosting',
    '/products',
    '/ventures',
    '/work',
    '/insights',
    '/team',
    '/privacy',
    '/terms',
    '/legal-disclaimer'
  ];

  const dynamicUrls = [
    ...publishedVentures.map((v: any) => `/ventures/${v.id}`),
    ...allProducts.map((p: any) => `/products/${p.id}`),
    ...allWork.filter((w: any) => !w.data.isDraft).map((w: any) => `/work/${w.id}`),
    ...allInsights.filter((i: any) => !i.data.isDraft).map((i: any) => `/insights/${i.id}`)
  ];

  const allUrls = [...staticPages, ...dynamicUrls];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls.map(url => `
  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${url === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${url === '' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
