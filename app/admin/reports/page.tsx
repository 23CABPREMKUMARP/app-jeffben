"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  Download, 
  Calendar, 
  Filter, 
  Activity, 
  Zap, 
  Target, 
  Users, 
  Bus, 
  Map as MapIcon,
  MousePointer2,
  Clock,
  MoreVertical,
  X
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminReportsPage() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Matrix Intelligence</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
            Big Data Behavioral & Operational Analytics
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-[20px] font-black text-xs tracking-widest hover:bg-slate-50 transition-all uppercase italic">
             <Filter size={18} /> Deep Filter
           </button>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic">
             <Download size={20} /> Export Dataset
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
           { label: "Matrix Efficiency", value: "98.4%", icon: Zap, color: "text-emerald-500", bg: "bg-emerald-50", change: "+2.4%" },
           { label: "Asset Utilization", value: "92.1%", icon: Bus, color: "text-blue-500", bg: "bg-blue-50", change: "Optimal" },
           { label: "Passenger LTV", value: "₹ 4.8K", icon: Users, color: "text-purple-500", bg: "bg-purple-50", change: "Growing" },
           { label: "Route Popularity", value: "A-Cor", icon: MapIcon, color: "text-orange-500", bg: "bg-orange-50", change: "+14%" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between group hover:shadow-2xl transition-all duration-500">
             <div className="flex items-center justify-between mb-8">
                <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                   <stat.icon size={28} />
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg">{stat.change}</p>
                </div>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-3">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Monthly Revenue Analysis */}
         <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
               <MoreVertical size={20} className="text-slate-200 cursor-pointer hover:text-slate-900 transition-colors" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Fiscal Vector Growth</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">Revenue generation over fiscal quarter</p>
            
            <div className="flex-1 min-h-[300px] flex items-end gap-3 justify-between px-2 pt-10">
               {[40, 60, 45, 90, 65, 80, 100, 75, 95, 110, 85, 120].map((val, i) => (
                 <div key={i} className="flex-1 flex flex-col items-center gap-3 group/bar">
                    <div className="text-[8px] font-black text-slate-300 opacity-0 group-hover/bar:opacity-100 transition-opacity">₹{val}K</div>
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: `${val}%` }} 
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="w-full bg-slate-900 rounded-t-xl hover:bg-purple-600 transition-colors relative"
                    >
                       <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover/bar:opacity-0 transition-opacity" />
                    </motion.div>
                    <span className="text-[8px] font-black text-slate-400 uppercase">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                 </div>
               ))}
            </div>
         </div>

         {/* Distribution & Peak Analysis */}
         <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl p-10 flex flex-col items-center justify-center text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 flex flex-col gap-6 items-end">
               <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-orange-500 animate-pulse border border-white/5">
                  <Activity size={24} />
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Global Peak Flow</p>
                  <p className="text-lg font-black italic">08:00 AM - 10:30 AM</p>
               </div>
            </div>
            
            <div className="space-y-4 max-w-sm mb-12">
               <h3 className="text-2xl font-black italic tracking-tight">Topology Usage Cluster</h3>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regional asset distribution by matrix nodes</p>
            </div>
            
            <div className="relative w-64 h-64 flex items-center justify-center">
               <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 251.2" }} 
                    animate={{ strokeDasharray: "150.7 251.2" }} 
                    transition={{ duration: 2, ease: "easeOut" }}
                    cx="50" cy="50" r="40" fill="transparent" stroke="#ea580c" strokeWidth="8" strokeLinecap="round" 
                  />
                  <motion.circle 
                    initial={{ strokeDasharray: "0 251.2" }} 
                    animate={{ strokeDasharray: "75.3 251.2" }} 
                    transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
                    cx="50" cy="50" r="40" fill="transparent" stroke="#8b5cf6" strokeWidth="8" strokeDashoffset="-150.7" strokeLinecap="round" 
                  />
               </svg>
               <div className="absolute flex flex-col items-center">
                  <p className="text-3xl font-black italic tracking-tighter">94%</p>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Operational Success</p>
               </div>
            </div>
            
            <div className="mt-12 flex gap-8">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Urban Core</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Matrix Bypass</span>
               </div>
            </div>
         </div>
      </div>

      {/* Monthly Report List */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-xl font-black text-slate-900 leading-none">Intelligence Archives</h3>
            <p className="text-xs font-black text-blue-600 hover:underline cursor-pointer">Archive Search &rarr;</p>
        </div>
        <div className="divide-y divide-slate-50">
           {[
             { name: "Global Operational Snapshot - March 2026", type: "Full Performance", size: "14.2 MB", status: "Verified" },
             { name: "Financial Audit Matrix - Q1 2026", type: "Fiscal Ledger", size: "8.4 MB", status: "Encrypted" },
             { name: "Behavioral Demographic Study - Urban CBE", type: "User Analytics", size: "2.1 MB", status: "Verified" },
             { name: "Route Efficiency & Delta Report - V2.4", type: "Topology Log", size: "5.6 MB", status: "Modified" },
           ].map((file, i) => (
             <div key={i} className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 group hover:bg-slate-50 transition-all duration-300">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                      <Target size={24} />
                   </div>
                   <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{file.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{file.type} • {file.size}</p>
                   </div>
                </div>
                <div className="flex items-center gap-4">
                   <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 group-hover:text-emerald-500 transition-colors">{file.status}</span>
                   <button className="h-12 px-6 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Download Dataset</button>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
