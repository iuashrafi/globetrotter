"use client";

import React, { useState, useRef } from "react";
import { useGameContext } from "../context/GameContext";
import { motion, AnimatePresence } from "framer-motion";
// import html2canvas from "html2canvas";
import CustomButton from "./CustomButton";
import { Copy, Users, X } from "lucide-react";

const ChallengeButton: React.FC = () => {
  const { username, score } = useGameContext();
  const [showModal, setShowModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_imageUrl, _setImageUrl] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_isGeneratingImage, _setIsGeneratingImage] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  // Create invite link with username parameter
  const getInviteLink = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}?invited=true&by=${encodeURIComponent(username || "")}`;
  };

  // Generate image from the share card for WhatsApp sharing
  /*
  const generateShareImage = async () => {
    if (!shareCardRef.current) return;

    setIsGeneratingImage(true);
    try {
      const canvas = await html2canvas(shareCardRef.current, {
        scale: 2,
        backgroundColor: null,
      });
      const dataUrl = canvas.toDataURL("image/png");
      setImageUrl(dataUrl);
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };
  */

  const handleShareWhatsApp = () => {
    const inviteLink = getInviteLink();
    const shareMessage = `Hey! I'm playing Globetrotter and challenge you to beat my score of ${score.correct} correct answers! Play here: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareMessage
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCopyLink = () => {
    const inviteLink = getInviteLink();
    navigator.clipboard
      .writeText(inviteLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <>
      {username && (
        <CustomButton
          title="Challenge a Friend"
          icon={<Users />}
          onClick={() => {
            setShowModal(true);
            // Generate image immediately when opening modal
            // setTimeout(() => generateShareImage(), 100);
          }}
        />
      )}

      {/* Share Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 bg-[#EEEFE8]/60 backdrop-blur-xl p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <motion.div
              className="bg-[#EEEFE8] shadow-xl border border-[#D6E0E7] rounded-2xl max-w-md w-full overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: [1.05, 0.98, 1], opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold app-text-color">
                    Challenge a Friend
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X />
                  </button>
                </div>

                <div
                  ref={shareCardRef}
                  style={{
                    background:
                      "linear-gradient(to right, #8B5CF6, #4F46E5, #8B5CF6)", // Replace with hex colors
                    padding: "2rem 1.5rem", // py-8 px-6
                    borderRadius: "0.5rem", // rounded-lg
                    color: "white", // text-white
                    marginBottom: "1rem", // mb-4
                  }}
                >
                  <div className="text-center mb-4">
                    <h4 className="text-2xl font-bold">Globetrotter</h4>
                    <p className="text-sm opacity-90">
                      The Ultimate Travel Guessing Game
                    </p>
                  </div>

                  <div
                    style={{
                      backgroundColor: "rgba(238, 239, 232, 0.3)", // bg-[#EEEFE8]/30
                      padding: "1rem", // p-4
                      borderRadius: "0.375rem", // rounded-md
                      backdropFilter: "blur(12px)", // backdrop-blur-xl
                    }}
                  >
                    <p style={{ fontWeight: "500" }}>
                      I, <span style={{ fontWeight: "bold" }}>{username}</span>,
                      challenge you!
                    </p>
                    <p style={{ marginTop: "0.5rem" }}>
                      Can you beat my score of{" "}
                      <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                        {score.correct}
                      </span>
                      correct answers?
                    </p>
                  </div>
                </div>

                {/* Show generated image - NOT REQUIRED - CODE for reference */}
                {/* {isGeneratingImage ? (
                  <div className="text-center py-4">
                    <div className="loader mx-auto"></div>
                    <p className="text-sm text-gray-500 mt-2">
                      Generating share image...
                    </p>
                  </div>
                ) : imageUrl ? (
                  <div className="text-center mb-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Share this image:
                    </p>
                    <img
                      src={imageUrl}
                      alt="Challenge card"
                      className="max-w-full h-auto rounded border border-gray-200"
                    />
                  </div>
                ) : (
                  <></>
                )} */}

                {/* Share buttons */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="space-x-2 w-full bg-[#EB9D2A] hover:bg-orange-400 text-white py-2 px-4 rounded-md flex items-center justify-center"
                  >
                    <Copy />
                    <span>Copy Invite Link</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChallengeButton;
