import {
  University,
  UniversityDetail,
  UniversityListResponse,
  UniversityFilters,
  MetaResponse,
} from '@/types/university';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Helper function to build query string
function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  return searchParams.toString();
}

export const universityService = {
  // Get all universities with optional filters
  async getUniversities(filters?: UniversityFilters): Promise<UniversityListResponse> {
    try {
      const queryString = buildQueryString({
        country_id: filters?.country_id,
        program_id: filters?.program_id,
        exam_id: filters?.exam_id,
        min_score: filters?.min_score,
        search: filters?.search,
        page: filters?.page || 1,
        page_size: filters?.page_size || 20,
      });

      const url = `${API_BASE_URL}/universities${queryString ? '?' + queryString : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch universities: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

  // Get single university by ID
  async getUniversity(id: string): Promise<UniversityDetail> {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch university: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching university:', error);
      throw error;
    }
  },

  // Get metadata (countries, programs, exams)
  async getMeta(): Promise<MetaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/meta`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch meta: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching meta:', error);
      throw error;
    }
  },

  // Health check
  async health(): Promise<{ status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error health check:', error);
      throw error;
    }
  },
};
