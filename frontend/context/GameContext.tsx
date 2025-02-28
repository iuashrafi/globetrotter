"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useRef,
} from "react";
import {
  getRandomDestination,
  checkAnswer,
  updateScore,
  UserScore,
  Destination,
  AnswerResult,
} from "../services/api";

interface GameContextProps {
  destination: Destination | null;
  loading: boolean;
  error: string | null;
  score: { correct: number; incorrect: number };
  username: string | null;
  result: AnswerResult | null;
  showResult: boolean;
  gameOver: boolean;
  setUsername: (username: string) => void;
  fetchNewDestination: () => Promise<void>;
  handleAnswer: (answer: string) => Promise<void>;
  resetResult: () => void;
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
    const savedUsedQuestions = localStorage.getItem(
      "globetrotter_used_questions"
    );
    return savedUsedQuestions ? JSON.parse(savedUsedQuestions) : [];
  });
  const [gameOver, setGameOver] = useState<boolean>(false);
  const initialFetchCompleted = useRef(false);

  const TOTAL_QUESTIONS = 19;

  // Update localStorage whenever usedQuestions changes
  useEffect(() => {
    localStorage.setItem(
      "globetrotter_used_questions",
      JSON.stringify(usedQuestions)
    );
    console.log("Used questions updated:", usedQuestions);
  }, [usedQuestions]);

  // Initial setup - load saved data
  useEffect(() => {
    const savedUsername = localStorage.getItem("globetrotter_username");
    const savedScore = localStorage.getItem("globetrotter_score");

    if (savedUsername) setUsername(savedUsername);
    if (savedScore) {
      try {
        setScore(JSON.parse(savedScore));
      } catch (e) {
        console.error("Error parsing saved score", e);
      }
    }

    // Only fetch initial destination if we haven't done so already
    if (!initialFetchCompleted.current) {
      initialFetchCompleted.current = true;
      fetchNewDestination();
    }
  }, []);

  useEffect(() => {
    if (score.correct > 0 || score.incorrect > 0) {
      localStorage.setItem("globetrotter_score", JSON.stringify(score));
    }
  }, [score]);

  useEffect(() => {
    if (username) {
      localStorage.setItem("globetrotter_username", username);
    }
  }, [username]);

  const fetchNewDestination = async () => {
    try {
      setLoading(true);
      setError(null);
      setShowResult(false);
      setResult(null);

      let newDestination;
      let attempts = 0;
      const maxAttempts = 10; // Prevent infinite loops

      do {
        newDestination = await getRandomDestination();
        attempts++;

        // If we've tried all questions or too many attempts, break the loop
        if (
          attempts >= maxAttempts ||
          usedQuestions.length >= TOTAL_QUESTIONS
        ) {
          if (usedQuestions.length >= TOTAL_QUESTIONS) {
            setGameOver(true);
          }
          break;
        }
      } while (usedQuestions.includes(newDestination.id));

      if (newDestination) {
        setDestination(newDestination);

        // Only add to used questions if it's not already there
        if (!usedQuestions.includes(newDestination.id)) {
          console.log(
            "Adding new question ID to used questions:",
            newDestination.id
          );
          setUsedQuestions((prevUsed) => {
            // Double-check it's not already in the array (extra safety)
            if (prevUsed.includes(newDestination.id)) {
              return prevUsed;
            }
            return [...prevUsed, newDestination.id];
          });
        }
      }
    } catch (err) {
      setError("Failed to fetch destination. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedAnswer: string) => {
    if (!destination) return;

    try {
      setLoading(true);
      const result = await checkAnswer(destination.id, selectedAnswer);
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

  return (
    <GameContext.Provider
      value={{
        destination,
        loading,
        error,
        score,
        username,
        result,
        showResult,
        gameOver,
        setUsername,
        fetchNewDestination,
        handleAnswer,
        resetResult,
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

// "use client";

// import React, {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   ReactNode,
// } from "react";
// import {
//   getRandomDestination,
//   checkAnswer,
//   updateScore,
//   UserScore,
//   Destination,
//   AnswerResult,
// } from "../services/api";

// interface GameContextProps {
//   destination: Destination | null;
//   loading: boolean;
//   error: string | null;
//   score: { correct: number; incorrect: number };
//   username: string | null;
//   result: AnswerResult | null;
//   showResult: boolean;
//   gameOver: boolean;
//   setUsername: (username: string) => void;
//   fetchNewDestination: () => Promise<void>;
//   handleAnswer: (answer: string) => Promise<void>;
//   resetResult: () => void;
// }

// const GameContext = createContext<GameContextProps | undefined>(undefined);

// export const GameProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const [destination, setDestination] = useState<Destination | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [score, setScore] = useState<{ correct: number; incorrect: number }>({
//     correct: 0,
//     incorrect: 0,
//   });
//   const [username, setUsername] = useState<string | null>(null);
//   const [result, setResult] = useState<AnswerResult | null>(null);
//   const [showResult, setShowResult] = useState<boolean>(false);
//   const [usedQuestions, setUsedQuestions] = useState<string[]>(() => {
//     const savedUsedQuestions = localStorage.getItem(
//       "globetrotter_used_questions"
//     );
//     return savedUsedQuestions ? JSON.parse(savedUsedQuestions) : [];
//   });

//   const [gameOver, setGameOver] = useState<boolean>(false);

//   const TOTAL_QUESTIONS = 19;

//   // Update localStorage whenever usedQuestions changes
//   useEffect(() => {
//     localStorage.setItem(
//       "globetrotter_used_questions",
//       JSON.stringify(usedQuestions)
//     );
//   }, [usedQuestions]);

//   useEffect(() => {
//     const savedUsername = localStorage.getItem("globetrotter_username");
//     const savedScore = localStorage.getItem("globetrotter_score");

//     if (savedUsername) setUsername(savedUsername);
//     if (savedScore) {
//       try {
//         setScore(JSON.parse(savedScore));
//       } catch (e) {
//         console.error("Error parsing saved score", e);
//       }
//     }

//     fetchNewDestination();
//   }, []);

//   useEffect(() => {
//     if (score.correct > 0 || score.incorrect > 0) {
//       localStorage.setItem("globetrotter_score", JSON.stringify(score));
//     }
//   }, [score]);

//   useEffect(() => {
//     if (username) {
//       localStorage.setItem("globetrotter_username", username);
//     }
//   }, [username]);

//   const fetchNewDestination = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       setShowResult(false);
//       setResult(null);

//       let newDestination;
//       let attempts = 0;
//       const maxAttempts = 10; // Prevent infinite loops

//       do {
//         newDestination = await getRandomDestination();
//         attempts++;

//         // If we've tried all questions or too many attempts, break the loop
//         if (
//           attempts >= maxAttempts ||
//           usedQuestions.length >= TOTAL_QUESTIONS
//         ) {
//           if (usedQuestions.length >= TOTAL_QUESTIONS) {
//             setGameOver(true);
//           }
//           break;
//         }
//       } while (usedQuestions.includes(newDestination.id));

//       if (newDestination) {
//         setDestination(newDestination);

//         // Only add to used questions if it's not already there
//         if (!usedQuestions.includes(newDestination.id)) {
//           // Create a new array with the new ID to trigger the useEffect
//           setUsedQuestions((prevUsed) => [...prevUsed, newDestination.id]);
//         }
//       }
//     } catch (err) {
//       setError("Failed to fetch destination. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAnswer = async (selectedAnswer: string) => {
//     if (!destination) return;

//     try {
//       setLoading(true);
//       const result = await checkAnswer(destination.id, selectedAnswer);
//       setResult(result);
//       setShowResult(true);

//       if (result.isCorrect) {
//         setScore((prev) => ({ ...prev, correct: prev.correct + 1 }));
//       } else {
//         setScore((prev) => ({ ...prev, incorrect: prev.incorrect + 1 }));
//       }

//       if (username) {
//         await updateScore(username, result.isCorrect);
//       }
//     } catch (err) {
//       setError("Failed to check answer. Please try again.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetResult = () => {
//     setShowResult(false);
//     setResult(null);
//   };

//   return (
//     <GameContext.Provider
//       value={{
//         destination,
//         loading,
//         error,
//         score,
//         username,
//         result,
//         showResult,
//         gameOver,
//         setUsername,
//         fetchNewDestination,
//         handleAnswer,
//         resetResult,
//       }}
//     >
//       {children}
//     </GameContext.Provider>
//   );
// };

// export const useGameContext = () => {
//   const context = useContext(GameContext);
//   if (context === undefined) {
//     throw new Error("useGameContext must be used within a GameProvider");
//   }
//   return context;
// };
