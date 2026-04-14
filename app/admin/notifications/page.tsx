"use client";

import React, { useState } from "react";
import { 
  Bell, 
  Send, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Smartphone, 
  Activity, 
  Zap, 
  Clock, 
  CheckCircle2, 
  X, 
  Save, 
  MoreVertical,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockNotifications = [
  { id: "NTF-1023", type: "System", channel: "App", title: "Bus Delay: TN-38-AM-111", date: "Today, 10:12 AM", status: "Sent" },
  { id: "NTF-1025", type: "Alert", channel: "SMS", title: "Boarding Ready: CBE Terminal", date: "Today, 09:45 AM", status: "Sent" },
  { id: "NTF-1028", type: "Update", channel: "Email", title: "Route Change: Corridor Alpha", date: "Today, 08:30 AM", status: "Failed" },
  { id: "NTF-1031", type: "Security", channel: "All", title: "Matrix Integrity Snapshot", date: "Yesterday, 11:20 PM", status: "Sent" },
];

export default function AdminNotificationsPage() {
  const [isSending, setIsSending] = useState(false);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Communication Terminal</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            Global Push & Broadcast Infrastructure
          </p>
        </div>
        <button 
          onClick={() => setIsSending(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Zap size={20} /> Deploy Pulse
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
           { label: "Active Push Nodes", value: "4,280", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-50" },
           { label: "Delivery Success", value: "99.4%", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" },
           { label: "Matrix Alerts", value: "12", icon: Bell, color: "text-orange-500", bg: "bg-orange-50" },
           { label: "Sync Latency", value: "4ms", icon: Activity, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                   <stat.icon size={20} />
                </div>
                <ArrowUpRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
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
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Notification Archives..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-orange-600/5 transition-all"
          />
        </div>
      </div>

      {/* Notification Archive Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
         <table className="w-full text-left font-bold text-sm">
            <thead className="bg-slate-50/50">
               <tr>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Identity Payload</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Channel Matrix</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity</th>
                  <th className="px-10 py-6 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gate Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
               {mockNotifications.map((ntf, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-8">
                       <div>
                          <p className="text-base font-black text-slate-900 leading-none">{ntf.id}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{ntf.date}</p>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div>
                          <p className="text-sm font-black text-slate-900 group-hover:text-orange-600 transition-colors leading-none">{ntf.title}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{ntf.type} Pulse</p>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg w-fit">
                          {ntf.channel === "App" ? <Smartphone size={12} className="text-blue-500" /> : 
                           ntf.channel === "SMS" ? <Phone size={12} className="text-emerald-500" /> : 
                           ntf.channel === "Email" ? <Mail size={12} className="text-purple-500" /> : 
                           <ShieldCheck size={12} className="text-orange-500" />}
                          <span className="text-[9px] font-black uppercase tracking-widest">{ntf.channel}</span>
                       </div>
                    </td>
                    <td className="px-10 py-8">
                       <span className={`text-[10px] font-black uppercase tracking-widest ${ntf.status === "Sent" ? "text-emerald-500" : "text-red-500"}`}>{ntf.status}</span>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <button className="h-10 px-6 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Re-Pulse Vector</button>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {isSending && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSending(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[50px] w-full max-w-2xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto" >
              <div className="p-10 md:p-14 space-y-10">
                <div className="flex items-center justify-between">
                   <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Deploy Matrix Pulse</h3>
                   <button onClick={() => setIsSending(false)} className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition-all">
                     <X size={28} className="text-slate-400" />
                   </button>
                </div>

                <div className="space-y-8">
                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Channel Matrix Selection</label>
                     <div className="grid grid-cols-4 gap-4">
                        {[
                          { id: 'all', icon: ShieldCheck, label: 'Global' },
                          { id: 'app', icon: Smartphone, label: 'Push' },
                          { id: 'sms', icon: Phone, label: 'SMS' },
                          { id: 'email', icon: Mail, label: 'E-Mail' },
                        ].map((c) => (
                           <button key={c.id} className="h-20 bg-slate-50 border-2 border-slate-50 hover:border-orange-600/20 rounded-3xl flex flex-col items-center justify-center gap-2 transition-all group">
                              <c.icon size={20} className="text-slate-300 group-hover:text-orange-600 transition-colors" />
                              <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">{c.label}</span>
                           </button>
                        ))}
                     </div>
                   </div>

                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Protocol Message Identity</label>
                     <input type="text" placeholder="Pulse Title Vector..." className="w-full h-16 bg-slate-50 border-2 border-slate-50 rounded-3xl px-8 font-bold text-slate-900 outline-none focus:border-orange-600/10 focus:bg-white transition-all shadow-inner" />
                   </div>

                   <div className="space-y-3">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Matrix Dispatch Payload</label>
                     <textarea placeholder="Enter communication metadata here..." className="w-full h-32 bg-slate-50 border-2 border-slate-50 rounded-3xl p-8 font-bold text-slate-900 outline-none focus:border-orange-600/10 focus:bg-white transition-all shadow-inner resize-none appearance-none" />
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button className="flex-1 h-18 bg-white border-2 border-slate-100 text-slate-400 rounded-[28px] font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">Abort Dispatch</button>
                   <button className="flex-[2] h-18 bg-slate-900 text-white rounded-[28px] font-black text-sm uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-black/30 flex items-center justify-center gap-3 italic">
                     <Send size={20} /> Authorize Pulse Deployment
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
