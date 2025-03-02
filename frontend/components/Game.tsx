"use client";

import React, { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import InviteBanner from "./InviteBanner";
import ResultFeedback from "./ResultFeedback";
import CluesComponent from "./CluesComponent";

interface GameProps {
  invitedBy?: string | null;
}

const Game: React.FC<GameProps> = ({ invitedBy = null }) => {
  const {
    destination,
    loading,
    error,
    score,
    showResult,
    gameOver,
    fetchNewDestination,
    handleAnswer,
  } = useGameContext();

  useEffect(() => {
    if (!destination) {
      fetchNewDestination();
    }
  }, [destination, fetchNewDestination]);

  if (gameOver) {
    return (
      <div className="text-center p-8">
        <h2 className="mt-8 text-4xl font-bold text-[#EB9D2A] mb-4">
          Game Over!
        </h2>
        <p className="mb-4 text-xl">
          You&apos;ve played through all available destinations.
        </p>
        <p className="text-xl font-semibold">
          Your final score: {score.correct} correct out of{" "}
          {score.correct + score.incorrect} total answers.
        </p>
      </div>
    );
  }

  if (loading && !destination) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (!destination) {
    return (
      <div className="text-center p-4">
        No destination found. Please try again.
      </div>
    );
  }

  return (
    <div className="game-container max-w-3xl mx-auto p-4">
      {invitedBy && <InviteBanner invitedBy={invitedBy} />}

      <CluesComponent />

      {!showResult ? (
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4">
          {destination.options?.map((option, index) => (
            <motion.button
              key={index}
              className="bg-white border-2 border-[#DBE2E6] text-[#7A8B94] font-bold p-4 text-lg border-b-3 rounded-xl shadow transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <ResultFeedback />
      )}
    </div>
  );
};

export default Game;
