'use client';

import React, { useState, useEffect } from 'react';
import { University, UniversityFilters as IUniversityFilters, UniversityListResponse } from '@/types/university';
import { UniversityCard, UniversityFilters } from '@/components/university';
import { universityService } from '@/services/api';

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<IUniversityFilters>({});
  const [total, setTotal] = useState(0);

  const loadUniversities = async (appliedFilters: IUniversityFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response: UniversityListResponse = await universityService.getUniversities(appliedFilters);
      setUniversities(response.items);
      setTotal(response.total);
    } catch (err) {
      console.error('Error loading universities:', err);
      setError('Ошибка загрузки университетов');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUniversities();
  }, []);

  const handleFiltersChange = (newFilters: IUniversityFilters) => {
    setFilters(newFilters);
    loadUniversities(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => loadUniversities()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Попробовать снова
          </button>
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
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Загрузка университетов...</p>
                </div>
              </div>
            ) : universities.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-600 text-lg">Университеты не найдены. Попробуй изменить фильтры.</p>
              </div>
            ) : (
              <>
                <p className="text-gray-600 mb-6">
                  Найдено: {universities.length} из {total} университетов
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  {universities.map((university) => (
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
