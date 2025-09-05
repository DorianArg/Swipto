// ==============================================
// Imports
// ==============================================
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

// ==============================================
// Props
// ==============================================
interface LikeExplosionProps {
  isVisible: boolean;
  onComplete: () => void;
  amount: number;
  cryptoName: string;
}

// ==============================================
// Component
// ==============================================
export default function LikeExplosion({
  isVisible,
  onComplete,
  amount,
  cryptoName,
}: LikeExplosionProps) {
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; emoji: string }>
  >([]);

  useEffect(() => {
    if (isVisible) {
      // Créer des particules aléatoires
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        emoji: ["💚", "💎", "🚀", "⭐", "✨", "💫", "🔥", "💰"][
          Math.floor(Math.random() * 8)
        ],
      }));
      setParticles(newParticles);

      // Auto-cleanup après animation - RÉDUIT de 3000ms à 2200ms
      setTimeout(onComplete, 2200);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* Onde de choc principale - RÉDUIT de 1.5s à 1.2s */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1.5, 3], opacity: [1, 0.6, 0] }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute w-32 h-32 border-4 border-green-400 rounded-full"
      />

      {/* Deuxième onde - RÉDUIT de 1.2s à 1s, délai de 0.2s à 0.15s */}
      <motion.div
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: [0, 1, 2], opacity: [1, 0.4, 0] }}
        transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
        className="absolute w-24 h-24 border-2 border-blue-400 rounded-full"
      />

      {/* Particules explosives - RÉDUIT de 2s à 1.5s, délai max de 0.3s à 0.2s */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1, rotate: 0 }}
          animate={{
            x: particle.x * 2,
            y: particle.y * 2,
            scale: [0, 1.5, 0.8, 0],
            opacity: [1, 1, 0.8, 0],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 1.5,
            delay: Math.random() * 0.2,
            ease: "easeOut",
          }}
          className="absolute text-2xl"
        >
          {particle.emoji}
        </motion.div>
      ))}

      {/* Texte principal avec effet dramatique - RÉDUIT de 0.8s à 0.6s */}
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 50 }}
        animate={{
          scale: [0, 1.3, 1.1, 1],
          opacity: [0, 1, 1, 1],
          y: [50, 0, -10, 0],
        }}
        transition={{
          duration: 0.6,
          times: [0, 0.4, 0.7, 1],
          ease: "easeOut",
        }}
        className="relative z-10 text-center"
      >
        {/* Arrière-plan lumineux - RÉDUIT de 2s à 1.5s */}
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(34, 197, 94, 0.5)",
              "0 0 40px rgba(34, 197, 94, 0.8)",
              "0 0 60px rgba(34, 197, 94, 0.6)",
              "0 0 20px rgba(34, 197, 94, 0.3)",
            ],
          }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 bg-green-500 rounded-2xl blur-sm"
        />

        <div className="relative bg-gradient-to-r from-green-400 via-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl border-2 border-green-300 shadow-2xl">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-3xl font-black mb-2"
          >
            💚 LIKED! 💚
          </motion.div>

          {/* Montant - RÉDUIT délai de 0.3s à 0.2s, durée de 0.5s à 0.4s */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xl font-bold mb-1"
          >
            +${amount}
          </motion.div>

          {/* Nom crypto - RÉDUIT délai de 0.5s à 0.35s, durée de 0.5s à 0.4s */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-sm font-medium opacity-90"
          >
            Investissement dans {cryptoName}!
          </motion.div>
        </div>
      </motion.div>

      {/* Confettis flottants - RÉDUIT de 2.5s à 1.8s, délai de 0.1s à 0.08s */}
      {Array.from({ length: 8 }, (_, i) => (
        <motion.div
          key={`confetti-${i}`}
          initial={{
            x: 0,
            y: 0,
            scale: 0,
            opacity: 1,
            rotate: 0,
          }}
          animate={{
            x: (Math.random() - 0.5) * 400,
            y: (Math.random() - 0.5) * 400,
            scale: [0, 1, 0.5, 0],
            opacity: [1, 1, 0.5, 0],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
          }}
          transition={{
            duration: 1.8,
            delay: i * 0.08,
            ease: "easeOut",
          }}
          className="absolute w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
        />
      ))}

      {/* Rayons de lumière - RÉDUIT de 1.5s à 1.2s, délai de 0.2s à 0.15s */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={`ray-${i}`}
          initial={{ scale: 0, opacity: 0, rotate: i * 60 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0],
            rotate: i * 60,
          }}
          transition={{
            duration: 1.2,
            delay: 0.15,
            ease: "easeOut",
          }}
          className="absolute w-1 h-32 bg-gradient-to-t from-transparent via-yellow-300 to-transparent"
          style={{ transformOrigin: "center bottom" }}
        />
      ))}
    </div>
  );
}
