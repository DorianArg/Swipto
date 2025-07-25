// components/CardStack.tsx
import { useState } from "react";
import TinderCard from "react-tinder-card";
import Image from "next/image";
import { motion } from "framer-motion";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Interface pour le type de crypto
interface Crypto {
  id: string;
  name: string;
  symbol: string;
  image: string;
  price: number;
  trend: string;
  description: string;
}

const CardStack = () => {
  const { user } = useAuth();
  const defaultInvestAmount = 100; // Montant d'investissement par défaut en dollars
  const [cryptos, setCryptos] = useState<Crypto[]>([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      image: "/logos/bitcoin.png",
      price: 60000,
      trend: "⬆️ +5.2%",
      description:
        "La première et plus grande cryptomonnaie par capitalisation.",
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      image: "/logos/ethereum.png",
      price: 2000,
      trend: "⬆️ +5.2%",
      description:
        "TEST Ethereum est une plateforme décentralisée qui permet de créer des contrats intelligents.",
    },
    // Ajoutez d'autres cryptos...
  ]);

  const onSwipe = async (direction: string, crypto: Crypto) => {
    if (direction === "right") {
      try {
        const userRef = doc(db, "users", user.uid);

        // Ajout de la crypto dans le wallet avec timestamp
        await updateDoc(userRef, {
          totalInvested: increment(defaultInvestAmount),
          swipedCryptos: arrayUnion({
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            image: crypto.image,
            current_price: crypto.price,
            invested_amount: defaultInvestAmount,
            timestamp: Date.now(),
            trend: crypto.trend,
          }),
        });

        console.log("Crypto ajoutée au wallet !");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la crypto:", error);
      }
    }
  };

  return (
    <div className="w-[370px] max-w-full flex flex-col items-center justify-center">
      <div className="relative w-full h-[480px]">
        <div className="stack w-full h-full">
          {cryptos.map((crypto) => (
            <TinderCard
              key={crypto.id}
              onSwipe={(dir) => onSwipe(dir, crypto)}
              preventSwipe={["up", "down"]}
              className="swipe absolute"
            >
              <motion.div
                className="card w-full h-full"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="card-content">
                  <div className="flex flex-col items-center">
                    <Image
                      src={crypto.image}
                      alt={crypto.name}
                      width={80}
                      height={80}
                      className="mb-4"
                    />
                    <h2 className="text-2xl font-bold mb-2">{crypto.name}</h2>
                    <p className="text-pink-500 font-semibold">
                      {crypto.symbol}
                    </p>
                    <div className="mt-4 text-center">
                      <p className="text-3xl font-bold mb-2">${crypto.price}</p>
                      <p className="text-green-400">{crypto.trend}</p>
                    </div>
                  </div>

                  <p className="text-gray-400 text-center mt-6">
                    {crypto.description}
                  </p>

                  <div className="mt-8 text-center text-sm text-gray-400">
                    ← Swipe gauche pour passer | Swipe droite pour investir $
                    {defaultInvestAmount} →
                  </div>
                </div>
              </motion.div>
            </TinderCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CardStack;
