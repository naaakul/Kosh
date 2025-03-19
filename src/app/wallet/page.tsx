"use client";

import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import dynamic from "next/dynamic";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import ChunkErrorHandler from "../../components/ChunkErrorHandler";

// const AccountInfo = dynamic(() => import("../../components/AccountInfo").then((mod) => mod), { ssr: false });
// const NetworkInfo = dynamic(() => import("../../components/NetworkInfo").then((mod) => mod), { ssr: false });
// const TransferAPT = dynamic(() => import("../../components/TransferAPT").then((mod) => mod), { ssr: false });
// const WalletDetails = dynamic(() => import("../../components/WalletDetails").then((mod) => mod), { ssr: false });
// const MessageBoard = dynamic(() => import("../../components/MessageBoard").then((mod) => mod), { ssr: false });

function Page() {
  const { connected } = useWallet();
  const router = useRouter();

  const [components, setComponents] = useState<{
    AccountInfo: (() => JSX.Element) | null;
    NetworkInfo: (() => JSX.Element) | null;
    TransferAPT: (() => JSX.Element) | null;
    WalletDetails: (() => JSX.Element) | null;
    MessageBoard: (() => JSX.Element) | null;
  }>({
    AccountInfo: null,
    NetworkInfo: null,
    TransferAPT: null,
    WalletDetails: null,
    MessageBoard: null,
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  useEffect(() => {
    async function loadComponents() {
      try {
        const [
          AccountInfoModule,
          NetworkInfoModule,
          TransferAPTModule,
          WalletDetailsModule,
          MessageBoardModule,
        ] = await Promise.all([
          import("../../components/AccountInfo"),
          import("../../components/NetworkInfo"),
          import("../../components/TransferAPT"),
          import("../../components/WalletDetails"),
          import("../../components/MessageBoard"),
        ]);

        setComponents({
          AccountInfo: AccountInfoModule.default,
          NetworkInfo: NetworkInfoModule.default,
          TransferAPT: TransferAPTModule.default,
          WalletDetails: WalletDetailsModule.default,
          MessageBoard: MessageBoardModule.default,
        });
        setLoaded(true);
      } catch (error) {
        console.error("Failed to load components:", error);
      }
    }

    loadComponents();
  }, []);

  const { AccountInfo, NetworkInfo, TransferAPT, WalletDetails, MessageBoard } = components;

  return (
    <>
      <ChunkErrorHandler />
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              {WalletDetails && <WalletDetails />}
              {NetworkInfo && <NetworkInfo />}
              {AccountInfo && <AccountInfo />}
              {TransferAPT && <TransferAPT />}
              {MessageBoard && <MessageBoard />}
            </CardContent>
          </Card>
        ) : (
          <CardHeader>
            <CardTitle>To get started Connect a wallet</CardTitle>
          </CardHeader>
        )}
      </div>
    </>
  );
}

export default Page;
