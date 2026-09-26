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
    { label: 'Website Design', href: '/services/website-design-development/' },
    { label: 'Custom Software', href: '/services/custom-software-web-applications/' },
    { label: 'eCommerce', href: '/services/ecommerce-development/' },
    { label: 'Domains', href: '/services/domain-registration-management/' },
    { label: 'Web Hosting', href: '/services/managed-web-hosting/' },
  ],
  products: [
    { label: 'Biddalok', href: '/products/biddalok/' },
    { label: 'myMosque', href: '/products/mymosque/' },
    { label: 'EduWeb', href: '/products/eduweb/' },
    { label: 'SmartTutor', href: '/products/smarttutor/' },
    { label: 'ExpertHunter', href: '/products/experthunter/' },
    { label: 'EasyWebDev', href: '/products/easywebdev/' },
  ],
  company: [
    { label: 'About Us', href: '/about/' },
    { label: 'Our Team', href: '/team/' },
    { label: 'Our Ventures', href: '/ventures/' },
    { label: 'Start a Project', href: '/start-a-project/' },
    { label: 'Contact Us', href: '/contact/' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy/' },
    { label: 'Terms of Service', href: '/terms/' },
  ],
};
