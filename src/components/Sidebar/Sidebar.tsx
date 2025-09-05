// components/Sidebar/Sidebar.tsx
import React, { useState, useEffect } from "react";
import { useLeaderboard } from "../../hooks/useLeaderboard";
import { useAuth } from "../../context/AuthContext";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { Trophy, Heart } from "lucide-react";
import { motion } from "framer-motion";

// Composants
import UserProfile from "./UserProfile";
import WalletInfo from "./WalletInfo";
import FilterButton from "./FilterButton";
import TabSwitcher from "./TabSwitcher";
import CryptoGrid from "./CryptoGrid";
import FilterModal from "./FilterModal";
import DropdownSection, { DropdownItem } from "./DropdownSection";

// Ajout des imports pour les filtres
import { useSidebarFilters } from "../../context/SidebarFiltersContext";

export default function Sidebar() {
  const { user } = useAuth();

  // Hooks TOUJOURS au top-level (pas d'early return avant ceci)
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
  const { filters, setFilters } = useSidebarFilters();
  const [showFilter, setShowFilter] = useState(false);
  const [mesCryptosOpen, setMesCryptosOpen] = useState(true);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);

  // Hook leaderboard en lazy (pas d’appel au montage)
  const {
    data: leaderboardData,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useLeaderboard(10, { autoFetch: false });

  // Charge à chaque ouverture du dropdown (pas au montage)
  useEffect(() => {
    if (leaderboardOpen) {
      refetchLeaderboard();
    }
  }, [leaderboardOpen, refetchLeaderboard]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
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

  // Un seul ouvert à la fois
  const handleMesCryptosToggle = () => {
    const newState = !mesCryptosOpen;
    setMesCryptosOpen(newState);
    if (newState && leaderboardOpen) setLeaderboardOpen(false);
  };

  // Supporte DropdownSection qui peut passer le nouvel état (open?: boolean)
  const handleLeaderboardToggle = (open?: boolean) => {
    const next = typeof open === "boolean" ? open : !leaderboardOpen;
    setLeaderboardOpen(next);
    if (next && mesCryptosOpen) setMesCryptosOpen(false);
  };

  const displayedCryptos =
    activeTab === "invested" ? wallet.swipedCryptos : wallet.favoriteCryptos;

  // Fonction pour rendre les éléments du leaderboard avec plus d'infos
  const renderLeaderboardContent = () => {
    if (leaderboardLoading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-white/10 rounded-lg h-16"
            ></div>
          ))}
        </div>
      );
    }

    if (leaderboardError) {
      return (
        <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-400 text-sm">Erreur: {leaderboardError}</p>
        </div>
      );
    }

    if (leaderboardData.length === 0) {
      return (
        <div className="text-center p-6 bg-white/5 rounded-lg">
          <Trophy className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Aucune donnée disponible</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {leaderboardData.map((item) => (
          <div
            key={item.coinId}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 flex items-center justify-center shrink-0">
                {item.rank === 1 && (
                  <span className="text-yellow-400 text-lg">🥇</span>
                )}
                {item.rank === 2 && (
                  <span className="text-gray-300 text-lg">🥈</span>
                )}
                {item.rank === 3 && (
                  <span className="text-orange-400 text-lg">🥉</span>
                )}
                {item.rank > 3 && (
                  <span className="text-gray-400 font-bold text-xs">
                    #{item.rank}
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-bold text-white text-sm uppercase tracking-wide truncate">
                    {item.symbol}
                  </p>
                  {item.category && (
                    <span className="text-xs bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded-full shrink-0">
                      {item.category}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 truncate" title={item.name}>
                  {item.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-pink-400 shrink-0">
              <Heart className="w-4 h-4 fill-current" />
              <span className="font-bold text-sm">{item.likeCount}</span>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
      <div className="relative z-10 h-screen backdrop-blur-sm bg-white/5 border-r border-white/10 p-6 flex flex-col">
        {/* Header simple sans ligne décorative - ESPACE RÉDUIT */}
        <div className="mb-4">
          {/* Ligne du haut : UserProfile à gauche, FilterButton à droite */}
          <div className="flex items-center justify-between">
            <UserProfile user={user} />
            <FilterButton onClick={() => setShowFilter(true)} />
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

        {/* Zone centrale flexible pour "Mes Cryptos" */}
        <div
          className={`transition-all duration-300 ${
            mesCryptosOpen ? "flex-1 min-h-0" : "flex-none"
          } mb-3`}
        >
          <DropdownSection
            title="Mes Cryptos"
            open={mesCryptosOpen}
            onToggle={handleMesCryptosToggle}
            closeOnOutside={false}
            closeOnEscape={false}
            closeOnSelect={false}
            renderTrigger={(open) => (
              <>
                <div className="w-2 h-6 bg-gradient-to-b from-green-400 to-blue-500 rounded-full"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Mes Cryptos
                </h2>
              </>
            )}
          >
            <div className="mb-3">
              <TabSwitcher
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                investedCount={wallet.swipedCryptos.length}
                favoritesCount={wallet.favoriteCryptos.length}
              />
            </div>

            {/* Scroll uniquement sur la grid */}
            <div className="crypto-grid-scroll h-full max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
              {displayedCryptos.length > 0 ? (
                <>
                  <CryptoGrid cryptos={displayedCryptos} />
                  <div className="h-4"></div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">
                      {activeTab === "invested" ? "💰" : "⭐"}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {activeTab === "invested"
                      ? "Aucun investissement"
                      : "Aucun favori"}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {activeTab === "invested"
                      ? "Commencez à swiper vers la droite pour investir dans vos premières cryptos !"
                      : "Swipez vers le haut pour ajouter des cryptos à vos favoris."}
                  </p>
                </div>
              )}
            </div>
          </DropdownSection>
        </div>

        {/* Leaderboard remonte quand Mes Cryptos se ferme */}
        <div className="shrink-0">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-2"></div>
          <DropdownSection
            title="Leaderboard"
            open={leaderboardOpen}
            onToggle={handleLeaderboardToggle}
            renderTrigger={(open) => (
              <>
                <div className="w-2 h-6 bg-gradient-to-b from-purple-400 to-pink-500 rounded-full"></div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Leaderboard
                </h2>
              </>
            )}
          >
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-5 h-5 text-yellow-400" />
                <h3 className="text-mg font-bold text-white">
                  Top Cryptos likées
                </h3>
              </div>

              <div className="max-h-64 overflow-y-auto">
                {renderLeaderboardContent()}
              </div>
            </div>
          </DropdownSection>
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
      </div>
    </motion.aside>
  );
}
