import React, { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence } from "framer-motion";
import { FaHeart, FaTimes, FaFire, FaCode, FaBug, FaUserAstronaut, FaRegSmileWink, FaRedo } from "react-icons/fa";
import axios from "axios";
import { useEffect } from "react";
// --- 1. Aesthetic Background Component ---
const AuroraBackground = ({ children }) => (
  <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden text-slate-200 font-sans selection:bg-cyan-500/30">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
    <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
    <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[128px]" />
    <div className="relative z-10 w-full max-w-md">{children}</div>
  </div>
);

// --- 2. Mock Data (Matching your API Structure) ---
const initialUsers = [
  {
    _id: "6916ff1a82e2981843d6853e",
    firstName: "Malti",
    lastName: "Sharma",
    gender: "female",
    designation: "Full Stack Developer",
    about: "I prefer my code dry and my coffee wet. Seeking a partner for hackathons and maybe a startup.",
    matchCount: 12,
  },
  {
    _id: "6916ff1a82e2981843d6853f",
    firstName: "Arjun",
    lastName: "Verma",
    gender: "male",
    designation: "DevOps Engineer",
    about: "I can fix your server, but I can't fix your printer. If you use Kubernetes, swipe right.",
    matchCount: 8,
  },
  {
    _id: "6916ff1a82e2981843d68540",
    firstName: "Sarah",
    lastName: "Connor",
    gender: "female",
    designation: "AI Researcher",
    about: "Training models to take over the world... I mean, help humanity. Python > Java.",
    matchCount: 24,
  },
  {
    _id: "6916ff1a82e2981843d68541",
    firstName: "David",
    lastName: "Ross",
    gender: "male",
    designation: "UI/UX Designer",
    about: "I make things look good. You make them work. Let's build the perfect product.",
    matchCount: 5,
  },
];

