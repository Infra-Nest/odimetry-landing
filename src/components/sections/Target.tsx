import { Building2, Rocket, Users, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';

export const Target = () => {
  const { t: translate } = useTranslation();

  const targets = [
    {
      icon: Building2,
      title: translate('target.smes.title'),
      description: translate('target.smes.description'),
    },
    {
      icon: Rocket,
      title: translate('target.startups.title'),
      description: translate('target.startups.description'),
    },
    {
      icon: Users,
      title: translate('target.ctos.title'),
      description: translate('target.ctos.description'),
    },
    {
      icon: Briefcase,
      title: translate('target.consultants.title'),
      description: translate('target.consultants.description'),
    },
  ];

  return (
    <section 
      className="py-16 md:py-24 bg-gray-950"
      aria-labelledby="target-heading"
    >
      <Container>
        <div className="text-center mb-12 md:mb-16">
          <h2 id="target-heading" className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
            {translate('target.title')}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {translate('target.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8" role="list">
          {targets.map((target, index) => {
            const Icon = target.icon;
            return (
              <Card key={index} hover className="border border-gray-800 text-center" role="listitem">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                    <Icon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-3">
                    {target.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {target.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

