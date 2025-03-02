"use client";

import { Suspense, useEffect, useState } from "react";
import { GameProvider } from "../context/GameContext";
import Game from "../components/Game";
import { useSearchParams } from "next/navigation";

import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <GameProvider>
      <main className="min-h-screen bg-[#EEEFE8] flex flex-col">
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <HomeContent />
        </Suspense>
        <Footer />
      </main>
    </GameProvider>
  );
}

const HomeContent = () => {
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
    <div className="container mx-auto px-4 flex-1">
      <Game invitedBy={invitedBy} />
    </div>
  );
};
