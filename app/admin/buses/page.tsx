"use client";

import React, { useState, useEffect } from "react";
import { 
  Bus, 
  Plus, 
  Search, 
  Activity, 
  Trash2, 
  Edit3, 
  UserCircle, 
  MapPin, 
  ArrowUpRight, 
  MoreVertical,
  Navigation,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Save,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBusesPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [buses, setBuses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await fetch("/api/buses");
      const data = await res.json();
      setBuses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Fleet Management</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            Control Node Asset Dispatch & Status
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Plus size={20} /> Add New Asset
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Fleet by ID, Driver, or Status..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-14 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 transition-all">
            <Filter size={18} />
            <span>Filter Status</span>
          </button>
          <button className="h-14 w-14 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center justify-center text-slate-600 transition-all">
            <Activity size={20} />
          </button>
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        {isLoading ? (
          <div className="p-40 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Synchronizing Fleet Matrix...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] w-8">Type</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bus Payload</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Deployment</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Current Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dispatch Log</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-sm">
              {buses.map((bus, i) => (
                <tr key={bus._id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-10 py-8">
                     <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        <Bus size={22} />
                     </div>
                  </td>
                  <td className="px-10 py-8">
                    <div>
                      <p className="text-base font-black text-slate-900 leading-none">{bus.busNumber}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                        <UserCircle size={12} className="text-blue-500" />
                        {bus.driverName || "Awaiting Driver"}
                      </p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${bus.status === "Running" ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-pulse" : "bg-red-500"}`} />
                      <span className="text-xs font-black uppercase tracking-widest leading-none">{bus.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-slate-500">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-slate-300" />
                      <span>{bus.currentStop || "Depot Alpha"}</span>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Dep</p>
                        <p className="text-xs text-slate-900 font-black">{bus.departureTime}</p>
                      </div>
                      <div className="w-10 h-[1.5px] bg-slate-100 relative overflow-hidden flex items-center justify-center">
                        <motion.div 
                          animate={{ x: [ -40, 40 ] }} 
                          transition={{ repeat: Infinity, duration: 2 }} 
                          className="w-1/2 h-full bg-blue-600/30" 
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Arr</p>
                        <p className="text-xs text-slate-900 font-black">{bus.arrivalTime}</p>
                      </div>
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
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }} 
              animate={{ scale: 1, opacity: 1, y: 0 }} 
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-white rounded-[50px] w-full max-w-2xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto"
            >
              <div className="p-10 md:p-14 space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">New Node Deployment</h3>
                  <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                    <X size={28} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Fleet Identifier</label>
                    <input type="text" placeholder="TN-01-AB-1234" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Bus Type Matrix</label>
                    <select className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner appearance-none">
                      <option>Scania Elite 3D</option>
                      <option>Volvo Matrix V2</option>
                      <option>Mercedes Fleet Prime</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Assigned Driver</label>
                    <div className="relative">
                      <UserCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={24} />
                      <input type="text" placeholder="Search Driver Vector..." className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl pl-16 pr-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Deployment Status</label>
                    <div className="flex gap-2">
                       <button className="flex-1 h-16 bg-emerald-50 text-emerald-600 rounded-3xl font-black text-[10px] uppercase tracking-widest border-2 border-emerald-500/20 shadow-lg shadow-emerald-500/10">Running</button>
                       <button className="flex-1 h-16 bg-slate-50 text-slate-400 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all">Standby</button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Abort Mission
                  </button>
                  <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                    <Save size={20} /> Deploy Node Asset
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
