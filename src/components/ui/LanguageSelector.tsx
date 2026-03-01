import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
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
}

export const LanguageSelector = ({
  menuAlign = 'auto',
  menuDirection = 'auto',
  compact = false,
  fullWidth = false,
}: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  const updateMenuPosition = () => {
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
  };

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
  }, [isOpen, menuAlign, menuDirection]);

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

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'}`} ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center rounded-lg px-3 py-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${fullWidth ? 'w-full' : 'w-auto'}`}
        aria-label="Seleccionar idioma"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex w-10 shrink-0 items-center justify-center">
          <Globe className="w-4 h-4" aria-hidden="true" />
        </div>
        <div
          className={`flex items-center overflow-hidden whitespace-nowrap transition-all duration-300 ${
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
          className="fixed z-[70] w-48 max-h-72 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 shadow-lg"
          style={{ top: `${menuPosition.top}px`, left: `${menuPosition.left}px` }}
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-700 transition-colors ${
                  i18n.language === language.code
                    ? 'bg-gray-700 text-blue-400'
                    : 'text-gray-300'
                }`}
                role="menuitem"
              >
                <span className="text-xl" aria-hidden="true">{language.flag}</span>
                <span className="flex-1 text-sm font-medium">{language.name}</span>
                {i18n.language === language.code && (
                  <span className="text-blue-400" aria-hidden="true">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
