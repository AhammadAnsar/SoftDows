export interface Venture {
  id: string;
  slug: string;
  brandName: string;
  localName?: string;
  shortDescription: string;
  description: string;
  category: string;
  externalUrl?: string;
  status: 'active' | 'upcoming' | 'hidden';
  featured: boolean;
  publicVisibility: boolean;
  logo?: string;
  coverVisual?: string;
  mediaAlt?: string;
  launchYear?: string;
  softdowsRole: string;
  keyFocus: string[];
  audience: string;
  websiteCTA: string;
  displayOrder: number;
  seoTitle: string;
  seoDescription: string;
}

export const venturesData: Record<string, Venture> = {
  'banglanotice': {
    id: 'banglanotice',
    slug: 'banglanotice',
    brandName: 'BanglaNotice',
    localName: 'বাংলা নোটিশ',
    shortDescription: 'Bengali information and publication platform.',
    description: 'A comprehensive Bengali information and publication platform covering crucial areas such as education, public notices, public-service information, jobs, and related useful daily information for the Bengali-speaking audience.',
    category: 'Information Portal',
    externalUrl: 'https://banglanotice.com',
    status: 'active',
    featured: true,
    publicVisibility: true,
    softdowsRole: 'Owned & Operated Platform',
    keyFocus: ['Education', 'Public Notices', 'Jobs', 'Service Information'],
    audience: 'Bengali speakers seeking reliable public information.',
    websiteCTA: 'Visit BanglaNotice',
    displayOrder: 1,
    seoTitle: 'BanglaNotice | A SoftDows Venture',
    seoDescription: 'BanglaNotice is a Bengali information platform covering education, notices, and public-service information.'
  },
  'bidyashikhi': {
    id: 'bidyashikhi',
    slug: 'bidyashikhi',
    brandName: 'BidyaShikhi',
    localName: 'বিদ্যাশিখি',
    shortDescription: 'Bengali-language learning and skill-development platform.',
    description: 'An educational initiative focused on providing accessible learning resources and skill-development materials in the Bengali language, helping individuals enhance their capabilities and academic knowledge.',
    category: 'EdTech / Learning',
    externalUrl: 'https://bidyashikhi.com',
    status: 'active',
    featured: true,
    publicVisibility: true,
    softdowsRole: 'Owned & Operated Platform',
    keyFocus: ['Skill Development', 'Academic Resources', 'Language Learning'],
    audience: 'Students and professionals seeking skill development in Bengali.',
    websiteCTA: 'Visit BidyaShikhi',
    displayOrder: 2,
    seoTitle: 'BidyaShikhi | A SoftDows Venture',
    seoDescription: 'BidyaShikhi is a Bengali-language learning and skill-development platform.'
  },
  'nicetrix': {
    id: 'nicetrix',
    slug: 'nicetrix',
    brandName: 'NiceTrix',
    localName: 'নাইস ট্রিক্স',
    shortDescription: 'Content platform for practical lifestyle, tech, and academic guides.',
    description: 'A versatile content platform covering practical, everyday topics including lifestyle improvements, academics, AI/technology trends, career advice, and related actionable guides.',
    category: 'Content Platform',
    externalUrl: 'https://nicetrix.com',
    status: 'active',
    featured: true,
    publicVisibility: true,
    softdowsRole: 'Owned & Operated Platform',
    keyFocus: ['Technology', 'Lifestyle', 'Career Guides', 'AI'],
    audience: 'General readers looking for practical guides and technology insights.',
    websiteCTA: 'Visit NiceTrix',
    displayOrder: 3,
    seoTitle: 'NiceTrix | A SoftDows Venture',
    seoDescription: 'NiceTrix is a content platform covering practical lifestyle, technology, and career guides.'
  },
  'baharimart': {
    id: 'baharimart',
    slug: 'baharimart',
    brandName: 'BahariMart',
    localName: 'বাহারি মার্ট',
    shortDescription: 'Modern eCommerce platform.',
    description: 'An eCommerce platform designed to provide a seamless and reliable shopping experience for a variety of consumer goods.',
    category: 'eCommerce',
    externalUrl: 'https://baharimart.com',
    status: 'active',
    featured: true,
    publicVisibility: true,
    softdowsRole: 'Owned & Operated Platform',
    keyFocus: ['Consumer Retail', 'Seamless Checkout', 'Digital Commerce'],
    audience: 'Online shoppers.',
    websiteCTA: 'Visit BahariMart',
    displayOrder: 4,
    seoTitle: 'BahariMart | A SoftDows Venture',
    seoDescription: 'BahariMart is a modern eCommerce platform operated by SoftDows.'
  },
  'gulfhive': {
    id: 'gulfhive',
    slug: 'gulfhive',
    brandName: 'GulfHive',
    shortDescription: 'Upcoming regional platform.',
    description: 'An upcoming platform currently under active development. More details will be published upon verified launch.',
    category: 'Platform',
    status: 'hidden', // Explicitly hidden until verified active
    featured: false,
    publicVisibility: false,
    softdowsRole: 'Owned & Operated Platform',
    keyFocus: [],
    audience: 'Regional audience.',
    websiteCTA: 'Visit GulfHive',
    displayOrder: 99,
    seoTitle: 'GulfHive | A SoftDows Venture',
    seoDescription: 'GulfHive is an upcoming platform by SoftDows.'
  }
};

export const getPublishedVentures = () => {
  return Object.values(venturesData)
    .filter(v => v.publicVisibility && v.status !== 'hidden')
    .sort((a, b) => a.displayOrder - b.displayOrder);
};
