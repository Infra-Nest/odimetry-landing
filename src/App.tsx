import { Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { Layout } from "./components/layout/Layout";
import { Hero } from "./components/sections/Hero";
import { Problem } from "./components/sections/Problem";
import { Solution } from "./components/sections/Solution";
import { Features } from "./components/sections/Features";
import { Dashboard } from "./components/sections/Dashboard";
import { Target } from "./components/sections/Target";
import { Differentiators } from "./components/sections/Differentiators";
import { Pricing } from "./components/sections/Pricing";
import { FinalCTA } from "./components/sections/FinalCTA";
import { PrivacyPolicy } from "./components/sections/PrivacyPolicy";
import { TermsOfService } from "./components/sections/TermsOfService";
import { CookiePolicy } from "./components/sections/CookiePolicy";
import { SignUp } from "./components/sections/SignUp";
import { ScansList } from "./components/sections/ScansList";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Hero />
              <Problem />
              <Solution />
              <Features />
              <Dashboard />
              <Target />
              <Differentiators />
              <Pricing />
              <FinalCTA />
            </Layout>
          }
        />
        <Route
          path="/privacy"
          element={
            <Layout>
              <PrivacyPolicy />
            </Layout>
          }
        />
        <Route
          path="/terms"
          element={
            <Layout>
              <TermsOfService />
            </Layout>
          }
        />
        <Route
          path="/cookies"
          element={
            <Layout>
              <CookiePolicy />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <SignUp />
            </Layout>
          }
        />
        {/* TODO: Wrap in <ProtectedRoute> once AuthContext is implemented.
            Requires Bearer authentication to work.
        */}
        <Route
          path="/scans"
          element={
            <Layout>
              <ScansList />
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
