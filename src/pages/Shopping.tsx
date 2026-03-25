import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  CheckCircle2, 
  Circle,
  Clock,
  User,
  Trash2,
  Tag,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";

interface ShoppingItem {
  id: number;
  name: string;
  addedBy: string;
  time: string;
  category: string;
  completed: boolean;
  groupId: number;
}

const socket = io();

const Shopping: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.groupId) {
      fetch(`/api/shopping?groupId=${user.groupId}`)
        .then(res => res.json())
        .then(data => {
          setItems(data);
          setLoading(false);
        });

      socket.on("shopping:updated", (updatedItems: ShoppingItem[]) => {
        // Filter for current group on client side as well for safety
        setItems(updatedItems.filter(i => i.groupId === user.groupId));
      });
    } else {
      setLoading(false);
    }

    return () => {
      socket.off("shopping:updated");
    };
  }, [user?.groupId]);

  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !user?.groupId) return;

    const newItem = {
      name: newItemName,
      addedBy: user.name,
      category: "Groceries",
      groupId: user.groupId
    };

    await fetch("/api/shopping", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    setNewItemName("");
  };

  const toggleItem = async (id: number, completed: boolean) => {
    await fetch(`/api/shopping/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !completed })
    });
  };

  const categories = ["All", "Groceries", "Household", "Personal", "Other"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredItems = activeCategory === "All" 
    ? items 
    : items.filter(i => i.category === activeCategory);

  const pendingItems = filteredItems.filter(i => !i.completed);
  const completedItems = filteredItems.filter(i => i.completed);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Shared Shopping List</h2>
          <p className="text-slate-500 font-medium">Real-time coordination for household essentials.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Live Sync Active
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main List Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Item Input */}
          <form onSubmit={addItem} className="relative group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Plus className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <input 
              type="text" 
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder="Add item to list (e.g. 2L Milk, Detergent...)" 
              className="w-full pl-14 pr-32 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium placeholder:text-slate-400"
            />
            <button 
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Add Item
            </button>
          </form>

          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap",
                  activeCategory === cat
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white text-slate-500 border border-slate-100 hover:border-slate-300"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Sections */}
          <div className="space-y-8">
            {/* Pending Items */}
            <section>
              <div className="flex items-center justify-between mb-4 px-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">To Buy ({pendingItems.length})</h3>
              </div>
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {pendingItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all"
                    >
                      <button 
                        onClick={() => toggleItem(item.id, item.completed)}
                        className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center text-slate-200 hover:border-primary hover:text-primary transition-all"
                      >
                        <Circle className="w-5 h-5" />
                      </button>
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900">{item.name}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                            <User className="w-3 h-3" /> {item.addedBy}
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                            <Clock className="w-3 h-3" /> {item.time}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded-md">
                            <Tag className="w-2.5 h-2.5" /> {item.category}
                          </span>
                        </div>
                      </div>
                      <button className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {pendingItems.length === 0 && !loading && (
                  <div className="text-center py-12 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                    <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 font-bold">Your list is empty!</p>
                    <p className="text-slate-400 text-sm">Add items above to start shopping.</p>
                  </div>
                )}
              </div>
            </section>

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4 px-4">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recently Bought ({completedItems.length})</h3>
                  <button className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Clear All</button>
                </div>
                <div className="space-y-3 opacity-60">
                  {completedItems.map((item) => (
                    <div key={item.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center gap-4">
                      <button 
                        onClick={() => toggleItem(item.id, item.completed)}
                        className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                      <div className="flex-1">
                        <h4 className="text-base font-bold text-slate-500 line-through">{item.name}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Shopping Stats */}
          <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -mr-16 -mt-16" />
            <h3 className="text-xl font-bold mb-6">Shopping Summary</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Items Pending</span>
                <span className="text-2xl font-extrabold">{pendingItems.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Estimated Cost</span>
                <span className="text-2xl font-extrabold">₹1,450</span>
              </div>
              <div className="h-px bg-white/10" />
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <img key={i} className="w-8 h-8 rounded-full border-2 border-slate-900" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 20}`} alt="User" />
                  ))}
                </div>
                <p className="text-xs text-slate-400 font-medium">3 roommates are active</p>
              </div>
            </div>
          </section>

          {/* Quick Add Categories */}
          <section className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Quick Add</h3>
            <div className="grid grid-cols-2 gap-3">
              {["Milk", "Bread", "Eggs", "Water", "Soap", "Tissue"].map((item) => (
                <button 
                  key={item}
                  onClick={() => {
                    setNewItemName(item);
                  }}
                  className="p-3 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
                >
                  + {item}
                </button>
              ))}
            </div>
          </section>

          {/* Store Finder */}
          <section className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-white/30 transition-colors" />
            <Search className="w-8 h-8 mb-4" />
            <h4 className="text-xl font-bold mb-2">Nearby Stores</h4>
            <p className="text-blue-100 text-sm leading-relaxed mb-6">Find the nearest grocery stores and pharmacies.</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-xl text-sm font-bold transition-all">
              Open Maps
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Shopping;
