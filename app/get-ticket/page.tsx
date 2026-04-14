"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Phone, Search, Loader2, Ticket, MapPin, Clock, Calendar, QrCode, ShieldCheck, Download, Zap, X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import dynamic from "next/dynamic";

export default function GetTicketPage() {
  const [phone, setPhone] = useState("");
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [diagnostics, setDiagnostics] = useState<string>("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/bookings/by-phone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      if (res.ok) {
        const data = await res.json();
        setBookings(data);
        setDiagnostics(`Search complete. Clusters queried. Found ${data.length} matches across all nodes.`);
      } else {
        setDiagnostics("Network Link Error: The transit hub returned a structural failure.");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-[#FF9933] selection:text-white relative overflow-x-hidden">
      {/* Background Ornaments */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-5%] left-[-5%] w-[30%] h-[30%] bg-[#FF9933] rounded-full blur-[100px] opacity-20" />
        <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] bg-[#FF9933] rounded-full blur-[100px] opacity-10" />
      </div>

      <div className="relative z-10 w-full min-h-screen border-t-[8px] border-[#FF9933]">

      <nav className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between relative z-10">
        <Link href="/" className="group flex items-center gap-3 bg-zinc-50 hover:bg-zinc-100 px-5 py-2.5 rounded-2xl transition-all border border-zinc-100 shadow-sm">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform text-zinc-900" />
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">Back</span>
        </Link>
        <Image src="/logo2.png" alt="Logo" width={250} height={100} className="h-12 md:h-24 w-auto object-contain" />
        <div className="w-10" /> {/* Spacer */}
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-12 pb-32 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FF9933]/10 border border-[#FF9933]/20 text-[#FF9933] text-[10px] font-black uppercase tracking-[0.3em]"
          >
            <ShieldCheck size={14} /> Secure Access
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900"
          >
            Retrieve Your <span className="text-[#FF9933]">Pass</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-lg max-w-lg mx-auto font-medium"
          >
            Enter your active phone number to synchronize with the JeffBen fleet matrix.
          </motion.p>
        </div>

        {/* Search Form */}
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={handleSearch}
          className="max-w-md mx-auto mb-20 group"
        >
          <div className="relative">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none text-zinc-400 group-focus-within:text-[#FF9933] transition-colors">
              <Phone size={20} />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter Phone Number"
              className="w-full bg-white border border-zinc-200 rounded-[32px] py-6 pl-16 pr-32 focus:outline-none focus:ring-4 focus:ring-[#FF9933]/10 focus:border-[#FF9933] transition-all text-lg font-black tracking-tight placeholder:text-zinc-300 text-zinc-900 shadow-sm"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-[#FF9933] hover:bg-zinc-900 text-white px-8 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-[#FF9933]/20"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Search
            </button>
          </div>
        </motion.form>

        {/* Results Area */}
        <div className="space-y-12">
          {searched && !loading && bookings.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20 bg-zinc-50 rounded-[40px] border border-zinc-100 border-dashed"
            >
              <Ticket size={48} className="mx-auto text-zinc-200 mb-6" />
              <h3 className="text-xl font-black text-zinc-400 uppercase tracking-tight">No Active Tickets Found</h3>
              <p className="text-zinc-400 mt-2 text-sm">We couldn't find any bookings for this phone number.</p>
            </motion.div>
          )}

          <AnimatePresence>
            {bookings.length > 0 && (
              <div className="grid gap-12">
                {bookings.map((booking, idx) => (
                  <motion.div
                    key={booking.id || booking._id || `booking-${idx}`}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="w-full"
                  >
                    {/* Reusing the Ornate Design from my-bookings/page.tsx */}
                    <div className="ticket-container relative bg-[#f7e49f] bg-gradient-to-br from-[#f7e49f] via-[#e5c167] to-[#d4af37] rounded-[20px] md:rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden border-[6px] md:border-[12px] border-[#b8860b]/30 flex flex-col md:flex-row min-h-[550px] md:min-h-[400px]">
                      {/* Authentic Parchment Texture */}
                      <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                      <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
                      
                      {/* Elaborate Outer Gold Bezel */}
                      <div className="absolute inset-0 border-[6px] border-[#d4af37] opacity-80 pointer-events-none" />
                      <div className="absolute inset-[4px] border-[2px] border-[#f7e49f] opacity-60 pointer-events-none" />
                      
                      {/* MAIN TICKET SECTION */}
                      <div className="ticket-main p-8 md:p-14 flex-1 relative border-b-4 md:border-b-0 md:border-r-4 border-dashed border-[#b8860b]/40">
                        <div className="relative z-10 text-center mb-10">
                          <p className="text-xl md:text-2xl font-vintage italic text-[#5d4037]/80 leading-none mb-2">JeffBen</p>
                          <h3 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#5d4037] leading-none mb-2 uppercase">Boarding Pass</h3>
                          <div className="flex items-center justify-center gap-6">
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#5d4037]/40 to-transparent flex-1" />
                            <span className="text-sm md:text-lg font-serif font-bold tracking-[0.4em] text-[#5d4037]/60">E-TICKET</span>
                            <div className="h-[2px] bg-gradient-to-r from-transparent via-[#5d4037]/40 to-transparent flex-1" />
                          </div>
                        </div>

                        <div className="space-y-6 text-left relative z-10 px-4">
                          <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Bus No:</span>
                              <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight">{(booking.busId?.busNumber || "JB-FLEET").replace(/-/g, " ")}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Seat No:</span>
                              <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight">{booking.seats?.[0] || "S-1"}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                            <div className="flex items-center gap-3">
                              <MapPin size={24} className="text-[#5d4037]/80" />
                              <p className="text-lg md:text-xl font-serif text-[#5d4037] italic"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">From:</span> {booking.boardingPoint || "TRANSIT_HUB"}</p>
                            </div>
                            <div className="flex items-center gap-3">
                              <MapPin size={24} className="text-[#5d4037]/80" />
                              <p className="text-lg md:text-xl font-serif text-[#5d4037] italic"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">To:</span> {booking.destination || "END_NODE"}</p>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-b border-[#5d4037]/20 pb-4">
                            <div className="flex items-center gap-4">
                              <Calendar size={22} className="text-[#5d4037]/80" />
                              <p className="text-lg md:text-xl font-serif text-[#5d4037]"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center gap-4">
                              <Clock size={22} className="text-[#5d4037]/80" />
                              <p className="text-lg md:text-xl font-serif text-[#5d4037]"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">Time:</span> {booking.busId?.departureTime || "LIVE"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* STUB / QR */}
                      <div className="ticket-stub p-8 md:p-12 md:w-[320px] flex flex-col justify-between items-center relative overflow-hidden bg-black/5">
                        <div className="relative z-10 flex flex-col items-center gap-4 w-full pt-4">
                          <div className="p-3 bg-white/10 rounded-2xl shadow-inner border border-[#5d4037]/5">
                            <QRCodeSVG
                              value={booking.qrToken || "INVALID"}
                              size={140}
                              fgColor="#2d1a12"
                              bgColor="transparent"
                              level="H"
                            />
                          </div>
                          <p className="text-[10px] font-bold text-[#5d4037]/50 uppercase tracking-widest mt-4">Ticket ID: {booking.ticketId}</p>
                        </div>

                        <div className="w-full mt-10 p-6 border-t-2 border-[#5d4037]/10 no-print">
                           <button 
                              onClick={() => window.print()}
                              className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-[#5d4037] text-[#f7e49f] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-900 transition-all active:scale-95 shadow-lg"
                           >
                              <Download size={16} />
                              Download Ticket
                           </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {/* Diagnostic Plate */}
          <div className="mt-20 border-t border-zinc-100 pt-12 text-center pb-20">
              <p className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.3em] mb-4">Internal Fleet Diagnostics</p>
              <div className="inline-flex items-center gap-3 bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                  <div className={`w-2 h-2 rounded-full ${diagnostics ? "bg-emerald-500" : "bg-zinc-200"}`} />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{diagnostics || "Waiting for signal..."}</span>
              </div>
              <p className="mt-4 text-[9px] text-zinc-400 max-w-xs mx-auto leading-relaxed">Verification nodes prioritize MongoDB cluster with automated fallback to Supabase cloud matrix via phone-matched primary indexing.</p>
          </div>
        </div>
      </div>
    </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .font-vintage { font-family: 'Dancing Script', cursive !important; }
        
        @media print {
          .no-print, nav, form, .diagnostics-plate, button, .Internal-Fleet-Diagnostics { display: none !important; }
          body { 
            background: white !important; 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            margin: 0 !important;
            padding: 0 !important;
          }
          main { background: white !important; padding: 0 !important; margin: 0 !important; }
          .max-w-5xl { max-width: none !important; width: 100% !important; padding: 0 !important; margin: 0 !important; }
          .mt-16, .pt-32 { margin-top: 0 !important; padding-top: 0 !important; }
          .ticket-container { 
            display: block !important;
            box-shadow: none !important; 
            border: 1px solid #b8860b !important;
            page-break-inside: avoid;
            margin: 0 auto !important;
          }
          /* Ensure text and colors are forced visible */
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </main>
  );
}
