import type { PricingData } from '../types/pricing';

/**
 * Servicio mockup para obtener planes de pricing
 * En el futuro, este servicio se conectará a la API que consulta la tabla `plans` en BBDD
 */
export async function getPricingPlans(): Promise<PricingData> {
  // Simular delay de llamada a API
  await new Promise(resolve => setTimeout(resolve, 100));

  // Datos mockup compatibles con la estructura de la tabla `plans` en BBDD
  const mockPlans: PricingData = [
    {
      id: 1,
      code: 'free',
      price_cents: 0,
      max_clients: 1,
      max_assets: 1,
      max_users: 1,
      scan_history_days: 0,
      created_at: '2025-01-01T00:00:00Z',
      highlighted: false,
    },
    {
      id: 2,
      code: 'starter',
      price_cents: 1900, // 19€
      max_clients: 3,
      max_assets: 10,
      max_users: 3,
      scan_history_days: 30,
      created_at: '2025-01-01T00:00:00Z',
      highlighted: true,
      popularLabelTranslationKey: 'pricing.plans.starter.popular',
    },
    {
      id: 3,
      code: 'pro',
      price_cents: 4990, // 49€
      max_clients: -1, // -1 para ilimitado
      max_assets: -1,
      max_users: -1,
      scan_history_days: -1, // -1 para histórico completo
      created_at: '2025-01-01T00:00:00Z',
      highlighted: false,
    },
  ];

  return mockPlans;
}

