import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const Footer = () => {
  const { t: translate } = useTranslation();
  const location = useLocation();

  const handleLinkClick = (targetPath: string) => {
    if (targetPath === location.pathname) {
      const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior });
    }
  };

  return (
    <footer className="odimetry-footer" role="contentinfo">
      <Container className="odimetry-container">
        <div className="odimetry-footer__main">
          <div className="odimetry-footer__brand">
            <Link to="/" className="odimetry-brand" aria-label={translate('footer.home')}>
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
            <p className="odimetry-footer__byline">{translate('footer.brandByline')}</p>
            <p>{translate('footer.description')}</p>
          </div>

          <nav aria-label={translate('footer.legal')}>
            <p className="odimetry-footer__label">{translate('footer.legal')}</p>
            <ul>
              <li><Link to="/privacy" onClick={() => handleLinkClick('/privacy')}>{translate('footer.privacy')}</Link></li>
              <li><Link to="/terms" onClick={() => handleLinkClick('/terms')}>{translate('footer.terms')}</Link></li>
              <li><Link to="/cookies" onClick={() => handleLinkClick('/cookies')}>{translate('footer.cookies')}</Link></li>
            </ul>
          </nav>

          <nav aria-label={translate('footer.contact')}>
            <p className="odimetry-footer__label">{translate('footer.contact')}</p>
            <ul>
              <li><a href="mailto:info@infranest.es">info@infranest.es</a></li>
              <li><a href="mailto:info@infranest.es">{translate('footer.support')}</a></li>
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