// --- 3. The Feed Card Component ---
const FeedCard = ({ user, onSwipe, index }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Dynamic Border Color based on swipe direction
  const borderColor = useTransform(
    x,
    [-200, 0, 200],
    ["rgba(239, 68, 68, 1)", "rgba(255, 255, 255, 0.1)", "rgba(34, 197, 94, 1)"]
  );

  // Funny Swipe Text
  const swipeText = useTransform(x, (value) => {
    if (value > 100) return "COMMIT"; // Swipe Right
    if (value < -100) return "ROLLBACK"; // Swipe Left
    return "";
  });
  
  const swipeColor = useTransform(x, (value) => (value > 0 ? "#22c55e" : "#ef4444"));

  // Generate a consistent avatar based on name
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.firstName}${user.lastName}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) {
      onSwipe(user._id, "right");
    } else if (info.offset.x < -100) {
      onSwipe(user._id, "left");
    }
  };

  return (
    <motion.div
      style={{ x, rotate, opacity, borderColor }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute top-0 left-0 w-full h-[600px] bg-slate-900/80 backdrop-blur-xl rounded-3xl border-2 shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing origin-bottom"
      initial={{ scale: 0.95, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Swipe Overlay Text */}
      <motion.div className="absolute top-10 right-10 z-20 font-black text-4xl tracking-widest border-4 rounded-lg px-2 rotate-12" 
        style={{ opacity: useTransform(x, [0, 100], [0, 1]), color: "#22c55e", borderColor: "#22c55e" }}>
        INTERESTED
      </motion.div>
      <motion.div className="absolute top-10 left-10 z-20 font-black text-4xl tracking-widest border-4 rounded-lg px-2 -rotate-12" 
        style={{ opacity: useTransform(x, [0, -100], [0, 1]), color: "#ef4444", borderColor: "#ef4444" }}>
        IGNORE
      </motion.div>

      {/* Card Content */}
      <div className="h-full flex flex-col relative">
        {/* Header / Avatar Area */}
        <div className="h-1/2 bg-gradient-to-b from-slate-800 to-slate-900 flex items-center justify-center relative group">
           {/* "Match Potential" Badge */}
           <div className="absolute top-4 right-4 bg-slate-950/50 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-2 border border-white/10 shadow-lg">
             <FaFire className="text-orange-500 animate-pulse" />
             <span className="font-bold text-sm">{user.matchCount} Matches</span>
           </div>

           <div className="w-40 h-40 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
             <img src={avatarUrl} alt={user.firstName} className="w-full h-full rounded-full object-cover bg-slate-100" />
           </div>
        </div>

        {/* Info Area */}
        <div className="h-1/2 p-6 flex flex-col bg-slate-900/40">
           <h2 className="text-3xl font-extrabold text-white mb-1">
             {user.firstName} <span className="text-slate-500 font-normal text-xl">{user.lastName}</span>
           </h2>
           
           <div className="flex items-center gap-2 text-cyan-400 font-medium mb-4">
             <FaCode /> 
             <span>{user.designation}</span>
           </div>

           <div className="flex-grow">
             <p className="text-slate-300 text-lg leading-relaxed italic">
               "{user.about}"
             </p>
           </div>

           {/* Fun "Stats" Row */}
           <div className="flex justify-between items-center border-t border-white/10 pt-4 mt-2 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <FaBug className="text-red-400" /> 
                <span>Bugs: ∞</span>
              </div>
              <div className="flex items-center gap-1">
                <FaUserAstronaut className="text-purple-400" /> 
                <span>Vibe: Coding</span>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. Main Discovery Feed ---
const DiscoveryFeed = () => {
const [users, setUsers] = useState(initialUsers);
  useEffect(() => {
    
    const fetchUsers = async () => {
      try {       
         const res=await axios.get("http://localhost:7777/user/feed",{
          withCredentials: true,
         });   
          setUsers(res.data.data); 
      }
      catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  

  // Reverse array so the first element is rendered on top (visually)
  const activeUsers = [...users].reverse();

  const handleSwipe = (id, direction) => {
    console.log(`User ${id} swiped ${direction}`);
    // Remove the user from the state
    setUsers((prev) => prev.filter((u) => u._id !== id));
  };

  const handleManualSwipe = (direction) => {
    if (users.length === 0) return;
    const topUser = users[0]; // Logic handles first in array as top card
    handleSwipe(topUser._id, direction);
  };

  return (
    <AuroraBackground>
      <div className="flex flex-col items-center w-full h-full pt-10 px-4">
        
        {/* Title */}
        <div className="my-15 mb-6 text-center">
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
                DEV MATCH
            </h1>
            <p className="text-xs text-slate-500 tracking-widest uppercase">Find your pair programmer</p>
        </div>

        {/* Card Stack Container */}
        <div className="relative w-full h-[600px] mb-8">
          <AnimatePresence>
            {activeUsers.map((user, index) => (
              <FeedCard 
                key={user._id} 
                user={user} 
                index={index} 
                onSwipe={handleSwipe} 
              />
            ))}
            
            {/* Empty State */}
            {activeUsers.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-slate-900/50 rounded-3xl border border-dashed border-slate-700"
                >
                    <FaRegSmileWink className="text-6xl text-yellow-400 mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">All Caught Up!</h3>
                    <p className="text-slate-400 mb-6">No more developers in your area. Go write some documentation while you wait.</p>
                    {/* <button 
                        onClick={() => setUsers(initialUsers)}
                        className="flex items-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-full font-bold transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <FaRedo /> Reset Feed
                    </button> */}
                </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Buttons (Only show if there are users) */}
        {activeUsers.length > 0 && (
          <div className="flex items-center gap-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleManualSwipe("left")}
              className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 text-red-500 flex items-center justify-center text-3xl shadow-xl hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors duration-300"
            >
              <FaTimes />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleManualSwipe("right")}
              className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-700 text-green-500 flex items-center justify-center text-3xl shadow-xl hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors duration-300"
            >
              <FaHeart />
            </motion.button>
          </div>
        )}

      </div>
    </AuroraBackground>
  );
};

export default DiscoveryFeed;