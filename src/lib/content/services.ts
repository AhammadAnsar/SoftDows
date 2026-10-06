export const serviceGroups = [
  {
    groupTitle: 'Core Development & Systems',
    groupSubtitle: 'Robust digital platforms engineered for everyday operational reliability.',
    items: [
      {
        slug: 'custom-software-web-applications',
        title: 'Custom Software & Web Apps',
        desc: 'Bespoke web applications built around your exact operations. Centralize data, automate workflows, and eliminate recurring per-seat SaaS taxes.',
        tags: ['Private Database', 'Automated Workflows', 'No Seat Fees'],
        themeColor: 'from-blue-600 to-indigo-600',
        badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
        iconType: 'code'
      },
      {
        slug: 'website-design-development',
        title: 'Website Design & Development',
        desc: 'Ultra-fast, mobile-first brand websites that turn visitors into paying clients. Built on modern edge architecture that loads in milliseconds.',
        tags: ['< 800ms FCP', 'Core Web Vitals 100', 'Mobile Viewport'],
        themeColor: 'from-cyan-600 to-blue-600',
        badgeColor: 'bg-sky-50 text-sky-700 border-sky-200/80',
        iconType: 'web'
      },
      {
        slug: 'ecommerce-development',
        title: 'eCommerce Systems & Stores',
        desc: 'Frictionless checkout with real-time stock sync. Automated bKash, Nagad, and credit card payments designed for high mobile conversion.',
        tags: ['1-Click Checkout', 'bKash / Card Gateways', 'Courier Sync'],
        themeColor: 'from-emerald-600 to-teal-600',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
        iconType: 'cart'
      }
    ]
  },
  {
    groupTitle: 'Design & Search Authority',
    groupSubtitle: 'User-centered interfaces and technical foundations for organic discoverability.',
    items: [
      {
        slug: 'ui-ux-design',
        title: 'UI/UX & Design Systems',
        desc: 'Intuitive user interface design rooted in user psychology. We deliver comprehensive Figma design token libraries and clickable prototypes.',
        tags: ['Figma System', 'User Psychology', 'Clickable Prototype'],
        themeColor: 'from-violet-600 to-purple-600',
        badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80',
        iconType: 'figma'
      },
      {
        slug: 'seo-digital-visibility',
        title: 'Technical SEO & Digital Visibility',
        desc: 'Semantic HTML, Schema.org JSON-LD, and Core Web Vitals optimization that earns durable first-page Google search rankings.',
        tags: ['Lighthouse 100', 'Rich SERP Snippets', 'Organic Growth'],
        themeColor: 'from-amber-600 to-orange-600',
        badgeColor: 'bg-amber-50 text-amber-800 border-amber-200/80',
        iconType: 'seo'
      }
    ]
  },
  {
    groupTitle: 'Cloud, Infrastructure & SLA',
    groupSubtitle: 'High-availability global runtimes and continuous security protection.',
    items: [
      {
        slug: 'website-maintenance-support',
        title: 'Website Maintenance & Cloud Support',
        desc: 'Continuous security updates, automated daily off-site encrypted backups, and direct WhatsApp hotline access to senior engineers.',
        tags: ['99.99% Uptime SLA', 'Hourly Snapshots', 'Direct Hotline'],
        themeColor: 'from-rose-600 to-pink-600',
        badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/80',
        iconType: 'shield'
      },
      {
        slug: 'domain-registration-management',
        title: 'Domain Registration & DNS',
        desc: 'Official BTCL .edu.bd / .bd domain acquisition, Anycast global DNS propagation, and DNSSEC protection with zero-lapse renewal guards.',
        tags: ['.edu.bd Ready', 'Anycast Global DNS', 'DNSSEC Crypto'],
        themeColor: 'from-cyan-600 to-teal-600',
        badgeColor: 'bg-cyan-50 text-cyan-800 border-cyan-200/80',
        iconType: 'dns'
      },
      {
        slug: 'managed-web-hosting',
        title: 'Managed Edge Cloud Hosting',
        desc: 'High-availability global edge CDN runtimes. Fast response times worldwide (<45ms TTFB), enterprise WAF, and zero shared server slowdowns.',
        tags: ['< 45ms Global TTFB', 'Enterprise WAF', 'Zero Cold Starts'],
        themeColor: 'from-teal-600 to-emerald-600',
        badgeColor: 'bg-teal-50 text-teal-800 border-teal-200/80',
        iconType: 'cloud'
      }
    ]
  }
];

export function getPublishedServices() {
  return serviceGroups.flatMap(group => group.items);
}
