import { motion } from "framer-motion";
import { ReactNode } from "react";

type CustomButtonProps = {
  title: string;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
};

export default function CustomButton({
  title,
  onClick,
  className = "",
  icon,
}: CustomButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.99, borderBottomWidth: 0 }}
      onClick={onClick}
      className={`bg-[#EB9D2A] text-white font-bold w-[200px] py-4 px-6 border-b-6 border-[#B17716] rounded-xl flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span>{icon}</span>}
      {title}
    </motion.button>
  );
}
