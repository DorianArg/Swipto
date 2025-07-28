// components/MainLayout.tsx
import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar/Sidebar";

export default function MainLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex bg-[#1a1b2f] text-white">
      <Sidebar />
      <main className="flex-1 relative bg-[#23243a]">
        {/* Bouton déconnexion en position absolue pour ne pas affecter le layout */}
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={handleLogout}
            className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#F7A600] via-[#fcd278] to-[#fff2cc] text-[#23243a] font-bold text-sm shadow-md hover:opacity-90 transition"
          >
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
