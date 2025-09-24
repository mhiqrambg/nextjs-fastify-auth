import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/react";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ReactQueryProvider>
      <HeroUIProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </HeroUIProvider>
    </ReactQueryProvider>
  );
}
