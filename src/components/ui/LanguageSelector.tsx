import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { localePath, type Locale } from '../../seo/site';

const languages: Array<{ code: Locale; name: string; flag: string }> = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
];

interface LanguageSelectorProps {
  menuAlign?: 'left' | 'right' | 'auto';
  menuDirection?: 'up' | 'down' | 'auto';
  compact?: boolean;
  fullWidth?: boolean;
  /**
   * `link` navigates to locale URLs (landing SEO).
   * `switch` changes i18n in place (authenticated UI, not indexed).
   */
  mode?: 'link' | 'switch';
  /** Current locale for highlighting; defaults to i18n.language. */
  currentLocale?: Locale;
}

export const LanguageSelector = ({
  menuAlign = 'auto',
  menuDirection = 'auto',
  compact = false,
  fullWidth = false,
  mode = 'switch',
  currentLocale,
}: LanguageSelectorProps) => {
  const { i18n, t: translate } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuItemRefs = useRef<Array<HTMLAnchorElement | HTMLButtonElement | null>>([]);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const activeCode =
    currentLocale ||
    (languages.find((lang) => lang.code === i18n.language)?.code ?? 'es');
  const currentLanguage =
    languages.find((lang) => lang.code === activeCode) || languages[0];

  useEffect(() => {
    document.documentElement.lang = activeCode;
  }, [activeCode]);

  const updateMenuPosition = useCallback(() => {
    const trigger = buttonRef.current;
    const menu = menuRef.current;

    if (!trigger || !menu) {
      return;
    }

    const triggerRect = trigger.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 8;

    const menuWidth = menuRect.width || 192;
    const menuHeight = menuRect.height || 200;

    const spaceRight = viewportWidth - triggerRect.left;
    const spaceLeft = triggerRect.right;
    const resolvedAlign =
      menuAlign !== 'auto'
        ? menuAlign
        : spaceRight >= menuWidth || spaceRight >= spaceLeft
          ? 'left'
          : 'right';

    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const resolvedDirection =
      menuDirection !== 'auto'
        ? menuDirection
        : spaceBelow >= menuHeight || spaceBelow >= spaceAbove
          ? 'down'
          : 'up';

    const rawLeft =
      resolvedAlign === 'left'
        ? triggerRect.left
        : triggerRect.right - menuWidth;
    const rawTop =
      resolvedDirection === 'down'
        ? triggerRect.bottom + margin
        : triggerRect.top - menuHeight - margin;

    const maxLeft = Math.max(margin, viewportWidth - menuWidth - margin);
    const maxTop = Math.max(margin, viewportHeight - menuHeight - margin);

    const left = Math.min(Math.max(rawLeft, margin), maxLeft);
    const top = Math.min(Math.max(rawTop, margin), maxTop);

    setMenuPosition({ top, left });
  }, [menuAlign, menuDirection]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    requestAnimationFrame(updateMenuPosition);

    const handleReposition = () => {
      updateMenuPosition();
    };

    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [isOpen, updateMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    requestAnimationFrame(() => {
      menuItemRefs.current.find((item) => item?.dataset.language === currentLanguage.code)?.focus();
    });
  }, [currentLanguage.code, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !dropdownRef.current?.contains(document.activeElement)) {
        return;
      }

      event.preventDefault();
      setIsOpen(false);
      requestAnimationFrame(() => buttonRef.current?.focus());
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const closeMenu = () => {
    setIsOpen(false);
    requestAnimationFrame(() => buttonRef.current?.focus());
  };

  const handleLanguageChange = (code: Locale) => {
    void i18n.changeLanguage(code);
    closeMenu();
  };

  const handleMenuItemKeyDown = (
    event: React.KeyboardEvent<HTMLAnchorElement | HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === 'Tab') {
      setIsOpen(false);
      buttonRef.current?.focus();
      return;
    }
    const lastIndex = languages.length - 1;
    let nextIndex: number | null = null;

    if (event.key === 'ArrowDown') {
      nextIndex = index === lastIndex ? 0 : index + 1;
    } else if (event.key === 'ArrowUp') {
      nextIndex = index === 0 ? lastIndex : index - 1;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = lastIndex;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      menuItemRefs.current[nextIndex]?.focus();
    }
  };

  const itemClassName = (code: Locale) =>
    `flex w-full items-center space-x-3 px-4 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-300 hover:bg-gray-700 ${
      activeCode === code ? 'bg-gray-700 text-gray-100' : 'text-gray-300'
    }`;

  return (
    <div
      className={`relative ${fullWidth ? 'w-full' : 'w-auto'}`}
      ref={dropdownRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className={`flex items-center rounded-lg px-3 py-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 ${fullWidth ? 'w-full' : 'w-auto'}`}
        aria-label={translate('header.selectLanguage')}
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-haspopup="menu"
      >
        <div className="flex w-10 shrink-0 items-center justify-center">
          <Globe className="w-4 h-4" aria-hidden="true" />
        </div>
        <div
          className={`flex items-center overflow-hidden whitespace-nowrap transition-[opacity,margin-left,width] duration-300 ${
            compact ? 'ml-0 w-0 opacity-0' : 'ml-3 w-auto opacity-100'
          }`}
        >
          <span className="text-lg" aria-hidden="true">{currentLanguage.flag}</span>
          <span className="ml-1 hidden text-sm font-medium sm:inline">
            {currentLanguage.code.toUpperCase()}
          </span>
        </div>
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          role="menu"
          aria-label={translate('header.selectLanguage')}
          aria-orientation="vertical"
          className="fixed z-[70] w-48 max-h-72 overflow-y-auto overscroll-contain rounded-lg border border-gray-700 bg-gray-800 shadow-lg"
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
        >
          <div className="py-1">
            {languages.map((language, index) =>
              mode === 'link' ? (
                <a
                  key={language.code}
                  ref={(element) => {
                    menuItemRefs.current[index] = element;
                  }}
                  href={localePath(language.code)}
                  hrefLang={language.code}
                  onClick={closeMenu}
                  onKeyDown={(event) => handleMenuItemKeyDown(event, index)}
                  data-language={language.code}
                  className={itemClassName(language.code)}
                  role="menuitemradio"
                  tabIndex={-1}
                  aria-checked={currentLanguage.code === language.code}
                  lang={language.code}
                >
                  <span className="text-xl" aria-hidden="true">{language.flag}</span>
                  <span className="flex-1 text-sm font-medium">{language.name}</span>
                  {activeCode === language.code && (
                    <span className="text-gray-100" aria-hidden="true">✓</span>
                  )}
                </a>
              ) : (
                <button
                  key={language.code}
                  ref={(element) => {
                    menuItemRefs.current[index] = element;
                  }}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  onKeyDown={(event) => handleMenuItemKeyDown(event, index)}
                  data-language={language.code}
                  className={itemClassName(language.code)}
                  role="menuitemradio"
                  tabIndex={-1}
                  aria-checked={currentLanguage.code === language.code}
                  lang={language.code}
                >
                  <span className="text-xl" aria-hidden="true">{language.flag}</span>
                  <span className="flex-1 text-sm font-medium">{language.name}</span>
                  {activeCode === language.code && (
                    <span className="text-gray-100" aria-hidden="true">✓</span>
                  )}
                </button>
              ),
            )}
          </div>
        </div>
      )}
    </div>
  );
};
