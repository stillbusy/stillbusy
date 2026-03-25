import React from "react";
import { 
  Flame, 
  Utensils, 
  ShoppingCart, 
  TrendingDown, 
  Calendar,
  Plus,
  ChevronRight,
  Clock,
  Zap,
  Info
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";

const SurvivalMode: React.FC = () => {
  const mealPlan = [
    { day: "Monday", breakfast: "Oats & Fruit", lunch: "Dal Chawal", dinner: "Veg Pulao", cost: "₹80" },
    { day: "Tuesday", breakfast: "Poha", lunch: "Roti Sabzi", dinner: "Khichdi", cost: "₹65" },
    { day: "Wednesday", breakfast: "Toast & Tea", lunch: "Rajma Chawal", dinner: "Egg Curry", cost: "₹95" },
  ];

  const inventory = [
    { item: "Rice", qty: "2.5 kg", status: "Good", color: "bg-emerald-500" },
    { item: "Dal (Moong)", qty: "0.5 kg", status: "Low", color: "bg-orange-500" },
    { item: "Cooking Oil", qty: "200 ml", status: "Critical", color: "bg-red-500" },
    { item: "Onions", qty: "1.2 kg", status: "Good", color: "bg-emerald-500" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full text-primary font-bold text-xs mb-2">
            <Zap className="w-3 h-3" />
            END-OF-MONTH MODE ACTIVE
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Survival Mode</h2>
          <p className="text-slate-500 font-medium">Budget meal planning and inventory management for the broke days.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-5 h-5" />
            New Plan
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Meal Planner */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Utensils className="text-primary w-6 h-6" />
                Budget Meal Plan
              </h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-slate-900 transition-colors">
                  <Calendar className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {mealPlan.map((meal, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-4 p-6 rounded-3xl bg-slate-50 hover:bg-slate-100 transition-all group">
                  <div className="sm:col-span-1">
                    <p className="text-lg font-black text-slate-900">{meal.day}</p>
                  </div>
                  <div className="sm:col-span-4 grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Breakfast</p>
                      <p className="text-sm font-bold text-slate-700">{meal.breakfast}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lunch</p>
                      <p className="text-sm font-bold text-slate-700">{meal.lunch}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dinner</p>
                      <p className="text-sm font-bold text-slate-700">{meal.dinner}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full mt-8 py-4 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              Generate Smart Budget Plan
              <ChevronRight className="w-5 h-5" />
            </button>
          </section>

          {/* Savings Insight */}
          <section className="bg-emerald-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center shrink-0">
                <TrendingDown className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">You saved ₹450 this week!</h3>
                <p className="text-emerald-100 leading-relaxed">
                  By following the budget meal plan, you've reduced your food expenses by 15% compared to last week.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Inventory Sidebar */}
        <div className="space-y-8">
          {/* Inventory Tracker */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Inventory</h3>
              <button className="text-primary font-bold text-sm hover:underline">Edit</button>
            </div>
            <div className="space-y-6">
              {inventory.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700">{item.item}</span>
                    <span className="text-xs font-bold text-slate-400">{item.qty}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.status === "Good" ? "80%" : item.status === "Low" ? "30%" : "10%" }}
                      className={cn("h-full rounded-full", item.color)} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={cn("text-[10px] font-bold uppercase tracking-wider", 
                      item.status === "Good" ? "text-emerald-500" : item.status === "Low" ? "text-orange-500" : "text-red-500"
                    )}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-sm hover:border-primary hover:text-primary transition-all">
              + Update Inventory
            </button>
          </section>

          {/* Survival Tip */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
            <Info className="text-primary w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold mb-2">Pro Survival Tip</h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              Buying staples like rice and dal in bulk can save you up to 25% on your monthly grocery bill.
            </p>
          </section>

          {/* Grocery List Link */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm group cursor-pointer hover:border-primary transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <ShoppingCart className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Shopping List</h4>
                  <p className="text-slate-400 text-xs font-medium">8 items pending</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-primary transition-all" />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SurvivalMode;
