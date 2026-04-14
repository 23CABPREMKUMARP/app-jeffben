"use client";

import React, { useState } from "react";
import { 
  LayoutDashboard, 
  Bus, 
  Users, 
  Map, 
  MapPin, 
  Activity, 
  CalendarCheck, 
  ClipboardList, 
  Ticket, 
  UserCircle, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings,
  Menu,
  X,
  History,
  Shield,
  Search,
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const sidebarLinks = [
  { group: "INTELLIGENCE", links: [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", id: "overview" },
    { icon: Activity, label: "Live Monitoring", href: "/admin/monitoring", id: "monitoring" },
  ]},
  { group: "OPERATIONS", links: [
    { icon: Bus, label: "Buses", href: "/admin/buses", id: "buses" },
    { icon: UserCircle, label: "Drivers", href: "/admin/drivers", id: "drivers" },
    { icon: Map, label: "Routes", href: "/admin/routes", id: "routes" },
    { icon: MapPin, label: "Bus Stops", href: "/admin/stops", id: "stops" },
  ]},
  { group: "TRANSACTIONS", links: [
    { icon: CalendarCheck, label: "Bookings", href: "/admin/bookings", id: "bookings" },
    { icon: ClipboardList, label: "Boarding", href: "/admin/boarding", id: "boarding" },
    { icon: Ticket, label: "E-Tickets", href: "/admin/tickets", id: "tickets" },
    { icon: CreditCard, label: "Payments", href: "/admin/payments", id: "payments" },
  ]},
  { group: "RESOURCES", links: [
    { icon: Users, label: "User Base", href: "/admin/users", id: "users" },
    { icon: BarChart3, label: "Reports", href: "/admin/reports", id: "reports" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications", id: "notifications" },
    { icon: Settings, label: "System", href: "/admin/settings", id: "settings" },
  ]},
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex text-zinc-900 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      <AnimatePresence>
        {!isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(true)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? "w-80" : "w-20"
        } bg-[#1e293b] text-white flex flex-col transition-all duration-500 ease-in-out fixed h-full z-[70] shadow-2xl relative shrink-0`}
      >
        {/* Logo Section */}
        <div className="h-24 flex items-center px-6 border-b border-white/5 shrink-0 overflow-hidden">
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-600/30">
            <Shield size={20} className="text-white fill-white/20" />
          </div>
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-4"
            >
              <h1 className="text-lg font-black tracking-tight leading-none">JEFFBEN</h1>
              <p className="text-[9px] font-bold text-orange-500 tracking-[0.3em] uppercase mt-1">ADMIN MATRIX</p>
            </motion.div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-8 mt-6">
          {sidebarLinks.map((group, idx) => (
            <div key={idx} className="space-y-4">
              {isSidebarOpen && (
                <p className="px-5 text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase leading-none">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.links.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
                  return (
                    <Link 
                      key={link.id}
                      href={link.href}
                      className={`flex items-center gap-4 px-5 py-3 rounded-xl font-bold transition-all group relative overflow-hidden ${
                        isActive 
                          ? "bg-orange-600 text-white shadow-lg shadow-orange-600/20" 
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <link.icon size={20} className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-white"}`} />
                      {isSidebarOpen && (
                        <motion.span 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-sm truncate"
                        >
                          {link.label}
                        </motion.span>
                      )}
                      
                      {/* Active Indicator Strip */}
                      {isActive && isSidebarOpen && (
                        <motion.div 
                          layoutId="active-nav"
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-l-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Profile / Collapse */}
        <div className="p-4 border-t border-white/5 space-y-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl transition-all"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {isSidebarOpen && (
            <div className="p-4 bg-slate-800/50 rounded-2xl flex items-center gap-4 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-orange-600/20 flex items-center justify-center text-orange-500 font-black truncate">
                PK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Prem Kumar</p>
                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Operations</p>
              </div>
              <LogOut size={16} className="text-slate-500 hover:text-red-500 cursor-pointer transition-colors" />
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#f1f5f9]">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 relative z-20 shrink-0 shadow-sm">
          <div className="flex items-center gap-6 flex-1">
             <div className="relative w-full max-w-md group hidden md:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-600 transition-colors" size={18} />
               <input 
                 type="text" 
                 placeholder="Search Matrix Assets..." 
                 className="w-full h-11 bg-slate-100 border-none rounded-xl pl-12 pr-4 text-sm font-bold placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-orange-600/10 transition-all"
               />
             </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Terminal Online</span>
             </div>
             
             <button className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-slate-500 relative">
               <Bell size={20} />
               <div className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
             </button>
             
             <div className="h-8 w-px bg-slate-200 mx-2" />
             
             <Link href="/" className="flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg hover:shadow-black/20">
               <Activity size={16} />
               <span>Matrix Portal</span>
             </Link>
          </div>
        </header>

        {/* Child Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
          {children}
        </main>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  );
}
