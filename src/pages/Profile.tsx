import React, { useState } from "react";
import { User, Mail, Home, Shield, Camera, Save, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    room: user?.room || "",
  });

  const handleSave = () => {
    // In a real app, we would call an API here
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-500"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Your Profile</h2>
          <p className="text-slate-500 font-medium">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-xl overflow-hidden mx-auto">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || "User"}`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{user?.name || "User"}</h3>
            <p className="text-slate-500 font-medium mb-6">{user?.email || "user@example.com"}</p>
            
            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl text-slate-600 font-bold text-sm mb-8">
              <Home className="w-4 h-4 text-primary" />
              {user?.room ? `Room ${user.room}` : "No Room Assigned"}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-bold text-slate-700">Account Status</span>
                </div>
                <span className="text-xs font-black text-emerald-600 uppercase tracking-wider">Verified</span>
              </div>
            </div>
          </section>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
              <button 
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                className={cn(
                  "px-6 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                  isEditing ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                ) : "Edit Profile"}
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="email" 
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Room Number</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    disabled={!isEditing}
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium disabled:opacity-60"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="font-bold text-slate-900 mb-2">Security Tip</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                Keep your profile information up to date to ensure you receive important notifications about your shared space and expenses.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
