import { AlertCircle, CheckCircle2, TrendingUp, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Dashboard = () => {
  const { t: translate } = useTranslation();

  return (
    <section id="dashboard" className="odimetry-section odimetry-dashboard" aria-labelledby="dashboard-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split odimetry-section-heading--light">
          <div>
            <p className="odimetry-eyebrow">{translate('dashboard.kicker')}</p>
            <h2 id="dashboard-heading">{translate('dashboard.title')}</h2>
          </div>
          <p>{translate('dashboard.subtitle')}</p>
        </div>

        <article className="odimetry-report" aria-labelledby="dashboard-report-title">
          <header className="odimetry-report__header">
            <div>
              <span className="odimetry-board-label">{translate('dashboard.active')}</span>
              <strong id="dashboard-report-title">{translate('dashboard.exampleDomain')}</strong>
              <small>{translate('dashboard.lastAudit')}</small>
            </div>
            <p className="odimetry-report__example-note">{translate('dashboard.exampleNote')}</p>
          </header>

          <div className="odimetry-report__metrics" role="list" aria-label={translate('dashboard.securityMetrics')}>
            <div role="listitem"><span>{translate('dashboard.critical')}</span><strong>1</strong><XCircle aria-hidden="true" /></div>
            <div role="listitem"><span>{translate('dashboard.warnings')}</span><strong>1</strong><AlertCircle aria-hidden="true" /></div>
            <div role="listitem"><span>{translate('dashboard.correct')}</span><strong>12</strong><CheckCircle2 aria-hidden="true" /></div>
            <div role="listitem"><span>{translate('solution.total')}</span><strong>14</strong><TrendingUp aria-hidden="true" /></div>
          </div>

          <div className="odimetry-report__columns">
            <div className="odimetry-report__block">
              <div className="odimetry-report__block-heading"><h3>{translate('dashboard.portsAndServices')}</h3></div>
              <div className="odimetry-report__rows">
                <div><span><strong>{translate('dashboard.port443')}</strong><small>{translate('dashboard.https')}</small></span><em className="is-clear">{translate('dashboard.secureStatus')}</em></div>
                <div><span><strong>{translate('dashboard.port22')}</strong><small>{translate('dashboard.ssh')}</small></span><em>{translate('dashboard.exposed')}</em></div>
                <div><span><strong>{translate('dashboard.port3306')}</strong><small>{translate('dashboard.mysql')}</small></span><em className="is-warning">{translate('dashboard.risk')}</em></div>
              </div>
            </div>

            <div className="odimetry-report__block">
              <div className="odimetry-report__block-heading"><h3>{translate('dashboard.sslTlsAnalysis')}</h3></div>
              <div className="odimetry-report__rows">
                <div><span>{translate('dashboard.certificate')}</span><em className="is-clear">{translate('solution.valid')}</em></div>
                <div><span>{translate('dashboard.protocols')}</span><em>{translate('dashboard.tlsVersions')}</em></div>
                <div><span>{translate('dashboard.cipherSuites')}</span><em className="is-clear">{translate('dashboard.secure')}</em></div>
                <div><span>{translate('dashboard.hsts')}</span><em className="is-warning">{translate('dashboard.notConfigured')}</em></div>
              </div>
            </div>
          </div>

          <div className="odimetry-report__findings">
            <div className="odimetry-report__block-heading"><h3>{translate('dashboard.vulnerabilitiesDetected')}</h3><span>02</span></div>
            {(['database', 'https'] as const).map((finding, index) => (
              <article className={`odimetry-finding odimetry-finding--${index === 0 ? 'critical' : 'warning'}`} key={finding}>
                <div className="odimetry-finding__heading">
                  <h4>{translate(`dashboard.findings.${finding}.title`)}</h4>
                  <em>{translate(index === 0 ? 'dashboard.critical' : 'dashboard.medium')}</em>
                </div>
                <dl>
                  <div><dt>{translate('dashboard.meaning')}</dt><dd>{translate(`dashboard.findings.${finding}.meaning`)}</dd></div>
                  <div><dt>{translate('dashboard.nextStep')}</dt><dd>{translate(`dashboard.findings.${finding}.nextStep`)}</dd></div>
                </dl>
              </article>
            ))}
          </div>
        </article>
      </Container>
    </section>
  );
};
