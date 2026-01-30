import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LanguageSwitcher() {
  const router = useRouter();
  const { pathname, asPath, query } = router;

  return (
    // ✅ CHANGED: Removed "mb-4" so it aligns perfectly with the Navbar button
    <div className="flex gap-4" data-testid="language-switcher">
      {router.locales?.map((locale) => (
        <Link
          key={locale}
          href={{ pathname, query }}
          as={asPath}
          locale={locale}
          className={`px-3 py-1 rounded border transition ${
            router.locale === locale 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}