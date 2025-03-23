// pages/Optimize.tsx
"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";
// Internal components
import { toast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getAccountAPTBalance } from "../view-functions/getAccountBalance";
import { Recommendation } from "../types/defi";
import DefiRecommendations from "../components/DefiRecommendations";

export default function Optimize() {
  const { account } = useWallet();

  const [aptBalance, setAptBalance] = useState<number>(0);
  const [recipient, setRecipient] = useState<string>();
  const [transferAmount, setTransferAmount] = useState<number>();
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);

  const { data } = useQuery({
    queryKey: ["apt-balance", account?.address],
    refetchInterval: 10_000,
    queryFn: async () => {
      try {
        if (account === null) {
          console.error("Account not available");
        }

        const balance = await getAccountAPTBalance({ accountAddress: account!.address.toStringLong() });

        return {
          balance,
        };
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error,
        });
        return {
          balance: 0,
        };
      }
    },
  });

  const handleSelectRecommendation = (recommendation: Recommendation) => {
    setSelectedRecommendation(recommendation);
    setRecipient(recommendation.address);
    // Set a reasonable default amount (e.g., 25% of balance)
    const suggestedAmount = aptBalance * 0.25 / Math.pow(10, 8);
    setTransferAmount(suggestedAmount);
    
    toast({
      title: "Strategy Selected",
      description: `${recommendation.protocol} strategy selected. You can modify the amount below.`,
    });
  };

  useEffect(() => {
    if (data) {
      setAptBalance(data.balance);
    }
  }, [data]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col gap-6 p-6 border rounded-lg bg-card">
        <h2 className="text-2xl font-bold">APT DeFi Optimizer</h2>
        <h4 className="text-lg font-medium">Your APT balance: {aptBalance / Math.pow(10, 8)}</h4>
        
        {/* AI Recommendations Section */}
        <DefiRecommendations 
          aptBalance={aptBalance / Math.pow(10, 8)} 
          onSelectRecommendation={handleSelectRecommendation}
        />
        
        {/* Recommendation Details */}
        {selectedRecommendation && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/50">
            <h3 className="font-medium mb-2">Selected Strategy: {selectedRecommendation.protocol}</h3>
            <p className="text-sm mb-4">{selectedRecommendation.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Protocol Address</p>
                <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount to deposit (APT)</p>
                <Input value={transferAmount} onChange={(e) => setTransferAmount(parseFloat(e.target.value))} />
              </div>
            </div>
            <p className="text-sm mt-4 text-muted-foreground">
              Expected annual return: {(selectedRecommendation.expectedReturn * 100).toFixed(2)}% APY
            </p>
            <div className="flex justify-end mt-4">
              <Button
                variant="default"
                disabled={!account || !recipient || !transferAmount || transferAmount > aptBalance / Math.pow(10, 8) || transferAmount <= 0}
                onClick={() => {
                  toast({
                    title: "Instructions",
                    description: `To deposit ${transferAmount} APT into ${selectedRecommendation.protocol}, transfer this amount to the address ${recipient}. Visit their DApp to complete setup.`,
                  });
                }}
              >
                Get Deposit Instructions
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}