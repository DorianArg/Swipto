// ==============================================
// Imports
// ==============================================
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/sidebar/Sidebar";

// Ajout de la déclaration pour window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// ==============================================
// Component
// ==============================================
export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  const handleWalletConnect = async () => {
    try {
      // Vérifier si MetaMask est installé
      if (typeof window.ethereum !== "undefined") {
        // Demander la connexion au wallet
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          setIsWalletConnected(true);
          console.log("Wallet connecté:", accounts[0]);
          // Ici tu peux sauvegarder l'adresse du wallet dans Firebase si nécessaire
        }
      } else {
        alert(
          "MetaMask n'est pas installé. Veuillez l'installer pour continuer."
        );
        window.open("https://metamask.io/download/", "_blank");
      }
    } catch (error) {
      console.error("Erreur de connexion au wallet:", error);
      alert("Erreur lors de la connexion au wallet");
    }
  };

  const handleWalletDisconnect = () => {
    setIsWalletConnected(false);
    console.log("Wallet déconnecté");
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex bg-[#1a1b2f] text-white">
      <Sidebar />
      <main className="flex-1 relative bg-[#23243a]">
        {/* Boutons en position absolue pour ne pas affecter le layout */}
        <div className="absolute top-4 right-4 z-50 flex gap-3">
          {/* Bouton Wallet Connect */}
          <button
            onClick={
              isWalletConnected ? handleWalletDisconnect : handleWalletConnect
            }
            className={`py-2 px-4 rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition flex items-center gap-2 ${
              isWalletConnected
                ? "bg-gradient-to-r from-green-500 via-green-400 to-green-300 text-white"
                : "bg-gradient-to-r from-purple-600 via-purple-500 to-purple-400 text-white"
            }`}
          >
            <span className="text-lg">{isWalletConnected ? "🔗" : "👛"}</span>
            {isWalletConnected ? "Wallet Connecté" : "Wallet Connect"}
          </button>

          {/* Bouton déconnexion */}
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#F7A600] via-[#fcd278] to-[#fff2cc] text-[#23243a] font-bold text-sm shadow-md hover:opacity-90 transition flex items-center gap-2"
          >
            <span className="text-lg"></span>
            Se déconnecter
          </button>
        </div>

        {/* Zone principale qui prend toute la hauteur disponible */}
        <div className="w-full h-full flex items-center justify-center">
          {children}
        </div>
      </main>
    </div>
  );
}
