export interface ClientPartner {
  id: string;
  name: string;
  banglaName: string;
  domain: string;
  url: string;
  category: string;
  logo: string;
}

export const clientPartners: ClientPartner[] = [
  {
    id: 'azhs',
    name: 'Aziara High School',
    banglaName: 'আজিয়ারা উচ্চ বিদ্যালয়',
    domain: 'azhs.edu.bd',
    url: 'https://azhs.edu.bd',
    category: 'Institutional Portal',
    logo: '/images/clients/azhs.png'
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
    banglaName: 'চৌকুড়ী উচ্চ বিদ্যালয়',
    domain: 'chowkurihs.edu.bd',
    url: 'https://chowkurihs.edu.bd',
    category: 'Academic Portal',
    logo: '/images/clients/chowkurihs.png'
  },
  {
    id: 'ahsuhs',
    name: 'Al-Hajj Salamat Ullah High School',
    banglaName: 'আল-হাজ্ব ছালামত উল্লা উচ্চ বিদ্যালয়',
    domain: 'ahsuhs.edu.bd',
    url: 'https://ahsuhs.edu.bd',
    category: 'Institutional Portal',
    logo: '/images/clients/ahsuhs.png'
  },
  {
    id: 'sherascrap',
    name: 'SheraScrap',
    banglaName: 'সেরা স্ক্র্যাপ',
    domain: 'sherascrap.com',
    url: 'https://sherascrap.com',
    category: 'Commercial Platform',
    logo: '/images/clients/sherascrap.png'
  },
  {
    id: 'gulfhive',
    name: 'GulfHive',
    banglaName: 'গাল্ফহাইভ',
    domain: 'gulfhive.com',
    url: 'https://gulfhive.com',
    category: 'Regional Platform',
    logo: '/images/clients/gulfhive.png'
  }
];
