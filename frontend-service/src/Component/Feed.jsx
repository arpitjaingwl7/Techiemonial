import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  X, 
  Flame, 
  Code, 
  Bug, 
  User, 
  Smile, 
  RotateCcw,
  Terminal,
  Quote
} from "lucide-react";
import axios from "axios";

// --- Aesthetic Background ---
const AuroraBackground = ({ children }) => (
  <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
    </div>
    <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
  </div>
);

// --- The Feed Card Component ---
const FeedCard = ({ user, onSwipe, index, isTop }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Dynamic Border Color based on swipe direction
  const borderColor = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 1)", "rgba(255, 255, 255, 0.1)", "rgba(34, 197, 94, 1)"]
  );

  // Avatar Fallback
  const [imgSrc, setImgSrc] = useState(user.photoUrl || "");
  const handleError = () => {
    setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}&backgroundColor=000000`);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe("interested", user._id);
    } else if (info.offset.x < -100) {
      onSwipe("ignored", user._id);
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, borderColor }}
      drag={isTop ? "x" : false} // Only allow dragging the top card
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className={`absolute top-0 left-0 w-full h-[600px] bg-slate-900/80 backdrop-blur-xl rounded-3xl border-2 shadow-2xl overflow-hidden origin-bottom ${isTop ? 'cursor-grab active:cursor-grabbing z-20' : 'z-10'}`}
      initial={{ scale: 0.95, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Swipe Overlay Text (Visible only when dragging) */}
      <motion.div className="absolute top-10 right-10 z-30 font-black text-4xl tracking-widest border-4 rounded-lg px-2 rotate-12 pointer-events-none" 
        style={{ opacity: useTransform(x, [0, 100], [0, 1]), color: "#22c55e", borderColor: "#22c55e" }}>
        COMMIT
      </motion.div>
      <motion.div className="absolute top-10 left-10 z-30 font-black text-4xl tracking-widest border-4 rounded-lg px-2 -rotate-12 pointer-events-none" 
        style={{ opacity: useTransform(x, [0, -100], [0, 1]), color: "#ef4444", borderColor: "#ef4444" }}>
        ROLLBACK
      </motion.div>

      {/* Card Content */}
      <div className="h-full flex flex-col relative select-none">
        {/* Header / Avatar Area */}
        <div className="h-3/5 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center relative group">
           {/* "Match Potential" Badge */}
           <div className="absolute top-4 right-4 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
             <Flame className="text-orange-500 animate-pulse" size={16} />
             <span className="font-bold text-sm">{user.matchCount || 0} Matches</span>
           </div>

           <div className="w-48 h-48 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
             <img 
                src={imgSrc} 
                onError={handleError}
                alt={user.firstName} 
                className="w-full h-full rounded-full object-cover bg-slate-100 pointer-events-none" 
             />
           </div>
        </div>

        {/* Info Area */}
        <div className="h-2/5 p-6 flex flex-col bg-slate-900/40">
           <h2 className="text-3xl font-extrabold text-white mb-1 capitalize">
             {user.firstName} <span className="text-slate-500 font-normal text-xl">{user.lastName}</span>
           </h2>
           
           <div className="flex items-center gap-2 text-cyan-400 font-medium mb-4 capitalize">
             <Code size={16} /> 
             <span>{user.designation || "Developer"}</span>
           </div>

           <div className="flex-grow overflow-hidden relative">
             <Quote className="absolute top-0 left-0 text-slate-700 opacity-50" size={24} />
             <p className="text-slate-300 text-lg leading-relaxed italic line-clamp-3 pl-8">
               "{user.about || "404: Bio not found. Just a developer trying to center a div."}"
             </p>
           </div>

           {/* Fun "Stats" Row */}
           <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <Bug className="text-red-400" size={14} /> 
                <span>Bugs: 99+</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="text-purple-400" size={14} /> 
                <span>Age: {user.age || "Unknown"}</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Feed Page ---
const FeedPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Feed
  const getFeed = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:7777/user/feed", { withCredentials: true });
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Handle Swipe Actions (API + State Update)
  const handleSwipe = async (status, userId) => {
    // 1. Optimistic UI: Remove user immediately
    setUsers((prev) => prev.filter((u) => u._id !== userId));

    try {
      // 2. Send Request
      await axios.post(
        `http://localhost:7777/request/send/${status}/${userId}`, 
        {}, 
        { withCredentials: true }
      );
      console.log(`Request sent: ${status} to ${userId}`);
    } catch (error) {
      console.error("Error sending request:", error);
      // Optional: Add Toast notification here
    }
  };

  // Helper for buttons to trigger the same logic as swipe
  const handleManualSwipe = (status) => {
    if (users.length === 0) return;
    const topUser = users[0]; // Logic assumes first in array is top
    handleSwipe(status, topUser._id);
  };

  if (loading) {
     return (
        <AuroraBackground>
             <div className="flex items-center justify-center h-screen">
                <Terminal className="text-4xl text-cyan-500 animate-bounce" />
                <span className="ml-4 text-xl font-mono text-cyan-400">Compiling Feed...</span>
             </div>
        </AuroraBackground>
     )
  }

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center w-full h-full pt-20 px-4">
        
        {/* Title */}
        <div className="mb-6 text-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                DISCOVERY
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase">
                {users.length > 0 ? "Reviewing Potential Squad Members" : "Scan Complete"}
            </p>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full max-w-sm h-[600px] mb-8">
          <AnimatePresence>
            {users.length > 0 ? (
                // We reverse the array for display so the first element (index 0) is rendered LAST (on top) 
                // However, logically we operate on index 0. 
                users.map((user, index) => {
                    // Only render the top 2 cards for performance and stacking visuals
                    if (index > 1) return null; 
                    
                    const isTop = index === 0;
                    return (
                        <FeedCard 
                            key={user._id} 
                            user={user} 
                            index={index} 
                            isTop={isTop}
                            onSwipe={handleSwipe} 
                        />
                    )
                }).reverse() 
            ) : (
                /* Empty State */
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700"
                >
                    <Smile className="text-6xl text-yellow-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
                    <p className="text-slate-400 mb-6">You've reviewed all developers in your sector. Time to push your code.</p>
                    <button 
                        onClick={() => getFeed()}
                        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <RotateCcw size={18} /> Refresh Feed
                    </button>
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons (Only show if there are users) */}
        {users.length > 0 && (
          <div className="flex items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleManualSwipe("ignored")}
              className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 text-red-500 flex items-center justify-center text-3xl shadow-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300"
            >
              <X />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleManualSwipe("interested")}
              className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 text-green-500 flex items-center justify-center text-3xl shadow-xl hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors duration-300"
            >
              <Heart />
            </motion.button>
          </div>
        )}

      </div>
    </AuroraBackground>
  );
};

export default FeedPage;