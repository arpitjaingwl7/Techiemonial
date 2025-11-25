import React from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

export const AuroraBackground = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        "relative flex flex-col h-[100vh] items-center justify-center bg-slate-900 text-slate-950 transition-bg",
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          // This is the animation container
          className={clsx(
            "pointer-events-none absolute -inset-[10px] opacity-50 blur-[60px]",
            className
          )}
        >
          <div className="absolute top-0 left-0 w-full h-full z-0">
             {/* Blob 1: Fuchsia */}
            <motion.div
              initial={{ x: -100, y: -100, opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-500/30 mix-blend-screen filter blur-3xl animate-blob"
            />
            {/* Blob 2: Indigo/Purple (Moving) */}
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-500/30 mix-blend-screen filter blur-3xl"
            />
            {/* Blob 3: Cyan/Blue (Moving) */}
            <motion.div
              animate={{
                x: [0, -100, 0],
                y: [0, 50, 0],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute bottom-[-20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/30 mix-blend-screen filter blur-3xl"
            />
          </div>
        </div>
      </div>
      
      {/* This renders whatever content you put INSIDE the AuroraBackground tag */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
};