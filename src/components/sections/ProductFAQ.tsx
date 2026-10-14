import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

const questions = ['audience', 'scope', 'limits', 'certification', 'availability'] as const;

export const ProductFAQ = () => {
  const { t: translate } = useTranslation();

  return (
    <section className="odimetry-section odimetry-faq" aria-labelledby="faq-heading">
      <Container className="odimetry-container">
        <div className="odimetry-section-heading odimetry-section-heading--split">
          <h2 id="faq-heading">{translate('faq.title')}</h2>
          <p>{translate('faq.description')}</p>
        </div>
        <div className="odimetry-faq__questions">
          {questions.map((question) => (
            <details key={question}>
              <summary>{translate(`faq.items.${question}.question`)}</summary>
              <p>{translate(`faq.items.${question}.answer`)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
};
