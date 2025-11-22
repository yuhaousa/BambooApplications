
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface PHScaleProps {
  onContextUpdate: (context: SimContextData) => void;
}

const PHScale: React.FC<PHScaleProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ph, setPh] = useState(7);
  
  // Liquid Color Interpolation
  const getColor = (val: number) => {
      if (val < 3) return '#ef4444'; // Red (Acid)
      if (val < 6) return '#eab308'; // Yellow
      if (val === 7) return '#22c55e'; // Green (Neutral)
      if (val < 11) return '#3b82f6'; // Blue
      return '#a855f7'; // Purple (Base)
  };

  const liquidColor = getColor(ph);
  const hConcentration = Math.pow(10, -ph);
  const ohConcentration = Math.pow(10, -(14-ph));

  useEffect(() => {
    onContextUpdate({
      name: "pH Scale",
      description: "Measure acidity and alkalinity. pH = -log[H+].",
      parameters: {
        "pH Level": ph,
        "Type": ph < 7 ? "Acidic" : ph > 7 ? "Basic (Alkaline)" : "Neutral",
        "[H+] Conc.": `10^${-ph} mol/L`,
        "[OH-] Conc.": `10^${-(14-ph)} mol/L`
      }
    });
  }, [ph, onContextUpdate]);

  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0,0,w,h);

      // Beaker
      const bx = 300; const by = 100; const bw = 200; const bh = 300;
      ctx.fillStyle = liquidColor;
      ctx.globalAlpha = 0.6;
      ctx.fillRect(bx, by + 50, bw, bh - 50);
      ctx.globalAlpha = 1.0;
      
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 4;
      ctx.strokeRect(bx, by, bw, bh);

      // Particles
      // H+ (Red dots), OH- (Blue dots)
      // Scale dots based on log scale is hard, so we clamp for visual
      const numH = ph < 7 ? (7-ph) * 20 : 5;
      const numOH = ph > 7 ? (ph-7) * 20 : 5;

      const drawDots = (count: number, color: string, label: string) => {
         ctx.fillStyle = color;
         ctx.font = '10px sans-serif';
         for(let i=0; i<count; i++) {
             const x = bx + 10 + Math.random()*(bw-20);
             const y = by + 60 + Math.random()*(bh-70);
             ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill();
             ctx.fillStyle='white'; ctx.fillText(label, x-3, y+3); ctx.fillStyle=color;
         }
      };

      drawDots(numH, '#b91c1c', 'H+');
      drawDots(numOH, '#1e40af', 'OH-');

  }, [ph, liquidColor]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
         <h2 className="font-bold text-lg">Solution Settings</h2>
         <div>
            <label className="block text-sm font-bold mb-2">pH Level: {ph}</label>
            <input type="range" min="0" max="14" step="0.5" value={ph} onChange={e => setPh(Number(e.target.value))} className="w-full h-4 rounded-lg appearance-none cursor-pointer" style={{background: 'linear-gradient(to right, red, yellow, green, blue, purple)'}}/>
         </div>
         <div className="bg-gray-100 p-4 rounded">
            <div className="text-sm text-gray-600">Common Examples:</div>
            <div className="grid grid-cols-2 gap-2 text-xs mt-2 font-semibold">
                <button onClick={()=>setPh(2)} className="bg-red-100 p-2 rounded">Stomach Acid (2)</button>
                <button onClick={()=>setPh(7)} className="bg-green-100 p-2 rounded">Water (7)</button>
                <button onClick={()=>setPh(9)} className="bg-blue-100 p-2 rounded">Soap (9)</button>
                <button onClick={()=>setPh(12)} className="bg-purple-100 p-2 rounded">Bleach (12)</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default PHScale;