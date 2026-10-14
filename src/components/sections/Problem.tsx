import { AlertTriangle, Lock, ShieldOff, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

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
    <section className="odimetry-section odimetry-problem" aria-labelledby="problem-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--dark">{translate('problem.kicker')}</p>
            <h2 id="problem-heading">{translate('problem.title')}</h2>
          </div>
          <p>{translate('problem.subtitle')}</p>
        </div>

        <div className="odimetry-risk-list" role="list">
          {risks.map((risk, index) => {
            const Icon = risk.icon;
            return (
              <article className="odimetry-risk" key={risk.title} role="listitem">
                <span className="odimetry-risk__number">0{index + 1}</span>
                <span className="odimetry-risk__icon" aria-hidden="true"><Icon /></span>
                <div>
                  <h3>{risk.title}</h3>
                  <p>{risk.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
