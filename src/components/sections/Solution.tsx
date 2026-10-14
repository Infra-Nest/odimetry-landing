import { AlertCircle, CheckCircle2, Eye, Target, TrendingUp, XCircle, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Solution = () => {
  const { t: translate } = useTranslation();

  const principles = [
    { icon: Zap, title: translate('solution.speed.title'), description: translate('solution.speed.description') },
    { icon: Eye, title: translate('solution.clarity.title'), description: translate('solution.clarity.description') },
    { icon: Target, title: translate('solution.actionable.title'), description: translate('solution.actionable.description') },
  ];

  return (
    <section id="solution" className="odimetry-section odimetry-solution" aria-labelledby="solution-heading">
      <Container className="odimetry-container">
        <div className="odimetry-solution__layout">
          <div className="odimetry-solution__copy">
            <p className="odimetry-eyebrow">{translate('solution.kicker')}</p>
            <h2 id="solution-heading">{translate('solution.title')}</h2>
            <p className="odimetry-lead">{translate('solution.description')}</p>

            <div className="odimetry-principles" role="list">
              {principles.map(({ icon: Icon, title, description }) => (
                <article className="odimetry-principle" key={title} role="listitem">
                  <span className="odimetry-principle__icon" aria-hidden="true"><Icon /></span>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </article>
              ))}
            </div>
          </div>

          <article className="odimetry-audit-board" aria-labelledby="audit-summary-title">
            <div className="odimetry-audit-board__topline">
              <div>
                <span className="odimetry-board-label">{translate('solution.auditSummary')}</span>
                <strong id="audit-summary-title">{translate('dashboard.exampleDomain')}</strong>
              </div>
              <span className="odimetry-status odimetry-status--light"><i />{translate('solution.lastUpdate')}</span>
            </div>

            <div className="odimetry-audit-metrics" role="list" aria-label={translate('solution.auditMetrics')}>
              <div className="odimetry-audit-metric odimetry-audit-metric--critical" role="listitem">
                <span>{translate('solution.critical')}</span><XCircle aria-hidden="true" /><strong>1</strong>
              </div>
              <div className="odimetry-audit-metric odimetry-audit-metric--warning" role="listitem">
                <span>{translate('solution.warnings')}</span><AlertCircle aria-hidden="true" /><strong>1</strong>
              </div>
              <div className="odimetry-audit-metric odimetry-audit-metric--clear" role="listitem">
                <span>{translate('solution.correct')}</span><CheckCircle2 aria-hidden="true" /><strong>12</strong>
              </div>
              <div className="odimetry-audit-metric odimetry-audit-metric--total" role="listitem">
                <span>{translate('solution.total')}</span><TrendingUp aria-hidden="true" /><strong>14</strong>
              </div>
            </div>

            <div className="odimetry-audit-board__details" role="list" aria-label={translate('solution.technicalDetails')}>
              <div role="listitem"><span>{translate('solution.openPorts')}</span><strong>3 {translate('solution.detected')}</strong></div>
              <div role="listitem"><span>{translate('solution.sslCertificate')}</span><strong className="is-clear">{translate('solution.valid')}</strong></div>
              <div role="listitem"><span>{translate('solution.cvesFound')}</span><strong className="is-warning">2 {translate('solution.criticalCves')}</strong></div>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
};
