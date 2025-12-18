// Backend response types based on AGENTS.md

export interface Exam {
  id: string;
  name: string;
}

export interface Requirement {
  id: string;
  exam_id: string;
  exam?: Exam;
  min_score: number;
  max_score?: number;
}

export interface Program {
  id: string;
  name: string;
}

export interface Country {
  id: string;
  name: string;
  code: string;
}

export interface University {
  id: string;
  name: string;
  country_id: string;
  country?: Country;
  description?: string;
  programs?: Program[];
  requirements?: Requirement[];
}

export interface UniversityDetail extends University {
  programs: Program[];
  requirements: Requirement[];
}

export interface UniversityListResponse {
  items: University[];
  total: number;
  page: number;
  page_size: number;
}

export interface MetaResponse {
  countries: Country[];
  programs: Program[];
  exams: Exam[];
}

export interface UniversityFilters {
  country_id?: string;
  program_id?: string;
  exam_id?: string;
  min_score?: number;
  search?: string;
  page?: number;
  page_size?: number;
}
