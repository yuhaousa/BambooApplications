
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface EnergySkateParkProps {
  onContextUpdate: (context: SimContextData) => void;
}

const EnergySkatePark: React.FC<EnergySkateParkProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  const [mass, setMass] = useState(60); // kg
  const [friction, setFriction] = useState(0.0); 
  const [isDragging, setIsDragging] = useState(false);

  const [x, setX] = useState(-4); // meters (horizontal)
  const [vx, setVx] = useState(0);

  // Track Shape y = 0.2 * x^2
  const getTrackY = (xVal: number) => 0.2 * xVal * xVal;
  const getTrackSlope = (xVal: number) => 0.4 * xVal;

  const g = 9.8;
  const h = getTrackY(x);
  const vTotal = Math.sqrt(vx*vx + (vx * getTrackSlope(x))**2); // approximate speed along curve? 
  // Simplified physics: Conservation of energy approach or slope force
  // PE = mgh
  // KE = 0.5 m v^2
  
  const pe = mass * g * h;
  const ke = 0.5 * mass * vTotal * vTotal; // Note: this vTotal derivation is tricky in component form
  
  useEffect(() => {
    onContextUpdate({
      name: "Energy Skate Park",
      description: "Learn about conservation of energy with a skater on a ramp. Kinetic vs Potential Energy.",
      parameters: {
        "Mass": `${mass} kg`,
        "Height": `${h.toFixed(2)} m`,
        "Speed": `${Math.abs(vx).toFixed(2)} m/s`, // roughly
        "Potential Energy": `${(pe/1000).toFixed(2)} kJ`,
        "Kinetic Energy": `${(ke/1000).toFixed(2)} kJ`,
        "Friction": friction > 0 ? "On" : "Off"
      }
    });
  }, [mass, h, vx, pe, ke, friction, onContextUpdate]);

  useEffect(() => {
    const animate = () => {
        if (!isDragging) {
            setVx(prevVx => {
                // Slope Force: F_tangent = -mg sin(theta)
                // tan(theta) = dy/dx = 0.4x
                // theta = atan(0.4x)
                // sin(theta) approx 
                const slope = getTrackSlope(x);
                const theta = Math.atan(slope);
                const a_tangent = -g * Math.sin(theta);
                
                // Project acceleration to x-axis roughly
                const ax = a_tangent * Math.cos(theta); 
                
                // Friction
                let fScale = 1;
                if (friction > 0) fScale = 1 - (friction * 0.02);

                return (prevVx + ax * 0.05) * fScale;
            });

            setX(prevX => {
                return prevX + vx * 0.05;
            });
        }
        requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [x, vx, isDragging, friction]);

  // Draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const hCanvas = canvas.height;
    const cx = w / 2;
    const cy = hCanvas - 50;
    const scale = 50; // px per meter

    ctx.clearRect(0, 0, w, hCanvas);

    // Draw Sky
    const grad = ctx.createLinearGradient(0, 0, 0, hCanvas);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(1, '#ffffff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, hCanvas);

    // Draw Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    for(let i=-10; i<=10; i++) {
        const gx = cx + i * scale;
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, hCanvas); ctx.stroke();
        const gy = cy - i * scale;
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke();
    }

    // Draw Track
    ctx.beginPath();
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#64748b';
    for(let i = -8; i <= 8; i+=0.1) {
        const tx = cx + i * scale;
        const ty = cy - getTrackY(i) * scale;
        if (i===-8) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
    }
    ctx.stroke();

    // Skater
    const skX = cx + x * scale;
    const skY = cy - getTrackY(x) * scale;
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(skX, skY - 10, 10, 0, Math.PI*2); ctx.fill();
    // Body
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(skX, skY-10); ctx.lineTo(skX, skY-30); ctx.stroke();

    // Bar Chart (Energy)
    // PE
    const barX = 50;
    const barY = 100;
    const barScale = 0.05;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, barY, 30, pe * barScale);
    ctx.fillText("PE", barX, barY + pe*barScale + 15);
    
    // KE
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX + 40, barY, 30, ke * barScale); // Should actually grow up, but simple vis for now
    // Let's make bars grow UP from a baseline
    const baseLine = 200;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(barX, baseLine - pe*barScale, 30, pe*barScale);
    ctx.fillText("PE", barX + 5, baseLine + 15);
    
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(barX + 50, baseLine - ke*barScale, 30, ke*barScale);
    ctx.fillText("KE", barX + 55, baseLine + 15);

    ctx.fillStyle = '#eab308'; // Total
    const total = pe + ke;
    ctx.fillRect(barX + 100, baseLine - total*barScale, 30, total*barScale);
    ctx.fillText("Total", barX + 100, baseLine + 15);

  }, [x, pe, ke]);

  // Mouse Handler for Dragging Skater
  const handleMouseDown = () => {
      setIsDragging(true);
      setVx(0);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging) {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const rect = canvas.getBoundingClientRect();
          const mx = e.clientX - rect.left;
          const scale = 50;
          const newX = (mx - canvas.width/2) / scale;
          if (newX > -8 && newX < 8) setX(newX);
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={()=>setIsDragging(false)}
          onMouseLeave={()=>setIsDragging(false)}
          className="w-full h-full object-contain bg-white cursor-pointer"
        />
        <div className="absolute bottom-4 right-4 text-gray-400 text-xs">
           Drag skater to drop
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Physics Controls</h2>
        
        <div className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Skater Mass</label>
             <input 
               type="range" min="40" max="100" value={mass} 
               onChange={(e) => setMass(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Friction</label>
             <input 
               type="range" min="0" max="1" step="0.1" value={friction} 
               onChange={(e) => setFriction(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
             />
           </div>

           <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-sm text-green-900">
               <strong>Energy Principle:</strong><br/>
               Potential Energy converts to Kinetic Energy as the skater goes down. Total Energy remains constant (unless friction is on).
           </div>
        </div>
      </div>
    </div>
  );
};

export default EnergySkatePark;
