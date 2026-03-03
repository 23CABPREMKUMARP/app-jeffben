"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bus, Clock, Shield, Star, Users, MapPin, Armchair } from "lucide-react";

export interface BusData {
    id: string;
    name: string;
    type: string;
    departure: string;
    arrival: string;
    price: number;
    rating: number;
    seats: number;
    amenities: string[];
}

const dummyBuses: BusData[] = [
    {
        id: "1",
        name: "Kavery Connect",
        type: "A/C Sleeper (2+1)",
        departure: "09:30 PM",
        arrival: "06:00 AM",
        price: 1250,
        rating: 4.8,
        seats: 12,
        amenities: ["WiFi", "Water", "Snacks", "Charging"],
    },
    {
        id: "2",
        name: "Royal TN Express",
        type: "Scania Multi-Axle A/C Semi-Sleeper",
        departure: "10:00 PM",
        arrival: "07:30 AM",
        price: 950,
        rating: 4.5,
        seats: 24,
        amenities: ["Water", "Charging", "Movie"],
    },
    {
        id: "3",
        name: "Orange Tours TN",
        type: "Mercedes Benz A/C Sleeper",
        departure: "08:45 PM",
        arrival: "05:15 AM",
        price: 1500,
        rating: 4.9,
        seats: 8,
        amenities: ["WiFi", "Water", "Snacks", "Charging", "Blanket"],
    },
];

interface BusResultsProps {
    from: string;
    to: string;
    onSelectBus?: (bus: BusData) => void;
}

export function BusResults({ from, to, onSelectBus }: BusResultsProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-5xl mx-auto mt-20 mb-20 px-4"
        >
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-black text-white mb-2">Available Buses</h2>
                    <div className="flex items-center gap-3 text-white/70 font-bold bg-white/10 px-6 py-2 rounded-full">
                        <span>{from} District</span>
                        <MapPin className="size-4 text-white" />
                        <span>{to} District</span>
                    </div>
                </div>
                <div className="bg-white px-6 py-2 rounded-full border shadow-xl text-[#333333] font-black text-xs flex items-center gap-3 uppercase tracking-widest whitespace-nowrap">
                    <Shield className="size-4 text-[#FF6B00]" />
                    Verified TN Operators
                </div>
            </div>

            <div className="grid gap-8">
                {dummyBuses.map((bus, index) => (
                    <motion.div
                        key={bus.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group relative bg-white rounded-3xl overflow-hidden shadow-2xl hover:shadow-[#FF6B00]/20 transition-all hover:-translate-y-2 border border-white/50"
                    >
                        <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center">
                            <div className="flex-shrink-0 bg-[#f8f8f8] p-8 rounded-[30px] border border-black/5 group-hover:bg-[#FF6B00] transition-colors">
                                <Bus className="size-12 text-[#FF6B00] group-hover:text-white transition-colors" />
                            </div>

                            <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-8 w-full">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-[#333333] group-hover:text-[#FF6B00] transition-colors">
                                        {bus.name}
                                    </h3>
                                    <p className="text-[#777777] font-bold text-sm tracking-tight">{bus.type}</p>
                                    <div className="flex items-center gap-2 mt-3 bg-[#f8f8f8] w-fit px-3 py-1 rounded-lg">
                                        <Star className="size-4 fill-[#FF6B00] text-[#FF6B00]" />
                                        <span className="text-sm font-black text-[#333333]">{bus.rating}</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center text-center md:text-left">
                                    <div className="text-3xl font-black text-[#333333] mb-1">{bus.departure}</div>
                                    <div className="text-[#FF6B00] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 justify-center md:justify-start">
                                        <Clock className="size-3" /> DEPARTURE
                                    </div>
                                </div>

                                <div className="flex flex-col justify-center text-center md:text-left">
                                    <div className="text-3xl font-black text-[#333333] mb-1">{bus.arrival}</div>
                                    <div className="text-[#777777] text-[10px] font-black uppercase tracking-widest">ARRIVAL</div>
                                </div>

                                <div className="flex flex-col justify-center items-center md:items-end">
                                    <div className="text-4xl font-black text-[#FF6B00]">₹{bus.price}</div>
                                    <div className="text-[#777777] text-[10px] font-black uppercase tracking-widest mt-1">per passenger</div>
                                </div>
                            </div>

                            <div className="flex-shrink-0 w-full md:w-auto text-center">
                                <button
                                    onClick={() => onSelectBus?.(bus)}
                                    className="w-full md:w-48 h-16 bg-[#333333] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-[#FF6B00] transition-all active:scale-95 shadow-lg group/btn flex items-center justify-center gap-3"
                                >
                                    <Armchair className="size-5" />
                                    <span>Select</span>
                                </button>
                                <p className="text-[#777777] text-[10px] font-black uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
                                    <Users className="size-3" /> {bus.seats} SEATS LEFT
                                </p>
                            </div>
                        </div>

                        <div className="px-10 py-4 bg-[#f8f8f8] border-t border-black/5 flex flex-wrap gap-6">
                            {bus.amenities.map((amenity) => (
                                <span key={amenity} className="text-[9px] uppercase tracking-widest text-[#777777] font-black flex items-center gap-1">
                                    <div className="size-1 bg-[#FF6B00] rounded-full" /> {amenity}
                                </span>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
