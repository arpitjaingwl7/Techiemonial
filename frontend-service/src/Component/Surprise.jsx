import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Construction, 
  Coffee, 
  Rocket, 
  Zap, 
  ArrowLeft, 
  Terminal 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// --- Reused Background ---
const AuroraBackground = ({ children }) => (
  <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
    </div>
    <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
  </div>
);

const ComingSoon = () => {
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [spinSpeed, setSpinSpeed] = useState(5); // Seconds per rotation

  const funnyMessages = [
    "Compiling the fun...",
    "Centering a div...",
    "Downloading more RAM...",
    "Bribing the backend devs...",
    "Debugging a regex...",
    "Updating npm packages...",
    "Searching StackOverflow...",
    "Asking chatGPT for help...",
    "Coffee break in progress...",
    "Deploying to production on a Friday..."
  ];

  const [currentMessage, setCurrentMessage] = useState(funnyMessages[0]);

  const handleSpeedUp = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Make it spin faster per click
    setSpinSpeed((prev) => Math.max(0.2, prev * 0.8));
    
    // Pick a random funny message
    const randomIndex = Math.floor(Math.random() * funnyMessages.length);
    setCurrentMessage(funnyMessages[randomIndex]);
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        
        {/* Floating Icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: spinSpeed, 
            ease: "linear" 
          }}
          className="mb-8 relative"
        >
          <div className="w-40 h-40 bg-slate-800/50 rounded-full flex items-center justify-center border-4 border-dashed border-purple-500/30 backdrop-blur-xl">
             <Construction size={80} className="text-cyan-400" />
          </div>
          
          {/* Orbiting Coffee */}
          <motion.div 
            className="absolute -top-4 -right-4 p-3 bg-slate-900 rounded-full border border-slate-700 shadow-xl"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <Coffee size={24} className="text-yellow-500" />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-lg"
        >
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-green-400 mb-4">
                Coming Soon!
            </h1>
            <p className="text-slate-400 text-lg mb-2">
                The developer is currently stuck in Vim and doesn't know how to exit.
            </p>
            <p className="text-slate-500 text-sm italic mb-8">
                (This feature will drop as soon as we figure out why `NaN === NaN` is false)
            </p>

            {/* Interactive "Useless" Button */}
            <div className="bg-slate-900/50 border border-white/10 p-6 rounded-2xl backdrop-blur-md mb-8">
                <div className="flex items-center justify-center gap-2 text-cyan-400 font-mono text-sm mb-4">
                    <Terminal size={16} />
                    <span>Status: {currentMessage}</span>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSpeedUp}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                    <Zap size={20} fill="currentColor" />
                    Speed Up Development
                </motion.button>
                
                <p className="text-xs text-slate-600 mt-3 font-mono">
                    Devs motivated: {clickCount}
                </p>
            </div>
        </motion.div>

        {/* Navigation Back */}
        <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate("/feed")}
            className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
            <ArrowLeft size={18} />
            Back to Safety
        </motion.button>

      </div>
    </AuroraBackground>
  );
};

export default ComingSoon;