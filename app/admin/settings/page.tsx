"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Palette, 
  Map as MapIcon, 
  Ticket, 
  ShieldCheck, 
  Globe, 
  Lock, 
  Bell, 
  Zap, 
  Database, 
  Save, 
  Trash2, 
  Edit3, 
  ArrowUpRight,
  MousePointer2,
  Bus,
  Layers,
  X,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");

  const tabs = [
    { id: "branding", label: "Identity & Theme", icon: Palette },
    { id: "mapping", label: "Spatial Matrix", icon: MapIcon },
    { id: "ticketing", label: "Credential Engine", icon: Ticket },
    { id: "security", label: "Matrix Security", icon: ShieldCheck },
    { id: "payments", label: "Fiscal Engine", icon: CreditCard },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">System Architecture</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-slate-900 rounded-full" />
            Global Matrix Parameter Optimization
          </p>
        </div>
        <button className="flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[25px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/20 uppercase italic">
          <Save size={20} /> Authorize Sync
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-80 space-y-2">
           {tabs.map((tab) => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id)}
               className={`w-full flex items-center gap-4 px-8 py-5 rounded-3xl font-black text-sm transition-all relative overflow-hidden group ${
                 activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-900 border border-slate-100"
               }`}
             >
                <tab.icon size={20} className={activeTab === tab.id ? "text-orange-500" : "text-slate-300 group-hover:text-slate-900 transition-colors"} />
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div layoutId="setting-active" className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-orange-600 rounded-l-full" />
                )}
             </button>
           ))}
        </div>

        {/* Settings Panel Content */}
        <div className="flex-1 bg-white rounded-[50px] border border-slate-100 shadow-sm p-10 md:p-14 relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-14 opacity-0 group-hover:opacity-100 transition-opacity">
              <Zap size={48} className="text-slate-50" />
           </div>
           
           <AnimatePresence mode="wait">
              {activeTab === "branding" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase italic">Identity & Visual Logic</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Calibrate JeffBen global brand presence</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Matrix Primary Color</label>
                         <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100 shadow-inner">
                            <div className="w-12 h-12 bg-orange-600 rounded-2xl shadow-xl shadow-orange-600/20 cursor-pointer" />
                            <input type="text" defaultValue="#ea580c" className="flex-1 bg-transparent font-black text-slate-900 text-sm outline-none" />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Asset Logo Vector</label>
                         <div className="h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition-all">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Upload .svg payload</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Global Surface Mode</label>
                      <div className="grid grid-cols-3 gap-6">
                         {['High Fidelity Light', 'Matrix Dark', 'Cyber Glass'].map((mode, i) => (
                           <button key={i} className={`h-16 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all ${i === 0 ? "bg-slate-900 text-white border-none shadow-xl" : "bg-white border-2 border-slate-50 text-slate-400 hover:bg-slate-50"}`}>
                             {mode}
                           </button>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === "mapping" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase italic">Spatial Matrix Parameters</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Defining global GPS & GIS logic</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Map Engine</label>
                         <div className="h-16 bg-slate-50 rounded-3xl px-8 flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">Mapbox Matrix V4</span>
                            <Globe size={18} className="text-blue-500" />
                         </div>
                      </div>
                      <div className="space-y-4">
                         <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Telemetry Precision</label>
                         <div className="flex items-center gap-6">
                            <input type="range" className="flex-1 accent-orange-600 h-2 bg-slate-100 rounded-full appearance-none flex items-center justify-center p-0" />
                            <span className="text-[10px] font-black text-slate-900 uppercase italic">Ultra (1ms)</span>
                         </div>
                      </div>
                   </div>
                   
                   <div className="p-10 bg-slate-900 rounded-[40px] text-white space-y-6">
                      <div className="flex items-center gap-4">
                         <Layers size={24} className="text-orange-500" />
                         <span className="text-lg font-black italic tracking-tight">Active Topology Overlays</span>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-4">
                         {['Arterial Routes', 'Bus Density', 'Terminal Nodes', 'Geofence Blocks'].map((layer, i) => (
                           <div key={i} className="px-6 py-3 bg-white/5 rounded-2xl border border-white/5 flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                              <span className="text-[10px] font-black uppercase tracking-widest">{layer}</span>
                           </div>
                         ))}
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === "ticketing" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12">
                   <div className="space-y-2">
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase italic">Credential Engine Protocols</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Calibrating 'Vintage Ornate Gold' Ticket Logic</p>
                   </div>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Credential Aesthetic Variant</label>
                            <div className="flex gap-4">
                               <div className="flex-1 h-32 bg-[#f7e49f] rounded-3xl border-2 border-orange-600/30 shadow-2xl relative overflow-hidden group cursor-pointer">
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                  <div className="absolute bottom-4 left-4 z-10 text-[9px] font-black uppercase tracking-widest text-[#5d4037]">Vintage Gold</div>
                               </div>
                               <div className="flex-1 h-32 bg-slate-900 rounded-3xl border-2 border-slate-800 opacity-40 hover:opacity-100 transition-opacity relative group cursor-pointer">
                                  <div className="absolute bottom-4 left-4 z-10 text-[9px] font-black uppercase tracking-widest text-slate-500">Dark Stealth</div>
                               </div>
                            </div>
                         </div>
                      </div>
                      
                      <div className="space-y-8 bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Authorization</p>
                            <div className="w-12 h-6 bg-orange-600 rounded-full relative cursor-pointer shadow-lg shadow-orange-600/20">
                               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                            </div>
                         </div>
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dynamic QR Vector</p>
                            <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                               <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                            </div>
                         </div>
                         <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Multi-unit Boarding</p>
                            <div className="w-12 h-6 bg-orange-600 rounded-full relative cursor-pointer shadow-lg shadow-orange-600/20">
                               <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>
      
      <div className="p-10 bg-slate-50 rounded-[40px] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm">
               <Database size={24} />
            </div>
            <div>
               <p className="text-sm font-black text-slate-900">Synchronized Global Matrix V2.4</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Protocol status: optimal • last authorized log 2m ago</p>
            </div>
         </div>
         <button className="h-14 px-8 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-white hover:border-red-500 transition-all">Reset Factory Matrix</button>
      </div>
    </div>
  );
}
