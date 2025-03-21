"use client";

import React from "react";
import Image from "next/image";
import Bg from "../components/ui/bg";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "motion/react";
import { WalletSelector } from "../components/WalletSelector";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const Page = () => {
  const { connected } = useWallet();

  const router = useRouter();

  useEffect(() => {
    if (connected) {
      router.push("/wallet");
    }
  }, [connected, router]);

  return (
    <div className="w-full h-screen bg-fir flex flex-col justify-start items-center relative overflow-hidden">
      <motion.div
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image src={"/kosh.svg"} alt="logo" height={100} width={100} className="w-12 mt-4" />
      </motion.div>
      <div className="relative z-20 w-full h-24 sm:h-36 mt-[15vh]">
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-7xl sm:text-9xl text-sec font-semibold absolute -top-9 sm:-top-16 left-6 sm:left-1/4"
        >
          KOSH.
        </motion.p>
        <motion.p
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-7xl sm:text-9xl text-sec font-semibold absolute -bottom-9 sm:-bottom-16 right-6 sm:right-1/4"
        >
          WALLET
        </motion.p>
        <div className="absolute w-full h-full bg-[#E7E0D6] bg-opacity-[0.01] backdrop-blur-[7px] sm:backdrop-blur-[12px]"></div>
      </div>
      <motion.p
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-sec text-xl w-7/12 sm:text-2xl text-center sm:mt-[15vh] mt-[10vh] font-medium"
      >
        Maximize Your DeFi Gains with KOSH
      </motion.p>
      <motion.p
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="text-sec sm:text-xl mt-3 sm:mt-0 w-8/12 sm:w-2/5 text-center font-regular"
      >
        Connect your wallet and let AI optimize your yields, gas fees, and lending—across Aptos and beyond.
      </motion.p>
        <motion.div
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="mt-[3.5vh]"
        >
          <WalletSelector />
        </motion.div>
      <motion.div
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="z-20 w-4/5 absolute -bottom-14 h-40 bg-fir rounded-3xl border border-y-4 border-x-[1px] border-[#0D2789]"
      >
        <div className="flex justify-between w-full items-center px-7 mt-5">
          <Image src={"/kosh.svg"} alt="logo" height={100} width={100} className="w-9"></Image>
          <div className="text-fir bg-sec px-4 h-fit py-1 rounded-full text-lg">0xf76a...79af3</div>
        </div>
      </motion.div>
      <Bg />
    </div>
  );
};

export default Page;
