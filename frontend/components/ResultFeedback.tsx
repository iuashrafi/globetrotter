import React from "react";
import { motion } from "framer-motion";
import { Check, X, Info, MapPin, Heart } from "lucide-react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import CustomButton from "./CustomButton";
import { useGameContext } from "@/context/GameContext";

const ResultFeedback: React.FC = () => {
  const { width, height } = useWindowSize();
  const { result, fetchNewDestination } = useGameContext();

  return (
    <div className="fixed inset-0 bg-[#EEEFE8]/60 backdrop-blur-xl z-50 flex items-center justify-center p-4">
      {result?.isCorrect && (
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: [1.05, 0.98, 1], opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="bg-[#EEEFE8] border border-[#D6E0E7] rounded-2xl shadow-xl p-8 max-w-md w-full relative overflow-hidden"
      >
        <div className="flex justify-center mb-6 relative z-10">
          <div
            className={`rounded-full p-4 ${
              result?.isCorrect
                ? "bg-gradient-to-r from-green-400 to-emerald-500"
                : "bg-gradient-to-r from-red-400 to-rose-500"
            } shadow-lg`}
          >
            {result?.isCorrect ? (
              <Check className="h-10 w-10 text-white" />
            ) : (
              <X className="h-10 w-10 text-white" />
            )}
          </div>
        </div>

        <h3 className="text-2xl font-bold text-center mb-4 relative z-10">
          {result?.isCorrect ? (
            <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Correct!
            </span>
          ) : (
            <span className="bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
              Not quite!
            </span>
          )}
        </h3>

        <div className="text-center mb-6 relative z-10">
          {result?.isCorrect ? (
            <div className="flex flex-col items-center">
              <p className="text-lg">You correctly identified</p>
              <div className="flex items-center mt-2">
                <MapPin className="h-5 w-5 text-primary mr-1" />
                <span className="font-bold text-xl">
                  {result?.correctAnswer}, {result?.country}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p>The correct answer was:</p>
              <div className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-transparent p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-primary mr-1" />
                <span className="font-bold">
                  {result?.correctAnswer}, {result?.country}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 text-white p-5 rounded-xl mb-4 relative z-10 app-border-color">
          <div className="flex items-start">
            <div className="p-0.5 mr-3 mt-0.5">
              <Info className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="mb-1 text-sm uppercase tracking-wide text-primary flex items-center font-semibold">
                Fun Fact&nbsp;
                <Heart className="h-5 w-5 text-pink-500 ml-1" fill="#ec4899" />
              </h4>
              <p className="text-white">{result?.fact}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <CustomButton
        title={"Next"}
        className="absolute bottom-8 right-8 transition-all bounce-animation"
        onClick={fetchNewDestination}
      />
    </div>
  );
};

export default ResultFeedback;
