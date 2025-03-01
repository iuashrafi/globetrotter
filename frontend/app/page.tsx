"use client";

import { useEffect, useState } from "react";
import { GameProvider } from "../context/GameContext";
import Game from "../components/Game";
import { useSearchParams } from "next/navigation";

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
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">
            🌎 Globetrotter
          </h1>
          <p className="text-gray-600">The Ultimate Travel Guessing Game</p>
        </header>

        <GameProvider>
          <Game invitedBy={invitedBy} />
        </GameProvider>

        <footer className="text-center text-gray-500 text-sm mt-12">
          &copy; {new Date().getFullYear()} Globetrotter - All rights reserved
        </footer>
      </div>
    </main>
  );
}
