import React from "react";
import { 
  Users, 
  UserPlus, 
  LogOut, 
  Edit, 
  Shield, 
  MoreVertical, 
  History,
  Info,
  CheckCircle2,
  Clock,
  UserMinus,
  Settings,
  Copy,
  Check
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const GroupSettings: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = React.useState(false);
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (user?.groupId) {
      fetch(`/api/groups/${user.groupId}/members`)
        .then(res => res.json())
        .then(data => {
          setMembers(data);
          setLoading(false);
        });
    }
  }, [user?.groupId]);

  const copyCode = () => {
    // In a real app, we'd fetch the actual group code from the backend
    // For this demo, we'll use a placeholder or the one from the user object if we had it
    navigator.clipboard.writeText("ROOM302"); 
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">My Group Settings</h2>
          <p className="text-slate-500 font-medium">Manage your shared living unit, group members, and invitations.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-red-500 px-4 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-red-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer">
            <LogOut className="w-4 h-4" />
            Leave Group
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer">
            <UserPlus className="w-5 h-5" />
            Invite Member
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Unit Info */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="h-40 bg-slate-200 relative">
              <img 
                src="https://picsum.photos/seed/room/800/400" 
                alt="Room" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-6">
                <p className="text-primary text-[10px] font-bold uppercase tracking-widest mb-1">Unit Assignment</p>
                <h3 className="text-white text-2xl font-black">{user?.room ? `Flat ${user.room}` : "No Unit"}</h3>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm font-medium">Group Name</span>
                  <span className="text-slate-900 font-bold">{user?.room ? `Room ${user.room}` : "The Chill Squad"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm font-medium">Group Code</span>
                  <button 
                    onClick={copyCode}
                    className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-2 py-1 rounded-lg transition-all cursor-pointer"
                  >
                    ROOM302
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm font-medium">Status</span>
                  <span className="flex items-center gap-1.5 text-emerald-600 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-2 py-1 rounded-full">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
              </div>
              <button className="w-full py-3 rounded-2xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Edit className="w-4 h-4" />
                Edit Details
              </button>
            </div>
          </section>

          <section className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <Info className="text-primary w-5 h-5" />
              <h4 className="font-bold text-slate-900">Quick Tip</h4>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Group admins can manage payment splits and approve maintenance requests on behalf of the whole flat.
            </p>
          </section>
        </div>

        {/* Member List */}
        <div className="lg:col-span-2">
          <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Group Members</h3>
              <span className="text-slate-400 text-sm font-medium">{members.length} roommates</span>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Member</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">Loading members...</td>
                    </tr>
                  ) : members.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                          </div>
                          <div>
                            <p className="text-slate-900 font-bold text-sm">{member.name}</p>
                            <p className="text-slate-400 text-[10px] font-medium">Joined Oct 2023</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          member.id === 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
                        )}>
                          {member.id === 1 ? "Admin" : "Member"}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "flex items-center gap-1.5 text-sm font-medium",
                          "text-emerald-600"
                        )}>
                          <div className={cn("w-2 h-2 rounded-full", "bg-emerald-500")} />
                          Active
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        {member.id === 1 ? (
                          <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all cursor-pointer">
                            <Settings className="w-5 h-5" />
                          </button>
                        ) : (
                          <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                            <UserMinus className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-slate-50/50 border-t border-slate-50">
              <button className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold">
                <History className="w-4 h-4" />
                View Group History
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GroupSettings;
