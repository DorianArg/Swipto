import { useState, useEffect } from "react";
import type { CryptoFilters } from "@/context/SidebarFiltersContext";

export function useFilteredCryptos(filters: CryptoFilters) {
  const [cryptos, setCryptos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCryptos() {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          vs_currency: "usd",
          order: "market_cap_desc",
          per_page: filters.top.toString(),
          page: "1",
        });
        if (filters.category) params.append("category", filters.category);

        const url = `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`;

        const res = await fetch(url);
        if (!res.ok) throw new Error("Erreur CoinGecko");

        let data = await res.json();

        // Filtrage côté client (prix)
        if (filters.priceMin !== null && filters.priceMin !== undefined)
          data = data.filter(
            (coin: any) => coin.current_price >= (filters.priceMin as number)
          );
        if (filters.priceMax !== null && filters.priceMax !== undefined)
          data = data.filter(
            (coin: any) => coin.current_price <= (filters.priceMax as number)
          );

        // Filtrage côté client (volume)
        if (filters.volumeMin !== null && filters.volumeMin !== undefined)
          data = data.filter(
            (coin: any) =>
              filters.volumeMin !== null &&
              filters.volumeMin !== undefined &&
              coin.total_volume >= filters.volumeMin
          );
        if (filters.volumeMax !== null && filters.volumeMax !== undefined)
          data = data.filter(
            (coin: any) =>
              filters.volumeMax !== null &&
              filters.volumeMax !== undefined &&
              coin.total_volume <= filters.volumeMax
          );

        setCryptos(data);
      } catch (err: any) {
        setError(err.message || "Erreur inconnue");
        setCryptos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCryptos();
  }, [filters]);

  return { cryptos, loading, error };
}
