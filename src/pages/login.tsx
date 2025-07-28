// pages/login.tsx

import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { signin, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await signin(email, password);
      router.push("/");
    } catch (err) {
      setError("Échec de la connexion. Vérifiez vos identifiants.");
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (err) {
      setError("Connexion Google échouée.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1b2f] px-4">
      <div className="w-full max-w-sm bg-[#2e3046] rounded-2xl p-8 shadow-xl border border-[#3f415b]">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-[#F7A600] via-[#fcd278] to-[#fff2cc] bg-clip-text text-transparent mb-6">
          Swipto
        </h1>

        <p className="text-center text-[#dcdde9] mb-4">
          Welcome back! Please enter your details.
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
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-sm text-[#c8cadb]">
                Password
              </label>
              <a
                href="#"
                className="text-xs text-[#F7A600] hover:underline transition"
              >
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-4 py-2 bg-[#3a3c5a] border border-[#51536e] rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#F7A600]"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-[#F7A600] text-[#1a1b2f] font-semibold hover:opacity-90 transition-all shadow-md"
          >
            Sign in
          </button>
        </form>

        <div className="my-4 flex items-center justify-center">
          <span className="text-[#b0b2c8] text-sm">ou</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full py-2 rounded-full bg-white text-[#1a1b2f] font-semibold hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
        >
          <img
            src="\logos\Google_Favicon_2025.svg.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <p className="text-center text-sm text-[#b0b2c8] mt-6">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#F7A600] hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
