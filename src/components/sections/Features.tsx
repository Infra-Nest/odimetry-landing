import { 
  Search, 
  Lock, 
  Network, 
  AlertCircle, 
  FileText, 
  History 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Card } from '../ui/Card';

export const Features = () => {
  const { t: translate } = useTranslation();

  const features = [
    {
      icon: Search,
      title: translate('features.items.domainAudit.title'),
      description: translate('features.items.domainAudit.description'),
    },
    {
      icon: Lock,
      title: translate('features.items.sslTls.title'),
      description: translate('features.items.sslTls.description'),
    },
    {
      icon: Network,
      title: translate('features.items.ports.title'),
      description: translate('features.items.ports.description'),
    },
    {
      icon: AlertCircle,
      title: translate('features.items.cves.title'),
      description: translate('features.items.cves.description'),
    },
    {
      icon: FileText,
      title: translate('features.items.reports.title'),
      description: translate('features.items.reports.description'),
    },
    {
      icon: History,
      title: translate('features.items.history.title'),
      description: translate('features.items.history.description'),
    },
  ];

  return (
    <section 
      id="features" 
      className="py-12 sm:py-16 md:py-24 bg-gray-950"
      aria-labelledby="features-heading"
    >
      <Container>
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 id="features-heading" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4">
            {translate('features.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            {translate('features.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8" role="list">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} hover className="border border-gray-800" role="listitem">
                <div className="flex flex-col h-full">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4" aria-hidden="true">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-100 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed flex-grow">
                    {feature.description}
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

