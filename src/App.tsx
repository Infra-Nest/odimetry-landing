import { useEffect, type ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ScrollToTop } from './components/ScrollToTop';
import { SEO } from './components/SEO';
import { Layout } from './components/layout/Layout';
import { Dashboard as DashboardSection } from './components/sections/Dashboard';
import { FinalCTA } from './components/sections/FinalCTA';
import { Hero } from './components/sections/Hero';
import { ProductFAQ } from './components/sections/ProductFAQ';
import { ensureLocale } from './i18n/config';
import { useLocale } from './i18n/localeRouting';
import type { Locale } from './seo/site';

const withPublicLayout = (children: ReactNode) => <Layout>{children}</Layout>;

const LandingPage = () => (
  <>
    <Hero />
    <DashboardSection />
    <FinalCTA />
    <ProductFAQ />
  </>
);

/** Keeps i18n and <html lang> aligned with the URL locale. */
const LocaleSync = ({ locale }: { locale: Locale }) => {
  const { i18n } = useTranslation();

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await ensureLocale(locale);
      if (cancelled) return;
      if (i18n.language !== locale) {
        await i18n.changeLanguage(locale);
      }
      document.documentElement.lang = locale;
    })();

    return () => {
      cancelled = true;
    };
  }, [i18n, locale]);

  return null;
};

function App() {
  const { pathname } = useLocation();
  const locale = useLocale();

  return (
    <>
      <ScrollToTop />
      <LocaleSync locale={locale} />
      <SEO />
      <Routes>
        <Route path="/" element={withPublicLayout(<LandingPage />)} />
        <Route path="/en" element={withPublicLayout(<LandingPage />)} />
        <Route path="/fr" element={withPublicLayout(<LandingPage />)} />
        <Route path="/de" element={withPublicLayout(<LandingPage />)} />
        <Route path="/es" element={<Navigate to="/" replace />} />
      </Routes>
      <Analytics />
      <SpeedInsights route={pathname} />
    </>
  );
}

export default App;
