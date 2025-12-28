/**
 * Tipos para planes de pricing
 * Compatibles con la estructura de la tabla `plans` en BBDD
 */

export interface PricingPlan {
  id: number;
  code: string; // 'free' | 'starter' | 'pro' | etc.
  price_cents: number;
  max_clients: number;
  max_assets: number;
  max_users: number;
  scan_history_days: number;
  created_at: string; // ISO datetime string
  // Campos de UI determinados en el servicio basándose en el code
  highlighted?: boolean;
  popularLabelTranslationKey?: string; // ID de traducción para el label "popular"
}

export type PricingData = PricingPlan[];

