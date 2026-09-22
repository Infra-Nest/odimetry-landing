import { AlertCircle, FileText, History, Lock, Network, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Features = () => {
  const { t: translate } = useTranslation();

  const features = [
    { icon: Search, title: translate('features.items.domainAudit.title'), description: translate('features.items.domainAudit.description') },
    { icon: Lock, title: translate('features.items.sslTls.title'), description: translate('features.items.sslTls.description') },
    { icon: Network, title: translate('features.items.ports.title'), description: translate('features.items.ports.description') },
    { icon: AlertCircle, title: translate('features.items.cves.title'), description: translate('features.items.cves.description') },
    { icon: FileText, title: translate('features.items.reports.title'), description: translate('features.items.reports.description') },
    { icon: History, title: translate('features.items.history.title'), description: translate('features.items.history.description') },
  ];

  return (
    <section id="features" className="odimetry-section odimetry-features" aria-labelledby="features-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--dark">{translate('features.kicker')}</p>
            <h2 id="features-heading">{translate('features.title')}</h2>
          </div>
          <p>{translate('features.subtitle')}</p>
        </div>

        <div className="odimetry-feature-grid" role="list">
          {features.map(({ icon: Icon, title, description }, index) => (
            <article className="odimetry-feature" key={title} role="listitem">
              <div className="odimetry-feature__topline">
                <span>0{index + 1}</span>
                <Icon aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
};
