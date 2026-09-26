import { getDb } from '../db';
import { siteSettings, sitePages, pageSections, navigationItems } from '../db/schema/cms';
import { eq, and } from 'drizzle-orm';

export async function getGlobalSiteSettings(db: any) {
  const settings = await db.select().from(siteSettings).all();
  const map: Record<string, string> = {};
  for (const s of settings) {
    map[s.key] = s.value;
  }
  return map;
}

export async function getHomepageData(db: any) {
  const homePage = await db.select().from(sitePages).where(eq(sitePages.slug, '/')).get();
  if (!homePage) return null;

  const sections = await db.select().from(pageSections)
    .where(and(eq(pageSections.pageId, homePage.id), eq(pageSections.isEnabled, true)))
    .orderBy(pageSections.displayOrder)
    .all();

  const sectionMap: Record<string, any> = {};
  for (const s of sections) {
    sectionMap[s.sectionIdentifier] = {
      heading: s.heading,
      subheading: s.subheading,
      content: s.content,
      ctaText: s.ctaText,
      ctaLink: s.ctaLink,
      structuredData: s.structuredData
    };
  }

  return {
    seoTitle: homePage.seoTitle,
    seoDescription: homePage.seoDescription,
    sections: sectionMap
  };
}

export async function getNavigation(db: any, groupKey: string = 'header') {
  const items = await db.select().from(navigationItems)
    .where(and(eq(navigationItems.groupKey, groupKey), eq(navigationItems.isEnabled, true)))
    .orderBy(navigationItems.displayOrder)
    .all();
    
  if (items.length === 0) return null;

  // Build hierarchy
  const roots = items.filter((i: any) => !i.parentId);
  
  return roots.map((root: any) => {
    // Check if it has groups (children of root)
    const groups = items.filter((i: any) => i.parentId === root.id);
    
    if (groups.length === 0) {
      return { label: root.label, href: root.customUrl };
    }

    const children = groups.map((g: any) => {
      // Find items in this group
      const leafItems = items.filter((i: any) => i.parentId === g.id);
      return {
        group: g.label,
        items: leafItems.map((leaf: any) => ({ label: leaf.label, href: leaf.customUrl }))
      };
    });

    return {
      label: root.label,
      href: root.customUrl,
      children
    };
  });
}

export async function getFooterNavigation(db: any) {
  const items = await db.select().from(navigationItems)
    .where(and(eq(navigationItems.groupKey, 'footer'), eq(navigationItems.isEnabled, true)))
    .orderBy(navigationItems.displayOrder)
    .all();

  if (items.length === 0) return null;

  const roots = items.filter((i: any) => !i.parentId);
  const footerNav: Record<string, any[]> = {};
  
  for (const r of roots) {
    const children = items.filter((i: any) => i.parentId === r.id);
    footerNav[r.label.toLowerCase()] = children.map((c: any) => ({
      label: c.label,
      href: c.customUrl
    }));
  }
  
  return footerNav;
}
