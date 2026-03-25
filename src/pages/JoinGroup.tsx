import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Users, Plus, LogIn, ArrowRight, Home } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const JoinGroup: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"select" | "join" | "create">("select");
  const [groupName, setGroupName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, name: groupName, room: roomNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        navigate("/dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create group");
    }
  };

  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user?.id, code: groupCode, room: roomNumber }),
      });
      const data = await res.json();
      if (res.ok) {
        updateUser(data.user);
        navigate("/dashboard");
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to join group");
    }
  };

  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">One last step! 🚀</h1>
          <p className="text-slate-500 font-medium text-lg">
            SurviveSpace works best with roommates. Join an existing group or start a new one.
          </p>
        </div>

        {mode === "select" && (
          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={() => setMode("create")}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary transition-all text-left group shadow-xl shadow-slate-200/50"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary transition-colors">
                <Plus className="text-primary w-8 h-8 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Create Group</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Start a new shared space and invite your roommates.</p>
              <div className="flex items-center text-primary font-bold text-sm">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </button>

            <button 
              onClick={() => setMode("join")}
              className="bg-white p-8 rounded-[2.5rem] border-2 border-slate-100 hover:border-primary transition-all text-left group shadow-xl shadow-slate-200/50"
            >
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                <LogIn className="text-blue-600 w-8 h-8 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Join Group</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">Already have a group code? Enter it here to join.</p>
              <div className="flex items-center text-blue-600 font-bold text-sm">
                Enter Code <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </button>
          </div>
        )}

        {(mode === "create" || mode === "join") && (
          <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
            <button 
              onClick={() => { setMode("select"); setError(""); }}
              className="text-slate-400 font-bold text-sm mb-6 flex items-center hover:text-slate-600 transition-colors"
            >
              ← Back to selection
            </button>
            
            <h2 className="text-2xl font-extrabold text-slate-900 mb-6">
              {mode === "create" ? "Start a New Group" : "Join Existing Group"}
            </h2>

            <form onSubmit={mode === "create" ? handleCreateGroup : handleJoinGroup} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-sm font-bold border border-red-100">
                  {error}
                </div>
              )}

              {mode === "create" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Group Name</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="e.g. The Dream Team"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {mode === "join" && (
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Group Code</label>
                  <div className="relative">
                    <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      required
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      placeholder="e.g. ROOM302"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium uppercase"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Your Room/Unit Number</label>
                <div className="relative">
                  <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text" 
                    required
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g. 302"
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                {mode === "create" ? "Create Group" : "Join Group"}
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default JoinGroup;
