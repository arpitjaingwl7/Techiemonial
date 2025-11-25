import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaCode, 
    FaTerminal, 
    FaBezierCurve, // For design/artistic connections
    FaEnvelope, 
    FaBolt, // For active connection
    FaUserAstronaut // Cool icon for dev
} from "react-icons/fa";
// 🚨 IMPORTANT: Ensure you have a component named 'AuroraBackground' in your './AuraBackground' file.
import { AuroraBackground } from "./AuraBackground"; 

// --- 🛑 Custom CSS Styles for Neon/3D Aesthetic (Self-Contained) ---
const CustomStyles = () => (
    <style jsx="true" global="true">
        {`
            /* Custom Keyframes */
            @keyframes neon-pulse {
                0%, 100% { box-shadow: 0 0 5px #0ff, 0 0 10px #0ff; }
                50% { box-shadow: 0 0 15px #0ff, 0 0 25px #0ff; }
            }
            @keyframes subtle-float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-3px); }
            }

            /* Custom Utility Classes */
            .animate-neon-pulse {
                animation: neon-pulse 3s ease-in-out infinite;
            }
            .animate-subtle-float {
                animation: subtle-float 4s ease-in-out infinite;
            }

            /* Neon Text Shadows */
            .shadow-neon-cyan { text-shadow: 0 0 5px #0ff; }
            .shadow-neon-purple { text-shadow: 0 0 5px #a855f7; }
        `}
    </style>
);
// ------------------------------------------------------------------------

// --- Mock Match Data (Simulating the API Data) ---
const mockMatches = [
  {
    _id: "6916ff1a82e2981843d6853e",
    firstName: "Malti",
    lastName: "Sharma",
    designation: "Frontend Architect",
    about: "Fixing bugs and drinking coffee. Need a co-pilot for a React project.",
    matchCount: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Malti&backgroundColor=b6e3f4,c0aede",
    status: "SYNCED",
    lastActivity: "Last commit 4 minutes ago.",
  },
  {
    _id: "m2",
    firstName: "Rohan",
    lastName: "Verma",
    designation: "Backend Sorcerer",
    about: "Let's build a secure and fast API. I specialize in scalable infrastructure.",
    matchCount: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan&backgroundColor=d1d4f9,ffdfbf",
    status: "LIVE",
    lastActivity: "Deploying new infrastructure.",
  },
  {
    _id: "m3",
    firstName: "Chloe",
    lastName: "Lee",
    designation: "Data Scientist",
    about: "My passion is turning messy data into actionable insights. Love collaborative sprints.",
    matchCount: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=fff,ffdfbf",
    status: "DORMANT",
    lastActivity: "Last seen installing new Python libraries.",
  },
];

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        },
    },
};

// --- Match Node Component: The 3D Link Card ---
const NeuralNode = ({ match }) => {
    const isLive = match.status === "LIVE" || match.status === "SYNCED";

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 50, damping: 10 }}
            whileHover={{ 
                scale: 1.05, 
                rotateY: 5, 
                rotateX: 2, 
                y: -5,
                boxShadow: "0 10px 30px rgba(0, 255, 255, 0.5)", // Enhance 3D feel
                transition: { type: "spring", stiffness: 200 }
            }}
            className="relative p-5 bg-slate-800/80 border border-cyan-400/20 rounded-xl shadow-2xl transition duration-300 overflow-hidden perspective-1000"
        >
            {/* Connection Status Border Effect */}
            <div className={`absolute inset-0 rounded-xl border-4 ${isLive ? 'border-cyan-400/50 animate-neon-pulse' : 'border-purple-400/30'}`} style={{ zIndex: 0 }}></div>

            <div className="flex items-start" style={{ zIndex: 1 }}>
                
                {/* Avatar */}
                <div className="relative w-16 h-16 rounded-full flex-shrink-0 overflow-hidden border-2 border-purple-500 bg-slate-900/50 shadow-lg">
                    <img src={match.avatar} alt={match.firstName} className="w-full h-full object-cover" />
                    <div className={`absolute bottom-0 right-0 p-1 rounded-tl-md text-xs font-bold text-white flex items-center ${isLive ? 'bg-green-600' : 'bg-yellow-600'}`}>
                        <FaBolt className="mr-1" />
                        {match.status}
                    </div>
                </div>

                {/* Details */}
                <div className="flex-grow ml-4 min-w-0">
                    <h3 className={`text-2xl font-extrabold text-white shadow-neon-cyan truncate`}>
                        {match.firstName} {match.lastName}
                    </h3>
                    <p className="text-md text-purple-400 mt-0.5 flex items-center shadow-neon-purple">
                        <FaUserAstronaut className="mr-2" />
                        <span className="truncate">{match.designation}</span>
                    </p>
                    
                    <p className="text-slate-300 text-sm italic mt-2">
                        <FaBezierCurve className="inline mr-1 text-red-400" />
                        **{match.about}**
                    </p>
                </div>
            </div>
            
            {/* Footer and Action */}
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center" style={{ zIndex: 1 }}>
                <div className="text-xs text-slate-400 font-mono">
                    <FaCode className="inline mr-1 text-cyan-400" />
                    {match.lastActivity}
                </div>
                <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: "#0ff", color: "#000" }}
                    whileTap={{ scale: 0.9 }}
                    className="py-2 px-4 bg-cyan-600 rounded-lg text-white font-bold text-sm shadow-lg shadow-cyan-500/30 transition duration-200"
                >
                    <FaEnvelope className="mr-2 inline" />
                    OPEN TERMINAL
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Main Neural Link Hub Component ---
const NeuralLinkHub = () => {
    const [matches] = useState(mockMatches);

    return (
        <>
            <CustomStyles /> {/* Inject custom styles */}
            <AuroraBackground className="flex justify-center min-h-screen pt-16 pb-10 overflow-x-hidden">
                <div className="w-full max-w-3xl px-4 z-10">

                    {/* --- HEADER: NEURAL NETWORK CONSOLE --- */}
                    <motion.header
                        initial={{ opacity: 0, rotateX: -30 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                        className="text-center mb-12 p-8 bg-slate-900/70 backdrop-blur-md rounded-2xl border-4 border-purple-500/50 shadow-neon-purple/50 transform origin-top"
                    >
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                            NEURAL LINK HUB
                        </h1>
                        <p className="text-slate-300 mt-3 text-lg">
                            **{matches.length}** Active Synaptic Connections Established.
                        </p>
                        <p className="text-sm text-yellow-400 font-mono mt-1">
                            INITIATE HIGH-BANDWIDTH DATA TRANSFER. (Start Chatting)
                        </p>
                    </motion.header>

                    {/* --- MATCH NODES GRID (The Network) --- */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 gap-6"
                    >
                        <AnimatePresence>
                            {matches.length > 0 ? (
                                matches.map((match) => (
                                    <NeuralNode key={match._id} match={match} />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-10 text-center text-slate-400 bg-slate-900/70 rounded-xl border border-red-500/50 shadow-lg"
                                >
                                    <FaTerminal className="text-6xl text-red-500 mx-auto mb-4 animate-spin-fast" />
                                    <p className="text-xl font-mono">
                                        ERROR: Connection Array Empty. Deploy a new feature to attract nodes.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </AuroraBackground>
        </>
    );
};

export default NeuralLinkHub;