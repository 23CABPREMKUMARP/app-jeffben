"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  Search, 
  Filter, 
  DollarSign, 
  BarChart3, 
  TrendingUp, 
  Package, 
  Trash2, 
  Edit3, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Download,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockPayments = [
  { id: "TX-90231", user: "Prem Kumar", booking: "JEFF-2A5F", amount: "₹ 450", method: "UPI / PhonePe", status: "Success", date: "Today, 10:12 AM" },
  { id: "TX-90232", user: "Senthil Raj", email: "senthil@node.net", amount: "₹ 820", method: "Credit Card", status: "Success", date: "Today, 09:45 AM" },
  { id: "TX-90233", user: "Ananya Devi", booking: "JEFF-7R4X", amount: "₹ 1,200", method: "G-Pay", status: "Refunded", date: "Today, 08:30 AM" },
  { id: "TX-90234", user: "Karthik Raja", booking: "JEFF-1P9Q", amount: "₹ 450", method: "UPI", status: "Success", date: "Yesterday, 11:20 PM" },
  { id: "TX-90235", user: "Meera Nair", booking: "JEFF-4M2L", amount: "₹ 550", method: "Net Banking", status: "Success", date: "Yesterday, 06:15 PM" },
];

export default function AdminPaymentsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Fiscal Matrix</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full" />
            Venture Capital & Transaction Ingress Oversight
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-[20px] font-black text-xs tracking-widest hover:bg-slate-50 transition-all uppercase italic">
             <Download size={18} /> Daily Report
           </button>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic">
             <DollarSign size={20} /> Settlement Engine
           </button>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
           { label: "Net Revenue Today", value: "₹ 48,200", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", change: "+12%" },
           { label: "Success Rate", value: "99.2%", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", change: "Optimal" },
           { label: "Pending Refunds", value: "₹ 2,400", icon: Trash2, color: "text-red-500", bg: "bg-red-50", change: "Action Needed" },
           { label: "Digital Flow", value: "₹ 4.2L", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", change: "Weekly" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                   <stat.icon size={20} />
                </div>
                <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{stat.change}</span>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Transactions by ID, User, or Method Vector..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-emerald-600/5 transition-all"
          />
        </div>
      </div>

      {/* Payments Master Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left font-bold text-sm">
           <thead className="bg-slate-50/50">
              <tr>
                 <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction ID</th>
                 <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Fiscal Asset</th>
                 <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Vector</th>
                 <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Protocol Status</th>
                 <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Gate Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {mockPayments.map((tx, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                           <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 leading-none">{tx.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{tx.date}</p>
                        </div>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                     <div className="space-y-1">
                        <p className="text-base font-black text-slate-900 leading-none">{tx.amount}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{tx.method}</p>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                      <div>
                        <p className="text-sm font-black text-slate-900 leading-none">{tx.user}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                           <Package size={12} className="text-blue-500" />
                           {tx.booking}
                        </p>
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                         tx.status === "Success" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                         <ShieldCheck size={14} className={tx.status === "Success" ? "text-emerald-500" : "text-red-500"} />
                         <span className="text-[9px] font-black uppercase tracking-widest">{tx.status}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button className="h-10 px-4 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Verify Flow</button>
                         <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-white transition-all shadow-sm">
                           <Trash2 size={16} />
                         </button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      <div className="p-10 bg-slate-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-40 mix-blend-overlay" />
         <div className="relative z-10 flex items-center gap-8">
            <div className="w-16 h-16 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
               <Zap size={32} />
            </div>
            <div>
               <h3 className="text-2xl font-black italic tracking-tight">Financial Core Online</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Matrix settlement engine is currently processing real-time fiscal assets</p>
            </div>
         </div>
         <div className="flex items-center gap-6 relative z-10">
            <div className="text-right">
               <p className="text-[8px] font-black uppercase tracking-widest text-slate-500 mb-1">Authorization Success</p>
               <p className="text-2xl font-black text-emerald-500">99.8%</p>
            </div>
            <button className="h-14 px-8 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-xl">Audit Engine</button>
         </div>
      </div>
    </div>
  );
}
