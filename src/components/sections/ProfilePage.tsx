import { UserCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';

export const ProfilePage = () => {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen bg-gray-900 py-10 md:py-14">
      <Container size="xl">
        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-8 md:p-10">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
            <UserCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-bold text-gray-100 md:text-4xl">
            {t('appPages.profile.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-gray-300">
            {t('appPages.profile.description')}
          </p>
          <p className="mt-6 inline-flex rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-200">
            {t('appPages.comingSoon')}
          </p>
        </div>
      </Container>
    </section>
  );
};
