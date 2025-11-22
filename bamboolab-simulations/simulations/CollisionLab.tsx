
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface CollisionLabProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface Ball {
  id: number;
  x: number;
  v: number; // velocity
  m: number; // mass
  r: number; // radius
  color: string;
}

const CollisionLab: React.FC<CollisionLabProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [elasticity, setElasticity] = useState(1.0); // 1 = elastic, 0 = inelastic
  const [isRunning, setIsRunning] = useState(false);

  // State
  const [balls, setBalls] = useState<Ball[]>([
    { id: 1, x: 200, v: 5, m: 2, r: 30, color: '#ef4444' },
    { id: 2, x: 600, v: -3, m: 2, r: 30, color: '#3b82f6' }
  ]);

  const SCALE_X = 1; // 1 pixel = 1 unit distance
  const GROUND_Y = 300;

  // AI Context
  useEffect(() => {
    const p1 = balls[0].m * balls[0].v;
    const p2 = balls[1].m * balls[1].v;
    const totalP = p1 + p2;
    const ke = 0.5 * balls[0].m * balls[0].v**2 + 0.5 * balls[1].m * balls[1].v**2;

    onContextUpdate({
      name: "Collision Lab (Momentum)",
      description: "Explore conservation of momentum and energy in 1D collisions. Adjust mass, velocity, and elasticity.",
      parameters: {
        "Elasticity": `${(elasticity * 100).toFixed(0)}%`,
        "Red Ball Mass": `${balls[0].m} kg`,
        "Red Ball Vel": `${balls[0].v.toFixed(2)} m/s`,
        "Blue Ball Mass": `${balls[1].m} kg`,
        "Blue Ball Vel": `${balls[1].v.toFixed(2)} m/s`,
        "Total Momentum": `${totalP.toFixed(2)} kg·m/s`,
        "Total Kinetic Energy": `${ke.toFixed(2)} J`,
        "Status": isRunning ? "Simulating" : "Paused"
      }
    });
  }, [balls, elasticity, isRunning, onContextUpdate]);

  const animate = useCallback(() => {
    if (!isRunning) return;

    setBalls(prev => {
      const b1 = { ...prev[0] };
      const b2 = { ...prev[1] };
      
      // Move
      b1.x += b1.v;
      b2.x += b2.v;

      // Wall Collisions
      if (b1.x - b1.r <= 0) { b1.x = b1.r; b1.v *= -1; }
      if (b2.x + b2.r >= 800) { b2.x = 800 - b2.r; b2.v *= -1; }

      // Ball Collision Detection
      const dist = b2.x - b1.x;
      const minDist = b1.r + b2.r;

      if (dist <= minDist) {
        // Overlap correction
        const overlap = minDist - dist;
        const movePerMass = overlap / (b1.m + b2.m);
        b1.x -= movePerMass * b2.m;
        b2.x += movePerMass * b1.m;

        // 1D Collision Physics
        // u1, u2 initial velocities
        // v1, v2 final velocities
        // v1 = (CR * m2 * (u2 - u1) + m1*u1 + m2*u2) / (m1 + m2)
        const u1 = b1.v;
        const u2 = b2.v;
        const m1 = b1.m;
        const m2 = b2.m;
        const cr = elasticity;

        b1.v = (cr * m2 * (u2 - u1) + m1 * u1 + m2 * u2) / (m1 + m2);
        b2.v = (cr * m1 * (u1 - u2) + m1 * u1 + m2 * u2) / (m1 + m2);
      }

      return [b1, b2];
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, elasticity]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isRunning, animate]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Track
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, GROUND_Y, canvas.width, 100);
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Balls
    balls.forEach(b => {
      ctx.beginPath();
      ctx.arc(b.x, GROUND_Y - b.r, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Reflection shine
      ctx.beginPath();
      ctx.arc(b.x - b.r * 0.3, GROUND_Y - b.r - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.fill();

      // Velocity Vector
      ctx.beginPath();
      const vecLen = b.v * 10;
      ctx.moveTo(b.x, GROUND_Y - b.r);
      ctx.lineTo(b.x + vecLen, GROUND_Y - b.r);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Arrowhead
      if (Math.abs(vecLen) > 2) {
        const angle = vecLen > 0 ? 0 : Math.PI;
        const tx = b.x + vecLen;
        const ty = GROUND_Y - b.r;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(tx - 5 * Math.cos(angle - Math.PI/6), ty - 5 * Math.sin(angle - Math.PI/6));
        ctx.lineTo(tx - 5 * Math.cos(angle + Math.PI/6), ty - 5 * Math.sin(angle + Math.PI/6));
        ctx.fillStyle = '#1e293b';
        ctx.fill();
      }

      // Label
      ctx.fillStyle = '#1e293b';
      ctx.font = '14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`${b.m}kg`, b.x, GROUND_Y + 20);
      ctx.fillText(`${b.v.toFixed(1)}m/s`, b.x, GROUND_Y + 40);
    });

  }, [balls]);

  const handleReset = () => {
    setIsRunning(false);
    setBalls([
      { id: 1, x: 200, v: 5, m: 2, r: 30, color: '#ef4444' },
      { id: 2, x: 600, v: -3, m: 2, r: 30, color: '#3b82f6' }
    ]);
  };

  const updateBall = (index: number, field: keyof Ball, value: number) => {
    setBalls(prev => {
      const next = [...prev];
      // @ts-ignore
      next[index][field] = value;
      // Update radius based on mass visual
      if (field === 'm') {
        next[index].r = 20 + (value * 5);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-white"
        />
         <div className="absolute top-4 left-4 text-gray-500 text-sm">
           Total Momentum: {(balls[0].m * balls[0].v + balls[1].m * balls[1].v).toFixed(2)}
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Parameters</h2>
        
        {/* Ball 1 Controls */}
        <div className="bg-red-50 p-3 rounded-xl border border-red-100">
            <h3 className="font-bold text-red-800 mb-2 text-sm">Red Ball</h3>
            <div className="space-y-2">
                <div>
                    <label className="text-xs font-bold text-gray-600">Mass (kg)</label>
                    <input type="range" min="0.5" max="5" step="0.5" value={balls[0].m} onChange={(e)=>updateBall(0, 'm', Number(e.target.value))} className="w-full h-1 bg-red-200 rounded accent-red-600"/>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-600">Velocity (m/s)</label>
                    <input type="range" min="-10" max="10" step="1" value={balls[0].v} onChange={(e)=>updateBall(0, 'v', Number(e.target.value))} className="w-full h-1 bg-red-200 rounded accent-red-600"/>
                </div>
            </div>
        </div>

        {/* Ball 2 Controls */}
         <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-2 text-sm">Blue Ball</h3>
            <div className="space-y-2">
                <div>
                    <label className="text-xs font-bold text-gray-600">Mass (kg)</label>
                    <input type="range" min="0.5" max="5" step="0.5" value={balls[1].m} onChange={(e)=>updateBall(1, 'm', Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded accent-blue-600"/>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-600">Velocity (m/s)</label>
                    <input type="range" min="-10" max="10" step="1" value={balls[1].v} onChange={(e)=>updateBall(1, 'v', Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded accent-blue-600"/>
                </div>
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Elasticity: {(elasticity * 100).toFixed(0)}%</label>
            <input 
                type="range" min="0" max="1" step="0.05" value={elasticity} 
                onChange={(e) => setElasticity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Inelastic (Sticky)</span>
                <span>Elastic (Bouncy)</span>
            </div>
        </div>

        <div className="flex gap-3 mt-auto pt-4 border-t">
            <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition flex justify-center items-center gap-2 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button 
            onClick={handleReset}
            className="w-12 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 flex justify-center items-center border border-gray-300"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CollisionLab;
