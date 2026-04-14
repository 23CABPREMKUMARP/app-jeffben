"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Ticket, ArrowLeft, Calendar, MapPin, Clock, User, Download, QrCode, Zap, Info, ShieldCheck, Navigation, Bus, CheckCircle, ChevronRight } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function MyBookingsPage() {
   const [bookings, setBookings] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchBookings = async () => {
         try {
            let apiBookings: any[] = [];
            try {
               const res = await fetch("/api/bookings/all");
               if (res.ok) apiBookings = await res.json();
            } catch (e) {
               console.warn("Matrix Hub Offline");
            }

            const localData = localStorage.getItem("jeffben_matrix_passes");
            const localPasses = localData ? JSON.parse(localData) : [];
            const merged = [...apiBookings, ...localPasses];
            const unique = Array.from(new Map(merged.map(b => [b.ticketId || b._id, b])).values());

            setBookings(unique.map((b: any) => ({
               _id: b._id || b.ticketId || `LOCAL-${Math.random().toString(36).substring(2, 11)}`,
               ticketId: b.ticketId || b._id?.toString().substring(b._id.length - 8).toUpperCase() || "JBN-SYNC",
               busDetails: {
                  busNumber: b.busId?.busNumber || b.busNumber || "JB-FLEET",
                  routeName: b.busId?.routeId?.routeName || b.route || "JeffBen Line"
               },
               boardingPoint: b.boardingPoint || "TRANSIT_HUB",
               destination: b.destination || "END_NODE",
               departureTime: b.busId?.departureTime || b.departureTime || "LIVE",
               date: new Date(b.bookingDate || Date.now()).toLocaleDateString(),
               totalAmount: b.totalAmount || 0,
               passengers: (b.passengers && b.passengers.length > 0) ? b.passengers : [{ name: "Commuter", seatNumber: "S-1" }]
            })));
         } catch (e) {
            console.error("Booking discovery error:", e);
         } finally {
            setLoading(false);
         }
      };
      fetchBookings();
   }, []);

   return (
      <main className="min-h-screen bg-white font-sans p-4 md:p-12 text-zinc-900 selection:bg-[#e67e22] selection:text-white relative overflow-x-hidden">
         <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

         <nav className="max-w-7xl mx-auto mb-12 flex items-center justify-between relative z-10 px-6 py-4 bg-zinc-50 border border-zinc-100 rounded-[32px] shadow-sm">
            <Link href="/live-map" className="group flex items-center gap-3 bg-zinc-100/50 hover:bg-zinc-200 px-6 py-2.5 rounded-2xl transition-all active:scale-95 text-zinc-400 hover:text-zinc-900 border border-zinc-100">
               <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
               <span className="text-[10px] font-black uppercase tracking-widest font-sans">Return to hub</span>
            </Link>
            <Image src="/logo2.png" alt="Logo" width={90} height={90} className="w-14 h-14 md:w-20 md:h-20 object-contain" priority style={{ height: "auto" }} />
            <Link href="/admin" className="p-3 bg-zinc-100/50 rounded-2xl hover:bg-zinc-200 transition-all text-zinc-400 border border-zinc-100">
               <ShieldCheck size={18} />
            </Link>
         </nav>

         <div className="max-w-4xl mx-auto relative px-2">
            <div className="mb-16 space-y-3 relative z-10 text-center">
               <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-zinc-900 leading-none"> </h1>
               <p className="text-[10px] font-black text-[#d4af37] uppercase tracking-[0.4em] italic animate-pulse">Synchronizing with JeffBen Matrix Hub...</p>
            </div>

            {loading ? (
               <div className="grid gap-12">
                  {[1].map((i) => (
                     <div key={i} className="h-64 w-full bg-zinc-50 rounded-[40px] animate-pulse border border-zinc-100 shadow-inner" />
                  ))}
               </div>
            ) : bookings.length === 0 ? (
               <div className="text-center py-20 space-y-8 bg-zinc-50/50 rounded-[40px] border-2 border-dashed border-zinc-200">
                  <Ticket size={48} className="mx-auto text-zinc-200" />
                  <h3 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">No Passive Nodes</h3>
                  <Link href="/live-map" className="inline-block bg-[#d4af37] text-white px-10 py-4 rounded-full font-black text-sm tracking-widest hover:bg-[#b8860b] transition-all shadow-lg uppercase italic">Explore &rarr;</Link>
               </div>
            ) : (
               <div className="grid gap-16 md:gap-20 relative z-10 pb-32">
                  {bookings.map((booking) => (
                     <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={booking._id}
                        className="w-full relative group perspective"
                     >
                        {/* VINTAGE ORNATE GOLD TICKET DESIGN */}
                        <div className="ticket-container relative bg-[#f7e49f] bg-gradient-to-br from-[#f7e49f] via-[#e5c167] to-[#d4af37] rounded-[20px] md:rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden border-[6px] md:border-[12px] border-[#b8860b]/30 flex flex-col md:flex-row min-h-[550px] md:min-h-[400px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]">

                           {/* Authentic Parchment Texture */}
                           <div className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]" />
                           <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />

                           {/* Elaborate Outer Gold Bezel */}
                           <div className="absolute inset-0 border-[6px] border-[#d4af37] opacity-80 pointer-events-none" />
                           <div className="absolute inset-[4px] border-[2px] border-[#f7e49f] opacity-60 pointer-events-none" />
                           <div className="absolute inset-[10px] border border-[#5d4037]/20 pointer-events-none" />

                           {/* Ornate Corner Filigree - 3D Embossed Style */}
                           <div className="absolute top-3 left-3 w-16 h-16 pointer-events-none opacity-60">
                              <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#5d4037]/40 w-full h-full">
                                 <path d="M0 10C0 4.47715 4.47715 0 10 0H40C42.7614 0 45 2.23858 45 5C45 7.76142 42.7614 10 40 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 7.76142 45 5 45C2.23858 45 0 42.7614 0 40V10Z" />
                                 <circle cx="15" cy="15" r="4" />
                              </svg>
                           </div>
                           <div className="absolute top-3 right-[320px] w-16 h-16 pointer-events-none opacity-60 -scale-x-100 hidden md:block">
                              <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#5d4037]/40 w-full h-full">
                                 <path d="M0 10C0 4.47715 4.47715 0 10 0H40C42.7614 0 45 2.23858 45 5C45 7.76142 42.7614 10 40 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 7.76142 45 5 45C2.23858 45 0 42.7614 0 40V10Z" />
                                 <circle cx="15" cy="15" r="4" />
                              </svg>
                           </div>
                           <div className="absolute bottom-3 left-3 w-16 h-16 pointer-events-none opacity-60 -scale-y-100">
                              <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#5d4037]/40 w-full h-full">
                                 <path d="M0 10C0 4.47715 4.47715 0 10 0H40C42.7614 0 45 2.23858 45 5C45 7.76142 42.7614 10 40 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 7.76142 45 5 45C2.23858 45 0 42.7614 0 40V10Z" />
                                 <circle cx="15" cy="15" r="4" />
                              </svg>
                           </div>
                           <div className="absolute bottom-3 right-[320px] w-16 h-16 pointer-events-none opacity-60 -scale-x-100 -scale-y-100 hidden md:block">
                              <svg viewBox="0 0 100 100" fill="currentColor" className="text-[#5d4037]/40 w-full h-full">
                                 <path d="M0 10C0 4.47715 4.47715 0 10 0H40C42.7614 0 45 2.23858 45 5C45 7.76142 42.7614 10 40 10H15C12.2386 10 10 12.2386 10 15V40C10 42.7614 7.76142 45 5 45C2.23858 45 0 42.7614 0 40V10Z" />
                                 <circle cx="15" cy="15" r="4" />
                              </svg>
                           </div>

                           {/* Side Ornaments */}
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-x-[160px] w-32 h-6 md:block hidden opacity-60">
                              <svg viewBox="0 0 200 40" className="w-full h-full">
                                 <path d="M0 20C50 0 150 0 200 20" stroke="#8b6914" strokeWidth="4" fill="none" />
                                 <circle cx="100" cy="10" r="5" fill="#d4af37" />
                              </svg>
                           </div>

                           {/* MAIN TICKET SECTION */}
                           <div className="ticket-main p-8 md:p-14 flex-1 relative border-b-4 md:border-b-0 md:border-r-4 border-dashed border-[#b8860b]/40">

                              {/* Header Section */}
                              <div className="relative z-10 text-center mb-10">
                                 <p className="text-xl md:text-2xl font-vintage italic text-[#5d4037]/80 leading-none mb-2">JeffBen</p>
                                 <h3 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#5d4037] leading-none mb-2 uppercase">JeffBen Boarding Pass</h3>
                                 <div className="flex items-center justify-center gap-6">
                                    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#5d4037]/40 to-transparent flex-1" />
                                    <span className="text-sm md:text-lg font-serif font-bold tracking-[0.4em] text-[#5d4037]/60">E-TICKET</span>
                                    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#5d4037]/40 to-transparent flex-1" />
                                 </div>
                              </div>

                              {/* Content Section */}
                              <div className="space-y-6 text-left relative z-10 px-4">
                                 <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                                    <div className="flex flex-col">
                                       <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Bus No:</span>
                                       <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight">{(booking.busDetails?.busNumber || "TN-38-AM-1111").replace(/-/g, " ")}</span>
                                    </div>
                                    <div className="flex flex-col">
                                       <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Seat No:</span>
                                       <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight">{booking.passengers?.[0]?.seatNumber || "15B"}</span>
                                    </div>
                                 </div>

                                 <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                                    <div className="flex items-center gap-3">
                                       <MapPin size={24} className="text-[#5d4037]/80" fill="#5d4037" fillOpacity={0.1} />
                                       <p className="text-lg md:text-xl font-serif text-[#5d4037] italic"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">From:</span> {booking.boardingPoint || "The Transit Hub"}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <MapPin size={24} className="text-[#5d4037]/80" fill="#5d4037" fillOpacity={0.1} />
                                       <p className="text-lg md:text-xl font-serif text-[#5d4037] italic"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">To:</span> {booking.destination || "Metropolis Junction"}</p>
                                    </div>
                                 </div>

                                 <div className="space-y-4 pt-4 border-b border-[#5d4037]/20 pb-4">
                                    <div className="flex items-center gap-4">
                                       <Clock size={22} className="text-[#5d4037]/80" />
                                       <p className="text-lg md:text-xl font-serif text-[#5d4037]"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">Departure:</span> {booking.date} | {booking.departureTime || "10:00 AM"}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                       <Clock size={22} className="text-[#5d4037]/80" />
                                       <p className="text-lg md:text-xl font-serif text-[#5d4037]"><span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60 mr-4">Arrival:</span> Scheduled Gateway</p>
                                    </div>
                                 </div>

                                 <div className="pt-10 text-center relative">
                                    <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#5d4037]/20" />
                                    <p className="text-3xl md:text-5xl font-vintage italic text-[#5d4037]/60 tracking-widest relative z-10 px-8 inline-block">— Enjoy Your Trip! —</p>
                                 </div>
                              </div>
                           </div>

                           {/* TICKET STUB / QR SECTION */}
                           <div className="ticket-stub p-8 md:p-12 md:w-[320px] flex flex-col justify-between items-center relative overflow-hidden bg-black/5">

                              {/* Elaborate Outer Gold Bezel - Stub */}
                              <div className="absolute inset-0 border-[6px] border-[#d4af37] opacity-80 pointer-events-none" />
                              <div className="absolute inset-[4px] border-[2px] border-[#f7e49f] opacity-60 pointer-events-none" />

                              {/* Ornate Corner Filigree - Stub - 3D Style */}
                              <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none z-20">
                                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <path d="M0 0C40 0 50 10 50 40C50 15 35 0 0 0Z" fill="#8b6914" />
                                    <path d="M0 10C25 10 35 20 35 50C35 25 20 10 0 10Z" fill="#d4af37" />
                                 </svg>
                              </div>
                              <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none z-20 -scale-x-100">
                                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <path d="M0 0C40 0 50 10 50 40C50 15 35 0 0 0Z" fill="#8b6914" />
                                    <path d="M0 10C25 10 35 20 35 50C35 25 20 10 0 10Z" fill="#d4af37" />
                                 </svg>
                              </div>
                              <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none z-20 -scale-y-100">
                                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <path d="M0 0C40 0 50 10 50 40C50 15 35 0 0 0Z" fill="#8b6914" />
                                    <path d="M0 10C25 10 35 20 35 50C35 25 20 10 0 10Z" fill="#d4af37" />
                                 </svg>
                              </div>
                              <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none z-20 -scale-x-100 -scale-y-100">
                                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                    <path d="M0 0C40 0 50 10 50 40C50 15 35 0 0 0Z" fill="#8b6914" />
                                    <path d="M0 10C25 10 35 20 35 50C35 25 20 10 0 10Z" fill="#d4af37" />
                                 </svg>
                              </div>
                              {/* QR Code Section */}
                              <div className="relative z-10 flex flex-col items-center gap-4 w-full pt-4">
                                 <div className="grid grid-cols-2 gap-4 w-full border-b border-[#5d4037]/10 pb-4 mb-2 px-4">
                                    <div className="text-center border-r border-[#5d4037]/10 pr-4">
                                       <p className="text-[9px] font-black text-[#5d4037]/40 uppercase tracking-widest">Bus No</p>
                                       <p className="text-sm font-serif font-black text-[#5d4037]">{booking.busDetails?.busNumber || "TN-38-AM-1111"}</p>
                                    </div>
                                    <div className="text-center pl-4">
                                       <p className="text-[9px] font-black text-[#5d4037]/40 uppercase tracking-widest">Seat</p>
                                       <p className="text-sm font-serif font-black text-[#5d4037]">{booking.passengers?.[0]?.seatNumber || "15B"}</p>
                                    </div>
                                 </div>

                                 <div className="p-3 bg-white/10 rounded-2xl group-hover:scale-105 transition-transform duration-500 shadow-inner border border-[#5d4037]/5">
                                    <QRCodeSVG
                                       value={booking.qrToken || btoa(JSON.stringify({
                                          t: booking.ticketId,
                                          m: "LEGACY-NODE"
                                       }))}
                                       size={140}
                                       fgColor="#2d1a12"
                                       bgColor="transparent"
                                       level="H"
                                       className="drop-shadow-sm"
                                    />
                                 </div>
                              </div>

                              <div className="w-full flex items-center justify-between mt-10 relative z-10 p-6 border-t-2 border-[#5d4037]/10 no-print">
                                 <div className="text-left">
                                    <p className="text-[10px] font-bold text-[#5d4037]/50 uppercase tracking-widest">Serial Node</p>
                                    <p className="text-xs font-black text-[#5d4037]">JB-{booking.ticketId?.slice(-10) || "987654321"} </p>
                                 </div>
                                 <button 
                                    onClick={() => window.print()}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-[#5d4037] text-[#f7e49f] rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-zinc-900 transition-all active:scale-95 shadow-lg"
                                 >
                                    <Download size={14} />
                                    Generate Pass
                                 </button>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}

            <div className="mt-24 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] relative z-10 no-print pb-20">
               <div className="flex items-center gap-3"><div className="w-2 h-2 bg-[#d4af37] rounded-full animate-pulse shadow-[0_0_10px_#d4af37]" /> VINTAGE MATRIX SYNC</div>
               <div>© 2024 JEFFBEN SYSTEMS</div>
               <div className="flex items-center gap-3"><ShieldCheck size={16} className="text-[#d4af37]/30" /> AUTHENTIC NODE VERIFIED</div>
            </div>
         </div>

         <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .font-vintage { font-family: 'Dancing Script', cursive !important; }
        
        @media print {
          .no-print { display: none !important; }
          @page { 
            margin: 0; 
            size: landscape; 
          }
          body { 
            background: white !important; 
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          main { padding: 0 !important; background: white !important; min-height: auto !important; }
          nav, h1, .mb-16, .pb-20 { display: none !important; }
          
          .max-w-4xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; }
          .grid.gap-16 { gap: 0 !important; margin: 0 !important; padding: 0 !important; }
          
          .ticket-container {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 0 !important;
            position: relative !important;
            width: 100% !important;
            max-width: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            border: 0 !important;
            min-height: 100vh !important;
            display: flex !important;
            flex-direction: row !important;
            background: linear-gradient(to bottom right, #f7e49f, #e5c167, #d4af37) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .ticket-stub {
            width: 320px !important;
            min-width: 320px !important;
            display: flex !important;
            flex-direction: column !important;
            background: rgba(0, 0, 0, 0.05) !important;
            -webkit-print-color-adjust: exact !important;
            border-left: 2px dashed rgba(0,0,0,0.1) !important;
          }

          .ticket-main {
            flex: 1 !important;
            display: flex !important;
            flex-direction: column !important;
          }

          /* Force visibility of textures and ornaments */
          [class*="bg-[url"], [class*="opacity-"], svg {
             -webkit-print-color-adjust: exact !important;
             print-color-adjust: exact !important;
          }
        }
      `}</style>
      </main>
   );
}
