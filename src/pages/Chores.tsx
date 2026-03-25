import React, { useState, useEffect } from "react";
import { 
  CheckSquare, 
  Plus, 
  Calendar, 
  User, 
  CheckCircle2, 
  Clock,
  RotateCcw,
  MoreVertical,
  ArrowRight
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface Chore {
  id: number;
  category: string;
  title: string;
  assignee: string;
  status: string;
  color: string;
}

const Chores: React.FC = () => {
  const { user } = useAuth();
  const [chores, setChores] = useState<Chore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.groupId) {
      fetch(`/api/chores?groupId=${user.groupId}`)
        .then(res => res.json())
        .then(data => {
          setChores(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.groupId]);

  const categories = ["All", "Kitchen", "Common Area", "Essentials", "Waste"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredChores = activeCategory === "All" 
    ? chores 
    : chores.filter(c => c.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Chore Divider</h2>
          <p className="text-slate-500 font-medium">Fair task rotation for a cleaner shared space.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white text-slate-900 px-4 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <RotateCcw className="w-4 h-4" />
            Rotate Tasks
          </button>
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            Add Task
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
              activeCategory === cat
                ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                : "bg-white text-slate-500 border border-slate-100 hover:border-slate-300"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400 font-medium">Loading chores...</div>
        ) : filteredChores.map((chore, idx) => (
          <motion.div
            key={chore.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
          >
            <div className={cn(
              "absolute top-0 left-0 w-full h-1.5",
              chore.color === "blue" ? "bg-blue-500" : 
              chore.color === "green" ? "bg-emerald-500" : 
              chore.color === "orange" ? "bg-orange-500" : "bg-slate-400"
            )} />
            
            <div className="flex items-start justify-between mb-6">
              <div className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                chore.color === "blue" ? "bg-blue-50 text-blue-600" : 
                chore.color === "green" ? "bg-emerald-50 text-emerald-600" : 
                chore.color === "orange" ? "bg-orange-50 text-orange-600" : "bg-slate-50 text-slate-600"
              )}>
                {chore.category}
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-900 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-primary transition-colors">{chore.title}</h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-white shadow-sm">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chore.assignee}`} alt={chore.assignee} />
                </div>
                <div>
                  <p className="text-slate-900 font-bold text-xs">{chore.assignee}</p>
                  <p className="text-slate-400 text-[10px] font-medium">Assignee</p>
                </div>
              </div>
              
              <button className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                chore.status === "Done" 
                  ? "bg-emerald-50 text-emerald-600" 
                  : "bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary"
              )}>
                {chore.status === "Done" ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                {chore.status === "Done" ? "Completed" : "Mark Done"}
              </button>
            </div>
          </motion.div>
        ))}

        {/* Add New Chore Card */}
        <button className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-primary hover:bg-primary/5 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:scale-110 transition-all shadow-sm">
            <Plus className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-slate-900 font-bold">Add New Task</p>
            <p className="text-slate-400 text-sm">Assign a new chore to the group</p>
          </div>
        </button>
      </div>

      {/* Schedule Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-48 -mt-48" />
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-primary font-bold text-sm mb-6">
              <Calendar className="w-4 h-4" />
              Weekly Rotation Schedule
            </div>
            <h2 className="text-4xl font-extrabold mb-6">Keep the peace with automated rotations.</h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Our smart algorithm ensures everyone does their fair share. Tasks rotate every Sunday at 10:00 PM.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img key={i} className="w-12 h-12 rounded-full border-4 border-slate-900" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User" />
                ))}
              </div>
              <p className="text-slate-300 font-medium">Next rotation in <span className="text-white font-bold">3 days, 14 hours</span></p>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 w-full lg:w-96">
            <h4 className="text-xl font-bold mb-6">Upcoming Rotation</h4>
            <div className="space-y-4">
              {[
                { task: "Kitchen Duty", from: "Kairavi", to: "Riya" },
                { task: "Waste Mgmt", from: "Riya", to: "Aman" },
                { task: "Common Area", from: "Aman", to: "Siddharth" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{item.task}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{item.from}</span>
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span className="text-sm font-bold text-primary">{item.to}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Chores;
