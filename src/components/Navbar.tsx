import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'next-i18next';

export default function Navbar() {
  const { t } = useTranslation('common');

  return (
    <nav className="bg-white border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo / Home Link */}
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition flex items-center gap-2">
          <span>Recipe Blog</span>
          <span className="text-2xl">🍳</span>
        </Link>

        {/* Navigation Links & Lang Switcher */}
        <div className="flex items-center gap-6">
          {/* ✅ CHANGED: Turned text link into a Blue Button */}
          <Link 
            href="/recipes" 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm hidden md:block"
          >
            {t('all_recipes') || 'All Recipes'}
          </Link>
          
          <div className="h-6 w-px bg-gray-200 hidden md:block"></div>
          
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  );
}