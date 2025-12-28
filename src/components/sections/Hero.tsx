import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';

export const Hero = () => {
  const { t: translate } = useTranslation();

  return (
    <section 
      className="relative bg-gradient-to-br from-black via-gray-950 to-black text-white py-16 sm:py-20 md:py-32 overflow-hidden"
      aria-labelledby="hero-heading"
    >
      {/* Efecto de fondo tecnológico */}
      <div className="absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradientranslate(circle_at_50%_50%,rgba(96,165,250,0.4),transparent_50%)]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto px-2 sm:px-0">
          <h1 id="hero-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-5 sm:mb-6 leading-tight">
            {translate('hero.title')}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 sm:mb-10 leading-relaxed px-2 sm:px-0">
            {translate('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full sm:w-auto"
              aria-label={translate('hero.analyzeDomain')}
            >
              {translate('hero.analyzeDomain')}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full sm:w-auto border-white text-white hover:bg-white/10 bg-transparent hover:border-white/80"
              aria-label={translate('hero.viewExample')}
            >
              {translate('hero.viewExample')}
            </Button>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            {translate('hero.noCreditCard')}
          </p>
        </div>
      </Container>
    </section>
  );
};

