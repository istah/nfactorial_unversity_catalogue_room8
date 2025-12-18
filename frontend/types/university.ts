export interface University {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  ranking?: number;
  specialties: string[];
  requirements: Requirement[];
}

export interface Requirement {
  exam: string;
  minScore: number;
  maxScore: number;
}

export interface UniversityFilters {
  country?: string;
  specialty?: string;
  searchQuery?: string;
}
