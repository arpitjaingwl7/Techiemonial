import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

// --- 1. The 3D Flip Link Component ---
const FlipLink = ({ children, href }) => {
  return (
    <motion.a
      href={href}
      initial="initial"
      whileHover="hovered"
      className="relative block overflow-hidden whitespace-nowrap text-lg font-bold uppercase sm:text-xl"
      style={{ lineHeight: 0.95 }} // Tight line height for impact
    >
      {/* FRONT FACE (Normal State) */}
      <motion.div
        variants={{
          initial: { y: 0 },
          hovered: { y: "-100%" },
        }}
        transition={{ duration: 0.4, ease: "backInOut" }}
        className="origin-bottom"
      >
        <span className="text-gray-400">{children}</span>
      </motion.div>

      {/* BOTTOM FACE (Hover State - The "Cool Color" Reveal) */}
      <motion.div
        variants={{
          initial: { y: "100%" },
          hovered: { y: 0 },
        }}
        transition={{ duration: 0.4, ease: "backInOut" }}
        className="absolute inset-0 origin-top"
      >
        <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          {children}
        </span>
      </motion.div>
    </motion.a>
  );
};

// --- 2. The 3D Button Component ---
const Button3D = ({ text, onClick }) => {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ y: 0 }}
      className="group relative"
      onClick={onClick}
    >
      {/* The Shadow/Depth Layer */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-600 opacity-70 blur transition duration-200 group-hover:opacity-100" />
      
      {/* The Button Itself */}
      <div className="relative flex items-center justify-center rounded-lg bg-black px-6 py-2 text-white ring-1 ring-white/20 backdrop-blur-xl">
        <span className="font-bold">{text}</span>
      </div>
    </motion.button>
  );
};

// --- 3. Main Navbar Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="my-10 top-6 left-0 right-0 z-50 flex justify-center px-4">
      {/* The Floating Island Capsule */}
      <nav className="relative flex w-full max-w-5xl items-center justify-between rounded-2xl border border-white/10 bg-black/60 p-4 shadow-2xl backdrop-blur-xl ring-1 ring-white/5 lg:px-8">
        
        {/* Logo - With a subtle 3D tilt effect */}
        <motion.a
          href="/"
          whileHover={{ scale: 1.05, rotate: -2 }}
          className="relative z-10 text-2xl font-black tracking-tighter text-white"
        >
          TECHIE
          <span className="text-cyan-400">.</span>
          MONIAL
        </motion.a>

        {/* Desktop Links - The 3D Flip Links */}
        <div className="hidden items-center gap-8 md:flex">
          <FlipLink href="#">Discover</FlipLink>
          <FlipLink href="#">Matches</FlipLink>
          <FlipLink href="#">Community</FlipLink>
        </div>

        {/* Call to Action */}
        <div className="hidden md:block">
          <Button3D text="Join Beta" />
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="z-50 text-white md:hidden"
        >
          {isOpen ? <XMarkIcon className="h-8 w-8" /> : <Bars3Icon className="h-8 w-8" />}
        </button>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="absolute top-full left-0 mt-4 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 p-6 shadow-xl backdrop-blur-2xl md:hidden"
            >
              <div className="flex flex-col gap-6 text-center">
                <FlipLink href="#">Discover</FlipLink>
                <FlipLink href="#">Matches</FlipLink>
                <FlipLink href="#">Community</FlipLink>
                <div className="pt-4">
                  <Button3D text="Join Beta" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </div>
  );
};

export default Navbar;
