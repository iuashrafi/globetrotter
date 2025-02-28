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
}

export const getRandomDestination = async (): Promise<Destination> => {
  const response = await api.get("/destinations/random");
  return response.data;
};

export const checkAnswer = async (
  id: string,
  answer: string
): Promise<AnswerResult> => {
  const response = await api.post("/destinations/check-answer", { id, answer });
  return response.data;
};

export const createUser = async (username: string) => {
  const response = await api.post("/users", { username });
  return response.data;
};

export const updateScore = async (username: string, isCorrect: boolean) => {
  const response = await api.post("/users/score", { username, isCorrect });
  return response.data;
};

export const getUserScore = async (username: string): Promise<UserScore> => {
  const response = await api.get(`/users/${username}/score`);
  return response.data;
};

export default api;
