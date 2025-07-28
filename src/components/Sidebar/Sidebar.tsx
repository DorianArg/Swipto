// components/Sidebar/Sidebar.tsx
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

import UserProfile from "./UserProfile";
import WalletInfo from "./WalletInfo";
import TabSwitcher from "./TabSwitcher";
import CryptoGrid from "./CryptoGrid";

// Ajout des imports pour les filtres
import { useSidebarFilters } from "@/context/SidebarFiltersContext";
import FilterModal from "./FilterModal";
import FilterButton from "./FilterButton";

export default function Sidebar() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({
    realWallet: 2430.5,
    totalInvested: 0,
    swipedCryptos: [],
    favoriteCryptos: [],
    swipeAmount: 100,
  });
  const [activeTab, setActiveTab] = useState<"invested" | "favorites">(
    "invested"
  );

  // Utilisation du contexte des filtres
  const { filters, setFilters } = useSidebarFilters();
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setWallet((prev) => ({
          ...prev,
          totalInvested: data.totalInvested || 0,
          swipedCryptos: data.swipedCryptos || [],
          favoriteCryptos: data.favoriteCryptos || [],
          swipeAmount: data.swipeAmount || 100,
        }));
      }
    });
    return () => unsubscribe();
  }, [user]);

  const displayedCryptos =
    activeTab === "invested" ? wallet.swipedCryptos : wallet.favoriteCryptos;

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-96 min-h-screen bg-gradient-to-b from-[#18192B] to-[#23243a] text-white p-8 rounded-r-2xl shadow-xl"
    >
      {/* Ligne du haut : UserProfile à gauche, FilterButton à droite */}
      <div className="flex items-center justify-between mb-6">
        <UserProfile user={user} />
        <FilterButton onClick={() => setShowFilter(true)} />
      </div>

      <WalletInfo
        realWallet={wallet.realWallet}
        totalInvested={wallet.totalInvested}
        swipeAmount={wallet.swipeAmount}
      />
      <h2 className="text-2xl font-bold mb-4">Cryptos swipées</h2>
      <TabSwitcher
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        investedCount={wallet.swipedCryptos.length}
        favoritesCount={wallet.favoriteCryptos.length}
      />
      <CryptoGrid cryptos={displayedCryptos} />

      {/* Ajout du modal de filtre */}
      <FilterModal
        open={showFilter}
        filters={filters}
        onApply={(f) => {
          setFilters(f);
          setShowFilter(false);
        }}
        onCancel={() => setShowFilter(false)}
        onReset={() =>
          setFilters({
            category: null,
            top: 100,
            priceMin: null,
            priceMax: null,
            volumeMin: null,
            volumeMax: null,
          })
        }
      />
    </motion.aside>
  );
}
