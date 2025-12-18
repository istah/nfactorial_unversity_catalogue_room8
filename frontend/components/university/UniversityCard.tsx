'use client';

import React from 'react';
import Link from 'next/link';
import { University } from '@/types/university';
import { Card, Button } from '@/components/ui';

interface UniversityCardProps {
  university: University;
}

export const UniversityCard: React.FC<UniversityCardProps> = ({ university }) => {
  return (
    <Link href={`/universities/${university.id}`}>
      <Card hover className="overflow-hidden cursor-pointer h-full">
        <div className="aspect-video bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl font-bold opacity-20">{university.name.charAt(0)}</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 flex-1">{university.name}</h3>
            {university.ranking && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                #{university.ranking}
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600 mb-1">{university.country}</p>
          <p className="text-gray-700 text-sm mb-4 line-clamp-2">{university.description}</p>

          <div className="mb-4">
            <p className="text-xs font-semibold text-gray-600 mb-2">Специальности:</p>
            <div className="flex flex-wrap gap-1">
              {university.specialties.slice(0, 3).map((specialty, idx) => (
                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  {specialty}
                </span>
              ))}
              {university.specialties.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{university.specialties.length - 3}
                </span>
              )}
            </div>
          </div>

          <Button variant="primary" size="sm" className="w-full">
            Подробнее
          </Button>
        </div>
      </Card>
    </Link>
  );
};
