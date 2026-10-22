import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { useLocaleHomePath } from '../../i18n/localeRouting';

export const Footer = () => {
  const { t: translate } = useTranslation();
  const homePath = useLocaleHomePath();

  return (
    <footer className="odimetry-footer" role="contentinfo">
      <Container className="odimetry-container">
        <div className="odimetry-footer__main odimetry-footer__main--landing">
          <div className="odimetry-footer__brand">
            <Link to={homePath} className="odimetry-brand" aria-label={translate('footer.home')}>
              <img
                src="/brand/odimetry-mark.svg"
                width="40"
                height="40"
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span translate="no">Odimetry</span>
            </Link>
            <p>{translate('footer.description')}</p>
          </div>

          <nav aria-label={translate('footer.contact')}>
            <p className="odimetry-footer__label">{translate('footer.contact')}</p>
            <ul>
              <li><a href="mailto:info@odimetry.es">info@odimetry.es</a></li>
            </ul>
          </nav>
        </div>

        <div className="odimetry-footer__bottom">
          <span translate="no">Odimetry</span>
          <span>&copy; {new Date().getFullYear()} · {translate('footer.copyright')}</span>
        </div>
      </Container>
    </footer>
  );
};
