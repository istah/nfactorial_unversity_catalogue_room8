import { University } from '@/types/university';

export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Stanford University',
    country: 'USA',
    description: 'Один из ведущих университетов мира, известный своей программой в области технологий и инноваций.',
    image: '/universities/stanford.jpg',
    ranking: 1,
    specialties: ['Computer Science', 'Engineering', 'Business'],
    requirements: [
      { exam: 'SAT', minScore: 1470, maxScore: 1570 },
      { exam: 'ACT', minScore: 33, maxScore: 35 },
    ],
  },
  {
    id: '2',
    name: 'MIT',
    country: 'USA',
    description: 'Массачусетский технологический институт - мировой лидер в области науки и технологий.',
    image: '/universities/mit.jpg',
    ranking: 2,
    specialties: ['Engineering', 'Computer Science', 'Physics'],
    requirements: [
      { exam: 'SAT', minScore: 1480, maxScore: 1570 },
      { exam: 'ACT', minScore: 33, maxScore: 35 },
    ],
  },
  {
    id: '3',
    name: 'University of Oxford',
    country: 'UK',
    description: 'Один из старейших и престижнейших университетов Европы с богатой историей.',
    image: '/universities/oxford.jpg',
    ranking: 3,
    specialties: ['Law', 'Medicine', 'Philosophy'],
    requirements: [
      { exam: 'A-Level', minScore: 3, maxScore: 3 },
      { exam: 'IELTS', minScore: 7, maxScore: 9 },
    ],
  },
  {
    id: '4',
    name: 'University of Cambridge',
    country: 'UK',
    description: 'Престижный британский университет, известный своей академической традицией.',
    image: '/universities/cambridge.jpg',
    ranking: 4,
    specialties: ['Mathematics', 'Physics', 'Engineering'],
    requirements: [
      { exam: 'A-Level', minScore: 3, maxScore: 3 },
      { exam: 'IELTS', minScore: 7, maxScore: 9 },
    ],
  },
  {
    id: '5',
    name: 'ETH Zurich',
    country: 'Switzerland',
    description: 'Швейцарский федеральный технологический институт - центр инноваций в Европе.',
    image: '/universities/eth.jpg',
    ranking: 5,
    specialties: ['Engineering', 'Computer Science', 'Architecture'],
    requirements: [
      { exam: 'Matura', minScore: 5, maxScore: 6 },
      { exam: 'TOEFL', minScore: 100, maxScore: 120 },
    ],
  },
  {
    id: '6',
    name: 'University of Toronto',
    country: 'Canada',
    description: 'Ведущий канадский университет с сильными программами в области исследований.',
    image: '/universities/toronto.jpg',
    ranking: 20,
    specialties: ['Engineering', 'Medicine', 'Business'],
    requirements: [
      { exam: 'SAT', minScore: 1400, maxScore: 1550 },
      { exam: 'IELTS', minScore: 6.5, maxScore: 9 },
    ],
  },
];
