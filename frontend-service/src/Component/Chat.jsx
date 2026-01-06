import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Image as ImageIcon,
  Smile,
  Check,
  CheckCheck,
  Lock,
  Zap
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { initializeSocket } from "../../utils/socket.js";
import { useSelector } from "react-redux";
import EmojiPicker from 'emoji-picker-react';

// --- Aesthetic Background ---
const AuroraBackground = ({ children }) => (
  <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col items-center">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
    <div className="relative z-10 w-full h-full flex flex-col items-center">{children}</div>
  </div>
);

const MessageBubble = ({ message }) => {
  const isMe = message.sender === "me";
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex w-full ${isMe ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex max-w-[85%] md:max-w-[70%] ${isMe ? "flex-row-reverse" : "flex-row"} items-end gap-2`}>
        <div className={`px-5 py-3 text-sm relative shadow-lg backdrop-blur-md ${isMe ? "bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl rounded-br-none border border-cyan-500/30" : "bg-slate-800/80 text-slate-200 rounded-2xl rounded-bl-none border border-white/10"}`}>
          <p className="leading-relaxed">{message.text}</p>
          <div className={`text-[10px] mt-1 flex items-center gap-1 opacity-70 ${isMe ? "justify-end text-cyan-100" : "justify-start text-slate-400"}`}>
            {message.time}
            {isMe && <span>{message.status === "read" ? <CheckCheck size={12} /> : <Check size={12} />}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ChatPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.userData.user);
  
  const userId = user?._id;
  const targetUserId = id;
  const targetUser = location.state?.match || { firstName: "Partner", lastName: "", photoUrl: "" };

  const [messages, setMessages] = useState([{ id: "sys-1", sender: "system", text: "Encryption Secure.", time: "09:59 AM" }]);
  const [inputText, setInputText] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const chatContainerRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const socketRef = useRef(null); // Persist socket instance

  // 1. Initialize Socket and Listeners
  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = initializeSocket();
    }
    const socket = socketRef.current;

    socket.emit("joinChat", { userId, targetUserId });

    const handleNewMessage = (data) => {
      // Important: Check if message is from the other user (or you)
      // Logic: Only add if sender is NOT you (since you add your own messages optimistically)
      if (data.userId !== userId) {
        setMessages((prev) => [
          ...prev, 
          { 
            id: Date.now(), 
            sender: "them", 
            text: data.newMessage, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            status: "read" 
          }
        ]);
      }
    };

    socket.on("receive_message", handleNewMessage);

    // Cleanup to prevent double messages
    return () => {
      socket.off("receive_message", handleNewMessage);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetUserId]);

  // 2. Scroll to Bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // 3. Click Outside Emoji Picker
  useEffect(() => {
    const clickOutside = (e) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target)) setShowEmojiPicker(false);
    };
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMesage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      newMessage: inputText,
    });

    // Add locally immediately (Optimistic UI)
    const myMsg = {
      id: Date.now(),
      sender: "me",
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: "sent"
    };
    setMessages(prev => [...prev, myMsg]);
    setInputText("");
    setShowEmojiPicker(false);
  };

  return (
    <AuroraBackground>
      <div className="w-full h-[calc(100vh-100px)] md:h-[85vh] max-w-5xl mt-24 mx-4 bg-slate-900/40 backdrop-blur-2xl md:border border-white/10 md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Header */}
        <div className="px-4 md:px-6 py-3 border-b border-white/5 flex justify-between items-center bg-slate-900/60 backdrop-blur-md z-30 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400">
              <ArrowLeft size={22} />
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full p-0.5 bg-gradient-to-tr from-cyan-500 to-purple-500">
              <img src={targetUser.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${targetUser.firstName}`} className="w-full h-full rounded-full object-cover bg-slate-900" alt="avatar" />
            </div>
            <div>
              <h3 className="font-bold text-white">{targetUser.firstName}</h3>
              <p className="text-[10px] text-cyan-400 font-mono tracking-wide"></p>
            </div>
          </div>
          <div className="flex gap-2 text-slate-400">
            <button className="p-2 bg-slate-800/50 hover:text-cyan-400 rounded-xl border border-white/5"><Phone size={18} /></button>
            <button className="p-2 bg-slate-800/50 hover:text-purple-400 rounded-xl border border-white/5"><Video size={18} /></button>
          </div>
        </div>

        {/* Chat Body */}
        
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar scroll-smooth">
          <div className="flex justify-center my-4">
            <span className="px-3 py-1 rounded-full bg-slate-800/50 border border-white/5 text-[10px] text-slate-500 flex items-center gap-1 font-mono uppercase">
              <Lock size={10} /> End-to-End Encrypted
            </span>
          </div>
          {messages.map((msg) => (
            msg.sender === "system" ? <div key={msg.id} className="text-center text-xs text-slate-500 font-mono italic">{msg.text}</div> 
            : <MessageBubble key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-6 bg-transparent shrink-0 z-40 relative">
          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div ref={emojiPickerRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-24 left-6 z-50 shadow-2xl">
                <EmojiPicker theme="dark" onEmojiClick={(emoji) => setInputText(prev => prev + emoji.emoji)} width={300} height={400} />
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSend} className="flex items-end gap-2 bg-slate-800/90 backdrop-blur-xl p-2 pl-4 rounded-[2rem] border border-white/10 shadow-2xl focus-within:border-cyan-500/50 transition-all">
            <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={`pb-3 transition-colors ${showEmojiPicker ? 'text-yellow-400' : 'text-slate-400 hover:text-yellow-400'}`}>
              <Smile size={24} />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Message ${targetUser.firstName}...`}
              className="flex-1 bg-transparent text-slate-100 focus:outline-none py-3 text-sm md:text-base"
            />
            <button type="submit" disabled={!inputText.trim()} className={`p-3 rounded-full transition-all ${inputText.trim() ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white scale-105" : "bg-slate-700 text-slate-500 cursor-not-allowed"}`}>
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default ChatPage;