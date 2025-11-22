
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface FourierSeriesProps {
  onContextUpdate: (context: SimContextData) => void;
}

const FourierSeries: React.FC<FourierSeriesProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [harmonics, setHarmonics] = useState(1);
  const [time, setTime] = useState(0);

  useEffect(() => {
    onContextUpdate({
      name: "Fourier Series",
      description: "Construct complex waves by summing simple sines (Square wave approximation).",
      parameters: {
        "Harmonics (N)": harmonics,
        "Wave Type": "Square Approximation",
        "Series": "4/π * Σ (sin(nx)/n) for odd n"
      }
    });
  }, [harmonics, onContextUpdate]);

  useEffect(() => {
      let animId: number;
      const render = () => {
          const canvas = canvasRef.current;
          if(!canvas) return;
          const ctx = canvas.getContext('2d');
          if(!ctx) return;

          const w = canvas.width;
          const h = canvas.height;
          const cy = h/2;
          
          ctx.clearRect(0,0,w,h);
          
          // Axis
          ctx.strokeStyle = '#525252';
          ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();

          ctx.lineWidth = 2;
          
          // Draw components
          const points: number[] = new Array(w).fill(0);
          
          for(let n=1; n <= harmonics * 2; n+=2) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(100, 116, 139, ${0.5 / Math.sqrt(n)})`; // Faint lines for parts
              
              for(let x=0; x<w; x++) {
                  // Square wave series: sin(x) + sin(3x)/3 + sin(5x)/5 ...
                  const val = (Math.sin((n * x * 0.02) + time)) * (100 / n);
                  if (x===0) ctx.moveTo(x, cy - val);
                  else ctx.lineTo(x, cy - val);
                  
                  points[x] += val;
              }
              ctx.stroke();
          }

          // Draw Sum
          ctx.beginPath();
          ctx.strokeStyle = '#d8b4fe'; // Purple neon
          ctx.lineWidth = 4;
          for(let x=0; x<w; x++) {
              const y = cy - points[x]; // 4/PI scale ignored for visual
              if (x===0) ctx.moveTo(x, y);
              else ctx.lineTo(x, y);
          }
          ctx.stroke();

          setTime(t => t + 0.05);
          animId = requestAnimationFrame(render);
      };
      render();
      return () => cancelAnimationFrame(animId);
  }, [harmonics]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-900 text-white">
      <div className="flex-1 bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-800">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 space-y-6">
         <h2 className="font-bold text-lg">Fourier Controls</h2>
         <div>
            <label className="block text-sm font-bold mb-2">Harmonics: {harmonics}</label>
            <input type="range" min="1" max="20" step="1" value={harmonics} onChange={e => setHarmonics(Number(e.target.value))} className="w-full"/>
            <div className="text-xs text-gray-400 mt-2">
                Adding odd harmonics (1, 3, 5...) approximates a Square Wave.
            </div>
         </div>
      </div>
    </div>
  );
};

export default FourierSeries;