import { GetStaticPaths, GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { client, IRecipe } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Newsletter from '@/components/Newsletter';
import SocialShare from '@/components/SocialShare';
import { NextSeo } from 'next-seo'; 

// --- HELPER: Extract YouTube ID safely ---
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

interface RecipeProps {
  recipe: IRecipe;
}

export default function RecipeDetail({ recipe }: RecipeProps) {
  const router = useRouter();
  const { t } = useTranslation('common');
  
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const currentUrl = typeof window !== 'undefined' 
    ? window.location.href 
    : `http://localhost:3000/recipes/${recipe.fields.slug}`;

  const imageUrl = recipe.fields.featuredImage 
    ? `https:${recipe.fields.featuredImage.fields.file.url}`
    : '';

  const videoId = recipe.fields.videoUrl ? getYoutubeId(recipe.fields.videoUrl) : null;

  return (
    <div className="container mx-auto px-4 py-8">
      <NextSeo
        title={recipe.fields.title}
        description={`Check out this delicious recipe for ${recipe.fields.title}`}
        openGraph={{
          title: recipe.fields.title,
          description: `Learn how to make ${recipe.fields.title}`,
          url: currentUrl,
          images: [{ url: imageUrl, alt: recipe.fields.title }],
        }}
      />

      <div className="max-w-3xl mx-auto flex justify-between items-center mb-6 print:hidden">
        <Link href="/recipes" className="text-blue-600 hover:underline">
          &larr; {t('back_to_recipes') || 'Back to Recipes'}
        </Link>
      </div>

      <article className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        {recipe.fields.featuredImage && (
          <div className="relative h-64 md:h-96 w-full">
            <Image
              src={imageUrl}
              alt={recipe.fields.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-8">
          {/* HEADER SECTION */}
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-bold text-gray-900" data-testid="recipe-title">
                {recipe.fields.title}
              </h1>
              
              <div className="ml-4 flex-shrink-0 print:hidden">
                <SocialShare url={currentUrl} title={recipe.fields.title} />
              </div>
            </div>

            {recipe.fields.author && recipe.fields.author.fields && (
              <p className="text-gray-500 mt-2 text-lg">
                By <span className="font-semibold text-gray-800">{recipe.fields.author.fields.name}</span>
              </p>
            )}
          </div>

          {/* METADATA ROW */}
          <div className="flex flex-wrap gap-4 mb-8 text-sm text-gray-700">
            {recipe.fields.cookingTime && (
              <span className="bg-gray-100 px-3 py-1 rounded flex items-center">
                ⏱️ {recipe.fields.cookingTime} {t('minutes_label') || 'mins'}
              </span>
            )}
            
            {recipe.fields.difficulty && (
              <span className="bg-gray-100 px-3 py-1 rounded flex items-center">
                📊 {recipe.fields.difficulty}
              </span>
            )}

            {recipe.fields.cuisine && recipe.fields.cuisine.fields && (
              <span className="bg-blue-50 px-3 py-1 rounded flex items-center text-blue-800 font-medium">
                🍽️ {recipe.fields.cuisine.fields.name}
              </span>
            )}
          </div>

          {/* 1. DESCRIPTION SECTION */}
          {recipe.fields.description && (
            <div className="mb-12 text-gray-700 leading-relaxed text-lg border-l-4 border-blue-200 pl-4">
              {documentToReactComponents(recipe.fields.description)}
            </div>
          )}

          {/* 2. INGREDIENTS SECTION */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2" data-testid="ingredients-heading">
              {t('ingredients_heading')}
            </h2>
            <div data-testid="recipe-ingredients" className="prose max-w-none text-gray-700">
              {documentToReactComponents(recipe.fields.ingredients)}
            </div>
          </section>

          {/* 3. INSTRUCTIONS SECTION */}
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              {t('instructions_heading')}
            </h2>
            <div data-testid="recipe-instructions" className="prose max-w-none text-gray-700">
              {documentToReactComponents(recipe.fields.instructions)}
            </div>
          </section>

          {/* 4. VIDEO SECTION (Moved to Bottom) */}
          {videoId && (
            <div className="mb-12 pt-8 border-t border-gray-100">
              <h2 className="text-xl font-semibold mb-4">Video Tutorial</h2>
              <div className="relative pt-[56.25%] bg-black rounded overflow-hidden shadow-md">
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  className="absolute top-0 left-0 w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* COMMENTS SECTION */}
      <div className="max-w-3xl mx-auto mt-12 print:hidden" data-testid="comments-list">
        <h3 className="text-2xl font-bold mb-4">Comments</h3>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <p className="font-semibold">Foodie Fan</p>
          <p className="text-gray-600">This looks delicious! Can't wait to try it.</p>
        </div>
        <div className="bg-gray-50 p-4 rounded">
          <p className="font-semibold">Chef John</p>
          <p className="text-gray-600">Great recipe. I added a bit more salt and it was perfect.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 print:hidden">
        <Newsletter />
      </div>

      <style jsx global>{`
        @media print {
          body { background: white; }
          .container { width: 100%; max-width: none; padding: 0; }
          .shadow-lg { box-shadow: none; }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}

// ... GetStaticPaths and GetStaticProps remain the same ...
export const getStaticPaths: GetStaticPaths = async ({ locales }) => {
  const paths: { params: { slug: string }; locale: string }[] = [];
  for (const locale of locales || ['en']) {
    const contentfulLocale = locale === 'en' ? 'en-US' : locale;
    const res = await client.getEntries({
      content_type: 'recipe',
      locale: contentfulLocale,
      select: ['fields.slug'],
    });
    res.items.forEach((item: any) => {
      if (item.fields.slug) {
        paths.push({
          params: { slug: item.fields.slug },
          locale,
        });
      }
    });
  }
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  const contentfulLocale = locale === 'en' ? 'en-US' : locale;
  const res = await client.getEntries({
    content_type: 'recipe',
    'fields.slug': params?.slug,
    locale: contentfulLocale,
    limit: 1,
    include: 2,
  });

  if (!res.items.length) {
    return { notFound: true };
  }

  return {
    props: {
      recipe: res.items[0],
      ...(await serverSideTranslations(locale ?? 'en', ['common'])),
    },
    revalidate: 60,
  };
};