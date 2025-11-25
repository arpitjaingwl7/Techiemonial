import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import { BiCodeCurly, BiBot, BiPalette, BiServer, BiLockAlt, BiUser } from "react-icons/bi";
import { AuroraBackground } from "./AuraBackground"; 

// --- 3D Tilt Logic ---
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    x.set((clientX - left) / width - 0.5);
    y.set((clientY - top) / height - 0.5);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const SignUp3D = () => {
  // State for form and preview
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Full Stack Wizard"
  });
  
  // RPG Classes (Roles)
  const roles = [
    { id: "frontend", label: "Frontend Ninja", icon: BiPalette, color: "from-pink-500 to-rose-500" },
    { id: "backend", label: "Backend Guru", icon: BiServer, color: "from-blue-500 to-cyan-500" },
    { id: "fullstack", label: "Full Stack Wizard", icon: BiCodeCurly, color: "from-purple-500 to-indigo-500" },
    { id: "ai", label: "AI Architect", icon: BiBot, color: "from-emerald-500 to-teal-500" },
  ];

  const [selectedRole, setSelectedRole] = useState(roles[2]); // Default Full Stack
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Handle Password Strength Logic
  useEffect(() => {
    const len = formData.password.length;
    if (len === 0) setPasswordStrength(0);
    else if (len < 6) setPasswordStrength(30);
    else if (len < 10) setPasswordStrength(70);
    else setPasswordStrength(100);
  }, [formData.password]);

  // Avatar URL (Updates dynamically based on name)
  const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name || "Techie"}&backgroundColor=b6e3f4,c0aede,d1d4f9`;

  return (
    // FIXED: Added 'h-auto min-h-screen overflow-y-auto' to allow scrolling if content is tall
    <AuroraBackground className="h-auto min-h-screen overflow-x-hidden overflow-y-auto flex items-start justify-center bg-slate-900">
      
      {/* FIXED: Added 'pt-32 lg:pt-40' to push content down below the fixed Navbar */}
      {/* FIXED: Added 'items-center' to vertically align the form and the card */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-6 py-10 pt-32 lg:pt-40 pb-20 z-10 items-center">
        
        {/* --- LEFT SIDE: The Input Terminal --- */}
        <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
        >
            <div className="space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                    Initialize <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Identity</span>
                </h1>
                <p className="text-slate-400 text-lg">Create your profile to enter the developer multiverse.</p>
            </div>

            <form className="space-y-6 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl relative z-20">
                
                {/* Name Input */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Codename (Name)</label>
                    <div className="relative group">
                        <BiUser className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyan-400 transition-colors text-xl" />
                        <input 
                            type="text" 
                            placeholder="e.g. Elon Musk"
                            className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                </div>

                {/* Role Selection (RPG Style) */}
                <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Class</label>
                    <div className="grid grid-cols-2 gap-3">
                        {roles.map((role) => (
                            <div 
                                key={role.id}
                                onClick={() => {
                                    setSelectedRole(role);
                                    setFormData({ ...formData, role: role.label });
                                }}
                                className={`cursor-pointer p-3 rounded-xl border transition-all flex items-center gap-3 ${
                                    selectedRole.id === role.id 
                                    ? "bg-white/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
                                    : "bg-slate-950 border-slate-800 hover:border-slate-600"
                                }`}
                            >
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${role.color} text-white`}>
                                    <role.icon />
                                </div>
                                <span className="text-sm font-medium text-slate-200">{role.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Email & Password */}
                <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email</label>
                        <input 
                            type="email" 
                            placeholder="dev@startup.com"
                            className="w-full bg-slate-950 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                        <div className="relative">
                            <BiLockAlt className="absolute left-4 top-3.5 text-slate-500 text-xl" />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                className="w-full bg-slate-950 text-white pl-12 pr-4 py-3 rounded-xl border border-slate-700 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all"
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        {/* Password Strength Bar */}
                        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mt-2">
                            <motion.div 
                                className={`h-full ${passwordStrength < 50 ? "bg-red-500" : passwordStrength < 100 ? "bg-yellow-500" : "bg-green-500"}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${passwordStrength}%` }}
                                transition={{ duration: 0.3 }}
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 shadow-lg shadow-purple-500/30 relative overflow-hidden group"
                >
                    <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                    <span className="relative flex items-center justify-center gap-2">
                        <FaRocket /> Launch Profile
                    </span>
                </motion.button>

                <p className="text-center text-slate-400 text-sm">
                    Already have a character? <a href="#" className="text-cyan-400 hover:underline">Log In</a>
                </p>
            </form>
        </motion.div>


        {/* --- RIGHT SIDE: The Live 3D Preview (Holo-Card) --- */}
        <div className="hidden lg:flex items-center justify-center perspective-1000 h-full">
            <TiltCard className="w-80 aspect-[3/4] relative group">
                {/* Card Container */}
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    
                    {/* Dynamic Background based on Role */}
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${selectedRole.color}`} />
                    
                    {/* Holographic Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />

                    <div className="relative z-10 h-full flex flex-col items-center pt-10 px-6 pb-6 text-center" style={{ transform: "translateZ(20px)" }}>
                        
                        {/* Live Avatar */}
                        <div className="relative w-32 h-32 mb-6">
                            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${selectedRole.color} blur-md opacity-70 animate-pulse`} />
                            <img 
                                src={avatarUrl} 
                                alt="Avatar" 
                                className="relative w-full h-full rounded-full border-4 border-slate-900 bg-slate-800 object-cover"
                            />
                            {/* Role Icon Badge */}
                            <div className={`absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 border border-slate-700 text-white`}>
                                <selectedRole.icon />
                            </div>
                        </div>

                        {/* User Info */}
                        <h2 className="text-2xl font-bold text-white mb-1 break-all">
                            {formData.name || "New User"}
                        </h2>
                        <p className={`text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r ${selectedRole.color}`}>
                            {selectedRole.label}
                        </p>

                        {/* Faux Stats */}
                        <div className="grid grid-cols-3 gap-2 w-full mt-8 border-t border-white/10 pt-6">
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-white">0</span>
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Matches</span>
                            </div>
                            <div className="flex flex-col items-center border-x border-white/10">
                                <span className="text-lg font-bold text-white">1</span>
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Lvl</span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-lg font-bold text-white">0%</span>
                                <span className="text-[10px] uppercase text-slate-500 tracking-wider">Bugs</span>
                            </div>
                        </div>

                        {/* "Swipe" hint */}
                        <div className="mt-auto pt-8 flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                            Live Preview
                        </div>
                    </div>
                </div>

                {/* Decorative Glows behind card */}
                <div className={`absolute -inset-4 -z-10 bg-gradient-to-r ${selectedRole.color} opacity-30 blur-2xl rounded-full transition-colors duration-500`} />
            </TiltCard>
        </div>

      </div>
    </AuroraBackground>
  );
};

export default SignUp3D;