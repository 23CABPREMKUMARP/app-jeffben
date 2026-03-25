"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Bus, MapPin, Navigation, User, Phone, Mail, ChevronRight, X, CreditCard, Ticket, LayoutDashboard, QrCode, Zap, Info, ShieldCheck, Clock, CheckCircle, ArrowLeft, ArrowRight, Activity, Gauge, Search, Route } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

// Dynamic Import Friendly Map
const LiveBusMap = dynamic(() => import("@/src/components/map/LiveBusMap"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full w-full bg-white rounded-[56px] overflow-hidden border-8 border-zinc-50 shadow-2xl relative">
       <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-amber-600/5 backdrop-blur-3xl animate-pulse" />
       <div className="relative z-10 flex flex-col items-center gap-16">
          <div className="w-32 h-32 border-[6px] border-blue-600/10 border-t-blue-600 rounded-full animate-spin shadow-[0_0_80px_rgba(59,130,246,0.1)] p-8 flex items-center justify-center">
             <div className="w-full h-full border-2 border-blue-500 rounded-full animate-pulse" />
          </div>
          <div className="space-y-4 text-center">
             <p className="text-zinc-900 font-black italic tracking-tight text-2xl">Initializing Live Track</p>
             <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.4em] whitespace-nowrap">Connecting to Transit Hub ... OK</p>
          </div>
       </div>
    </div>
  ),
});

const MOCK_BUSES = [
  {
    _id: "bus1",
    busNumber: "TN-38-EF-2025",
    status: "Running",
    speed: 45,
    fare: 25,
    availableSeats: 25,
    departureTime: "08:00 AM",
    arrivalTime: "09:30 AM",
    currentStop: "Gandhipuram",
    nextStop: "Cross Cut Rd",
    location: { lat: 10.9996, lng: 76.9702, rotation: 50 },
    routeId: {
      routeName: "Avinashi Arterial Matrix",
      from: "Uppilipalayam Hub",
      to: "Peelamedu",
      path: [
        { lat: 10.9996, lng: 76.9702 }, // Highway Node: Uppilipalayam
        { lat: 11.0130, lng: 76.9850 }, // Highway Node: Nava India
        { lat: 11.0267, lng: 77.0016 }  // Highway Node: Peelamedu
      ],
      stops: [
        { _id: "s1", stopName: "Uppilipalayam Terminal", lat: 10.9996, lng: 76.9702 },
        { _id: "s2", stopName: "Nava India Transit", lat: 11.0130, lng: 76.9850 },
        { _id: "s3", stopName: "Peelamedu Airport Ext", lat: 11.0267, lng: 77.0016 }
      ]
    }
  },
  {
    _id: "bus2",
    busNumber: "TN-38-XY-9999",
    status: "Boarding",
    speed: 0,
    fare: 50,
    availableSeats: 12,
    departureTime: "09:30 AM",
    arrivalTime: "11:30 AM",
    currentStop: "Ukkadam",
    location: { lat: 11.0040, lng: 76.9548, rotation: 320 },
    routeId: {
      routeName: "Mettupalayam Highway Strip",
      from: "DB Road Intersect",
      to: "Kavundampalayam",
      path: [
        { lat: 11.0040, lng: 76.9548 }, // Highway Node: DB Road Intersect
        { lat: 11.0200, lng: 76.9500 }, // Highway Node: Saibaba Colony Bypass
        { lat: 11.0350, lng: 76.9420 }  // Highway Node: Kavundampalayam Outskirts
      ],
      stops: [
        { _id: "s4", stopName: "DB Road Exchange", lat: 11.0040, lng: 76.9548 },
        { _id: "s5", stopName: "Saibaba Colony Hub", lat: 11.0200, lng: 76.9500 },
        { _id: "s6", stopName: "Kavundampalayam Post", lat: 11.0350, lng: 76.9420 }
      ]
    }
  }
];

