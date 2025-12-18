import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Найди свой <span className="text-blue-600">идеальный университет</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Агрегатор университетов мира. Сравнивай программы, требования и выбирай лучший вариант для своего будущего.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/universities">
              <Button variant="primary" size="lg">
                Смотреть университеты
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg">
                Спросить AI-ассистента
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Возможности платформы</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎓</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Каталог университетов</h3>
              <p className="text-gray-600">Полная информация о ведущих университетах мира с требованиями для поступления</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Фильтрация и поиск</h3>
              <p className="text-gray-600">Легко найди университеты по стране, специальности и другим критериям</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-ассистент</h3>
              <p className="text-gray-600">Получи персональные рекомендации и ответы на вопросы от AI</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Готов начать?</h2>
          <p className="text-lg mb-8 opacity-90">Исследуй лучшие университеты и найди свой путь к успеху</p>
          <Link href="/universities">
            <Button variant="secondary" size="lg">
              Начать поиск
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
