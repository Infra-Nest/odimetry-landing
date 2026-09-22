import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { t: translate } = useTranslation();

  return (
    <div className="odimetry-page min-h-screen flex flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="odimetry-skip-link sr-only focus:not-sr-only"
      >
        {translate('header.skipToContent')}
      </a>
      <Header />
      <main id="main-content" className="grow" role="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
