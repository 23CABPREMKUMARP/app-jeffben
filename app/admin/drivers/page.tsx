"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  UserCircle, 
  Phone, 
  CreditCard, 
  Activity, 
  Trash2, 
  Edit3, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Award,
  History,
  X,
  Save,
  ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockDrivers = [
  { id: "DRV-001", name: "Senthil Kumar", phone: "+91 98765 43210", license: "TN-38-2015-0001", bus: "TN-38-AM-1111", status: "Active", trips: 450, rating: 4.8 },
  { id: "DRV-002", name: "Rajesh Moorthy", phone: "+91 98765 43211", license: "TN-38-2018-0023", bus: "TN-38-PL-4444", status: "Active", trips: 280, rating: 4.5 },
  { id: "DRV-003", name: "Arun Prasath", phone: "+91 98765 43212", license: "TN-38-2020-0089", bus: "TN-38-XY-2222", status: "Active", trips: 120, rating: 4.9 },
  { id: "DRV-004", name: "Manoj Kumar", phone: "+91 98765 43213", license: "TN-38-2012-0012", bus: "None", status: "On Leave", trips: 890, rating: 4.2 },
];

export default function AdminDriversPage() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Driver Corps</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-600 rounded-full" />
            Human Matrix Alignment & Fleet Support
          </p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Plus size={20} /> Onboard New Driver
        </button>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Drivers by Name, ID, or License..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-purple-600/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-14 px-6 bg-slate-50 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600">
            <Award size={18} className="text-purple-500" />
            <span>Avg Rating: 4.7</span>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockDrivers.map((driver, i) => (
          <motion.div 
            key={driver.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 flex flex-col relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
          >
             {/* Status Badge */}
             <div className={`absolute top-8 right-8 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
               driver.status === "Active" ? "bg-emerald-50 text-emerald-500 border border-emerald-100" : "bg-red-50 text-red-500 border border-red-100"
             }`}>
               {driver.status}
             </div>

             <div className="flex items-start gap-6 mb-8 pt-4">
                <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-sm relative overflow-hidden">
                   <UserCircle size={40} />
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100" />
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 tracking-tight leading-none">{driver.name}</h3>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3 flex items-center gap-2">
                      <CreditCard size={12} className="text-purple-400" />
                      ID: {driver.id}
                   </p>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group-hover:bg-purple-50 transition-colors">
                   <div className="flex items-center gap-3 text-slate-400 group-hover:text-purple-400">
                      <Phone size={16} />
                      <span className="text-xs font-bold text-slate-600">{driver.phone}</span>
                   </div>
                   <div className="flex items-center gap-1.5 text-orange-500">
                      <Award size={14} className="fill-orange-500" />
                      <span className="text-xs font-black">{driver.rating}</span>
                   </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl space-y-4">
                   <div className="flex justify-between items-center border-b border-slate-200/50 pb-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Assigned Bus</p>
                      <div className="flex items-center gap-2">
                         <span className="text-xs font-black text-slate-900">{driver.bus}</span>
                        {driver.bus !== "None" && <CheckCircle2 size={12} className="text-emerald-500" />}
                      </div>
                   </div>
                   <div className="flex justify-between items-center">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trips Completed</p>
                      <span className="text-xs font-black text-slate-900">{driver.trips}</span>
                   </div>
                </div>
             </div>

             <div className="mt-8 flex gap-3">
                <button className="flex-1 h-14 bg-slate-100 hover:bg-slate-900 hover:text-white rounded-2xl flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest transition-all">
                   <History size={16} /> History
                </button>
                <button className="h-14 w-14 bg-slate-100 hover:bg-red-50 hover:text-red-500 rounded-2xl flex items-center justify-center transition-all">
                   <Trash2 size={18} />
                </button>
                <button className="h-14 w-14 bg-slate-100 hover:bg-purple-50 hover:text-purple-500 rounded-2xl flex items-center justify-center transition-all">
                   <Edit3 size={18} />
                </button>
             </div>

             {/* Action Icon Overlay */}
             <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-700">
                <Activity size={24} className="opacity-0 group-hover:opacity-100" />
             </div>
          </motion.div>
        ))}
      </div>

      {/* Add Driver Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
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
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">Driver Matrix Onboarding</h3>
                  <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                    <X size={28} className="text-slate-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Identity Name</label>
                    <input type="text" placeholder="Driver Full Name" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-purple-600/10 focus:bg-white transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">License Vector</label>
                    <input type="text" placeholder="TN-00-0000-0000" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-purple-600/10 focus:bg-white transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Vector</label>
                    <input type="tel" placeholder="+91 00000 00000" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-purple-600/10 focus:bg-white transition-all shadow-inner" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Fleet Assignment</label>
                    <select className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-purple-600/10 focus:bg-white transition-all shadow-inner appearance-none">
                      <option>Standby (Unassigned)</option>
                      <option>TN-38-AM-1111</option>
                      <option>TN-38-PL-4444</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsAdding(false)} className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
                    Cancel
                  </button>
                  <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                    <Save size={20} /> Secure Driver Profile
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
