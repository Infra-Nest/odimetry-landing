import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  FileCheck,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ScanSearch,
  Settings,
  Shield,
  UserCircle,
} from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../ui/LanguageSelector';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

type NavItemKey = 'dashboard' | 'scans' | 'authority' | 'settings' | 'profile';

interface NavItem {
  key: NavItemKey;
  to: string;
  icon: LucideIcon;
  end?: boolean;
}

const navigationItems: NavItem[] = [
  { key: 'dashboard', to: '/dashboard', icon: LayoutDashboard, end: true },
  { key: 'scans', to: '/scans', icon: ScanSearch },
  { key: 'authority', to: '/authority-files', icon: FileCheck },
  { key: 'settings', to: '/settings', icon: Settings },
  { key: 'profile', to: '/profile', icon: UserCircle },
];

/*
 * Layout strategy (no "dance" on collapse):
 *
 * Every row is a flex container with a FIXED-WIDTH icon column (w-10,
 * flex-shrink-0, centered content) followed by a text wrapper that
 * collapses to w-0 with a transition.
 *
 * • Expanded: icon column (40px, centered) + ml-3 + text = left-aligned.
 * • Collapsed: icon column (40px, centered) + ml-0 + text (w-0) = the
 *   icon column is the only visible child, and because it has a fixed
 *   width that is narrower than the button, it gets pushed to the left
 *   by the button's symmetric padding… but the icon INSIDE the column
 *   is always centred via flex justify-center.
 *
 * The button's padding is set so the icon column centres perfectly
 * within the collapsed sidebar width:
 *   aside w-20 = 80px
 *   wrapper p-2 = 8px each side → inner = 64px
 *   button w-full, px-3 (12px each side) → content area = 40px
 *   icon column w-10 = 40px → fills content area exactly → centred ✓
 */

const textClasses = (isCollapsed: boolean) =>
  `overflow-hidden whitespace-nowrap transition-all duration-300 ${
    isCollapsed ? 'ml-0 w-0 opacity-0' : 'ml-3 w-auto opacity-100'
  }`;

export const Sidebar = ({ isCollapsed, onToggleCollapse }: SidebarProps) => {
  const { t: translate } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <aside
      className={`sticky top-0 flex h-screen shrink-0 flex-col border-r border-gray-800 bg-gray-950 overflow-hidden transition-[width] duration-300 ${isCollapsed ? 'w-20' : 'w-72'}`}
      aria-label={translate('appNav.panel')}
    >
      {/* Logo */}
      <div className="border-b border-gray-800 p-2">
        <Link
          to="/dashboard"
          className="flex items-center rounded-lg px-3 py-3 text-gray-100 transition-colors hover:bg-gray-800"
          aria-label={translate('appNav.dashboard')}
          title={translate('appNav.dashboard')}
        >
          <div className="flex w-10 shrink-0 items-center justify-center">
            <Shield className="h-7 w-7 text-blue-400" aria-hidden="true" />
          </div>
          <span className={`text-lg font-bold ${textClasses(isCollapsed)}`}>
            Odimetry
          </span>
        </Link>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 space-y-1 p-2" aria-label={translate('appNav.panel')}>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center rounded-xl border px-[11px] py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950 ${
                  isActive
                    ? 'border-blue-500/70 bg-blue-500/10 text-blue-200'
                    : 'border-transparent text-gray-300 hover:border-gray-700 hover:bg-gray-800 hover:text-gray-100'
                }`
              }
              title={translate(`appNav.${item.key}`)}
            >
              <div className="flex w-10 shrink-0 items-center justify-center">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div
                className={`flex min-w-0 items-center gap-2 ${textClasses(isCollapsed)} ${
                  !isCollapsed ? 'flex-1' : ''
                }`}
              >
                <span className="flex-1 truncate">{translate(`appNav.${item.key}`)}</span>
                <ChevronRight
                  className="h-4 w-4 shrink-0 text-gray-500 transition-colors group-hover:text-gray-300"
                  aria-hidden="true"
                />
              </div>
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="p-2">
        <button
          onClick={onToggleCollapse}
          className="flex w-full items-center rounded-xl border border-transparent px-[11px] py-3 text-sm font-medium text-gray-300 transition-colors hover:border-gray-700 hover:bg-gray-800 hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          aria-label={
            isCollapsed ? translate('appNav.expand') : translate('appNav.collapse')
          }
          title={
            isCollapsed ? translate('appNav.expand') : translate('appNav.collapse')
          }
        >
          <div className="flex w-10 shrink-0 items-center justify-center">
            {isCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
            ) : (
              <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
            )}
          </div>
          <span className={textClasses(isCollapsed)}>
            {translate('appNav.collapse')}
          </span>
        </button>
      </div>

      {/* Bottom section: language + logout */}
      <div className="space-y-1 border-t border-gray-800 p-2">
        <LanguageSelector
          menuAlign="left"
          menuDirection="up"
          compact={isCollapsed}
          fullWidth
        />

        <button
          onClick={handleLogout}
          className="flex w-full items-center rounded-xl border border-transparent px-[11px] py-3 text-sm font-medium text-gray-300 transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-950"
          aria-label={translate('appNav.logout')}
          title={translate('appNav.logout')}
        >
          <div className="flex w-10 shrink-0 items-center justify-center">
            <LogOut className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className={textClasses(isCollapsed)}>
            {translate('appNav.logout')}
          </span>
        </button>
      </div>
    </aside>
  );
};
