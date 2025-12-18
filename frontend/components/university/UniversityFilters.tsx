'use client';

import React, { useState, useEffect } from 'react';
import { UniversityFilters as IUniversityFilters, Country, Program, Exam } from '@/types/university';
import { Input, Select, Button } from '@/components/ui';
import { universityService } from '@/services/api';

interface UniversityFiltersProps {
  onFiltersChange: (filters: IUniversityFilters) => void;
}

export const UniversityFilters: React.FC<UniversityFiltersProps> = ({ onFiltersChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [filters, setFilters] = useState<IUniversityFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        setLoading(true);
        const meta = await universityService.getMeta();
        setCountries(meta.countries);
        setPrograms(meta.programs);
        setExams(meta.exams);
        setError(null);
      } catch (err) {
        console.error('Error loading filters:', err);
        setError('Ошибка загрузки фильтров');
      } finally {
        setLoading(false);
      }
    };

    loadFilters();
  }, []);

  const handleFilterChange = (key: keyof IUniversityFilters, value: string | number) => {
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

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Фильтры</h3>

      <div className="space-y-4">
        <Input
          label="Поиск"
          placeholder="Название университета..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
        />

        <Select
          label="Страна"
          options={countries.map((c) => ({ value: c.id, label: c.name }))}
          value={filters.country_id || ''}
          onChange={(e) => handleFilterChange('country_id', e.target.value)}
        />

        <Select
          label="Программа"
          options={programs.map((p) => ({ value: p.id, label: p.name }))}
          value={filters.program_id || ''}
          onChange={(e) => handleFilterChange('program_id', e.target.value)}
        />

        <Select
          label="Экзамен"
          options={exams.map((e) => ({ value: e.id, label: e.name }))}
          value={filters.exam_id || ''}
          onChange={(e) => handleFilterChange('exam_id', e.target.value)}
        />

        <Input
          label="Минимальный балл"
          type="number"
          placeholder="0"
          value={filters.min_score || ''}
          onChange={(e) => handleFilterChange('min_score', parseInt(e.target.value) || 0)}
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
