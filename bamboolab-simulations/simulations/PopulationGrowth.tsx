
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface PopulationGrowthProps {
  onContextUpdate: (context: SimContextData) => void;
}

const PopulationGrowth: React.FC<PopulationGrowthProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [startPop, setStartPop] = useState(10);
  const [growthRate, setGrowthRate] = useState(0.5); // r
  const [capacity, setCapacity] = useState(500); // K
  const [time, setTime] = useState(0);
  const [dataPoints, setDataPoints] = useState<number[]>([10]);

  useEffect(() => {
    onContextUpdate({
      name: "Population Growth Model",
      description: "Simulate biological population growth using Logistic Growth model (dN/dt = rN(1 - N/K)).",
      parameters: {
        "Initial Population": startPop,
        "Growth Rate (r)": growthRate,
        "Carrying Capacity (K)": capacity,
        "Current Time": time,
        "Current Population": Math.floor(dataPoints[dataPoints.length-1])
      }
    });
  }, [startPop, growthRate, capacity, time, dataPoints, onContextUpdate]);

  // Simulation Loop
  useEffect(() => {
      const interval = setInterval(() => {
          if (time > 50) return; // Stop after 50 ticks

          setDataPoints(prev => {
              const N = prev[prev.length - 1];
              // Logistic Growth: dN = r * N * (1 - N/K) * dt
              const dt = 0.2;
              const dN = growthRate * N * (1 - N / capacity) * dt;
              return [...prev, N + dN];
          });
          setTime(t => t + 0.2);
      }, 100);
      return () => clearInterval(interval);
  }, [growthRate, capacity, time]);

  const reset = () => {
      setTime(0);
      setDataPoints([startPop]);
  };

  // Render
  useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Graph Area
      const graphH = 300;
      const graphW = 500;
      const padding = 50;

      // Axes
      ctx.beginPath();
      ctx.moveTo(padding, padding);
      ctx.lineTo(padding, padding + graphH); // Y
      ctx.lineTo(padding + graphW, padding + graphH); // X
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Carrying Capacity Line
      const kY = padding + graphH - (capacity / 600) * graphH; // Scale 600 max
      ctx.beginPath();
      ctx.moveTo(padding, kY);
      ctx.lineTo(padding + graphW, kY);
      ctx.strokeStyle = '#94a3b8';
      ctx.setLineDash([5, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#64748b';
      ctx.fillText(`K = ${capacity}`, padding + graphW + 10, kY);

      // Plot Data
      ctx.beginPath();
      ctx.moveTo(padding, padding + graphH - (dataPoints[0]/600)*graphH);
      dataPoints.forEach((p, i) => {
          const x = padding + (i * (graphW/250)); // Scale time steps roughly
          const y = padding + graphH - (p/600)*graphH;
          ctx.lineTo(x, y);
      });
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Visual Organisms (Bunnies?)
      // Draw random dots in a "Petri dish" area on the right
      const dishX = 650;
      const dishY = 200;
      const dishR = 120;

      ctx.beginPath();
      ctx.arc(dishX, dishY, dishR, 0, Math.PI*2);
      ctx.fillStyle = '#ecfdf5';
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.stroke();

      const currentPop = Math.floor(dataPoints[dataPoints.length - 1]);
      const visualCount = Math.min(currentPop, 200); // Cap visual dots
      
      // Random deterministic seed based on index to keep dots stable-ish
      for(let i=0; i<visualCount; i++) {
          const r = (Math.sin(i)*43758.5453) % 1; // pseudo random
          const angle = (Math.cos(i)*43758.5453) * Math.PI * 2;
          const dist = Math.sqrt(r) * (dishR - 5);
          
          const bx = dishX + Math.cos(angle) * dist;
          const by = dishY + Math.sin(angle) * dist;
          
          ctx.beginPath();
          ctx.arc(bx, by, 3, 0, Math.PI*2);
          ctx.fillStyle = '#059669';
          ctx.fill();
      }

      ctx.fillStyle = '#064e3b';
      ctx.textAlign = 'center';
      ctx.fillText(`${currentPop} Organisms`, dishX, dishY + dishR + 30);

  }, [dataPoints, capacity]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-white"
        />
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Growth Parameters</h2>
        
        <div className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Carrying Capacity (K)</label>
             <input 
               type="range" min="100" max="500" value={capacity} 
               onChange={(e) => { setCapacity(Number(e.target.value)); reset(); }}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
             <div className="text-right text-xs text-gray-500">{capacity}</div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Growth Rate (r)</label>
             <input 
               type="range" min="0.1" max="1.0" step="0.1" value={growthRate} 
               onChange={(e) => { setGrowthRate(Number(e.target.value)); reset(); }}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
              <div className="text-right text-xs text-gray-500">{growthRate}</div>
           </div>

           <button 
            onClick={reset}
            className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold hover:bg-brand-700 transition"
           >
               Restart Simulation
           </button>
        </div>
      </div>
    </div>
  );
};

export default PopulationGrowth;
