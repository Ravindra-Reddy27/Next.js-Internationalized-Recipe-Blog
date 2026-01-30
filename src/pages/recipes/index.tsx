import { useState, useMemo } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { client, IRecipe } from '@/lib/contentful';
import Newsletter from '@/components/Newsletter';
import RecipeCard from '@/components/RecipeCard';

interface RecipesPageProps {
  recipes: IRecipe[];
  categories: string[];
}

export default function RecipesPage({ recipes, categories }: RecipesPageProps) {
  const { t } = useTranslation('common'); // ✅ Initialize hook
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Client-side filtering logic
  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const matchesSearch = recipe.fields.title.toLowerCase().includes(searchQuery.toLowerCase());
      // Logic: If category is empty string (All), return true. Else check tags.
      const matchesCategory = selectedCategory === '' || (recipe.fields.tags && recipe.fields.tags.includes(selectedCategory));
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, recipes]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{t('all_recipes')} | Recipe Blog</title>
        <meta name="description" content="Search and filter our complete collection of recipes." />
      </Head>

      {/* ✅ FIXED: Use translation key for Title */}
      <h1 className="text-4xl font-bold mb-8">{t('all_recipes')}</h1>

      {/* Search and Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search Input */}
        <input
          type="text"
          placeholder={t('search_placeholder') || 'Search recipes...'} // ✅ FIXED: Translation
          className="border p-2 rounded flex-1"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="search-input"
        />

        {/* Category Dropdown */}
        <select
          className="border p-2 rounded md:w-1/4"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          data-testid="category-filter"
        >
          {/* ✅ FIXED: Explicit value="" ensures correct reset logic */}
          <option value="">{t('all_categories') || 'All Categories'}</option>
          
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.sys.id} recipe={recipe} />
          ))
        ) : (
          // ✅ FIXED: Translation for empty state
          <p className="text-gray-500 col-span-3 text-center py-8">
            {t('no_recipes_found') || 'No recipes found matching your criteria.'}
          </p>
        )}
      </div>

      <div className="mt-12 border-t pt-8">
        <Newsletter />
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const contentfulLocale = locale === 'en' ? 'en-US' : locale;

  const res = await client.getEntries({
    content_type: 'recipe',
    locale: contentfulLocale,
  });

  const allTags = res.items.reduce((tags: string[], item: any) => {
    if (item.fields.tags) {
      item.fields.tags.forEach((tag: string) => {
        if (!tags.includes(tag)) tags.push(tag);
      });
    }
    return tags;
  }, []);

  return {
    props: {
      recipes: res.items,
      categories: allTags,
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
    revalidate: 60,
  };
};