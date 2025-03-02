import ChallengeButton from "@/components/ChallengeButton";
import CustomButton from "@/components/CustomButton";
import { useGameContext } from "@/context/GameContext";
import { RotateCcw, Users } from "lucide-react";
import { useEffect, useState } from "react";
import UserRegistrationModal from "./UserRegistrationModal";

export default function Footer() {
  const { username, setUsername, resetGameProgress } = useGameContext();
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("globetrotter_username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, [setUsername]);

  return (
    <footer className="">
      <div className="w-full bg-white py-6 flex justify-around items-center gap-6 border-t border-t-[#E2E2E2]">
        {username ? (
          <ChallengeButton />
        ) : (
          <CustomButton
            title="Challenge a Friend"
            icon={<Users />}
            onClick={() => setShowRegisterModal(true)}
          />
        )}

        <CustomButton
          title="Reset"
          icon={<RotateCcw />}
          onClick={() => resetGameProgress()}
          className="bg-[#EBF1F5] border-b-[#D6E0E7] !text-[#061720]"
        />
      </div>

      {showRegisterModal && (
        <UserRegistrationModal setShowRegisterModal={setShowRegisterModal} />
      )}
    </footer>
  );
}
