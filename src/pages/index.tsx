import Head from 'next/head';
import Newsletter from '@/components/Newsletter';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { client, IRecipe } from '@/lib/contentful';
import RecipeCard from '@/components/RecipeCard';

interface HomeProps {
  recipes: IRecipe[];
}

export default function Home({ recipes }: HomeProps) {
  const { t } = useTranslation('common');

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Recipe Blog - Find the Best Recipes</title>
        <meta name="description" content="Browse our collection of delicious recipes from around the world." />
      </Head>

      {/* Hero Section */}
      <div className="text-center mb-12">
        {/* Main Title */}
        <h1 className="text-4xl font-bold mb-4">{t('search_placeholder')}</h1>
        
        {/* Subtitle */}
        <p className="text-gray-600 text-lg">
            {t('hero_subtitle') || 'Discover delicious meals for any occasion.'}
        </p>
      </div>

      {/* Featured Recipes Grid */}
      <div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        data-testid="featured-recipes"
      >
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.sys.id} recipe={recipe} />
        ))}
      </div>

      <div className="mt-12 border-t pt-8">
        <Newsletter />
      </div>
    </div>
  );
}

// ... (getStaticProps remains exactly the same)
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const contentfulLocale = locale === 'en' ? 'en-US' : locale;

  try {
    const res = await client.getEntries({
      content_type: 'recipe',
      'fields.isFeatured': true,
      locale: contentfulLocale,
    });

    return {
      props: {
        recipes: res.items,
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`Error fetching recipes for locale ${locale}:`, error);
    return {
      props: {
        recipes: [],
        ...(await serverSideTranslations(locale ?? 'en', ['common'])),
      },
    };
  }
};