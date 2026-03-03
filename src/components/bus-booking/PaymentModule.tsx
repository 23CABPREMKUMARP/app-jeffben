"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock, Mail, Phone, User, CheckCircle2, ChevronRight, Loader2, ShieldCheck } from "lucide-react";

interface PaymentModuleProps {
    summary: {
        busName: string;
        seats: string[];
        total: number;
        from: string;
        to: string;
    };
    onSuccess: (details: any) => void;
    onBack: () => void;
}

export function PaymentModule({ summary, onSuccess, onBack }: PaymentModuleProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate payment processing
        await new Promise((resolve) => setTimeout(resolve, 3000));

        setLoading(false);
        onSuccess({
            ...formData,
            bookingId: "BK" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            transactionId: "TXN" + Date.now(),
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl mx-auto mt-6 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8"
        >
            {/* Left: Passenger Details */}
            <div className="bg-white p-10 md:p-14 rounded-[40px] shadow-2xl border border-white/20">
                <div className="flex items-center gap-4 mb-10">
                    <div className="size-14 rounded-2xl bg-[#f8f8f8] flex items-center justify-center">
                        <User className="size-7 text-[#FF6B00]" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-[#333333]">Passenger Info</h2>
                        <p className="text-[#777777] font-bold text-xs uppercase tracking-widest mt-1">Ticket details will be sent here</p>
                    </div>
                </div>

                <form onSubmit={handlePay} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#777777] ml-2 uppercase tracking-[0.2em]">Full Registered Name</label>
                            <div className="relative">
                                <User className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[#333333]/20" />
                                <input
                                    required
                                    type="text"
                                    placeholder="Enter your name"
                                    className="w-full bg-[#f8f8f8] border-2 border-transparent focus:border-[#FF6B00] rounded-2xl py-5 pl-14 pr-6 text-[#333333] font-bold outline-none transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[#777777] ml-2 uppercase tracking-[0.2em]">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[#333333]/20" />
                                <input
                                    required
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-[#f8f8f8] border-2 border-transparent focus:border-[#FF6B00] rounded-2xl py-5 pl-14 pr-6 text-[#333333] font-bold outline-none transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-[#777777] ml-2 uppercase tracking-[0.2em]">Mobile Number (WhatsApp Preferred)</label>
                        <div className="relative">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-[#333333]/20" />
                            <input
                                required
                                type="tel"
                                placeholder="+91 00000 00000"
                                className="w-full bg-[#f8f8f8] border-2 border-transparent focus:border-[#FF6B00] rounded-2xl py-5 pl-14 pr-6 text-[#333333] font-bold outline-none transition-all"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-10 border-t border-black/5 mt-10">
                        <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-[#f8f8f8] rounded-3xl mb-10 border border-black/5">
                            <div className="size-16 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                <ShieldCheck className="size-8 text-[#FF6B00]" />
                            </div>
                            <div className="flex-grow text-center md:text-left">
                                <p className="text-sm font-black text-[#333333] uppercase tracking-widest">Razorpay 256-bit Secure</p>
                                <p className="text-xs font-bold text-[#777777] mt-1">UPI, Credit/Debit cards & Netbanking protected</p>
                            </div>
                            <Lock className="size-5 text-[#333333]/20 hidden md:block" />
                        </div>

                        <button
                            disabled={loading || !formData.name || !formData.email || !formData.phone}
                            type="submit"
                            className="w-full h-20 bg-[#333333] hover:bg-[#FF6B00] text-white rounded-3xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-4 transition-all shadow-2xl active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-8 animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <CreditCard className="size-7 group-hover:scale-110 transition-transform" />
                                    <span>Secure Pay ₹{summary.total}</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            {/* Right: Summary Card */}
            <div className="space-y-6">
                <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-white/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
                        <CheckCircle2 className="size-32 text-[#333333]" />
                    </div>

                    <h3 className="text-xl font-black text-[#333333] mb-10 uppercase tracking-widest flex items-center gap-3">
                        Summary
                    </h3>

                    <div className="space-y-6 relative z-10">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#777777] uppercase tracking-widest">Bus Details</p>
                            <p className="text-[#333333] font-black text-lg">{summary.busName}</p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#777777] uppercase tracking-widest">Route History</p>
                            <p className="text-[#333333] font-black text-sm flex items-center gap-2">
                                {summary.from} District <ChevronRight className="size-4 text-[#FF6B00]" /> {summary.to} District
                            </p>
                        </div>

                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-[#777777] uppercase tracking-widest">Seats Confirmed</p>
                            <p className="text-[#FF6B00] font-black text-lg">{summary.seats.join(", ")}</p>
                        </div>

                        <div className="h-px bg-black/5 my-8" />

                        <div className="flex justify-between items-end">
                            <span className="text-[#777777] font-black text-xs uppercase tracking-[0.2em]">Net Payable</span>
                            <span className="text-5xl font-black text-[#333333]">₹{summary.total}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onBack}
                    className="w-full h-16 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest transition-all text-xs border border-white/20 active:scale-95"
                >
                    Change Selection
                </button>
            </div>
        </motion.div>
    );
}
