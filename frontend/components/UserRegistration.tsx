"use client";
import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import { createUser } from "../services/api";

const UserRegistration: React.FC = () => {
  const {
    username,
    setUsername,
    score,
    loading: gameLoading,
  } = useGameContext();
  const [inputUsername, setInputUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsRegistered(true);
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
      setIsRegistered(true);

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
    setIsRegistered(false);
  };

  return (
    <div className="my-6">
      {!isRegistered ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto"
        >
          <h2 className="text-xl font-bold mb-4 text-[#EB9D2A]">
            Login or Register
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Enter a unique username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading || gameLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className={`w-full mt-4 bg-[#EB9D2A] hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading || gameLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading || gameLoading}
            >
              {isLoading ? "Processing..." : "Start Playing"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4"
        >
          <div className="flex items-center">
            <span className="inline-block bg-blue-100 text-blue-800 p-2 rounded-full mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm text-gray-500">Playing as</p>
              <p className="font-semibold text-blue-700">{username}</p>
            </div>
          </div>
          <button
            onClick={handleChangeUsername}
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Change
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserRegistration;
