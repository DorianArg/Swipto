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
import { useSidebarFilters } from "@/context/SidebarFiltersContext";
import FilterModal from "./FilterModal";
import FilterButton from "./FilterButton";
// Ajouts
import AccountBadgesIcons from "@/components/AccountBadgesIcons";
import Leaderboard from "@/components/Leaderboard";

export default function Sidebar() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({
    realWallet: 2430.5,
    totalInvested: 0,
    swipedCryptos: [],
    favoriteCryptos: [],
    swipeAmount: 100,
  });
  const [activeTab, setActiveTab] = useState<
    "invested" | "favorites" | "leaderboard"
  >("invested");

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

  // Ajuster le calcul en tenant compte de "leaderboard"
  const displayedCryptos =
    activeTab === "invested"
      ? wallet.swipedCryptos
      : activeTab === "favorites"
      ? wallet.favoriteCryptos
      : [];

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-96 min-h-screen bg-gradient-to-br from-[#0F1629] via-[#1a1b2f] to-[#18192B] text-white relative overflow-hidden"
    >
      {/* Effets de fond décoratifs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 -right-20 w-60 h-60 bg-gradient-to-br from-green-500/8 to-yellow-500/8 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-2xl"></div>
      </div>

      {/* Contenu principal avec glassmorphism */}
      <div className="relative z-10 h-full backdrop-blur-sm bg-white/5 border-r border-white/10 p-6 flex flex-col">
        {/* Header simple sans ligne décorative - ESPACE RÉDUIT */}
        <div className="mb-4">
          {/* Ligne du haut : UserProfile à gauche, FilterButton à droite */}
          <div className="flex items-center justify-between">
            <UserProfile user={user} />
            <FilterButton onClick={() => setShowFilter(true)} />
          </div>
          {/* Icônes de badges obtenus (affichées entre le compte et "mon wallet actuel") */}
          <div className="mt-2">
            <AccountBadgesIcons limit={3} />
          </div>
        </div>

        {/* Wallet Info avec style amélioré - ESPACE RÉDUIT */}
        <div className="mb-6">
          <WalletInfo
            realWallet={wallet.realWallet}
            totalInvested={wallet.totalInvested}
            swipeAmount={wallet.swipeAmount}
          />
        </div>

        {/* Section Cryptos avec header stylisé amélioré - ESPACE RÉDUIT */}
        <div className="mb-3">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Mes Cryptos
            </h2>
          </div>

          {/* Ligne séparatrice subtile - ESPACE RÉDUIT */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-2"></div>
        </div>

        {/* Tab Switcher avec style moderne - ESPACE RÉDUIT */}
        <div className="mb-3">
          <TabSwitcher
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            investedCount={wallet.swipedCryptos.length}
            favoritesCount={wallet.favoriteCryptos.length}
          />
        </div>

        {/* Contenu selon l'onglet actif */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "leaderboard" ? (
            <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
              <Leaderboard />
              <div className="h-4"></div>
            </div>
          ) : displayedCryptos.length > 0 ? (
            <div className="h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20 hover:scrollbar-thumb-white/30">
              <CryptoGrid cryptos={displayedCryptos} />
              <div className="h-4"></div>
            </div>
          ) : (
            // État vide amélioré
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">
                  {activeTab === "invested"
                    ? "💰"
                    : activeTab === "favorites"
                    ? "⭐"
                    : "🏆"}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {activeTab === "invested"
                  ? "Aucun investissement"
                  : activeTab === "favorites"
                  ? "Aucun favori"
                  : "Aucun classement disponible"}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {activeTab === "invested"
                  ? "Commencez à swiper vers la droite pour investir dans vos premières cryptos !"
                  : activeTab === "favorites"
                  ? "Swipez vers le haut pour ajouter des cryptos à vos favoris."
                  : "Le leaderboard se mettra à jour après des likes et/ou un recompute."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de filtre avec backdrop amélioré */}
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
