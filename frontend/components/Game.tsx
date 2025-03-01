"use client";

import React, { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import UserRegistration from "./UserRegistration";
import ChallengeButton from "./ChallengeButton";
import InviteBanner from "./InviteBanner";

interface GameProps {
  invitedBy?: string | null;
}

const Game: React.FC<GameProps> = ({ invitedBy = null }) => {
  const {
    destination,
    loading,
    error,
    score,
    result,
    showResult,
    gameOver,
    username,
    fetchNewDestination,
    handleAnswer,
  } = useGameContext();

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!destination) {
      fetchNewDestination();
    }
  }, [destination, fetchNewDestination]);

  if (gameOver) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-blue-800 mb-4">Game Over!</h2>
        <p className="mb-4">
          You've played through all available destinations.
        </p>
        <p className="text-lg">
          Your final score: {score.correct} correct out of{" "}
          {score.correct + score.incorrect} total answers.
        </p>
        <ChallengeButton />
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
      {/* User Registration */}
      <UserRegistration />

      {/* Show Invite Banner if user was invited */}
      {invitedBy && <InviteBanner invitedBy={invitedBy} />}

      {/* Score display */}
      <div className="score-container flex justify-between mb-6">
        <div className="correct text-green-500">Correct: {score.correct}</div>
        <div className="incorrect text-red-500">
          Incorrect: {score.incorrect}
        </div>
      </div>

      {/* Clues section */}
      <div className="clues-container bg-blue-50 p-6 rounded-lg mb-8 shadow-md">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Where am I?</h2>
        <ul className="list-disc pl-5 space-y-3">
          {destination.clues.map((clue, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.3 }}
              className="text-gray-700"
            >
              {clue}
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Options section */}
      {!showResult ? (
        <div className="options-container grid grid-cols-1 md:grid-cols-2 gap-4">
          {destination.options.map((option, index) => (
            <motion.button
              key={index}
              className="option-button bg-white border-2 border-blue-500 hover:bg-blue-100 text-blue-700 p-4 rounded-lg shadow transition-colors"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleAnswer(option)}
            >
              {option}
            </motion.button>
          ))}
        </div>
      ) : (
        <div className="result-container">
          {/* Confetti for correct answer */}
          {result?.isCorrect && (
            <Confetti
              width={width}
              height={height}
              recycle={false}
              numberOfPieces={200}
            />
          )}

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-lg shadow-lg ${
              result?.isCorrect
                ? "bg-green-100 border-green-500"
                : "bg-red-100 border-red-500"
            } border-2`}
          >
            <h3
              className={`text-xl font-bold mb-2 ${
                result?.isCorrect ? "text-green-700" : "text-red-700"
              }`}
            >
              {result?.isCorrect ? "🎉 Correct!" : "😢 Oops, wrong answer!"}
            </h3>

            {!result?.isCorrect && (
              <p className="mb-4">
                The correct answer was{" "}
                <span className="font-bold">{result?.correctAnswer}</span>,{" "}
                {result?.country}.
              </p>
            )}

            <div className="fact-box bg-white p-4 rounded-md shadow-inner my-4">
              <h4 className="text-lg font-semibold mb-2 text-blue-800">
                Fun Fact:
              </h4>
              <p className="text-gray-700">{result?.fact}</p>
            </div>

            <motion.button
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg shadow mt-4 w-full"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={fetchNewDestination}
            >
              Next Destination
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* Challenge button */}
      {username && !showResult && <ChallengeButton />}
    </div>
  );
};

export default Game;
