import { useState, useRef, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';

export const Header = () => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleNavClick = (hash: string) => {
    setIsMobileMenuOpen(false); // Cerrar el menú móvil al hacer clic
    const targetPath = `/#${hash}`;
    const targetHash = `#${hash}`;
    
    // Solo aplicar offset en móvil (64px de altura del header)
    const isMobile = window.innerWidth < 768;
    const headerHeight = 64;
    
    if (location.pathname === '/') {
      // Si ya estamos en la página principal
      if (location.hash === targetHash) {
        // Si ya estamos en el mismo hash, solo hacer scroll
        const element = document.getElementById(hash);
        if (element) {
          if (isMobile) {
            // En móvil, aplicar offset
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          } else {
            // En desktop, scroll normal
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        // Actualizar el hash en la URL usando navigate
        navigate(targetPath, { replace: true });
        // Hacer scroll al elemento
        setTimeout(() => {
          const element = document.getElementById(hash);
          if (element) {
            if (isMobile) {
              // En móvil, aplicar offset
              const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
              const offsetPosition = elementPosition - headerHeight;
              window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
              });
            } else {
              // En desktop, scroll normal
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }
        }, 50);
      }
    } else {
      // Si estamos en otra ruta, navegar a la raíz con el hash
      navigate(targetPath);
      // ScrollToTop manejará el scroll automáticamente
    }
  };

  // Cerrar el menú móvil al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50 transition-colors duration-300 backdrop-blur-sm" role="banner">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Shield className="w-8 h-8 text-blue-400" aria-hidden="true" />
            <span className="text-xl md:text-2xl font-bold text-gray-100">
              Odimetry
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Navegación principal">
            <button 
              onClick={() => handleNavClick('features')}
              className="text-gray-300 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              {translate('header.features')}
            </button>
            <button 
              onClick={() => handleNavClick('pricing')}
              className="text-gray-300 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
            >
              {translate('header.pricing')}
            </button>
            {isAuthenticated ? (
              <Button
                variant="secondary"
                size="sm"
                aria-label={translate('header.goToPanel')}
                onClick={() => navigate('/dashboard')}
              >
                {translate('header.goToPanel')}
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  aria-label="Iniciar sesión"
                  onClick={() => navigate('/login')}
                >
                  {translate('header.login')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  aria-label={translate('header.startTrial')}
                  onClick={() => navigate('/signup')}
                >
                  {translate('header.startTrial')}
                </Button>
              </>
            )}
            <LanguageSelector />
          </nav>
          <div className="md:hidden flex items-center space-x-2 relative" ref={mobileMenuRef}>
            <LanguageSelector />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950"
              aria-label={translate('header.menu')}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            
            {isMobileMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                <div className="py-2" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleNavClick('features')}
                    className="w-full flex items-center px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
                    role="menuitem"
                  >
                    {translate('header.features')}
                  </button>
                  <button
                    onClick={() => handleNavClick('pricing')}
                    className="w-full flex items-center px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
                    role="menuitem"
                  >
                    {translate('header.pricing')}
                  </button>
                  <div className="border-t border-gray-700 my-1"></div>
                  {isAuthenticated ? (
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        navigate('/dashboard');
                      }}
                      className="w-full flex items-center px-4 py-2 text-left bg-gray-700 hover:bg-gray-600 text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded font-medium"
                      role="menuitem"
                    >
                      {translate('header.goToPanel')}
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/login');
                        }}
                        className="w-full flex items-center px-4 py-2 text-left bg-gray-700 hover:bg-gray-600 text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset rounded font-medium"
                        role="menuitem"
                      >
                        {translate('header.login')}
                      </button>
                      <div className="border-t border-gray-700 my-1"></div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          navigate('/signup');
                        }}
                        className="w-full flex items-center px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-inset"
                        role="menuitem"
                      >
                        {translate('header.startTrial')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
};
