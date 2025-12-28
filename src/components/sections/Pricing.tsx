import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { getPricingPlans } from '../../services/pricingService';
import type { PricingPlan } from '../../types/pricing';

interface PlanDisplay {
  name: string;
  price: string;
  priceInteger: string;
  priceDecimal: string | null;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  popularLabel?: string;
}

export const Pricing = () => {
  const { t: translate } = useTranslation();
  const [plans, setPlans] = useState<PlanDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const pricingPlans = await getPricingPlans();
        
        // Mapear datos raw a formato de display usando traducciones
        const mappedPlans: PlanDisplay[] = pricingPlans.map((plan: PricingPlan) => {
          const baseKey = `pricing.plans.${plan.code}`;
          
          // Obtener features según el plan
          const featureKeys: Record<string, string[]> = {
            free: ['domains', 'audit', 'report', 'history'],
            starter: ['domains', 'audit', 'report', 'history', 'support'],
            pro: ['domains', 'audit', 'history', 'teams', 'api', 'support'],
          };
          
          const features = (featureKeys[plan.code] || []).map(
            (featureKey) => translate(`${baseKey}.features.${featureKey}`)
          );
          
          // Convertir price_cents a euros y formatear
          const priceInEuros = plan.price_cents / 100;
          // Si tiene decimales, mostrar siempre 2 decimales (ej: 49.90)
          // Si es una cantidad exacta, mostrar sin decimales (ej: 19)
          const priceFormatted = priceInEuros % 1 === 0 
            ? priceInEuros.toString() 
            : priceInEuros.toFixed(2);
          
          // Separar parte entera y decimal para mostrar con diferentes tamaños
          const [integerPart, decimalPart] = priceFormatted.includes('.')
            ? priceFormatted.split('.')
            : [priceFormatted, null];
          
          return {
            name: translate(`${baseKey}.name`),
            price: priceFormatted,
            priceInteger: integerPart,
            priceDecimal: decimalPart,
            period: translate(`${baseKey}.period`),
            description: translate(`${baseKey}.description`),
            features,
            cta: translate(`${baseKey}.cta`),
            highlighted: plan.highlighted || false,
            popularLabel: plan.popularLabelTranslationKey 
              ? translate(plan.popularLabelTranslationKey)
              : undefined,
          };
        });
        
        setPlans(mappedPlans);
      } catch (error) {
        console.error('Error loading pricing plans:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [translate]);

  if (loading) {
    return (
      <section id="pricing" className="py-16 md:py-24 bg-gray-950">
        <Container>
          <div className="text-center">
            <p className="text-gray-400">{translate('pricing.loading', 'Cargando planes...')}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-24 bg-gray-950">
      <Container>
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-100 mb-3 sm:mb-4">
            {translate('pricing.title')}
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto px-2 sm:px-0">
            {translate('pricing.subtitle')}
          </p>
          <p className="mt-3 sm:mt-4 text-sm text-gray-400">
            {translate('pricing.note')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              hover={true}
              className={`border ${
                plan.highlighted
                  ? 'border-blue-400 shadow-xl md:scale-105 hover:scale-110 hover:border-blue-300'
                  : 'border-gray-800 hover:border-blue-600'
              } flex flex-col transition-all duration-300`}
            >
              {plan.highlighted && plan.popularLabel && (
                <div className="bg-blue-500 text-white text-center py-2 px-4 rounded-t-lg -mx-5 sm:-mx-6 -mt-5 sm:-mt-6 mb-4 sm:mb-6">
                  <span className="text-sm font-semibold">{plan.popularLabel}</span>
                </div>
              )}
              
              <div className="grow">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-2">{plan.name}</h3>
                <p className="text-sm sm:text-base text-gray-300 mb-5 sm:mb-6">{plan.description}</p>
                
                <div className="mb-5 sm:mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-100">{plan.priceInteger}</span>
                  {plan.priceDecimal && (
                    <span className="text-lg sm:text-xl font-bold text-gray-100">.{plan.priceDecimal}</span>
                  )}
                  <span className="text-gray-400 ml-2 text-sm sm:text-base">{plan.period}</span>
                </div>

                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-400 shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm sm:text-base text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant={plan.highlighted ? 'primary' : 'secondary'}
                size="lg"
                className={`w-full ${
                  plan.highlighted 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 !text-white shadow-lg hover:shadow-2xl hover:scale-105 hover:-translate-y-1 border-0' 
                    : '!bg-gray-800 hover:!bg-blue-500 !text-gray-100 hover:!text-white border-0 shadow-md hover:shadow-xl hover:scale-105 hover:-translate-y-1'
                } transition-all duration-300 font-semibold`}
                aria-label={`${plan.cta} - Plan ${plan.name}`}
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};

