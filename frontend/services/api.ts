import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface Destination {
  id: string;
  clues: string[];
  options: string[];
}

export interface AnswerResult {
  isCorrect: boolean;
  fact: string;
  correctAnswer: string;
  country: string;
}

export interface UserScore {
  username: string;
  correctAnswers: number;
  incorrectAnswers: number;
  totalAnswers: number;
  usedQuestions: string[];
}
// Get random destination
export const getRandomDestination = async (
  username?: string | null,
  usedQuestions?: string[]
): Promise<
  | Destination
  | {
      message: string;
      gameOver: boolean;
    }
> => {
  try {
    if (username) {
      const query = username ? `?username=${encodeURIComponent(username)}` : "";
      const response = await api.get(`/destinations/random${query}`);
      return response.data;
    } else {
      // For guest users, use POST to send usedQuestions in the request body
      const response = await api.post("/destinations/random", {
        usedQuestions: usedQuestions || [],
      });
      return response.data;
    }
  } catch (error: any) {
    if (error.response?.data?.gameOver) {
      throw new Error("GAME_OVER");
    }
    throw new Error(
      error.response?.data?.message || "Failed to fetch destination"
    );
  }
};

// Check answer
export const checkAnswer = async (
  id: string,
  answer: string,
  username?: string | null
): Promise<AnswerResult> => {
  try {
    const response = await api.post("/destinations/check-answer", {
      id,
      answer,
      username,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to check answer");
  }
};

// Create user
export const createUser = async (
  username: string,
  localScore?: { correct: number; incorrect: number },
  usedQuestions?: string[]
): Promise<any> => {
  try {
    const response = await api.post("/users", {
      username,
      localScore,
      usedQuestions,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

// Update score
export const updateScore = async (
  username: string,
  isCorrect: boolean
): Promise<any> => {
  try {
    const response = await api.post("/users/score", { username, isCorrect });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to update score");
  }
};

// Get user data (score and used questions)
export const getUserData = async (username: string): Promise<UserScore> => {
  try {
    const response = await api.get(
      `/users/${encodeURIComponent(username)}/data`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Failed to get user data");
  }
};

// Reset user progress
export const resetProgress = async (username: string): Promise<any> => {
  try {
    const response = await api.post("/users/reset", { username });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to reset progress"
    );
  }
};

// // Get random destination
// export const getRandomDestination = async (
//   username?: string | null
// ): Promise<Destination> => {
//   const query = username ? `?username=${encodeURIComponent(username)}` : "";
//   const response = await fetch(`/api/destinations/random${query}`);

//   if (!response.ok) {
//     const errorData = await response.json();

//     // Handle game over scenario
//     if (errorData.gameOver) {
//       throw new Error("GAME_OVER");
//     }

//     throw new Error(errorData.message || "Failed to fetch destination");
//   }

//   return response.json();
// };

// // Check answer
// export const checkAnswer = async (
//   id: string,
//   answer: string,
//   username?: string | null
// ): Promise<AnswerResult> => {
//   const response = await fetch("/api/destinations/check-answer", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ id, answer, username }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to check answer");
//   }

//   return response.json();
// };

// // Create user
// export const createUser = async (
//   username: string,
//   localScore?: { correct: number; incorrect: number },
//   usedQuestions?: string[]
// ): Promise<any> => {
//   const response = await fetch("/api/users", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, localScore, usedQuestions }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to create user");
//   }

//   return response.json();
// };

// // Update score
// export const updateScore = async (
//   username: string,
//   isCorrect: boolean
// ): Promise<any> => {
//   const response = await fetch("/api/users/score", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username, isCorrect }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to update score");
//   }

//   return response.json();
// };

// // Get user data (score and used questions)
// export const getUserData = async (username: string): Promise<UserScore> => {
//   const response = await fetch(
//     `/api/users/${encodeURIComponent(username)}/data`
//   );

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to get user data");
//   }

//   return response.json();
// };

// // Reset user progress
// export const resetProgress = async (username: string): Promise<any> => {
//   const response = await fetch("/api/users/reset", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ username }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Failed to reset progress");
//   }

//   return response.json();
// };

// Reset local progress (client-side only)
export const resetLocalProgress = (): void => {
  localStorage.removeItem("globetrotter_score");
  localStorage.removeItem("globetrotter_used_questions");
};

export const getUserScore = async (username: string): Promise<UserScore> => {
  const response = await api.get(`/users/${username}/score`);
  return response.data;
};

export default api;
