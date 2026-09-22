import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Sidebar } from './Sidebar';

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export const AuthenticatedLayout = ({
  children,
}: AuthenticatedLayoutProps) => {
  const { t: translate } = useTranslation();
  const [isCollapsed, setIsCollapsed] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024,
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <a
        href="#app-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
      >
        {translate('header.skipToContent')}
      </a>

      <div className="flex min-h-screen">
        <Sidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />

        <main id="app-main-content" className="min-w-0 flex-1" role="main">
          {children}
        </main>
      </div>
    </div>
  );
};
