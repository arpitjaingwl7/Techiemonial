import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  CreditCard, 
  ShieldCheck, 
  Star,
  IndianRupee 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

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

// --- Pricing Data (Updated to ₹20 and ₹30) ---
const plans = [
  {
    id: "silver",
    name: "Silver Dev",
    icon: Zap,
    // UPDATED: Extremely low cost pricing (20/month)
    price: { monthly: 20, yearly: 200 }, 
    description: "Level up your networking game.",
    features: [
      "Unlimited Swipes",
      "See who liked you",
      "5 Super Requests per day",
      "Verified 'Silver' Badge",
      "Ad-free experience"
    ],
    color: "from-slate-400 to-slate-200",
    shadow: "shadow-slate-500/20",
    buttonColor: "bg-slate-700 hover:bg-slate-600",
    popular: false
  },
  {
    id: "gold",
    name: "Gold 10x",
    icon: Crown,
    // UPDATED: Adjusted to 30/month
    price: { monthly: 30, yearly: 300 }, 
    description: "For developers who want to dominate.",
    features: [
      "Everything in Silver",
      "Priority Profile Listing",
      "Unlimited Super Requests",
      "Exclusive '10x' Gold Badge",
      "Direct Message without matching",
      "Access to Senior Mentors"
    ],
    color: "from-yellow-400 to-amber-600",
    shadow: "shadow-yellow-500/20",
    buttonColor: "bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500",
    popular: true
  }
];

// --- Card Component ---
const PricingCard = ({ plan, billingCycle, onSelect }) => {
  const isYearly = billingCycle === "yearly";
  const currentPrice = isYearly ? plan.price.yearly : plan.price.monthly;
  
  // Calculate savings
  const savings = isYearly ? "Save 17%" : "";

  return (
    <motion.div
      whileHover={{ y: -10 }}
      className={`relative p-8 rounded-3xl border flex flex-col h-full backdrop-blur-xl transition-all duration-300
        ${plan.popular 
          ? "bg-slate-900/80 border-yellow-500/50 shadow-2xl shadow-yellow-500/10" 
          : "bg-slate-900/40 border-slate-700/50 shadow-xl"
        }`}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
          <Star size={10} fill="currentColor" /> Most Popular
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${plan.color} text-black shadow-lg`}>
          <plan.icon size={24} fill="currentColor" className="text-white mix-blend-hard-light" />
        </div>
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
        <p className="text-slate-400 text-sm mt-2">{plan.description}</p>
      </div>

      {/* Price Section */}
      <div className="mb-6">
        <div className="flex items-end gap-1">
          {/* Rupee Symbol */}
          <span className="text-4xl font-black text-white flex items-center">
            <span className="text-2xl mr-1 font-sans">₹</span>
            {currentPrice}
          </span>
          <span className="text-slate-500 mb-1">/{isYearly ? "year" : "mo"}</span>
        </div>
        {isYearly && <p className="text-green-400 text-xs font-bold mt-1">{savings}</p>}
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-6" />

      {/* Features */}
      <ul className="space-y-4 flex-grow mb-8">
        {plan.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
            <Check size={16} className={`mt-0.5 ${plan.popular ? "text-yellow-400" : "text-cyan-400"}`} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onSelect(plan)}
        className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${plan.buttonColor}`}
      >
        <CreditCard size={18} />
        {plan.popular ? "Get Gold Access" : "Go Silver"}
      </motion.button>
    </motion.div>
  );
};

// --- Main Page ---
const PaymentPage = () => {

  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();

  const handlePurchase =async (plan) => {
  
    // console.log("plan",plan)

    const membershipType=plan.id
       
    try {
        const order= await axios.post(BASE_URL+"/payment/create",{
            "membershipType":billingCycle=="monthly"?membershipType:membershipType+"Yearly"
        },{withCredentials:true})
        console.log(order)

        const{key_id,amount,currency,orderId,notes}=order.data


        const options = {
        key: key_id, // Replace with your Razorpay key_id
        amount, // Amount is in currency subunits.
        currency,
        name: "TechieMonial",
    
        order_id: orderId, // This is the order_id created in the backend
        // Your success URL
        prefill: {
          name: notes.firstName+ " "+notes.lastName,
          
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
      };


        const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
        console.log(error)
    }
    
  };

  return (
    <AuroraBackground>
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col items-center">
        
        {/* Header */}
        <div className="text-center max-w-2xl mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 mb-6">
            Upgrade Your Stack
          </h1>
          <p className="text-slate-400 text-lg">
            Unlock premium features to find your dream team, mentor, or co-founder faster.
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-4 mb-16 bg-slate-900/50 p-1.5 rounded-full border border-slate-700/50 backdrop-blur-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              billingCycle === "monthly" 
                ? "bg-slate-700 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${
              billingCycle === "yearly" 
                ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md" 
                : "text-slate-400 hover:text-white"
            }`}
          >
            Yearly <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded text-white">SAVE 17%</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
          {plans.map((plan) => (
            <PricingCard 
              key={plan.id} 
              plan={plan} 
              billingCycle={billingCycle} 
              onSelect={handlePurchase}
            />
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-16 flex items-center justify-center gap-2 text-slate-500 text-sm">
          <ShieldCheck size={16} />
          <span>Secure payments via Razorpay </span>
        </div>

      </div>
    </AuroraBackground>
  );
};

export default PaymentPage;