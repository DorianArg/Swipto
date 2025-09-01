import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarFilters } from "@/context/SidebarFiltersContext";
import { useFilteredCryptos } from "@/hooks/useFilteredCryptos";
import { useAuth } from "@/context/AuthContext";
import {
  saveCryptoSwipe,
  getUserData,
  updateSwipeAmount,
} from "@/lib/firebase";
import SwipeCard from "./SwipeCard";
import ChatBubble from "./ChatBubble";
import LikeExplosion from "./LikeExplosion"; // AJOUT DU COMPOSANT

const NB_CRYPTOS_PER_BATCH = 1;

/**
 * Fonction pour obtenir un lot aléatoire de cryptos en excluant celles déjà swipées
 * @param all - Toutes les cryptos disponibles
 * @param count - Nombre de cryptos à retourner
 * @param excludedIds - IDs des cryptos à exclure (déjà likées/en favoris)
 * @returns Array de cryptos filtrées et mélangées
 */
function getRandomBatch(all: any[], count: number, excludedIds: string[] = []) {
  // Filtrer les cryptos pour exclure celles déjà swipées
  const availableCryptos = all.filter(
    (crypto) => !excludedIds.includes(crypto.id)
  );

  // Mélanger les cryptos disponibles de façon aléatoire
  const shuffled = availableCryptos.slice().sort(() => 0.5 - Math.random());

  // Retourner le nombre demandé de cryptos
  return shuffled.slice(0, count);
}

