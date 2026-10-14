import { KeyRound, ListChecks, ScanLine } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Workflow = () => {
  const { t: translate } = useTranslation();

  const steps = [
    {
      icon: KeyRound,
      title: translate('workflow.steps.authorize.title'),
      description: translate('workflow.steps.authorize.description'),
    },
    {
      icon: ScanLine,
      title: translate('workflow.steps.observe.title'),
      description: translate('workflow.steps.observe.description'),
    },
    {
      icon: ListChecks,
      title: translate('workflow.steps.decide.title'),
      description: translate('workflow.steps.decide.description'),
    },
  ];

  return (
    <section id="how-it-works" className="odimetry-workflow" aria-labelledby="workflow-heading">
      <Container className="odimetry-container">
        <div className="odimetry-workflow__heading">
          <div>
            <p className="odimetry-eyebrow odimetry-eyebrow--dark">{translate('workflow.kicker')}</p>
            <h2 id="workflow-heading">{translate('workflow.title')}</h2>
          </div>
          <p>{translate('workflow.description')}</p>
        </div>

        <div className="odimetry-workflow__stage">
          <svg className="odimetry-workflow__orbit" viewBox="0 0 920 600" aria-hidden="true" focusable="false">
            <defs>
              <marker id="odimetry-workflow-arrow" viewBox="0 0 12 12" markerWidth="12" markerHeight="12" refX="10" refY="6" markerUnits="userSpaceOnUse" orient="auto">
                <path d="M3 1 L10 6 L3 11" />
              </marker>
            </defs>
            {[
              [-128, -54],
              [-38, 81],
              [97, 216],
            ].map(([start, end]) => {
              const point = (angle: number) => {
                const radians = angle * Math.PI / 180;
                return `${460 + 220 * Math.cos(radians)} ${300 + 220 * Math.sin(radians)}`;
              };

              return (
                <path
                  key={start}
                  className="odimetry-workflow__orbit-line"
                  d={`M${point(start)} A220 220 0 0 1 ${point(end)}`}
                  markerEnd="url(#odimetry-workflow-arrow)"
                />
              );
            })}
            <circle className="odimetry-workflow__orbit-ring" cx="460" cy="300" r="198" />
            {[
              { x: 304.4365, y: 144.4365, connector: 'M221 144.4365 H304.4365' },
              { x: 615.5635, y: 144.4365, connector: 'M615.5635 144.4365 H699' },
              { x: 460, y: 520, connector: 'M460 520 V570' },
            ].map(({ x, y, connector }, index) => (
              <g className={`odimetry-workflow__node odimetry-workflow__color--${index + 1}`} key={index}>
                <path className="odimetry-workflow__connector" d={connector} />
                <circle cx={x} cy={y} r="17" />
                <text x={x} y={y} dy="0.35em" textAnchor="middle">0{index + 1}</text>
              </g>
            ))}
          </svg>

          <div className="odimetry-workflow__core">
            <span className="odimetry-workflow__core-label">{translate('workflow.flowLabel')}</span>
            <strong>{translate('workflow.flowTitle')}</strong>
            <span>{translate('workflow.flowNote')}</span>
          </div>

          <ol className="odimetry-workflow__track">
            {steps.map(({ icon: Icon, title, description }, index) => (
            <li className={`odimetry-workflow__step odimetry-workflow__step--${index + 1} odimetry-workflow__color--${index + 1}`} key={title}>
              <div className="odimetry-workflow__step-topline">
                <span>0{index + 1}</span>
                <Icon aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
            </li>
          ))}
          </ol>
        </div>

        <p className="odimetry-workflow__note">
          <span className="odimetry-signal" aria-hidden="true" />
          {translate('workflow.note')}
        </p>
      </Container>
    </section>
  );
};
