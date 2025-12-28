import { AlertTriangle, Lock, ShieldOff, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';

export const Problem = () => {
  const { t: translate } = useTranslation();

  const risks = [
    {
      icon: AlertTriangle,
      title: translate('problem.risks.exposedServices.title'),
      description: translate('problem.risks.exposedServices.description'),
    },
    {
      icon: Lock,
      title: translate('problem.risks.sslTls.title'),
      description: translate('problem.risks.sslTls.description'),
    },
    {
      icon: ShieldOff,
      title: translate('problem.risks.vulnerabilities.title'),
      description: translate('problem.risks.vulnerabilities.description'),
    },
    {
      icon: Settings,
      title: translate('problem.risks.configurations.title'),
      description: translate('problem.risks.configurations.description'),
    },
  ];

  return (
    <section 
      className="py-12 sm:py-16 md:py-24 bg-gray-950"
      aria-labelledby="problem-heading"
    >
      <Container>
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 id="problem-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4">
            {translate('problem.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            {translate('problem.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8" role="list">
          {risks.map((risk, index) => {
            const Icon = risk.icon;
            return (
              <Card key={index} hover className="border border-gray-800" role="listitem">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0" aria-hidden="true">
                    <div className="w-12 h-12 bg-red-900/30 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-red-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-100 mb-2">
                      {risk.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {risk.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

