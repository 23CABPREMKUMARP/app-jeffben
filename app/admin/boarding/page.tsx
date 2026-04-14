"use client";

import React, { useState } from "react";
import { 
  ClipboardList, 
  Search, 
  Scan, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  ArrowUpRight, 
  Bus, 
  UserCircle, 
  Clock, 
  AlertCircle,
  X,
  Zap,
  Ticket
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRScanner from "@/src/components/ui/QRScanner";


const mockBoardingList = [
  { id: "TX-A1", passenger: "Karthik Raja", seat: "12A", status: "Boarded", time: "09:12 AM", bus: "TN-38-AM-1111" },
  { id: "TX-A2", passenger: "Ananya Devi", seat: "15B", status: "Boarded", time: "09:14 AM", bus: "TN-38-AM-1111" },
  { id: "TX-A3", passenger: "Suresh Prabhu", seat: "04C", status: "Waiting", time: "N/A", bus: "TN-38-AM-1111" },
  { id: "TX-A4", passenger: "Meera Nair", seat: "18A", status: "Boarded", time: "09:18 AM", bus: "TN-38-AM-1111" },
  { id: "TX-A5", passenger: "Vikram Singh", seat: "22B", status: "Not Arrived", time: "N/A", bus: "TN-38-AM-1111" },
];

export default function AdminBoardingPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const handleScan = async (token: string) => {
    setIsValidating(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/bookings/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, scannedBy: "COLLECTOR_CONSOLE", location: "Bus Gate" })
      });
      const data = await res.json();
      
      if (data.success) {
        setScanResult({
          type: "success",
          message: data.message,
          details: data.booking
        });
      } else {
        setScanResult({
          type: "error",
          message: data.message,
          details: data.booking || null
        });
      }
    } catch (err) {
      console.error("Validation error:", err);
      setScanResult({ type: "error", message: "Network Hub Failure" });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Boarding Matrix</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            Live Asset Ingress Oversight
          </p>
        </div>
        <button 
          onClick={() => setIsScanning(true)}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[20px] font-black text-sm tracking-widest hover:bg-black transition-all shadow-xl hover:shadow-black/20 uppercase italic"
        >
          <Scan size={20} /> Terminal QR Scan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Selection / Status Panel */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
              <h3 className="text-lg font-black text-slate-900 leading-none">Active Manifest</h3>
              <div className="space-y-4">
                 <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest pl-2">Select Hub Node</label>
                 <select className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 font-bold text-sm outline-none">
                    <option>TN-38-AM-1111 (CBE → AVIN)</option>
                    <option>TN-38-PL-4444 (CBE → PALL)</option>
                 </select>
              </div>
              <div className="pt-4 space-y-4">
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">Total Manifest</span>
                    <span className="text-slate-900">40 Seats</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold font-serif italic text-emerald-600">
                    <span>Successful Boarding</span>
                    <span>18</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold text-red-500">
                    <span>Awaiting Unit</span>
                    <span>22</span>
                 </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: "45%" }} 
                   className="h-full bg-emerald-500 rounded-full" 
                 />
              </div>
           </div>

           <div className="bg-slate-900 p-8 rounded-[40px] text-white">
              <div className="flex items-center gap-3 mb-6">
                 <Activity size={20} className="text-orange-500" />
                 <h4 className="text-sm font-black uppercase tracking-widest">Protocol Delta</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                 Boarding Protocol Alpha-4 is active. All terminal ingress must be validated via High-Fidelity QR Scan.
              </p>
              <button className="mt-8 w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl flex items-center justify-center font-bold text-[10px] tracking-widest uppercase transition-all">
                 Security Logs &rarr;
              </button>
           </div>
        </div>

        {/* Boarding List Panel */}
        <div className="lg:col-span-3 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
           <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Passenger Manifest List</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time arrival tracking</p>
              </div>
              <div className="relative w-64 group">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600" size={16} />
                 <input 
                   type="text" 
                   placeholder="Search Passenger..." 
                   className="w-full h-11 bg-slate-50 border-none rounded-xl pl-12 pr-4 text-xs font-bold outline-none focus:ring-4 focus:ring-orange-600/5 transition-all"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50">
                    <tr>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Seat</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Sync Time</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Integrity Status</th>
                       <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Gate Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50 font-bold text-sm">
                    {mockBoardingList.map((node, i) => (
                      <tr key={node.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                         <td className="px-8 py-6 text-center">
                            <span className="inline-block px-3 py-1 bg-slate-100 rounded-lg text-xs font-black italic">{node.seat}</span>
                         </td>

                         <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-slate-400">
                               <Clock size={14} />
                               <span className="text-[10px] font-black uppercase tracking-widest">{node.time}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                               node.status === "Boarded" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                               node.status === "Waiting" ? "bg-orange-50 text-orange-600 border border-orange-100" : 
                               "bg-slate-50 text-slate-400 border border-slate-200"
                            }`}>
                               <div className={`w-1.5 h-1.5 rounded-full ${
                                  node.status === "Boarded" ? "bg-emerald-500" : 
                                  node.status === "Waiting" ? "bg-orange-500" : "bg-slate-300"
                               }`} />
                               <span className="text-[9px] font-black uppercase tracking-widest">{node.status}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                           {node.status === "Boarded" ? (
                             <button className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/50">
                               <CheckCircle2 size={18} />
                             </button>
                           ) : (
                             <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black transition-all">Manual Clear</button>
                           )}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>

      {/* Terminal Scan Modal */}
      <AnimatePresence>
        {isScanning && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 pointer-events-none">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsScanning(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl pointer-events-auto" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-slate-950 rounded-[60px] w-full max-w-xl relative overflow-hidden shadow-2xl border border-white/5 pointer-events-auto" >
               <div className="p-10 md:p-14 space-y-10 flex flex-col items-center">
                <div className="flex items-center justify-between w-full">
                   <h3 className="text-xl font-black text-white tracking-widest uppercase italic">Gate Terminal Vector</h3>
                   <button onClick={() => { setIsScanning(false); setScanResult(null); }} className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-all">
                     <X size={28} className="text-slate-600" />
                   </button>
                </div>

                <div className="w-full aspect-square bg-slate-900 rounded-[50px] border border-white/10 relative overflow-hidden flex items-center justify-center">
                   {isValidating ? (
                     <div className="text-center space-y-6">
                        <div className="w-16 h-16 border-4 border-orange-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-black text-white uppercase tracking-widest animate-pulse">Querying Matrix...</p>
                     </div>
                   ) : scanResult ? (
                     <div className="text-center space-y-8 p-10">
                        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${scanResult.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                           {scanResult.type === 'success' ? <CheckCircle2 size={48} /> : <XCircle size={48} />}
                        </div>
                        <div className="space-y-4">
                           <h4 className={`text-2xl font-black uppercase italic ${scanResult.type === 'success' ? 'text-emerald-500' : 'text-red-500'}`}>
                              {scanResult.type === 'success' ? 'AUTHORIZED' : 'DENIED'}
                           </h4>
                           <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{scanResult.message}</p>
                           {scanResult.details && (
                             <div className="pt-4 grid grid-cols-2 gap-4 text-left">
                                <div>
                                   <p className="text-[8px] text-slate-600 uppercase font-black">Seat Node</p>
                                   <p className="text-sm text-white font-black">{scanResult.details.seats?.join(', ') || 'N/A'}</p>
                                </div>
                                <div>
                                   <p className="text-[8px] text-slate-600 uppercase font-black">Unit ID</p>
                                   <p className="text-sm text-white font-black">{scanResult.details.ticketId}</p>
                                </div>
                             </div>
                           )}
                        </div>
                        <button 
                          onClick={() => setScanResult(null)}
                          className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl text-[10px] text-white font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                           Scan Next Unit
                        </button>
                     </div>
                   ) : (
                     <div className="w-full h-full relative">
                        <QRScanner onScan={handleScan} onClose={() => setIsScanning(false)} />
                     </div>
                   )}
                </div>

                <div className="w-full grid grid-cols-2 gap-4">
                   <div className="p-5 bg-white/5 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Gate Status</p>
                      <div className="flex items-center justify-center gap-2">
                         <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                         <span className="text-xs font-black text-white">READY</span>
                      </div>
                   </div>
                   <div className="p-5 bg-white/5 rounded-3xl border border-white/5 text-center">
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Authorization</p>
                      <span className="text-xs font-black text-orange-500 italic uppercase">
                        {isValidating ? 'WAITING' : scanResult ? scanResult.type.toUpperCase() : 'PENDING'}
                      </span>
                   </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
