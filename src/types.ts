export type TabId = 'home' | 'animals' | 'plants' | 'fungi' | 'wizard' | 'compare' | 'feed';

export interface Organism {
  id: string;
  common_name: string;
  scientific_name: string;
  category: string;
  habitat: string;
  conservation_status: string;
  danger_level: string;
  ecological_role: string;
  diseases: string[];
  image_url: string;
  nutrition_type?: string;
  lifespan?: string;
  interactions?: string[];
}

export interface Suggestion {
  id: string;
  species: string;
  organismId?: string;
  votes: number;
  voted: boolean;
}

export interface FieldComment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  timeAgo: string;
}

export interface Observation {
  id: string;
  user: string;
  avatar: string;
  location: string;
  timeAgo: string;
  imageUrl: string;
  linkedOrganismId?: string;
  note: string;
  suggestions: Suggestion[];
  comments?: FieldComment[];
}

export const IUCN_LABELS: { [key: string]: string } = {
  CR: 'CR — Kritik Tehlikede',
  EN: 'EN — Tehlikede',
  VU: 'VU — Hassas (Duyarlı)',
  NT: 'NT — Tehdide Yakın',
  LC: 'LC — Asgari Endişe',
  DD: 'DD — Yetersiz Veri',
  NE: 'NE — Değerlendirilmedi',
};

export const FALLBACK_IMAGE =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/600px-No_image_available.svg.png';