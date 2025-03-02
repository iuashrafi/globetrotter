"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
  SetStateAction,
  Dispatch,
} from "react";
import {
  getRandomDestination,
  checkAnswer,
  updateScore,
  getUserData,
  resetProgress,
  resetLocalProgress,
  Destination,
  AnswerResult,
} from "../services/api";

interface GameContextProps {
  destination: Destination | null;
  loading: boolean;
  error: string | null;
  score: { correct: number; incorrect: number };
  setScore: Dispatch<SetStateAction<{ correct: number; incorrect: number }>>;
  registerOrLogin: (username: string, localScore?: any) => Promise<boolean>;
  username: string | null;
  result: AnswerResult | null;
  showResult: boolean;
  gameOver: boolean;
  setUsername: (username: string) => void;
  fetchNewDestination: () => Promise<void>;
  handleAnswer: (answer: string) => Promise<void>;
  resetResult: () => void;
  resetGameProgress: () => Promise<void>;
  logout: () => void;
}

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<{ correct: number; incorrect: number }>({
    correct: 0,
    incorrect: 0,
  });
  const [username, setUsername] = useState<string | null>(null);
  const [result, setResult] = useState<AnswerResult | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [usedQuestions, setUsedQuestions] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const savedUsedQuestions = localStorage.getItem(
        "globetrotter_used_questions"
      );
      return savedUsedQuestions ? JSON.parse(savedUsedQuestions) : [];
    }
    return [];
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const initialDataLoaded = useRef(false); // Add this new ref

  // Update localStorage whenever usedQuestions changes (for non-logged-in users)
  useEffect(() => {
    if (typeof window !== "undefined" && !username) {
      localStorage.setItem(
        "globetrotter_used_questions",
        JSON.stringify(usedQuestions)
      );
      console.log("Used questions updated in localStorage:", usedQuestions);
    }
  }, [usedQuestions, username]);

  useEffect(() => {
    const loadInitialData = async () => {
      if (initialDataLoaded.current) return;
      initialDataLoaded.current = true;

      const savedUsername = localStorage.getItem("globetrotter_username");
      const savedScore = localStorage.getItem("globetrotter_score");

      if (savedUsername) {
        setUsername(savedUsername);

        try {
          const userData = await getUserData(savedUsername);

          setScore({
            correct: userData.correctAnswers,
            incorrect: userData.incorrectAnswers,
          });
        } catch (err) {
          console.error("Failed to load user data from server:", err);

          if (savedScore) {
            try {
              setScore(JSON.parse(savedScore));
            } catch (e) {
              console.error("Error parsing saved score", e);
            }
          }
        }
      } else if (savedScore) {
        // For non-logged in users, use localStorage score
        try {
          setScore(JSON.parse(savedScore));
        } catch (e) {
          console.error("Error parsing saved score", e);
        }
      }

      fetchNewDestination();
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    if (!username && (score.correct > 0 || score.incorrect > 0)) {
      localStorage.setItem("globetrotter_score", JSON.stringify(score));
    }
  }, [score, username]);

  const registerOrLogin = async (newUsername: string, localScore = null) => {
    try {
      // Save username to localStorage
      localStorage.setItem("globetrotter_username", newUsername);

      // Update state directly
      setUsername(newUsername);

      // Fetch user data if it exists
      const userData = await getUserData(newUsername);

      // Update score with server data
      setScore({
        correct: userData.correctAnswers,
        incorrect: userData.incorrectAnswers,
      });

      return true;
    } catch (err) {
      console.error("Failed to register/login user:", err);
      return false;
    }
  };

  const fetchNewDestination = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowResult(false);
      setResult(null);

      let newDestination;

      if (username) {
        // For logged-in users, pass the username
        newDestination = await getRandomDestination(username);
      } else {
        // For guest users, pass null for username and the usedQuestions array
        newDestination = await getRandomDestination(null, usedQuestions);
      }

      if ("gameOver" in newDestination && newDestination.gameOver) {
        setGameOver(true);
        setError("You've completed all available questions!");
        return;
      }

      const destinationData = newDestination as Destination;
      setDestination(destinationData);

      if (newDestination) {
        setDestination(newDestination as Destination);

        // Only track used questions locally for non-logged-in users
        if (!username && !usedQuestions.includes(destinationData.id)) {
          console.log(
            "Adding new question ID to used questions:",
            destinationData.id
          );
          setUsedQuestions((prevUsed) => [...prevUsed, destinationData.id]);
        }
      }
    } catch (err) {
      const error = err as Error;

      if (error.message === "GAME_OVER") {
        setGameOver(true);
        setError("You've completed all available questions!");
      } else {
        setError("Failed to fetch destination. Please try again.");
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (!destination) return;

    try {
      setLoading(true);

      const result = await checkAnswer(
        destination.id,
        selectedAnswer,
        username
      );
      setResult(result);
      setShowResult(true);

      if (result.isCorrect) {
        setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }

      if (username) {
        await updateScore(username, result.isCorrect);
      }
    } catch (err) {
      setError("Failed to check answer. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetResult = () => {
    setShowResult(false);
    setResult(null);
  };

  const resetGameProgress = async () => {
    try {
      setLoading(true);

      if (username) await resetProgress(username);
      else resetLocalProgress();

      setScore({ correct: 0, incorrect: 0 });
      setUsedQuestions([]);
      setGameOver(false);

      await fetchNewDestination();
    } catch (err) {
      setError("Failed to reset progress. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsername(null);
    setScore({ correct: 0, incorrect: 0 });
    setUsedQuestions([]);
    setGameOver(false);

    localStorage.removeItem("globetrotter_username");
    localStorage.removeItem("globetrotter_score");
    localStorage.removeItem("globetrotter_used_questions");

    fetchNewDestination();
  };

  return (
    <GameContext.Provider
      value={{
        destination,
        loading,
        error,
        score,
        setScore,
        username,
        result,
        showResult,
        gameOver,
        setUsername,
        registerOrLogin,
        fetchNewDestination,
        handleAnswer,
        resetResult,
        resetGameProgress,
        logout,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
