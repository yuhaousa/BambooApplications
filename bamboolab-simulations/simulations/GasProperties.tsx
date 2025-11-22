import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface GasPropertiesProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

const GasProperties: React.FC<GasPropertiesProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [temperature, setTemperature] = useState(300); // Kelvin
  const [volume, setVolume] = useState(500); // Arbitrary width units
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pressure, setPressure] = useState(0);

  // Init particles
  useEffect(() => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * volume,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * (temperature / 50),
        vy: (Math.random() - 0.5) * (temperature / 50),
        color: i % 2 === 0 ? '#a855f7' : '#ec4899'
      });
    }
    setParticles(newParticles);
  }, []);

  // Update speed when temp changes
  useEffect(() => {
    setParticles(prev => prev.map(p => {
        const currentSpeed = Math.sqrt(p.vx*p.vx + p.vy*p.vy);
        const targetSpeed = Math.sqrt(temperature) / 5; // rough scaling
        const scale = targetSpeed / (currentSpeed || 1);
        return {
            ...p,
            vx: p.vx * scale,
            vy: p.vy * scale
        };
    }));
  }, [temperature]);

  // AI Context
  useEffect(() => {
    onContextUpdate({
      name: "Gas Properties (Ideal Gas Law)",
      description: "Observe gas particles in a container. Relate Pressure, Volume, and Temperature (PV = nRT).",
      parameters: {
        "Temperature": `${temperature} K`,
        "Volume (Width)": `${volume} nm`,
        "Pressure": `${pressure.toFixed(1)} atm`,
        "Number of Particles": "50"
      }
    });
  }, [temperature, volume, pressure, onContextUpdate]);

  const animate = useCallback(() => {
    let collisions = 0;
    
    setParticles(prev => {
        const next = prev.map(p => {
            let newX = p.x + p.vx;
            let newY = p.y + p.vy;
            let newVx = p.vx;
            let newVy = p.vy;

            // Walls
            if (newX <= 0) { newX = 0; newVx *= -1; collisions++; }
            if (newX >= volume) { newX = volume; newVx *= -1; collisions++; }
            if (newY <= 0) { newY = 0; newVy *= -1; collisions++; }
            if (newY >= 400) { newY = 400; newVy *= -1; collisions++; }

            return { x: newX, y: newY, vx: newVx, vy: newVy, color: p.color };
        });
        return next;
    });

    // Rough pressure calculation based on wall hits
    setPressure(prev => (prev * 0.9) + (collisions * 0.1));

    requestRef.current = requestAnimationFrame(animate);
  }, [volume]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Container
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, volume, 400);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#334155';
    ctx.strokeRect(0, 0, volume, 400);

    // Lid/Piston
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(volume, 0, 20, 400);
    
    // Particles
    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

  }, [particles, volume]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-gray-100"
        />
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow border text-right">
           <div className="text-sm text-gray-500">Pressure Gauge</div>
           <div className="text-2xl font-mono font-bold text-gray-800">{pressure.toFixed(1)} atm</div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Controls</h2>
        
        <div className="space-y-6">
           <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
             <label className="block text-sm font-bold text-orange-800 mb-1">Temperature (T)</label>
             <input 
               type="range" min="50" max="1000" step="10" value={temperature} 
               onChange={(e) => setTemperature(Number(e.target.value))}
               className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
             />
             <div className="text-right text-xs text-orange-600 font-bold">{temperature} K</div>
           </div>

           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-1">Volume (V)</label>
             <input 
               type="range" min="100" max="750" step="10" value={volume} 
               onChange={(e) => setVolume(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
             />
           </div>

           <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p><strong>Ideal Gas Law:</strong> PV = nRT</p>
              <p className="mt-1 text-xs">Reducing volume or increasing temperature increases pressure (collision frequency).</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default GasProperties;