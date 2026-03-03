"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search, ArrowRightLeft, XCircle, Map as MapIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface Location {
    id: string;
    name: string;
    coords: [number, number]; // [lat, lng]
}

const tnDistricts: Location[] = [
    { id: "1", name: "Ariyalur", coords: [11.1384, 79.0714] },
    { id: "2", name: "Chengalpattu", coords: [12.6841, 79.9836] },
    { id: "3", name: "Chennai", coords: [13.0827, 80.2707] },
    { id: "4", name: "Coimbatore", coords: [11.0168, 76.9558] },
    { id: "5", name: "Cuddalore", coords: [11.7480, 79.7714] },
    { id: "6", name: "Dharmapuri", coords: [12.1273, 78.1582] },
    { id: "7", name: "Dindigul", coords: [10.3673, 77.9803] },
    { id: "8", name: "Erode", coords: [11.3410, 77.7172] },
    { id: "9", name: "Kallakurichi", coords: [11.7371, 78.9619] },
    { id: "10", name: "Kanchipuram", coords: [12.8342, 79.7036] },
    { id: "11", name: "Kanniyakumari", coords: [8.0883, 77.5385] },
    { id: "12", name: "Karur", coords: [10.9601, 78.0766] },
    { id: "13", name: "Krishnagiri", coords: [12.5186, 78.2137] },
    { id: "14", name: "Madurai", coords: [9.9252, 78.1198] },
    { id: "15", name: "Mayiladuthurai", coords: [11.1037, 79.6544] },
    { id: "16", name: "Nagapattinam", coords: [10.7672, 79.8449] },
    { id: "17", name: "Namakkal", coords: [11.2189, 78.1672] },
    { id: "18", name: "Nilgiris", coords: [11.4128, 76.6958] },
    { id: "19", name: "Perambalur", coords: [11.2342, 78.8820] },
    { id: "20", name: "Pudukkottai", coords: [10.3796, 78.8208] },
    { id: "21", name: "Ramanathapuram", coords: [9.3639, 78.8395] },
    { id: "22", name: "Ranipet", coords: [12.9272, 79.3331] },
    { id: "23", name: "Salem", coords: [11.6643, 78.1460] },
    { id: "24", name: "Sivaganga", coords: [9.8503, 78.4856] },
    { id: "25", name: "Tenkasi", coords: [8.9592, 77.3131] },
    { id: "26", name: "Thanjavur", coords: [10.7870, 79.1378] },
    { id: "27", name: "Theni", coords: [10.0117, 77.4728] },
    { id: "28", name: "Thoothukudi", coords: [8.7642, 78.1348] },
    { id: "29", name: "Tiruchirappalli", coords: [10.7905, 78.7047] },
    { id: "30", name: "Tirunelveli", coords: [8.7139, 77.7567] },
    { id: "31", name: "Tirupathur", coords: [12.4930, 78.5677] },
    { id: "32", name: "Tiruppur", coords: [11.1085, 77.3411] },
    { id: "33", name: "Tiruvallur", coords: [13.1446, 79.9120] },
    { id: "34", name: "Tiruvannamalai", coords: [12.2253, 79.0747] },
    { id: "35", name: "Tiruvarur", coords: [10.7661, 79.6344] },
    { id: "36", name: "Vellore", coords: [12.9165, 79.1325] },
    { id: "37", name: "Viluppuram", coords: [11.9401, 79.4861] },
    { id: "38", name: "Virudhunagar", coords: [9.5872, 77.9514] }
];

interface LocationSelectorProps {
    onSearch: (from: Location, to: Location) => void;
    isSearching: boolean;
}

