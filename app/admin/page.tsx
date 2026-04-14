"use client";

import React from "react";
import { 
  Bus, 
  Map as MapIcon, 
  Users, 
  CalendarCheck, 
  Activity, 
  DollarSign, 
  MousePointer2, 
  TrendingUp, 
  AlertCircle,
  Clock,
  ChevronRight,
  ArrowUpRight,
  MoreVertical
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const stats = [
  { label: "Total Asset Fleet", value: "32", icon: Bus, color: "text-blue-600", bg: "bg-blue-50", change: "+4% from prev. month" },
  { label: "Operational Active", value: "28", icon: Activity, color: "text-green-600", bg: "bg-green-50", change: "92% Fleet Utilization" },
  { label: "Matrix Routes", value: "14", icon: MapIcon, color: "text-orange-600", bg: "bg-orange-50", change: "2 New Routes Added" },
  { label: "Passenger Base", value: "1,280", icon: Users, color: "text-purple-600", bg: "bg-purple-50", change: "+12% Growth Index" },
  { label: "Today Bookings", value: "156", icon: CalendarCheck, color: "text-red-600", bg: "bg-red-50", change: "₹ 48,200 Revenue Today" },
  { label: "Monthly Revenue", value: "₹ 8.4L", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", change: "Target Met: 104%" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-10 pb-20">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none">Command Center</h2>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-4 leading-none flex items-center gap-2">
            <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
            Live Enterprise Overview Matrix
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
           <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Today</button>
           <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white rounded-xl shadow-lg">Weekly</button>
           <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900">Monthly</button>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group relative overflow-hidden"
          >
            <div className={`absolute right-0 top-0 w-32 h-32 ${stat.bg} rounded-bl-[100px] -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            <div className="flex items-start justify-between relative z-10">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 shadow-sm`}>
                <stat.icon size={28} />
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500 transition-colors">{stat.label}</p>
                <h4 className="text-4xl font-black text-slate-900 mt-1">{stat.value}</h4>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 relative z-10">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Performance Graph Mockup */}
        <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col group">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Revenue Performance Vector</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Transaction flow over time</p>
            </div>
            <button className="flex items-center gap-2 text-xs font-black text-orange-600 uppercase tracking-widest hover:underline">
              Analytics Module <ArrowUpRight size={14} />
            </button>
          </div>
          
          <div className="flex-1 min-h-[350px] relative">
            <svg viewBox="0 0 800 300" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="50" x2="800" y2="50" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="150" x2="800" y2="150" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="0" y1="250" x2="800" y2="250" stroke="#f1f5f9" strokeWidth="1" />
              
              {/* Area Shadow */}
              <path 
                d="M0 250 Q 100 180, 200 220 T 400 100 T 600 150 T 800 50 L 800 250 L 0 250 Z" 
                fill="url(#gradient)" 
                opacity="0.1"
              />
              
              {/* Main Line */}
              <path 
                d="M0 250 Q 100 180, 200 220 T 400 100 T 600 150 T 800 50" 
                stroke="#ea580c" 
                strokeWidth="4" 
                fill="none" 
                strokeLinecap="round"
                className="drop-shadow-lg"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#fff" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Legend */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                <span key={day} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Status Sidebar */}
        <div className="bg-slate-900 rounded-[40px] border border-slate-800 shadow-2xl p-10 flex flex-col text-white">
           <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold tracking-tight">Fleet Telemetry</h3>
              <Activity size={20} className="text-orange-500 animate-pulse" />
           </div>
           
           <div className="space-y-8 flex-1">
              {[
                { bus: "TN-38-AM-1111", route: "CBE → AVIN", speed: "55km/h", status: "Running", time: "LIVE" },
                { bus: "TN-38-PL-4444", route: "CBE → PALL", speed: "48km/h", status: "Running", time: "LIVE" },
                { bus: "TN-38-XY-2222", route: "AVIN → TIRU", speed: "0km/h", status: "Stopped", time: "Boarding" },
                { bus: "TN-38-KL-7777", route: "CBE → METT", speed: "42km/h", status: "Running", time: "LIVE" },
              ].map((bus, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-2 transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bus.status === "Running" ? "bg-orange-600/20 text-orange-500" : "bg-slate-800 text-slate-500"}`}>
                      <Bus size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-black tracking-tight">{bus.bus}</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-orange-500 transition-colors">{bus.route}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-orange-500">{bus.time}</p>
                    <p className="text-[10px] font-bold text-slate-600 uppercase">{bus.status}</p>
                  </div>
                </div>
              ))}
           </div>
           
           <Link href="/admin/monitoring" className="mt-10 h-16 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl flex items-center justify-center font-bold text-sm tracking-tight transition-all">
              Expansion Monitoring Terminal &rarr;
           </Link>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-10 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Recent Operational Events</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Matrix booking & system logs</p>
          </div>
          <button className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
            <MoreVertical size={20} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Asset / Node</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Operation</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Vector</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Integrity</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-bold text-sm">
              {[
                { node: "TN-38-AM-1111", op: "Boarding Started: Karumathampatti", time: "2m ago", status: "Optimal", color: "bg-emerald-500" },
                { node: "Booking #JEFF-2A5F", op: "Payment Processed: ₹ 450", time: "12m ago", status: "Secured", color: "bg-blue-500" },
                { node: "Route #CBE-AVIN", op: "New Stop Added: Neelambur Bypass", time: "45m ago", status: "Modified", color: "bg-orange-500" },
                { node: "Driver: Senthil Kumar", op: "Shift Alignment: Started CBE Term.", time: "1h ago", status: "Optimal", color: "bg-emerald-500" },
                { node: "System Engine", op: "Integrity Snapshot: Pass 4A", time: "3h ago", status: "Success", color: "bg-emerald-500" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-all duration-300 group">
                  <td className="px-10 py-6 text-slate-900">{row.node}</td>
                  <td className="px-10 py-6 text-slate-500">{row.op}</td>
                  <td className="px-10 py-6 text-slate-400">{row.time}</td>
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                      <span className="text-[10px] font-black tracking-widest uppercase">{row.status}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <button className="text-orange-600 hover:underline">Verify</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50/50 text-center">
           <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] hover:text-orange-600 transition-all">
             Initialize Full Matrix Log Search &rarr;
           </button>
        </div>
      </div>
    </div>
  );
}
