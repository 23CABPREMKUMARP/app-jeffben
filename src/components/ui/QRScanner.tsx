"use client";

import React, { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner, Html5Qrcode } from "html5-qrcode";
import { X, Camera, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface QRScannerProps {
  onScan: (decodedText: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // Check if camera permission is available
    if (typeof window !== "undefined") {
      const html5QrCode = new Html5Qrcode("reader");
      scannerRef.current = html5QrCode;

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      html5QrCode.start(
        { facingMode: "environment" },
        config,
        (decodedText) => {
          onScan(decodedText);
          html5QrCode.stop();
        },
        (errorMessage) => {
          // console.log("Scanning...", errorMessage);
        }
      ).catch((err) => {
        setError("Camera access denied or device has no camera.");
        console.error("Camera error:", err);
      });

      return () => {
        if (html5QrCode.isScanning) {
          html5QrCode.stop().catch(console.error);
        }
      };
    }
  }, [onScan]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 sm:p-6"
    >
      <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[32px] md:rounded-[48px] overflow-hidden shadow-2xl border-4 border-white/20 max-h-[90vh] flex flex-col">
        <div className="absolute top-4 right-4 md:top-6 md:right-6 z-10">
          <button 
            onClick={() => {
              if (scannerRef.current?.isScanning) {
                scannerRef.current.stop().then(() => onClose());
              } else {
                onClose();
              }
            }}
            className="w-10 h-10 md:w-12 md:h-12 bg-black/5 hover:bg-black/10 rounded-[14px] md:rounded-2xl flex items-center justify-center transition-all"
          >
            <X size={20} className="text-zinc-600 md:w-6 md:h-6 md:text-zinc-400" />
          </button>
        </div>

        <div className="p-6 md:p-12 space-y-6 md:space-y-8 overflow-y-auto">
          <div className="text-center space-y-1 md:space-y-2 pt-2 md:pt-0">
            <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tighter uppercase italic">Scan Bus QR</h3>
            <p className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">Connect to Jeffben Fleet Instantly</p>
          </div>

          <div className="relative aspect-square w-full rounded-[24px] md:rounded-[40px] overflow-hidden bg-black border-4 border-zinc-50 shadow-inner">
            <div id="reader" className="w-full h-full" />
            
            {/* Visual Scanner Frame */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 border-2 border-dashed border-primary/50 rounded-[20px] md:rounded-[32px] animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-[90%] h-1 bg-primary shadow-[0_0_20px_rgba(241,135,1,0.9)] animate-[scan_2s_infinite]" />
            </div>

            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white p-6 md:p-8 text-center gap-3 md:gap-4">
                <Camera size={36} className="text-rose-500 md:w-12 md:h-12" />
                <p className="font-black text-[10px] md:text-sm uppercase tracking-widest">{error}</p>
                <button onClick={onClose} className="mt-2 md:mt-4 px-6 md:px-8 py-2 md:py-3 bg-primary text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-xs uppercase tracking-widest">Close Scanner</button>
              </div>
            )}
          </div>

          <div className="p-4 md:p-6 bg-zinc-50 rounded-[24px] md:rounded-[32px] border border-zinc-100 flex items-center gap-4 md:gap-6">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-sm shrink-0">
              <Zap size={20} className="text-primary animate-pulse md:w-6 md:h-6" />
            </div>
            <div className="space-y-0.5 md:space-y-1">
              <p className="text-[8px] md:text-[9px] font-black text-zinc-400 uppercase tracking-widest leading-none">High-Speed Link</p>
              <p className="text-[10px] md:text-xs font-black text-zinc-900 uppercase leading-snug">Validating QR Signal</p>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0% { top: 10%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0; }
        }
        #reader__dashboard { display: none !important; }
        #reader video { 
          object-fit: cover !important; 
          width: 100% !important; 
          height: 100% !important; 
          border-radius: 40px !important;
        }
      `}</style>
    </motion.div>
  );
};

export default QRScanner;
