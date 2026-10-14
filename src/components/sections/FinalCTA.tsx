import { ArrowUpRight, Clock, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const FinalCTA = () => {
  const { t: translate } = useTranslation();
  const points = [
    { icon: Zap, title: translate('finalCta.fastResults.title'), description: translate('finalCta.fastResults.description') },
    { icon: Shield, title: translate('finalCta.noInstallation.title'), description: translate('finalCta.noInstallation.description') },
    { icon: Clock, title: translate('finalCta.noCommitment.title'), description: translate('finalCta.noCommitment.description') },
  ];

  return (
    <section className="odimetry-final-cta" aria-labelledby="cta-heading">
      <Container className="odimetry-container">
        <div className="odimetry-final-cta__layout">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--amber">{translate('finalCta.kicker')}</p>
            <h2 id="cta-heading">{translate('finalCta.title')}</h2>
          </div>
          <div>
            <p className="odimetry-final-cta__description">{translate('finalCta.description')}</p>
            <Link className="odimetry-button odimetry-button--ink" to="/signup">
              {translate('hero.analyzeDomain')}<ArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div className="odimetry-final-cta__points" role="list">
          {points.map(({ icon: Icon, title, description }) => (
            <div key={title} role="listitem"><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{description}</p></div></div>
          ))}
        </div>
      </Container>
    </section>
  );
};
