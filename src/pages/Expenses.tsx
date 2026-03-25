import React, { useState, useEffect } from "react";
import { 
  Receipt, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  Clock
} from "lucide-react";
import { motion } from "motion/react";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface Expense {
  id: number;
  name: string;
  amount: number;
  date: string;
  status: string;
  participants: number;
}

const Expenses: React.FC = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.groupId) {
      fetch(`/api/expenses?groupId=${user.groupId}`)
        .then(res => res.json())
        .then(data => {
          setExpenses(data);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user?.groupId]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Split Expenses</h2>
          <p className="text-slate-500 font-medium">Track, split, and settle group bills effortlessly.</p>
        </div>
        <button className="bg-primary text-white px-6 py-3 rounded-2xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Add New Bill
        </button>
      </div>

      {/* Expense List */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900">Recent Transactions</h3>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search bills..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
              />
            </div>
            <button className="p-2 bg-slate-50 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Bill Name</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Participants</th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-12 text-center text-slate-400 font-medium">Loading transactions...</td>
                </tr>
              ) : expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Receipt className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">{expense.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-extrabold text-slate-900">₹{expense.amount.toLocaleString()}</td>
                  <td className="px-8 py-5 text-slate-500 text-sm font-medium">{expense.date}</td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      expense.status === "Settled" ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                    )}>
                      {expense.status === "Settled" ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {expense.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex -space-x-2">
                      {Array.from({ length: Math.min(expense.participants, 3) }).map((_, i) => (
                        <img key={i} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + expense.id}`} alt="User" />
                      ))}
                      {expense.participants > 3 && (
                        <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                          +{expense.participants - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-slate-500 text-sm font-medium">Showing {expenses.length} transactions</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all disabled:opacity-50" disabled>Previous</button>
            <button className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Expenses;
