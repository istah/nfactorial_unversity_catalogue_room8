'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { University } from '@/types/university';
import { Button, Card } from '@/components/ui';
import { mockUniversities } from '@/lib/mockData';

export default function UniversityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUniversity = async () => {
      try {
        // TODO: Replace with actual API call
        // const data = await universityService.getUniversity(id);
        // setUniversity(data);

        // Using mock data for now
        const found = mockUniversities.find((u) => u.id === id);
        setUniversity(found || null);
      } catch (error) {
        console.error('Error loading university:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUniversity();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка информации...</p>
        </div>
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Университет не найден</p>
          <Link href="/universities">
            <Button variant="primary">Вернуться к списку</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/universities" className="inline-block mb-6">
          <Button variant="outline">← Вернуться</Button>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-12 text-white mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{university.name}</h1>
              <p className="text-blue-100 text-lg">{university.country}</p>
            </div>
            {university.ranking && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-sm font-semibold">Рейтинг</p>
                <p className="text-2xl font-bold">#{university.ranking}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">О университете</h2>
          <p className="text-gray-700 text-lg leading-relaxed">{university.description}</p>
        </Card>

        {/* Specialties */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Специальности</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {university.specialties.map((specialty, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-600 font-semibold">✓</span>
                <span className="text-gray-900">{specialty}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Requirements */}
        <Card className="mb-8 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Требования для поступления</h2>
          <div className="space-y-4">
            {university.requirements.map((req, idx) => (
              <div key={idx} className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 mb-1">{req.exam}</h3>
                <p className="text-gray-600">
                  Минимальный балл: <span className="font-semibold text-gray-900">{req.minScore}</span>
                </p>
                <p className="text-gray-600">
                  Максимальный балл: <span className="font-semibold text-gray-900">{req.maxScore}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Хочешь узнать больше?</h3>
          <p className="mb-6 opacity-90">Спроси у нашего AI-ассистента о требованиях и процессе поступления</p>
          <Link href="/chat">
            <Button variant="secondary" size="lg">
              Открыть чат с AI
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
