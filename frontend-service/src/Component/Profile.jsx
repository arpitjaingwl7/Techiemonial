import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../utils/constants.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Briefcase, 
  Calendar, 
  Save, 
  X, 
  Camera, 
  Code,
  Edit3,
  Loader2,
  Sparkles
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../userSlice"; 

// --- Aesthetic Background ---
const AuroraBackground = ({ children }) => (
  <div className="relative min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px]" />
    </div>
    <div className="relative z-10 w-full min-h-screen flex flex-col">{children}</div>
  </div>
);

const ProfilePage = () => {
  const dispatch = useDispatch();
  
  // Get user from Redux store
  const user = useSelector((state) => state.userData.user);

  // Local state for form (Initialize with Redux data or defaults)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    gender: "",
    designation: "",
    photoUrl: "",
    about: "",
    skills: []
  });

  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [skillInput, setSkillInput] = useState("");

  // Populate form when user data is available
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "", // Kept in state for display, removed before sending
        age: user.age || "",
        gender: user.gender || "",
        designation: user.designation || "Developer",
        photoUrl: user.photoUrl || "",
        about: user.about || "",
        skills: user.skills || []
      });
    }
  }, [user]);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Skill Add (Enter key)
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          skills: [...prev.skills, skillInput.trim()]
        }));
      }
      setSkillInput("");
    }
  };

  // Handle Skill Remove
  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove)
    }));
  };

  // Save Data
  const handleSave = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    try {
      // Destructure email out of formData to avoid sending it to the API
      const { email, ...dataToSend } = formData;

      const res = await axios.patch(
        BASE_URL+"/profile/edit", 
        dataToSend, // Sending only the allowed fields
        { withCredentials: true }
      );
      
      // Update Redux Store with the new data
      dispatch(addUser(res.data.data)); 
      
      setMsg("Profile updated successfully!");
      setTimeout(() => setMsg(""), 3000);
    } catch (error) {
      console.error(error);
      setMsg("Failed to update profile. " + (error.response?.data?.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  // Fallback Image Logic
  const [imgSrc, setImgSrc] = useState(formData.photoUrl);
  useEffect(() => { setImgSrc(formData.photoUrl); }, [formData.photoUrl]);

  return (
    <AuroraBackground>
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600">
            Profile Settings
          </h1>
          <p className="text-slate-400 mt-2">Manage your public persona and coding stats.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Profile Preview Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
                <div className="relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-cyan-900/40 to-purple-900/40 z-0" />
                    
                    {/* Avatar */}
                    <div className="relative z-10 w-32 h-32 mx-auto mt-8 rounded-full p-1 bg-gradient-to-tr from-cyan-400 to-purple-500 shadow-lg shadow-purple-500/30">
                        <img 
                            src={imgSrc || "https://geographyandyou.com/images/user-profile.png"} 
                            onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/initials/svg?seed=${formData.firstName}`; }}
                            alt="Profile" 
                            className="w-full h-full rounded-full object-cover bg-slate-800"
                        />
                        <div className="absolute bottom-0 right-0 p-2 bg-slate-800 rounded-full border border-slate-700 text-cyan-400 cursor-pointer hover:bg-slate-700 transition-colors">
                            <Camera size={16} />
                        </div>
                    </div>

                    <h2 className="relative z-10 mt-4 text-2xl font-bold text-white capitalize">
                        {formData.firstName || "Your"} {formData.lastName || "Name"}
                    </h2>
                    <p className="relative z-10 text-cyan-400 font-medium flex items-center justify-center gap-2 mb-4">
                        <Code size={14} /> {formData.designation || "Developer"}
                    </p>

                    <div className="relative z-10 bg-slate-800/50 rounded-xl p-4 text-left border border-white/5 mb-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">About Me</h4>
                        <p className="text-slate-300 text-sm italic leading-relaxed">
                            "{formData.about || "Write something about yourself..."}"
                        </p>
                    </div>

                     {/* Skills Preview */}
                    <div className="relative z-10 flex flex-wrap justify-center gap-2">
                        {formData.skills.map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-200 text-xs rounded-full border border-purple-500/30">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Edit Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <form onSubmit={handleSave} className="bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
                <div className="flex items-center gap-2 mb-8 pb-4 border-b border-white/10">
                    <Edit3 className="text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Edit Details</h3>
                </div>

                {/* Name Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">First Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="John"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="Doe"
                            />
                        </div>
                    </div>
                </div>

                {/* Email & Designation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2 opacity-70">
                        <label className="text-sm font-medium text-slate-400 ml-1">Email ID (Read Only)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text"
                                value={formData.email}
                                disabled
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-400 cursor-not-allowed"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Designation</label>
                        <div className="relative">
                            <Briefcase className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                                placeholder="Full Stack Developer"
                            />
                        </div>
                    </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Age</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="number"
                                name="age"
                                min="18"
                                max="100"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Gender</label>
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-4 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all appearance-none"
                        >
                            <option value="" disabled>Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>

                {/* Photo URL */}
                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-400 ml-1">Avatar URL</label>
                    <div className="relative">
                        <Camera className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input 
                            type="text"
                            name="photoUrl"
                            value={formData.photoUrl}
                            onChange={handleChange}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* About */}
                <div className="space-y-2 mb-6">
                    <label className="text-sm font-medium text-slate-400 ml-1">About</label>
                    <textarea 
                        name="about"
                        rows="4"
                        value={formData.about}
                        onChange={handleChange}
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                        placeholder="Tell the world about your coding journey..."
                    />
                </div>

                {/* Skills Input */}
                <div className="space-y-2 mb-8">
                    <label className="text-sm font-medium text-slate-400 ml-1">Skills (Press Enter to add)</label>
                    <div className="relative">
                        <Sparkles className="absolute left-4 top-3.5 text-slate-500" size={18} />
                        <input 
                            type="text"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={handleSkillKeyDown}
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                            placeholder="React, Node.js, Python..."
                        />
                    </div>
                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        <AnimatePresence>
                            {formData.skills.map((skill, index) => (
                                <motion.span
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="px-3 py-1.5 bg-slate-800 text-cyan-400 text-sm rounded-lg border border-slate-700 flex items-center gap-2 group hover:border-red-500/50 hover:bg-red-500/10 transition-all"
                                >
                                    {skill}
                                    <button 
                                        type="button" 
                                        onClick={() => removeSkill(skill)}
                                        className="text-slate-500 group-hover:text-red-400"
                                    >
                                        <X size={14} />
                                    </button>
                                </motion.span>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Feedback Message */}
                {msg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-3 rounded-lg text-center mb-6 text-sm font-semibold ${msg.includes("Failed") ? "bg-red-500/20 text-red-300" : "bg-green-500/20 text-green-300"}`}
                    >
                        {msg}
                    </motion.div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        {isLoading ? "Saving..." : "Save Changes"}
                    </motion.button>
                </div>

            </form>
          </motion.div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default ProfilePage;