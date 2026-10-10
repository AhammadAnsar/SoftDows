export interface TechStackItem {
  name: string;
  badge?: string;
}

export interface ClientProject {
  id: string;
  name: string;
  banglaName?: string;
  regionalBadge?: string;
  domain: string;
  url: string;
  category: string;
  logo: string;
  realMetrics?: string;
  hotline?: string;
  materialsHandled?: string;
  problem?: string;
  solution?: string;
  scope?: string[];
  techStack?: TechStackItem[];
  businessFocus?: {
    badge?: string;
    description: string;
  }[];
}

export const clientPartners: ClientProject[] = [
  {
    id: 'aziara-high-school',
    name: 'Aziara High School',
    banglaName: 'আজিয়ারা উচ্চ বিদ্যালয়',
    domain: 'azhs.edu.bd',
    url: 'https://azhs.edu.bd',
    category: 'Institutional Portal',
    logo: '/images/clients/azhs.png',
    problem: 'The school lacked a centralized digital presence to communicate with students and parents efficiently.',
    solution: 'We engineered a comprehensive academic portal with fast loading times and robust content management capabilities.',
    scope: ['Institutional Web Portal', 'Academic Content Management', 'Responsive UI/UX'],
    techStack: [{ name: 'Astro' }, { name: 'Tailwind CSS' }, { name: 'Cloudflare' }]
  },
  {
    id: 'anowarakabirhs',
    name: 'Anowara Kabir Adarsha High School',
    banglaName: 'আনোয়ারা কবির আদর্শ উচ্চ বিদ্যালয়',
    domain: 'anowarakabirhs.edu.bd',
    url: 'https://anowarakabirhs.edu.bd',
    category: 'Academic Management',
    logo: '/images/clients/anowarakabirhs.png'
  },
  {
    id: 'chowkurihs',
    name: 'Chowkuri High School',
    banglaName: 'চৌধুরী উচ্চ বিদ্যালয়',
    domain: 'chowkurihs.edu.bd',
    url: 'https://chowkurihs.edu.bd',
    category: 'Academic Portal',
    logo: '/images/clients/chowkurihs.png'
  },
  {
    id: 'ahsuhs',
    name: 'Al-Hajj Salamat Ullah High School',
    banglaName: 'আলহাজ্ব সালামত উল্লাহ উচ্চ বিদ্যালয়',
    domain: 'ahsuhs.edu.bd',
    url: 'https://ahsuhs.edu.bd',
    category: 'Institutional Portal',
    logo: '/images/clients/ahsuhs.png'
  },
  {
    id: 'sherascrap',
    name: 'SheraScrap',
    regionalBadge: 'Dammam, Saudi Arabia • شراء سكراب بالدمام',
    domain: 'sherascrap.com',
    url: 'https://sherascrap.com',
    category: 'Commercial Platform',
    logo: '/images/clients/sherascrap.png',
    realMetrics: '24/7 Scrap Pickup Dispatch, 100% Spot Cash & Digital Scale Settlement, Al Khaldiyyah Dammam Operational Base.',
    hotline: '+966 57 369 0164',
    materialsHandled: 'Copper (Red/Yellow), Heavy Iron, Aluminum, Battery Scrap, AC Units, Machinery.',
    problem: 'SheraScrap required a high-performance, dual-language digital presence in Saudi Arabia to capture commercial scrap trading leads and streamline inbound inquiries.',
    solution: 'We engineered a highly optimized, dual-language (Arabic/English) enterprise platform featuring instant lead routing via WhatsApp and integrated structural SEO for the Dammam region.',
    scope: ['Responsive Web App', 'Arabic/English SEO', 'Instant Lead Routing', 'Digital Scale Guarantee'],
    techStack: [
      { name: 'Astro 5 SSR', badge: 'Core' },
      { name: 'Tailwind v4', badge: 'Styling' },
      { name: 'Cloudflare Edge', badge: 'Hosting' }
    ]
  },
  {
    id: 'gulfhive',
    name: 'GulfHive',
    banglaName: 'গালফহাইভ',
    domain: 'gulfhive.com',
    url: 'https://gulfhive.com',
    category: 'Regional Platform',
    logo: '/images/clients/gulfhive.png'
  }
];
