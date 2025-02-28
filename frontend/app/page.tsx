import Game from "@/components/Game";
import { GameProvider } from "@/context/GameContext";
import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <Head>
        <title>Globetrotter Challenge</title>
        <meta
          name="description"
          content="Test your knowledge of world destinations"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto py-8 px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">
            Globetrotter Challenge
          </h1>
          <p className="text-gray-600">
            Guess famous destinations from cryptic clues!
          </p>
        </header>

        <GameProvider>
          <Game />
        </GameProvider>
      </main>

      <footer className="text-center p-4 text-gray-500 text-sm">
        <p>The Ultimate Travel Guessing Game - 2025</p>
      </footer>
    </div>
  );
}
