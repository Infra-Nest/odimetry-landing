import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { LanguageSelector } from '../ui/LanguageSelector';

export const Header = () => {
  const { t: translate } = useTranslation();
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
            <a href="/#ejemplo" onClick={() => setIsMobileMenuOpen(false)}>
              {translate('header.example')}
            </a>
            <a className="odimetry-button odimetry-button--primary" href="/#interest">
              {translate('header.interest')}
            </a>
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
                <a href="/#ejemplo" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('header.example')}
                </a>
                <div className="odimetry-mobile-menu__rule" />
                <a href="/#interest" onClick={() => setIsMobileMenuOpen(false)}>
                  {translate('header.interest')}
                </a>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
