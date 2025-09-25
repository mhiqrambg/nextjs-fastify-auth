import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { HeroUIProvider } from "@heroui/react";
import { ReactQueryProvider } from "@/providers/ReactQueryProvider";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ReactQueryProvider>
        <HeroUIProvider>
          <main className={inter.className}>
            <Component {...pageProps} />
          </main>
        </HeroUIProvider>
      </ReactQueryProvider>
    </SessionProvider>
  );
}
