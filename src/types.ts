export type Species = 'Perro' | 'Gato' | 'Conejo' | 'Ave' | 'Otro';
export type AgeGroup = 'Cachorro' | 'Joven' | 'Adulto' | 'Senior';
export type PetSize = 'Pequeño' | 'Mediano' | 'Grande' | 'Pequeña' | 'Mediana';
export type EnergyLevel = 'Bajo' | 'Medio' | 'Alto';
export type PetGender = 'Macho' | 'Hembra';

export interface Pet {
  id: string;
  name: string;
  species: Species;
  breed: string;
  age: string; // e.g. "2 años", "6 meses"
  ageGroup: AgeGroup;
  size: PetSize;
  weight: string; // e.g. "14 kg"
  color: string;
  gender: PetGender;
  energyLevel: EnergyLevel;
  location: string;
  description: string;
  rescueStory: string;
  personality: string[];
  vaccinated: boolean;
  sterilized: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
  urgentAdoption?: boolean;
  mainImage: string;
  gallery: string[];
  shelterName: string;
  distanceKm?: number;
}

export interface FilterCriteria {
  species?: Species | 'Todos';
  ageGroup?: AgeGroup | 'Todos';
  size?: PetSize | 'Todos';
  energyLevel?: EnergyLevel | 'Todos';
  gender?: PetGender | 'Todos';
  vaccinated?: boolean | null;
  goodWithKids?: boolean | null;
  goodWithPets?: boolean | null;
  searchQuery?: string;
}

export type ApplicationStage = 
  | 'enviada'
  | 'en_revision'
  | 'entrevista'
  | 'visita_domiciliaria'
  | 'aprobada';

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  petBreed: string;
  submittedDate: string;
  currentStage: ApplicationStage;
  applicantName: string;
  email: string;
  phone: string;
  address: string;
  housingType: 'Casa' | 'Departamento';
  hasYard: boolean;
  hasOtherPets: boolean;
  otherPetsDetails?: string;
  previousExperience: string;
  adoptionReason: string;
  acceptedTerms: boolean;
  aiReviewScore?: number;
  aiReviewFeedback?: string;
  timelineHistory: {
    stage: ApplicationStage;
    title: string;
    description: string;
    date: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export interface ShelterVisit {
  id: string;
  petId?: string;
  petName?: string;
  petImage?: string;
  shelterName: string;
  date: string;
  time: string;
  visitorName: string;
  phone: string;
  visitorCount: number;
  comments: string;
  status: 'Confirmada' | 'Completada' | 'Cancelada';
  passCode: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  location: string;
  isVerified: boolean;
  savedFavorites: string[]; // pet IDs
  likedPets: string[];
  passedPets: string[];
  totalDonations: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai' | 'system';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'view_pet' | 'open_filter' | 'schedule_visit' | 'open_form';
    payload?: any;
  };
}

export type AppScreen =
  | 'splash'
  | 'auth'
  | 'home'
  | 'explore'
  | 'favorites'
  | 'visits'
  | 'profile'
  | 'pet_detail'
  | 'schedule_visit'
  | 'adoption_form'
  | 'application_status'
  | 'ai_assistant'
  | 'ai_recommender';
