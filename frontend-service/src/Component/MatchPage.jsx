import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../utils/constants.js";
import {
  MessageSquare,
  User,
  Search,
  Filter,
  Code,
  ExternalLink,
  Sparkles,
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
    <div className="relative z-10 w-full min-h-screen flex flex-col">
      {children}
    </div>
  </div>
);

// --- Match Card Component ---
const MatchCard = ({ match }) => {
  // Fallback if photoUrl is missing or broken
  const [imgSrc, setImgSrc] = useState(match.photoUrl || "");

  // Fallback image function
  const handleError = () => {
    setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${match.firstName}&backgroundColor=000000`);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group relative bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Top Banner / Gradient */}
      <div className="h-24 bg-gradient-to-r from-cyan-900/30 to-purple-900/30 relative">
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 text-[10px] text-slate-400 border border-white/5 backdrop-blur-sm">
          Connected
        </div>
      </div>

      {/* Avatar Section */}
      <div className="relative px-6 -mt-12 flex justify-between items-end">
        <div className="relative">
          <div className="w-24 h-24 rounded-full p-1 bg-slate-900">
            <img
              src={imgSrc}
              onError={handleError}
              alt={match.firstName}
              className="w-full h-full rounded-full bg-slate-800 object-cover"
            />
          </div>
          {/* Status Indicator (Mocked as online for now since API lacks it) */}
          <div
            className="absolute bottom-2 right-1 w-5 h-5 rounded-full border-4 border-slate-900 bg-green-500"
            title="Online"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-slate-800 text-cyan-400 hover:bg-cyan-500 hover:text-white transition-colors shadow-lg border border-white/5 flex items-center justify-center"
            title="View Profile"
          >
            <User size={18} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-slate-800 text-purple-400 hover:bg-purple-500 hover:text-white transition-colors shadow-lg border border-white/5 flex items-center justify-center"
            title="Send Message"
          >
            <MessageSquare size={18} />
          </motion.button>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 pt-3 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-white flex items-center gap-2 capitalize">
          {match.firstName} {match.lastName}
        </h3>
        <p className="text-sm font-medium text-cyan-500 mb-4 flex items-center gap-1 capitalize">
          <Code size={14} /> {match.designation || "Developer"}
        </p>

        {/* About / Bio Section */}
        <div className="relative bg-slate-800/30 rounded-lg p-3 mb-6 border border-white/5 flex-grow">
          <Quote size={12} className="absolute top-2 left-2 text-slate-600" />
          <p className="text-sm text-slate-300 italic pl-4 line-clamp-3">
             {match.about || "No bio available."}
          </p>
        </div>

        {/* Primary Action Button */}
        <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 group-hover:tracking-wider duration-300 mt-auto">
          View Connection <ExternalLink size={14} className="opacity-70" />
        </button>
      </div>
    </motion.div>
  );
};

// --- Main Matches Page Component ---
const MatchesPage = () => {
  const [matches, setMatches] = useState([]); // Initialize as empty array
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredMatches = matches.filter(
    (m) =>
      m.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const response = await axios.get(
          BASE_URL+"/user/request/connections",
          { withCredentials: true }
        );
        console.log("Fetched Data:", response.data.data);
        setMatches(response.data.data);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConnections();
  }, []);

  return (
    <AuroraBackground>
      {/* Header Section */}
      <div className="pt-24 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2"
            >
              Squad Assembly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-slate-400 text-lg"
            >
              You have{" "}
              <span className="text-cyan-400 font-bold">{matches.length}</span>{" "}
              active connections ready to deploy.
            </motion.p>
          </div>

          {/* Search/Filter Bar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-slate-900/50 p-2 rounded-full border border-white/10 backdrop-blur-md w-full md:w-auto"
          >
            <div className="pl-4 text-slate-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search by name or role..."
              className="bg-transparent border-none outline-none text-white placeholder-slate-500 w-full md:w-64 py-1"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors flex items-center justify-center">
              <Filter size={16} />
            </button>
          </motion.div>
        </div>

        {/* Matches Grid */}
        {loading ? (
            <div className="flex justify-center items-center h-64 text-slate-500">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Sparkles size={40} className="text-cyan-500" />
                </motion.div>
                <span className="ml-3">Scanning sector...</span>
            </div>
        ) : (
            <AnimatePresence mode="wait">
            {filteredMatches.length > 0 ? (
                <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: {
                    transition: {
                        staggerChildren: 0.1,
                    },
                    },
                }}
                >
                {filteredMatches.map((match) => (
                    <MatchCard key={match._id} match={match} />
                ))}
                </motion.div>
            ) : (
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-slate-500"
                >
                <Sparkles size={60} className="mb-4 opacity-20" />
                <p className="text-xl font-medium">
                    No connections found in this sector.
                </p>
                <button
                    onClick={() => setSearchTerm("")}
                    className="mt-4 text-cyan-400 hover:underline"
                >
                    Clear filters
                </button>
                </motion.div>
            )}
            </AnimatePresence>
        )}
      </div>
    </AuroraBackground>
  );
};

export default MatchesPage;