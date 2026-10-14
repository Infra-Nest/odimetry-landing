import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { t: translate } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
      requestAnimationFrame(() => {
        mobileMenuRef.current
          ?.querySelector<HTMLElement>('#odimetry-mobile-menu a, #odimetry-mobile-menu button')
          ?.focus();
      });
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="odimetry-header" role="banner">
      <Container className="odimetry-container">
        <div className="odimetry-header__inner">
          <Link to="/" className="odimetry-brand" aria-label={translate('header.home')}>
            <img
              src="/brand/odimetry-mark.svg"
              width="40"
              height="40"
              fetchPriority="high"
              alt=""
              aria-hidden="true"
            />
            <span translate="no">Odimetry</span>
          </Link>

          <nav className="odimetry-nav" aria-label={translate('header.navigation')}>
            <a href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
              {translate('header.howItWorks')}
            </a>
            <a href="/#features" onClick={() => setIsMobileMenuOpen(false)}>
              {translate('header.features')}
            </a>
            <a href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>
              {translate('header.pricing')}
            </a>
            {isAuthenticated ? (
              <Link
                className="odimetry-button odimetry-button--quiet"
                to="/dashboard"
              >
                {translate('header.goToPanel')}
              </Link>
            ) : (
              <>
                <Link
                  className="odimetry-button odimetry-button--quiet"
                  to="/login"
                >
                  {translate('header.login')}
                </Link>
                <Link
                  className="odimetry-button odimetry-button--primary"
                  to="/signup"
                >
                  {translate('header.startTrial')}
                </Link>
              </>
            )}
            <LanguageSelector />
          </nav>

          <div className="odimetry-header__mobile" ref={mobileMenuRef}>
            <LanguageSelector />
            <button
              type="button"
              ref={mobileMenuButtonRef}
              className="odimetry-menu-button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-label={translate('header.menu')}
              aria-expanded={isMobileMenuOpen}
              aria-controls="odimetry-mobile-menu"
            >
              {isMobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>

            {isMobileMenuOpen && (
              <div id="odimetry-mobile-menu" className="odimetry-mobile-menu">
                <a href="/#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('header.howItWorks')}
                </a>
                <a href="/#features" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('header.features')}
                </a>
                <a href="/#pricing" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('header.pricing')}
                </a>
                <div className="odimetry-mobile-menu__rule" />
                {isAuthenticated ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    {translate('header.goToPanel')}
                  </Link>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      {translate('header.login')}
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      {translate('header.startTrial')}
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
