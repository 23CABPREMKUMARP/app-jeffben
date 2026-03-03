"use client";

import React, { useState } from "react";
import { LocationSelector } from "@/src/components/bus-booking/LocationSelector";
import EnhancedGlobe from "@/src/components/bus-booking/EnhancedGlobe";
import { BusResults } from "@/src/components/bus-booking/BusResults";
import { SeatSelection } from "@/src/components/bus-booking/SeatSelection";
import { PaymentModule } from "@/src/components/bus-booking/PaymentModule";
import { SuccessPage } from "@/src/components/bus-booking/SuccessPage";
import { motion, AnimatePresence } from "framer-motion";

interface Location {
    id: string;
    name: string;
    coords: [number, number];
}

export default function BusBookingPage() {
    const [selection, setSelection] = useState<{ from: Location; to: Location } | null>(null);
    const [searchId, setSearchId] = useState(0);
    const [isSearching, setIsSearching] = useState(false);
    const [isPlayingVideo, setIsPlayingVideo] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [selectedBus, setSelectedBus] = useState<any | null>(null);
    const [bookingStep, setBookingStep] = useState<"search" | "seats" | "payment" | "success">("search");
    const [bookingDetails, setBookingDetails] = useState<any>(null);
    const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const handleSearch = (from: Location, to: Location) => {
        setIsSearching(true);
        setShowResults(false);
        setBookingStep("search");
        setSelection({ from, to });
        setSearchId(prev => prev + 1);
    };

    const handleAnimationComplete = () => {
        setIsSearching(false);
        // Play cinematic video after globe arrival
        setIsPlayingVideo(true);
    };

    const handleVideoEnd = () => {
        setIsPlayingVideo(false);
        setShowResults(true);
        setTimeout(() => {
            const resultsSection = document.getElementById('results-section');
            resultsSection?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    };

    // Fail-safe: Automatically dismiss video after 6 seconds if it hangs
    React.useEffect(() => {
        let timer: NodeJS.Timeout;

        const forceEnd = () => {
            if (isPlayingVideo) {
                console.log("Forced video end");
                handleVideoEnd();
            }
        };

        if (isPlayingVideo) {
            // Shortened 6 second limit
            timer = setTimeout(forceEnd, 6000);

            // Global click/touch to skip
            window.addEventListener('click', forceEnd);
            window.addEventListener('touchstart', forceEnd);
            window.addEventListener('keydown', forceEnd);
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener('click', forceEnd);
            window.removeEventListener('touchstart', forceEnd);
            window.removeEventListener('keydown', forceEnd);
        };
    }, [isPlayingVideo]);

    const handleSelectBus = (bus: any) => {
        setSelectedBus(bus);
        setBookingStep("seats");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleProceedToPayment = (seats: string[], total: number) => {
        setSelectedSeats(seats);
        setTotalAmount(total);
        setBookingStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePaymentSuccess = (details: any) => {
        setBookingDetails({
            ...details,
            busName: selectedBus.name,
            seats: selectedSeats,
            from: selection?.from.name,
            to: selection?.to.name,
            total: totalAmount,
        });
        setBookingStep("success");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (bookingStep === "success" && bookingDetails) {
        return (
            <div className="bg-[#FF6B00] min-h-screen">
                <SuccessPage details={bookingDetails} />
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-[#FF6B00] text-[#333333] overflow-x-hidden font-sans">
            {/* Header / Logo Space */}
            <div className="relative pt-10 px-4">
                <AnimatePresence mode="wait">
                    {bookingStep === "search" && (
                        <motion.div
                            key="search-step"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="space-y-12"
                        >
                            <div className="max-w-7xl mx-auto text-center">
                                <motion.h1
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white"
                                >
                                    Travel Across Tamil Nadu <br />
                                    <span className="text-[#333333]/20">with Comfort</span>
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto font-medium"
                                >
                                    The most trusted bus booking platform for inter-district travel.
                                </motion.p>
                            </div>

                            <div className="max-w-4xl mx-auto">
                                <LocationSelector onSearch={handleSearch} isSearching={isSearching} />
                            </div>

                            <div className="relative h-[650px] w-full max-w-6xl mx-auto overflow-hidden rounded-[40px] border-8 border-white/20 bg-gradient-to-b from-[#FF8C33] to-[#FF6B00] shadow-3xl">
                                <EnhancedGlobe
                                    selection={selection ? { from: selection.from.coords, to: selection.to.coords } : null}
                                    searchId={searchId}
                                    onAnimationComplete={handleAnimationComplete}
                                />

                                <AnimatePresence>
                                    {!selection && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-x-0 bottom-10 flex items-center justify-center pointer-events-none"
                                        >
                                            <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-xl text-[#FF6B00] font-bold text-sm uppercase tracking-widest border-2 border-[#FF6B00]/10">
                                                Select Your Districts Above
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <div id="results-section">
                                <AnimatePresence>
                                    {showResults && selection && (
                                        <BusResults
                                            from={selection.from.name}
                                            to={selection.to.name}
                                            onSelectBus={handleSelectBus}
                                        />
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )}

                    {bookingStep === "seats" && selectedBus && (
                        <motion.div
                            key="seats-step"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <SeatSelection
                                busId={selectedBus.id}
                                pricePerSeat={selectedBus.price}
                                onProceed={handleProceedToPayment}
                                onBack={() => {
                                    setBookingStep("search");
                                    setShowResults(true);
                                }}
                            />
                        </motion.div>
                    )}

                    {bookingStep === "payment" && selectedBus && (
                        <motion.div
                            key="payment-step"
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                        >
                            <PaymentModule
                                summary={{
                                    busName: selectedBus.name,
                                    seats: selectedSeats,
                                    total: totalAmount,
                                    from: selection?.from.name || "",
                                    to: selection?.to.name || "",
                                }}
                                onSuccess={handlePaymentSuccess}
                                onBack={() => setBookingStep("seats")}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Cinematic Video Overlay */}
            <AnimatePresence>
                {isPlayingVideo && (
                    <motion.div
                        key={`video-overlay-${searchId}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        // onClick handled by global listener in useEffect
                        className="fixed inset-0 z-[999999] bg-black/95 flex flex-col items-center justify-center cursor-pointer select-none touch-none"
                    >
                        <video
                            key={`video-${searchId}`}
                            autoPlay
                            muted
                            playsInline
                            className="w-full h-full object-cover pointer-events-none opacity-80"
                            onEnded={handleVideoEnd}
                            onError={(e) => {
                                console.error("Video failed to play", e);
                                handleVideoEnd();
                            }}
                        >
                            <source src="/videos/transition.mp4" type="video/mp4" />
                        </video>

                        {/* Overlay Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="space-y-8"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-white text-3xl font-black uppercase tracking-[0.3em]">Arrived!</h2>
                                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
                                        Preparing your bus results...
                                    </p>
                                </div>

                                <div className="pt-8">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleVideoEnd();
                                        }}
                                        className="pointer-events-auto px-16 py-6 bg-white text-[#FF6B00] rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-110 transition-all active:scale-95 border-none cursor-pointer"
                                    >
                                        Skip Cinematic & View Buses
                                    </button>
                                </div>

                                <p className="text-white/30 text-[9px] font-bold uppercase tracking-[0.2em]">
                                    Or tap anywhere to skip
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <footer className="py-20 text-center text-white/40 text-sm font-bold tracking-widest">
                &copy; 2026 MAGIC BUS &bull; TAMIL NADU TRANSPORT
            </footer>
        </main>
    );
}
