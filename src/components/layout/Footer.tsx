import { Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Footer = () => {
  const { t: translate } = useTranslation();
  const location = useLocation();

  const handleLinkClick = (targetPath: string) => {
    // Si vamos a cambiar de ruta, NO hacer scroll aquí - dejar que ScrollToTop lo maneje
    // El problema es que hacer scroll aquí interfiere con el scroll de ScrollToTop
    if (targetPath === location.pathname) {
      // Si ya estamos en esa ruta, scroll suave
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // ScrollToTop manejará el scroll cuando cambie la ruta
  };

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-900" role="contentinfo">
      <Container>
        <div className="py-10 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 sm:gap-10 md:gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3 sm:mb-4">
                <Shield className="w-6 h-6 text-blue-400" aria-hidden="true" />
                <span className="text-lg sm:text-xl font-bold text-white">Odimetry</span>
              </div>
              <p className="text-gray-400 text-sm sm:text-base max-w-md mx-auto md:mx-0 leading-relaxed">
                {translate('footer.description')}
              </p>
            </div>

            {/* Legal */}
            <nav aria-label="Enlaces legales" className="mt-6 md:mt-0 text-center md:text-left">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{translate('footer.legal')}</h3>
              <ul className="space-y-2.5 sm:space-y-2 text-sm sm:text-base">
                <li>
                  <Link 
                    to="/privacy" 
                    onClick={() => handleLinkClick('/privacy')}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
                  >
                    {translate('footer.privacy')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/terms" 
                    onClick={() => handleLinkClick('/terms')}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
                  >
                    {translate('footer.terms')}
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/cookies" 
                    onClick={() => handleLinkClick('/cookies')}
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
                  >
                    {translate('footer.cookies')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contacto */}
            <nav aria-label="Información de contacto" className="mt-6 md:mt-0 text-center md:text-left">
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{translate('footer.contact')}</h3>
              <ul className="space-y-2.5 sm:space-y-2 text-sm sm:text-base">
                <li>
                  <a 
                    href="mailto:contacto@odimetry.com" 
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1 break-all"
                  >
                    contacto@odimetry.com
                  </a>
                </li>
                <li>
                  <a 
                    href="#support" 
                    className="hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-1"
                  >
                    {translate('footer.support')}
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-10 md:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Odimetry. {translate('footer.copyright')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

