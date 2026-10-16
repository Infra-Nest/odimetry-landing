import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { SEO } from './components/SEO';
import { Layout } from './components/layout/Layout';
import { Dashboard as DashboardSection } from './components/sections/Dashboard';
import { FinalCTA } from './components/sections/FinalCTA';
import { Hero } from './components/sections/Hero';
import { ProductFAQ } from './components/sections/ProductFAQ';

const withPublicLayout = (children: ReactNode) => <Layout>{children}</Layout>;

function App() {
  return (
    <>
      <ScrollToTop />
      <SEO />
      <Routes>
        <Route
          path="/"
          element={withPublicLayout(
            <>
              <Hero />
              <DashboardSection />
              <FinalCTA />
              <ProductFAQ />
            </>,
          )}
        />
      </Routes>
    </>
  );
}

export default App;
