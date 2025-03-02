import Image from "next/image";
import { useGameContext } from "@/context/GameContext";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const { score } = useGameContext();

  const totalAnswered = score.correct + score.incorrect;
  const progressPercentage = (totalAnswered / 19) * 100;

  return (
    <header className="relative bg-green-00 py-3 px-4 md:px-6">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-y-4 lg:gap-y-0 gap-x-4 items-center">
        {/* Menu + Progress Bar (always in one row) */}
        <div className="flex items-center gap-4 w-full lg:col-span-2">
          <DropdownMenu />
          <div className="bg-white flex-1 rounded-full h-5 min-w-[150px] md:min-w-[250px] relative overflow-hidden">
            <div
              className="bg-[#EB9D2A] rounded-full h-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
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

export default Header;

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
