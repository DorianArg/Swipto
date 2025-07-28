import { useState, useEffect } from "react";

/**
 * Format un nombre selon la locale spécifiée, mais seulement côté client.
 * Utile pour éviter les erreurs d'hydratation Next.js (ex : toLocaleString).
 */
export default function useClientLocaleNumber(
  value: number,
  locale: string = "fr-FR",
  options: Intl.NumberFormatOptions = { minimumFractionDigits: 2 }
) {
  const [formatted, setFormatted] = useState(value.toString());

  useEffect(() => {
    setFormatted(value.toLocaleString(locale, options));
  }, [value, locale, options]);

  return formatted;
}
