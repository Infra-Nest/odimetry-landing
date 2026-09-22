import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { getPolicyDates } from '../../services/policyService';
import { formatLastUpdate } from '../../utils/dateFormatter';

export const CookiePolicy = () => {
  const { t: translate } = useTranslation();
  const location = useLocation();
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const handleLinkClick = (targetPath: string) => {
    // Si vamos a cambiar de ruta, hacer scroll instantáneo primero
    if (targetPath !== location.pathname) {
      window.scrollTo(0, 0);
    } else {
      // Si ya estamos en esa ruta, scroll suave
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    }
  };

  useEffect(() => {
    const loadPolicyDate = async () => {
      try {
        const dates = await getPolicyDates();
        const formatted = formatLastUpdate(
          dates.cookies,
          'cookies.lastUpdate',
          translate
        );
        setLastUpdate(formatted);
      } catch (error) {
        console.error('Error loading policy date:', error);
        // Fallback a traducción estática si hay error
        setLastUpdate(translate('cookies.lastUpdate'));
      }
    };

    loadPolicyDate();
  }, [translate]);

  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8">
            {translate('cookies.title')}
          </h1>
          <p className="text-gray-400 mb-8">
            {lastUpdate || translate('cookies.lastUpdate')}
          </p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.whatAre.title')}</h2>
              <p className="mb-4">
                {translate('cookies.sections.whatAre.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.types.title')}</h2>
              
              <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">{translate('cookies.sections.types.essential.title')}</h3>
              <p className="mb-4">
                {translate('cookies.sections.types.essential.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.types.essential.items.session')}</li>
                <li>{translate('cookies.sections.types.essential.items.auth')}</li>
                <li>{translate('cookies.sections.types.essential.items.security')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">{translate('cookies.sections.types.functionality.title')}</h3>
              <p className="mb-4">
                {translate('cookies.sections.types.functionality.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.types.functionality.items.language')}</li>
                <li>{translate('cookies.sections.types.functionality.items.settings')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-100 mb-3 mt-6">{translate('cookies.sections.types.analytics.title')}</h3>
              <p className="mb-4">
                {translate('cookies.sections.types.analytics.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.types.analytics.items.google')}</li>
                <li>{translate('cookies.sections.types.analytics.items.metrics')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.thirdParty.title')}</h2>
              <p className="mb-4">
                {translate('cookies.sections.thirdParty.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.thirdParty.items.payment')}</li>
                <li>{translate('cookies.sections.thirdParty.items.analytics')}</li>
                <li>{translate('cookies.sections.thirdParty.items.support')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.duration.title')}</h2>
              <p className="mb-4">{translate('cookies.sections.duration.description')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.duration.items.session')}</li>
                <li>{translate('cookies.sections.duration.items.persistent')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.management.title')}</h2>
              <p className="mb-4">
                {translate('cookies.sections.management.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('cookies.sections.management.items.browser')}</li>
                <li>{translate('cookies.sections.management.items.tools')}</li>
                <li>{translate('cookies.sections.management.items.panel')}</li>
              </ul>
              <p className="mb-4">
                {translate('cookies.sections.management.note')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.personalData.title')}</h2>
              <p className="mb-4">
                {translate('cookies.sections.personalData.description')} <Link to="/privacy" onClick={() => handleLinkClick('/privacy')} className="text-blue-400 hover:text-blue-300">{translate('footer.privacy')}</Link>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.updates.title')}</h2>
              <p className="mb-4">
                {translate('cookies.sections.updates.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('cookies.sections.contact.title')}</h2>
              <p>
                {translate('cookies.sections.contact.description')} 
                <a href="mailto:info@infranest.es" className="text-blue-400 hover:text-blue-300"> info@infranest.es</a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
};
