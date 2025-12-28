import i18n from '../i18n/config';

/**
 * Formatea una fecha ISO según el idioma actual
 * @param isoDateString - Fecha en formato ISO (ej: "2025-01-01T00:00:00Z")
 * @returns Fecha formateada según el idioma
 */
export function formatPolicyDate(isoDateString: string): string {
  const date = new Date(isoDateString);
  const language = i18n.language || 'es';

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  try {
    return new Intl.DateTimeFormat(language, options).format(date);
  } catch {
    // Fallback a formato básico si hay error
    return date.toLocaleDateString(language);
  }
}

/**
 * Formatea una fecha ISO para mostrar "Última actualización: [fecha]"
 * @param isoDateString - Fecha en formato ISO
 * @param translationKey - Clave de traducción para "Última actualización" (ej: "privacy.lastUpdate")
 * @param translate - Función de traducción de i18next
 * @returns Texto formateado con la fecha
 */
export function formatLastUpdate(
  isoDateString: string,
  translationKey: string,
  translate: (key: string) => string
): string {
  const formattedDate = formatPolicyDate(isoDateString);
  const lastUpdateText = translate(translationKey);
  
  // Si la traducción ya incluye un placeholder para la fecha
  if (lastUpdateText.includes('{{date}}') || lastUpdateText.includes('{date}')) {
    return lastUpdateText.replace(/\{\{?date\}\}?/g, formattedDate);
  }
  
  // Si la traducción ya tiene una fecha hardcodeada, extraer solo el prefijo
  // Buscar el patrón común: "Prefijo: fecha" donde el prefijo termina en ":" o " :"
  // Esto funciona para español, francés, alemán e inglés
  if (lastUpdateText.includes(':')) {
    // Dividir por ":" y tomar solo la primera parte (el prefijo)
    // Esto elimina cualquier fecha que venga después
    const parts = lastUpdateText.split(':');
    const prefix = parts[0].trim();
    // Añadir la nueva fecha formateada
    return `${prefix}: ${formattedDate}`;
  }
  
  // Si no hay ":" en la traducción, añadir la fecha al final
  return `${lastUpdateText}: ${formattedDate}`;
}

