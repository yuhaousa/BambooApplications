
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface FrictionRampProps {
  onContextUpdate: (context: SimContextData) => void;
}

const FrictionRamp: React.FC<FrictionRampProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [angle, setAngle] = useState(20); // degrees
  const [mass, setMass] = useState(10); // kg
  const [mu, setMu] = useState(0.3); // Coefficient of friction
  const [position, setPosition] = useState(0); // meters along ramp
  const [velocity, setVelocity] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const g = 9.8;
  const rad = (angle * Math.PI) / 180;
  
  // Forces
  const fGravity = mass * g * Math.sin(rad);
  const normalForce = mass * g * Math.cos(rad);
  const maxFriction = mu * normalForce;
  // If moving, kinetic friction opposes velocity. If stationary, static friction opposes gravity.
  // Simplified: Assume mu_s = mu_k for this demo.
  
  // Net Force Logic for animation loop
  const getNetForce = (v: number) => {
      if (Math.abs(v) > 0.01) {
          // Moving down
          return fGravity - maxFriction; 
      } else {
          // Stationary
          return fGravity > maxFriction ? fGravity - maxFriction : 0;
      }
  };

  const netForce = getNetForce(velocity);
  const acceleration = netForce / mass;

  useEffect(() => {
    onContextUpdate({
      name: "Friction Ramp",
      description: "Analyze forces on a ramp. Adjust angle, mass, and friction.",
      parameters: {
        "Angle": `${angle}°`,
        "Mass": `${mass} kg`,
        "Friction Coeff": mu,
        "Gravity Force (Parallel)": `${fGravity.toFixed(1)} N`,
        "Friction Force": `${(Math.min(fGravity, maxFriction)).toFixed(1)} N`,
        "Net Force": `${netForce.toFixed(1)} N`,
        "Acceleration": `${acceleration.toFixed(2)} m/s²`
      }
    });
  }, [angle, mass, mu, netForce, acceleration, onContextUpdate]);

  useEffect(() => {
    let animId: number;
    if (isRunning) {
        const loop = () => {
            if (position > 10) { setIsRunning(false); return; } // End of ramp
            
            setVelocity(v => v + acceleration * 0.05);
            setPosition(p => p + velocity * 0.05);
            animId = requestAnimationFrame(loop);
        };
        animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isRunning, acceleration, velocity, position]);

  // Drawing
  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;
      
      ctx.clearRect(0,0,canvas.width, canvas.height);
      
      const cx = 100;
      const cy = 400;
      const rampLen = 600;
      
      // Ramp
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      const endX = cx + rampLen * Math.cos(-rad);
      const endY = cy + rampLen * Math.sin(-rad);
      ctx.lineTo(endX, endY);
      ctx.lineTo(endX, cy);
      ctx.lineTo(cx, cy);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.strokeStyle = '#64748b';
      ctx.stroke();
      
      // Box
      const boxSize = 40 + mass;
      const boxPos = position * 50; // Scale meters to pixels
      
      const boxCenterX = cx + boxPos * Math.cos(-rad) - (boxSize/2 * Math.sin(rad)); 
      // This math is tricky for box sitting ON line, simplified:
      // Box origin (bottom center) is at dist along line
      const bx = cx + boxPos * Math.cos(-rad);
      const by = cy + boxPos * Math.sin(-rad);
      
      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(-rad);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, -boxSize, boxSize, boxSize);
      
      // Force Vectors relative to box
      // Gravity (Down)
      ctx.beginPath(); ctx.moveTo(boxSize/2, -boxSize/2); 
      ctx.rotate(rad); // Rotate back to vertical
      ctx.lineTo(boxSize/2, boxSize/2 + 50);
      ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 3; ctx.stroke();
      ctx.rotate(-rad); // Back to ramp
      
      // Friction (Back)
      ctx.beginPath(); ctx.moveTo(0, -2); ctx.lineTo(-50, -2);
      ctx.strokeStyle = '#3b82f6'; ctx.stroke();

      ctx.restore();

      // Angle Arc
      ctx.beginPath();
      ctx.arc(cx, cy, 50, -rad, 0);
      ctx.stroke();
      ctx.fillText(`${angle}°`, cx + 60, cy - 10);

  }, [angle, mass, position, rad]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
         <h2 className="font-bold text-lg">Controls</h2>
         <div>
            <label className="block text-sm font-bold">Ramp Angle</label>
            <input type="range" min="0" max="60" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full"/>
         </div>
         <div>
            <label className="block text-sm font-bold">Friction (µ)</label>
            <input type="range" min="0" max="1" step="0.1" value={mu} onChange={e => setMu(Number(e.target.value))} className="w-full"/>
         </div>
         <button onClick={() => {setPosition(0); setVelocity(0); setIsRunning(!isRunning)}} className="btn bg-brand-600 text-white p-3 rounded w-full">
            {isRunning ? 'Reset' : 'Start Slide'}
         </button>
      </div>
    </div>
  );
};

export default FrictionRamp;