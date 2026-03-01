import { useState, useEffect } from 'react';
import { UserCircle, Building2, Mail, Phone, Calendar, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { getCurrentUser, getUserOrganizations, switchOrganization } from '../../services/userService';
import type { User, UserOrganization } from '../../types/user';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [organizations, setOrganizations] = useState<UserOrganization[]>([]);
  const [currentOrgId, setCurrentOrgId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [switching, setSwitching] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, orgsData] = await Promise.all([
        getCurrentUser(),
        getUserOrganizations(),
      ]);
      
      setUser(userData);
      setOrganizations(orgsData);
      
      // Get current organization from localStorage and fallback to first available org
      const storedOrgId = localStorage.getItem('organization_id');
      const hasStoredOrg = Boolean(
        storedOrgId && orgsData.some((org) => org.organization_id === storedOrgId),
      );

      const resolvedOrgId = hasStoredOrg
        ? (storedOrgId as string)
        : (orgsData[0]?.organization_id ?? '');

      setCurrentOrgId(resolvedOrgId);

      if (resolvedOrgId) {
        localStorage.setItem('organization_id', resolvedOrgId);
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message || t('appPages.profile.errors.fetchUser'));
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchOrganization = async (orgId: string) => {
    if (orgId === currentOrgId) return;

    try {
      setSwitching(true);
      setError(null);
      setSuccessMessage(null);
      
      await switchOrganization(orgId);
      setCurrentOrgId(orgId);
      setSuccessMessage(t('appPages.profile.success.switchOrg'));
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error switching organization:', err);
      setError(err.message || t('appPages.profile.errors.switchOrg'));
    } finally {
      setSwitching(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const currentOrg = organizations.find(org => org.organization_id === currentOrgId);

  if (loading) {
    return (
      <section className="min-h-screen bg-gray-900 py-10 md:py-14">
        <Container size="xl">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 mx-auto mb-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400">{t('appPages.profile.loading')}</p>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-900 py-10 md:py-14">
      <Container size="xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <UserCircle className="h-6 w-6" aria-hidden="true" />
            </span>
            <h1 className="text-3xl font-bold text-gray-100 md:text-4xl">
              {t('appPages.profile.title')}
            </h1>
          </div>
          <p className="text-gray-400 max-w-2xl">
            {t('appPages.profile.description')}
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3">
            <CheckCircle className="h-5 w-5 text-green-400 shrink-0" />
            <p className="text-sm text-green-300">{successMessage}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3">
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Personal Information Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              {t('appPages.profile.personalInfo')}
            </h2>
            
            <div className="space-y-5">
              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Mail className="h-4 w-4" />
                  {t('appPages.profile.email')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-gray-200">
                  {user?.email || '-'}
                </div>
              </div>

              {/* First Name */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  {t('appPages.profile.firstname')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-gray-200">
                  {user?.firstname || '-'}
                </div>
              </div>

              {/* Surname */}
              <div>
                <label className="text-sm font-medium text-gray-400 mb-2 block">
                  {t('appPages.profile.surname')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-gray-200">
                  {user?.surname || '-'}
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Phone className="h-4 w-4" />
                  {t('appPages.profile.phone')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-gray-200">
                  {user?.phone_number || '-'}
                </div>
              </div>

              {/* Account Created */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Calendar className="h-4 w-4" />
                  {t('appPages.profile.accountCreated')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3 text-gray-200">
                  {user?.created_at ? formatDate(user.created_at) : '-'}
                </div>
              </div>
            </div>
          </div>

          {/* Organization Card */}
          <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-6">
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              {t('appPages.profile.organizationInfo')}
            </h2>
            
            <div className="space-y-5">
              {/* Current Organization */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-2">
                  <Building2 className="h-4 w-4" />
                  {t('appPages.profile.currentOrganization')}
                </label>
                <div className="rounded-lg border border-gray-700 bg-gray-900/50 px-4 py-3">
                  <p className="text-gray-200 font-medium">{currentOrg?.name || '-'}</p>
                  {currentOrg?.org_type && (
                    <p className="text-sm text-gray-400 mt-1">
                      {t(`appPages.profile.${currentOrg.org_type}`)}
                    </p>
                  )}
                </div>
              </div>

              {/* Organization Selector */}
              {organizations.length > 1 && (
                <div>
                  <label className="text-sm font-medium text-gray-400 mb-2 block">
                    {t('appPages.profile.switchOrganization')}
                  </label>
                  <select
                    value={currentOrgId}
                    onChange={(e) => handleSwitchOrganization(e.target.value)}
                    disabled={switching}
                    className="w-full rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 text-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" disabled>
                      {t('appPages.profile.selectOrganization')}
                    </option>
                    {organizations.map((org) => (
                      <option key={org.organization_id} value={org.organization_id}>
                        {org.name} ({t(`appPages.profile.${org.org_type}`)})
                      </option>
                    ))}
                  </select>
                  {switching && (
                    <p className="text-sm text-blue-400 mt-2 flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                      {t('appPages.profile.loading')}
                    </p>
                  )}
                </div>
              )}

              {/* Single Organization Info */}
              {organizations.length === 1 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3">
                  <p className="text-sm text-gray-400">
                    {t('appPages.profile.singleOrg')}
                  </p>
                </div>
              )}

              {/* No Organizations */}
              {organizations.length === 0 && (
                <div className="rounded-lg border border-gray-700 bg-gray-800/30 px-4 py-3">
                  <p className="text-sm text-gray-400">
                    {t('appPages.profile.noOrgs')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
