
Readme · MD
Copy

# Next.js Next.js Internationalized Recipe Blog

A modern, fully containerized recipe blog application built with Next.js, TypeScript, and Tailwind CSS, powered by Contentful as the Headless CMS. This project demonstrates a production-ready architecture featuring Static Site Generation (SSG), Internationalization (i18n), SEO optimization, and Docker orchestration.

---

## 🚀 Features

- **Static Site Generation (SSG)** - High-performance pages pre-rendered at build time
- **Internationalization (i18n)** - Full support for English, Spanish, and French
- **Headless CMS Integration** - Dynamic content fetched from Contentful
- **Client-Side Filtering** - Real-time search and category filtering
- **SEO & Sitemap** - Automated sitemap generation and optimized meta tags
- **Responsive UI** - Mobile-friendly design with Tailwind CSS
- **Dockerized** - Fully containerized with multi-stage builds and health checks

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js (Pages Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| CMS | Contentful |
| State Management | React Hooks |
| Containerization | Docker & Docker Compose |
| i18n | next-i18next |
| SEO | next-seo |

---

## 📋 Prerequisites

- Docker and Docker Compose installed on your machine
- A Contentful account with a space containing the recipe content model

---

## ⚙️ Environment Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Ravindra-Reddy27/Next.js-Internationalized-Recipe-Blog.git
cd Next.js-Internationalized-Recipe-Blog
```

### 2. Create Environment File

```bash
cp .env.example .env.local
```

### 3. Configure Variables

Open `.env.local` and add your Contentful credentials:

```env
# Contentful Configuration
CMS_PROVIDER=contentful
CONTENTFUL_SPACE_ID=your_actual_space_id
CONTENTFUL_ACCESS_TOKEN=your_actual_access_token
```
---

### Step 1: Create the "Blueprints" (Content Models)
Before you can write a recipe, you need to tell Contentful what a "Recipe" is. Based on your screenshot, you need to create 4 separate Content Models.
1. Go to the "Content Model" tab at the top.
2. Create these 4 models:
   * Author: To store people like "Maximus Decimus Meridius".
   * Category: To store groups like "Dinner".
   * Recipe: The main form for the dish itself.
   * Tag: To store labels.

### Step 2: Add Fields to the Models
Now you need to add specific fields to each model so they can hold the data shown in your blog screenshots.

#### A. The "Recipe" Model
This is the most important one. Open the Recipe model and add these fields exactly as seen in your screenshot:
* Title (Short Text)
* Slug (Short Text)
* Description (Rich Text)
* Ingredients (Rich Text)
* Instructions (Rich Text)
* Featured Image (Media)
* Cooking Time (Integer)
* Is Featured (Boolean)
* Video URL (Short Text)
* Difficulty (Short Text)
* Cuisine (Reference)
* Author (Reference)
* Tag References (References, many): Links to the "Tag" model (e.g., "Dinner").

#### B. The "Author" Model
Open the Author model and add these fields:
* Name (Short Text)
* Bio (Rich Text)
* Avatar (Media)

#### C. The "Category" & "Tag" Models
Open these models and add:
* Name (Short Text)
* Slug (Short Text)
### Step 3: Fill in the Content (Create Entries)
Now that the forms are designed, you can create the actual Paella page.
1. Go to the "Content" tab.
2. Create the Helper Entries First:
   * Add Author: Create an entry named "Maximus Decimus Meridius" and publish it.
   * Add Tag: Create an entry named "Dinner" and publish it.
3. Create the Recipe Entry:
   * Click "Add Recipe".
   * Title: Type "Paella".
   * Featured Image: Upload the photo of the paella pan.
   * Author: Click "Link existing entry" and select "Maximus".
   * Tags: Link the "Dinner" tag.
   * Description: Paste the French/Spanish text shown in your screenshots.
   * Cooking Time: Enter "30".
   * Difficulty: Enter "Medium".

### Step 4: Publish!
This is the most critical step. After filling out the form, look at the sidebar status.
* If it says "Draft" (yellow), your website cannot see it.
* You must click the green "Publish" button so the status changes to "Published" (green).

---

## Quick Start (Docker)

Run the application with a single command:

```bash
docker-compose up --build
```

**Access the App:**
```
http://localhost:3000
```

**Stop the App:**
```bash
docker-compose down
```

---

---

## 🏗️ Architectural Decisions

### 1. Static Site Generation (SSG)

- **Why?** Recipe content changes infrequently; SSG provides optimal performance and SEO
- **Implementation:** `getStaticProps` & `getStaticPaths` for Homepage and Recipe Detail pages
- **Revalidation:** Configured with ISR (`revalidate: 60`) for seamless content updates

### 2. Docker Architecture

- **Multi-Stage Build** - Lightweight Alpine Linux-based image
- **Standalone Mode** - Minimized production bundle size
- **Health Checks** - Ensures service readiness before accepting traffic

### 3. Internationalization (i18n)

- **Routing:** Seamless language switching (`/fr/recipes`, `/es/recipes`)
- **Structure:** Translation files in `public/locales/{lang}/common.json`
- **Extensibility:** Easy to add new languages

### 4. SEO & Sitemap

- **Automated Generation:** Custom script fetches dynamic slugs from Contentful
- **Multi-locale Support:** Comprehensive sitemap for all language variants
- **Search Engine Optimization:** Dynamic meta tags via next-seo

---

## 📂 Project Structure

```
.
├── public/
│   └── locales/          # JSON translation files (en, es, fr)
├── scripts/
│   └── generate-sitemap.js
├── src/
│   ├── components/       # Reusable UI components
│   ├── lib/              # Contentful client configuration
│   ├── pages/            # Next.js routing
│   │   ├── recipes/      # Recipe listing & detail pages
│   │   ├── _app.tsx      # Global layout & SEO
│   │   └── index.tsx     # Homepage
│   └── styles/           # Global CSS & Tailwind
├── .env.example          # Environment template
├── docker-compose.yml    # Docker orchestration
├── Dockerfile            # Container image
├── next.config.js        # Next.js & i18n config
└── README.md
```

---

## ✅ Verification Checklist

### Containerization
- [ ] Run `docker-compose up --build` 
- [ ] App accessible at `http://localhost:3000`

### Routes
- [ ] `/` - Homepage with featured recipes
- [ ] `/recipes` - Recipe listing with search & filter
- [ ] `/recipes/[slug]` - Recipe detail with video & instructions

### Internationalization
- [ ] Click language buttons (EN/ES/FR) in Navbar
- [ ] Verify content switches to selected language

### SEO
- [ ] View page source for dynamic meta tags
- [ ] Check `/sitemap.xml` for all routes

---
