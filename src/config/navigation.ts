export interface NavItem {
  label: string;
  href: string;
}

export interface NavGroup {
  group: string;
  items: NavItem[];
}

export interface MainNavItem extends NavItem {
  children?: NavGroup[];
}

export const mainNav: MainNavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    href: '/services/',
    children: [
      {
        group: 'Digital Services',
        items: [
          { label: 'Website Design & Development', href: '/services/website-design-development/' },
          { label: 'Custom Software & Web Apps', href: '/services/custom-software-web-applications/' },
          { label: 'eCommerce Development', href: '/services/ecommerce-development/' },
          { label: 'UI/UX Design', href: '/services/ui-ux-design/' },
          { label: 'SEO & Digital Visibility', href: '/services/seo-digital-visibility/' },
          { label: 'Website Maintenance & Support', href: '/services/website-maintenance-support/' },
        ],
      },
      {
        group: 'Infrastructure',
        items: [
          { label: 'Domain Registration & Management', href: '/services/domain-registration-management/' },
          { label: 'Managed Web Hosting', href: '/services/managed-web-hosting/' },
        ],
      },
    ],
  },
  { label: 'Clients', href: '/clients/' },
  {
    label: 'Products',
    href: '/products/',
    children: [
      {
        group: 'Software Products',
        items: [
          { label: 'Biddalok', href: '/products/biddalok/' },
          { label: 'EduWeb', href: '/products/eduweb/' },
          { label: 'SmartTutor', href: '/products/smarttutor/' },
          { label: 'myMosque', href: '/products/mymosque/' },
          { label: 'ExpertHunter', href: '/products/experthunter/' },
          { label: 'EasyWebDev', href: '/products/easywebdev/' },
        ],
      },
    ],
  },
  {
    label: 'Ventures',
    href: '/ventures/',
    children: [
      {
        group: 'Ventures',
        items: [
          { label: 'BanglaNotice', href: '/ventures/banglanotice/' },
          { label: 'BidyaShikhi', href: '/ventures/bidyashikhi/' },
          { label: 'NiceTrix', href: '/ventures/nicetrix/' },
          { label: 'BahariMart', href: '/ventures/baharimart/' },
        ],
      },
    ],
  },
  {
    label: 'Company',
    href: '/about/',
    children: [
      {
        group: 'Company',
        items: [
          { label: 'About SoftDows', href: '/about/' },
          { label: 'Team', href: '/team/' },
          { label: 'Contact', href: '/contact/' },
        ],
      },
    ],
  },
];

export const footerNav = {
  services: [
    { label: 'Custom Software & Web Apps', href: '/services/custom-software-web-applications/' },
    { label: 'Website Design & Development', href: '/services/website-design-development/' },
    { label: 'eCommerce Systems & Stores', href: '/services/ecommerce-development/' },
    { label: 'UI/UX & Design Systems', href: '/services/ui-ux-design/' },
    { label: 'Technical SEO & Digital Visibility', href: '/services/seo-digital-visibility/' },
    { label: 'Website Maintenance & Cloud Support', href: '/services/website-maintenance-support/' },
    { label: 'Domain Registration & DNS', href: '/services/domain-registration-management/' },
    { label: 'Managed Edge Cloud Hosting', href: '/services/managed-web-hosting/' }
  ],
  products: [
    { label: 'Biddalok', href: '/products/biddalok/' },
    { label: 'myMosque', href: '/products/mymosque/' },
    { label: 'EduWeb', href: '/products/eduweb/' },
    { label: 'SmartTutor', href: '/products/smarttutor/' },
    { label: 'ExpertHunter', href: '/products/experthunter/' },
    { label: 'EasyWebDev', href: '/products/easywebdev/' }
  ],
  ventures: [
    { label: 'BanglaNotice', href: '/ventures/banglanotice/' },
    { label: 'BidyaShikhi', href: '/ventures/bidyashikhi/' },
    { label: 'NiceTrix', href: '/ventures/nicetrix/' },
    { label: 'BahariMart', href: '/ventures/baharimart/' }
  ],
  company: [
    { label: 'About SoftDows', href: '/about/' },
    { label: 'Leadership & Team', href: '/team/' },
    { label: 'Clients & Case Studies', href: '/clients/' },
    { label: 'Start a Project', href: '/start-a-project/' },
    { label: 'Contact Us', href: '/contact/' }
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' },
    { label: 'Legal Disclaimers', href: '/legal-disclaimer/' }
  ]
};

