"use client";

import { useEffect, useState } from "react";
import { GameProvider, useGameContext } from "../context/GameContext";
import Game from "../components/Game";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";

export default function Home() {
  const searchParams = useSearchParams();
  const [invitedBy, setInvitedBy] = useState<string | null>(null);

  useEffect(() => {
    const invited = searchParams.get("invited");
    const by = searchParams.get("by");

    if (invited === "true" && by) {
      setInvitedBy(by);
    }
  }, [searchParams]);

  return (
    <GameProvider>
      <main className="min-h-screen bg-[#EEEFE8] py-8 flex flex-col">
        <Header />
        <div className="container mx-auto px-4 flex-1">
          <Game invitedBy={invitedBy} />
        </div>
        <Footer />
      </main>
    </GameProvider>
  );
}

const Header = () => {
  const { score } = useGameContext();
  return (
    <header className="">
      <div className="w-4xl container mx-auto flex gap-6">
        <Image src={"/hamburger.svg"} width={26} height={26} alt="" />
        <div className="bg-white flex-1 rounded-full">
          <div className="bg-[#EB9D2A] rounded-full h-full w-[40%]"></div>
        </div>
        <div className="flex gap-2.5">
          <span className="flex justify-center items-center gap-1">
            <span className="text-xl">{score.correct}</span>
            <Image src="/wrong.png" width={30} height={30} alt="" />
          </span>
          <span className="flex justify-center items-center gap-1">
            <span className="text-xl">{score.incorrect}</span>
            <Image src="/right.png" width={30} height={30} alt="" />
          </span>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="">
      <div className="w-full bg-white py-6 flex justify-around items-center gap-6 border-t border-t-[#E2E2E2]">
        <CustomButton title="Challenge a friend" />
        <CustomButton
          title="Next"
          className="bg-[#EBF1F5] border-b-[#D6E0E7] !text-[#061720]"
        />
      </div>
    </footer>
  );
};
