import { useState, type FormEvent } from 'react';
import { ArrowUpRight, Clock, Shield, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const FinalCTA = () => {
  const { t: translate } = useTranslation();
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [error, setError] = useState<'sendError' | 'rateLimited'>('sendError');

  const handleInterest = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'sending') return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const email = values.get('email')?.toString().trim();
    if (!email) return;

    setStatus('sending');
    try {
      const response = await fetch('/api/interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, field_x9k2: values.get('field_x9k2') }),
      });

      if (response.status === 429) {
        setError('rateLimited');
        setStatus('error');
        return;
      }

      const isJson = response.headers.get('Content-Type')?.includes('application/json');
      const result = isJson ? await response.json() : null;
      if (!response.ok || result?.ok !== true) throw new Error('Interest request failed');

      form.reset();
      setStatus('success');
    } catch {
      setError('sendError');
      setStatus('error');
    }
  };
  const points = [
    { icon: Zap, title: translate('finalCta.fastResults.title'), description: translate('finalCta.fastResults.description') },
    { icon: Shield, title: translate('finalCta.noInstallation.title'), description: translate('finalCta.noInstallation.description') },
    { icon: Clock, title: translate('finalCta.noCommitment.title'), description: translate('finalCta.noCommitment.description') },
  ];

  return (
    <section id="interest" className="odimetry-final-cta" aria-labelledby="cta-heading">
      <Container className="odimetry-container">
        <div className="odimetry-final-cta__layout">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--amber">{translate('finalCta.kicker')}</p>
            <h2 id="cta-heading">{translate('finalCta.title')}</h2>
          </div>
          <div>
            <p className="odimetry-final-cta__description">{translate('finalCta.description')}</p>
            <form className="odimetry-interest-form" onSubmit={handleInterest} aria-busy={status === 'sending'}>
              <label htmlFor="interest-email">{translate('interest.emailLabel')}</label>
              <div className="odimetry-interest-form__fields">
                <input
                  id="interest-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={254}
                  placeholder={translate('interest.emailPlaceholder')}
                  aria-describedby="interest-privacy interest-status"
                  required
                />
                <button className="odimetry-button odimetry-button--ink" type="submit" disabled={status === 'sending'}>
                  {translate(status === 'sending' ? 'interest.sending' : 'interest.submit')}<ArrowUpRight aria-hidden="true" />
                </button>
              </div>
              <label className="odimetry-interest-form__trap" aria-hidden="true">
                Leave blank<input name="field_x9k2" tabIndex={-1} autoComplete="off" />
              </label>
              <p id="interest-status" className="odimetry-interest-form__status" data-state={status} role={status === 'error' ? 'alert' : 'status'} aria-live={status === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
                {status === 'sending' ? translate('interest.sendingStatus') : status === 'success' ? translate('interest.success') : status === 'error' ? translate(`interest.${error}`) : ''}
              </p>
              <p className="odimetry-interest-form__alternative">
                {translate('interest.alternative')}{' '}
                <a href="mailto:info@infranest.es">info@infranest.es</a>
              </p>
              <p id="interest-privacy" className="odimetry-interest-form__privacy">
                {translate('interest.privacyNote')}
              </p>
            </form>
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
