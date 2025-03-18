"use client";

import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import dynamic from 'next/dynamic';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const AccountInfo = dynamic(() => import("../../components/AccountInfo"), { ssr: false });
const NetworkInfo = dynamic(() => import("../../components/NetworkInfo"), { ssr: false });
const TransferAPT = dynamic(() => import("../../components/TransferAPT"), { ssr: false });
const WalletDetails = dynamic(() => import("../../components/WalletDetails"), { ssr: false });
const MessageBoard = dynamic(() => import("../../components/MessageBoard"), { ssr: false });

function Page() {
  const { connected } = useWallet();
  const router = useRouter();

  useEffect(() => {
    if (!connected) {
      router.push("/");
    }
  }, [connected, router]);

  return (
    <>
      <Header />
      <div className="flex items-center justify-center flex-col">
        {connected ? (
          <Card>
            <CardContent className="flex flex-col gap-10 pt-6">
              <WalletDetails />
              <NetworkInfo />
              <AccountInfo />
              <TransferAPT />
              <MessageBoard />
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