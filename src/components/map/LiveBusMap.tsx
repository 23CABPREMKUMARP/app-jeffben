"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createRoot, Root } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

interface BusData {
  _id: string;
  busNumber: string;
  status: string;
  location: {
    lat: number;
    lng: number;
    rotation?: number;
    modelType?: number;
  };
  routeId?: {
    path?: {lat: number, lng: number}[];
    stops?: {stopName: string, lat: number, lng: number}[];
  };
}

interface MapLayers {
  showBuses: boolean;
  showRoutes: boolean;
  showStops: boolean;
  showTraffic: boolean;
  showBuildings: boolean;
}

useGLTF.preload("/indonesia_ecolin_bus.glb");

function Model3D({ rotationDegrees }: { rotationDegrees: number }) {
  const { scene } = useGLTF("/indonesia_ecolin_bus.glb");
  const model = React.useMemo(() => scene.clone(), [scene]);
  
  React.useEffect(() => {
    // 100% Guaranteed Normalization
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    if (maxDim > 0) {
       const scale = 5.0 / maxDim; // Make the physical bus visually 5 WebGL units wide to fit camera perfectly
       model.scale.set(scale, scale, scale);
    }
    
    // Auto-center the internal massive local coordinates
    box.setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    
    // Snap Wheels perfectly to the Y=0 floor
    box.setFromObject(model);
    model.position.y += Math.abs(box.min.y);

    // Bypass any bad GLB material side logic
    model.traverse((child: any) => {
       if (child.isMesh && child.material) {
         child.material.side = THREE.DoubleSide;
         child.material.depthTest = true;
       }
    });
  }, [model]);

  // Adjust standard Y-up rotation to visually align with MapLibre compass
  return <primitive object={model} rotation={[0, -rotationDegrees * (Math.PI / 180), 0]} />;
}

function MapSyncedScene({ map, rotationDegrees }: { map: maplibregl.Map, rotationDegrees: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current || !map) return;
    const pitch = map.getPitch() * (Math.PI / 180);
    const bearing = map.getBearing() * (Math.PI / 180);
    const zoom = map.getZoom();
    
    // Master Sync: MapLibre pitches down the camera. To cancel the CSS illusion and use raw 3D,
    // we tilt the ThreeJS world matrix X and bearing Y dynamically on EVERY frame natively!
    groupRef.current.rotation.set(pitch, -bearing, 0, "YXZ");

    // Reverting to uniform static screen-space marker sizing to act purely like a persistent UI element.
    groupRef.current.scale.set(1.2, 1.2, 1.2);
  });

  return (
    <group ref={groupRef}>
       <Model3D rotationDegrees={rotationDegrees} />
    </group>
  );
}

