import Image from "next/image";
import { WalletSelector } from "./WalletSelector";

export function Header() {
  return (
    <div className="flex items-center justify-between px-4 py-2 max-w-screen-xl mx-auto w-full flex-wrap">
      <div className="flex flex-row items-center gap-2">
        <Image src={"/kosh.svg"} alt="logo" height={100} width={100} className="w-8" />
        <h1 className="text-sec font-semibold text-3xl">Kosh.</h1>
      </div>

      <div className="flex gap-2 items-center flex-wrap">
        <WalletSelector />
      </div>
    </div>
  );
}
