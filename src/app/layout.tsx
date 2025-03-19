import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryProvider } from "../components/ReactQueryProvider";
import { WalletProvider } from "../components/WalletProvider";
import { Toaster } from "../components/ui/toaster";
import { WrongNetworkAlert } from "../components/WrongNetworkAlert";
import { Gabarito } from "next/font/google";

const gabarito = Gabarito({ subsets: ["latin"], weight: ["400", "500", "800"] });

export const metadata: Metadata = {
  applicationName: "Aptos Boilerplate Template",
  title: "NextJS Boilerplate Template",
  description: "Aptos Boilerplate Template",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={gabarito.className}>
      <body className="bg-fir select-none">
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                if (e.message.includes('ChunkLoadError') || e.error && e.error.message && e.error.message.includes('ChunkLoadError')) {
                  console.log('Chunk load error detected, refreshing page...');
                  window.location.reload();
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
