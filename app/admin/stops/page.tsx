"use client";

import React, { useState } from "react";
import { 
  MapPin, 
  Map, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Navigation,
  Layers,
  ArrowUpRight,
  MoreVertical,
  X,
  Save,
  Anchor,
  Wind
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockStops = [
  { id: "STP-001", name: "Coimbatore Junction Hub", route: "Corridor Alpha", type: "Major", lat: "11.0168", lng: "76.9558", boarding: true, drop: true, status: "Active" },
  { id: "STP-002", name: "SITRA Matrix", route: "Corridor Alpha", type: "Major", lat: "11.0301", lng: "77.0421", boarding: true, drop: true, status: "Active" },
  { id: "STP-003", name: "Peelamedu Relay", route: "Metro Vector", type: "Minor", lat: "32.0911", lng: "77.1002", boarding: true, drop: false, status: "Active" },
  { id: "STP-004", name: "Sulur Terminal", route: "Transit Beta", type: "Major", lat: "11.0312", lng: "77.1245", boarding: false, drop: true, status: "Maintenance" },
];

export default function AdminStopsPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Spatial Node Cluster</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-600 rounded-full" />
            Define Matrix Boarding & Drop Geofences
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Plus size={20} /> Anchor New Stop
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Spatial Nodes by Name, Route, or ID..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-emerald-600/5 transition-all"
          />
        </div>
      </div>

      {/* Stops Master Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Identity</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Route Matrix</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Logic</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordinates</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Integrity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-bold text-sm">
            {mockStops.map((stop, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                <td className="px-10 py-8">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                        <Anchor size={18} />
                     </div>
                     <div>
                       <p className="text-base font-black text-slate-900 leading-none">{stop.name}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{stop.type} Node</p>
                     </div>
                  </div>
                </td>
                <td className="px-10 py-8">
                   <div className="px-4 py-2 bg-slate-100 rounded-xl w-fit group-hover:bg-slate-900 group-hover:text-white transition-all">
                      <span className="text-[10px] font-black uppercase tracking-widest">{stop.route}</span>
                   </div>
                </td>
                <td className="px-10 py-8">
                   <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                         <Wind size={14} className={stop.boarding ? "text-emerald-500" : "text-slate-200"} />
                         <span className="text-[8px] font-black uppercase tracking-widest mt-1">Boarding</span>
                      </div>
                      <div className="flex flex-col items-center border-l border-slate-100 pl-6">
                         <div className={`w-3.5 h-3.5 rounded-sm border-2 ${stop.drop ? "bg-emerald-500 border-emerald-500" : "border-slate-200"}`} />
                         <span className="text-[8px] font-black uppercase tracking-widest mt-1">Drop</span>
                      </div>
                   </div>
                </td>
                <td className="px-10 py-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">LAT: {stop.lat}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">LNG: {stop.lng}</p>
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
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[50px] w-full max-w-4xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto" >
              <div className="p-10 md:p-14 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Anchor Spatial Node</h3>
                   <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                     <X size={28} className="text-slate-400" />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Stop Label Identity</label>
                        <input type="text" placeholder="Matrix Node Site-01" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-emerald-600/10 focus:bg-white transition-all shadow-inner" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Parent Route Matrix</label>
                        <select className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none appearance-none">
                           <option>Corridor Alpha</option>
                           <option>Metro Vector</option>
                           <option>Transit Beta</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <button className="h-16 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/10">Boarding Allowed</button>
                         <button className="h-16 bg-slate-50 text-slate-400 border border-slate-100 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em]">Drop Allowed</button>
                      </div>
                   </div>
                   
                   <div className="bg-slate-900 rounded-[40px] border border-slate-800 flex flex-col items-center justify-center p-10 text-center space-y-6 relative overflow-hidden group">
                      <div className="absolute inset-0 opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity">
                         <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                      </div>
                      <MapPin size={48} className="text-emerald-500 relative z-10 animate-bounce" />
                      <div>
                         <p className="text-sm font-bold text-white relative z-10">GPS Matrix Alignment</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-3 relative z-10 leading-relaxed px-10">Synchronize spatial coordinates with global satellite telemetry terminal</p>
                      </div>
                      <button className="bg-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-500 transition-all relative z-10 shadow-xl shadow-black/40">Calibrate Terminal</button>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Discard Node
                  </button>
                  <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                    <Save size={20} /> Secure Node Cluster
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
