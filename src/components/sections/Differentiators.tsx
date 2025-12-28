import { CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Differentiators = () => {
  const { t: translate } = useTranslation();

  const differentiators = [
    translate('differentiators.items.noAgents'),
    translate('differentiators.items.noInternalAccess'),
    translate('differentiators.items.noInstallations'),
    translate('differentiators.items.noNoise'),
    translate('differentiators.items.actionable'),
  ];

  return (
    <section 
      className="py-16 md:py-24 bg-gray-900"
      aria-labelledby="differentiators-heading"
    >
      <Container>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 id="differentiators-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              {translate('differentiators.title')}
            </h2>
            <p className="text-lg text-gray-300">
              {translate('differentiators.subtitle')}
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl shadow-lg shadow-gray-900/50 p-8 md:p-12 border border-gray-700">
            <ul className="space-y-4" role="list">
              {differentiators.map((item, index) => (
                <li key={index} className="flex items-start space-x-4" role="listitem">
                  <div className="flex-shrink-0 mt-1" aria-hidden="true">
                    <CheckCircle2 className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-lg text-gray-100 font-medium">
                      {item}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-700">
              <p className="text-gray-300 leading-relaxed">
                {translate('differentiators.description')}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

