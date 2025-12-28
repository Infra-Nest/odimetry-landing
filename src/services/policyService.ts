import type { PolicyDates } from '../types/policy';

/**
 * Servicio mockup para obtener fechas de última actualización de políticas
 * En el futuro, este servicio se conectará a la API que consulta las fechas desde BBDD
 */
export async function getPolicyDates(): Promise<PolicyDates> {
  // Simular delay de llamada a API
  await new Promise(resolve => setTimeout(resolve, 50));

  // Fechas mockup en formato ISO
  // En el futuro, estas fechas vendrán de la BBDD
  const mockDates: PolicyDates = {
    privacy: '2025-01-01T00:00:00Z',
    cookies: '2025-01-01T00:00:00Z',
    terms: '2025-01-01T00:00:00Z',
  };

  return mockDates;
}

