
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface GravityForceLabProps {
  onContextUpdate: (context: SimContextData) => void;
  mode?: 'gravity' | 'coulomb';
}

const GravityForceLab: React.FC<GravityForceLabProps> = ({ onContextUpdate, mode = 'gravity' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const isCoulomb = mode === 'coulomb';

  // Parameters
  const [m1, setM1] = useState(isCoulomb ? 5 : 100); // Mass or Charge (microCoulombs)
  const [m2, setM2] = useState(isCoulomb ? -5 : 400); // Mass or Charge
  const [distance, setDistance] = useState(4); // meters
  
  const CONSTANT = isCoulomb ? 9000 : 0.00000006674; // k (scaled) or G (scaled)
  const FORCE_SCALE = isCoulomb ? 0.05 : 1000000000; 

  // Reset when mode changes
  useEffect(() => {
    if (isCoulomb) {
      setM1(5);
      setM2(-5);
    } else {
      setM1(100);
      setM2(400);
    }
  }, [isCoulomb]);

  // Calculated values
  // Coulomb: F = k * |q1*q2| / r^2
  // Gravity: F = G * m1*m2 / r^2
  const rawForce = (CONSTANT * Math.abs(m1 * m2)) / (distance * distance);
  const forceDirection = isCoulomb ? (Math.sign(m1) === Math.sign(m2) ? 1 : -1) : -1; // -1 is attractive (towards each other)
  const displayForce = (rawForce * FORCE_SCALE).toFixed(2);

  // AI Context
  useEffect(() => {
    onContextUpdate({
      name: isCoulomb ? "Coulomb's Law (Electrostatics)" : "Gravity Force Lab",
      description: isCoulomb 
        ? "Visualize electrostatic force between two charges (F = k q1q2 / r²)." 
        : "Visualize gravitational force between two masses (F = G m1m2 / r²).",
      parameters: {
        [isCoulomb ? "Charge 1" : "Mass 1"]: `${m1} ${isCoulomb ? 'µC' : 'kg'}`,
        [isCoulomb ? "Charge 2" : "Mass 2"]: `${m2} ${isCoulomb ? 'µC' : 'kg'}`,
        "Distance": `${distance} m`,
        "Force Magnitude": `${displayForce} N`,
        "Interaction": forceDirection > 0 ? "Repulsive" : "Attractive"
      }
    });
  }, [m1, m2, distance, displayForce, isCoulomb, forceDirection, onContextUpdate]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerY = canvas.height / 2;
    const centerX = canvas.width / 2;
    const pxPerMeter = 100;

    const x1 = centerX - (distance * pxPerMeter) / 2;
    const x2 = centerX + (distance * pxPerMeter) / 2;

    // Draw Objects
    const r1 = 20 + Math.sqrt(Math.abs(m1));
    const r2 = 20 + Math.sqrt(Math.abs(m2));

    // Object 1
    ctx.beginPath();
    ctx.arc(x1, centerY, r1, 0, Math.PI * 2);
    if (isCoulomb) {
        ctx.fillStyle = m1 > 0 ? '#ef4444' : '#3b82f6'; // Red (+), Blue (-)
    } else {
        ctx.fillStyle = '#ef4444';
    }
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    ctx.fillText(isCoulomb ? (m1 > 0 ? '+' : '-') : 'm1', x1, centerY + 5);

    // Object 2
    ctx.beginPath();
    ctx.arc(x2, centerY, r2, 0, Math.PI * 2);
    if (isCoulomb) {
        ctx.fillStyle = m2 > 0 ? '#ef4444' : '#3b82f6';
    } else {
        ctx.fillStyle = '#3b82f6';
    }
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(isCoulomb ? (m2 > 0 ? '+' : '-') : 'm2', x2, centerY + 5);

    // Draw Ruler
    ctx.beginPath();
    ctx.moveTo(x1, centerY + 80);
    ctx.lineTo(x2, centerY + 80);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Ruler ticks
    ctx.beginPath();
    ctx.moveTo(x1, centerY + 70);
    ctx.lineTo(x1, centerY + 90);
    ctx.moveTo(x2, centerY + 70);
    ctx.lineTo(x2, centerY + 90);
    ctx.stroke();

    ctx.fillStyle = '#64748b';
    ctx.fillText(`${distance} meters`, centerX, centerY + 100);

    // Draw Force Vectors
    const maxLen = 150;
    const arrowLen = Math.min(rawForce * FORCE_SCALE * (isCoulomb ? 2 : 5), maxLen); 
    
    // Force on 1
    // if attractive (forceDirection -1), points right (+). if repulsive (+1), points left (-).
    const dir1 = forceDirection === -1 ? 1 : -1;
    
    ctx.beginPath();
    ctx.moveTo(x1 + (dir1 * r1), centerY);
    ctx.lineTo(x1 + (dir1 * (r1 + arrowLen)), centerY);
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.stroke();
    // Arrowhead 1
    ctx.beginPath();
    const tip1 = x1 + (dir1 * (r1 + arrowLen));
    ctx.moveTo(tip1, centerY);
    ctx.lineTo(tip1 - (dir1 * 10), centerY - 5);
    ctx.lineTo(tip1 - (dir1 * 10), centerY + 5);
    ctx.fillStyle = '#1e293b';
    ctx.fill();
    ctx.fillText(`${displayForce}N`, x1 + (dir1 * (r1 + arrowLen)) + (dir1 * 20), centerY - 15);

    // Force on 2
    // if attractive (-1), points left (-). if repulsive (+1), points right (+).
    const dir2 = forceDirection === -1 ? -1 : 1;

    ctx.beginPath();
    ctx.moveTo(x2 + (dir2 * r2), centerY);
    ctx.lineTo(x2 + (dir2 * (r2 + arrowLen)), centerY);
    ctx.stroke();
    // Arrowhead 2
    ctx.beginPath();
    const tip2 = x2 + (dir2 * (r2 + arrowLen));
    ctx.moveTo(tip2, centerY);
    ctx.lineTo(tip2 - (dir2 * 10), centerY - 5);
    ctx.lineTo(tip2 - (dir2 * 10), centerY + 5);
    ctx.fill();
    ctx.fillText(`${displayForce}N`, x2 + (dir2 * (r2 + arrowLen)) + (dir2 * 20), centerY - 15);

  }, [m1, m2, distance, rawForce, displayForce, isCoulomb, forceDirection]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-white"
        />
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow text-xs font-mono">
           {isCoulomb ? 'F = k(q₁q₂)/r²' : 'F = G(m₁m₂)/r²'}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Parameters</h2>
        
        <div className="space-y-6">
           <div className="bg-red-50 p-3 rounded-xl border border-red-100">
             <label className="block text-sm font-bold text-red-800 mb-1">
               {isCoulomb ? 'Charge 1 (q₁)' : 'Mass 1 (m₁)'}: {m1} {isCoulomb ? 'µC' : 'kg'}
             </label>
             <input 
               type="range" 
               min={isCoulomb ? "-10" : "10"} 
               max={isCoulomb ? "10" : "1000"} 
               step={isCoulomb ? "1" : "10"} 
               value={m1} 
               onChange={(e) => setM1(Number(e.target.value))}
               className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
             />
           </div>

           <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
             <label className="block text-sm font-bold text-blue-800 mb-1">
                {isCoulomb ? 'Charge 2 (q₂)' : 'Mass 2 (m₂)'}: {m2} {isCoulomb ? 'µC' : 'kg'}
             </label>
             <input 
               type="range" 
               min={isCoulomb ? "-10" : "10"} 
               max={isCoulomb ? "10" : "1000"} 
               step={isCoulomb ? "1" : "10"} 
               value={m2} 
               onChange={(e) => setM2(Number(e.target.value))}
               className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Distance: {distance} m</label>
             <input 
               type="range" min="2" max="7" step="0.1" value={distance} 
               onChange={(e) => setDistance(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GravityForceLab;
