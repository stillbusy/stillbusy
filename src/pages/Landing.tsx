import React from "react";
import { Link } from "react-router-dom";
import { 
  Flame, 
  ArrowRight, 
  Shield, 
  Users, 
  Zap, 
  Heart,
  Receipt,
  CheckSquare,
  ShoppingCart,
  PhoneCall
} from "lucide-react";
import { motion } from "motion/react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Flame className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-900">SurviveSpace</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-slate-600 font-medium hover:text-primary transition-colors">Features</a>
          <a href="#about" className="text-slate-600 font-medium hover:text-primary transition-colors">About</a>
          <Link to="/login" className="text-slate-900 font-bold hover:text-primary transition-colors">Login</Link>
          <Link to="/signup" className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-bold text-sm mb-6">
            <Zap className="w-4 h-4" />
            Voted #1 App for Independent Living
          </div>
          <h1 className="text-6xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-8">
            Survive <span className="text-primary italic">Shared</span> Living with Ease.
          </h1>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
            The ultimate survival system for students and professionals in PGs or hostels. 
            Manage expenses, chores, and emergencies without the drama.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/signup" className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-2xl shadow-primary/30 flex items-center justify-center gap-2 group">
              Start Your Survival Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all border border-slate-200 flex items-center justify-center">
              View Demo
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <img key={i} className="w-12 h-12 rounded-full border-4 border-white" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} alt="User" />
              ))}
            </div>
            <p className="text-slate-500 font-medium">
              Joined by <span className="text-slate-900 font-bold">10,000+</span> survivors
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="relative bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-8 border-slate-800">
            <img 
              src="https://picsum.photos/seed/app-preview/800/1200" 
              alt="App UI" 
              className="rounded-[2rem] w-full h-auto object-cover aspect-[9/16]"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="features" className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-slate-900 mb-6">Everything You Need to Thrive</h2>
            <p className="text-lg text-slate-600">Built for the chaos of shared living. We handle the boring stuff so you can focus on living your best life.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Split Expenses", desc: "No more awkward money talks. Track and settle bills instantly.", icon: Receipt, color: "bg-orange-500" },
              { title: "Chore Divider", desc: "Fair task rotation. Keep your space clean without the arguments.", icon: CheckSquare, color: "bg-blue-500" },
              { title: "Survival Mode", desc: "Budget meal planning and inventory tracking for the broke days.", icon: Flame, color: "bg-red-500" },
              { title: "Emergency Help", desc: "One-tap access to local help, hospitals, and emergency contacts.", icon: PhoneCall, color: "bg-emerald-500" }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100"
              >
                <div className={`${feature.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-${feature.color.split('-')[1]}-200`}>
                  <feature.icon className="text-white w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-slate-900 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight">
                Stop Surviving, <br />
                <span className="text-primary">Start Thriving.</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Join thousands of students and young professionals who have transformed their shared living experience. 
                Less drama, more community.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/signup" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all">
                  Join the Community
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                <Users className="text-primary w-8 h-8 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">10k+</div>
                <div className="text-slate-400 font-medium">Active Users</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                <Shield className="text-blue-400 w-8 h-8 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">99%</div>
                <div className="text-slate-400 font-medium">Safety Rating</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                <Heart className="text-red-400 w-8 h-8 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
                <div className="text-slate-400 font-medium">User Satisfaction</div>
              </div>
              <div className="bg-white/5 backdrop-blur-lg p-8 rounded-3xl border border-white/10">
                <Zap className="text-yellow-400 w-8 h-8 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">24/7</div>
                <div className="text-slate-400 font-medium">Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Flame className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">SurviveSpace</span>
          </div>
          <div className="flex items-center gap-8 text-slate-500 font-medium">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Contact Us</a>
          </div>
          <p className="text-slate-400">© 2023 SurviveSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
