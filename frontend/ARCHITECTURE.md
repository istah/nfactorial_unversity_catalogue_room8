# 🏗️ Архитектура Frontend

## Обзор

Frontend построен на **Next.js 15** с **App Router**, **TypeScript** и **Tailwind CSS**. Архитектура масштабируемая, модульная и готова к интеграции с backend.

## Слои архитектуры

```
┌─────────────────────────────────────────┐
│         Pages (App Router)              │
│  (page.tsx, universities/, chat/)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Components (UI + Domain)           │
│  (ui/, university/, chat/)              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Services (API Layer)               │
│  (api.ts, chat.ts)                      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Types (TypeScript)                 │
│  (university.ts, chat.ts)               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Backend API                        │
│  (http://localhost:8000/api)            │
└─────────────────────────────────────────┘
```

## Компоненты

### UI Компоненты (`components/ui/`)

Базовые, переиспользуемые компоненты:

- **Button** - Кнопка с вариантами (primary, secondary, outline)
- **Card** - Контейнер с shadow и border
- **Input** - Текстовое поле с label и error
- **Select** - Выпадающий список

**Использование:**
```tsx
import { Button, Card, Input, Select } from '@/components/ui';

<Button variant="primary" size="lg">Нажми меня</Button>
<Card hover>Содержимое</Card>
<Input label="Email" placeholder="..." />
<Select label="Страна" options={[...]} />
```

### Domain Компоненты

#### University (`components/university/`)

- **UniversityCard** - Карточка университета с информацией
- **UniversityFilters** - Панель фильтрации (страна, специальность, поиск)

#### Chat (`components/chat/`)

- **ChatMessage** - Одно сообщение (user/assistant)
- **ChatInput** - Ввод сообщения с Enter поддержкой
- **ChatWindow** - Окно чата с историей и скроллингом

## Services (API Layer)

### `services/api.ts`

Сервис для работы с университетами:

```typescript
universityService.getUniversities(filters?)  // Получить список
universityService.getUniversity(id)          // Получить одного
universityService.getCountries()             // Фильтры: страны
universityService.getSpecialties()           // Фильтры: специальности
```

**TODO:** Раскомментируй реальные API вызовы

### `services/chat.ts`

Сервис для работы с AI-чатом:

```typescript
chatService.sendMessage(sessionId, content)  // Отправить сообщение
chatService.getChatHistory(sessionId)        // Получить историю
chatService.createSession()                  // Создать сессию
```

**TODO:** Подключи реальный AI backend

## Types (TypeScript)

### `types/university.ts`

```typescript
interface University {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  ranking?: number;
  specialties: string[];
  requirements: Requirement[];
}

interface Requirement {
  exam: string;
  minScore: number;
  maxScore: number;
}

interface UniversityFilters {
  country?: string;
  specialty?: string;
  searchQuery?: string;
}
```

### `types/chat.ts`

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Pages (App Router)

### `/` (Главная)

**Файл:** `app/page.tsx`

- Героический баннер
- Описание возможностей
- CTA кнопки

### `/universities` (Список)

**Файл:** `app/universities/page.tsx`

- Сетка карточек университетов
- Фильтры (страна, специальность, поиск)
- Состояние: `universities`, `filteredUniversities`, `loading`

**Логика:**
1. Загрузить университеты (mock или API)
2. Применить фильтры
3. Отобразить результаты

### `/universities/[id]` (Детали)

**Файл:** `app/universities/[id]/page.tsx`

- Полная информация об университете
- Требования для поступления
- Список специальностей
- CTA для чата

**Логика:**
1. Получить ID из URL параметров
2. Загрузить университет
3. Отобразить детали

### `/chat` (AI-чат)

**Файл:** `app/chat/page.tsx`

- История сообщений
- Ввод сообщения
- Mock AI ответы

**Логика:**
1. Инициализировать сессию
2. Отправить сообщение
3. Получить ответ
4. Добавить в историю

## State Management

Используется **React Hooks** (useState, useEffect):

```tsx
const [universities, setUniversities] = useState<University[]>([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState<UniversityFilters>({});
```

**Почему не Redux/Zustand?**
- Приложение небольшое
- Состояние локально в компонентах
- Легче добавить позже при необходимости

