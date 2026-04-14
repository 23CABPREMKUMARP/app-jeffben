"use client";

import React from "react";
import { 
  Activity, 
  Map as MapIcon, 
  Compass, 
  Wind, 
  Battery, 
  Zap, 
  Signal, 
  Wifi, 
  BarChart3, 
  ArrowUpRight, 
  Navigation, 
  Bus,
  Search,
  Layers,
  Settings2,
  Maximize2
} from "lucide-react";
import { motion } from "framer-motion";

const activeBuses = [
  { id: "TN-38-AM-1111", route: "CBE → AVIN", speed: "58 km/h", fuel: "82%", signal: "Strong", load: "14/40", status: "Optimal" },
  { id: "TN-38-PL-4444", route: "CBE → PALL", speed: "42 km/h", fuel: "64%", signal: "Strong", load: "32/40", status: "Optimal" },
  { id: "TN-38-XY-2222", route: "AVIN → TIRU", speed: "0 km/h", fuel: "90%", signal: "Normal", load: "0/40", status: "Boarding" },
  { id: "TN-38-KL-7777", route: "CBE → METT", speed: "51 km/h", fuel: "42%", signal: "Strong", load: "18/40", status: "Optimal" },
];

export default function AdminMonitoringPage() {
  return (
    <div className="h-full flex flex-col space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Matrix Monitoring</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            Live Global Telemetry & Fleet Pulse
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
             <Signal size={14} />
             <span className="text-[10px] font-black uppercase tracking-widest leading-none">Satellite Linked</span>
           </div>
           <button className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-black transition-all">
             <Maximize2 size={20} />
           </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Live Map Panel */}
        <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden relative group">
           <div className="absolute top-8 left-8 z-10 flex flex-col gap-4">
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl w-64 space-y-4">
                 <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Search</p>
                    <Search size={14} className="text-slate-400" />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Locate Asset..." 
                   className="w-full h-10 bg-slate-100 border-none rounded-xl px-4 text-xs font-bold outline-none"
                 />
                 <div className="space-y-4 pt-2">
                    {activeBuses.slice(0, 2).map((bus, i) => (
                      <div key={i} className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all">
                         <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-600 flex items-center justify-center">
                            <Bus size={14} />
                         </div>
                         <div>
                            <p className="text-xs font-black">{bus.id}</p>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{bus.status}</p>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
              
              <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4 w-fit">
                 <Layers size={18} className="text-orange-500" />
                 <div className="w-px h-6 bg-slate-800" />
                 <Compass size={18} className="hover:text-orange-500 cursor-pointer" />
                 <div className="w-px h-6 bg-slate-800" />
                 <Settings2 size={18} className="hover:text-orange-500 cursor-pointer" />
              </div>
           </div>

           {/* Fake Map Visualization */}
           <div className="w-full h-full bg-[#f8fafc] relative overflow-hidden">
             <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
             </div>
             
             {/* Path Line */}
             <svg className="absolute inset-0 w-full h-full">
                <path 
                  d="M 100 500 Q 250 400 400 450 T 700 200 T 1100 300" 
                  stroke="#ea580c" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeDasharray="12 12" 
                  className="opacity-30"
                />
             </svg>
             
             {/* Bus Points */}
             {[
               { top: '30%', left: '20%', label: 'TN-38-AM-1111', angle: -30 },
               { top: '60%', left: '45%', label: 'TN-38-PL-4444', angle: 45 },
               { top: '45%', left: '75%', label: 'TN-38-KL-7777', angle: 10 },
             ].map((node, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, scale: 0 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: i * 0.2 }}
                 style={{ top: node.top, left: node.left }}
                 className="absolute -translate-x-1/2 -translate-y-1/2"
               >
                 <div className="relative group cursor-pointer">
                    <div className="absolute inset-[-20px] bg-orange-600/10 rounded-full animate-ping opacity-20" />
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl border border-slate-100 flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white transition-all duration-500 rotate-0">
                       <Bus size={24} style={{ transform: `rotate(${node.angle}deg)` }} />
                    </div>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                       {node.label}
                    </div>
                 </div>
               </motion.div>
             ))}
           </div>
        </div>

        {/* Telemetry Sidebar */}
        <div className="flex flex-col gap-8">
           <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col">
              <h3 className="text-lg font-black text-slate-900 mb-6">Asset Telemetry</h3>
              <div className="space-y-6">
                 {activeBuses.map((bus, i) => (
                   <div key={i} className="p-4 bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 rounded-2xl transition-all group cursor-pointer shadow-sm hover:shadow-xl">
                      <div className="flex items-center justify-between mb-3">
                         <span className="text-xs font-black">{bus.id}</span>
                         <span className="text-[10px] font-bold text-orange-600">{bus.speed}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div className="flex items-center gap-2 text-slate-400">
                            <Wind size={12} />
                            <span className="text-[10px] font-bold">{bus.status}</span>
                         </div>
                         <div className="flex items-center gap-2 text-slate-400">
                            <Battery size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-bold text-slate-600">{bus.fuel}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                 <Activity size={32} className="text-orange-500 animate-pulse" />
              </div>
              <h3 className="text-xl font-black italic mb-2">Matrix Signal</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Synchronization Index</p>
              
              <div className="mt-10 space-y-6">
                 {[
                   { label: "Core Sync", value: "99.8%", color: "bg-emerald-500" },
                   { label: "Telemetry Delay", value: "14ms", color: "bg-orange-500" },
                   { label: "Asset Lock", value: "32/32", color: "bg-emerald-500" },
                 ].map((stat, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-slate-400">{stat.label}</span>
                         <span>{stat.value}</span>
                      </div>
                      <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                           initial={{ width: 0 }} 
                           animate={{ width: "100%" }} 
                           className={`h-full ${stat.color}`} 
                         />
                      </div>
                   </div>
                 ))}
              </div>
              
              <button className="mt-10 w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-widest transition-all">
                 Re-Calibrate Terminal
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
