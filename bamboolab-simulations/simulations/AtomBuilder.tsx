
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface AtomBuilderProps {
  onContextUpdate: (context: SimContextData) => void;
}

const ELEMENTS = [
  { n: 0, sym: 'n', name: 'Neutron' },
  { n: 1, sym: 'H', name: 'Hydrogen' },
  { n: 2, sym: 'He', name: 'Helium' },
  { n: 3, sym: 'Li', name: 'Lithium' },
  { n: 4, sym: 'Be', name: 'Beryllium' },
  { n: 5, sym: 'B', name: 'Boron' },
  { n: 6, sym: 'C', name: 'Carbon' },
  { n: 7, sym: 'N', name: 'Nitrogen' },
  { n: 8, sym: 'O', name: 'Oxygen' },
  { n: 9, sym: 'F', name: 'Fluorine' },
  { n: 10, sym: 'Ne', name: 'Neon' },
];

const AtomBuilder: React.FC<AtomBuilderProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [protons, setProtons] = useState(1);
  const [neutrons, setNeutrons] = useState(0);
  const [electrons, setElectrons] = useState(1);

  const element = ELEMENTS[protons] || { sym: '?', name: 'Unknown' };
  const massNumber = protons + neutrons;
  const charge = protons - electrons;
  const isIon = charge !== 0;
  const isStable = Math.abs(protons - neutrons) <= (protons * 0.5 + 1); // Rough stability heuristic

  useEffect(() => {
    onContextUpdate({
      name: "Atom Builder",
      description: "Build an atom by adding protons, neutrons, and electrons. Learn about elements, ions, and stability.",
      parameters: {
        "Element": element.name,
        "Symbol": element.sym,
        "Protons (Atomic #)": protons,
        "Neutrons": neutrons,
        "Electrons": electrons,
        "Net Charge": charge > 0 ? `+${charge}` : charge.toString(),
        "Mass Number": massNumber,
        "Stability": isStable ? "Stable" : "Unstable"
      }
    });
  }, [protons, neutrons, electrons, element, charge, massNumber, isStable, onContextUpdate]);

  useEffect(() => {
    let frameId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      ctx.clearRect(0, 0, w, h);

      // Draw Orbits (Bohr Model)
      const shells = [100, 160, 220]; // pixel radii
      shells.forEach(r => {
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 2;
          ctx.stroke();
      });

      // Draw Electrons
      const now = Date.now() / 1000;
      let eRemaining = electrons;
      
      // Shell 1 capacity: 2
      const s1Count = Math.min(eRemaining, 2);
      eRemaining -= s1Count;
      for(let i=0; i<s1Count; i++) {
          const angle = now * 2 + (i * Math.PI);
          const x = cx + Math.cos(angle) * shells[0];
          const y = cy + Math.sin(angle) * shells[0];
          drawParticle(ctx, x, y, '#3b82f6', '-');
      }

      // Shell 2 capacity: 8
      const s2Count = Math.min(eRemaining, 8);
      eRemaining -= s2Count;
      for(let i=0; i<s2Count; i++) {
          const angle = now * 1.5 + (i * (Math.PI * 2 / 8));
          const x = cx + Math.cos(angle) * shells[1];
          const y = cy + Math.sin(angle) * shells[1];
          drawParticle(ctx, x, y, '#3b82f6', '-');
      }

      // Shell 3
      for(let i=0; i<eRemaining; i++) {
          const angle = now * 1 + (i * (Math.PI * 2 / 8));
          const x = cx + Math.cos(angle) * shells[2];
          const y = cy + Math.sin(angle) * shells[2];
          drawParticle(ctx, x, y, '#3b82f6', '-');
      }

      // Draw Nucleus
      // Cluster packing visualization (pseudo-random but seeded by count)
      const particles = [];
      for(let i=0; i<protons; i++) particles.push({type:'p'});
      for(let i=0; i<neutrons; i++) particles.push({type:'n'});
      
      // Sort to mix slightly or leave as is.
      // Draw them in a spiral/clump
      particles.forEach((p, i) => {
          // Spiral placement
          const radius = 6 * Math.sqrt(i);
          const angle = i * 2.4; 
          const x = cx + Math.cos(angle) * radius;
          const y = cy + Math.sin(angle) * radius;
          
          if (p.type === 'p') {
              drawParticle(ctx, x, y, '#ef4444', '+');
          } else {
              drawParticle(ctx, x, y, '#9ca3af', '');
          }
      });

      // Info Overlay in canvas (Symbol)
      if (particles.length > 0) {
          // Skip if nucleus covers it? No, draw on top corner
      }
      
      frameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(frameId);
  }, [protons, neutrons, electrons]);

  const drawParticle = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, label: string) => {
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI*2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.fillStyle = 'white';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, x, y);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-gray-50"
        />
        {/* Symbol Card */}
        <div className="absolute top-4 right-4 w-32 h-40 bg-white shadow-xl border border-gray-200 rounded-xl flex flex-col items-center justify-center p-4">
            <div className="text-3xl font-bold text-gray-900">{element.sym}</div>
            <div className="text-sm font-medium text-gray-600">{element.name}</div>
            <div className="w-full h-px bg-gray-200 my-2"></div>
            <div className="text-xs text-gray-500">Mass: {massNumber}</div>
            <div className="text-xs text-gray-500">Charge: {charge}</div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Particles</h2>
        
        <div className="space-y-6">
           {/* Protons */}
           <div className="bg-red-50 p-4 rounded-xl flex items-center justify-between">
             <div>
                <div className="font-bold text-red-800">Protons</div>
                <div className="text-xs text-red-600">Determines Element</div>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={()=>setProtons(Math.max(1, protons-1))} className="w-8 h-8 rounded-full bg-red-200 hover:bg-red-300 text-red-800 font-bold">-</button>
                <span className="font-mono text-xl w-6 text-center">{protons}</span>
                <button onClick={()=>setProtons(Math.min(10, protons+1))} className="w-8 h-8 rounded-full bg-red-200 hover:bg-red-300 text-red-800 font-bold">+</button>
             </div>
           </div>

           {/* Neutrons */}
           <div className="bg-gray-100 p-4 rounded-xl flex items-center justify-between">
             <div>
                <div className="font-bold text-gray-800">Neutrons</div>
                <div className="text-xs text-gray-600">Stabilizes Nucleus</div>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={()=>setNeutrons(Math.max(0, neutrons-1))} className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">-</button>
                <span className="font-mono text-xl w-6 text-center">{neutrons}</span>
                <button onClick={()=>setNeutrons(Math.min(15, neutrons+1))} className="w-8 h-8 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold">+</button>
             </div>
           </div>

           {/* Electrons */}
           <div className="bg-blue-50 p-4 rounded-xl flex items-center justify-between">
             <div>
                <div className="font-bold text-blue-800">Electrons</div>
                <div className="text-xs text-blue-600">Determines Charge</div>
             </div>
             <div className="flex items-center gap-3">
                <button onClick={()=>setElectrons(Math.max(0, electrons-1))} className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold">-</button>
                <span className="font-mono text-xl w-6 text-center">{electrons}</span>
                <button onClick={()=>setElectrons(Math.min(10, electrons+1))} className="w-8 h-8 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-800 font-bold">+</button>
             </div>
           </div>

           {!isStable && (
               <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded-lg text-sm flex items-center gap-2">
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                   Unstable Nucleus!
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AtomBuilder;
