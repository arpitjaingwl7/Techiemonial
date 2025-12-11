import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRocket, FaBars, FaTimes, FaSignOutAlt, FaUser } from "react-icons/fa";
import { BiCodeAlt } from "react-icons/bi";
// Import the new actions
import { deleteUser } from "../userSlice.jsx"; 
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

import { BASE_URL } from "../../utils/constants.js";

import {toggleLoginPage,toggleSignupPage} from '../loginToggleSlice.jsx'

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const userData = useSelector((state) => state.userData.user);

  // --- UPDATED USER STATE ---
  const user = {
    isLoggedIn: userData != undefined,
    name: userData ? userData.firstName + " " + userData.lastName : "John Doe",
    // Use photoUrl from Redux, fallback to a generic placeholder if missing
    profilePic: userData?.photoUrl || "https://geographyandyou.com/images/user-profile.png" 
  };
  // -------------------------

  const navLinks = [
    { name: "Match", href: "/matches" },
    { name: "Requests", href: "/requests" },
    { name: "Feed", href: "/feed" },
    { name: "Surprize", href: "/surprize" },
    { name: "Buy Premium", href: "/payment"}
  ];

  // --- AUTH HANDLERS ---
  const handleLoginClick = () => {
    dispatch(toggleLoginPage());
    navigate("/login");
    setIsMobileOpen(false);
  };

  const handleSignupClick = () => {
    dispatch(toggleSignupPage());
    navigate("/login");
    setIsMobileOpen(false);
  };

  const handleLogout = async() => {
    try {
      dispatch(deleteUser());
      setIsProfileMenuOpen(false);
      await axios.post(BASE_URL+"/user/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Helper component for the Profile Display
  const ProfileDisplay = ({ user }) => (
    <div className="relative">
      <button
        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
        className="flex items-center gap-3 p-1 rounded-full hover:bg-white/10 transition-colors"
      >
        {/* Profile Image */}
        <img
          src={user.profilePic}
          alt={user.name}
          onError={(e) => { e.target.src = "https://geographyandyou.com/images/user-profile.png" }} // Fallback on error
          className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
        />
        {/* User Name */}
        <span className="text-sm font-semibold text-white hidden lg:inline">
          {user.name}
        </span>
        {/* Dropdown Chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : 'rotate-0'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Profile Dropdown Menu */}
      <AnimatePresence>
        {isProfileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-48 bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-3 border-b border-slate-700 text-sm text-slate-300">
                <span className="font-semibold text-white truncate block">{user.name}</span>
            </div>

            {/* View Profile Link */}
            <Link 
                to="/profile" 
                className="flex items-center gap-2 p-3 text-sm text-slate-300 hover:bg-slate-700/50 transition-colors"
                onClick={() => setIsProfileMenuOpen(false)}
            >
                <FaUser className="text-cyan-400" />
                Profile Settings
            </Link>
            
            {/* LOGOUT BUTTON */}
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center gap-2 p-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );


  // Helper component for the Auth Buttons
  const AuthButtons = () => (
    <div className="flex items-center gap-4">
      {/* Login Button with Dispatch */}
      <button 
        onClick={handleLoginClick} 
        className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
      >
        Log In
      </button>
      
      {/* Join Button with Dispatch */}
      <motion.button
        onClick={handleSignupClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative group overflow-hidden rounded-full px-6 py-2.5 bg-slate-800 text-white font-semibold text-sm shadow-lg shadow-purple-500/20"
      >
        <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-100" />
        <span className="absolute inset-[1px] rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors duration-200" />
        
        <span className="relative flex items-center gap-2">
          Join Now <FaRocket className="text-purple-400 group-hover:text-purple-300 transition-colors" />
        </span>
      </motion.button>
    </div>
  );

  return (
    <>
      {/* --- Floating Desktop Navbar --- */}
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
        className="fixed top-6 inset-x-0 max-w-5xl mx-auto z-50 hidden md:flex items-center justify-between px-6 py-3 rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-[0_0_30px_rgba(139,92,246,0.15)]"
      >
        {/* Logo Area */}
        <Link to="/feed" className="flex items-center gap-2 group">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-lg text-white shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
            <BiCodeAlt size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Techie<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Monial</span>
          </span>
        </Link>

        {/* Center Links with Sliding Pill Animation */}
        <div className="flex items-center gap-2">
          {user.isLoggedIn && navLinks.map((link, index) => (
            <Link
              key={link.name}
              to={link.href}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="relative px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
            >
              {/* The Sliding Background */}
              <AnimatePresence>
                {hoveredIndex === index && (
                  <motion.span
                    layoutId="hover-pill"
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
                  />
                )}
              </AnimatePresence>
              {link.name}
            </Link>
          ))}
        </div>

        {/* Action Buttons / Profile Display - CONDITIONAL RENDERING */}
        {user.isLoggedIn ? (
          <ProfileDisplay user={user} />
        ) : (
          <AuthButtons />
        )}

      </motion.nav>

      {/* --- Mobile Navbar (Simpler but stylized) --- */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
          <Link to="/" className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-md text-white">
              <BiCodeAlt size={18} />
            </div>
            <span className="font-bold text-lg text-white">TechieMonial</span>
          </Link>
            
          {/* Mobile Menu Button (Hamburger/Close) */}
          <button 
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMobileOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-4 right-4 bg-slate-800/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col gap-2"
            >
              {/* Mobile Links */}
              {user.isLoggedIn && navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.href}
                  className="p-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all"
                  onClick={() => setIsMobileOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {user.isLoggedIn && <div className="h-[1px] bg-white/10 my-2" />}
              
              {/* Mobile Auth/Profile */}
              {user.isLoggedIn ? (
                <>
                  <div className="p-3 rounded-xl bg-slate-700/50 text-white flex items-center justify-center gap-3">
                    <img
                      src={user.profilePic}
                      onError={(e) => { e.target.src = "https://geographyandyou.com/images/user-profile.png" }}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-cyan-400"
                    />
                    <span className="font-semibold">{user.name}</span>
                  </div>

                  {/* MOBILE PROFILE SETTINGS LINK */}
                  <Link 
                    to="/profile" 
                    className="p-3 rounded-xl text-slate-300 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-2"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <FaUser className="text-cyan-400" />
                    Profile Settings
                  </Link>

                  {/* MOBILE LOGOUT BUTTON */}
                  <button 
                    onClick={handleLogout}
                    className="p-3 text-center rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold shadow-lg flex items-center justify-center gap-2"
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* Mobile Login with Dispatch */}
                  <button onClick={handleLoginClick} className="p-3 text-center text-slate-300 hover:text-white">
                    Log In
                  </button>
                  
                  {/* Mobile Signup with Dispatch */}
                  <button onClick={handleSignupClick} className="p-3 text-center rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold shadow-lg">
                    Join Squad
                  </button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Navbar;