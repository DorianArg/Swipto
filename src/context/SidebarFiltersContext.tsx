import { createContext, useContext, useState } from "react";

export type CryptoFilters = {
  category: string | null;
  top: number;
  priceMin: number | null;
  priceMax: number | null;
  volumeMin: number | null;
  volumeMax: number | null;
};

const defaultFilters: CryptoFilters = {
  category: null,
  top: 100,
  priceMin: null,
  priceMax: null,
  volumeMin: null,
  volumeMax: null,
};

const SidebarFiltersContext = createContext<{
  filters: CryptoFilters;
  setFilters: (f: CryptoFilters) => void;
} | null>(null);

export function SidebarFiltersProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [filters, setFilters] = useState<CryptoFilters>(defaultFilters);
  return (
    <SidebarFiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </SidebarFiltersContext.Provider>
  );
}

export function useSidebarFilters() {
  const ctx = useContext(SidebarFiltersContext);
  if (!ctx)
    throw new Error(
      "useSidebarFilters must be used within SidebarFiltersProvider"
    );
  return ctx;
}
