import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DEFAULT_LOCALE, isLocale, type Locale } from '../seo/site';

const localeLoaders: Record<Locale, () => Promise<{ default: Record<string, unknown> }>> = {
  es: () => import('./locales/es/translation.json'),
  en: () => import('./locales/en/translation.json'),
  fr: () => import('./locales/fr/translation.json'),
  de: () => import('./locales/de/translation.json'),
};

/** Initial language comes from the HTML document (set per localized page). */
export function documentLocale(): Locale {
  if (typeof document === 'undefined') {
    return DEFAULT_LOCALE;
  }
  const lang = document.documentElement.lang?.split('-')[0];
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

export async function ensureLocale(locale: Locale): Promise<void> {
  if (i18n.hasResourceBundle(locale, 'translation')) {
    return;
  }
  const module = await localeLoaders[locale]();
  i18n.addResourceBundle(locale, 'translation', module.default, true, true);
}

/** Load the page locale (and Spanish fallback when needed) before first paint. */
export async function initI18n(): Promise<typeof i18n> {
  const locale = documentLocale();

  if (!i18n.isInitialized) {
    await i18n.use(initReactI18next).init({
      lng: locale,
      // Translations are complete per locale; avoid shipping every language up front.
      fallbackLng: false,
      supportedLngs: ['es', 'en', 'fr', 'de'],
      resources: {},
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
  }

  await ensureLocale(locale);
  if (i18n.language !== locale) {
    await i18n.changeLanguage(locale);
  }

  return i18n;
}

export default i18n;
