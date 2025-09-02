export default function TabSwitcher({
  activeTab,
  setActiveTab,
  investedCount,
  favoritesCount,
}: any) {
  return (
    <div className="flex mb-6 space-x-8 text-lg font-semibold">
      <button
        className={`pb-1 transition ${
          activeTab === "invested"
            ? "text-[#F7A600] border-b-2 border-[#F7A600]"
            : "text-[#b0b2c8]"
        }`}
        onClick={() => setActiveTab("invested")}
      >
        Investis ({investedCount})
      </button>
      <button
        className={`pb-1 transition ${
          activeTab === "favorites"
            ? "text-[#F7A600] border-b-2 border-[#F7A600]"
            : "text-[#b0b2c8]"
        }`}
        onClick={() => setActiveTab("favorites")}
      >
        Favoris ({favoritesCount})
      </button>
      {/* Nouvel onglet Leaderboard */}
      <button
        className={`pb-1 transition ${
          activeTab === "leaderboard"
            ? "text-[#F7A600] border-b-2 border-[#F7A600]"
            : "text-[#b0b2c8]"
        }`}
        onClick={() => setActiveTab("leaderboard")}
      >
        Leaderboard
      </button>
    </div>
  );
}
