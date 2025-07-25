import { useState, useEffect } from "react";
import { useSidebarFilters } from "@/context/SidebarFiltersContext";
import { useFilteredCryptos } from "@/hooks/useFilteredCryptos"; // adapte le chemin
import SwipeCard from "./SwipeCard";

const NB_CRYPTOS_PER_BATCH = 5;

function getRandomBatch(all: any[], count: number) {
  const shuffled = all.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function CardStack() {
  const { filters } = useSidebarFilters();
  const { cryptos, loading, error } = useFilteredCryptos(filters);
  const [currentBatch, setCurrentBatch] = useState<any[]>([]);

  // Rafraîchir la liste de 5 à chaque changement de cryptos (ou refresh manuel)
  useEffect(() => {
    if (cryptos.length > 0) {
      setCurrentBatch(getRandomBatch(cryptos, NB_CRYPTOS_PER_BATCH));
    } else {
      setCurrentBatch([]);
    }
  }, [cryptos]);

  const handleRefresh = () => {
    setCurrentBatch(getRandomBatch(cryptos, NB_CRYPTOS_PER_BATCH));
  };

  if (loading) return <div className="card">Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;
  if (currentBatch.length === 0)
    return <div className="text-gray-400">Aucune crypto trouvée.</div>;

  return (
    <div className="w-[370px] max-w-full flex flex-col items-center justify-center">
      <div className="relative w-full h-[480px]">
        <div className="stack w-full h-full">
          {currentBatch.map((crypto, idx) => (
            <SwipeCard
              key={crypto.id}
              data={crypto}
              onSwipe={() => {}}
              isTop={idx === 0}
            />
          ))}
        </div>
      </div>
      <button className="mt-6 btn-accent" onClick={handleRefresh}>
        Refresh (5 nouvelles cryptos)
      </button>
    </div>
  );
}
