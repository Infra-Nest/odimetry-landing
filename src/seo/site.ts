export const SITE_ORIGIN = 'https://odimetry.es';

export const LOCALES = ['es', 'en', 'fr', 'de'] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';

export const OG_LOCALES: Record<Locale, string> = {
  es: 'es_ES',
  en: 'en_GB',
  fr: 'fr_FR',
  de: 'de_DE',
};

export const FAQ_KEYS = [
  'audience',
  'scope',
  'limits',
  'certification',
  'availability',
] as const;

export function isLocale(value: string | undefined | null): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Path for a locale home: Spanish is `/`, others are `/en`, `/fr`, `/de`. */
export function localePath(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? '/' : `/${locale}`;
}

/** Absolute canonical URL for a locale home. */
export function localeUrl(locale: Locale): string {
  const path = localePath(locale);
  return path === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}

/** Resolve locale from a pathname (`/`, `/en`, `/en/`, `/fr#x`). */
export function localeFromPathname(pathname: string): Locale {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const segment = clean.split('/').filter(Boolean)[0];
  if (segment && isLocale(segment) && segment !== DEFAULT_LOCALE) {
    return segment;
  }
  return DEFAULT_LOCALE;
}

export type SeoCopy = {
  title: string;
  description: string;
  imageAlt: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type LocaleSeoInput = {
  locale: Locale;
  seo: SeoCopy;
  faqItems: FaqItem[];
};

export function buildHreflangLinks(): Array<{ hreflang: string; href: string }> {
  return [
    ...LOCALES.map((locale) => ({
      hreflang: locale,
      href: localeUrl(locale),
    })),
    { hreflang: 'x-default', href: localeUrl(DEFAULT_LOCALE) },
  ];
}

export function buildJsonLd(input: LocaleSeoInput): object {
  const { locale, seo, faqItems } = input;
  const pageUrl = localeUrl(locale);
  const organizationId = `${SITE_ORIGIN}/#organization`;
  const websiteId = `${SITE_ORIGIN}/#website`;
  const productId = `${SITE_ORIGIN}/#product`;
  const webpageId = `${pageUrl}#webpage`;
  const logoUrl = `${SITE_ORIGIN}/brand/odimetry-mark.svg`;
  const imageUrl = `${SITE_ORIGIN}/brand/odimetry-social.png`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Odimetry',
        url: `${SITE_ORIGIN}/`,
        email: 'info@odimetry.es',
        logo: {
          '@type': 'ImageObject',
          url: logoUrl,
        },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Odimetry',
        url: `${SITE_ORIGIN}/`,
        inLanguage: LOCALES,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'SoftwareApplication',
        '@id': productId,
        name: 'Odimetry',
        url: pageUrl,
        applicationCategory: 'SecurityApplication',
        operatingSystem: 'Web',
        brand: { '@type': 'Brand', name: 'Odimetry' },
        image: imageUrl,
        description: seo.description,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': webpageId,
        name: seo.title,
        url: pageUrl,
        inLanguage: locale,
        description: seo.description,
        isPartOf: { '@id': websiteId },
        about: { '@id': productId },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: imageUrl,
        },
      },
      {
        '@type': 'FAQPage',
        '@id': `${pageUrl}#faq`,
        inLanguage: locale,
        isPartOf: { '@id': webpageId },
        mainEntity: faqItems.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}

/** Build the HTML fragment that replaces/fills the document `<head>` SEO block. */
export function buildHeadHtml(input: LocaleSeoInput): string {
  const { locale, seo } = input;
  const pageUrl = localeUrl(locale);
  const imageUrl = `${SITE_ORIGIN}/brand/odimetry-social.png`;
  const ogLocale = OG_LOCALES[locale];
  const hreflang = buildHreflangLinks()
    .map(
      (link) =>
        `    <link rel="alternate" hreflang="${escapeAttr(link.hreflang)}" href="${escapeAttr(link.href)}" />`,
    )
    .join('\n');
  const jsonLd = JSON.stringify(buildJsonLd(input));

  return `    <!-- Primary Meta Tags -->
    <title>${escapeHtml(seo.title)}</title>
    <meta name="title" content="${escapeAttr(seo.title)}" />
    <meta name="description" content="${escapeAttr(seo.description)}" />
    <meta name="author" content="Odimetry" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${escapeAttr(pageUrl)}" />
${hreflang}

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Odimetry" />
    <meta property="og:title" content="${escapeAttr(seo.title)}" />
    <meta property="og:description" content="${escapeAttr(seo.description)}" />
    <meta property="og:locale" content="${escapeAttr(ogLocale)}" />
    <meta property="og:url" content="${escapeAttr(pageUrl)}" />
    <meta property="og:image" content="${escapeAttr(imageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeAttr(seo.imageAlt)}" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttr(seo.title)}" />
    <meta name="twitter:description" content="${escapeAttr(seo.description)}" />
    <meta name="twitter:url" content="${escapeAttr(pageUrl)}" />
    <meta name="twitter:image" content="${escapeAttr(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeAttr(seo.imageAlt)}" />
    <script id="odimetry-schema" type="application/ld+json">
${jsonLd}
    </script>`;
}

export function applyLocaleToHtml(html: string, input: LocaleSeoInput): string {
  const next = html.replace(/<html\b[^>]*>/i, `<html lang="${input.locale}">`);

  const headStart = next.search(/<!-- Primary Meta Tags -->/i);
  if (headStart === -1) {
    throw new Error('Could not locate SEO head block in HTML template');
  }

  // Replace through the JSON-LD script so Vite-injected CSS/JS tags after it stay intact.
  const afterStart = next.slice(headStart);
  const schemaMatch = afterStart.match(
    /<script id="odimetry-schema"[\s\S]*?<\/script>/i,
  );
  let replaceEnd: number;
  if (schemaMatch?.index !== undefined) {
    replaceEnd = headStart + schemaMatch.index + schemaMatch[0].length;
  } else {
    const bodyOpen = next.search(/<\/head>/i);
    if (bodyOpen === -1 || headStart >= bodyOpen) {
      throw new Error('Could not locate </head> after SEO block');
    }
    replaceEnd = bodyOpen;
  }

  return next.slice(0, headStart) + buildHeadHtml(input) + next.slice(replaceEnd);
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function escapeAttr(value: string): string {
  return escapeHtml(value).replaceAll('"', '&quot;');
}
