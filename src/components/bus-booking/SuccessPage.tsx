"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Download, Home, QrCode, Share2, MapPin, Bus } from "lucide-react";
import Link from "next/link";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TicketPDF } from "./TicketPDF";
import { useEffect, useState } from "react";

interface SuccessPageProps {
    details: {
        name: string;
        bookingId: string;
        transactionId: string;
        busName: string;
        seats: string[];
        from: string;
        to: string;
        total: number;
    };
}

export function SuccessPage({ details }: SuccessPageProps) {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="min-h-screen bg-[#FF6B00] pt-10 pb-20 px-4 flex items-center justify-center">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="size-24 rounded-[30px] bg-white mx-auto flex items-center justify-center mb-6 shadow-3xl transform rotate-12"
                    >
                        <Check className="size-12 text-[#FF6B00] stroke-[4]" />
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-black text-white mb-2"
                    >
                        Bon Voyage!
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-white font-bold text-lg"
                    >
                        Ticket confirmed for {details.name}
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[50px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border-b-[12px] border-black/10"
                >
                    {/* Ticket Header */}
                    <div className="bg-[#333333] p-10 flex justify-between items-center text-white">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-[#FF6B00] flex items-center justify-center">
                                <Bus className="size-6 text-white" />
                            </div>
                            <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Reservation No</p>
                                <h3 className="text-2xl font-black tracking-tighter">{details.bookingId}</h3>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Status</p>
                            <h3 className="text-xl font-black text-[#FF6B00]">CONFIRMED</h3>
                        </div>
                    </div>

                    <div className="p-12 space-y-12 relative bg-[#fcfcfc]">
                        {/* Cut-out circles */}
                        <div className="absolute top-[38%] -left-8 size-16 rounded-full bg-[#FF6B00] shadow-inner" />
                        <div className="absolute top-[38%] -right-8 size-16 rounded-full bg-[#FF6B00] shadow-inner" />

                        {/* Route Section */}
                        <div className="flex items-center justify-between gap-8 py-6">
                            <div className="flex-1">
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-3 tracking-widest">Origin District</p>
                                <h4 className="text-3xl font-black text-[#333333] tracking-tight">{details.from}</h4>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <motion.div
                                    animate={{ x: [0, 20, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                >
                                    <Bus className="size-8 text-[#FF6B00]" />
                                </motion.div>
                                <div className="w-32 h-1 bg-black/5 rounded-full relative overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-[#FF6B00]"
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 text-right">
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-3 tracking-widest">Dest District</p>
                                <h4 className="text-3xl font-black text-[#333333] tracking-tight">{details.to}</h4>
                            </div>
                        </div>

                        <div className="h-px bg-black/5 border-t border-dashed border-[#777777]/20" />

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 gap-y-10 gap-x-12">
                            <div>
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-1 tracking-widest">Passenger</p>
                                <p className="text-xl font-black text-[#333333]">{details.name}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-1 tracking-widest">Bus Operator</p>
                                <p className="text-xl font-black text-[#333333]">{details.busName}</p>
                            </div>
                            <div>
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-1 tracking-widest">Seat Count</p>
                                <p className="text-xl font-black text-[#FF6B00]">{details.seats.length} Tickets</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[#777777] text-[10px] font-black uppercase mb-1 tracking-widest">Total Fare</p>
                                <p className="text-3xl font-black text-[#333333]">₹{details.total}</p>
                            </div>
                        </div>

                        {/* QR Section */}
                        <div className="bg-[#f8f8f8] p-10 rounded-[40px] border border-black/5 flex flex-col md:flex-row items-center justify-between gap-10">
                            <div className="bg-white p-6 rounded-[30px] shadow-xl border border-black/5">
                                <QrCode className="size-32 text-[#333333]" />
                            </div>
                            <div className="flex-grow space-y-6 text-center md:text-left">
                                <div>
                                    <p className="text-sm font-black text-[#333333] uppercase tracking-widest">Boarding Pass QR</p>
                                    <p className="text-xs font-bold text-[#777777] mt-2 leading-relaxed">
                                        Scan this code at the bus terminal 15 mins before departure.
                                        Don't forget to carry a valid Govt ID.
                                    </p>
                                </div>
                                <div className="flex items-center justify-center md:justify-start gap-4">
                                    {isClient ? (
                                        <PDFDownloadLink
                                            document={<TicketPDF details={details} />}
                                            fileName={`Ticket_${details.bookingId}.pdf`}
                                            className="h-12 px-6 bg-[#333333] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF6B00] transition-all flex items-center gap-2"
                                        >
                                            {({ loading }: { loading: boolean }) => (
                                                <>
                                                    <Download className="size-4" />
                                                    {loading ? 'Generating...' : 'Download PDF'}
                                                </>
                                            )}
                                        </PDFDownloadLink>
                                    ) : (
                                        <button className="h-12 px-6 bg-[#333333] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#FF6B00] transition-all flex items-center gap-2">
                                            <Download className="size-4" /> Download PDF
                                        </button>
                                    )}
                                    <button className="size-12 bg-black/5 text-[#333333] rounded-xl flex items-center justify-center hover:bg-black/10 transition-all">
                                        <Share2 className="size-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
                    <Link
                        href="/"
                        className="h-16 px-10 rounded-2xl bg-white/10 text-white font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white/20 transition-all text-xs"
                    >
                        <Home className="size-5" /> Exit to Home
                    </Link>
                    <Link
                        href="/bus-booking"
                        className="h-16 px-10 rounded-2xl bg-white text-[#FF6B00] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#f8f8f8] transition-all text-xs shadow-2xl"
                    >
                        Book Another Ride
                    </Link>
                </div>
            </div>
        </div>
    );
}
