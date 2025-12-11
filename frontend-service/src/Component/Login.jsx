import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { FaGoogle, FaGithub, FaTwitter } from "react-icons/fa";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../userSlice.jsx";
import { AuroraBackground } from "./AuraBackground"; 
import axios from "axios";
import { useNavigate } from "react-router";
import { BASE_URL } from "../../utils/constants.js";
import { store } from "../store.jsx";

// ----------------- 3D TILT CARD (STABILIZED) -----------------
const TiltCard = ({ children, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // CHANGED: Increased damping (15 -> 30) for smoother, stable movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 30 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 30 });

  // CHANGED: Reduced rotation range (15 -> 5 degrees) so input is easy
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className={`relative transition-all duration-200 ease-linear ${className}`}
    >
      {children}
    </motion.div>
  );
};

// ----------------- MAIN LOGIN/SIGNUP PAGE -----------------
const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleLoginPage = useSelector((store) => store.loginToggle.isLoginPage);

  // Mode Toggle
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    setIsLogin(toggleLoginPage);
  }, [toggleLoginPage]);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(false);
    setErrorMessage("");

    try {
      let response;
      
      if (isLogin) {
        // --- LOGIN LOGIC ---
        response = await axios.post(
          `${BASE_URL}/user/login`,
          { email, password },
          { withCredentials: true }
        );
      } else {
        // --- SIGNUP LOGIC ---
        response = await axios.post(
          `${BASE_URL}/user/signup`,
          { firstName, lastName, email, password },
          { withCredentials: true }
        );
      }

      dispatch(addUser(response.data.user));
      navigate("/feed");

    } catch (err) {
      console.error("Auth Error:", err);

      setErrorMessage(err.response?.data?.error || "Something went wrong. Please try again.");
      setError(true);
    }
  };

  const avatars = [
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob",
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
  ];

  return (
    <AuroraBackground className="overflow-hidden flex items-center justify-center">

      {/* Main Layout */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-6">

        {/* LEFT SIDE (Hero) */}
        <div className="hidden lg:flex flex-col items-center lg:items-start space-y-8">
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-80 h-80"
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
              alt="3D Robot"
              className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(59,130,246,0.5)]"
            />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-dashed border-cyan-500/30 rounded-full w-full h-full scale-125"
            />
          </motion.div>

          <div className="text-center lg:text-left">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Code.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Connect. Create.
              </span>
            </h1>
            <p className="text-slate-400 mt-4 text-lg max-w-md">
              Join the multiverse of developers. Find your next co-founder or hackathon partner.
            </p>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex -space-x-4">
                {avatars.map((src, i) => (
                  <motion.img
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    src={src}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-slate-900 bg-slate-800 object-cover hover:scale-110 transition-transform z-10 relative hover:z-20"
                  />
                ))}
              </div>
              <p className="text-sm text-slate-400 font-medium">
                <span className="text-white font-bold">12k+</span> Techies joined
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (Auth Card) */}
        <div className="flex justify-center [perspective:1000px]">
          <TiltCard className="w-full max-w-md">
            <div className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300">

              {/* Glow Effects */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px]" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[50px]" />

              <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>

                <h2 className="text-3xl font-bold text-white mb-2">
                  {isLogin ? "Welcome Back" : "Join the Squad"}
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  {isLogin 
                    ? "Enter your credentials to access the mainframe." 
                    : "Initialize your developer profile."}
                </p>

                <form className="space-y-4" onSubmit={handleAuth}>
                  
                  {/* Name Fields (Signup Only) */}
                  <AnimatePresence>
                    {!isLogin && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-4 overflow-hidden"
                      >
                        <div>
                          <label className="block text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
                            First Name
                          </label>
                          <input 
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            type="text"
                            required={!isLogin}
                            className="w-full bg-slate-950/50 text-white px-4 py-3 rounded-xl border border-slate-700
                            focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-slate-600"
                            placeholder="John"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
                            Last Name
                          </label>
                          <input 
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            type="text"
                            required={!isLogin}
                            className="w-full bg-slate-950/50 text-white px-4 py-3 rounded-xl border border-slate-700
                            focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-slate-600"
                            placeholder="Doe"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Email */}
                  <div>
                    <label className="block text-xs text-cyan-400 mb-2 font-semibold uppercase tracking-wider">
                      Email Address
                    </label>
                    <input  
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      type="email"
                      required
                      className="w-full bg-slate-950/50 text-white px-4 py-3 rounded-xl border border-slate-700
                      focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none placeholder-slate-600"
                      placeholder="neo@matrix.com"
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label className="block text-xs text-purple-400 mb-2 font-semibold uppercase tracking-wider">
                      Password
                    </label>
                    <input
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      required
                      className="w-full bg-slate-950/50 text-white px-4 py-3 rounded-xl border border-slate-700
                      focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none placeholder-slate-600"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-[38px] text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {error && <p className="text-red-500 text-xs font-semibold bg-red-500/10 p-2 rounded">{errorMessage}</p>}

                  {/* Forgot Password (Login Only) */}
                  {isLogin && (
                    <div className="text-right">
                      <a href="#" className="text-xs text-slate-400 hover:text-white transition-colors">Forgot password?</a>
                    </div>
                  )}

                  {/* SUBMIT BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl font-bold text-white text-lg relative overflow-hidden group mt-4"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 opacity-100" />
                    <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isLogin ? "Log In" : "Create Account"}
                    </span>
                  </motion.button>
                </form>

                {/* Toggle Login/Signup */}
                <div className="mt-6 text-center">
                  <p className="text-slate-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button 
                      onClick={() => { setIsLogin(!isLogin); setError(false); }}
                      className="text-cyan-400 hover:text-cyan-300 font-bold hover:underline transition-all"
                    >
                      {isLogin ? "Sign Up" : "Log In"}
                    </button>
                  </p>
                </div>

                {/* Social Divider */}
                {/* <div className="my-6 flex items-center gap-4">
                  <div className="flex-1 h-[1px] bg-slate-700" />
                  <span className="text-slate-500 text-xs uppercase tracking-widest">or continue with</span>
                  <div className="flex-1 h-[1px] bg-slate-700" />
                </div> */}

                {/* Social Buttons */}
                {/* <div className="grid grid-cols-3 gap-4">
                  {[FaGoogle, FaGithub, FaTwitter].map((Icon, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.1)" }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center py-3 rounded-xl bg-slate-800/50 border border-slate-700 text-slate-300 hover:text-white transition-all"
                    >
                      <Icon className="w-5 h-5" />
                    </motion.button>
                  ))}
                </div> */}

              </div>
            </div>
          </TiltCard>
        </div>

      </div>
    </AuroraBackground>
  );
};

export default LoginPage;