export default function CardStack() {
  const { filters } = useSidebarFilters();
  const { cryptos, loading, error } = useFilteredCryptos(filters);
  const { user } = useAuth();

  // États pour gérer les cartes et animations
  const [currentBatch, setCurrentBatch] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<string | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [excludedCryptoIds, setExcludedCryptoIds] = useState<string[]>([]);

  // États pour l'effet de montant et la configuration
  const [swipeAmount, setSwipeAmount] = useState(100);
  const [showAmountEffect, setShowAmountEffect] = useState(false);
  const [effectPosition, setEffectPosition] = useState({ x: 0, y: 0 });
  const [showAmountConfig, setShowAmountConfig] = useState(false);
  const [tempAmount, setTempAmount] = useState(100);

  // États pour l'animation LikeExplosion - AJOUT
  const [showLikeExplosion, setShowLikeExplosion] = useState(false);
  const [likedCrypto, setLikedCrypto] = useState<any>(null);

  /**
   * Effet pour charger les données utilisateur incluant le montant de swipe
   */
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;

      try {
        const userData = await getUserData(user.uid);

        if (userData) {
          // Mettre à jour le montant de swipe depuis les données utilisateur
          setSwipeAmount(userData.swipeAmount || 100);
          setTempAmount(userData.swipeAmount || 100);

          // Extraire les IDs des cryptos déjà swipées
          const swipedIds = (userData.swipedCryptos || []).map(
            (crypto: any) => crypto.id
          );
          const favoriteIds = (userData.favoriteCryptos || []).map(
            (crypto: any) => crypto.id
          );
          const allExcludedIds = [...swipedIds, ...favoriteIds];

          setExcludedCryptoIds(allExcludedIds);
          console.log(
            `${allExcludedIds.length} cryptos exclues des suggestions`
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors du chargement des données utilisateur:",
          error
        );
      }
    };

    loadUserData();
  }, [user]);

  /**
   * Effet pour générer un nouveau lot de cryptos quand les données changent
   * Se déclenche seulement quand les cryptos de l'API changent, pas les exclusions
   */
  useEffect(() => {
    if (cryptos.length > 0 && currentBatch.length === 0) {
      // Générer un nouveau lot seulement si le lot actuel est vide
      const newBatch = getRandomBatch(
        cryptos,
        NB_CRYPTOS_PER_BATCH,
        excludedCryptoIds
      );
      setCurrentBatch(newBatch);

      console.log(`Nouveau lot initial de ${newBatch.length} cryptos généré`);
    }
  }, [cryptos]); // Retirer excludedCryptoIds des dépendances

  /**
   * Effet séparé pour le chargement initial quand les exclusions sont chargées
   */
  useEffect(() => {
    if (
      excludedCryptoIds.length > 0 &&
      currentBatch.length === 0 &&
      cryptos.length > 0
    ) {
      const newBatch = getRandomBatch(
        cryptos,
        NB_CRYPTOS_PER_BATCH,
        excludedCryptoIds
      );
      setCurrentBatch(newBatch);

      console.log(
        `Lot initial avec exclusions: ${newBatch.length} cryptos générées`
      );
    }
  }, [excludedCryptoIds]); // Se déclenche seulement au chargement initial des exclusions

  /**
   * Fonction pour sauvegarder le nouveau montant de swipe
   */
  const handleSaveSwipeAmount = async () => {
    if (!user) return;

    try {
      await updateSwipeAmount(user.uid, tempAmount);
      setSwipeAmount(tempAmount);
      setShowAmountConfig(false);
      console.log(`Montant de swipe mis à jour: $${tempAmount}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du montant:", error);
    }
  };

  /**
   * Fonction pour déclencher l'effet visuel du montant
   */
  // const triggerAmountEffect = () => {
  //   // Position au centre de la zone des cartes
  //   setEffectPosition({ x: 190, y: 240 }); // Centre de la zone 380x480
  //   setShowAmountEffect(true);

  //   // Faire disparaître l'effet après 2 secondes
  //   setTimeout(() => {
  //     setShowAmountEffect(false);
  //   }, 2000);
  // };

  /**
   * Fonction pour rafraîchir le lot de cryptos avec de nouvelles suggestions
   */
  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      // Générer un nouveau lot en excluant toujours les cryptos déjà swipées
      const newBatch = getRandomBatch(
        cryptos,
        NB_CRYPTOS_PER_BATCH,
        excludedCryptoIds
      );
      setCurrentBatch(newBatch);
      setIsRefreshing(false);

      console.log("Lot rafraîchi avec de nouvelles cryptos");
    }, 300);
  };

  /**
   * Fonction principale pour gérer les swipes sur les cryptos
   * @param direction - Direction du swipe (left, right, up, down)
   * @param cryptoId - ID de la crypto swipée
   */
  const handleSwipe = async (direction: string, cryptoId: string) => {
    console.log(`Swiped ${direction} on crypto ${cryptoId}`);

    // Déclencher l'animation visuelle correspondant à la direction
    setAnimationDirection(direction);

    // Trouver l'objet crypto complet dans le lot actuel
    const crypto = currentBatch.find((c) => c.id === cryptoId);

    // Vérifier que l'utilisateur est connecté et qu'une sauvegarde n'est pas en cours
    if (crypto && user && !isSaving) {
      setIsSaving(true);

      try {
        // Sauvegarder selon le type de swipe
        if (direction === "right") {
          // Like = Ajout aux investissements avec le montant de swipe de l'utilisateur
          await saveCryptoSwipe(user.uid, crypto, "like", swipeAmount);
          console.log("Crypto likée et sauvegardée dans les investissements !");

          // DÉCLENCHER L'ANIMATION LIKEEXPLOSION - AJOUT
          setLikedCrypto(crypto);
          setShowLikeExplosion(true);

          // Déclencher l'effet visuel du montant (optionnel, peut être supprimé si LikeExplosion le remplace)
          // triggerAmountEffect();
        } else if (direction === "up") {
          // Favoris = Ajout aux favoris
          await saveCryptoSwipe(user.uid, crypto, "superlike");
          console.log("Crypto ajoutée aux favoris !");
        }

        // Ajouter à la liste d'exclusion APRÈS la sauvegarde réussie
        setExcludedCryptoIds((prev) => [...prev, cryptoId]);
      } catch (error) {
        console.error("Erreur lors de la sauvegarde :", error);
      } finally {
        setIsSaving(false);
      }
    }

    // Supprimer la crypto du lot actuel après l'animation
    setTimeout(() => {
      setCurrentBatch((prev) => {
        const newBatch = prev.filter((c) => c.id !== cryptoId);

        // Si il reste moins de 2 cartes, ajouter de nouvelles cryptos au lot existant
        if (newBatch.length <= 1 && cryptos.length > 0) {
          const availableCryptos = cryptos.filter(
            (crypto) =>
              !excludedCryptoIds.includes(crypto.id) &&
              !newBatch.some((existing) => existing.id === crypto.id)
          );

          const additionalCryptos = getRandomBatch(
            availableCryptos,
            NB_CRYPTOS_PER_BATCH - newBatch.length,
            []
          );

          console.log(
            `Ajout de ${additionalCryptos.length} nouvelles cryptos au lot`
          );
          return [...newBatch, ...additionalCryptos];
        }

        return newBatch;
      });
      setAnimationDirection(null);
    }, 300);
  };

  /**
   * Gestionnaire pour rejeter la crypto du dessus (swipe left simulé)
   */
  const handleReject = () => {
    if (currentBatch.length > 0 && !isSaving) {
      handleSwipe("left", currentBatch[0].id);
    }
  };

  /**
   * Gestionnaire pour liker la crypto du dessus (swipe right simulé)
   */
  const handleLike = () => {
    if (currentBatch.length > 0 && !isSaving) {
      handleSwipe("right", currentBatch[0].id);
    }
  };

  /**
   * Gestionnaire pour ajouter aux favoris la crypto du dessus (swipe up simulé)
   */
  const handleSuperLike = () => {
    if (currentBatch.length > 0 && !isSaving) {
      console.log("Ajout aux favoris !");
      handleSwipe("up", currentBatch[0].id);
    }
  };

  // États de chargement et d'erreur
  if (loading) return <div className="card">Chargement...</div>;
  if (error) return <div className="text-red-500">Erreur : {error}</div>;

  // Vérifier s'il reste des cryptos à proposer
  if (currentBatch.length === 0) {
    const availableCryptosCount = cryptos.filter(
      (crypto) => !excludedCryptoIds.includes(crypto.id)
    ).length;

    return (
      <div className="text-center text-gray-400">
        {availableCryptosCount === 0 ? (
          <div>
            <h3 className="text-xl mb-2">🎉 Toutes les cryptos explorées !</h3>
            <p>Tu as déjà swipé toutes les cryptos disponibles.</p>
            <p className="text-sm mt-2">
              Reviens plus tard pour de nouvelles cryptos !
            </p>
          </div>
        ) : (
          <div>
            <p>Aucune crypto trouvée avec les filtres actuels.</p>
            <button
              onClick={handleRefresh}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center relative">
      <div className="flex flex-col items-center gap-3">
        {/* Configuration du montant de swipe */}
        <AnimatePresence>
          {showAmountConfig && (
            <motion.div
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-[#18192B] border border-[#23243a] rounded-lg p-4 shadow-xl"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
            >
              <div className="text-white text-center mb-3">
                <h3 className="font-bold text-lg">Montant par swipe</h3>
                <p className="text-sm text-gray-400">
                  Choisissez le montant à investir par like
                </p>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <span className="text-white">$</span>
                <input
                  type="number"
                  value={tempAmount}
                  onChange={(e) => setTempAmount(Number(e.target.value))}
                  className="bg-[#23243a] text-white px-3 py-2 rounded border border-gray-600 focus:border-blue-500 w-20 text-center"
                  min="1"
                  max="10000"
                />
              </div>

              {/* Boutons prédéfinis */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {[50, 100, 250, 500].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTempAmount(amount)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      tempAmount === amount
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowAmountConfig(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSaveSwipeAmount}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicateur du montant actuel */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400 text-sm">Par swipe:</span>
          <button
            onClick={() => setShowAmountConfig(true)}
            className="bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-800/30 transition-colors cursor-pointer"
          >
            ${swipeAmount}
          </button>
        </div>

        {/* Zone des cartes avec animation liée aux boutons */}
        <motion.div
          className="relative w-[380px] h-[480px]"
          animate={
            isRefreshing
              ? { scale: 0.95, opacity: 0.7, rotate: 5 }
              : { scale: 1, opacity: 1, rotate: 0 }
          }
          transition={{ duration: 0.3 }}
        >
          {/* ANIMATION LIKEEXPLOSION - AJOUT */}
          <LikeExplosion
            isVisible={showLikeExplosion}
            onComplete={() => {
              setShowLikeExplosion(false);
              setLikedCrypto(null);
            }}
            amount={swipeAmount}
            cryptoName={likedCrypto?.name || ""}
          />

          {/* Effet visuel du montant de swipe (optionnel si LikeExplosion le remplace) */}
          <AnimatePresence>
            {showAmountEffect && (
              <motion.div
                className="absolute pointer-events-none z-50"
                style={{
                  left: effectPosition.x,
                  top: effectPosition.y,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{
                  scale: 0.5,
                  opacity: 0,
                  y: 0,
                  rotate: -10,
                }}
                animate={{
                  scale: [0.5, 1.2, 1],
                  opacity: [0, 1, 1, 0],
                  y: [-20, -40, -60],
                  rotate: [10, 0, -5],
                }}
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  y: -80,
                }}
                transition={{
                  duration: 2,
                  times: [0, 0.2, 0.8, 1],
                  ease: "easeOut",
                }}
              >
                <div className="bg-green-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg border-2 border-green-300">
                  +${swipeAmount}
                </div>
                {/* Particules d'effet */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.5, 0] }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <div className="w-full h-full bg-green-400 rounded-full opacity-30"></div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="sync">
            {currentBatch.map((crypto, idx) => (
              <motion.div
                key={crypto.id}
                className="absolute w-full h-full"
                style={{
                  zIndex: currentBatch.length - idx,
                }}
                initial={{ scale: 1, x: 0, y: 0, rotate: 0 }}
                animate={
                  idx === 0 && animationDirection
                    ? {
                        x:
                          animationDirection === "left"
                            ? -400
                            : animationDirection === "right"
                            ? 400
                            : 0,
                        y:
                          animationDirection === "up"
                            ? -400
                            : animationDirection === "down"
                            ? 400
                            : 0,
                        rotate:
                          animationDirection === "left"
                            ? -30
                            : animationDirection === "right"
                            ? 30
                            : 0,
                        scale: animationDirection === "up" ? 1.1 : 0.8,
                        opacity: 0,
                      }
                    : { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }
                }
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  duration: 0.3,
                }}
              >
                <SwipeCard
                  data={crypto}
                  onSwipe={(dir) => handleSwipe(dir, crypto.id)}
                  isTop={idx === 0}
                  index={idx}
                  total={currentBatch.length}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Actions avec animations au clic */}
        <div className="flex items-center justify-center gap-6">
          {/* Reset/Refresh - Recharger de nouvelles cryptos */}
          <motion.button
            onClick={handleRefresh}
            disabled={isSaving}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 0.5, repeat: isRefreshing ? Infinity : 0 }}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-800/30 hover:bg-gray-600/40 border border-gray-600/20 hover:border-gray-400/40 transition-all duration-200 disabled:opacity-50"
          >
            <span className="text-lg text-gray-300 hover:text-gray-100 transition-colors">
              ↺
            </span>
          </motion.button>

          {/* Reject - Rejeter la crypto sans la sauvegarder */}
          <motion.button
            onClick={handleReject}
            disabled={isSaving}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={animationDirection === "left" ? { x: [-5, 5, -5, 0] } : {}}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-red-900/20 hover:bg-red-600/30 border border-red-800/30 hover:border-red-500/50 transition-all duration-200 disabled:opacity-50"
          >
            <span className="text-lg text-red-400 hover:text-red-300 transition-colors">
              ×
            </span>
          </motion.button>

          {/* Like - SANS BADGE */}
          <motion.button
            onClick={handleLike}
            disabled={isSaving}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            animate={
              animationDirection === "right"
                ? {
                    scale: [1, 1.3, 1],
                    boxShadow: [
                      "0 0 0 0px rgba(34, 197, 94, 0.3)",
                      "0 0 0 20px rgba(34, 197, 94, 0)",
                    ],
                  }
                : {}
            }
            transition={{ duration: 0.3 }}
            className="w-14 h-14 flex items-center justify-center rounded-full bg-green-900/20 hover:bg-green-600/30 border border-green-800/30 hover:border-green-500/50 transition-all duration-200 disabled:opacity-50"
          >
            <motion.span
              className="text-2xl text-green-400 hover:text-green-300 transition-colors"
              animate={
                animationDirection === "right" ? { scale: [1, 1.5, 1] } : {}
              }
            >
              ♥
            </motion.span>
          </motion.button>

          {/* Favoris */}
          <motion.button
            onClick={handleSuperLike}
            disabled={isSaving}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95, y: 0 }}
            animate={
              animationDirection === "up"
                ? {
                    y: [-10, 0],
                    boxShadow: [
                      "0 0 0 0px rgba(59, 130, 246, 0.3)",
                      "0 0 0 15px rgba(59, 130, 246, 0)",
                    ],
                  }
                : {}
            }
            className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-900/20 hover:bg-blue-600/30 border border-blue-800/30 hover:border-blue-500/50 transition-all duration-200 disabled:opacity-50"
          >
            <motion.span
              className="text-lg text-blue-400 hover:text-blue-300 transition-colors"
              animate={
                animationDirection === "up"
                  ? {
                      rotate: [0, 360],
                      scale: [1, 1.3, 1],
                    }
                  : {}
              }
            >
              ★
            </motion.span>
          </motion.button>

          {/* Next/Skip - Passer à la crypto suivante sans action */}
          <motion.button
            onClick={() => handleSwipe("down", currentBatch[0]?.id)}
            disabled={isSaving}
            whileHover={{ scale: 1.1, x: 2 }}
            whileTap={{ scale: 0.95, x: 5 }}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-900/20 hover:bg-orange-600/30 border border-orange-800/30 hover:border-orange-500/50 transition-all duration-200 disabled:opacity-50"
          >
            <span className="text-lg text-orange-400 hover:text-orange-300 transition-colors">
              →
            </span>
          </motion.button>
        </div>
      </div>

      {/* Bulle de chat flottante */}
      {currentBatch.length > 0 && <ChatBubble cryptoData={currentBatch[0]} />}
    </div>
  );
}
