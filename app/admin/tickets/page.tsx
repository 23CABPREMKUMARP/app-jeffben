"use client";

import React, { useState } from "react";
import { 
  Ticket, 
  Search, 
  Scan, 
  Download, 
  ShieldCheck, 
  History, 
  Trash2, 
  Edit3, 
  Zap, 
  MoreVertical,
  ArrowUpRight,
  ClipboardCheck,
  Award,
  X,
  Save,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRScanner from "@/src/components/ui/QRScanner";


const mockTickets = [
  { id: "JB-TX4A5B", passenger: "Karthik Raja", bus: "TN-38-AM-1111", seat: "12A", status: "Verified", time: "09:12 AM", type: "Premium Gold" },
  { id: "JB-TX8R2X", passenger: "Ananya Devi", bus: "TN-38-AM-1111", seat: "15B", status: "Verified", time: "09:14 AM", type: "Premium Gold" },
  { id: "JB-TX1P9Q", passenger: "Suresh Prabhu", bus: "TN-38-AM-1111", seat: "04C", status: "Pending", time: "Pending", type: "Standard" },
  { id: "JB-TX7M4L", passenger: "Meera Nair", bus: "TN-38-AM-1111", seat: "18A", status: "Verified", time: "09:18 AM", type: "Premium Gold" },
];

export default function AdminTicketsPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleScan = async (token: string) => {
    setIsValidating(true);
    setScannedData(null);
    try {
      const res = await fetch("/api/bookings/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, scannedBy: "ADMIN_CONSOLE" })
      });
      const data = await res.json();
      
      if (data.success) {
        setScannedData({
          ticketId: data.booking.ticketId,
          seat: data.booking.seats.join(", "),
          node: data.booking.bus,
          status: "VALID / ACTIVE",
          boardingAt: data.booking.boardingPoint,
          timestamp: new Date().toLocaleString()
        });
      } else {
        alert("SCAN ERROR: " + data.message);
      }
    } catch (err) {
      console.error("Validation error:", err);
      alert("CRITICAL LINK FAILURE: Backend connection lost.");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Ticket Ledger Registry</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-600 rounded-full" />
            Validate 'Vintage Ornate Gold' Credentials
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => setIsVerifying(true)}
             className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
           >
             <Scan size={20} /> Integrity Verification
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
           { label: "Valid Credentials", value: "1,248", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" },
           { label: "Verification Rate", value: "99.8%", icon: Award, color: "text-yellow-600", bg: "bg-yellow-50" },
           { label: "Matrix Sync", value: "Active", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" },
           { label: "History Index", value: "4.2GB", icon: History, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between group">
             <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center`}>
                   <stat.icon size={20} />
                </div>
                <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 group-hover:text-slate-900">
                  <ArrowUpRight size={16} />
                </button>
             </div>
             <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <p className="text-xl font-black text-slate-900 leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Tickets Master Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900">Credential Matrix Log</h3>
            <div className="relative w-64 group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-yellow-600 transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Locate Credential..." 
                 className="w-full h-11 bg-slate-50 border-none rounded-xl pl-12 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-yellow-600/5 transition-all"
               />
            </div>
         </div>
         
         <table className="w-full text-left">
            <thead className="bg-slate-50/50">
               <tr>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Serial Number</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit / Assignment</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Matrix Status</th>
                  <th className="px-10 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gate Action</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-sm">
               {mockTickets.map((row, i) => (
                 <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-6">
                       <div>
                          <p className="text-xs font-black text-slate-900">{row.id}</p>
                          <p className="text-[8px] text-yellow-600 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5 italic">
                             <Award size={10} /> {row.type}
                          </p>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-center">
                       <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] inline-block font-black uppercase tracking-widest">
                          {row.bus} / <span className="text-orange-600">S:{row.seat}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className={`flex items-center gap-2 ${row.status === "Verified" ? "text-emerald-500" : "text-yellow-600"}`}>
                          <ClipboardCheck size={14} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{row.status}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <Download size={16} />
                        </button>
                        <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                          <Printer size={16} />
                        </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>

      {/* Verify Logic Modal */}
      <AnimatePresence>
        {isVerifying && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsVerifying(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-white rounded-[50px] w-full max-w-xl relative overflow-hidden shadow-2xl border border-white/20 pointer-events-auto flex flex-col items-center p-12 text-center space-y-8" >
               <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-3xl flex items-center justify-center shadow-xl shadow-yellow-600/10">
                  <ShieldCheck size={40} />
               </div>
               <div>
                  <h3 className="text-2xl font-black text-slate-900 leading-none italic uppercase italic">Integrity Verification Terminal</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Authorized Metadata Sweep Protocol</p>
               </div>
               
               <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ x: [ -200, 400 ] }} 
                    transition={{ repeat: Infinity, duration: 2 }} 
                    className="w-1/2 h-full bg-yellow-600" 
                  />
               </div>
               
               {isValidating ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Decrypting Matrix Token...</p>
                  </div>
                ) : scannedData ? (
                  <div className="w-full space-y-6 text-left p-6 bg-slate-50 rounded-[32px] border border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Pulse</span>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase">{scannedData.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Ticket ID</p>
                        <p className="text-xs font-black text-slate-900">{scannedData.ticketId}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Seat Node</p>
                        <p className="text-xs font-black text-orange-600">{scannedData.seat}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Unit ID</p>
                        <p className="text-xs font-black text-slate-900">{scannedData.node}</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Verified At</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase">{scannedData.boardingAt}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => { setIsVerifying(false); setScannedData(null); }}
                      className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest"
                    >
                      Authorize Boarding
                    </button>
                  </div>
                 ) : (
                  <>
                    <p className="text-[11px] font-bold text-slate-500 leading-relaxed max-w-xs">
                      Initialize matrix scan to ensure the provided E-Ticket matches high-fidelity 'Vintage Ornate Gold' encryption standards.
                    </p>
                    <div className="relative w-full aspect-square max-w-[280px] bg-slate-50 rounded-[32px] overflow-hidden border border-slate-100 flex items-center justify-center">
                       <QRScanner onScan={handleScan} onClose={() => setIsVerifying(false)} />
                    </div>
                    <div className="flex gap-4 w-full pt-4">
                      <button onClick={() => setIsVerifying(false)} className="flex-1 h-16 bg-slate-50 border border-slate-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-100 transition-all">Abort Protocol</button>
                    </div>
                  </>
                )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
