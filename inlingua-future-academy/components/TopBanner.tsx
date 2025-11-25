
import React from 'react';
import { Wifi, Battery, Globe } from 'lucide-react';

const TopBanner: React.FC = () => {
  return (
    <div className="bg-slate-950 border-b border-white/10 h-10 flex items-center justify-between px-4 text-[10px] md:text-xs font-mono text-brand-accent overflow-hidden relative z-50">
      
      {/* Left Status */}
      <div className="flex items-center gap-4 shrink-0 z-10 bg-slate-950 pr-4">
        <div className="flex items-center gap-2">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="hidden md:inline">SYSTEM ONLINE</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-500">
           <Globe size={12} />
           <span>SGP-NODE-01</span>
        </div>
      </div>

      {/* Scrolling Text (Marquee) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap flex gap-10">
          <span>// INLINGUA FUTURE LANGUAGE ACADEMY</span>
          <span>// QUALITY LANGUAGE TRAINING</span>
          <span>// NEURAL INTERFACE READY</span>
          <span>// ADAPTIVE LEARNING PROTOCOLS ENGAGED</span>
          <span>// EST. 1972 -- UPGRADED 2025</span>
          <span>// INLINGUA FUTURE LANGUAGE ACADEMY</span>
          <span>// QUALITY LANGUAGE TRAINING</span>
        </div>
      </div>

      {/* Right Status */}
      <div className="flex items-center gap-4 shrink-0 z-10 bg-slate-950 pl-4">
        <div className="flex items-center gap-2">
          <Wifi size={14} className="text-brand-primary" />
          <span className="hidden md:inline">5G CONNECTED</span>
        </div>
        <div className="flex items-center gap-1">
           <Battery size={14} className="text-brand-primary" />
           <span>100%</span>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
};

export default TopBanner;
