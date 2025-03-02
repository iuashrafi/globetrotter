"use client";

import { useEffect, useState } from "react";
import { GameProvider, useGameContext } from "../context/GameContext";
import Game from "../components/Game";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import CustomButton from "@/components/CustomButton";
import { Menu, RotateCcw, Users, X } from "lucide-react";
import ChallengeButton from "@/components/ChallengeButton";
import { createUser } from "@/services/api";
import Link from "next/link";

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
      <main className="min-h-screen bg-[#EEEFE8] flex flex-col">
        <Header />
        <div className="container mx-auto px-4 flex-1">
          <Game invitedBy={invitedBy} />
        </div>
        <Footer />
      </main>
    </GameProvider>
  );
}

const DropdownMenu = () => {
  const { username, logout } = useGameContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 focus:outline-none"
      >
        <Menu className="w-6 h-6" />
      </button>
      {isMenuOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 z-50">
          <ul>
            {username && (
              <li>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            )}
            <li>
              <Link
                target="_blank"
                href="https://www.linkedin.com/in/iuashrafi/"
                className="block px-4 py-2 hover:bg-gray-200"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { score } = useGameContext();
  return (
    <header className="relative bg-green-00 py-3 px-4 md:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-y-4 lg:gap-y-0 gap-x-4 items-center">
        {/* Menu + Progress Bar (always in one row) */}
        <div className="flex items-center gap-4 w-full lg:col-span-2">
          <DropdownMenu />
          <div className="bg-white flex-1 rounded-full h-5 min-w-[150px] md:min-w-[250px] relative overflow-hidden">
            <div className="bg-[#EB9D2A] rounded-full h-full w-[40%]"></div>
          </div>
        </div>

        {/* Counters (move to the same row on lg screens) */}
        <div className="flex justify-center lg:justify-end gap-4">
          <span className="flex items-center gap-1">
            <span className="text-lg md:text-xl">{score.incorrect}</span>
            <Image
              src="/wrong.png"
              width={30}
              height={30}
              alt="Wrong"
              className="w-8 h-8"
            />
          </span>
          <span className="flex items-center gap-1">
            <span className="text-lg md:text-xl">{score.correct}</span>
            <Image
              src="/right.png"
              width={30}
              height={30}
              alt="Right"
              className="w-8 h-8"
            />
          </span>
        </div>
      </div>
    </header>
  );
};

const Footer = () => {
  const { username, setUsername, resetGameProgress } = useGameContext();
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  return (
    <footer className="">
      <div className="w-full bg-white py-6 flex justify-around items-center gap-6 border-t border-t-[#E2E2E2]">
        {username ? (
          <ChallengeButton />
        ) : (
          <CustomButton
            title="Challenge a Friend"
            icon={<Users />}
            onClick={() => setShowRegisterModal(true)}
          />
        )}

        <CustomButton
          title="Reset"
          icon={<RotateCcw />}
          onClick={() => resetGameProgress()}
          className="bg-[#EBF1F5] border-b-[#D6E0E7] !text-[#061720]"
        />
      </div>

      {showRegisterModal && (
        <UserRegistrationModal setShowRegisterModal={setShowRegisterModal} />
      )}
    </footer>
  );
};

const UserRegistrationModal = ({ setShowRegisterModal }: any) => {
  const {
    username,
    setUsername,
    score,
    loading: gameLoading,
  } = useGameContext();
  const [inputUsername, setInputUsername] = useState("");
  // const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
      // setIsRegistered(true);
    }
  }, [setUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const userName = inputUsername.trim();
    if (!userName) return;
    setIsLoading(true);
    try {
      // Get current local data to optionally transfer to server
      const localScore = {
        correct: score.correct,
        incorrect: score.incorrect,
      };

      const localUsedQuestions = JSON.parse(
        localStorage.getItem("globetrotter_used_questions") || "[]"
      );
      // Call the createUser API function with local data
      await createUser(userName, localScore, localUsedQuestions);
      // Update state
      setUsername(userName);
      // setIsRegistered(true);
      setShowRegisterModal(false);
      setInputUsername("");

      // We don't need to set a success message as the username display will confirm success
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeUsername = () => {
    // Clear username but keep other data
    localStorage.removeItem("globetrotter_username");
    setUsername("");
    setInputUsername("");
    // setIsRegistered(false);
  };
  return (
    <div className="fixed inset-0 bg-[#EEEFE8]/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 animate-fade-in">
      <button
        className="cursor-pointer fixed top-8 right-8 rounded-full p-2"
        onClick={() => {
          setShowRegisterModal(false);
        }}
      >
        <X />
      </button>
      <div className="bg-card bg-[#EEEFE8] border border-[#D6E0E7] rounded-2xl shadow-xl p-8 max-w-md w-full relative animate-bounce-in overflow-hidden">
        <h2 className="text-xl font-bold mb-4 app-text-color">
          Login or Register
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            placeholder="Enter a unique username"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#EB9D2A]"
            required
            disabled={isLoading || gameLoading}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            className={`w-full mt-4 bg-[#EB9D2A] text-white py-2 px-4 rounded-xl border-b-3 border-[#B17716] transition-colors ${
              isLoading || gameLoading
                ? " bg-[#EB9D2A]/70 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading || gameLoading}
          >
            {isLoading ? "Processing..." : "Start Playing"}
          </button>
        </form>
      </div>
    </div>
  );
};
