"use client";

import React, { useState } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  UserCircle, 
  ShieldAlert, 
  TrendingUp, 
  Activity, 
  Trash2, 
  Edit3, 
  MoreVertical,
  History,
  Lock,
  X,
  Save,
  CheckCircle2,
  Mail,
  Phone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockUsers = [
  { id: "USR-A123", name: "Prem Kumar", email: "prem@matrix.com", phone: "+91 90033 12345", bookings: 12, spent: "₹ 5,400", status: "Active", level: "Elite Platinum" },
  { id: "USR-B456", name: "Senthil Raj", email: "senthil@node.net", phone: "+91 98455 67890", bookings: 4, spent: "₹ 1,800", status: "Active", level: "Silver" },
  { id: "USR-C789", name: "Ananya Devi", email: "ananya@vector.org", phone: "+91 97890 12345", bookings: 8, spent: "₹ 3,200", status: "Suspended", level: "Gold Member" },
  { id: "USR-D101", name: "Karthik Raja", email: "karthik@fleet.io", phone: "+91 91234 56789", bookings: 2, spent: "₹ 900", status: "Active", level: "Standard" },
];

export default function AdminUsersPage() {
  const [isModifying, setIsModifying] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Matrix User Corps</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            Global Citizen Registry & Behavioral Analytics
          </p>
        </div>
        <button 
          onClick={() => setIsModifying(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Plus size={20} /> Onboard New Identity
        </button>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
           { label: "Active Nodes", value: "4,280", icon: UserCircle, color: "text-blue-600", bg: "bg-blue-50" },
           { label: "LTV Index", value: "₹ 1.2Cr", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
           { label: "Matrix Churn", value: "0.4%", icon: Activity, color: "text-red-500", bg: "bg-red-50" },
           { label: "Authorization", value: "Secure", icon: Lock, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
             <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                <stat.icon size={22} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Identity by Name, Email, or ID Vector..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
          />
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        <table className="w-full text-left font-bold text-sm">
           <thead className="bg-slate-50/50">
              <tr>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Node</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact Matrix</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Matrix Level</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analytics</th>
                 <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Gate Action</th>
              </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
              {mockUsers.map((user, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                   <td className="px-10 py-8">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                           <UserCircle size={22} />
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 leading-none">{user.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{user.id}</p>
                        </div>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-slate-500">
                           <Mail size={12} className="text-slate-300" />
                           <span className="text-xs">{user.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500">
                           <Phone size={12} className="text-slate-300" />
                           <span className="text-xs">{user.phone}</span>
                        </div>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className="px-4 py-1.5 bg-slate-100 rounded-full w-fit group-hover:bg-slate-900 group-hover:text-white transition-all">
                         <span className="text-[9px] font-black uppercase tracking-widest italic">{user.level}</span>
                      </div>
                   </td>
                   <td className="px-10 py-8">
                      <div className="flex items-center gap-8">
                         <div className="text-center">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Bookings</p>
                            <span className="text-xs font-black">{user.bookings}</span>
                         </div>
                         <div className="text-center border-l border-slate-100 pl-8">
                            <p className="text-[8px] font-black text-slate-400 uppercase mb-1">LTV</p>
                            <span className="text-xs font-black text-emerald-600">{user.spent}</span>
                         </div>
                      </div>
                   </td>
                   <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                         <History size={16} />
                       </button>
                       <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                         <ShieldAlert size={16} />
                       </button>
                      </div>
                   </td>
                </tr>
              ))}
           </tbody>
        </table>
      </div>

      {/* Add Identity Modal */}
      <AnimatePresence>
        {isModifying && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModifying(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[50px] w-full max-w-2xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto" >
              <div className="p-10 md:p-14 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Identity Ingress</h3>
                   <button onClick={() => setIsModifying(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                     <X size={28} className="text-slate-400" />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Display Identity</label>
                     <input type="text" placeholder="Johnathan Matrix" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">E-Mail Vector</label>
                     <input type="email" placeholder="user@matrix.io" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Phone Vector</label>
                     <input type="tel" placeholder="+91 00000 00000" className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-blue-600/10 focus:bg-white transition-all shadow-inner" />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Authorization Grade</label>
                     <select className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none appearance-none">
                        <option>Standard Citizen</option>
                        <option>Silver Member</option>
                        <option>Gold Member</option>
                        <option>Elite Platinum</option>
                     </select>
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setIsModifying(false)} className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Abort Authorization</button>
                  <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                    <Save size={20} /> Authorize Identity
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
