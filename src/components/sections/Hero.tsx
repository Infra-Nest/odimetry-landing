import { ArrowDownRight, ArrowUpRight, Radar } from 'lucide-react';
import { Link } from 'react-router-dom';
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
              <Link className="odimetry-button odimetry-button--accent" to="/signup">
                {translate('hero.analyzeDomain')}
                <ArrowUpRight aria-hidden="true" />
              </Link>
              <a className="odimetry-text-link" href="#dashboard">
                {translate('hero.viewExample')}
                <ArrowDownRight aria-hidden="true" />
              </a>
            </div>
            <p className="odimetry-hero__note">{translate('hero.noCreditCard')}</p>
          </div>

          <div className="odimetry-hero__visual" role="group" aria-label={translate('hero.visualTitle')}>
            <div className="odimetry-radar" aria-hidden="true">
              <span className="odimetry-radar__ring odimetry-radar__ring--outer" />
              <span className="odimetry-radar__ring odimetry-radar__ring--middle" />
              <span className="odimetry-radar__ring odimetry-radar__ring--inner" />
              <span className="odimetry-radar__cross odimetry-radar__cross--horizontal" />
              <span className="odimetry-radar__cross odimetry-radar__cross--vertical" />
              <span className="odimetry-radar__beam" />
              <span className="odimetry-radar__point odimetry-radar__point--one" />
              <span className="odimetry-radar__point odimetry-radar__point--two" />
              <span className="odimetry-radar__core"><Radar /></span>
            </div>

            <div className="odimetry-scan-card">
              <div className="odimetry-scan-card__header">
                <span>{translate('hero.visualTitle')}</span>
                <span className="odimetry-status"><i />{translate('hero.visualStatus')}</span>
              </div>
              <div className="odimetry-scan-card__domain">{translate('dashboard.exampleDomain')}</div>
              <div className="odimetry-scan-card__rows">
                <div><span>{translate('hero.visualSurface')}</span><strong>01</strong></div>
                <div><span>{translate('dashboard.portsAndServices')}</span><strong>03</strong></div>
                <div><span>{translate('dashboard.vulnerabilitiesDetected')}</span><strong className="is-warning">02</strong></div>
              </div>
              <p>{translate('hero.visualNote')}</p>
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
          <a href="#how-it-works">
            {translate('hero.bottomLink')}
            <ArrowDownRight aria-hidden="true" />
          </a>
        </div>
      </Container>
    </section>
  );
};
