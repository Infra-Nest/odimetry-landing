import { Building2, UserRound } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Target = () => {
  const { t: translate } = useTranslation();

  const targets = [
    { icon: Building2, title: translate('target.smes.title'), description: translate('target.smes.description') },
    { icon: UserRound, title: translate('target.selfEmployed.title'), description: translate('target.selfEmployed.description') },
  ];

  return (
    <section className="odimetry-section odimetry-target" aria-labelledby="target-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--dark">{translate('target.kicker')}</p>
            <h2 id="target-heading">{translate('target.title')}</h2>
          </div>
          <p>{translate('target.subtitle')}</p>
        </div>

        <div className="odimetry-target-grid" role="list">
          {targets.map(({ icon: Icon, title, description }) => (
            <article className="odimetry-target-card" key={title} role="listitem">
              <div className="odimetry-target-card__topline"><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
        <p className="odimetry-target__secondary">{translate('target.secondary')}</p>
      </Container>
    </section>
  );
};
