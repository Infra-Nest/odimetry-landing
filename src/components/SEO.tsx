import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FAQ_KEYS,
  OG_LOCALES,
  SITE_ORIGIN,
  buildHreflangLinks,
  buildJsonLd,
  localeFromPathname,
  localeUrl,
  type Locale,
} from '../seo/site';
import { useLocation } from 'react-router-dom';

const INDEXABLE = new Set(['/', '/en', '/fr', '/de']);

function setMeta(attribute: 'name' | 'property', key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(
    `meta[${attribute}="${key}"]`,
  );
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let link = document.head.querySelector<HTMLLinkElement>(selector);
  if (!link) {
    link = document.createElement('link');
    link.rel = rel;
    if (hreflang) link.hreflang = hreflang;
    document.head.appendChild(link);
  }
  link.href = href;
}

export const SEO = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const path = pathname.replace(/\/+$/, '') || '/';
    const locale: Locale = localeFromPathname(path);
    const indexable = INDEXABLE.has(path);
    const canonical = localeUrl(locale);
    const title = t('seo.title');
    const description = t('seo.description');
    const imageAlt = t('seo.imageAlt');
    const imageUrl = `${SITE_ORIGIN}/brand/odimetry-social.png`;

    document.documentElement.lang = locale;
    document.title = title;
    setMeta('name', 'title', title);
    setMeta('name', 'description', description);
    setMeta(
      'name',
      'robots',
      indexable ? 'index, follow, max-image-preview:large' : 'noindex, follow',
    );
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', OG_LOCALES[locale]);
    setMeta('property', 'og:url', canonical);
    setMeta('property', 'og:image', imageUrl);
    setMeta('property', 'og:image:alt', imageAlt);
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:url', canonical);
    setMeta('name', 'twitter:image', imageUrl);
    setMeta('name', 'twitter:image:alt', imageAlt);

    const canonicalLinks = document.head.querySelectorAll<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    const canonicalLink = canonicalLinks[0] || document.createElement('link');
    canonicalLink.rel = 'canonical';
    canonicalLink.href = canonical;
    if (!canonicalLink.parentNode) document.head.appendChild(canonicalLink);
    canonicalLinks.forEach((link) => {
      if (link !== canonicalLink) link.remove();
    });

    document.head
      .querySelectorAll('link[rel="alternate"][hreflang]')
      .forEach((link) => link.remove());
    for (const alternate of buildHreflangLinks()) {
      upsertLink('alternate', alternate.href, alternate.hreflang);
    }

    const schema = document.getElementById('odimetry-schema');
    if (schema) {
      if (!indexable) {
        schema.textContent = JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': [],
        });
      } else {
        schema.textContent = JSON.stringify(
          buildJsonLd({
            locale,
            seo: { title, description, imageAlt },
            faqItems: FAQ_KEYS.map((key) => ({
              question: t(`faq.items.${key}.question`),
              answer: t(`faq.items.${key}.answer`),
            })),
          }),
        );
      }
    }
  }, [pathname, i18n.resolvedLanguage, t]);

  return null;
};
