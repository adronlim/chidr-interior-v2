export type CategorySlug = 'residential' | 'commercial' | 'office';

export interface ProjectCategory {
  _id: string;
  title: string;
  slug: CategorySlug;
  description?: string;
}

export interface ProjectImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: { title: string; slug: CategorySlug };
  year: number;
  location: string;
  areaSqft?: number;
  featured: boolean;
  coverImage: ProjectImage;
  gallery: ProjectImage[];
  videoUrl?: string;
  description: string[];
  order: number;
}

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export interface Social {
  platform: 'instagram' | 'facebook' | 'tiktok' | 'linkedin' | 'whatsapp' | 'email';
  url: string;
}

export interface Company {
  name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  mapEmbedUrl: string;
  socials: Social[];
  services: Service[];
}

export interface Hero {
  heading: string;
  subheading: string;
  image: ProjectImage;
  ctaLabel: string;
  ctaHref: string;
}

export interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo: ProjectImage;
  bio: string;
  order: number;
}

export interface Testimonial {
  _id: string;
  quote: string;
  author: string;
  role: string;
}
