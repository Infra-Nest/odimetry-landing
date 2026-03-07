export type ThemeMode = 'light' | 'dark' | 'system';
export type SupportedLanguage = 'es' | 'en' | 'fr' | 'de';

export interface DashboardSettings {
  autoRefresh: boolean;
  refreshInterval: 30 | 60 | 300 | 900;
}

export interface AppSettings {
  theme: ThemeMode;
  language: SupportedLanguage;
  dashboard: DashboardSettings;
}

export const APP_SETTINGS_STORAGE_KEY = 'odimetry.app.settings';

export const DEFAULT_APP_SETTINGS: AppSettings = {
  theme: 'system',
  language: 'es',
  dashboard: {
    autoRefresh: true,
    refreshInterval: 60,
  },
};

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['es', 'en', 'fr', 'de'];
const SUPPORTED_INTERVALS: DashboardSettings['refreshInterval'][] = [30, 60, 300, 900];

const isSupportedLanguage = (value: unknown): value is SupportedLanguage =>
  typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as SupportedLanguage);

const isSupportedTheme = (value: unknown): value is ThemeMode =>
  value === 'light' || value === 'dark' || value === 'system';

const isSupportedInterval = (value: unknown): value is DashboardSettings['refreshInterval'] =>
  typeof value === 'number' && SUPPORTED_INTERVALS.includes(value as DashboardSettings['refreshInterval']);

export const loadAppSettings = (): AppSettings => {
  if (typeof window === 'undefined') {
    return DEFAULT_APP_SETTINGS;
  }

  const rawSettings = window.localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
  if (!rawSettings) {
    return DEFAULT_APP_SETTINGS;
  }

  try {
    const parsed = JSON.parse(rawSettings) as Partial<AppSettings>;

    return {
      theme: isSupportedTheme(parsed.theme) ? parsed.theme : DEFAULT_APP_SETTINGS.theme,
      language: isSupportedLanguage(parsed.language)
        ? parsed.language
        : DEFAULT_APP_SETTINGS.language,
      dashboard: {
        autoRefresh:
          typeof parsed.dashboard?.autoRefresh === 'boolean'
            ? parsed.dashboard.autoRefresh
            : DEFAULT_APP_SETTINGS.dashboard.autoRefresh,
        refreshInterval: isSupportedInterval(parsed.dashboard?.refreshInterval)
          ? parsed.dashboard.refreshInterval
          : DEFAULT_APP_SETTINGS.dashboard.refreshInterval,
      },
    };
  } catch {
    return DEFAULT_APP_SETTINGS;
  }
};

export const saveAppSettings = (settings: AppSettings): void => {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(APP_SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const resolveThemeMode = (theme: ThemeMode): 'light' | 'dark' => {
  if (theme === 'system') {
    if (typeof window === 'undefined') {
      return 'dark';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return theme;
};

export const applyThemeMode = (theme: ThemeMode): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const resolvedTheme = resolveThemeMode(theme);
  document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');
  document.documentElement.dataset.theme = resolvedTheme;
};

export const initializeAppSettings = (): AppSettings => {
  const settings = loadAppSettings();
  applyThemeMode(settings.theme);
  return settings;
};
