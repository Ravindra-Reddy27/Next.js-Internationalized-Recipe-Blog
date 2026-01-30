// scripts/generate-sitemap.js
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');

const SITE_URL = 'http://localhost:3000'; // Base URL

const staticPages = [
  '',
  '/recipes',
];

const locales = ['en', 'es', 'fr'];

// Contentful Config
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

async function generateSitemap() {
  console.log('Generating sitemap...');

  // 1. Fetch Recipes from Contentful
  // Note: We don't ask for "locale=*", so Contentful sends the default locale flattened.
  const url = `https://cdn.contentful.com/spaces/${spaceId}/environments/master/entries?content_type=recipe&access_token=${accessToken}`;
  
  let recipeSlugs = [];
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items) {
      recipeSlugs = data.items
        .filter(item => item.fields.slug) // Ensure slug exists
        .map(item => item.fields.slug);   // <--- FIX: Access slug directly
    }
  } catch (error) {
    console.error('Error fetching recipes for sitemap:', error);
  }

  // 2. Build XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => {
    return locales.map(locale => {
      // Logic: 'en' is default (root), others get /es or /fr prefix
      const localePath = locale === 'en' ? '' : `/${locale}`;
      return `
  <url>
    <loc>${SITE_URL}${localePath}${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`;
    }).join('');
  }).join('')}

  ${recipeSlugs.map(slug => {
    return locales.map(locale => {
      const localePath = locale === 'en' ? '' : `/${locale}`;
      return `
  <url>
    <loc>${SITE_URL}${localePath}/recipes/${slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }).join('');
  }).join('')}
</urlset>`;

  // 3. Write to public folder
  fs.writeFileSync('public/sitemap.xml', sitemap);
  console.log('✅ sitemap.xml generated in public/sitemap.xml');
}

generateSitemap();