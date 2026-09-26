export interface TeamMember {
  id: string;
  slug: string;
  fullName: string;
  displayName: string;
  role: string;
  shortBio: string;
  fullBio: string;
  photo?: string;
  photoAlt?: string;
  monogramFallback: string;
  expertise: string[];
  skills: string[];
  experience: { title: string; company: string; period: string; description?: string }[];
  education: { degree: string; institution: string; year?: string }[];
  certifications: string[];
  selectedWork: { title: string; url: string }[];
  languages: string[];
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  joinedDate?: string;
  featured: boolean;
  displayOrder: number;
  status: 'active' | 'inactive' | 'leave';
  publicVisibility: boolean;
  seoTitle: string;
  seoDescription: string;
}

export const teamData: Record<string, TeamMember> = {
  'ansar-ahammad': {
    id: 'ansar-ahammad',
    slug: 'ansar-ahammad',
    fullName: 'Ansar Ahammad',
    displayName: 'Ansar Ahammad',
    role: 'Founder',
    shortBio: 'Ansar Ahammad is the Founder of SoftDows, focusing on practical digital solutions designed around business needs, usability, maintainability and long-term value.',
    fullBio: 'Ansar Ahammad established SoftDows to bridge the gap between complex engineering and practical business operations. With a strong commitment to clean architecture and user-centric design, he ensures that every project is engineered for tangible business outcomes rather than just technical novelty. His approach emphasizes transparency, reliability, and long-term scalability.',
    monogramFallback: 'AA',
    expertise: ['Digital Strategy', 'Systems Architecture', 'Business Operations', 'Product Engineering'],
    skills: [],
    experience: [
      {
        title: 'Founder',
        company: 'SoftDows',
        period: 'Present',
        description: 'Leading digital engineering and technical strategy for clients and internal ventures.'
      }
    ],
    education: [],
    certifications: [],
    selectedWork: [],
    languages: ['Bengali', 'English'],
    featured: true,
    displayOrder: 1,
    status: 'active',
    publicVisibility: true,
    seoTitle: 'Ansar Ahammad | Founder at SoftDows',
    seoDescription: 'Ansar Ahammad is the Founder of SoftDows, focusing on practical digital solutions designed around business needs and maintainability.'
  }
};

export const getPublishedTeam = () => {
  return Object.values(teamData)
    .filter(member => member.publicVisibility && member.status === 'active')
    .sort((a, b) => a.displayOrder - b.displayOrder);
};
