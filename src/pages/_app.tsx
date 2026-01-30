import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';
import { DefaultSeo } from 'next-seo'; 
import Navbar from '@/components/Navbar'; // ✅ Import Navbar

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <DefaultSeo
        titleTemplate="%s | Recipe Blog"
        defaultTitle="Recipe Blog"
        description="A delicious collection of recipes from around the world."
        openGraph={{
          type: 'website',
          locale: 'en_US',
          url: 'https://www.example.com/',
          site_name: 'Recipe Blog',
        }}
      />
      
      {/* ✅ Add Navbar Global Component Here */}
      <Navbar />
      
      <Component {...pageProps} />
    </>
  );
}

export default appWithTranslation(App);