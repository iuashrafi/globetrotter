import { useGameContext } from "@/context/GameContext";
import { createUser } from "@/services/api";
import { motion } from "framer-motion";
import { Gamepad2, X } from "lucide-react";
import { Dispatch, SetStateAction, useState, useEffect } from "react";

export default function UserRegistrationModal({
  setShowRegisterModal,
}: {
  setShowRegisterModal: Dispatch<SetStateAction<boolean>>;
}) {
  const {
    setUsername,
    score,
    loading: gameLoading,
    registerOrLogin,
  } = useGameContext();

  const [inputUsername, setInputUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
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

      await createUser(userName, localScore, localUsedQuestions);

      const success = await registerOrLogin(userName);

      if (success) {
        setShowRegisterModal(false);
        setInputUsername("");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: [1.05, 0.98, 1], opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-card bg-[#EEEFE8] border border-[#D6E0E7] rounded-2xl shadow-xl p-8 max-w-md w-full relative animate-bounce-in overflow-hidden"
      >
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
          <motion.button
            whileTap={{ scale: 0.99, borderBottomWidth: 0 }}
            type="submit"
            className={`w-full flex space-x-2 justify-center mt-4 bg-[#EB9D2A] text-white py-2 px-4 rounded-xl border-b-3 border-[#B17716] transition-colors ${
              isLoading || gameLoading
                ? " bg-[#EB9D2A]/70 cursor-not-allowed"
                : ""
            }`}
            disabled={isLoading || gameLoading}
          >
            <span>{isLoading ? "Processing..." : "Start Playing"}</span>
            <Gamepad2 />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
