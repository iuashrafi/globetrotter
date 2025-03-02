"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUserScore } from "../services/api";

interface InviteBannerProps {
  invitedBy: string | null;
}

const InviteBanner: React.FC<InviteBannerProps> = ({ invitedBy }) => {
  const [inviterScore, setInviterScore] = useState<{
    username: string;
    correctAnswers: number;
    incorrectAnswers: number;
    totalAnswers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (invitedBy) {
      const fetchInviterScore = async () => {
        try {
          setLoading(true);
          const score = await getUserScore(invitedBy);
          setInviterScore(score);
        } catch (err) {
          console.error("Failed to fetch inviter score:", err);
          setError("Couldn't load challenge info");
        } finally {
          setLoading(false);
        }
      };

      fetchInviterScore();
    }
  }, [invitedBy]);

  if (!invitedBy || loading) return null;

  if (error) {
    return (
      <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-md mb-6">
        {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-100 to-purple-100 p-4 rounded-lg shadow-md mb-6 border-l-4 border-blue-500"
    >
      <h3 className="font-bold text-blue-800 mb-2">
        Challenge from {inviterScore?.username}
      </h3>
      <p className="text-gray-700">
        You&apos;ve been challenged to beat a score of{" "}
        <span className="font-bold text-green-600">
          {inviterScore?.correctAnswers || 0}
        </span>{" "}
        correct answers. Can you do it?
      </p>
    </motion.div>
  );
};

export default InviteBanner;
