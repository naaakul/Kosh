import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { ReactQueryProvider } from "../components/ReactQueryProvider";
import { WalletProvider } from "../components/WalletProvider";
import { Toaster } from "../components/ui/toaster";
import { WrongNetworkAlert } from "../components/WrongNetworkAlert";


export const metadata: Metadata = {
  applicationName: "Aptos Boilerplate Template",
  title: "NextJS Boilerplate Template",
  description: "Aptos Boilerplate Template",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-fir select-none">
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root">{children}</div>
            <WrongNetworkAlert />
            <Toaster />
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