export default function LiveMapBookingPage() {
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [passengerDetails, setPassengerDetails] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [ticketId, setTicketId] = useState("");
  const [layers, setLayers] = useState({
    showBuses: true,
    showRoutes: true,
    showStops: true,
    showTraffic: false,
    showBuildings: false
  });

  const simState = React.useRef(MOCK_BUSES.map(bus => ({
     busId: bus._id,
     segmentIndex: 0,
     progress: 0,
     status: "Boarding",
     stopWaitLeft: 5000, 
     speed: 0.0,
     maxSpeed: 0.00025, // Safely adjusted to match stable 100ms execution frame
     currentRotation: bus.location.rotation || 0,
     targetRotation: bus.location.rotation || 0,
  })));

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const initSimulator = async () => {
      const baseBuses = JSON.parse(JSON.stringify(MOCK_BUSES));
      
      // Auto-Snap Waypoints to Exact Millimeter Road Curves using OSRM
      for (const bus of baseBuses) {
          if (!bus.routeId || !bus.routeId.path) continue;
          const rawNodes = bus.routeId.path; 
          const coordinateString = rawNodes.map((n:any) => `${n.lng},${n.lat}`).join(';');
          
          try {
             // Fetch geometric true-street topology
             const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinateString}?geometries=geojson&overview=full`);
             const data = await res.json();
             
             if (data.code === "Ok" && data.routes[0]) {
                const trueRoadCoordinates = data.routes[0].geometry.coordinates;
                // Swap rigid vectors for ultra-smooth realistic map road lines
                bus.routeId.path = trueRoadCoordinates.map((c:any) => ({ lat: c[1], lng: c[0] }));
             }
          } catch(e) {
             console.error("Simulation OSMR Map-Snapping failed, failing over to grid fallback", e);
          }
      }
      
      setBuses(baseBuses);
      setLoading(false);

      interval = setInterval(() => {
      setBuses(prev => prev.map(bus => {
        const sim = simState.current.find(s => s.busId === bus._id);
        if (!sim || !bus.routeId?.path) return bus;

        const path = bus.routeId.path;

        // 1. Boarding / Wait Routine
        if (sim.status === "Boarding") {
           sim.stopWaitLeft -= 50; 
           if (sim.stopWaitLeft <= 0) sim.status = "Running";
           sim.speed *= 0.8; // Naturally decelerate to perfect stop
        }

        const start = path[sim.segmentIndex];
        const end = path[sim.segmentIndex + 1];
        if (!end) return bus; // Failsafe

        // 2. Compute Intended Geographical Heading
        const dx = end.lng - start.lng;
        const dy = end.lat - start.lat;
        let targetHeading = Math.atan2(dx, dy) * (180 / Math.PI);
        if (targetHeading < 0) targetHeading += 360;
        sim.targetRotation = targetHeading;

        // 3. Smooth Angular Swerve Physics (SLERP-like)
        let diff = sim.targetRotation - sim.currentRotation;
        diff = ((diff + 180) % 360) - 180;
        if (diff < -180) diff += 360;
        
        sim.currentRotation += diff * 0.15; // Smooth turn interpolation per frame
        if (sim.currentRotation < 0) sim.currentRotation += 360;
        if (sim.currentRotation >= 360) sim.currentRotation -= 360;

        // 4. Dynamic Velocity control & Corner Braking
        if (sim.status === "Running") {
           const isTurning = Math.abs(diff) > 15;
           const targetVelocity = isTurning ? (sim.maxSpeed * 0.25) : sim.maxSpeed; // Brake to 25% speed during curves
           sim.speed += (targetVelocity - sim.speed) * 0.1; // Smooth accelerator pedal matching
        }

        // 5. Geographic Cartesian Progression
        const dist = Math.hypot(end.lat - start.lat, end.lng - start.lng);
        const step = dist > 0 ? (sim.speed / dist) : 1; 
        sim.progress += step;

        let isReachedNode = false;
        if (sim.progress >= 1.0) {
           sim.progress = 0;
           sim.segmentIndex++;
           isReachedNode = true;

           if (sim.segmentIndex >= path.length - 1) {
              sim.segmentIndex = 0; 
              
              // End of Route Terminal Sequence: Auto-Reverse the Vector Arrays!
              // The routing Slerp matrix will automatically execute a 3D U-Turn sequence
              // and physically drive the exact structural road vectors backwards!
              bus.routeId.path.reverse();
              if (bus.routeId.stops) bus.routeId.stops.reverse();
              
              sim.status = "Boarding";
              sim.stopWaitLeft = 7000;
           }
        }

        // Exact geographic latitude interpolation
        const newStart = path[sim.segmentIndex];
        const newEnd = path[(sim.segmentIndex + 1) % path.length];
        const lat = newStart.lat + (newEnd.lat - newStart.lat) * sim.progress;
        const lng = newStart.lng + (newEnd.lng - newStart.lng) * sim.progress;

        // Intersection Scanning via proximity radius (50m) to map-snapped OSMR nodes
        if (isReachedNode && bus.routeId.stops) {
           const stopMatchIndex = bus.routeId.stops.findIndex((s:any) => Math.abs(s.lat - newStart.lat) < 0.0005 && Math.abs(s.lng - newStart.lng) < 0.0005);
           
           if (stopMatchIndex !== -1) {
              sim.status = "Boarding";
              sim.stopWaitLeft = 6000;
              
              // Dynamically tie Physics Engine state strictly to HUD Boarding Strings
              bus.currentStop = bus.routeId.stops[stopMatchIndex].stopName;
              const nextIdx = (stopMatchIndex + 1) % bus.routeId.stops.length;
              bus.nextStop = bus.routeId.stops[nextIdx].stopName;
           }
        }

        return {
           ...bus,
           status: sim.status === "Boarding" && sim.speed < 0.00002 ? "Boarding.." : "Running",
           speed: Math.floor(sim.speed * 200000), // Render readable speed
           location: {
              ...bus.location,
              lat,
              lng,
              rotation: sim.currentRotation
           }
        };
      }));
    }, 100); // 100ms Reliable HUD Physics Engine

    return () => clearInterval(interval);
  };
  
  initSimulator();
  }, []);

  const confirmBooking = async () => {
    setLoading(true);
    // Simulate API call to save booking
    const newTicketId = "MTRX-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    try {
      // In a real app, you would fetch('/api/bookings', { method: 'POST', ... })
      console.log("Saving booking:", {
        ticketId: newTicketId,
        busId: selectedBus._id,
        seats: selectedSeats,
        boardingPoint,
        dropPoint,
        passengers: [passengerDetails],
        totalAmount: selectedSeats.length * selectedBus.fare
      });
      
      setTicketId(newTicketId);
      setTimeout(() => {
        setStep(4);
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error("Booking failed", error);
      setLoading(false);
    }
  };

  return (
    <main className="h-screen w-full flex flex-col bg-zinc-50 overflow-hidden font-sans text-zinc-900">
      {/* Premium Header */}
      <header className="h-20 md:h-28 w-full bg-white/80 backdrop-blur-2xl border-b border-zinc-100 flex items-center justify-between px-4 sm:px-8 md:px-16 z-[2000]">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="hover:scale-105 md:hover:scale-110 transition-transform">
            <Image src="/logo2.png" alt="Logo" width={140} height={40} className="object-contain w-[100px] md:w-[180px]" />
          </Link>
          <div className="h-6 md:h-8 w-px bg-zinc-200 mx-2 md:mx-4" />
          <div className="hidden sm:block">
             <h1 className="text-lg md:text-2xl font-black text-zinc-900 tracking-tight">Bus Matrix v2.0</h1>
             <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest leading-none mt-1">Live Tracking Enabled</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/my-bookings" className="group flex items-center gap-3 md:gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-blue-600 transition-all">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-zinc-50 rounded-xl md:rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-md md:shadow-xl group-hover:shadow-blue-600/20">
              <Ticket size={20} className="md:w-6 md:h-6 w-5 h-5" />
            </div>
            <span className="hidden md:block">My Journeys</span>
          </Link>
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white flex items-center justify-center border-[3px] md:border-4 border-zinc-50 shadow-xl md:shadow-2xl cursor-pointer hover:border-blue-600/20 transition-all group overflow-hidden relative">
            <div className="absolute inset-0 bg-blue-600/5 translate-y-20 group-hover:translate-y-0 transition-transform" />
            <User size={24} className="md:w-8 md:h-8 w-6 h-6 text-zinc-400 group-hover:text-blue-600 relative z-10 transition-colors" />
          </div>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col md:flex-row p-0 md:p-8 gap-0 md:gap-8 overflow-hidden md:overflow-visible">
        {/* Map Container - Premium Floating Border */}
        <div className="flex-1 relative overflow-hidden rounded-t-[32px] md:rounded-[56px] border-t-8 border-x-0 md:border-x-[12px] md:border-t-[12px] border-[12px] border-white/60 bg-white/40 backdrop-blur-md shadow-[0_-20px_40px_rgba(0,0,0,0.05)] md:shadow-[0_60px_120px_-20px_rgba(59,130,246,0.15)] group drop-shadow-2xl">
          
          {/* Top HUD UI Overlay */}
          <div className="absolute top-4 md:top-8 left-4 md:left-8 right-4 md:right-8 z-[100] flex flex-col md:flex-row justify-between gap-3 md:gap-4 pointer-events-none">
             
             {/* Search & Routing Pickers */}
             <div className="flex gap-2 md:gap-4 pointer-events-auto w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0 hide-scrollbar-mobile">
               <div className="flex items-center bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl md:rounded-3xl px-3 py-2 md:px-6 md:py-4 shadow-sm flex-1 md:flex-none min-w-[140px] md:min-w-[auto] transition-all focus-within:border-blue-400">
                 <Search size={16} className="text-zinc-400 mr-2 md:mr-4 shrink-0 md:w-5 md:h-5" />
                 <input type="text" placeholder="Search..." className="bg-transparent border-none text-zinc-900 outline-none w-full md:w-64 placeholder-zinc-400 font-extrabold text-xs md:text-base" />
               </div>
               
               <select className="bg-white/90 backdrop-blur-2xl border border-white/50 text-zinc-900 rounded-2xl md:rounded-3xl px-3 md:px-6 py-2 md:py-4 outline-none font-extrabold shadow-sm appearance-none pr-8 md:pr-12 cursor-pointer hover:border-blue-400 transition-all text-xs md:text-base flex-1 md:flex-none min-w-[140px] md:min-w-[auto]">
                  <option>All Active Routes</option>
                  <option>Avinashi Arterial Line</option>
                  <option>Mettupalayam Strip</option>
               </select>
             </div>

             {/* Map Rendering Layer Toggles */}
             <div className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-2xl md:rounded-3xl p-1.5 md:p-3 flex gap-1 md:gap-2 pointer-events-auto shadow-sm overflow-x-auto no-scrollbar self-start md:self-auto max-w-full">
                <button onClick={() => setLayers(l => ({...l, showRoutes: !l.showRoutes}))} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 font-bold text-[10px] md:text-xs transition-all min-w-max ${layers.showRoutes ? "bg-blue-600 text-white" : "bg-black/5 text-zinc-600 hover:text-zinc-900"}`}>
                   <Route size={14} className="md:w-4 md:h-4" /> Paths
                </button>
                <button onClick={() => setLayers(l => ({...l, showBuses: !l.showBuses}))} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 font-bold text-[10px] md:text-xs transition-all min-w-max ${layers.showBuses ? "bg-amber-500 text-white" : "bg-black/5 text-zinc-600 hover:text-zinc-900"}`}>
                   <Bus size={14} className="md:w-4 md:h-4" /> Fleet
                </button>
                <button onClick={() => setLayers(l => ({...l, showStops: !l.showStops}))} className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl flex items-center gap-1.5 md:gap-2 font-bold text-[10px] md:text-xs transition-all min-w-max ${layers.showStops ? "bg-emerald-500 text-white" : "bg-black/5 text-zinc-600 hover:text-zinc-900"}`}>
                   <MapPin size={14} className="md:w-4 md:h-4" /> Hubs
                </button>
             </div>
          </div>

          <LiveBusMap 
            buses={buses} 
            selectedBusId={selectedBus?._id}
            layers={layers}
            onBusClick={(bus) => {
              if (bus.status === "Running") {
                 setIsBooking(false); // Reject panel rendering if the bus is driving!
                 return;
              }
              setSelectedBus(bus);
              setStep(1);
              setIsBooking(true);
            }} 
          />

          {/* Bottom HUD Legend */}
          <div className="hidden md:flex absolute bottom-8 left-8 z-[100] bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[32px] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.08)] pointer-events-auto flex-col gap-5">
             <h4 className="text-blue-600 font-extrabold text-[10px] uppercase tracking-[0.3em]">Map Intelligence</h4>
             <div className="space-y-4">
                 <div className="flex items-center gap-5">
                   <div className="w-10 h-[6px] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                   <span className="text-zinc-700 font-extrabold text-xs uppercase tracking-widest">Active Route Vector</span>
                 </div>
                 <div className="flex items-center gap-5">
                   <div className="w-10 h-1 bg-slate-300 rounded-full" />
                   <span className="text-zinc-400 font-extrabold text-xs uppercase tracking-widest">Standby Network</span>
                 </div>
                 <div className="flex items-center gap-5 pl-3">
                   <div className="w-4 h-4 rounded-full border-[3px] border-blue-600 bg-white shadow-sm" />
                   <span className="text-zinc-700 font-extrabold text-xs uppercase tracking-widest pl-1">Designated Hub</span>
                 </div>
                 <div className="flex items-center gap-5 pl-3">
                   <div className="w-4 h-4 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
                   <span className="text-zinc-700 font-extrabold text-xs uppercase tracking-widest pl-1">Live Telemetry</span>
                 </div>
             </div>
          </div>
        </div>

        {/* Floating Glossy Booking Panel */}
        <AnimatePresence>
          {isBooking && selectedBus && (
            <motion.div
              initial={{ y: "100%", opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: "100%", opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="absolute bottom-0 left-0 right-0 h-[70vh] md:h-auto md:top-10 md:bottom-10 md:right-10 md:left-auto md:w-[500px] bg-white/95 backdrop-blur-3xl rounded-t-[40px] md:rounded-[64px] shadow-[0_-20px_80px_rgba(0,0,0,0.15)] md:shadow-[0_60px_150px_rgba(0,0,0,0.2)] z-[1001] flex flex-col overflow-hidden border-t-[8px] md:border-4 border-white/80 md:border-white pb-6 md:pb-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-transparent pointer-events-none" />

              {/* Panel Header */}
              <div className="p-8 md:p-12 flex items-center justify-between border-b border-zinc-100">
                <div className="space-y-1">
                   <div className="flex items-center gap-3">
                       <span className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest px-3 md:px-4 py-1 md:py-2 rounded-full ${
                          selectedBus.status === "Running" ? "bg-blue-100 text-blue-600" : "bg-amber-100 text-amber-600"
                       }`}>• {selectedBus.status}</span>
                       <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Active Fleet</span>
                   </div>
                   <h2 className="text-4xl font-black text-zinc-900 tracking-tighter mt-2">{selectedBus.busNumber}</h2>
                </div>
                <button 
                  onClick={() => setIsBooking(false)}
                  className="w-14 h-14 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 rounded-3xl transition-all border border-zinc-100 group"
                >
                  <X size={28} className="text-zinc-300 group-hover:text-zinc-600 transition-colors" />
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 overflow-y-auto p-12 space-y-12 no-scrollbar">
                {step === 1 && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-12">
                    <div className="relative p-10 bg-zinc-50/50 rounded-[48px] border border-zinc-100 shadow-inner group">
                      <div className="flex items-center justify-between">
                        <div className="text-center flex-1">
                           <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Departing</div>
                           <div className="text-4xl font-black text-zinc-900">{selectedBus.departureTime}</div>
                           <div className="text-xs font-black text-blue-600 mt-3 flex items-center justify-center gap-2">
                             <MapPin size={12} /> {selectedBus.routeId?.from}
                           </div>
                        </div>
                        <div className="flex flex-col items-center px-8">
                           <div className="w-1 h-20 bg-gradient-to-b from-blue-600/30 to-blue-600 rounded-full" />
                           <Navigation className="text-blue-600 my-[-10px] rotate-90" size={24} />
                        </div>
                        <div className="text-center flex-1">
                           <div className="text-[10px] font-black text-zinc-300 uppercase tracking-widest mb-2">Arrival</div>
                           <div className="text-4xl font-black text-zinc-900">{selectedBus.arrivalTime}</div>
                           <div className="text-xs font-black text-blue-600 mt-3 flex items-center justify-center gap-2 uppercase tracking-tighter">
                             <CheckCircle size={12} /> {selectedBus.routeId?.to}
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                       <div className="p-10 bg-white rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-zinc-50 transition-all hover:shadow-[0_40px_80px_-10px_rgba(59,130,246,0.1)] group">
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3">Ticket Price</p>
                          <p className="text-4xl font-black text-zinc-900 group-hover:text-blue-600 transition-colors">₹{selectedBus.fare}</p>
                       </div>
                       <div className="p-10 bg-white rounded-[40px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-zinc-50 transition-all hover:shadow-[0_40px_80px_-10px_rgba(59,130,246,0.1)] group text-right">
                          <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-3">Available Seats</p>
                          <p className="text-4xl font-black text-zinc-900 group-hover:text-amber-500 transition-colors">{selectedBus.availableSeats}</p>
                       </div>
                    </div>

                    {/* Boarding & Drop Point Selection */}
                    <div className="space-y-6">
                       <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">Journey Details</h3>
                       <div className="grid grid-cols-1 gap-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Boarding Point</label>
                             <select 
                               value={boardingPoint} 
                               onChange={(e) => setBoardingPoint(e.target.value)}
                               className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-3xl px-6 font-bold text-zinc-900 outline-none focus:border-blue-600/30 transition-all"
                             >
                                <option value="">Select Boarding</option>
                                {selectedBus.routeId?.stops?.map((stop: any) => (
                                  <option key={stop._id} value={stop.stopName}>{stop.stopName}</option>
                                ))}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Drop Point</label>
                             <select 
                               value={dropPoint} 
                               onChange={(e) => setDropPoint(e.target.value)}
                               className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-3xl px-6 font-bold text-zinc-900 outline-none focus:border-blue-600/30 transition-all"
                             >
                                <option value="">Select Drop Point</option>
                                {selectedBus.routeId?.stops?.map((stop: any) => (
                                  <option key={stop._id} value={stop.stopName}>{stop.stopName}</option>
                                ))}
                             </select>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <h3 className="text-xs font-black text-zinc-400 uppercase tracking-[0.4em]">Live Intelligence</h3>
                       <div className="p-10 bg-zinc-50/50 rounded-[48px] border border-zinc-100 space-y-8 shadow-inner">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Clock size={16} className="text-blue-600" /></div>
                               <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Next Stop Sequence</span>
                            </div>
                            <span className="text-xs font-black text-zinc-900 uppercase">{selectedBus.nextStop}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-sm"><Activity size={16} className="text-amber-500" /></div>
                               <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Current Velocity</span>
                            </div>
                            <span className="text-xs font-black text-zinc-900 uppercase">{selectedBus.speed} KM/H</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={() => setStep(2)}
                      disabled={!boardingPoint || !dropPoint}
                      className="w-full bg-blue-600 text-white py-8 rounded-[40px] text-2xl font-black uppercase tracking-tighter hover:bg-zinc-900 transition-all shadow-[0_30px_60px_-10px_rgba(59,130,246,0.4)] disabled:opacity-30 active:scale-95 flex items-center justify-center gap-4"
                    >
                      Continue to Seats <ChevronRight size={28} />
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-12">
                    <div className="flex items-center justify-between">
                       <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Select Your Seat</h3>
                       <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Deck-Alpha Manifest</div>
                    </div>
                    
                    <div className="bg-zinc-50 p-16 rounded-[64px] shadow-inner border border-zinc-100 flex justify-center relative overflow-hidden">
                       <div className="absolute top-10 left-10 p-4 bg-white/50 rounded-full border border-zinc-200">
                          <Zap size={24} className="text-blue-600" />
                       </div>
                       <div className="grid grid-cols-4 gap-8 max-w-[340px] relative z-10">
                          {Array.from({ length: 24 }).map((_, i) => (
                             <button
                               key={i}
                               onClick={() => {
                                 const id = `${i+1}`;
                                 if (selectedSeats.includes(id)) setSelectedSeats(selectedSeats.filter(s => s !== id));
                                 else if (selectedSeats.length < 6) setSelectedSeats([...selectedSeats, id]);
                               }}
                               disabled={i % 6 === 1}
                               className={`h-16 w-16 rounded-3xl border-4 transition-all flex items-center justify-center font-black text-xl shadow-xl
                                 ${selectedSeats.includes(`${i+1}`) 
                                    ? "bg-blue-600 border-blue-400 text-white shadow-blue-600/40 translate-y-[-4px]" 
                                    : i % 6 === 1 
                                      ? "bg-zinc-100 border-zinc-50 text-zinc-200 cursor-not-allowed scale-90" 
                                      : "bg-white border-zinc-50 text-zinc-400 hover:border-blue-600/30 hover:text-blue-600 hover:bg-blue-50/50"}`}
                             >
                               {i + 1}
                             </button>
                          ))}
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-around p-8 bg-zinc-50/50 rounded-[40px] border border-zinc-100">
                       <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-lg bg-zinc-100" />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Booked</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-lg bg-blue-600" />
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Selected</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-lg bg-white border border-zinc-100" />
                          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Available</span>
                       </div>
                    </div>

                    <div className="flex gap-8">
                      <button onClick={() => setStep(1)} className="flex-1 h-20 bg-zinc-50 text-zinc-500 rounded-[32px] font-black uppercase tracking-widest border border-zinc-100">Back</button>
                      <button onClick={() => setStep(3)} disabled={selectedSeats.length === 0} className="flex-[2] h-20 bg-blue-600 text-white rounded-[32px] font-black text-xl tracking-tighter hover:bg-zinc-900 transition-all shadow-xl disabled:opacity-20 uppercase">Passenger Details &rarr;</button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
                    <h3 className="text-3xl font-black text-zinc-900 tracking-tighter uppercase">Passenger Intel</h3>
                    <div className="space-y-10">
                       <div className="space-y-3 px-4">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] pl-2">Full Identity Name</label>
                          <div className="relative group">
                            <User className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                            <input 
                              type="text" 
                              placeholder="Johnathan Doe" 
                              value={passengerDetails.name}
                              onChange={(e) => setPassengerDetails({...passengerDetails, name: e.target.value})}
                              className="w-full h-20 bg-zinc-50 border-2 border-zinc-100 rounded-[40px] pl-20 pr-10 font-bold text-xl text-zinc-900 outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-inner" 
                            />
                          </div>
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] pl-2">Phone Vector</label>
                          <div className="relative group">
                            <Phone className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                            <input 
                              type="tel" 
                              placeholder="+91 98765 43210" 
                              value={passengerDetails.phone}
                              onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
                              className="w-full h-20 bg-zinc-50 border-2 border-zinc-100 rounded-[40px] pl-20 pr-10 font-bold text-xl text-zinc-900 outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-inner" 
                            />
                          </div>
                       </div>
                       <div className="space-y-3 px-4">
                          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] pl-2">Neural Email Path</label>
                          <div className="relative group">
                            <Mail className="absolute left-8 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-blue-600 transition-colors" size={24} />
                            <input 
                              type="email" 
                              placeholder="john@example.com" 
                              value={passengerDetails.email}
                              onChange={(e) => setPassengerDetails({...passengerDetails, email: e.target.value})}
                              className="w-full h-20 bg-zinc-50 border-2 border-zinc-100 rounded-[40px] pl-20 pr-10 font-bold text-xl text-zinc-900 outline-none focus:border-blue-600/30 focus:bg-white transition-all shadow-inner" 
                            />
                          </div>
                       </div>
                    </div>

                    <div className="p-10 bg-blue-600 rounded-[48px] shadow-[0_30px_60px_-10px_rgba(59,130,246,0.3)] text-white flex items-center justify-between group cursor-pointer hover:scale-[1.02] transition-transform">
                       <div className="flex items-center gap-6">
                          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20">
                             <CreditCard size={32} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Bill</p>
                             <p className="text-3xl font-black">₹{selectedSeats.length * selectedBus.fare}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Matrix Sync</p>
                          <ShieldCheck size={28} className="ml-auto" />
                       </div>
                    </div>

                    <button 
                      onClick={confirmBooking} 
                      disabled={!passengerDetails.name || !passengerDetails.phone}
                      className="w-full h-20 md:h-28 bg-zinc-900 text-white rounded-[32px] md:rounded-[40px] font-black text-xl md:text-3xl tracking-tighter hover:bg-blue-600 disabled:opacity-30 transition-all shadow-2xl flex items-center justify-center gap-4 md:gap-6 uppercase"
                    >
                      {loading ? <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-white border-t-transparent rounded-full animate-spin" /> : <>Finalize Booking <CheckCircle size={28} className="md:w-9 md:h-9 w-7 h-7" /></>}
                    </button>
                    <button onClick={() => setStep(2)} className="w-full text-zinc-400 font-black uppercase tracking-[0.2em] text-[10px] hover:text-zinc-600 transition-colors pb-8 md:pb-0">Change Seating Arrangement</button>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center space-y-16">
                    <div className="w-40 h-40 bg-green-50 text-green-600 rounded-full flex items-center justify-center border-4 border-green-500/20 shadow-[0_30px_80px_rgba(34,197,94,0.2)]">
                       <CheckCircle size={84} />
                    </div>
                    <div className="space-y-4">
                       <h2 className="text-6xl font-black text-zinc-900 tracking-tighter uppercase italic tracking-tighter">Success!</h2>
                       <p className="text-zinc-500 font-bold max-w-xs mx-auto text-lg">Your seat has been reserved. Neural-ID: <span className="font-black text-blue-600">#{ticketId}</span></p>
                    </div>
                    
                    <div className="p-12 bg-white rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border-4 border-zinc-50 group hover:rotate-3 transition-transform duration-500">
                       <QRCodeSVG value={ticketId} size={180} fgColor="#1e293b" />
                    </div>

                    <div className="w-full space-y-6">
                      <Link href="/my-bookings" className="block w-full h-24 bg-blue-600 text-white rounded-[40px] flex items-center justify-center text-3xl font-black tracking-tighter shadow-2xl shadow-blue-600/20 hover:scale-[1.02] active:scale-95 transition-all uppercase italic">
                         View Ticket
                      </Link>
                      <button onClick={() => { setIsBooking(false); setSelectedBus(null); setStep(1); setSelectedSeats([]); }} className="text-zinc-400 font-black uppercase tracking-widest text-xs hover:text-zinc-900">Return to Grid</button>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
