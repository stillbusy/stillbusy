import React from "react";
import { 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  Stethoscope, 
  Flame,
  ChevronRight,
  ExternalLink,
  Search,
  MessageSquare,
  Tag,
  Shield as Police
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const Emergency: React.FC = () => {
  const emergencyContacts = [
    { name: "Police", number: "100", icon: ShieldAlert, color: "bg-blue-500" },
    { name: "Ambulance", number: "102", icon: Stethoscope, color: "bg-red-500" },
    { name: "Fire Brigade", number: "101", icon: Flame, color: "bg-orange-500" },
    { name: "Women Helpline", number: "1091", icon: PhoneCall, color: "bg-purple-500" },
  ];

  const nearbyFacilities = [
    { name: "City Hospital", distance: "0.8 km", type: "Hospital", status: "Open 24/7", phone: "+91 98765 43210" },
    { name: "Apollo Pharmacy", distance: "0.3 km", type: "Pharmacy", status: "Open Now", phone: "+91 98765 43211" },
    { name: "Central Police Station", distance: "1.2 km", type: "Police", status: "Open 24/7", phone: "+91 98765 43212" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Emergency Help Center</h2>
          <p className="text-slate-500 font-medium">Quick access to help when you need it most.</p>
        </div>
        <button className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-red-700 transition-all flex items-center gap-3 shadow-xl shadow-red-200 animate-pulse">
          <ShieldAlert className="w-6 h-6" />
          SOS EMERGENCY
        </button>
      </div>

      {/* Quick Dial Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {emergencyContacts.map((contact, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center text-center group cursor-pointer"
          >
            <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110", contact.color)}>
              <contact.icon className="text-white w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{contact.name}</h3>
            <p className="text-2xl font-black text-slate-900 tracking-tighter">{contact.number}</p>
            <button className="mt-4 text-xs font-bold text-primary uppercase tracking-wider hover:underline">Call Now</button>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Nearby Facilities */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Nearby Facilities</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search hospitals..." 
                  className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
                />
              </div>
            </div>
            <div className="space-y-4">
              {nearbyFacilities.map((facility, idx) => (
                <div key={idx} className="flex items-center gap-6 p-6 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 shadow-sm">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-slate-900">{facility.name}</h4>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                        {facility.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {facility.distance}</span>
                      <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {facility.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 bg-white rounded-xl text-slate-600 hover:text-primary hover:shadow-md transition-all">
                      <PhoneCall className="w-5 h-5" />
                    </button>
                    <button className="p-3 bg-white rounded-xl text-slate-600 hover:text-primary hover:shadow-md transition-all">
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold hover:border-primary hover:text-primary transition-all">
              View All Facilities on Map
            </button>
          </section>

          {/* Safety Tips */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <h3 className="text-xl font-bold mb-8">Safety & Survival Tips</h3>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                "Keep emergency numbers on speed dial.",
                "Share your live location with roommates when out late.",
                "Know the nearest 24/7 pharmacy location.",
                "Keep a basic first-aid kit in your room."
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Roommate Status */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Roommate Status</h3>
            <div className="space-y-4">
              {[
                { name: "Riya Sharma", status: "At Home", avatar: "Riya", color: "text-emerald-500" },
                { name: "Aman Gupta", status: "Out (College)", avatar: "Aman", color: "text-orange-500" },
                { name: "Siddharth V.", status: "At Home", avatar: "Siddharth", color: "text-emerald-500" },
              ].map((member, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.avatar}`} alt={member.name} />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm">{member.name}</p>
                      <p className={cn("text-[10px] font-bold uppercase tracking-wider", member.color)}>{member.status}</p>
                    </div>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-primary transition-colors">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Local Police Contact */}
          <section className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/30 transition-colors" />
            <ShieldAlert className="w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold mb-2">Local Police Station</h4>
            <p className="text-white/80 text-sm leading-relaxed mb-6">Sector 62 Police Chowki, Noida</p>
            <div className="space-y-3">
              <button className="w-full bg-white text-primary py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <PhoneCall className="w-4 h-4" />
                0120-2400100
              </button>
              <button className="w-full bg-black/20 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                Get Directions
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Emergency;
