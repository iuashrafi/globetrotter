"use client";

import React, { useState, useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import { createUser } from "../services/api";

const UserRegistration: React.FC = () => {
  const { username, setUsername, score } = useGameContext();
  const [inputUsername, setInputUsername] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedUser = localStorage.getItem("gameUser");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUsername(userData.username);
        setIsRegistered(true);
      } catch (err) {
        console.error("Failed to parse stored user data:", err);
        localStorage.removeItem("gameUser");
      }
    }
  }, [setUsername]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const userName = inputUsername.trim();

    if (!userName) return;

    setIsLoading(true);
    try {
      // Call the createUser API function
      const response = await createUser(userName);

      // Store user data in localStorage
      const userData = {
        username: userName,
        userId: response.userId, // Assuming the API returns a userId
        lastLogin: new Date().toISOString(),
      };

      localStorage.setItem("gameUser", JSON.stringify(userData));

      // Update state
      setUsername(userName);
      setIsRegistered(true);
    } catch (err) {
      console.error("Registration error:", err);
      // Handle different error types (e.g., username already exists)
      setError("Failed to register. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeUsername = () => {
    // Clear user data from localStorage
    localStorage.removeItem("gameUser");
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
          <h2 className="text-xl font-bold mb-4 text-blue-800">
            Enter Your Username
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputUsername}
              onChange={(e) => setInputUsername(e.target.value)}
              placeholder="Enter a unique username"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={isLoading}
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              className={`w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Start Playing"}
            </button>
          </form>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <p className="text-lg">
            Playing as{" "}
            <span className="font-bold text-blue-600">{username}</span>
          </p>
          <button
            onClick={handleChangeUsername}
            className="text-sm text-blue-500 hover:text-blue-700 underline mt-1"
          >
            Change username
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default UserRegistration;
