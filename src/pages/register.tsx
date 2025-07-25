import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      await signup(email, password);
      router.push("/login");
    } catch (err) {
      setError("Échec de l'inscription. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1b2f] px-4">
      <div className="w-full max-w-sm bg-[#2e3046] rounded-2xl p-8 shadow-xl border border-[#3f415b]">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#F7A600] via-[#fcd278] to-[#fff2cc] bg-clip-text text-transparent mb-6">
          Swipto
        </h1>

        <p className="text-center text-[#dcdde9] mb-4">
          Créez votre compte pour commencer à swiper vos cryptos !
        </p>

        {error && (
          <p className="text-red-400 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-sm text-[#c8cadb]">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-[#3a3c5a] border border-[#51536e] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F7A600]"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-[#c8cadb]">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-[#3a3c5a] border border-[#51536e] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F7A600]"
              placeholder="Mot de passe"
              required
            />
          </div>

          <div>
            <label htmlFor="confirm" className="text-sm text-[#c8cadb]">
              Confirmer le mot de passe
            </label>
            <input
              type="password"
              id="confirm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-[#3a3c5a] border border-[#51536e] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F7A600]"
              placeholder="Confirmer"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#F7A600] text-[#1a1b2f] font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Créer un compte
          </button>
        </form>

        <p className="text-center text-sm text-[#b0b2c8] mt-6">
          Vous avez déjà un compte ?{" "}
          <a href="/login" className="text-[#F7A600] hover:underline">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
}
