import type { ReactNode } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthenticatedLayout } from './components/layout/AuthenticatedLayout';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { CookiePolicy } from './components/sections/CookiePolicy';
import { Dashboard as DashboardSection } from './components/sections/Dashboard';
import { DashboardHome } from './components/sections/DashboardHome';
import { Differentiators } from './components/sections/Differentiators';
import { Features } from './components/sections/Features';
import { FinalCTA } from './components/sections/FinalCTA';
import { Hero } from './components/sections/Hero';
import { Login } from './components/sections/Login';
import { Assets } from './components/sections/Assets';
import { CreateAsset } from './components/sections/CreateAsset';
import { Pricing } from './components/sections/Pricing';
import { PrivacyPolicy } from './components/sections/PrivacyPolicy';
import { Problem } from './components/sections/Problem';
import { ProfilePage } from './components/sections/ProfilePage';
import { ScansList } from './components/sections/ScansList';
import { SettingsPage } from './components/sections/SettingsPage';
import { SignUp } from './components/sections/SignUp';
import { Solution } from './components/sections/Solution';
import { Target } from './components/sections/Target';
import { TermsOfService } from './components/sections/TermsOfService';

const withPublicLayout = (children: ReactNode) => <Layout>{children}</Layout>;

const withAuthenticatedLayout = (children: ReactNode) => (
  <ProtectedRoute>
    <AuthenticatedLayout>{children}</AuthenticatedLayout>
  </ProtectedRoute>
);

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={withPublicLayout(
            <>
              <Hero />
              <Problem />
              <Solution />
              <Features />
              <DashboardSection />
              <Target />
              <Differentiators />
              <Pricing />
              <FinalCTA />
            </>,
          )}
        />
        <Route
          path="/privacy"
          element={withPublicLayout(<PrivacyPolicy />)}
        />
        <Route path="/terms" element={withPublicLayout(<TermsOfService />)} />
        <Route path="/cookies" element={withPublicLayout(<CookiePolicy />)} />
        <Route path="/signup" element={withPublicLayout(<SignUp />)} />
        <Route path="/login" element={withPublicLayout(<Login />)} />

        <Route
          path="/dashboard"
          element={withAuthenticatedLayout(<DashboardHome />)}
        />
        <Route
          path="/scans"
          element={withAuthenticatedLayout(<ScansList />)}
        />
        <Route
          path="/settings"
          element={withAuthenticatedLayout(<SettingsPage />)}
        />
        <Route
          path="/profile"
          element={withAuthenticatedLayout(<ProfilePage />)}
        />
      <Route path="/login" element={
        <Layout>
          <Login />
        </Layout>
      } />
      <Route path="/assets" element={
        <Layout>
          <Assets />
        </Layout>
      } />
      <Route path="/assets/new" element={
        <Layout>
          <CreateAsset />
        </Layout>
      } />
      </Routes>
    </>
  );
}

export default App;