## Styling

**Tailwind CSS** - утилитарный подход:

```tsx
<div className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">
  Кнопка
</div>
```

**Цветовая палитра:**
- Primary: Blue-600 (#3B82F6)
- Secondary: Gray-200 (#E5E7EB)
- Text: Gray-900 (#111827)
- Border: Gray-100 (#F3F4F6)

## Data Flow

### Получение университетов

```
Page (universities/page.tsx)
  ↓
useEffect → universityService.getUniversities()
  ↓
API (services/api.ts)
  ↓
Backend (http://localhost:8000/api/universities)
  ↓
Response → setUniversities()
  ↓
Render UniversityCard × N
```

### Фильтрация

```
UniversityFilters Component
  ↓
handleFiltersChange(filters)
  ↓
Page: setFilteredUniversities(filtered)
  ↓
Render filtered cards
```

### Отправка сообщения в чат

```
ChatInput Component
  ↓
handleSendMessage(content)
  ↓
Add user message to state
  ↓
chatService.sendMessage(sessionId, content)
  ↓
Backend AI API
  ↓
Response → Add AI message to state
  ↓
Render ChatWindow
```

## Интеграция с Backend

### Шаг 1: Обновить API URL

**`.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Шаг 2: Раскомментировать API вызовы

**`services/api.ts`:**
```typescript
// Было:
// const data = await universityService.getUniversities();

// Стало:
const data = await universityService.getUniversities();
```

### Шаг 3: Удалить mock данные

**`lib/mockData.ts`** - удалить или оставить для fallback

### Шаг 4: Тестировать

```bash
npm run dev
# Проверить Network tab в DevTools
# Убедиться, что запросы идут на backend
```

## Performance

### Оптимизации

- **Next.js Image** - для изображений (когда будут)
- **Dynamic imports** - для тяжелых компонентов
- **Lazy loading** - для списков
- **Memoization** - для дорогих вычислений

### Metrics

- **FCP** (First Contentful Paint) - < 1.5s
- **LCP** (Largest Contentful Paint) - < 2.5s
- **CLS** (Cumulative Layout Shift) - < 0.1

## Security

- ✅ TypeScript - типизация
- ✅ Input validation - на клиенте
- ✅ HTTPS - в production
- ✅ Environment variables - для API URL
- ✅ No sensitive data - в клиентском коде

## Testing

### Unit Tests (TODO)

```bash
npm install --save-dev jest @testing-library/react
npm test
```

### E2E Tests (TODO)

```bash
npm install --save-dev playwright
npx playwright test
```

## Deployment

### Vercel (рекомендуется)

```bash
npm install -g vercel
vercel
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

Установи в Vercel Dashboard:
```
NEXT_PUBLIC_API_URL=https://api.example.com
```

## Масштабирование

### Добавить новую страницу

1. Создать `app/new-page/page.tsx`
2. Добавить компоненты в `components/`
3. Добавить типы в `types/`
4. Добавить API в `services/`

### Добавить новый компонент

1. Создать в `components/ui/` или `components/domain/`
2. Экспортировать в `index.ts`
3. Использовать в pages

### Добавить новый сервис

1. Создать в `services/`
2. Экспортировать функции
3. Использовать в компонентах

## Best Practices

✅ **Компонентная архитектура** - переиспользуемые компоненты  
✅ **Разделение concerns** - UI, logic, types отдельно  
✅ **TypeScript** - полная типизация  
✅ **Tailwind CSS** - утилитарный стиль  
✅ **Clean code** - читаемый, поддерживаемый код  
✅ **Error handling** - try-catch в API вызовах  
✅ **Loading states** - UX feedback  
✅ **Responsive design** - mobile-first  

## Troubleshooting

### Ошибка: "Module not found"

Проверь:
- Правильный путь в импорте
- Файл существует
- Alias `@/` настроен в `tsconfig.json`

### API не работает

Проверь:
- Backend запущен на `http://localhost:8000`
- `NEXT_PUBLIC_API_URL` правильный
- CORS настроен на backend

### Стили не применяются

Проверь:
- Tailwind CSS установлен
- `tailwind.config.ts` правильный
- Классы используются правильно

---

**Архитектура готова к production!** 🚀