function BusMarkerCanvas({ map, rotationDegrees, isRunning }: { map: maplibregl.Map, rotationDegrees: number, isRunning: boolean }) {
  return (
    <div className="w-[180px] h-[180px] flex items-center justify-center relative pointer-events-none">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-4 rounded-[100%] blur-md drop-shadow-2xl opacity-80 ${isRunning ? "bg-blue-600" : "bg-amber-600"} transition-all z-0`} />
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }} className="w-full h-full pointer-events-none z-10" gl={{ alpha: true }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 20, 10]} intensity={3} />
        <directionalLight position={[-10, 10, -10]} intensity={1.5} />
        <Environment preset="city" />
        <Suspense fallback={null}>
            <MapSyncedScene map={map} rotationDegrees={rotationDegrees} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default function LiveBusMap({ onBusClick, buses, selectedBusId, layers }: { onBusClick: (bus: any) => void, buses: BusData[], selectedBusId?: string | null, layers: MapLayers }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const busMarkers = useRef<{ [key: string]: { marker: maplibregl.Marker, root: Root, isRunning: boolean, el: HTMLElement } }>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    const COIMBATORE_BOUNDS: [[number, number], [number, number]] = [[76.85, 10.90], [77.10, 11.15]];

    const initTimeout = setTimeout(() => {
      if (!mapContainer.current) return;

      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json",
        center: [76.9558, 11.0168],
        zoom: 13.5,
        pitch: 65,
        maxBounds: COIMBATORE_BOUNDS,
      });

      map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
      // Removed GeolocateLive tracking control to prevent user native physical tracking crosshairs

      map.on("load", () => {
         setMapLoaded(true);
         
         // Add base layers for routes and stops on load
         map.addSource("routes", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
         map.addLayer({
            id: "routes-layer",
            type: "line",
            source: "routes",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
               "line-color": ["get", "color"],
               "line-width": ["get", "width"],
               "line-opacity": 0.8
            }
         });

         // Directional Navigation Arrows
         map.addLayer({
            id: "routes-arrows",
            type: "symbol",
            source: "routes",
            layout: {
               "symbol-placement": "line",
               "symbol-spacing": 80,
               "text-field": "▶",
               "text-size": 18,
               "text-keep-upright": false
            },
            paint: {
               "text-color": "#ffffff",
               "text-halo-color": ["get", "color"],
               "text-halo-width": 3,
               "text-opacity": 0.9
            }
         });

         map.addSource("stops", { type: "geojson", data: { type: "FeatureCollection", features: [] } });
         map.addLayer({
            id: "stops-layer",
            type: "circle",
            source: "stops",
            paint: {
               "circle-radius": 6,
               "circle-color": "#ffffff",
               "circle-stroke-width": 3,
               "circle-stroke-color": ["get", "color"]
            }
         });
      });
      mapRef.current = map;
    }, 100);

    return () => {
       clearTimeout(initTimeout);
       if (mapRef.current) {
          try { mapRef.current.remove(); } catch(e) {}
          mapRef.current = null;
       }
    };
  }, []);

  // Decoupled Static GeoJSON Painting Layer
  // Massively improves performance by never needlessly looping over massive LineStrings at 10hz.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const routeFeatures: any[] = [];
    const stopFeatures: any[] = [];

    // Statically paint lines using initial buses data reference
    buses.forEach(bus => {
      if (!bus.routeId || !bus.routeId.path) return;
      const isSelected = selectedBusId === bus._id;
      
      routeFeatures.push({
        type: "Feature",
        properties: { color: isSelected ? "#3b82f6" : "#cbd5e1", width: isSelected ? 10 : 6 },
        geometry: { type: "LineString", coordinates: bus.routeId.path.map(p => [p.lng, p.lat]) }
      });

      bus.routeId.stops?.forEach(stop => {
         stopFeatures.push({
            type: "Feature",
            properties: { color: isSelected ? "#2563eb" : "#94a3b8" },
            geometry: { type: "Point", coordinates: [stop.lng, stop.lat] }
         });
      });
    });

    if (map.getSource("routes")) {
       (map.getSource("routes") as maplibregl.GeoJSONSource).setData({ type: "FeatureCollection", features: routeFeatures });
       (map.getSource("stops") as maplibregl.GeoJSONSource).setData({ type: "FeatureCollection", features: stopFeatures });
    }
    
    // Toggle Layer Visions natively via MapLibre Paint
    if (map.getLayer("routes-layer")) map.setLayoutProperty("routes-layer", "visibility", layers.showRoutes ? "visible" : "none");
    if (map.getLayer("routes-arrows")) map.setLayoutProperty("routes-arrows", "visibility", layers.showRoutes ? "visible" : "none");
    if (map.getLayer("stops-layer")) map.setLayoutProperty("stops-layer", "visibility", layers.showStops ? "visible" : "none");
    
  }, [selectedBusId, mapLoaded, layers]); // STRICT DEPENDENCY ARRAY ISOLATION

  // High-Frequency Tracking Matrix Layer
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Move Buses Smoothly
    buses.forEach(bus => {
        if (!busMarkers.current[bus._id]) {
          const el = document.createElement('div');
          el.className = 'bus-synced-wrapper cursor-pointer';
          el.style.zIndex = "100";
          // Absolutely NO CSS Transform Transitions allowed! Handled natively inside WASM logic!
          
          el.addEventListener('click', (e) => {
             e.stopPropagation();
             onBusClick(bus);
             
             // Cinematic Auto-Pan adapted for mobile aspect ratios perfectly!
             const isMobile = window.innerWidth < 768;
             map.flyTo({
                center: [bus.location.lng, bus.location.lat],
                padding: { 
                   right: bus.status.includes("Boarding") && !isMobile ? 450 : 0, 
                   bottom: bus.status.includes("Boarding") && isMobile ? (window.innerHeight * 0.4) : 0,
                   top: 0, 
                   left: 0 
                },
                duration: 1200,
                essential: true
             });
          });
          
          // No pitchAlignment override here. We want a perfectly clean 2D HTML plane 
          // facing the screen so the WebGL Canvas never loses pixel resolution or looks glued to the map!
          const marker = new maplibregl.Marker({ element: el })
             .setLngLat([bus.location.lng, bus.location.lat])
             .addTo(map);

          const root = createRoot(el);
          root.render(<BusMarkerCanvas map={map} rotationDegrees={bus.location.rotation || 0} isRunning={bus.status === 'Running'} />);
          
          busMarkers.current[bus._id] = { marker, root, isRunning: bus.status === 'Running', el, frameId: 0 } as any;
        } else {
          const cache = busMarkers.current[bus._id] as any;
          
          const targetLng = bus.location.lng;
          const targetLat = bus.location.lat;
          const currentLngLat = cache.marker.getLngLat();
          const currentLng = currentLngLat.lng;
          const currentLat = currentLngLat.lat;
          
          if (cache.frameId) cancelAnimationFrame(cache.frameId);
          let startTime = performance.now();
          
          function interpolateDrift(time: number) {
             let progress = (time - startTime) / 100;
             if (progress > 1) progress = 1;
             cache.marker.setLngLat([
                currentLng + (targetLng - currentLng) * progress,
                currentLat + (targetLat - currentLat) * progress
             ]);
             if (progress < 1) {
                cache.frameId = requestAnimationFrame(interpolateDrift);
             }
          }
          cache.frameId = requestAnimationFrame(interpolateDrift);
          
          // DOM Display Override from Layer Panel
          cache.el.style.display = layers.showBuses ? "block" : "none";

          if (cache.isRunning !== (bus.status === 'Running')) {
             cache.isRunning = bus.status === 'Running';
             cache.root.render(<BusMarkerCanvas map={map} rotationDegrees={bus.location.rotation || 0} isRunning={cache.isRunning} />);
          }
        }
    });

    Object.keys(busMarkers.current).forEach(id => {
       if (!buses.find(b => b._id === id)) {
          const cache = busMarkers.current[id];
          cache.root.unmount();
          cache.marker.remove();
          delete busMarkers.current[id];
       }
    });

  }, [buses, mapLoaded]);

  return (
    <div className="h-full w-full rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-white bg-white">
      <div ref={mapContainer} className="h-full w-full pointer-events-auto" />
    </div>
  );
}
