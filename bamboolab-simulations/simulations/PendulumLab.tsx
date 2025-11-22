import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface PendulumLabProps {
  onContextUpdate: (context: SimContextData) => void;
}

const PendulumLab: React.FC<PendulumLabProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [length, setLength] = useState(1.5); // meters
  const [gravity, setGravity] = useState(9.8); // m/s^2
  const [mass, setMass] = useState(1.0); // kg
  const [friction, setFriction] = useState(0.0); // damping factor
  
  // State
  const [angle, setAngle] = useState(Math.PI / 4); // 45 degrees initial
  const [velocity, setVelocity] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  // Physics constants
  const SCALE = 200; // pixels per meter
  const PIVOT_X = 400;
  const PIVOT_Y = 50;

  // Send context to AI
  useEffect(() => {
    const period = 2 * Math.PI * Math.sqrt(length / gravity);
    onContextUpdate({
      name: "Pendulum Lab",
      description: "Simulates a simple pendulum. Observe the period of oscillation.",
      parameters: {
        "String Length": `${length} m`,
        "Gravity": `${gravity} m/s²`,
        "Mass": `${mass} kg`,
        "Friction/Damping": friction > 0 ? "On" : "Off",
        "Current Angle": `${(angle * 180 / Math.PI).toFixed(1)}°`,
        "Theoretical Period": `${period.toFixed(2)} s`,
        "Status": isRunning ? "Swinging" : "Paused"
      }
    });
  }, [length, gravity, mass, friction, angle, isRunning, onContextUpdate]);

  const animate = useCallback(() => {
    if (!isRunning) return;

    // Simple Harmonic Motion (Euler integration for simplicity, could be improved to RK4)
    // Angular Acceleration alpha = -(g/L) * sin(theta) - damping
    const alpha = -(gravity / length) * Math.sin(angle) - (friction * velocity);
    
    const dt = 0.016; // Approx 60fps
    
    setVelocity(v => v + alpha * dt);
    setAngle(a => a + velocity * dt);

    requestRef.current = requestAnimationFrame(animate);
  }, [isRunning, gravity, length, angle, velocity, friction]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
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

    // Draw Pivot
    ctx.fillStyle = '#334155';
    ctx.fillRect(PIVOT_X - 50, PIVOT_Y - 10, 100, 10);

    // Calculate Bob Position
    const bobX = PIVOT_X + (Math.sin(angle) * length * SCALE);
    const bobY = PIVOT_Y + (Math.cos(angle) * length * SCALE);

    // Draw String
    ctx.beginPath();
    ctx.moveTo(PIVOT_X, PIVOT_Y);
    ctx.lineTo(bobX, bobY);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Bob
    ctx.beginPath();
    ctx.arc(bobX, bobY, 15 * Math.sqrt(mass), 0, Math.PI * 2); // Size depends on mass slightly
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#1d4ed8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Angle Arc
    ctx.beginPath();
    ctx.arc(PIVOT_X, PIVOT_Y, 50, Math.PI/2, Math.PI/2 + angle, angle < 0);
    ctx.strokeStyle = '#94a3b8';
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

  }, [angle, length, mass]);

  const reset = () => {
    setIsRunning(false);
    setAngle(Math.PI / 4);
    setVelocity(0);
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
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Controls</h2>
        
        <div className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Length: {length.toFixed(2)} m</label>
            <input 
              type="range" min="0.5" max="2.5" step="0.1" value={length} 
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mass: {mass} kg</label>
            <input 
              type="range" min="0.1" max="5.0" step="0.1" value={mass} 
              onChange={(e) => setMass(Number(e.target.value))}
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
              <option value="24.8">Jupiter (24.8)</option>
              <option value="0">Zero G (0)</option>
            </select>
          </div>

          <div>
             <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
               <input 
                type="checkbox" 
                checked={friction > 0} 
                onChange={(e) => setFriction(e.target.checked ? 0.5 : 0.0)}
                className="w-4 h-4 text-brand-600 rounded border-gray-300 focus:ring-brand-500"
               />
               <span>Enable Air Resistance</span>
             </label>
          </div>
        </div>

        <div className="flex gap-3 mt-auto pt-4 border-t">
           <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 py-3 rounded-xl font-semibold text-white transition flex justify-center items-center gap-2 ${isRunning ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-600 hover:bg-green-700'}`}
          >
            {isRunning ? (
               <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                Pause
               </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                Start
              </>
            )}
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
}

export default PendulumLab;
