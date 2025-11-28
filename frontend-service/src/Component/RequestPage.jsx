import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BASE_URL } from "../../utils/constants.js";
import {
  Check,
  X,
  User,
  Clock,
  Code,
  Sparkles,
  Quote,
  ShieldAlert
} from "lucide-react";
import axios from "axios";

// --- Aesthetic Background (Reused for consistency) ---
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

// --- Request Card Component ---
const RequestCard = ({ request, onReview }) => {
  // Defensive check: API might return user details inside 'fromUserId' or directly
  const user = request.fromUserId || request; 
  const requestId = request._id;

  const [imgSrc, setImgSrc] = useState(user.photoUrl || "");

  const handleError = () => {
    setImgSrc(`https://api.dicebear.com/7.x/initials/svg?seed=${user.firstName}&backgroundColor=000000`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="group relative bg-slate-900/60 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col"
    >
      {/* Top Banner */}
      <div className="h-20 bg-gradient-to-r from-purple-900/30 to-blue-900/30 relative">
        <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/40 text-[10px] text-slate-400 border border-white/5 backdrop-blur-sm flex items-center gap-1">
          <Clock size={10} /> Pending
        </div>
      </div>

      {/* Avatar Section */}
      <div className="relative px-6 -mt-10 mb-2">
        <div className="w-20 h-20 rounded-full p-1 bg-slate-900 mx-auto sm:mx-0">
          <img
            src={imgSrc}
            onError={handleError}
            alt={user.firstName}
            className="w-full h-full rounded-full bg-slate-800 object-cover"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6 pt-0 flex-grow flex flex-col text-center sm:text-left">
        <h3 className="text-xl font-bold text-white capitalize">
          {user.firstName} {user.lastName}
        </h3>
        <p className="text-sm font-medium text-cyan-500 mb-4 flex items-center justify-center sm:justify-start gap-1 capitalize">
          <Code size={14} /> {user.designation || "Developer"}
        </p>

        {/* About / Bio Section */}
        <div className="relative bg-slate-800/30 rounded-lg p-3 mb-6 border border-white/5 flex-grow text-left">
          <Quote size={12} className="absolute top-2 left-2 text-slate-600" />
          <p className="text-sm text-slate-300 italic pl-4 line-clamp-2">
             {user.about || "Hey! I'd like to connect and share knowledge."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-auto">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReview("rejected", requestId)}
            className="flex-1 py-2 rounded-xl bg-slate-800 border border-white/5 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <X size={16} /> Ignore
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onReview("accepted", requestId)}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all font-semibold flex items-center justify-center gap-2"
          >
            <Check size={16} /> Accept
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Requests Page Component ---
const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          BASE_URL+"/user/request/recieved", 
          
          { withCredentials: true }
        );
        console.log("Fetched Requests:", response.data);
        // Assuming API returns array of requests in data.data
        setRequests(response.data.data || []);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Handle Accept/Reject Actions
  const handleReview = async (status, requestId) => {
    try {
      // 1. Optimistic UI Update: Remove from list immediately
      setRequests((prev) => prev.filter((r) => r._id !== requestId));

      // 2. Make API Call
      await axios.post(
        `${BASE_URL}/request/review/${status}/${requestId}`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error(`Error ${status} request:`, error);
      // Optional: Re-fetch or show toast on error
    }
  };

  return (
    <AuroraBackground>
      {/* Header Section */}
      <div className="pt-24 pb-8 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-10 text-center sm:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-2"
          >
            Incoming Signals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg"
          >
            Reviewing <span className="text-cyan-400 font-bold">{requests.length}</span> pending connection protocols.
          </motion.p>
        </div>

        {/* Content Grid */}
        {loading ? (
            <div className="flex justify-center items-center h-64 text-slate-500">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Sparkles size={40} className="text-cyan-500" />
                </motion.div>
                <span className="ml-3">Decrypting requests...</span>
            </div>
        ) : (
            <AnimatePresence mode="popLayout">
            {requests.length > 0 ? (
                <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } },
                }}
                >
                {requests.map((request) => (
                    <RequestCard 
                        key={request._id} 
                        request={request} 
                        onReview={handleReview} 
                    />
                ))}
                </motion.div>
            ) : (
                <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-24 text-slate-500 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30"
                >
                <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                    <ShieldAlert size={40} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Inbox Zero</h3>
                <p className="max-w-md text-center">
                    No pending requests. Your connection frequencies are clear. 
                    Head over to the feed to broadcast your profile.
                </p>
                </motion.div>
            )}
            </AnimatePresence>
        )}
      </div>
    </AuroraBackground>
  );
};

export default RequestsPage;