export function LocationSelector({ onSearch, isSearching }: LocationSelectorProps) {
    const [from, setFrom] = useState<Location | null>(null);
    const [to, setTo] = useState<Location | null>(null);
    const [searchFrom, setSearchFrom] = useState("");
    const [searchTo, setSearchTo] = useState("");
    const [showFromList, setShowFromList] = useState(false);
    const [showToList, setShowToList] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const filteredFrom = tnDistricts.filter(d =>
        d.name.toLowerCase().includes(searchFrom.toLowerCase())
    );

    const filteredTo = tnDistricts.filter(d =>
        d.name.toLowerCase().includes(searchTo.toLowerCase())
    );

    const handleSearch = () => {
        if (from && to) {
            if (from.id === to.id) {
                setError("Source and Destination cannot be the same!");
                return;
            }
            setError(null);
            onSearch(from, to);
        }
    };

    const swapLocations = () => {
        const tempFrom = from;
        const tempSearchFrom = searchFrom;
        setFrom(to);
        setSearchFrom(searchTo);
        setTo(tempFrom);
        setSearchTo(tempSearchFrom);
    };

    return (
        <div className="relative z-50 w-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 md:p-10 rounded-[30px] shadow-2xl border border-white/20"
            >
                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto] gap-6 items-end">
                    {/* From District */}
                    <div className="relative group">
                        <label className="text-[10px] font-black text-[#777777] mb-2 block ml-1 uppercase tracking-widest">Starting Point</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="District Name"
                                className="w-full bg-[#f8f8f8] border-2 border-transparent focus:border-[#FF6B00] p-4 pl-12 rounded-2xl text-[#333333] font-bold outline-none transition-all placeholder:text-[#333333]/20"
                                value={from ? from.name : searchFrom}
                                onChange={(e) => {
                                    setSearchFrom(e.target.value);
                                    setFrom(null);
                                    setShowFromList(true);
                                }}
                                onFocus={() => setShowFromList(true)}
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00] size-5" />
                        </div>

                        <AnimatePresence>
                            {showFromList && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-white border border-[#eeeeee] rounded-2xl overflow-hidden shadow-2xl z-[60] max-h-64 overflow-y-auto"
                                >
                                    {filteredFrom.length > 0 ? filteredFrom.map((loc) => (
                                        <div
                                            key={loc.id}
                                            onClick={() => {
                                                setFrom(loc);
                                                setSearchFrom(loc.name);
                                                setShowFromList(false);
                                            }}
                                            className="p-4 hover:bg-[#FF6B00] hover:text-white transition-all text-[#333333] font-bold cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapIcon className="size-4 opacity-50" />
                                                {loc.name}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-400 text-sm">No districts found</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Swap Button */}
                    <div className="flex justify-center pb-1">
                        <button
                            onClick={swapLocations}
                            className="p-4 rounded-full bg-[#f8f8f8] hover:bg-[#FF6B00] text-[#FF6B00] hover:text-white transition-all transform hover:rotate-180 active:scale-90 shadow-sm border border-black/5"
                        >
                            <ArrowRightLeft className="size-5 md:rotate-0 rotate-90" />
                        </button>
                    </div>

                    {/* To District */}
                    <div className="relative group">
                        <label className="text-[10px] font-black text-[#777777] mb-2 block ml-1 uppercase tracking-widest">Destination</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="District Name"
                                className="w-full bg-[#f8f8f8] border-2 border-transparent focus:border-[#FF6B00] p-4 pl-12 rounded-2xl text-[#333333] font-bold outline-none transition-all placeholder:text-[#333333]/20"
                                value={to ? to.name : searchTo}
                                onChange={(e) => {
                                    setSearchTo(e.target.value);
                                    setTo(null);
                                    setShowToList(true);
                                }}
                                onFocus={() => setShowToList(true)}
                            />
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#FF6B00] size-5" />
                        </div>

                        <AnimatePresence>
                            {showToList && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 w-full mt-2 bg-white border border-[#eeeeee] rounded-2xl overflow-hidden shadow-2xl z-[60] max-h-64 overflow-y-auto"
                                >
                                    {filteredTo.length > 0 ? filteredTo.map((loc) => (
                                        <div
                                            key={loc.id}
                                            onClick={() => {
                                                setTo(loc);
                                                setSearchTo(loc.name);
                                                setShowToList(false);
                                            }}
                                            className="p-4 hover:bg-[#FF6B00] hover:text-white transition-all text-[#333333] font-bold cursor-pointer flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <MapIcon className="size-4 opacity-50" />
                                                {loc.name}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="p-4 text-center text-gray-400 text-sm">No districts found</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Search Button */}
                    <div className="pb-1">
                        <button
                            onClick={handleSearch}
                            disabled={!from || !to || isSearching}
                            className={cn(
                                "w-full md:w-48 h-14 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all relative overflow-hidden active:scale-95 shadow-xl",
                                from && to && !isSearching
                                    ? "bg-[#FF6B00] text-white hover:bg-[#E66200] shadow-[#FF6B00]/20"
                                    : "bg-[#f8f8f8] text-[#333333]/20 cursor-not-allowed border border-black/5"
                            )}
                        >
                            {isSearching ? (
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                    <Search className="size-6" />
                                </motion.div>
                            ) : (
                                <>
                                    <Search className="size-5" />
                                    <span>Search</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold"
                    >
                        <XCircle className="size-5" />
                        {error}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
