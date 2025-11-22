import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface ProjectileMotionProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface PhysicsState {
  x: number;
  y: number;
  vx: number;
  vy: number;
  time: number;
  path: { x: number; y: number }[];
  isFlying: boolean;
}

const ProjectileMotion: React.FC<ProjectileMotionProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  // Parameters
  const [velocity, setVelocity] = useState(15); // m/s
  const [angle, setAngle] = useState(45); // degrees
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [height, setHeight] = useState(0); // m
  
  // Physics Engine State
  const [simState, setSimState] = useState<PhysicsState>({
    x: 0,
    y: height,
    vx: 0,
    vy: 0,
    time: 0,
    path: [],
    isFlying: false
  });

  const SCALE = 10; // 10 pixels = 1 meter
  const GROUND_Y = 400; // Y position of ground on canvas

  // Update AI Context when parameters change
  useEffect(() => {
    onContextUpdate({
      name: "Projectile Motion Lab",
      description: "Simulates projectile motion under gravity. Users can adjust initial velocity, launch angle, gravity, and launch height.",
      parameters: {
        "Initial Velocity": `${velocity} m/s`,
        "Launch Angle": `${angle} degrees`,
        "Gravity": `${gravity} m/s²`,
        "Launch Height": `${height} m`,
        "Current Status": simState.isFlying ? "In Flight" : "Stopped",
        "Last Distance": simState.path.length > 0 ? `${(simState.path[simState.path.length - 1].x / SCALE).toFixed(2)} m` : "N/A"
      }
    });
  }, [velocity, angle, gravity, height, simState.isFlying, simState.path, onContextUpdate]);

  const fire = () => {
    const rad = (angle * Math.PI) / 180;
    setSimState({
      x: 0,
      y: height,
      vx: velocity * Math.cos(rad),
      vy: velocity * Math.sin(rad),
      time: 0,
      path: [{ x: 0, y: height }],
      isFlying: true
    });
  };

  const reset = () => {
    setSimState({
      x: 0,
      y: height,
      vx: 0,
      vy: 0,
      time: 0,
      path: [],
      isFlying: false
    });
    // Cancel animation loop
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const animate = useCallback(() => {
    if (!simState.isFlying) return;

    setSimState(prev => {
      const dt = 0.05; // Time step (simulated seconds per frame)
      const newTime = prev.time + dt;
      
      // Physics Update
      const newX = prev.vx * newTime;
      const newY = height + (prev.vy * newTime) - (0.5 * gravity * newTime * newTime);

      if (newY < 0) {
        // Hit ground
        return {
          ...prev,
          x: newX,
          y: 0,
          path: [...prev.path, { x: newX, y: 0 }],
          isFlying: false
        };
      }

      return {
        ...prev,
        time: newTime,
        x: newX,
        y: newY,
        path: [...prev.path, { x: newX, y: newY }]
      };
    });

    if (simState.isFlying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [simState.isFlying, gravity, height, velocity, angle]); // Dependencies for closure capture

  // Trigger animation loop
  useEffect(() => {
    if (simState.isFlying) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [simState.isFlying, animate]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Sky
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, '#e0f2fe');
    gradient.addColorStop(1, '#bae6fd');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, GROUND_Y, canvas.width, canvas.height - GROUND_Y);

    // Transform coordinates (0,0 at bottom-left of logic area, effectively)
    // Canvas origin is top-left.
    // Simulation (0,0) is at (50, GROUND_Y). +y is Up.
    const originX = 50;
    
    const toCanvasX = (simX: number) => originX + (simX * SCALE);
    const toCanvasY = (simY: number) => GROUND_Y - (simY * SCALE);

    // Draw Cannon
    ctx.save();
    ctx.translate(originX, toCanvasY(height));
    ctx.rotate(-(angle * Math.PI) / 180);
    ctx.fillStyle = '#475569';
    ctx.fillRect(0, -10, 60, 20); // Cannon barrel
    ctx.restore();

    // Draw Pedestal if height > 0
    if (height > 0) {
        ctx.fillStyle = '#64748b';
        ctx.fillRect(originX - 10, toCanvasY(height), 20, height * SCALE);
    }

    // Draw Path
    if (simState.path.length > 0) {
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.moveTo(toCanvasX(simState.path[0].x), toCanvasY(simState.path[0].y));
      for (let i = 1; i < simState.path.length; i++) {
        ctx.lineTo(toCanvasX(simState.path[i].x), toCanvasY(simState.path[i].y));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Projectile
    if (simState.isFlying || simState.path.length > 0) {
      const currentX = simState.isFlying ? simState.x : (simState.path[simState.path.length-1]?.x || 0);
      const currentY = simState.isFlying ? simState.y : (simState.path[simState.path.length-1]?.y || 0);
      
      ctx.beginPath();
      ctx.fillStyle = '#1e293b';
      ctx.arc(toCanvasX(currentX), toCanvasY(currentY), 8, 0, Math.PI * 2);
      ctx.fill();
    }

  }, [simState, angle, height]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      {/* Simulation Canvas */}
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-gray-100"
        />
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow-sm backdrop-blur-sm text-sm text-gray-700">
            <div>Range: <span className="font-mono font-bold text-brand-600">{simState.x.toFixed(1)}m</span></div>
            <div>Height: <span className="font-mono font-bold text-brand-600">{simState.y.toFixed(1)}m</span></div>
            <div>Time: <span className="font-mono font-bold text-brand-600">{simState.time.toFixed(1)}s</span></div>
        </div>
      </div>

      {/* Controls */}
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6 overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Parameters</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Initial Speed: {velocity} m/s</label>
            <input 
              type="range" min="5" max="30" step="1" value={velocity} 
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Launch Angle: {angle}°</label>
            <input 
              type="range" min="0" max="90" step="1" value={angle} 
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gravity: {gravity} m/s²</label>
            <select 
              value={gravity} 
              onChange={(e) => setGravity(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="9.8">Earth (9.8)</option>
              <option value="1.6">Moon (1.6)</option>
              <option value="3.7">Mars (3.7)</option>
              <option value="24.8">Jupiter (24.8)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Launch Height: {height} m</label>
            <input 
              type="range" min="0" max="20" step="1" value={height} 
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-auto pt-4 border-t">
          <button 
            onClick={fire}
            disabled={simState.isFlying}
            className="flex-1 bg-brand-600 text-white py-3 rounded-xl font-semibold hover:bg-brand-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            Launch
          </button>
          <button 
            onClick={reset}
            className="w-12 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 flex justify-center items-center border border-gray-300"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectileMotion;
