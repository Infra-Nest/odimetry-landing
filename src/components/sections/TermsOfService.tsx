import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { getPolicyDates } from '../../services/policyService';
import { formatLastUpdate } from '../../utils/dateFormatter';

export const TermsOfService = () => {
  const { t: translate } = useTranslation();
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const loadPolicyDate = async () => {
      try {
        const dates = await getPolicyDates();
        const formatted = formatLastUpdate(
          dates.terms,
          'terms.lastUpdate',
          translate
        );
        setLastUpdate(formatted);
      } catch (error) {
        console.error('Error loading policy date:', error);
        // Fallback a traducción estática si hay error
        setLastUpdate(translate('terms.lastUpdate'));
      }
    };

    loadPolicyDate();
  }, [translate]);

  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8">
            {translate('terms.title')}
          </h1>
          <p className="text-gray-400 mb-8">
            {lastUpdate || translate('terms.lastUpdate')}
          </p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.acceptance.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.acceptance.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.description.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.description.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.usage.title')}</h2>
              <p className="mb-4">{translate('terms.sections.usage.description')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('terms.sections.usage.items.accurate')}</li>
                <li>{translate('terms.sections.usage.items.authorized')}</li>
                <li>{translate('terms.sections.usage.items.legal')}</li>
                <li>{translate('terms.sections.usage.items.access')}</li>
                <li>{translate('terms.sections.usage.items.interfere')}</li>
                <li>{translate('terms.sections.usage.items.credentials')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.accounts.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.accounts.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('terms.sections.accounts.items.renewal')}</li>
                <li>{translate('terms.sections.accounts.items.cancel')}</li>
                <li>{translate('terms.sections.accounts.items.refunds')}</li>
                <li>{translate('terms.sections.accounts.items.pricing')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.liability.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.liability.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('terms.sections.liability.items.detection')}</li>
                <li>{translate('terms.sections.liability.items.security')}</li>
                <li>{translate('terms.sections.liability.items.damages')}</li>
                <li>{translate('terms.sections.liability.items.informative')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.intellectual.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.intellectual.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.ethical.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.ethical.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('terms.sections.ethical.items.unauthorized')}</li>
                <li>{translate('terms.sections.ethical.items.malicious')}</li>
                <li>{translate('terms.sections.ethical.items.share')}</li>
                <li>{translate('terms.sections.ethical.items.massive')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.modifications.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.modifications.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.termination.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.termination.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.law.title')}</h2>
              <p className="mb-4">
                {translate('terms.sections.law.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('terms.sections.contact.title')}</h2>
              <p>
                {translate('terms.sections.contact.description')} 
                <a href="mailto:legal@odimetry.com" className="text-blue-400 hover:text-blue-300"> legal@odimetry.com</a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
};

