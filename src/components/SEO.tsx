import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const origin = 'https://odimetry.es';
const locales: Record<string, string> = { es: 'es_ES', en: 'en_GB', fr: 'fr_FR', de: 'de_DE' };

export const SEO = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const language = i18n.resolvedLanguage?.split('-')[0] || 'es';
    const path = pathname.replace(/\/+$/, '') || '/';
    const indexable = path === '/';
    const canonical = origin + '/';
    const title = t('seo.title');
    const description = t('seo.description');
    const setMeta = (attribute: 'name' | 'property', key: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.content = value;
    };

    document.documentElement.lang = language;
    document.title = title;
    setMeta('name', 'title', title);
    setMeta('name', 'description', description);
    setMeta('name', 'robots', indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', locales[language] || locales.es);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image:alt', t('seo.imageAlt'));
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', canonical);
    setMeta('name', 'twitter:image:alt', t('seo.imageAlt'));
    const canonicalLinks = document.head.querySelectorAll<HTMLLinkElement>('link[rel="canonical"]');
    const canonicalLink = canonicalLinks[0] || document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonical;
    if (!canonicalLink.parentNode) document.head.appendChild(canonicalLink);
    canonicalLinks.forEach((link) => {
      if (link !== canonicalLink) link.remove();
    });

    const schema = document.getElementById('odimetry-schema');
    if (schema) {
      schema.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': indexable ? [
          {
            '@type': 'Organization',
            '@id': origin + '/#organization',
            name: 'Infranest',
            url: 'https://infranest.es/',
            email: 'info@infranest.es',
          },
          {
            '@type': 'WebSite',
            '@id': origin + '/#website',
            name: 'Odimetry',
            url: origin + '/',
            inLanguage: language,
            publisher: { '@id': origin + '/#organization' },
          },
          {
            '@type': 'SoftwareApplication',
            '@id': origin + '/#product',
            name: 'Odimetry',
            url: origin + '/',
            applicationCategory: 'SecurityApplication',
            operatingSystem: 'Web',
            brand: { '@type': 'Brand', name: 'Odimetry' },
            description,
            publisher: { '@id': origin + '/#organization' },
          },
          {
            '@type': 'WebPage',
            '@id': canonical + '#webpage',
            name: title,
            url: canonical,
            inLanguage: language,
            description,
            isPartOf: { '@id': origin + '/#website' },
            about: { '@id': origin + '/#product' },
          },
        ] : [],
      });
    }
  }, [pathname, i18n.resolvedLanguage, t]);

  return null;
};
