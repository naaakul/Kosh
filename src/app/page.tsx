"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Bg from "../components/ui/bg";
import { motion } from "motion/react";

const Page = () => {
  return (
    <div className="w-full h-screen bg-fir flex flex-col justify-start items-center relative overflow-hidden">
      <motion.div
        initial={{ y: -5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Image src={"/kosh.svg"} alt="logo" height={100} width={100} className="w-12 mt-4" />
      </motion.div>
      <div className="relative z-20 w-full h-36 mt-24">
        <motion.p initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }} className="gabarito.className} text-9xl text-sec font-semibold absolute -top-16 left-1/4">KOSH.</motion.p>
        <motion.p initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }} className="gabarito.className} text-9xl text-sec font-semibold absolute -bottom-16 right-1/4">WALLET</motion.p>
        <div className="absolute w-full h-full bg-[#E7E0D6] bg-opacity-[0.01] backdrop-blur-[12px]"></div >
      </div>
      <motion.p
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="gabarito.className} text-sec text-2xl mt-[7%] font-medium"
      >
        Maximize Your DeFi Gains with KOSH
      </motion.p>
      <motion.p
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="gabarito.className} text-sec text-xl w-2/5 text-center font-regular"
      >
        Connect your wallet and let AI optimize your yields, gas fees, and lending—across Aptos and beyond.
      </motion.p>
      <Link href={"/wallet"} className="mt-[4%]">
        <motion.button
          initial={{ y: 5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="gabarito.className} text-fir bg-sec px-6 py-1 rounded-full text-2xl"
        >
          Get Started
        </motion.button>
      </Link>
      <motion.div initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }} className="z-20 w-4/5 absolute -bottom-14 h-40 bg-fir rounded-3xl border border-y-4 border-x-[1px] border-[#0D2789]">
        <div className="flex justify-between w-full items-center px-7 mt-5">
          <Image src={"/kosh.svg"} alt="logo" height={100} width={100} className="w-9 mt-4"></Image>
          <div className="gabarito.className} text-fir bg-sec px-4 h-fit py-1 rounded-full text-lg">0xf76a...79af3</div>
        </div>
      </motion.div>
      {/* <Image
        src={"bg.svg"}
        alt="bg"
        height={2000}
        width={2000}
        className="w-full pointer-events-none absolute z-10 opacity-5"
      ></Image> */}
      <Bg />
    </div>
  );
};

export default Page;
