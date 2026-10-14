import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { getPolicyDates } from '../../services/policyService';
import { formatLastUpdate } from '../../utils/dateFormatter';

export const PrivacyPolicy = () => {
  const { t: translate } = useTranslation();
  const [lastUpdate, setLastUpdate] = useState<string>('');

  useEffect(() => {
    const loadPolicyDate = async () => {
      try {
        const dates = await getPolicyDates();
        const formatted = formatLastUpdate(
          dates.privacy,
          'privacy.lastUpdate',
          translate
        );
        setLastUpdate(formatted);
      } catch (error) {
        console.error('Error loading policy date:', error);
        // Fallback a traducción estática si hay error
        setLastUpdate(translate('privacy.lastUpdate'));
      }
    };

    loadPolicyDate();
  }, [translate]);

  return (
    <section className="py-16 md:py-24 bg-gray-950">
      <Container>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-8">
            {translate('privacy.title')}
          </h1>
          <p className="text-gray-400 mb-8">
            {lastUpdate || translate('privacy.lastUpdate')}
          </p>

          <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.infoCollected.title')}</h2>
              <p className="mb-4">
                {translate('privacy.sections.infoCollected.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('privacy.sections.infoCollected.items.account')}</li>
                <li>{translate('privacy.sections.infoCollected.items.domain')}</li>
                <li>{translate('privacy.sections.infoCollected.items.payment')}</li>
                <li>{translate('privacy.sections.infoCollected.items.usage')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.howWeUse.title')}</h2>
              <p className="mb-4">{translate('privacy.sections.howWeUse.description')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('privacy.sections.howWeUse.items.provide')}</li>
                <li>{translate('privacy.sections.howWeUse.items.process')}</li>
                <li>{translate('privacy.sections.howWeUse.items.notify')}</li>
                <li>{translate('privacy.sections.howWeUse.items.communicate')}</li>
                <li>{translate('privacy.sections.howWeUse.items.comply')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.sharing.title')}</h2>
              <p className="mb-4">
                {translate('privacy.sections.sharing.description')}
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('privacy.sections.sharing.items.providers')}</li>
                <li>{translate('privacy.sections.sharing.items.law')}</li>
                <li>{translate('privacy.sections.sharing.items.merger')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.security.title')}</h2>
              <p className="mb-4">
                {translate('privacy.sections.security.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.rights.title')}</h2>
              <p className="mb-4">{translate('privacy.sections.rights.description')}</p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>{translate('privacy.sections.rights.items.access')}</li>
                <li>{translate('privacy.sections.rights.items.rectify')}</li>
                <li>{translate('privacy.sections.rights.items.delete')}</li>
                <li>{translate('privacy.sections.rights.items.oppose')}</li>
                <li>{translate('privacy.sections.rights.items.portability')}</li>
              </ul>
              <p>
                {translate('privacy.sections.rights.contact')} <a href="mailto:info@infranest.es" className="text-blue-400 hover:text-blue-300">info@infranest.es</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.retention.title')}</h2>
              <p className="mb-4">
                {translate('privacy.sections.retention.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.changes.title')}</h2>
              <p className="mb-4">
                {translate('privacy.sections.changes.description')}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-100 mb-4">{translate('privacy.sections.contact.title')}</h2>
              <p>
                {translate('privacy.sections.contact.description')} 
                <a href="mailto:info@infranest.es" className="text-blue-400 hover:text-blue-300"> info@infranest.es</a>
              </p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
};
