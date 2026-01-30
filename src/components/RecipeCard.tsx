import Link from 'next/link';
import Image from 'next/image';
import { IRecipe } from '@/lib/contentful';
import { useTranslation } from 'next-i18next';

interface RecipeCardProps {
  recipe: IRecipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  const { t } = useTranslation('common');
  const { title, slug, featuredImage, tags } = recipe.fields;
  const imageUrl = featuredImage ? `https:${featuredImage.fields.file.url}` : '';

  return (
    <div 
      // ✅ CHANGED: Added bg-blue-50 and border-blue-200 for the requested blue look
      className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition flex flex-col h-full" 
      data-testid="recipe-card"
    >
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{title}</h2>
        
        {tags && (
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((tag) => (
              // ✅ CHANGED: White badge to contrast with blue card
              <span key={tag} className="text-xs bg-white text-blue-600 border border-blue-100 px-2 py-1 rounded font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-blue-100">
          <Link 
            href={`/recipes/${slug}`}
            className="text-blue-700 hover:text-blue-900 font-bold hover:underline inline-flex items-center"
          >
            {t('view_recipe')} →
          </Link>
        </div>
      </div>
    </div>
  );
}