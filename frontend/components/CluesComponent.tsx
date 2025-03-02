import { useGameContext } from "@/context/GameContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function CluesComponent() {
  const { destination } = useGameContext();
  const [randomClue, setRandomClue] = useState<string>("");

  useEffect(() => {
    const clues = destination?.clues ? [...destination.clues] : [];
    if (clues.length > 0) {
      setRandomClue(clues[Math.floor(Math.random() * clues.length)]);
    }
  }, [destination]);

  return (
    <div className="p-8 space-y-4">
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[#061720] text-lg font-bold"
      >
        {randomClue}
      </motion.p>
      <Image src="/man.png" alt="" width={200} height={200} />
    </div>
  );
}
