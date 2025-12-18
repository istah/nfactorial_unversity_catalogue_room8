'use client';

import React, { useState, useEffect } from 'react';
import { University, UniversityFilters as IUniversityFilters } from '@/types/university';
import { UniversityCard, UniversityFilters } from '@/components/university';
import { mockUniversities } from '@/lib/mockData';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUniversities = async () => {
      try {
        // TODO: Replace with actual API call
        // const data = await universityService.getUniversities();
        // setUniversities(data);
        // setFilteredUniversities(data);

        // Using mock data for now
        setUniversities(mockUniversities);
        setFilteredUniversities(mockUniversities);
      } catch (error) {
        console.error('Error loading universities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, []);

  const handleFiltersChange = (filters: IUniversityFilters) => {
    let filtered = universities;

    if (filters.searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
          u.description.toLowerCase().includes(filters.searchQuery!.toLowerCase())
      );
    }

    if (filters.country) {
      filtered = filtered.filter((u) => u.country === filters.country);
    }

    if (filters.specialty) {
      filtered = filtered.filter((u) => u.specialties.includes(filters.specialty!));
    }

    setFilteredUniversities(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка университетов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Университеты мира</h1>
          <p className="text-gray-600">Найди идеальный университет для своего будущего</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <UniversityFilters onFiltersChange={handleFiltersChange} />
          </div>

          {/* Universities Grid */}
          <div className="lg:col-span-3">
            {filteredUniversities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-600 text-lg">Университеты не найдены. Попробуй изменить фильтры.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">Найдено: {filteredUniversities.length} университетов</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {filteredUniversities.map((university) => (
                    <UniversityCard key={university.id} university={university} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
