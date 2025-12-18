# 🎨 Компоненты

## UI Компоненты

### Button

Переиспользуемая кнопка с вариантами.

**Props:**
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

**Примеры:**
```tsx
<Button variant="primary" size="lg">Основная кнопка</Button>
<Button variant="secondary" size="md">Вторичная</Button>
<Button variant="outline" size="sm">Контур</Button>
```

**Варианты:**
- `primary` - синяя, основная CTA
- `secondary` - серая, вторичная
- `outline` - контур, минимальный стиль

**Размеры:**
- `sm` - маленькая (px-3 py-1.5)
- `md` - средняя (px-4 py-2)
- `lg` - большая (px-6 py-3)

---

### Card

Контейнер с shadow и border.

**Props:**
```typescript
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
```

**Примеры:**
```tsx
<Card>Содержимое</Card>
<Card hover>Интерактивная карточка</Card>
<Card className="p-8">Кастомный padding</Card>
```

**Особенности:**
- Белый фон
- Мягкая тень
- Граница серая
- `hover` - добавляет эффект при наведении

---

### Input

Текстовое поле с label и error.

**Props:**
```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}
```

**Примеры:**
```tsx
<Input label="Email" placeholder="example@mail.com" />
<Input label="Пароль" type="password" error="Неверный пароль" />
<Input placeholder="Без label" />
```

**Особенности:**
- Label над полем
- Error сообщение красное
- Focus ring синий
- Плавный переход

---

### Select

Выпадающий список.

**Props:**
```typescript
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}
```

**Примеры:**
```tsx
<Select 
  label="Страна"
  options={[
    { value: 'usa', label: 'USA' },
    { value: 'uk', label: 'UK' }
  ]}
/>
```

**Особенности:**
- Label над полем
- Опция "Выберите опцию" по умолчанию
- Error сообщение
- Белый фон

---

## Domain Компоненты

### UniversityCard

Карточка университета.

**Props:**
```typescript
interface UniversityCardProps {
  university: University;
}
```

**Структура:**
```
┌─────────────────────┐
│   Градиент (синий)  │  ← Заголовок
├─────────────────────┤
│ Название            │
│ Страна              │
│ Описание (2 строки) │
│ Специальности       │
│ [Подробнее]         │
└─────────────────────┘
```

**Особенности:**
- Ссылка на `/universities/[id]`
- Hover эффект (shadow + border)
- Рейтинг в бейдже
- Первые 3 специальности + счетчик

**Пример:**
```tsx
<UniversityCard university={stanford} />
```

---

### UniversityFilters

Панель фильтрации.

**Props:**
```typescript
interface UniversityFiltersProps {
  onFiltersChange: (filters: UniversityFilters) => void;
}
```

**Фильтры:**
- Поиск по названию
- Выбор страны
- Выбор специальности
- Кнопки "Применить" и "Сбросить"

**Особенности:**
- Загружает фильтры из API (TODO)
- Mock данные для разработки
- Состояние в компоненте
- Callback при изменении

**Пример:**
```tsx
<UniversityFilters onFiltersChange={handleFiltersChange} />
```

---

### ChatMessage

Одно сообщение в чате.

**Props:**
```typescript
interface ChatMessageProps {
  message: Message;
}
```

**Структура:**
```
User:
┌──────────────────────┐
│ Мое сообщение        │  ← Синее, справа
│ 19:50                │
└──────────────────────┘