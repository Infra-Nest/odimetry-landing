import type { CSSProperties } from 'react';
import { ArrowDownRight, ArrowUpRight, Radar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Hero = () => {
  const { t: translate } = useTranslation();

  return (
    <section className="odimetry-hero" aria-labelledby="hero-heading">
      <Container className="odimetry-container">
        <div className="odimetry-hero__grid">
          <div className="odimetry-hero__copy">
            <p className="odimetry-eyebrow">
              <span className="odimetry-signal" aria-hidden="true" />
              {translate('hero.eyebrow')}
            </p>
            <h1 id="hero-heading">{translate('hero.title')}</h1>
            <p className="odimetry-hero__description">{translate('hero.description')}</p>
            <div className="odimetry-hero__actions">
              <a className="odimetry-button odimetry-button--accent" href="#interest">
                {translate('hero.interest')}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a className="odimetry-text-link" href="#ejemplo">
                {translate('hero.viewExample')}
                <ArrowDownRight aria-hidden="true" />
              </a>
            </div>
            <p className="odimetry-hero__note">{translate('hero.availabilityNote')}</p>
          </div>

          <div className="odimetry-hero__visual" aria-hidden="true">
            <div className="odimetry-radar">
              <span className="odimetry-radar__ring odimetry-radar__ring--outer" />
              <span className="odimetry-radar__ring odimetry-radar__ring--middle" />
              <span className="odimetry-radar__ring odimetry-radar__ring--inner" />
              <span className="odimetry-radar__cross odimetry-radar__cross--horizontal" />
              <span className="odimetry-radar__cross odimetry-radar__cross--vertical" />
              <span className="odimetry-radar__beam" />
              {/* Angles match the beam's CSS rotate (0° = east, clockwise). */}
              <span
                className="odimetry-radar__point odimetry-radar__point--one"
                style={{ '--radar-angle': '302', '--radar-radius': '32%' } as CSSProperties}
              >
                <span className="odimetry-radar__blip" />
              </span>
              <span
                className="odimetry-radar__point odimetry-radar__point--two"
                style={{ '--radar-angle': '143', '--radar-radius': '30%' } as CSSProperties}
              >
                <span className="odimetry-radar__blip" />
              </span>
              <span
                className="odimetry-radar__point odimetry-radar__point--three"
                style={{ '--radar-angle': '55', '--radar-radius': '16%' } as CSSProperties}
              >
                <span className="odimetry-radar__blip" />
              </span>
              <span className="odimetry-radar__core"><Radar /></span>
            </div>
          </div>
        </div>

        <dl className="odimetry-hero__readout" aria-label={translate('hero.readoutLabel')}>
          <div>
            <dt>{translate('hero.readoutScope')}</dt>
            <dd>{translate('hero.readoutScopeValue')}</dd>
          </div>
          <div>
            <dt>{translate('hero.readoutSignals')}</dt>
            <dd>{translate('hero.readoutSignalsValue')}</dd>
          </div>
          <div>
            <dt>{translate('hero.readoutNext')}</dt>
            <dd>{translate('hero.readoutNextValue')}</dd>
          </div>
        </dl>

        <div className="odimetry-hero__bottom">
          <span>{translate('hero.bottomLabel')}</span>
          <a href="#ejemplo">
            {translate('hero.bottomLink')}
            <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
};
