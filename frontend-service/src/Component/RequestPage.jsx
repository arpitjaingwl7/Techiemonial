import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FaUserLock, 
    FaCheckCircle, 
    FaTimesCircle, 
    FaCode, 
    FaTerminal,
    FaArrowRight,
    FaExclamationTriangle
} from "react-icons/fa";
// 🚨 IMPORTANT: Ensure you have a component named 'AuroraBackground' in your './AuraBackground' file.
import { AuroraBackground } from "./AuraBackground"; 

// --- 🛑 Custom CSS Styles for Terminal Aesthetic (Self-Contained) ---
const CustomStyles = () => (
    <style jsx="true" global="true">
        {`
            /* Custom Keyframes */
            @keyframes glitch-shake {
                0%, 100% { transform: translate(0, 0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(2px, -2px); }
                60% { transform: translate(-1px, 1px); }
                80% { transform: translate(1px, -1px); }
            }
            @keyframes pulse-dot {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.5; }
            }

            /* Custom Utility Classes */
            .animate-glitch-shake {
                animation: glitch-shake 0.5s infinite;
            }
            .animate-pulse-dot {
                animation: pulse-dot 1.5s ease-in-out infinite;
            }

            /* Neon Text Shadows */
            .shadow-neon-red { text-shadow: 0 0 5px #f00; }
            .shadow-neon-green { text-shadow: 0 0 5px #0f0; }
        `}
    </style>
);
// ------------------------------------------------------------------------

// --- Mock Request Data ---
const mockRequests = [
  {
    _id: "r1",
    firstName: "Devon",
    lastName: "Smith",
    designation: "Full Stack Commander",
    message: "Requesting access to your private repo (and your brainpower). Let's build something!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Devon&backgroundColor=c0aede,ffdfbf",
    riskLevel: "LOW",
    timestamp: "5 minutes ago",
  },
  {
    _id: "r2",
    firstName: "Anya",
    lastName: "Sharma",
    designation: "Frontend Sorceress",
    message: "Your CSS skills are legendary. I need to fork your design ideas. Access granted?",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anya&backgroundColor=b6e3f4,c0aede",
    riskLevel: "LOW",
    timestamp: "1 hour ago",
  },
  {
    _id: "r3",
    firstName: "Liam",
    lastName: "O'Connell",
    designation: "Cybersecurity Analyst",
    message: "I found a potential vulnerability in your profile's 'about' section. Let's connect and fix it.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Liam&backgroundColor=b6e3f4",
    riskLevel: "MEDIUM",
    timestamp: "1 day ago",
  },
];

// --- Animation Variants ---
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        },
    },
};

// --- Request Item Component: The Access Log Entry ---
const RequestEntry = ({ request, onAction }) => {
    const isMediumRisk = request.riskLevel === "MEDIUM";

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, height: 0, padding: 0, transition: { duration: 0.3 } }}
            whileHover={{ scale: 1.01, boxShadow: isMediumRisk ? "0 0 10px rgba(255, 165, 0, 0.5)" : "0 0 10px rgba(0, 255, 0, 0.5)" }}
            className={`flex flex-col md:flex-row items-center p-4 bg-slate-900/80 border ${isMediumRisk ? 'border-yellow-500/40' : 'border-green-500/40'} rounded-xl shadow-lg transition duration-300 overflow-hidden mb-4`}
        >
            {/* User Info */}
            <div className="flex items-center flex-grow w-full md:w-auto mb-3 md:mb-0">
                <img
                    src={request.avatar}
                    alt={request.firstName}
                    className="w-12 h-12 rounded-full flex-shrink-0 object-cover border-2 border-green-500"
                />
                <div className="ml-4 min-w-0 flex-grow">
                    <h3 className={`text-lg font-bold text-white truncate ${isMediumRisk ? 'shadow-neon-red animate-glitch-shake' : 'shadow-neon-green'}`}>
                        {request.firstName} {request.lastName}
                    </h3>
                    <p className="text-sm text-cyan-400 font-mono flex items-center">
                        <FaCode className="mr-1" />
                        {request.designation}
                    </p>
                </div>
            </div>

            {/* Request Message */}
            <div className="flex-grow w-full md:w-1/2 md:mx-4">
                <p className="text-slate-300 text-sm italic border-l-2 border-purple-400 pl-3">
                    {request.message}
                </p>
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 mt-3 md:mt-0 flex-shrink-0">
                <motion.button
                    onClick={() => onAction(request._id, "ACCEPT")}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-green-600 rounded-full text-white text-xl shadow-lg shadow-green-500/40 hover:bg-green-500"
                >
                    <FaCheckCircle />
                </motion.button>
                <motion.button
                    onClick={() => onAction(request._id, "REJECT")}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-3 bg-red-600 rounded-full text-white text-xl shadow-lg shadow-red-500/40 hover:bg-red-500"
                >
                    <FaTimesCircle />
                </motion.button>
            </div>
        </motion.div>
    );
};


// --- Main Access Request Console Component ---
const AccessRequestConsole = () => {
    const [requests, setRequests] = useState(mockRequests);

    const handleAction = (id, action) => {
        console.log(`Action: ${action} on request ID ${id}`);
        // Remove the processed request from the list
        setRequests((prev) => prev.filter((req) => req._id !== id));
        // In a real app, this is where you'd send an API call.
    };

    return (
        <>
            <CustomStyles /> {/* Inject styles for terminal effects */}
            <AuroraBackground className="flex justify-center min-h-screen pt-16 pb-10 overflow-x-hidden">
                <div className="w-full max-w-4xl px-4 z-10">

                    {/* --- HEADER: SECURITY CONSOLE --- */}
                    <motion.header
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-10 p-6 bg-slate-900/90 backdrop-blur-md rounded-2xl border-4 border-red-500/50 shadow-neon-red"
                    >
                        <div className="flex items-center justify-center space-x-3 mb-2">
                            <FaUserLock className="text-red-500 text-4xl animate-pulse-dot" />
                            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500">
                                ACCESS REQUEST CONSOLE
                            </h1>
                        </div>
                        <p className="text-slate-300 mt-2 font-mono flex items-center justify-center">
                            <FaArrowRight className="mr-2 text-yellow-400" />
                            **{requests.length}** Pending Authentication Requests. Review Required.
                        </p>
                    </motion.header>

                    {/* --- Requests List --- */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                    >
                        <AnimatePresence>
                            {requests.length > 0 ? (
                                requests.map((request) => (
                                    <RequestEntry 
                                        key={request._id} 
                                        request={request} 
                                        onAction={handleAction} 
                                    />
                                ))
                            ) : (
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="p-8 text-center text-slate-400 bg-slate-900/70 rounded-xl border border-green-500/50"
                                >
                                    <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-4" />
                                    <p className="text-xl font-mono">
                                        QUEUE CLEAR. All connection attempts reviewed.
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>

                    {/* --- Footer Security Log --- */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="mt-12 p-3 bg-slate-900/80 border border-red-500/50 rounded-lg text-center font-mono text-red-400 text-xs shadow-lg"
                    >
                        <FaExclamationTriangle className="inline mr-2 animate-glitch-shake" />
                        WARNING: Authorization decisions are final. Proceed with caution.
                    </motion.div>

                </div>
            </AuroraBackground>
        </>
    );
};

export default AccessRequestConsole;