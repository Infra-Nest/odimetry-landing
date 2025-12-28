import { Container } from '../ui/Container';
import { useTranslation } from 'react-i18next';
import { Zap, Shield, Clock } from 'lucide-react';

export const FinalCTA = () => {
  const { t: translate } = useTranslation();

  return (
    <section 
      className="py-16 md:py-24 bg-gradient-to-br from-black via-gray-950 to-black text-white"
      aria-labelledby="cta-heading"
    >
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 id="cta-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {translate('finalCta.title')}
          </h2>
          <p className="text-xl md:text-2xl text-gray-200 mb-12 leading-relaxed">
            {translate('finalCta.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
            <div className="flex flex-col items-center text-center" role="listitem">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                <Zap className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold mb-2">{translate('finalCta.fastResults.title')}</h3>
              <p className="text-sm text-gray-500">
                {translate('finalCta.fastResults.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center" role="listitem">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                <Shield className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold mb-2">{translate('finalCta.noInstallation.title')}</h3>
              <p className="text-sm text-gray-500">
                {translate('finalCta.noInstallation.description')}
              </p>
            </div>
            <div className="flex flex-col items-center text-center" role="listitem">
              <div className="w-12 h-12 bg-blue-400/20 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                <Clock className="w-6 h-6 text-blue-300" />
              </div>
              <h3 className="font-semibold mb-2">{translate('finalCta.noCommitment.title')}</h3>
              <p className="text-sm text-gray-500">
                {translate('finalCta.noCommitment.description')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

