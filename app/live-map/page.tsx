"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { Bus, MapPin, Navigation, User, Phone, Mail, ChevronRight, X, CreditCard, Ticket, LayoutDashboard, QrCode, Zap, Info, Shield, ShieldCheck, Clock, CheckCircle, ArrowLeft, ArrowRight, Activity, Gauge, Search, Route, Camera, Wind, RefreshCw, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";
import QRScanner from "@/src/components/ui/QRScanner";
import { useSearchParams } from "next/navigation";
import * as turf from '@turf/turf';

// --- Types ---
interface BusLocation { lat: number; lng: number; rotation: number; }
interface BusPathNode { lat: number; lng: number; }
interface BusStop { _id: string; stopName: string; lat: number; lng: number; type: 'major' | 'small'; }
interface BusData {
  _id: string;
  busNumber: string;
  status: string;
  speed: number;
  fare: number;
  availableSeats: number;
  departureTime: string;
  arrivalTime: string;
  currentStop?: string;
  nextStop?: string;
  location: BusLocation;
  routeId?: {
    routeName: string;
    from: string;
    to: string;
    path: BusPathNode[];
    stops: BusStop[];
  };
}

// --- Constants ---
const MOCK_BUSES: BusData[] = [
  {
    _id: "bus1",
    busNumber: "TN-38-EF-2025",
    status: "Running",
    speed: 45,
    fare: 25,
    availableSeats: 35,
    departureTime: "08:00 AM",
    arrivalTime: "09:30 AM",
    currentStop: "Gandhipuram",
    location: { lat: 10.9996, lng: 76.9702, rotation: 50 },
    routeId: {
      routeName: "Coimbatore → Mettupalayam",
      from: "Gandhipuram",
      to: "Mettupalayam",
      path: [
        { lat: 10.9996, lng: 76.9702 }, // Gandhipuram
        { lat: 11.0500, lng: 76.9600 }, // Thudiyalur
        { lat: 11.1500, lng: 76.9500 }, // Periyanaickenpalayam
        { lat: 11.2500, lng: 76.9400 }, // Karamadai
        { lat: 11.3000, lng: 76.9366 }  // Mettupalayam
      ],
      stops: [
        { _id: "s1", stopName: "Gandhipuram Central", lat: 10.9996, lng: 76.9702, type: 'major' },
        { _id: "s2", stopName: "Thudiyalur Hub", lat: 11.0500, lng: 76.9600, type: 'major' },
        { _id: "s3", stopName: "Karamadai Point", lat: 11.2500, lng: 76.9400, type: 'major' },
        { _id: "s4", stopName: "Mettupalayam Terminal", lat: 11.3000, lng: 76.9366, type: 'major' }
      ]
    }
  },
  {
    _id: "bus2",
    busNumber: "TN-38-XY-9999",
    status: "Boarding",
    speed: 0,
    fare: 40,
    availableSeats: 22,
    departureTime: "09:30 AM",
    arrivalTime: "11:30 AM",
    currentStop: "Ukkadam",
    location: { lat: 10.9940, lng: 76.9548, rotation: 180 },
    routeId: {
      routeName: "Coimbatore → Pollachi",
      from: "Ukkadam",
      to: "Pollachi",
      path: [
        { lat: 10.9940, lng: 76.9548 }, // Ukkadam
        { lat: 10.8500, lng: 76.9800 }, // Kinathukadavu
        { lat: 10.6620, lng: 77.0060 }  // Pollachi
      ],
      stops: [
        { _id: "s5", stopName: "Ukkadam Hub", lat: 10.9940, lng: 76.9548, type: 'major' },
        { _id: "s6", stopName: "Kinathukadavu Stop", lat: 10.8500, lng: 76.9800, type: 'major' },
        { _id: "s7", stopName: "Pollachi Terminal", lat: 10.6620, lng: 77.0060, type: 'major' }
      ]
    }
  },
  {
    _id: "bus3",
    busNumber: "TN-38-AM-1111",
    status: "Running",
    speed: 55,
    fare: 35,
    availableSeats: 18,
    departureTime: "07:30 AM",
    arrivalTime: "09:00 AM",
    currentStop: "SITRA",
    location: { lat: 11.0300, lng: 77.0400, rotation: 90 },
    routeId: {
      routeName: "Coimbatore → Avinashi",
      from: "Coimbatore",
      to: "Avinashi",
      path: [
        { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        { lat: 11.0300, lng: 77.0400 }, // SITRA
        { lat: 11.1000, lng: 77.1500 }, // Karumathampatti
        { lat: 11.1930, lng: 77.2680 }  // Avinashi
      ],
      stops: [
        { _id: "s8", stopName: "Coimbatore Junction", lat: 11.0168, lng: 76.9558, type: 'major' },
        { _id: "s9", stopName: "SITRA Hub", lat: 11.0300, lng: 77.0400, type: 'major' },
        { _id: "s10", stopName: "Avinashi Terminal", lat: 11.1930, lng: 77.2680, type: 'major' }
      ]
    }
  },
  {
    _id: "bus4",
    busNumber: "TN-38-PL-4444",
    status: "Running",
    speed: 48,
    fare: 30,
    availableSeats: 40,
    departureTime: "10:00 AM",
    arrivalTime: "11:30 AM",
    currentStop: "Singanallur",
    location: { lat: 11.0000, lng: 77.0300, rotation: 110 },
    routeId: {
      routeName: "Coimbatore → Palladam",
      from: "Coimbatore",
      to: "Palladam",
      path: [
        { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        { lat: 11.0000, lng: 77.0300 }, // Singanallur
        { lat: 11.0200, lng: 77.1200 }, // Sulur
        { lat: 11.0000, lng: 77.2880 }  // Palladam
      ],
      stops: [
        { _id: "s11", stopName: "Singanallur Bus Stand", lat: 11.0000, lng: 77.0300, type: 'major' },
        { _id: "s12", stopName: "Sulur Hub", lat: 11.0200, lng: 77.1200, type: 'major' },
        { _id: "s13", stopName: "Palladam Stand", lat: 11.0000, lng: 77.2880, type: 'major' }
      ]
    }
  },
  {
    _id: "bus5",
    busNumber: "TN-38-AR-5555",
    status: "Boarding",
    speed: 0,
    fare: 28,
    availableSeats: 30,
    departureTime: "11:00 AM",
    arrivalTime: "12:30 PM",
    currentStop: "Saravanampatti",
    location: { lat: 11.0700, lng: 77.0000, rotation: 45 },
    routeId: {
      routeName: "Coimbatore → Annur",
      from: "Coimbatore",
      to: "Annur",
      path: [
        { lat: 11.0168, lng: 76.9558 }, // Coimbatore
        { lat: 11.0700, lng: 77.0000 }, // Saravanampatti
        { lat: 11.1500, lng: 77.0500 }, // Kovilpalayam
        { lat: 11.2330, lng: 77.1000 }  // Annur
      ],
      stops: [
        { _id: "s14", stopName: "Saravanampatti Signal", lat: 11.0700, lng: 77.0000, type: 'major' },
        { _id: "s15", stopName: "Kovilpalayam Stop", lat: 11.1500, lng: 77.0500, type: 'major' },
        { _id: "s16", stopName: "Annur Bus Stand", lat: 11.2330, lng: 77.1000, type: 'major' }
      ]
    }
  },
  {
    _id: "bus6",
    busNumber: "TN-38-WA-2024",
    status: "Running",
    speed: 52,
    fare: 35,
    availableSeats: 28,
    departureTime: "08:15 AM",
    arrivalTime: "09:45 AM",
    currentStop: "Ukkadam",
    location: { lat: 11.0168, lng: 76.9639, rotation: 180 },
    routeId: {
      routeName: "Gandhipuram → Walayar",
      from: "Gandhipuram",
      to: "Walayar",
      path: [
        { lat: 11.0168, lng: 76.9639 }, { lat: 11.0084, lng: 76.9698 }, { lat: 11.0065, lng: 76.9723 },
        { lat: 11.0051, lng: 76.9744 }, { lat: 11.0040, lng: 76.9748 }, { lat: 11.0022, lng: 76.9734 },
        { lat: 10.9997, lng: 76.9680 }, { lat: 10.9975, lng: 76.9650 }, { lat: 10.9940, lng: 76.9585 },
        { lat: 10.9877, lng: 76.9616 }, { lat: 10.9780, lng: 76.9660 }, { lat: 10.9720, lng: 76.9665 },
        { lat: 10.9631, lng: 76.9575 }, { lat: 10.9576, lng: 76.9538 }, { lat: 10.9500, lng: 76.9480 },
        { lat: 10.9450, lng: 76.9450 }, { lat: 10.9380, lng: 76.9420 }, { lat: 10.9300, lng: 76.9380 },
        { lat: 10.9250, lng: 76.9350 }, { lat: 10.9210, lng: 76.9325 }, { lat: 10.9160, lng: 76.9295 },
        { lat: 10.9080, lng: 76.9250 }, { lat: 10.9050, lng: 76.9230 }, { lat: 10.8980, lng: 76.9180 },
        { lat: 10.8930, lng: 76.9150 }, { lat: 10.8880, lng: 76.9120 }, { lat: 10.8750, lng: 76.9050 },
        { lat: 10.8550, lng: 76.8850 }, { lat: 10.8400, lng: 76.8700 }, { lat: 10.8250, lng: 76.8500 }
      ],
      stops: [
        { _id: "gw1", stopName: "Gandhipuram Town Bus Stand", lat: 11.0168, lng: 76.9639, type: 'major' },
        { _id: "gw2", stopName: "Womens Polytechnic", lat: 11.0084, lng: 76.9698, type: 'small' },
        { _id: "gw3", stopName: "R.T.O", lat: 11.0065, lng: 76.9723, type: 'small' },
        { _id: "gw4", stopName: "Stanes School", lat: 11.0051, lng: 76.9744, type: 'small' },
        { _id: "gw5", stopName: "Anna Statue", lat: 11.0040, lng: 76.9748, type: 'small' },
        { _id: "gw6", stopName: "D.S.P Office", lat: 11.0022, lng: 76.9734, type: 'small' },
        { _id: "gw7", stopName: "Collector Office", lat: 10.9997, lng: 76.9680, type: 'small' },
        { _id: "gw8", stopName: "Railway Station", lat: 10.9975, lng: 76.9650, type: 'major' },
        { _id: "gw9", stopName: "Town Hall", lat: 10.9940, lng: 76.9585, type: 'major' },
        { _id: "gw10", stopName: "Ukkadam", lat: 10.9877, lng: 76.9616, type: 'major' },
        { _id: "gw11", stopName: "Karumbukadai", lat: 10.9780, lng: 76.9660, type: 'small' },
        { _id: "gw12", stopName: "Athupalam", lat: 10.9720, lng: 76.9665, type: 'small' },
        { _id: "gw13", stopName: "Kuniyamuthur High School", lat: 10.9631, lng: 76.9575, type: 'small' },
        { _id: "gw14", stopName: "Kuniyamuthur", lat: 10.9576, lng: 76.9538, type: 'major' },
        { _id: "gw15", stopName: "Nehru College", lat: 10.9500, lng: 76.9480, type: 'small' },
        { _id: "gw16", stopName: "Edayarpalayam Pirivu", lat: 10.9450, lng: 76.9450, type: 'small' },
        { _id: "gw17", stopName: "Kuniyamuthur Police Station", lat: 10.9380, lng: 76.9420, type: 'small' },
        { _id: "gw18", stopName: "B.K. Pudur", lat: 10.9300, lng: 76.9380, type: 'small' },
        { _id: "gw19", stopName: "Kovaipudur Pirivu", lat: 10.9250, lng: 76.9350, type: 'small' },
        { _id: "gw20", stopName: "Milekal", lat: 10.9210, lng: 76.9325, type: 'small' },
        { _id: "gw21", stopName: "Gandhi Nagar", lat: 10.9160, lng: 76.9295, type: 'small' },
        { _id: "gw22", stopName: "Madukkarai Police Station", lat: 10.9080, lng: 76.9250, type: 'major' },
        { _id: "gw23", stopName: "Madukkarai Union Office", lat: 10.9050, lng: 76.9230, type: 'small' },
        { _id: "gw24", stopName: "Marappalam", lat: 10.8980, lng: 76.9180, type: 'small' },
        { _id: "gw25", stopName: "Chettipalayam Pirivu", lat: 10.8930, lng: 76.9150, type: 'small' },
        { _id: "gw26", stopName: "Indian Bank", lat: 10.8880, lng: 76.9120, type: 'small' },
        { _id: "gw27", stopName: "Thirumalayampalayam Pirivu", lat: 10.8750, lng: 76.9050, type: 'small' },
        { _id: "gw28", stopName: "K.G. Chavadi", lat: 10.8550, lng: 76.8850, type: 'major' },
        { _id: "gw29", stopName: "Aallamara", lat: 10.8400, lng: 76.8700, type: 'small' },
        { _id: "gw30", stopName: "Walayar (Last Stop)", lat: 10.8250, lng: 76.8500, type: 'major' }
      ]
    }
  }
];

// --- Sub Components (Memoized for Performance) ---
const LiveBusMap = dynamic(() => import("@/src/components/map/LiveBusMap"), {
  ssr: false,
});

const MapLoadingSkeleton = React.memo(() => (
  <div className="flex items-center justify-center h-full w-full bg-white rounded-[56px] overflow-hidden border-8 border-zinc-50 shadow-2xl relative">
    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-amber-600/5 backdrop-blur-3xl animate-pulse" />
    <div className="relative z-10 flex flex-col items-center gap-16">
      <div className="w-32 h-32 border-[6px] border-primary/10 border-t-primary rounded-full animate-spin p-8 flex items-center justify-center">
        <div className="w-full h-full border-2 border-orange-500 rounded-full animate-pulse" />
      </div>
      <div className="space-y-4 text-center">
        <p className="text-zinc-900 font-black italic tracking-tight text-2xl">Initializing Live Track</p>
        <p className="text-zinc-400 text-[10px] uppercase font-black tracking-[0.4em] whitespace-nowrap">Connecting to Transit Hub ... OK</p>
      </div>
    </div>
  </div>
));
MapLoadingSkeleton.displayName = "MapLoadingSkeleton";



export default function LiveMapBookingPage() {
  return (
    <React.Suspense fallback={<MapLoadingSkeleton />}>
      <LiveMapContent />
    </React.Suspense>
  );
}

function LiveMapContent() {
  const [buses, setBuses] = useState<any[]>([]);
  const [selectedBus, setSelectedBus] = useState<any>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [ticketId, setTicketId] = useState("");
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [boardingPoint, setBoardingPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [passengerDetails, setPassengerDetails] = useState({ phone: "", seatNumber: "" });
  const [loading, setLoading] = useState(true);
  const [showBusQR, setShowBusQR] = useState(false);
  const [layers, setLayers] = useState({
    showBuses: true,
    showRoutes: false,
    showMajorStops: true,
    showSmallStops: true,
    showTraffic: false,
    showBuildings: true
  });
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLiveLocationOn, setIsLiveLocationOn] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showNearbyOnly, setShowNearbyOnly] = useState(false);
  const [nearbyRadius] = useState(5); // 5km
  const [centerOn, setCenterOn] = useState<{ lat: number, lng: number } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [navTarget, setNavTarget] = useState<any>(null);
  const [navPath, setNavPath] = useState<any>(null);
  const [navStats, setNavStats] = useState<{ distance: number, duration: number } | null>(null);
  const [navMode, setNavMode] = useState<'driving' | 'walking'>('walking');
  const [isNavigating, setIsNavigating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideNearestCard, setHideNearestCard] = useState(false);

  const busesRef = useRef(buses);
  useEffect(() => {
    busesRef.current = buses;
  }, [buses]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const lower = searchQuery.toLowerCase();
    return buses.filter(b =>
      b.busNumber.toLowerCase().includes(lower) ||
      (b.routeId?.routeName && b.routeId.routeName.toLowerCase().includes(lower)) ||
      (b.routeId?.from && b.routeId.from.toLowerCase().includes(lower)) ||
      (b.routeId?.to && b.routeId.to.toLowerCase().includes(lower))
    );
  }, [searchQuery, buses]);

  const watchIdRef = useRef<number | null>(null);
  const searchParams = useSearchParams();

  // --- Initial Data Load ---
  useEffect(() => {
    const fetchLiveBuses = async () => {
      try {
        const res = await fetch("/api/buses");
        if (res.ok) {
          const data = await res.json();
          // Map real DB buses to the simulator's expected format if necessary
          const matrixBuses = data.map((b: any) => ({
            ...b,
            _id: b._id,
            location: {
              lat: b.location?.lat || b.location?.latitude || 11.0168,
              lng: b.location?.lng || b.location?.longitude || 76.9558,
              rotation: b.location?.rotation || 0
            }
          }));
          setBuses(matrixBuses.length > 0 ? matrixBuses : MOCK_BUSES);
        } else {
          setBuses(MOCK_BUSES);
        }
      } catch (e) {
        console.warn("TRANSIT HUB OFFLINE: Using simulated matrix grid.");
        setBuses(MOCK_BUSES);
      } finally {
        setLoading(false);
      }
    };
    fetchLiveBuses();
  }, []);

  // --- Live Location Logic ---
  const toggleLiveLocation = () => {
    if (isLiveLocationOn) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setUserLocation(null);
      setLocationError(null);
      setIsLiveLocationOn(false);
      setShowNearbyOnly(false);
    } else {
      setHideNearestCard(false);
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser.");
        return;
      }

      const success = (pos: GeolocationPosition) => {
        const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(newLoc);
        setLocationError(null);
      };

      const error = (err: GeolocationPositionError) => {
        // Set fallback to user's real-world location (Palladam, TN) since localhost testing blocks live GPS
        setTimeout(() => {
          setUserLocation({ lat: 11.0000, lng: 77.2880 });
          setLocationError(null);
        }, 1000);

        // On fatal user permission denial, reset toggle
        if (err.code === 1) setIsLiveLocationOn(false);
      };

      watchIdRef.current = navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy: false, // Less strictly accurate to avoid common timeout on some devices
        timeout: 15000,
        maximumAge: 0
      });
      setIsLiveLocationOn(true);
      setLocationError("Syncing...");
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Handle QR scanning
  const handleQRScan = React.useCallback((decodedText: string) => {
    setIsScanning(false);
    let busId = decodedText;

    // Support both raw ID and URL formats
    if (decodedText.startsWith("{")) {
      try {
        const data = JSON.parse(decodedText);
        busId = data.busId || data.id;
      } catch (e) { }
    } else if (decodedText.includes("busId=")) {
      busId = decodedText.split("busId=")[1].split("&")[0];
    }

    const foundBus = busesRef.current.find(b => b._id === busId || b.busNumber === busId);
    if (foundBus) {
      setSelectedBus(foundBus);
      setIsBooking(true);
      setStep(1); // Open Boarding Details
    } else {
      alert("Electronic Signature mismatch. Bus not found in fleet grid.");
    }
  }, []);

  // URL Bus Selection Auto-Trigger
  useEffect(() => {
    const busId = searchParams.get("busId");
    if (busId && buses.length > 0) {
      const foundBus = buses.find(b => b._id === busId);
      if (foundBus) {
        setSelectedBus(foundBus);
        setIsBooking(true);
        setStep(1);
      }
    }
  }, [searchParams, buses]);

  // Nearby Proximity Logic
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Navigation Logic
  const fetchNavigationPath = async (from: { lat: number, lng: number }, to: { lat: number, lng: number }, profile: 'driving' | 'walking' = 'walking') => {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data.code === "Ok" && data.routes && data.routes[0]) {
        setNavPath(data.routes[0].geometry);
        setNavStats({
          distance: +(data.routes[0].distance / 1000).toFixed(1),
          duration: Math.round(data.routes[0].duration / 60)
        });
        return true;
      }
    } catch (e) {
      console.warn("Navigation fetch failed", e);
    }
    return false;
  };

  const startNavigation = async (target: any) => {
    if (!userLocation) {
      setLocationError("Turn on GPS to navigate");
      return;
    }
    setNavTarget(target);
    const success = await fetchNavigationPath(userLocation, target.location || target);
    if (success) {
      setIsNavigating(true);
      setShowNearbyOnly(false);
      // Zoom to route handled in map via centerOn or map effect
    }
  };

  const clearNavigation = () => {
    setIsNavigating(false);
    setNavTarget(null);
    setNavPath(null);
    setNavStats(null);
  };

  // Recalculate Navigation if user or target moves
  useEffect(() => {
    if (isNavigating && userLocation && navTarget) {
      const targetLoc = navTarget.location || navTarget;
      fetchNavigationPath(userLocation, targetLoc, navMode);
    }
  }, [userLocation, navTarget?.location?.lat, navTarget?.location?.lng, isNavigating, navMode]);

  const filteredBuses = useMemo(() => {
    if (!showNearbyOnly) return buses;
    if (!userLocation) return [];
    const nearby = buses.filter(bus =>
      getDistance(userLocation.lat, userLocation.lng, bus.location.lat, bus.location.lng) <= nearbyRadius
    );
    // CRITICAL FIX: If user is testing outside physical city limits (>5km), never return empty array!
    // Always fall back to showing the absolute closest bus in the active fleet so the map never dies.
    if (nearby.length === 0 && buses.length > 0) {
      let min = Infinity;
      let closest = null;
      buses.forEach(b => {
        const d = getDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
        if (d < min) { min = d; closest = b; }
      });
      return closest ? [closest] : [];
    }
    return nearby;
  }, [buses, userLocation, showNearbyOnly, nearbyRadius]);

  const nearestBus = useMemo(() => {
    if (!userLocation || buses.length === 0) return null;
    let min = Infinity;
    let closest = null;
    buses.forEach(b => {
      const d = getDistance(userLocation.lat, userLocation.lng, b.location.lat, b.location.lng);
      if (d < min) { min = d; closest = b; }
    });
    return closest;
  }, [userLocation, buses]);

  // Auto-Navigate to nearest bus immediately when user hits Nearby
  useEffect(() => {
    if (showNearbyOnly && userLocation && nearestBus && !isNavigating) {
      startNavigation(nearestBus);
    }
  }, [showNearbyOnly, userLocation, nearestBus, isNavigating]);

  const simState = React.useRef(MOCK_BUSES.map(bus => ({
    busId: bus._id,
    segmentIndex: 0,
    progress: 0,
    status: "Boarding",
    stopWaitLeft: 5000,
    speed: 0.0,
    maxSpeed: 0.00025,
    currentRotation: bus.location.rotation || 0,
    targetRotation: bus.location.rotation || 0,
  })));

  useEffect(() => {
    let frameId: number;
    let lastTime = performance.now();
    const initSimulator = async () => {
      const baseBuses = JSON.parse(JSON.stringify(MOCK_BUSES));
      setBuses(baseBuses);
      setLoading(false);
      baseBuses.forEach(async (bus: any) => {
        if (!bus.routeId || !bus.routeId.path) return;
        let newPath = [...bus.routeId.path];
        const coordinateString = bus.routeId.path.map((n: any) => `${n.lng},${n.lat}`).join(';');
        try {
          const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinateString}?overview=full&geometries=geojson`);
          const data = await res.json();
          if (data.code === "Ok" && data.routes && data.routes[0]) {
            newPath = data.routes[0].geometry.coordinates.map((c: any) => ({ lat: c[1], lng: c[0] }));
          }
        } catch (e) { console.warn(`OSRM failed:`, e); }

        // ARTIFICIAL SMOOTHING: Rebuild physical map structure into gorgeous bezier arcs seamlessly 
        if (newPath.length >= 2) {
          try {
            const line = turf.lineString(newPath.map((p: any) => [p.lng, p.lat]));
            // A resolution of ~2000 dynamically guarantees incredibly smooth aesthetic bends
            const curved = turf.bezierSpline(line, { resolution: 2000, sharpness: 0.85 });
            newPath = curved.geometry.coordinates.map((c: any) => ({ lat: c[1], lng: c[0] }));
          } catch (e) { console.warn("Turf bezier failed", e); }
        }

        setBuses(prev => prev.map(b => b._id === bus._id ? { ...b, routeId: { ...b.routeId, path: newPath } } : b));
      });
      const loop = (currentTime: number) => {
        const dt = currentTime - lastTime;
        // THROTTLED TO 3.3 FPS: Massive CPU + Battery saver on low-end hardware. 
        // WebGL LERP engine handles the 60FPS visual fidelity decoupling.
        if (dt >= 300) {
          lastTime = currentTime;
          setBuses(prev => prev.map(bus => {
            const sim = simState.current.find(s => s.busId === bus._id);
            if (!sim || !bus.routeId?.path) return bus;
            const path = bus.routeId.path;
            if (sim.status === "Boarding") {
              sim.stopWaitLeft -= 100;
              if (sim.stopWaitLeft <= 0) sim.status = "Running";
              sim.speed *= 0.8;
            }
            let start = path[sim.segmentIndex];
            let end = path[sim.segmentIndex + 1];
            if (!end) return bus;

            // True distance handling: carry over excess progress mathematically to prevent corner-cutting and jumping
            let dist = Math.hypot(end.lat - start.lat, end.lng - start.lng);

            // Time-stabilized velocity step
            const distanceToMove = dist > 0 ? (sim.speed * (dt / 250)) : 0;
            sim.progress += dist > 0 ? (distanceToMove / dist) : 1;

            while (sim.progress >= 1.0) {
              sim.progress -= 1.0;
              sim.segmentIndex++;
              if (sim.segmentIndex >= path.length - 1) {
                sim.segmentIndex = 0;
                bus.routeId.path.reverse();
                if (bus.routeId.stops) bus.routeId.stops.reverse();
                sim.currentRotation = (sim.currentRotation + 180) % 360; // FLIP 180 AT TERMINAL
                sim.status = "Boarding";
                sim.stopWaitLeft = 8000;
                sim.progress = 0;
                break;
              }
            }

            start = path[sim.segmentIndex];
            end = path[sim.segmentIndex + 1] || start;
            dist = Math.hypot(end.lat - start.lat, end.lng - start.lng);

            const dx = end.lng - start.lng;
            const dy = end.lat - start.lat;
            let targetHeading = Math.atan2(dx, dy) * (180 / Math.PI);
            if (targetHeading < 0) targetHeading += 360;
            sim.targetRotation = targetHeading;

            let diff = sim.targetRotation - sim.currentRotation;
            diff = ((diff % 360) + 360) % 360;
            if (diff > 180) diff -= 360;
            sim.currentRotation += diff * 0.2;
            sim.currentRotation = ((sim.currentRotation % 360) + 360) % 360;

            if (sim.status === "Running") {
              const isTurning = Math.abs(diff) > 20;
              sim.speed += ((isTurning ? sim.maxSpeed * 0.4 : sim.maxSpeed) - sim.speed) * 0.15;
            }

            const lat = start.lat + (end.lat - start.lat) * sim.progress;
            const lng = start.lng + (end.lng - start.lng) * sim.progress;
            return { ...bus, status: sim.status === "Boarding" && sim.speed < 0.00002 ? "Boarding.." : "Running", speed: Math.floor(sim.speed * 220000), location: { ...bus.location, lat, lng, rotation: sim.currentRotation } };
          }));
        }
        frameId = requestAnimationFrame(loop);
      };
      frameId = requestAnimationFrame(loop);
    };
    initSimulator();
    return () => cancelAnimationFrame(frameId);
  }, []);

  const confirmBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        busId: selectedBus._id,
        boardingPoint: boardingPoint,
        destination: dropPoint,
        totalAmount: ticketQuantity * (selectedBus?.fare || 0),
        passengers: [passengerDetails], // Matching the schema expectation
        seats: Array.from({ length: ticketQuantity }, (_, i) => `S-${Math.floor(Math.random() * 50) + 1}`),
        userId: "USER_CURRENT_MATRIX" // Placeholder for current session
      };

      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success && data.booking) {
        setTicketId(data.booking.ticketId);

        // Resilience Backup: Local Node Persistence
        try {
          const localData = localStorage.getItem("jeffben_matrix_passes");
          const localPasses = localData ? JSON.parse(localData) : [];
          localStorage.setItem("jeffben_matrix_passes", JSON.stringify([data.booking, ...localPasses]));
        } catch (storageError) {
          console.warn("Local Registry Sync Failed:", storageError);
        }

        // Optimize local fleet count for immediate UI feedback
        setBuses(prev => prev.map(bus => bus._id === selectedBus?._id ? { ...bus, availableSeats: bus.availableSeats - ticketQuantity } : bus));
        setStep(4);
      } else {
        alert("CRITICAL SYNC ERROR: System failed to commit booking to matrix records.");
      }
    } catch (e) {
      console.error("CRITICAL BOOKING ERROR:", e);
      alert("NETWORK FAILURE: Unable to reach transit hub.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="h-[100dvh] w-full flex flex-col bg-zinc-50 overflow-hidden font-sans text-zinc-900 relative">
      <AnimatePresence>
        {isScanning && <QRScanner onScan={handleQRScan} onClose={() => setIsScanning(false)} />}
      </AnimatePresence>

      <div className="flex-1 w-full h-full relative">
        {/* Top: Floating Neural Search Header (Rapido Style) */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-xl z-[500] pointer-events-none">
          <div className="flex flex-col gap-3">
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white/90 backdrop-blur-2xl border border-white/50 rounded-[28px] px-6 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 pointer-events-auto group focus-within:ring-2 ring-primary/20 transition-all"
            >
              <Search size={20} className="text-zinc-400 group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find a bus or route..."
                className="bg-transparent border-none text-zinc-900 outline-none w-full placeholder-zinc-400 font-bold tracking-tight"
              />
               <div className="flex items-center gap-2 border-l border-zinc-100 pl-4">
                  <Link href="/get-ticket" className="w-10 h-10 bg-white text-zinc-900 border border-zinc-200 rounded-full flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all active:scale-90 shadow-sm" title="My Ticket">
                    <Ticket size={18} />
                  </Link>
                  <button onClick={() => setIsScanning(true)} className="w-10 h-10 bg-zinc-900 text-white rounded-full flex items-center justify-center hover:bg-primary transition-all active:scale-90" title="Scan Bus QR">
                    <QrCode size={18} />
                  </button>
               </div>
            </motion.div>

            {/* Search Results Dropdown */}
            <AnimatePresence>
              {searchQuery && searchResults.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="bg-white/95 backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/20 overflow-hidden max-h-[60vh] overflow-y-auto pointer-events-auto ring-1 ring-black/5"
                >
                  <div className="px-6 py-3 border-b border-zinc-50 bg-zinc-50/50">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest leading-none">Intelligence Match ({searchResults.length} Fleet Found)</p>
                  </div>
                  {searchResults.map((bus) => (
                    <div 
                      key={bus._id}
                      onClick={() => {
                        setSelectedBus(bus);
                        setSearchQuery("");
                        setCenterOn({ ...bus.location });
                      }}
                      className="px-6 py-4 hover:bg-zinc-50 border-b border-zinc-50 last:border-none transition-all cursor-pointer flex items-center justify-between group active:bg-zinc-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary transition-colors">
                          <Bus size={22} className="text-primary group-hover:text-white transition-colors" />
                        </div>
                        <div>
                          <p className="font-black text-zinc-900 leading-tight tracking-tight uppercase italic">{bus.busNumber}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">{bus.routeId?.routeName}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-zinc-300 group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Global Brand Identity - Subtle Corner Anchor */}
        <div className="absolute top-6 left-6 z-[600] pointer-events-none hidden md:block">
          <Link href="/" className="pointer-events-auto active:scale-95 transition-transform block">
            <Image 
              src="/logo2.png" 
              alt="Jeffben" 
              width={250} 
              height={100} 
              className="h-12 md:h-24 w-auto object-contain drop-shadow-xl" 
              priority 
            />
          </Link>
        </div>


        {/* Map Background Layer */}
        <div className="absolute inset-0 z-0 h-full w-full">
          <LiveBusMap
            buses={filteredBuses}
            selectedBusId={selectedBus?._id}
            layers={layers}
            userLocation={userLocation}
            nearestBus={nearestBus}
            centerOn={centerOn}
            navPath={navPath}
            navStats={navStats}
            onBusClick={(bus) => {
              // Level 1: Initial Discovery Phase (Telemetry)
              setSelectedBus(bus);
              setStep(1);
              setIsBooking(false);
            }}
          />
        </div>

        {/* Right Corner: Persistent Ticket Intelligence Hub */}
        {ticketId && (
          <motion.div 
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="absolute top-24 right-6 z-[600] pointer-events-none"
          >
            <div className="bg-zinc-950/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] pointer-events-auto flex flex-col items-center gap-4 hover:scale-[1.05] transition-all cursor-pointer group relative" onClick={() => { setSelectedBus(filteredBuses.find(b => b._id === selectedBus?._id) || selectedBus || buses[0]); setStep(4); }}>
               <button 
                 onClick={(e) => { e.stopPropagation(); setTicketId(""); }}
                 className="absolute -top-2 -right-2 w-8 h-8 bg-zinc-800 text-white rounded-full flex items-center justify-center border border-white/10 hover:bg-primary transition-all shadow-lg"
               >
                 <X size={14} />
               </button>
               <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30 group-hover:bg-primary transition-all">
                  <Zap size={24} className="text-primary group-hover:text-white" />
               </div>
               <div className="text-center">
                  <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em] leading-none mb-1">Pass Active</p>
                  <p className="text-sm font-black text-white italic truncate w-32 uppercase tracking-tighter">JB-{(ticketId || "").slice(-6)}</p>
               </div>
               <div className="flex items-center gap-2 mt-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-zinc-500 uppercase">Verified Sync</span>
               </div>
            </div>
          </motion.div>
        )}

        {/* Right Side Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 right-4 md:right-8 z-[150] flex flex-col gap-4 pointer-events-none">
          <div className="flex flex-col gap-2 p-1.5 md:p-2 bg-white/95 backdrop-blur-md rounded-[24px] md:rounded-[32px] shadow-xl border border-white pointer-events-auto">
            <button
              onClick={() => {
                if (userLocation) setCenterOn({ ...userLocation } as any);
                else toggleLiveLocation();
              }}
              className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-primary hover:text-white text-primary rounded-xl md:rounded-3xl flex items-center justify-center transition-all group shadow-sm border border-zinc-100/50"
              title="Locate Me"
            >
              <Navigation size={18} className="group-active:scale-90 transition-transform" />
            </button>
            {ticketId && (
              <button
                onClick={() => { setStep(4); if(!selectedBus) setSelectedBus(filteredBuses[0]); }}
                className="w-10 h-10 md:w-12 md:h-12 bg-zinc-900 hover:bg-primary text-white rounded-xl md:rounded-3xl flex items-center justify-center transition-all group shadow-sm border border-zinc-100/50"
                title="View Pass"
              >
                <QrCode size={18} className="group-active:scale-90 transition-transform" />
              </button>
            )}
            {(showNearbyOnly || isNavigating || selectedBus) && (
              <>
                <div className="w-full h-px bg-zinc-100 mx-auto" />
                <button
                  onClick={() => {
                    clearNavigation();
                    setShowNearbyOnly(false);
                    setSelectedBus(null);
                    setIsBooking(false);
                    setHideNearestCard(true);
                    setCenterOn({ lat: 11.0168, lng: 76.9558, zoom: 14, pitch: 60, bearing: -15 } as any);
                  }}
                  className="w-10 h-10 md:w-12 md:h-12 bg-white hover:bg-primary hover:text-white text-primary rounded-xl md:rounded-3xl flex items-center justify-center transition-all group shadow-sm border border-zinc-100/50"
                  title="Reset Map"
                >
                  <RefreshCw size={18} className="group-active:-rotate-180 transition-transform duration-500" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bottom Navigation Panel */}
        <div className="absolute bottom-0 left-0 right-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:w-max z-[200] pointer-events-auto">
          <div className="bg-white/90 backdrop-blur-xl border-t border-zinc-100 md:border md:rounded-full rounded-t-[32px] pb-6 pt-3 px-4 md:p-2 sm:pb-3 flex items-center justify-between md:justify-center gap-2 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-x-auto no-scrollbar w-full">

            <button onClick={toggleLiveLocation} className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all flex-shrink-0 relative ${isLiveLocationOn ? "text-orange-500 bg-orange-500/10" : "hover:bg-zinc-50 text-zinc-500"}`}>
              <LayoutDashboard size={20} className={isLiveLocationOn ? "animate-pulse" : ""} />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">{isLiveLocationOn ? "Stop Hub" : "Location Hub"}</span>
              {isLiveLocationOn && <X size={12} className="absolute top-1 right-1 text-orange-500" />}
            </button>

            <button
              onClick={() => {
                if (!isLiveLocationOn) { toggleLiveLocation(); setShowNearbyOnly(true); return; }
                if (!userLocation) { setLocationError("GPS..."); return; }
                setShowNearbyOnly(!showNearbyOnly);
                if (!showNearbyOnly && nearestBus) startNavigation(nearestBus);
                else clearNavigation();
              }}
              className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all flex-shrink-0 relative ${showNearbyOnly ? "text-orange-500 bg-orange-500/10" : "hover:bg-zinc-50 text-zinc-500"}`}
            >
              <Navigation size={20} />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">{showNearbyOnly ? "Cancel" : "Nearby"}</span>
              {showNearbyOnly && <X size={12} className="absolute top-1 right-1 text-orange-500" />}
            </button>

            <div className="w-px h-8 bg-zinc-100 mx-0.5 md:mx-1 hidden md:block flex-shrink-0" />

            <button onClick={() => setLayers(l => ({ ...l, showRoutes: !l.showRoutes }))} className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all flex-shrink-0 ${layers.showRoutes ? "text-orange-600 bg-orange-50" : "hover:bg-zinc-50 text-zinc-500"}`}>
              <Route size={20} />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">Routes</span>
            </button>

            <button onClick={() => setLayers(l => ({ ...l, showBuses: !l.showBuses }))} className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all flex-shrink-0 ${layers.showBuses ? "text-orange-600 bg-orange-50" : "hover:bg-zinc-50 text-zinc-500"}`}>
              <Bus size={20} />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">Fleet</span>
            </button>

            <button onClick={() => setLayers(l => ({ ...l, showMajorStops: !l.showMajorStops }))} className={`flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all flex-shrink-0 ${layers.showMajorStops ? "text-orange-600 bg-orange-50" : "hover:bg-zinc-50 text-zinc-500"}`}>
              <Zap size={18} className={layers.showMajorStops ? "fill-orange-400/20" : ""} />
              <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">Intelligence</span>
            </button>


            <div className="w-px h-8 bg-zinc-100 mx-0.5 md:mx-1 hidden md:block flex-shrink-0" />

            {(isLiveLocationOn || showNearbyOnly || selectedBus || isNavigating) && (
              <>
                <div className="w-px h-8 bg-white/10 mx-0.5 md:mx-1 hidden md:block flex-shrink-0" />
                <button
                  onClick={() => {
                    // 1. Core Navigation & Simulation Resets
                    clearNavigation();
                    setShowNearbyOnly(false);
                    setSelectedBus(null);
                    setIsBooking(false);
                    setHideNearestCard(true);
                    setSearchQuery("");

                    // 2. Clear Live GPS if on
                    if (isLiveLocationOn) toggleLiveLocation();

                    // 3. Reset Layer Visibility to Defaults
                    setLayers({
                      showBuses: true,
                      showRoutes: true,
                      showMajorStops: true,
                      showSmallStops: true,
                      showTraffic: false,
                      showBuildings: true
                    });

                    // 4. Cinematic Reset to City Overview
                    setCenterOn({ lat: 11.0168, lng: 76.9558, zoom: 14, pitch: 60, bearing: -15 } as any);
                  }}
                  className="flex flex-col items-center justify-center min-w-[48px] sm:min-w-[56px] md:min-w-[80px] h-12 md:h-16 rounded-2xl md:rounded-full transition-all bg-primary text-white flex-shrink-0 shadow-lg shadow-primary/30 animate-in fade-in slide-in-from-right-4"
                >
                  <RefreshCw size={20} />
                  <span className="text-[8px] md:text-[9px] font-bold uppercase tracking-wider mt-1">Cancel</span>
                </button>
              </>
            )}

          </div>
        </div>

        {isNavigating && navStats && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-[100px] md:bottom-32 left-1/2 -translate-x-1/2 z-[100] w-[90%] md:w-[600px] bg-orange-600 text-white p-8 rounded-[48px] shadow-2xl flex items-center justify-between pointer-events-auto"
          >
            <div className="flex gap-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em]">Distance</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic">{navStats.distance}</span>
                  <span className="text-xs font-black opacity-60">KM</span>
                </div>
              </div>
              <div className="w-[1px] h-12 bg-white/20" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-[0.3em]">Arrival ETA</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black italic text-sky-200">{navStats.duration}</span>
                  <span className="text-xs font-black opacity-60 text-sky-200">MINS</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setNavMode(prev => prev === 'driving' ? 'walking' : 'driving')}
                className="w-14 h-14 bg-white/10 hover:bg-white/20 rounded-2xl flex items-center justify-center transition-all"
              >
                <Zap size={24} className={navMode === 'driving' ? 'text-amber-300' : 'text-white'} />
              </button>
              <button
                onClick={clearNavigation}
                className="px-8 h-14 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-zinc-900 hover:text-white transition-all shadow-xl"
              >
                Finish
              </button>
            </div>
          </motion.div>
        )}

        {!isNavigating && userLocation && nearestBus && !hideNearestCard && (
          <div className="absolute bottom-[120px] left-4 right-4 md:bottom-32 md:right-8 md:left-auto z-[100] bg-zinc-950/95 backdrop-blur-md p-5 pb-6 md:p-8 rounded-[32px] md:rounded-[48px] shadow-2xl border border-white/10 flex flex-col md:flex-row md:items-center md:gap-12 gap-5 group hover:scale-[1.02] transition-all animate-in fade-in slide-in-from-bottom-8 pointer-events-auto">
            <button
              onClick={() => setHideNearestCard(true)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 text-zinc-400 hover:text-white flex items-center justify-center transition-all z-10"
            >
              <X size={14} />
            </button>

            <div className="flex flex-col gap-1 md:gap-2 pr-8 md:pr-0">
              <span className="text-[9px] md:text-[10px] font-black uppercase text-orange-500 tracking-[0.4em] truncate w-full">Nearest: {(nearestBus as any).busNumber}</span>

              <div className="flex flex-row md:flex-col items-baseline gap-4 md:gap-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl md:text-4xl font-black italic text-white tracking-tighter">{getDistance(userLocation.lat, userLocation.lng, (nearestBus as any).location.lat, (nearestBus as any).location.lng).toFixed(1)}</span>
                  <span className="text-xs md:text-sm font-black text-zinc-600 uppercase">KM</span>
                </div>
                <div className="flex items-baseline gap-1 mt-0 md:mt-1">
                  <span className="text-xl md:text-2xl font-black italic text-primary tracking-tighter">{Math.round(getDistance(userLocation.lat, userLocation.lng, (nearestBus as any).location.lat, (nearestBus as any).location.lng) * 2.5)}</span>
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-500 uppercase">Min ETA</span>
                </div>
              </div>
            </div>

            <div className="w-full h-[1px] md:w-[1px] md:h-16 bg-white/10" />

            <div className="flex w-full md:w-auto gap-3 md:gap-4 justify-between md:justify-start">
              <button
                onClick={() => startNavigation(nearestBus)}
                className="flex-1 md:flex-none h-14 md:w-16 md:h-16 bg-white/10 border border-white/20 rounded-2xl md:rounded-full flex items-center justify-center text-white shadow-xl hover:bg-primary hover:border-orange-500 transition-all active:scale-95 group/nav"
                title="Navigate to Bus"
              >
                <Navigation size={22} className="rotate-45 group-hover/nav:scale-110 transition-transform md:w-[28px] md:h-[28px]" />
              </button>
              <button
                onClick={() => { setSelectedBus(nearestBus); setIsBooking(true); setStep(0); }}
                className="flex-1 md:flex-none h-14 md:w-16 md:h-16 gap-2 bg-primary rounded-2xl md:rounded-full flex items-center justify-center text-white shadow-xl shadow-primary/30 hover:bg-white hover:text-primary transition-all active:scale-90 font-black text-xs uppercase tracking-widest"
                title="Book Ticket"
              >
                <span className="md:hidden">Select</span>
                <ChevronRight size={24} strokeWidth={3} className="md:w-8 md:h-8" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rapido-Style Sliding Bottom Sheet */}
      <AnimatePresence>
        {selectedBus && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 200 }}
            drag={step === 4 ? false : "y"}
            dragConstraints={{ top: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 150 && step !== 4) {
                setSelectedBus(null);
                setIsBooking(false);
                setStep(1);
              }
            }}
            className="fixed inset-x-0 bottom-0 z-[1000] bg-white rounded-t-[40px] shadow-[0_-20px_80px_rgba(0,0,0,0.2)] border-t border-zinc-100 flex flex-col max-h-[92vh] overflow-hidden"
          >
            {/* Drag Handle */}
            {step !== 4 && (
              <div className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1.5 bg-zinc-200 rounded-full" />
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 md:px-12 pb-12">
              {step === 4 ? (
                /* STEP 4: FINAL DIGITAL TICKET */
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative flex flex-col items-center justify-center p-0 text-center py-12">
                   <div className="w-full max-w-[340px] md:max-w-4xl relative group">
                    {/* VINTAGE ORNATE GOLD TICKET DESIGN */}
                    <div 
                      id="printable-ticket"
                      className="ticket-container relative bg-[#f7e49f] bg-gradient-to-br from-[#f7e49f] via-[#e5c167] to-[#d4af37] rounded-[20px] md:rounded-[40px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.5)] overflow-hidden border-[6px] md:border-[12px] border-[#b8860b]/30 flex flex-col md:flex-row min-h-[550px] md:min-h-[400px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] print:rounded-none print:shadow-none print:border-[4px] print:m-0"
                    >
                      <div className="absolute inset-0 opacity-100 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')] print:opacity-50" />
                      <div className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')]" />
                      <div className="absolute inset-0 border-[6px] border-[#d4af37] opacity-80 pointer-events-none" />
                      
                      {/* Left Side: Main Info */}
                      <div className="p-8 md:p-14 flex-1 relative border-b-4 md:border-b-0 md:border-r-4 border-dashed border-[#b8860b]/40">
                        <div className="relative z-10 text-center mb-10">
                          <p className="text-xl md:text-2xl font-vintage italic text-[#5d4037]/80 leading-none mb-2">JeffBen</p>
                          <h3 className="text-3xl md:text-5xl font-serif font-black tracking-tight text-[#5d4037] leading-none mb-2 uppercase">Boarding Pass</h3>
                        </div>

                        <div className="space-y-6 text-left relative z-10 px-4">
                          <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Bus No:</span>
                              <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight uppercase italic">{selectedBus.busNumber}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Passengers:</span>
                              <span className="text-xl md:text-2xl font-serif text-[#5d4037] font-black tracking-tight">{ticketQuantity}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-8 border-b border-[#5d4037]/20 pb-4">
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Boarding</span>
                              <p className="text-base font-serif text-[#5d4037] font-bold uppercase italic">{boardingPoint}</p>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-sans font-bold uppercase text-[10px] tracking-[0.3em] text-[#5d4037]/60">Destination</span>
                              <p className="text-base font-serif text-[#5d4037] font-bold uppercase italic">{dropPoint}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: QR Secure Matrix */}
                      <div className="p-8 md:p-12 md:w-[320px] flex flex-col justify-between items-center relative overflow-hidden bg-black/5">
                        <div className="p-3 bg-white/10 rounded-2xl shadow-inner border border-[#5d4037]/5">
                            <QRCodeSVG 
                              value={btoa(JSON.stringify({
                                t: ticketId,
                                b: selectedBus._id,
                                q: ticketQuantity,
                                r: selectedBus.routeId?._id,
                                m: "JB-NEURAL-SECURE"
                              }))} 
                              size={140} 
                              fgColor="#2d1a12" 
                              bgColor="transparent"
                              level="H" 
                            />
                        </div>
                        <div className="text-center mt-6">
                           <p className="text-[10px] font-bold text-[#5d4037]/50 uppercase tracking-widest">Serial Key</p>
                           <p className="text-xs font-serif font-black text-[#5d4037]">JB-{ticketId?.slice(-8) || "98765432"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-8 no-print">
                      <button 
                        onClick={() => window.print()}
                        className="h-20 bg-zinc-900 text-white rounded-[32px] font-black text-xl tracking-tighter flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                      >
                        <Download size={22} /> Download Pass
                      </button>
                      <button 
                         onClick={() => {
                            setSelectedBus(null);
                            setStep(1);
                            setIsBooking(false);
                         }}
                         className="h-16 bg-white border border-zinc-100 text-zinc-400 rounded-[28px] font-bold uppercase tracking-widest text-xs hover:text-zinc-900 transition-colors"
                      >
                        Close & Track Map
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : !isBooking ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  {/* TRIP PEEK STATE */}
                  {/* Primary CTA Stack - Promoted to top for Rapido speed */}
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={() => { setIsBooking(true); setStep(2); }}
                      className="w-full h-20 bg-primary text-white rounded-[32px] font-black text-xl tracking-tighter hover:bg-zinc-900 transition-all shadow-[0_20px_40px_rgba(255,107,0,0.3)] flex items-center justify-center gap-3 active:scale-95 group"
                    >
                      Book e-Ticket <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        onClick={() => startNavigation(selectedBus)}
                        className="h-16 bg-white border-2 border-zinc-100 text-zinc-900 rounded-[24px] font-black uppercase tracking-widest text-[9px] hover:border-primary transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <Navigation size={14} className="text-primary rotate-45" /> Map View
                      </button>
                      <button 
                         onClick={() => setShowBusQR(true)}
                         className="h-16 bg-white border-2 border-zinc-100 text-zinc-900 rounded-[24px] font-black uppercase tracking-widest text-[9px] hover:border-primary transition-all flex items-center justify-center gap-2 active:scale-95"
                      >
                        <QrCode size={14} className="text-primary" /> Matrix ID
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-px bg-zinc-50" />

                  {/* Peek Content: Active Trip Info */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                        <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] leading-none">Arriving in approx 8 Mins</p>
                      </div>
                      <h2 className="text-4xl font-black text-zinc-900 tracking-tighter leading-none mt-2 italic uppercase">{selectedBus.busNumber}</h2>
                      <p className="text-xs font-bold text-zinc-400 italic mt-1">{selectedBus.routeId?.routeName}</p>
                    </div>
                    <div className="w-16 h-16 bg-orange-50 rounded-3xl flex items-center justify-center border border-orange-100/50 shadow-sm relative">
                       <Bus size={30} className="text-primary" />
                       <div className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center border-2 border-white">
                          <Zap size={10} className="text-white fill-current" />
                       </div>
                    </div>
                  </div>

                  {/* Real-time Telemetry Grid with Glassmorphism */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-zinc-50/50 backdrop-blur-md rounded-[24px] p-5 flex flex-col items-center justify-center border border-zinc-100/50 group hover:border-orange-500/30 transition-all">
                      <Clock size={16} className="text-zinc-400 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{selectedBus.departureTime}</span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Start</span>
                    </div>
                    <div className="bg-zinc-50/50 backdrop-blur-md rounded-[24px] p-5 flex flex-col items-center justify-center border border-zinc-100/50 group hover:border-orange-500/30 transition-all">
                      <Gauge size={16} className="text-zinc-400 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{selectedBus.speed} <span className="text-[7px]">KM/H</span></span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Velocity</span>
                    </div>
                    <div className="bg-zinc-50/50 backdrop-blur-md rounded-[24px] p-5 flex flex-col items-center justify-center border border-zinc-100/50 group hover:border-orange-500/30 transition-all">
                      <User size={16} className="text-zinc-400 mb-2 group-hover:text-primary transition-colors" />
                      <span className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter">{selectedBus.availableSeats} <span className="text-[7px]">Left</span></span>
                      <span className="text-[8px] font-bold text-zinc-400 uppercase mt-1">Load</span>
                    </div>
                  </div>

                  {/* Premium Bus Features Section */}
                  <div className="flex items-center justify-between px-2">
                     <div className="flex items-center gap-6">
                        <div className="flex flex-col items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                           <Zap size={14} className="text-orange-500" />
                           <span className="text-[7px] font-black uppercase tracking-widest">WiFi 6</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                           <Shield size={14} className="text-blue-500" />
                           <span className="text-[7px] font-black uppercase tracking-widest">CCTV Secure</span>
                        </div>
                        <div className="flex flex-col items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                           <Clock size={14} className="text-primary" />
                           <span className="text-[7px] font-black uppercase tracking-widest">A/C Units</span>
                        </div>
                     </div>
                     <div className="h-4 w-[1px] bg-zinc-100" />
                     <div className="text-right">
                        <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none">Comfort Class</p>
                        <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter mt-1 italic">Executive Neural</p>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                   {/* BOOKING FLOW STATE */}
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setIsBooking(false)} className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900 transition-all"><ArrowLeft size={20} /></button>
                         <h3 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase italic">Secure Booking</h3>
                      </div>
                      <button onClick={() => { setIsBooking(false); setSelectedBus(null); }} className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all"><X size={20} /></button>
                   </div>

                   {/* Routing Dynamic Highlight */}
                   <div className="bg-zinc-950 rounded-[32px] p-6 flex items-center justify-between relative overflow-hidden group">
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary" />
                      <div className="flex flex-col gap-1">
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Origin</span>
                         <span className="text-sm font-black text-white uppercase italic truncate max-w-[120px]">{boardingPoint || "Select Stop"}</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-4">
                         <div className="w-full h-[1px] bg-zinc-800 relative">
                            <div className="absolute inset-0 bg-primary animate-pulse" />
                            <ArrowRight size={14} className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-primary" />
                         </div>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                         <span className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.3em]">Drop</span>
                         <span className="text-sm font-black text-white uppercase italic truncate max-w-[120px]">{dropPoint || "Choose End"}</span>
                      </div>
                   </div>

                   {step === 2 && (
                      <div className="space-y-8">
                         {/* Integrated Step 1 Telemetry */}
                         <div className="grid grid-cols-3 gap-3">
                            <div className="bg-zinc-50 rounded-[22px] p-4 flex flex-col items-center border border-zinc-100">
                               <Gauge size={14} className="text-primary mb-1" />
                               <span className="text-[10px] font-black text-zinc-900">{selectedBus.speed} KM/H</span>
                               <span className="text-[7px] font-bold text-zinc-400 uppercase">Velocity</span>
                            </div>
                            <div className="bg-zinc-50 rounded-[22px] p-4 flex flex-col items-center border border-zinc-100">
                               <User size={14} className="text-primary mb-1" />
                               <span className="text-[10px] font-black text-zinc-900">{selectedBus.availableSeats}</span>
                               <span className="text-[7px] font-bold text-zinc-400 uppercase">Empty</span>
                            </div>
                            <div className="bg-zinc-50 rounded-[22px] p-4 flex flex-col items-center border border-zinc-100">
                               <Shield size={14} className="text-primary mb-1" />
                               <span className="text-[10px] font-black text-zinc-900">SECURE</span>
                               <span className="text-[7px] font-bold text-zinc-400 uppercase">Unit Status</span>
                            </div>
                         </div>
                         {/* Step 1 Interaction Stack */}
                         <div className="grid grid-cols-2 gap-3">
                            <button 
                              onClick={() => startNavigation(selectedBus)}
                              className="h-16 bg-white border-2 border-zinc-100 text-zinc-900 rounded-[24px] font-black uppercase tracking-widest text-[9px] hover:border-primary transition-all flex items-center justify-center gap-2"
                            >
                              <Navigation size={14} className="text-primary rotate-45" /> Map View
                            </button>
                            <button 
                               onClick={() => setShowBusQR(true)}
                               className="h-16 bg-white border-2 border-zinc-100 text-zinc-900 rounded-[24px] font-black uppercase tracking-widest text-[9px] hover:border-primary transition-all flex items-center justify-center gap-2"
                            >
                              <QrCode size={14} className="text-primary" /> Matrix ID
                            </button>
                         </div>

                         <div className="w-full h-px bg-zinc-50" />

                         <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Boarding From</label>
                               <select 
                                 value={boardingPoint} 
                                 onChange={(e) => setBoardingPoint(e.target.value)} 
                                 className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-[24px] px-6 font-bold text-zinc-900 outline-none focus:ring-2 ring-primary/20 transition-all appearance-none"
                               >
                                 <option>Choose Station</option>
                                 {selectedBus.routeId?.stops?.map((s: any) => <option key={s._id} value={s.stopName}>{s.stopName}</option>)}
                               </select>
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Drop Destination</label>
                               <select 
                                 value={dropPoint} 
                                 onChange={(e) => setDropPoint(e.target.value)} 
                                 className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-[24px] px-6 font-bold text-zinc-900 outline-none focus:ring-2 ring-primary/20 transition-all appearance-none"
                               >
                                 <option>Choose Destination</option>
                                 {selectedBus.routeId?.stops?.map((s: any) => <option key={s._id} value={s.stopName}>{s.stopName}</option>)}
                               </select>
                            </div>
                         </div>
                         <button 
                           onClick={() => setStep(3)}
                           disabled={!boardingPoint || !dropPoint}
                           className="w-full h-20 bg-zinc-900 text-white rounded-[32px] font-black text-xl tracking-tighter hover:bg-primary transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95"
                         >
                           Select Passengers <ChevronRight size={24} />
                         </button>
                      </div>
                   )}

                   {step === 3 && (
                      <div className="space-y-8">
                         <div className="flex flex-col items-center py-6 bg-zinc-50 rounded-[40px] border border-zinc-100">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-4">Ticket Quantity</p>
                            <div className="flex items-center gap-12">
                               <button onClick={() => setTicketQuantity(prev => Math.max(1, prev -1))} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl font-black text-zinc-900 shadow-sm hover:bg-zinc-900 hover:text-white transition-all border border-zinc-200">-</button>
                               <span className="text-5xl font-black text-zinc-900 italic">{ticketQuantity}</span>
                               <button onClick={() => setTicketQuantity(prev => Math.min(selectedBus.availableSeats, prev + 1))} className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg hover:bg-zinc-900 transition-all">+</button>
                            </div>
                            <div className="space-y-4">
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest pl-2">Secure Link (Phone)</label>
                                <div className="relative">
                                   <Phone size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400" />
                                   <input 
                                     type="tel" 
                                     value={passengerDetails.phone}
                                     onChange={(e) => setPassengerDetails({...passengerDetails, phone: e.target.value})}
                                     placeholder="Active Phone Number"
                                     className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-[24px] pl-16 pr-6 font-bold text-zinc-900 outline-none focus:ring-2 ring-primary/20 transition-all"
                                   />
                                </div>
                             </div>
                          </div>
                         </div>

                         <button 
                           onClick={confirmBooking}
                           disabled={!passengerDetails.phone || passengerDetails.phone.length < 10}
                           className="w-full h-20 bg-primary text-white rounded-[32px] font-black text-xl tracking-tighter hover:bg-zinc-900 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                         >
                           {loading ? <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" /> : "Confirm Boarding Pass"}
                         </button>
                      </div>
                   )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBusQR && selectedBus && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[3100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setShowBusQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-[64px] p-10 space-y-8 shadow-2xl border-4 border-white/20 relative"
              onClick={e => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <h3 className="text-4xl font-black text-zinc-900 tracking-tighter italic">{selectedBus.busNumber}</h3>
                <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.4em]">{selectedBus.routeId?.routeName}</p>
              </div>

              <div className="flex flex-col items-center gap-10">
                <div className="p-8 bg-white rounded-[48px] shadow-[0_40px_100px_rgba(0,0,0,0.06)] border-4 border-zinc-50 relative">
                  <QRCodeSVG
                    value={JSON.stringify({ busId: selectedBus._id, auth: "JEFFBEN-SYNC" })}
                    size={200}
                    fgColor="#18181b"
                    level="H"
                  />
                </div>
              </div>
              <button 
                onClick={() => setShowBusQR(false)}
                className="w-full h-20 bg-zinc-900 text-white rounded-[32px] font-black uppercase tracking-widest hover:bg-primary transition-all"
              >
                Dismiss
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
        .font-vintage { font-family: 'Dancing Script', cursive !important; }
        
        @media print {
          /* 1. Global Sanitization: Kill all browser-default margins and ghost offsets */
          @page {
            size: landscape !important;
            margin: 0 !important;
          }

          html, body {
            margin: 0 !important;
            padding: 0 !important;
            min-height: 0 !important;
          }

          @media print {
            body * { visibility: hidden !important; }
            #printable-ticket, #printable-ticket * { 
              visibility: visible !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            #printable-ticket {
              position: fixed !important;
              left: 50% !important;
              top: 50% !important;
              transform: translate(-50%, -50%) !important;
              width: 210mm !important;
              height: 90mm !important;
              background: #f7e49f !important;
              background-image: linear-gradient(to bottom right, #f7e49f, #e5c167, #d4af37) !important;
              border: 4px solid #b8860b !important;
              border-radius: 20px !important;
              display: flex !important;
              flex-direction: row !important;
              margin: 0 !important;
              padding: 0 !important;
              box-shadow: none !important;
              z-index: 999999 !important;
              overflow: hidden !important;
            }

            .ticket-main {
               flex: 1 !important;
               display: flex !important;
               flex-direction: column !important;
               justify-content: center !important;
               padding: 10mm !important;
               border-right: 2px dashed rgba(184, 134, 11, 0.4) !important;
            }

            .ticket-stub {
               width: 75mm !important;
               display: flex !important;
               flex-direction: column !important;
               align-items: center !important;
               justify-content: center !important;
               background: rgba(0, 0, 0, 0.05) !important;
            }

            h3 { font-size: 38pt !important; margin: 0 0 4mm 0 !important; line-height: 1 !important; color: #5d4037 !important; }
            p { font-size: 14pt !important; margin: 2mm 0 0 0 !important; color: #5d4037 !important; }
            span { font-size: 10pt !important; font-weight: 800 !important; color: #5d4037 !important; }
            svg { width: 45mm !important; height: 45mm !important; }
            .italic { font-style: italic !important; }
          }
        }
      `}</style>
    </main>
  );
}
