"use client";

import React, { useState } from "react";
import { 
  Map as MapIcon, 
  MapPin, 
  Plus, 
  Search, 
  Navigation, 
  Clock, 
  Route as RouteIcon, 
  Activity, 
  Trash2, 
  Edit3, 
  MoreVertical,
  CheckCircle2,
  Bus,
  X,
  Save,
  Layers,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockRoutes = [
  { id: "R-101", name: "Corridor Alpha", from: "Coimbatore", to: "Avinashi", stops: 12, distance: "45km", time: "1h 15m", buses: 4, status: "Active" },
  { id: "R-102", name: "Metro Vector", from: "Gandhipuram", to: "Saravanampatti", stops: 8, distance: "12km", time: "30m", buses: 6, status: "Active" },
  { id: "R-103", name: "Transit Beta", from: "Podanur", to: "Mettupalayam", stops: 18, distance: "52km", time: "1h 45m", buses: 2, status: "Maintenance" },
  { id: "R-104", name: "Quantum Link", from: "Ukkadam", to: "Pollachi", stops: 10, distance: "40km", time: "1h 05m", buses: 3, status: "Active" },
];

export default function AdminRoutesPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Route Engineering</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full" />
            Define Matrix Paths & Stop Clusters
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Plus size={20} /> Design New Path
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
           { label: "Active Routes", value: "12", icon: Navigation, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "Total Stops", value: "84", icon: MapPin, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Fleet Coverage", value: "94%", icon: RouteIcon, color: "text-orange-600", bg: "bg-orange-50" },
           { label: "Optimization", value: "Quantum", icon: Zap, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={22} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 uppercase italic">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Routes by Name, Origin, or Destination..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-orange-600/5 transition-all"
          />
        </div>
      </div>

      {/* Routes Master Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Identity</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vector Path</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Topology</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Deployment</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold text-sm">
            {mockRoutes.map((route, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                <td className="px-10 py-8">
                  <div>
                    <p className="text-base font-black text-slate-900 leading-none">{route.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{route.id}</p>
                  </div>
                </td>
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                     <div className="text-right">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Origin</p>
                        <p className="text-xs text-slate-900 font-bold">{route.from}</p>
                     </div>
                     <div className="flex flex-col items-center gap-1 group-hover:scale-110 transition-transform">
                        <Navigation size={12} className="text-orange-500 rotate-90" />
                        <div className="w-12 h-px bg-slate-200" />
                     </div>
                     <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Destination</p>
                        <p className="text-xs text-slate-900 font-bold">{route.to}</p>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-8">
                      <div className="flex flex-col items-center">
                         <MapPin size={14} className="text-blue-500 mb-1" />
                         <span className="text-xs font-black">{route.stops} <span className="text-[9px] text-slate-400">STOPS</span></span>
                      </div>
                      <div className="flex flex-col items-center border-l border-slate-100 pl-8">
                         <Clock size={14} className="text-orange-500 mb-1" />
                         <span className="text-xs font-black">{route.time}</span>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-8 text-center w-40">
                   <div className="px-4 py-2 bg-slate-100 rounded-xl flex items-center justify-between group-hover:bg-orange-600 group-hover:text-white transition-all">
                      <Bus size={14} />
                      <span className="text-xs font-black">{route.buses} <span className="text-[9px] opacity-60">ACTIVE</span></span>
                   </div>
                </td>
                <td className="px-10 py-8 text-right">
                   <div className="flex items-center justify-end gap-2">
                    <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                      <Edit3 size={16} />
                    </button>
                    <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 size={16} />
                    </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAdding(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[50px] w-full max-w-4xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto max-h-[90vh] overflow-y-auto custom-scrollbar" >
              <div className="p-10 md:p-14 space-y-10">
                <div className="flex items-center justify-between">
                   <div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Route Schematic Design</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Defining new matrix corridor</p>
                   </div>
                   <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                     <X size={28} className="text-slate-400" />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Corridor Name</label>
                        <input type="text" placeholder="Matrix Alpha Link" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-orange-600/10 focus:bg-white transition-all shadow-inner" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Origin Hub</label>
                          <input type="text" placeholder="Start Unit" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-orange-600/10 focus:bg-white transition-all shadow-inner" />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Terminus Hub</label>
                          <input type="text" placeholder="End Unit" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-orange-600/10 focus:bg-white transition-all shadow-inner" />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Topology Complexity (Stops)</label>
                        <div className="flex items-center gap-4">
                           <button className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black">-</button>
                           <div className="flex-1 h-16 bg-slate-100 rounded-3xl flex items-center justify-center font-black text-xl">12</div>
                           <button className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">+</button>
                        </div>
                      </div>
                   </div>
                   
                   {/* Map Interaction Placeholder */}
                   <div className="bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-10 text-center space-y-6">
                      <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-300 shadow-sm border border-slate-100">
                         <Layers size={32} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900">Interactive Path Mapping</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-2">Initialize spatial coordinate terminal to draw route paths on global matrix</p>
                      </div>
                      <button className="bg-white border border-slate-200 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-lg">Load Spatial Module</button>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Discard Schematic
                  </button>
                  <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                    <Save size={20} /> Authorize Route Vector
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
