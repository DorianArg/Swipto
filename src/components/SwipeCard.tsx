// components/SwipeCard.tsx
import {
  motion,
  useMotionValue,
  useTransform,
  PanInfo,
  useAnimation,
} from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface SwipeCardProps {
  data: any;
  onSwipe: (direction: string) => void;
  isTop: boolean;
  index: number;
  total: number;
}

export default function SwipeCard({
  data,
  onSwipe,
  isTop,
  index,
  total,
}: SwipeCardProps) {
  // États pour gérer le drag et les animations
  const [isDragging, setIsDragging] = useState(false);

  // Motion values pour suivre la position de la carte
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Controls pour les animations programmatiques
  const controls = useAnimation();

  // Transformations plus douces basées sur la position X pour la rotation et l'opacité
  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const opacity = useTransform(
    x,
    [-300, -200, 0, 200, 300],
    [0.5, 1, 1, 1, 0.5]
  );

  // Couleurs d'overlay avec seuils plus bas pour plus de réactivité
  const likeOpacity = useTransform(x, [0, 100], [0, 0.7]);
  const rejectOpacity = useTransform(x, [-100, 0], [0.7, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [0.7, 0]);

  /**
   * Gestionnaire pour le début du drag
   */
  const handleDragStart = () => {
    setIsDragging(true);
  };

  /**
   * Gestionnaire pour la fin du drag avec seuils plus bas
   * @param event - Événement de pointeur
   * @param info - Informations sur le mouvement (vélocité, offset)
   */
  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    // Seuils réduits pour un swipe plus facile
    const threshold = 80; // Réduit de 100 à 80
    const velocityThreshold = 300; // Réduit de 500 à 300

    const { offset, velocity } = info;

    // Déterminer la direction du swipe avec des seuils plus permissifs
    if (
      Math.abs(offset.x) > threshold ||
      Math.abs(velocity.x) > velocityThreshold
    ) {
      // Swipe horizontal (like/reject)
      if (offset.x > 0 || velocity.x > velocityThreshold) {
        onSwipe("right"); // Like
      } else {
        onSwipe("left"); // Reject
      }
    } else if (
      Math.abs(offset.y) > threshold ||
      Math.abs(velocity.y) > velocityThreshold
    ) {
      // Swipe vertical
      if (offset.y < 0 || velocity.y < -velocityThreshold) {
        onSwipe("up"); // Favoris
      } else {
        onSwipe("down"); // Skip
      }
    } else {
      // Pas assez de mouvement, remettre la carte en place
      controls.start({
        x: 0,
        y: 0,
        rotate: 0,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 30,
        },
      });

      // Remettre les motion values à zéro
      x.set(0);
      y.set(0);
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full"
      style={{
        x,
        y,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 9 - index, // Z-index plus clair pour éviter les conflits
      }}
      animate={controls}
      // Configuration du drag avec plus de souplesse
      drag={isTop ? true : false} // Drag seulement pour la carte du dessus
      dragConstraints={{ left: -400, right: 400, top: -400, bottom: 400 }} // Contraintes élargies
      dragElastic={0.8} // Plus élastique pour un mouvement plus doux
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // Transition plus douce
      transition={{
        type: "spring",
        stiffness: 200, // Réduit pour plus de fluidité
        damping: 20, // Réduit pour moins de résistance
      }}
      whileHover={isTop ? { scale: 1.01 } : {}} // Scale réduit
      // Désactiver les interactions pour les cartes non-top
      style={{
        ...(!isTop && { pointerEvents: "none" }),
        x,
        y,
        rotate,
        opacity,
        zIndex: isTop ? 10 : 9 - index,
      }}
    >
      <div
        className={`w-full h-full rounded-2xl shadow-xl bg-[#18192B] overflow-hidden border border-[#23243a] relative ${
          isTop ? "cursor-grab active:cursor-grabbing" : "cursor-default"
        }`}
      >
        {/* Overlays de feedback visuel pendant le drag - seulement pour la carte du dessus */}
        {isTop && isDragging && (
          <>
            {/* Overlay LIKE (vert à droite) */}
            <motion.div
              className="absolute inset-0 bg-green-500/20 rounded-2xl flex items-center justify-center pointer-events-none z-20"
              style={{ opacity: likeOpacity }}
            >
              <div className="text-3xl font-bold text-white border-3 border-white px-3 py-2 rounded-lg rotate-12 bg-green-500/50">
                LIKE
              </div>
            </motion.div>

            {/* Overlay REJECT (rouge à gauche) */}
            <motion.div
              className="absolute inset-0 bg-red-500/20 rounded-2xl flex items-center justify-center pointer-events-none z-20"
              style={{ opacity: rejectOpacity }}
            >
              <div className="text-3xl font-bold text-white border-3 border-white px-3 py-2 rounded-lg -rotate-12 bg-red-500/50">
                NOPE
              </div>
            </motion.div>

            {/* Overlay FAVORIS (bleu en haut) */}
            <motion.div
              className="absolute inset-0 bg-blue-500/20 rounded-2xl flex items-center justify-center pointer-events-none z-20"
              style={{ opacity: superLikeOpacity }}
            >
              <div className="text-2xl font-bold text-white border-3 border-white px-3 py-2 rounded-lg bg-blue-500/50">
                FAVORIS
              </div>
            </motion.div>
          </>
        )}

        {/* Image principale */}
        <div className="relative w-full h-[55%]">
          <Image
            src={data.image}
            alt={data.name}
            fill
            className="object-cover object-center rounded-t-2xl"
            sizes="380px"
            priority={isTop}
            // Désactiver le drag sur l'image pour éviter les conflits
            draggable={false}
          />

          {/* Barre de progression */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
            {[...Array(total)].map((_, i) => (
              <div
                key={i}
                className={`h-1 w-10 rounded-full transition-colors duration-300 ${
                  i <= index ? "bg-white" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Zone d'informations */}
        <div className="relative h-[45%] bg-gradient-to-t from-[#18192B] via-[#18192B] to-transparent px-5 py-4 pointer-events-none">
          {/* En-tête avec nom et prix */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{data.name}</h2>
              <span className="text-base text-[#b0b2c8]">
                {data.symbol?.toUpperCase()}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  data.price_change_percentage_24h > 0
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}
              >
                {data.price_change_percentage_24h > 0 ? "+" : ""}
                {data.price_change_percentage_24h?.toFixed(2)}%
              </span>
            </div>
            <span className="text-lg font-bold text-white">
              ${data.current_price?.toLocaleString()}
            </span>
          </div>

          {/* Informations supplémentaires */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            <span className="px-2.5 py-0.5 text-xs bg-white/10 text-white/70 rounded-full">
              Rank #{data.market_cap_rank}
            </span>
            <span className="px-2.5 py-0.5 text-xs bg-white/10 text-white/70 rounded-full">
              Cap: ${(data.market_cap / 1e9).toFixed(1)}B
            </span>
          </div>

          {/* Indicateur de drag pour la carte du dessus */}
          {isTop && !isDragging && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
              <div className="text-white/40 text-xs animate-pulse">
                Glissez pour swiper
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
