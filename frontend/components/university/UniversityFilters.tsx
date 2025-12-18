'use client';

import React, { useState, useEffect } from 'react';
import { UniversityFilters as IUniversityFilters } from '@/types/university';
import { Input, Select, Button } from '@/components/ui';
import { universityService } from '@/services/api';

interface UniversityFiltersProps {
  onFiltersChange: (filters: IUniversityFilters) => void;
}

export const UniversityFilters: React.FC<UniversityFiltersProps> = ({ onFiltersChange }) => {
  const [countries, setCountries] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [filters, setFilters] = useState<IUniversityFilters>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        // TODO: Replace with actual API calls when backend is ready
        // const [countriesData, specialtiesData] = await Promise.all([
        //   universityService.getCountries(),
        //   universityService.getSpecialties(),
        // ]);
        // setCountries(countriesData);
        // setSpecialties(specialtiesData);

        // Mock data for now
        setCountries(['USA', 'UK', 'Canada', 'Germany', 'Netherlands']);
        setSpecialties(['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law']);
      } catch (error) {
        console.error('Error loading filters:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  const handleFilterChange = (key: keyof IUniversityFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFiltersChange({});
  };

  if (loading) {
    return <div className="text-gray-500">Загрузка фильтров...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Фильтры</h3>

      <div className="space-y-4">
        <Input
          label="Поиск"
          placeholder="Название университета..."
          value={filters.searchQuery || ''}
          onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
        />

        <Select
          label="Страна"
          options={countries.map((c) => ({ value: c, label: c }))}
          value={filters.country || ''}
          onChange={(e) => handleFilterChange('country', e.target.value)}
        />

        <Select
          label="Специальность"
          options={specialties.map((s) => ({ value: s, label: s }))}
          value={filters.specialty || ''}
          onChange={(e) => handleFilterChange('specialty', e.target.value)}
        />

        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="md" onClick={handleApplyFilters} className="flex-1">
            Применить
          </Button>
          <Button variant="outline" size="md" onClick={handleReset} className="flex-1">
            Сбросить
          </Button>
        </div>
      </div>
    </div>
  );
};
