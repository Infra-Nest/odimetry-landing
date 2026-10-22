import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_LOCALE,
  localeFromPathname,
  localePath,
  type Locale,
} from '../seo/site';

export function useLocale(): Locale {
  const { pathname } = useLocation();
  return useMemo(() => localeFromPathname(pathname), [pathname]);
}

export function useLocaleHomePath(): string {
  const locale = useLocale();
  return localePath(locale);
}

export function useLocaleHashHref(hash: string): string {
  const home = useLocaleHomePath();
  const id = hash.replace(/^#/, '');
  return home === '/' ? `/#${id}` : `${home}#${id}`;
}

export { DEFAULT_LOCALE, localePath, type Locale };
