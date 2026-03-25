import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  Users, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Flame
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [members, setMembers] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [chores, setChores] = useState<any[]>([]);
  const [shoppingItems, setShoppingItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.groupId) {
      const fetchData = async () => {
        try {
          const [membersRes, expensesRes, choresRes, shoppingRes] = await Promise.all([
            fetch(`/api/groups/${user.groupId}/members`),
            fetch(`/api/expenses?groupId=${user.groupId}`),
            fetch(`/api/chores?groupId=${user.groupId}`),
            fetch(`/api/shopping?groupId=${user.groupId}`)
          ]);

          const [membersData, expensesData, choresData, shoppingData] = await Promise.all([
            membersRes.json(),
            expensesRes.json(),
            choresRes.json(),
            shoppingRes.json()
          ]);

          setMembers(membersData);
          setExpenses(expensesData);
          setChores(choresData);
          setShoppingItems(shoppingData);
        } catch (err) {
          console.error("Error fetching dashboard data:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [user?.groupId]);

  const totalSpend = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const activeChoresCount = chores.filter(c => c.status !== "Done").length;
  const pendingShoppingCount = shoppingItems.filter(i => !i.completed).length;

  const stats = [
    { label: "Total Group Spend", value: `₹${totalSpend.toLocaleString()}`, change: "0%", trend: "neutral", color: "text-orange-600", bg: "bg-orange-50", path: "/expenses" },
    { label: "Your Pending Dues", value: "₹0", change: "0%", trend: "neutral", color: "text-blue-600", bg: "bg-blue-50", path: "/expenses" },
    { label: "Active Chores", value: activeChoresCount.toString(), change: "0", trend: "neutral", color: "text-emerald-600", bg: "bg-emerald-50", path: "/chores" },
    { label: "Shopping Items", value: pendingShoppingCount.toString(), change: "0", trend: "neutral", color: "text-purple-600", bg: "bg-purple-50", path: "/shopping" },
  ];

  const recentActivities = expenses.slice(0, 3).map(exp => ({
    id: exp.id,
    user: exp.addedBy || "Someone",
    action: `added expense '${exp.name}'`,
    amount: `₹${exp.amount}`,
    time: "Recently",
    avatar: exp.addedBy || "User"
  }));

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Welcome back, {user?.name || "User"}! 👋</h2>
          <p className="text-slate-500 font-medium">Here's what's happening in {user?.room ? `Room ${user.room}` : "your space"} today.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate("/settings")}
            className="bg-white text-slate-900 px-4 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Users className="w-4 h-4" />
            Manage Group
          </button>
          <button 
            onClick={() => navigate("/expenses")}
            className="bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Expense
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => navigate(stat.path)}
            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-3 rounded-2xl transition-colors group-hover:bg-primary/10", stat.bg)}>
                <TrendingUp className={cn("w-6 h-6", stat.color)} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full",
                stat.trend === "up" ? "bg-red-50 text-red-600" : stat.trend === "down" ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-600"
              )}>
                {stat.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : stat.trend === "down" ? <ArrowDownRight className="w-3 h-3" /> : null}
                {stat.change}
              </div>
            </div>
            <p className="text-slate-500 text-sm font-semibold mb-1">{stat.label}</p>
            <h3 className="text-2xl font-extrabold text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Recent Activity */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Recent Activity</h3>
              <button 
                onClick={() => navigate("/expenses")}
                className="text-primary font-bold text-sm hover:underline cursor-pointer"
              >
                View All
              </button>
            </div>
            <div className="space-y-6">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${activity.user}`} alt={activity.user} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 font-bold">
                      {activity.user} <span className="text-slate-500 font-medium">{activity.action}</span>
                    </p>
                    <p className="text-slate-400 text-xs font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" /> {activity.time}
                    </p>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="text-slate-900 font-extrabold">{activity.amount}</p>
                      <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-wider">Settled</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div 
              onClick={() => navigate("/emergency")}
              className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />
              <AlertCircle className="text-primary w-8 h-8 mb-6" />
              <h4 className="text-xl font-bold mb-2">Emergency Mode</h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">Quick access to local help and emergency contacts.</p>
              <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                Open Help Center
              </button>
            </div>
            <div 
              onClick={() => navigate("/survival")}
              className="bg-primary rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/30 transition-colors" />
              <Flame className="text-white w-8 h-8 mb-6" />
              <h4 className="text-xl font-bold mb-2">Survival Mode</h4>
              <p className="text-white/80 text-sm leading-relaxed mb-6">Budget meal planner and inventory tracker.</p>
              <button className="bg-black/20 hover:bg-black/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer">
                Plan Meals
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Pending Chores */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Your Chores</h3>
            <div className="space-y-4">
              {chores.filter(c => c.assignee === user?.name && c.status !== "Done").slice(0, 3).map((chore, idx) => (
                <div 
                  key={idx} 
                  onClick={() => navigate("/chores")}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group"
                >
                  <div className={cn("w-2 h-10 rounded-full", chore.color === "blue" ? "bg-blue-500" : chore.color === "green" ? "bg-emerald-500" : "bg-orange-500")} />
                  <div className="flex-1">
                    <p className="text-slate-900 font-bold text-sm">{chore.title}</p>
                    <p className="text-slate-500 text-xs font-medium">{chore.category}</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-primary transition-colors">
                    <div className="w-3 h-3 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {chores.filter(c => c.assignee === user?.name && c.status !== "Done").length === 0 && (
                <p className="text-slate-400 text-sm font-medium text-center py-4">No pending chores for you! 🎉</p>
              )}
            </div>
            <button 
              onClick={() => navigate("/chores")}
              className="w-full mt-6 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
            >
              + View All Chores
            </button>
          </section>

          {/* Group Members */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Roommates</h3>
            <div className="space-y-4">
              {members.map((member, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border-2 border-white shadow-sm">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} alt={member.name} />
                    </div>
                    <div className={cn(
                      "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                      "bg-emerald-500" // Assume online for demo
                    )} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-sm">{member.name}</p>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Online</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
