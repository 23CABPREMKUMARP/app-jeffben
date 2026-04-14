"use client";

import React, { useState, useEffect } from "react";
import { 
  CalendarCheck, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Edit3, 
  MoreVertical, 
  UserCircle, 
  CreditCard, 
  ArrowUpRight, 
  CheckCircle2, 
  X, 
  Save, 
  FileText,
  Bus,
  ShieldCheck,
  Zap,
  Printer
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = localStorage.getItem("jeffben_matrix_pass_history");
    if (data) {
      setBookings(JSON.parse(data));
    }
    setIsLoading(false);
  }, []);

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Booking Ledger</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            Global Transaction & Reservation Matrix
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="flex items-center gap-3 bg-white border border-slate-200 text-slate-600 px-6 py-4 rounded-[20px] font-black text-xs tracking-widest hover:bg-slate-50 transition-all uppercase italic">
             <Download size={18} /> Export Log
           </button>
           <button className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic">
             <Zap size={20} /> Force Sync
           </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search Reservations by ID, Passenger, or Bus Fleet..." 
            className="w-full h-14 bg-slate-50 border-none rounded-2xl pl-16 pr-6 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-600/5 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="h-14 px-6 bg-slate-50 hover:bg-slate-100 rounded-2xl flex items-center gap-3 text-sm font-bold text-slate-600 transition-all">
            <Filter size={18} />
            <span>Filter Transactions</span>
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-40 flex flex-col items-center justify-center space-y-6">
            <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Accessing Transaction Vault...</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-40 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
               <CalendarCheck size={40} />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-900 capitalize">Zero Transactions Detected</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Matrix ledger is currently empty for today</p>
            </div>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Reservation ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Node</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity / Value</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-sm">
              {bookings.map((booking, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ShieldCheck size={18} />
                       </div>
                       <div>
                         <p className="text-base font-black text-slate-900 leading-none">JEFF-{booking.id?.slice(-8) || "TX-AX4"}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{new Date(booking.timestamp).toLocaleTimeString()}</p>
                       </div>
                    </div>
                  </td>

                  <td className="px-10 py-8">
                    <div className="flex items-center gap-3">
                      <Bus size={16} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
                      <div>
                        <p className="text-xs font-black">{booking.busDetails?.busNumber || "JB-FLEET"}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{booking.busDetails?.routeName || "General Route"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black uppercase text-slate-900 tracking-widest">Secured</span>
                       </div>
                       <p className="text-xs font-black text-blue-600 italic">₹ {booking.fare || "450"}</p>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-2 px-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm" title="Print Pass">
                        <Printer size={16} />
                      </button>
                      <button className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:bg-red-500 hover:text-white transition-all shadow-sm" title="Abort Transaction">
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
      
      <div className="p-8 bg-blue-900 rounded-[40px] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
         <div className="relative z-10">
            <h3 className="text-2xl font-black italic tracking-tight">Ledger Integrity Snapshot</h3>
            <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mt-2">All transactions are secured via high-fidelity matrix encryption</p>
         </div>
         <div className="flex gap-4 relative z-10">
            <div className="text-center bg-white/5 p-4 rounded-3xl border border-white/5 w-32">
               <p className="text-[8px] font-black uppercase tracking-widest text-blue-300">Volume Today</p>
               <p className="text-2xl font-black">{bookings.length}</p>
            </div>
            <div className="text-center bg-white/5 p-4 rounded-3xl border border-white/5 w-40">
               <p className="text-[8px] font-black uppercase tracking-widest text-blue-300">Verified Flow</p>
               <p className="text-2xl font-black">100%</p>
            </div>
         </div>
      </div>
    </div>
  );
}
