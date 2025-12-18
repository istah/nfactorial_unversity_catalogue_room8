import { University, UniversityFilters } from '@/types/university';

// TODO: Replace with actual backend URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const universityService = {
  // Get all universities with optional filters
  async getUniversities(filters?: UniversityFilters): Promise<University[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.country) params.append('country', filters.country);
      if (filters?.specialty) params.append('specialty', filters.specialty);
      if (filters?.searchQuery) params.append('search', filters.searchQuery);

      const response = await fetch(`${API_BASE_URL}/universities?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch universities');
      return await response.json();
    } catch (error) {
      console.error('Error fetching universities:', error);
      throw error;
    }
  },

  // Get single university by ID
  async getUniversity(id: string): Promise<University> {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch university');
      return await response.json();
    } catch (error) {
      console.error('Error fetching university:', error);
      throw error;
    }
  },

  // Get available countries for filtering
  async getCountries(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/filters/countries`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch countries');
      return await response.json();
    } catch (error) {
      console.error('Error fetching countries:', error);
      throw error;
    }
  },

  // Get available specialties for filtering
  async getSpecialties(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/filters/specialties`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch specialties');
      return await response.json();
    } catch (error) {
      console.error('Error fetching specialties:', error);
      throw error;
    }
  },
};
