import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserEdit, FaEnvelope, FaCodeBranch, FaCalendarAlt, FaStar, FaEdit, FaSave, FaBolt, FaChevronRight } from 'react-icons/fa';
import profilePic from "./assets/profile.jpg";
// Mock user data structure
const initialUser = {
  name: "Vanshika",
  email: "alex.j@techie.dev",
  firstName: "vanshika",
  lastName: "Barua",
  squad: "Cyber Ninjas",
  role: "No Roles",
  profilePic: "https://i.pravatar.cc/150?img=5",
  joinDate: "January 15, 2023",
  rating: 4.8,
};

// Mock activity feed data
const mockFeed = [
  { id: 1, type: "match", text: "Matched with 'Squad Goals' for the weekly challenge.", time: "2 hours ago", icon: FaCodeBranch, color: "text-cyan-400" },
  { id: 2, type: "rating", text: "Received a 5-star rating for Hackathon contribution.", time: "1 day ago", icon: FaStar, color: "text-yellow-400" },
  { id: 3, type: "settings", text: "Updated profile details and bio.", time: "3 days ago", icon: FaUserEdit, color: "text-purple-400" },
  { id: 4, type: "event", text: "Registered for the 'AI Integration' Hackathon.", time: "1 week ago", icon: FaCalendarAlt, color: "text-blue-400" },
];

const ProfilePage = () => {
  const [user, setUser] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUser);

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setUser({ ...user, ...formData, name: `${formData.firstName} ${formData.lastName}` });
    setIsEditing(false);
  };

  // --- Input Field Component ---
  const Field = ({ label, name, value, disabled = false, icon: Icon }) => (
    <div className="flex flex-col space-y-1">
      <label className="text-sm font-medium text-slate-400 flex items-center gap-2">
        <Icon className="text-purple-400" /> {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full p-3 rounded-xl border-2 transition-all 
          ${disabled 
            ? 'bg-slate-700/50 border-slate-700 text-slate-400 cursor-not-allowed'
            : 'bg-slate-900 border-cyan-500/30 text-white focus:border-cyan-500 focus:shadow-lg focus:shadow-cyan-500/10'
          }
          `}
      />
    </div>
  );
  // -----------------------------

  return (
    <div className="min-h-screen bg-slate-900 pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        className="max-w-6xl mx-auto"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        <h1 className="text-4xl font-extrabold text-white text-center mb-12">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            {user.name}'s Dashboard
          </span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* --- Column 1: Profile and Stats --- */}
          <motion.div variants={cardVariants} className="lg:col-span-1 space-y-8">
            {/* Profile Card */}
            <div className="bg-slate-800/70 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.2)] border border-white/10 flex flex-col items-center">
              <div className="relative p-1 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 mb-4">
                <img
                  src={profilePic}
                  alt={user.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-slate-800"
                />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">{user.name}</h2>
              <p className="text-slate-400 text-sm mt-1">{user.role}</p>

              <div className="mt-4 pt-4 border-t border-slate-700 w-full grid grid-cols-2 gap-4 text-center">
                <div className='p-2 bg-slate-900/50 rounded-lg'>
                    <FaStar className='text-yellow-400 mx-auto' size={18} />
                    <p className='text-xl font-bold text-white'>{user.rating}</p>
                    <p className='text-xs text-slate-400'>Rating</p>
                </div>
                <div className='p-2 bg-slate-900/50 rounded-lg'>
                    <FaCodeBranch className='text-cyan-400 mx-auto' size={18} />
                    <p className='text-xl font-bold text-white'>{user.squad}</p>
                    <p className='text-xs text-slate-400'>Squad</p>
                </div>
              </div>
            </div>

            {/* Live Profile Feed Card (Activity Feed) */}
            <div className="bg-slate-800/70 backdrop-blur-md p-6 rounded-3xl shadow-[0_0_40px_rgba(59,130,246,0.1)] border border-white/10">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <FaBolt className='text-yellow-400' /> Live Activity Feed
              </h3>
              <ul className="space-y-3">
                {mockFeed.map((item) => (
                  <motion.li 
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-900 transition-colors"
                  >
                    <item.icon className={`mt-1 ${item.color}`} size={16} />
                    <div className="flex-grow">
                      <p className="text-sm text-white">{item.text}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
                    </div>
                    <FaChevronRight className='text-slate-600 self-center' size={12} />
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* --- Column 2 & 3: Editing Fields --- */}
          <motion.div 
            variants={cardVariants}
            className="lg:col-span-2 bg-slate-800/70 backdrop-blur-md p-8 rounded-3xl shadow-[0_0_40px_rgba(139,92,246,0.2)] border border-white/10"
          >
            <h3 className="text-2xl font-bold text-white mb-6 border-b border-slate-700 pb-3 flex items-center justify-between">
              Profile Settings
              <motion.button
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full transition-colors 
                  ${isEditing 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:to-green-500 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
              >
                {isEditing ? <FaSave /> : <FaEdit />}
                {isEditing ? 'Save Changes' : 'Edit Details'}
              </motion.button>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editable Fields */}
              <Field 
                label="First Name" 
                name="firstName" 
                value={formData.firstName} 
                icon={FaUserEdit} 
                disabled={!isEditing} 
              />
              <Field 
                label="Last Name" 
                name="lastName" 
                value={formData.lastName} 
                icon={FaUserEdit} 
                disabled={!isEditing} 
              />
              <Field 
                label="Email Address (Disabled)" 
                name="email" 
                value={formData.email} 
                icon={FaEnvelope} 
                disabled={true} 
              />
              <Field 
                label="Role/Title" 
                name="role" 
                value={formData.role} 
                icon={FaCodeBranch} 
                disabled={!isEditing} 
              />
              
              {/* Read-Only Fields */}
              <Field 
                label="Squad Name (Read-Only)" 
                name="squad" 
                value={user.squad} 
                icon={FaCodeBranch} 
                disabled={true} 
              />
              <Field 
                label="Member Since (Read-Only)" 
                name="joinDate" 
                value={user.joinDate} 
                icon={FaCalendarAlt} 
                disabled={true} 
              />
            </div>
            
            <div className='mt-8 pt-8 border-t border-slate-700'>
                <h4 className='text-xl font-semibold text-white mb-4'>Bio/About Me</h4>
                <textarea
                    rows="4"
                    disabled={!isEditing}
                    defaultValue="Dedicated full-stack engineer, specializing in React and distributed systems. Always ready for the next hackathon!"
                    className={`w-full p-4 rounded-xl border-2 transition-all resize-none 
                        ${isEditing 
                            ? 'bg-slate-900 border-cyan-500/30 text-white focus:border-cyan-500'
                            : 'bg-slate-700/50 border-slate-700 text-slate-400 cursor-not-allowed'
                        }`}
                />
            </div>

          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;