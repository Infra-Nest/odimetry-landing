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
    <section className="odimetry-section odimetry-differentiators" aria-labelledby="differentiators-heading">
      <Container className="odimetry-container">
        <div className="odimetry-differentiators__layout">
          <div>
            <p className="odimetry-eyebrow">{translate('differentiators.kicker')}</p>
            <h2 id="differentiators-heading">{translate('differentiators.title')}</h2>
          </div>
          <div>
            <p className="odimetry-lead">{translate('differentiators.subtitle')}</p>
            <ul className="odimetry-check-list" role="list">
              {differentiators.map((item) => (
                <li key={item}><CheckCircle2 aria-hidden="true" /><span>{item}</span></li>
              ))}
            </ul>
            <p className="odimetry-differentiators__description">{translate('differentiators.description')}</p>
          </div>
        </div>
      </Container>
    </section>
  );
};
