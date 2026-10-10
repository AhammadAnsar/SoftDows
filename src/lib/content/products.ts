export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: 'software';
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  status: 'active' | 'beta' | 'upcoming' | 'retired' | 'hidden';
  featured: boolean;
  displayOrder: number;
  icon?: string;
  brandVisual?: string;
  mediaAlt?: string;
  targetAudience?: string;
  problem?: string;
  capabilities: string[];
  keyBenefits: string[];
  primaryCTA: { label: string; url: string };
  secondaryCTA?: { label: string; url: string };
  externalURL?: string;
  seoTitle: string;
  seoDescription: string;
  visibility: 'public' | 'hidden';
}

export const productsData: Record<string, Product> = {
  'biddalok': {
    id: 'biddalok',
    slug: 'biddalok',
    name: 'Biddalok',
    shortName: 'Biddalok',
    category: 'software',
    tagline: 'Structured Institutional Management',
    shortDescription: 'Comprehensive school administration platform for academic workflows.',
    fullDescription: 'Biddalok is a structured institutional management platform designed to streamline school administration. It connects students, teachers, and administrators through unified academic workflows and reporting systems.',
    status: 'active',
    featured: true,
    displayOrder: 1,
    targetAudience: 'Schools, educational institutions, and academic administrators.',
    problem: 'Fragmented academic data, manual administrative workflows, and disconnected communication between teachers and students.',
    capabilities: ['School Administration', 'Academic Workflows', 'Student & Teacher Management', 'Comprehensive Reports', 'Structured Institutional Management'],
    keyBenefits: ['Centralized Academic Data', 'Reduced Administrative Overhead', 'Clear Operational Visibility'],
    primaryCTA: { label: 'Request Demo', url: '/contact/' },
    seoTitle: 'Biddalok | School Administration Platform | SoftDows',
    seoDescription: 'Biddalok is a comprehensive school administration platform by SoftDows for managing students, teachers, and academic workflows.',
    visibility: 'public'
  },
  'eduweb': {
    id: 'eduweb',
    slug: 'eduweb',
    name: 'EduWeb',
    shortName: 'EduWeb',
    category: 'software',
    tagline: 'Educational Technology Software',
    shortDescription: 'Specialized educational software infrastructure engineered by SoftDows.',
    fullDescription: 'EduWeb is an educational technology software product engineered by SoftDows. It is built to support robust digital infrastructure within academic environments.',
    status: 'upcoming',
    featured: false,
    displayOrder: 2,
    capabilities: [],
    keyBenefits: [],
    primaryCTA: { label: 'Enquire About EduWeb', url: '/contact/' },
    seoTitle: 'EduWeb | Educational Software | SoftDows Products',
    seoDescription: 'EduWeb is a specialized educational software product developed by SoftDows.',
    visibility: 'public'
  },
  'smarttutor': {
    id: 'smarttutor',
    slug: 'smarttutor',
    name: 'SmartTutor',
    shortName: 'SmartTutor',
    category: 'software',
    tagline: 'Learning Management Architecture',
    shortDescription: 'Digital learning platform architecture built for educational delivery.',
    fullDescription: 'SmartTutor is a specialized digital learning product developed by SoftDows. It is designed to provide structured architecture for digital educational delivery.',
    status: 'upcoming',
    featured: false,
    displayOrder: 3,
    capabilities: [],
    keyBenefits: [],
    primaryCTA: { label: 'Enquire About SmartTutor', url: '/contact/' },
    seoTitle: 'SmartTutor | Learning Platform | SoftDows Products',
    seoDescription: 'SmartTutor is a digital learning software product developed by SoftDows.',
    visibility: 'public'
  },
  'mymosque': {
    id: 'mymosque',
    slug: 'mymosque',
    name: 'myMosque',
    shortName: 'myMosque',
    category: 'software',
    tagline: 'Structured Community Management',
    shortDescription: 'Operational platform for mosque administration and community management.',
    fullDescription: 'myMosque provides structured management tools for modern mosque administration. It helps operational teams manage facilities, catchment-area users, and community operations from a single platform.',
    status: 'active',
    featured: true,
    displayOrder: 4,
    targetAudience: 'Mosque administrators, community leaders, and operational staff.',
    problem: 'Lack of structured operational tools for managing mosque facilities and community engagement.',
    capabilities: ['Mosque Management', 'Administration Tools', 'Community Engagement', 'Operations Management', 'Catchment-Area User Support'],
    keyBenefits: ['Streamlined Operations', 'Improved Community Connection', 'Professional Administration'],
    primaryCTA: { label: 'Request Demo', url: '/contact/' },
    seoTitle: 'myMosque | Mosque Management Platform | SoftDows',
    seoDescription: 'myMosque is a structured operational platform by SoftDows for mosque administration and community management.',
    visibility: 'public'
  },
  'experthunter': {
    id: 'experthunter',
    slug: 'experthunter',
    name: 'ExpertHunter',
    shortName: 'ExpertHunter',
    category: 'software',
    tagline: 'Professional Discovery Platform',
    shortDescription: 'Platform architecture for professional discovery and connection.',
    fullDescription: 'ExpertHunter is a professional software platform developed by SoftDows. It provides the structured architecture necessary to connect organizations with specialized professionals.',
    status: 'upcoming',
    featured: false,
    displayOrder: 5,
    capabilities: [],
    keyBenefits: [],
    primaryCTA: { label: 'Enquire About ExpertHunter', url: '/contact/' },
    seoTitle: 'ExpertHunter | Professional Discovery | SoftDows Products',
    seoDescription: 'ExpertHunter is a specialized software platform developed by SoftDows.',
    visibility: 'public'
  },
  'easywebdev': {
    id: 'easywebdev',
    slug: 'easywebdev',
    name: 'EasyWebDev',
    shortName: 'EasyWebDev',
    category: 'software',
    tagline: 'Web Engineering Tools',
    shortDescription: 'Software tooling and platform architecture for web engineering.',
    fullDescription: 'EasyWebDev is a specialized software product developed by SoftDows, providing structural tooling and resources for web development operations.',
    status: 'upcoming',
    featured: false,
    displayOrder: 6,
    capabilities: [],
    keyBenefits: [],
    primaryCTA: { label: 'Enquire About EasyWebDev', url: '/contact/' },
    seoTitle: 'EasyWebDev | Web Engineering | SoftDows Products',
    seoDescription: 'EasyWebDev is a web engineering software product developed by SoftDows.',
    visibility: 'public'
  }
};

export const getPublishedProducts = () => {
  return Object.values(productsData)
    .filter(p => p.visibility === 'public')
    .sort((a, b) => a.displayOrder - b.displayOrder);
};
