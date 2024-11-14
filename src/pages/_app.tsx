import Header from "@/components/Header";
import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Footer from "@/components/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </SessionProvider>
  );
}
