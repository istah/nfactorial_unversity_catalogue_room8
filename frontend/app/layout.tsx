import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'University Aggregator - Найди свой университет',
  description: 'Агрегатор университетов мира. Сравнивай программы, требования и выбирай лучший вариант для своего будущего.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold text-blue-600">🎓</span>
                <span className="text-xl font-bold text-gray-900">UniCatalog</span>
              </Link>

              <div className="flex items-center gap-8">
                <Link href="/universities" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  Университеты
                </Link>
                <Link href="/chat" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                  AI-ассистент
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <h3 className="text-white font-bold mb-4">UniCatalog</h3>
                <p className="text-sm">Агрегатор университетов мира для абитуриентов</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Навигация</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="hover:text-white transition-colors">
                      Главная
                    </Link>
                  </li>
                  <li>
                    <Link href="/universities" className="hover:text-white transition-colors">
                      Университеты
                    </Link>
                  </li>
                  <li>
                    <Link href="/chat" className="hover:text-white transition-colors">
                      AI-ассистент
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Информация</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      О проекте
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Контакты
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Контакты</h4>
                <p className="text-sm">Email: info@unicatalog.com</p>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center text-sm">
              <p>&copy; 2024 UniCatalog. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
