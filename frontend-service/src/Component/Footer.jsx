import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaDiscord, FaHeart, FaCoffee } from "react-icons/fa";
import { BiBug } from "react-icons/bi";

const Footer = () => {
  
  // Animation for the list items
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const socialLinks = [
    { icon: FaGithub, href: "#", label: "Check our spaghetti code" },
    { icon: FaTwitter, href: "#", label: "See our hot takes" },
    { icon: FaDiscord, href: "#", label: "Argue about frameworks" },
    { icon: FaLinkedin, href: "#", label: "Pretend we are professional" },
  ];

  return (
    <footer className="relative bg-slate-950 border-t border-white/10 overflow-hidden pt-20 pb-10">
      
      {/* Background Grids/Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            
          {/* Column 1: Brand & Humor */}
          <div className="col-span-1 md:col-span-1 space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                TechieMonial
              </span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              The only dating app where "merging branches" isn't a euphemism. (Okay, maybe it is).
            </p>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-500 bg-cyan-950/30 px-3 py-1 rounded border border-cyan-500/30 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System Status: 0 Bugs (Found)
            </div>
          </div>

          {/* Column 2: Product (Funny) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Find a Co-Founder", "Swipe on Repos", "Dark Mode (Only)", "Pricing (It costs your soul)"].map((item, i) => (
                <motion.li 
                    key={i} 
                    whileHover={{ x: 5, color: "#a78bfa" }}
                    className="cursor-pointer transition-colors"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company (Funny) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Company</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["About Us (2 Devs & a Cat)", "Careers (Pls fix our CSS)", "Blog", "Contact Support"].map((item, i) => (
                <motion.li 
                    key={i} 
                    whileHover={{ x: 5, color: "#22d3ee" }}
                    className="cursor-pointer transition-colors"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal (Funny) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold">Legal Stuff</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["Terms (Don't be a jerk)", "Privacy (We sell nothing)", "Cookie Policy (Yum)", "GDPR (We tried)"].map((item, i) => (
                <motion.li 
                    key={i} 
                    whileHover={{ x: 5, color: "#f472b6" }}
                    className="cursor-pointer transition-colors"
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright */}
          <p className="text-slate-500 text-sm flex items-center gap-1">
            &copy; {new Date().getFullYear()} TechieMonial. Built with <FaCoffee className="text-amber-700" /> and <FaHeart className="text-red-500" /> (and StackOverflow).
          </p>

          {/* Social Icons with Tooltips */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ y: -3, scale: 1.1 }}
                className="p-2 bg-slate-900 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-all group relative"
              >
                <social.icon size={18} />
                {/* Tooltip */}
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700">
                  {social.label}
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Scrolling Marquee at the very bottom */}
      <div className="w-full overflow-hidden bg-black py-2 mt-10 border-t border-slate-900">
        <motion.div 
            className="whitespace-nowrap flex gap-10 text-xs font-mono font-bold text-slate-700 uppercase tracking-widest select-none"
            animate={{ x: [0, -1000] }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
            {[...Array(10)].map((_, i) => (
                <span key={i} className="flex items-center gap-4">
                    ⚠️ DO NOT DEPLOY ON FRIDAYS <BiBug /> 
                    IF IT WORKS DON'T TOUCH IT <BiBug /> 
                    SCALING ISSUES PENDING <BiBug />
                </span>
            ))}
        </motion.div>
      </div>

    </footer>
  );
};

export default Footer;