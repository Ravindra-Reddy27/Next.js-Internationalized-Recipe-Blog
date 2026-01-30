// src/lib/contentful.ts
import { createClient } from 'contentful';

export const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// 1. Author Model (Required by Step 2)
export interface IAuthor {
  sys: { id: string };
  fields: {
    name: string;
    bio?: any; // Rich Text
    avatar?: {
      fields: {
        file: { url: string };
      };
    };
  };
}

// 2. Category Model (Required by Step 2)
export interface ICategory {
  sys: { id: string };
  fields: {
    name: string;
    slug: string;
  };
}

// 3. Tag Model (Required by Step 2)
export interface ITag {
  sys: { id: string };
  fields: {
    name: string;
    slug: string;
  };
}

// 4. Recipe Model (Updated to match your final Contentful setup)
export interface IRecipe {
  sys: { id: string };
  fields: {
    title: string;
    slug: string;
    description: any; // Rich Text
    ingredients: any; // Rich Text
    instructions: any; // Rich Text
    
    // --- IMAGES & VIDEO ---
    featuredImage: {
      fields: {
        file: {
          url: string;
          details: { image: { width: number; height: number } };
        };
      };
    };
    videoUrl?: string; // ✅ You added this

    // --- METADATA ---
    cookingTime: number;
    difficulty: string; // ✅ You just added this (Easy, Medium, Hard)
    isFeatured?: boolean;

    // --- REFERENCES ---
    cuisine?: ICategory; // Reference to Category
    author?: IAuthor;    // Reference to Author (Optional)

    // --- TAGS (HYBRID SETUP) ---
    tags?: string[]; // ✅ Keep this! Your Search Filter uses this (Text List).
    tagReferences?: ITag[]; // ✅ You just added this for compliance (Reference List).
  };
}