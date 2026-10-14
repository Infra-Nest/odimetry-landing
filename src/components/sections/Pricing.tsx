import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { getPricingPlans } from '../../services/pricingService';
import type { PricingPlan } from '../../types/pricing';

const featureKeys: Record<string, string[]> = {
  free: ['domains', 'audit', 'report', 'history'],
  starter: ['domains', 'audit', 'report', 'history', 'support'],
  pro: ['domains', 'audit', 'history', 'teams', 'api', 'support'],
};

export const Pricing = () => {
  const { t: translate, i18n } = useTranslation();
  const [result, setResult] = useState<{ plans: PricingPlan[]; status: 'loading' | 'ready' | 'error' }>({ plans: [], status: 'loading' });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    getPricingPlans().then(
      (plans) => { if (active) setResult({ plans, status: 'ready' }); },
      () => { if (active) setResult({ plans: [], status: 'error' }); },
    );
    return () => { active = false; };
  }, [attempt]);

  const retry = () => {
    setResult({ plans: [], status: 'loading' });
    setAttempt((value) => value + 1);
  };

  return (
    <section id="pricing" className="odimetry-section odimetry-pricing" aria-labelledby="pricing-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--dark">{translate('pricing.kicker')}</p>
            <h2 id="pricing-heading">{translate('pricing.title')}</h2>
          </div>
          <div><p>{translate('pricing.subtitle')}</p><small id="pricing-note">{translate('pricing.note')}</small></div>
        </div>

        <div className="odimetry-pricing__status" role="status" aria-live="polite">
          {result.status === 'loading' && <p>{translate('pricing.loading')}</p>}
          {result.status === 'error' && <p>{translate('pricing.error')}</p>}
          {result.status === 'ready' && result.plans.length === 0 && <p>{translate('pricing.empty')}</p>}
        </div>
        {result.status === 'error' && <button type="button" className="odimetry-button odimetry-button--ink" onClick={retry}>{translate('pricing.retry')}</button>}

        <div className="odimetry-pricing-grid">
          {result.plans.map((plan) => {
            const baseKey = `pricing.plans.${plan.code}`;
            const name = translate(`${baseKey}.name`);
            const price = new Intl.NumberFormat(i18n.resolvedLanguage || 'es', {
              style: 'currency', currency: 'EUR',
              minimumFractionDigits: plan.price_cents % 100 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            }).format(plan.price_cents / 100);

            return (
              <article className={`odimetry-plan${plan.highlighted ? ' odimetry-plan--featured' : ''}`} key={plan.id} aria-labelledby={`plan-${plan.code}`} aria-describedby="pricing-note">
                <div className="odimetry-plan__intro">
                  <div className="odimetry-plan__heading">
                    <h3 id={`plan-${plan.code}`}>{name}</h3>
                    {plan.highlighted && plan.popularLabelTranslationKey && <span className="odimetry-plan__tag">{translate(plan.popularLabelTranslationKey)}</span>}
                  </div>
                  <p className="odimetry-plan__description">{translate(`${baseKey}.description`)}</p>
                </div>
                <div className="odimetry-plan__price">
                  <strong>{price}</strong>
                  <span>{translate('pricing.monthly')}</span>
                </div>
                <p className="odimetry-plan__features-label">{translate('pricing.featuresLabel')}</p>
                <ul role="list">
                  {(featureKeys[plan.code] || []).map((key) => <li key={key}><Check aria-hidden="true" /><span>{translate(`${baseKey}.features.${key}`)}</span></li>)}
                </ul>
                <a href={`mailto:info@infranest.es?subject=${encodeURIComponent(`Odimetry ${name}`)}`} className="odimetry-plan__cta">{translate(`${baseKey}.cta`)}<span className="sr-only"> — {name}</span></a>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
