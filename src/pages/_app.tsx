import "../styles/globals.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "@/context/AuthContext";
import { SidebarFiltersProvider } from "@/context/SidebarFiltersContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <SidebarFiltersProvider>
        <Component {...pageProps} />
      </SidebarFiltersProvider>
    </AuthProvider>
  );
}
