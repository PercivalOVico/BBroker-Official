import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import splashVideo from "@assets/BBROKER_CLIP_grok-video-447793b3-72ee-4b1c-9071-ddb0521c455c_1769359323930.mp4";

export function WelcomeScreen({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 4000); // Increased time for video splash
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black flex items-center justify-center"
        >
          <video 
            src={splashVideo}
            autoPlay 
            muted 
            playsInline
            className="w-full h-full object-cover"
            onEnded={() => {
              setIsVisible(false);
              setTimeout(onComplete, 500);
            }}
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <motion.h1
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-white text-6xl font-black tracking-tighter"
            >
              BBROKER
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
