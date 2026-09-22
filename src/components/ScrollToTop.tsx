import { useLayoutEffect, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    // Scroll instantáneo ANTES de que el navegador pinte el nuevo contenido
    // useLayoutEffect se ejecuta de forma síncrona antes del paint
    if (!hash) {
      // Forzar scroll de múltiples formas para asegurar que funcione
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      // Forzar scroll usando requestAnimationFrame para después del layout
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        // Segundo requestAnimationFrame para asegurar que el scroll se aplique después de cualquier reflow
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;
        });
      });
    }
  }, [pathname, hash]);

  useEffect(() => {
    // Si hay un hash en la URL, hacer scroll al elemento después de que se renderice
    if (hash) {
      const elementId = hash.substring(1); // Remover el #
      const element = document.getElementById(elementId);
      if (element) {
        // Pequeño delay para asegurar que el elemento esté renderizado
        setTimeout(() => {
          const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
          // Solo aplicar offset en móvil
          const isMobile = window.innerWidth < 768;
          if (isMobile) {
            // En móvil, aplicar offset de 64px (altura del header)
            const headerHeight = 64;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const offsetPosition = elementPosition - headerHeight;
            window.scrollTo({
              top: offsetPosition,
              behavior
            });
          } else {
            // En desktop, scroll normal
            element.scrollIntoView({ behavior });
          }
        }, 100);
      }
    }
  }, [hash, pathname]);

  return null;
};
