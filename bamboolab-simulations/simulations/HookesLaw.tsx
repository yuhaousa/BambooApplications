import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface HookesLawProps {
  onContextUpdate: (context: SimContextData) => void;
}

const HookesLaw: React.FC<HookesLawProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [springConstant, setSpringConstant] = useState(50); // N/m
  const [mass, setMass] = useState(5); // kg
  const [damping, setDamping] = useState(0.5);
  const [appliedForce, setAppliedForce] = useState(0); // N (Initial displacement force)
  
  // Physics State
  const [position, setPosition] = useState(0); // displacement from equilibrium (m)
  const [velocity, setVelocity] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const SCALE = 50; // pixels per meter
  const WALL_X = 100;
  const GROUND_Y = 300;
  const EQ_X = 400; // Equilibrium position on canvas

  // AI Context
  useEffect(() => {
    onContextUpdate({
      name: "Hooke's Law & Harmonic Motion",
      description: "Explore the relationship between force, spring constant, and displacement (F = -kx). Observe damped harmonic motion.",
      parameters: {
        "Spring Constant (k)": `${springConstant} N/m`,
        "Mass (m)": `${mass} kg`,
        "Damping": damping.toFixed(2),
        "Displacement (x)": `${(position).toFixed(2)} m`,
        "Spring Force": `${(-springConstant * position).toFixed(1)} N`,
        "Status": isDragging ? "Dragging" : Math.abs(velocity) > 0.1 ? "Oscillating" : "Equilibrium"
      }
    });
  }, [springConstant, mass, damping, position, velocity, isDragging, onContextUpdate]);

  const animate = useCallback(() => {
    if (isDragging) return;

    // F_net = F_spring + F_damping
    // F_spring = -kx
    // F_damping = -cv
    // a = F_net / m
    
    const fSpring = -springConstant * position;
    const fDamping = -damping * velocity * 5; // multiplier for visual effect
    const acceleration = (fSpring + fDamping) / mass;
    
    const dt = 0.016;
    
    setVelocity(v => v + acceleration * dt);
    setPosition(p => p + velocity * dt);

    requestRef.current = requestAnimationFrame(animate);
  }, [isDragging, springConstant, position, damping, velocity, mass]);

  useEffect(() => {
    if (!isDragging) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging, animate]);

  // Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Floor
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, GROUND_Y, canvas.width, 20);
    ctx.beginPath();
    ctx.strokeStyle = '#cbd5e1';
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Draw Wall
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(WALL_X - 20, GROUND_Y - 100, 20, 100);
    
    // Draw Equilibrium Line
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = '#22c55e';
    ctx.moveTo(EQ_X, GROUND_Y - 120);
    ctx.lineTo(EQ_X, GROUND_Y + 20);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#22c55e';
    ctx.fillText('Equilibrium', EQ_X - 30, GROUND_Y - 130);

    // Current Position of Block Center
    const blockX = EQ_X + (position * SCALE);
    
    // Draw Spring
    ctx.beginPath();
    ctx.moveTo(WALL_X, GROUND_Y - 40);
    const coils = 12;
    const springLength = blockX - WALL_X - 40; // -40 for half block width
    const coilWidth = springLength / coils;
    
    for (let i = 0; i < coils; i++) {
        const x = WALL_X + (i * coilWidth);
        const y = GROUND_Y - 40;
        // Zigzag pattern
        ctx.lineTo(x + coilWidth/4, y - 15);
        ctx.lineTo(x + (3*coilWidth)/4, y + 15);
        ctx.lineTo(x + coilWidth, y);
    }
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Block
    const blockSize = 80;
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(blockX - blockSize/2, GROUND_Y - blockSize, blockSize, blockSize);
    ctx.strokeStyle = '#1e40af';
    ctx.strokeRect(blockX - blockSize/2, GROUND_Y - blockSize, blockSize, blockSize);
    
    ctx.fillStyle = 'white';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`${mass}kg`, blockX - 15, GROUND_Y - 45);

    // Draw Vectors
    // Force Vector
    if (Math.abs(position) > 0.1) {
        const forceMag = -springConstant * position;
        const vecStart = blockX;
        const vecEnd = blockX + (forceMag * 2); // Scale for visibility
        
        ctx.beginPath();
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 4;
        ctx.moveTo(vecStart, GROUND_Y - 110);
        ctx.lineTo(vecEnd, GROUND_Y - 110);
        ctx.stroke();
        
        // Arrowhead
        const angle = Math.atan2(0, vecEnd - vecStart);
        ctx.beginPath();
        ctx.moveTo(vecEnd, GROUND_Y - 110);
        ctx.lineTo(vecEnd - 10 * Math.cos(angle - Math.PI / 6), GROUND_Y - 110 - 10 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(vecEnd - 10 * Math.cos(angle + Math.PI / 6), GROUND_Y - 110 - 10 * Math.sin(angle + Math.PI / 6));
        ctx.fillStyle = '#ef4444';
        ctx.fill();
        
        ctx.fillText("F spring", vecEnd + (forceMag > 0 ? 10 : -60), GROUND_Y - 115);
    }

  }, [position, springConstant, mass]);

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setVelocity(0);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Convert mouse X to displacement
    // Mouse is at block center. EQ_X is 0 displacement.
    const newPos = (mouseX - EQ_X) / SCALE;
    // Clamp to reasonable bounds
    if (newPos > -4 && newPos < 4) {
        setPosition(newPos);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative group">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
          className={`w-full h-full object-contain bg-white ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        />
        <div className="absolute bottom-4 left-4 text-gray-400 text-sm pointer-events-none">
            Drag the block to displace the spring
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Controls</h2>
        
        <div className="space-y-6">
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Spring Constant (k): {springConstant} N/m</label>
            <input 
              type="range" min="10" max="200" step="5" value={springConstant} 
              onChange={(e) => setSpringConstant(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Loose</span>
                <span>Stiff</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mass (m): {mass} kg</label>
            <input 
              type="range" min="1" max="20" step="1" value={mass} 
              onChange={(e) => setMass(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Friction / Damping</label>
            <input 
              type="range" min="0" max="2" step="0.1" value={damping} 
              onChange={(e) => setDamping(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
             <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>None</span>
                <span>High</span>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
             <p className="font-semibold">Physics Note:</p>
             <p>Period T = 2π√(m/k)</p>
             <p className="mt-2">Current Period: {(2 * Math.PI * Math.sqrt(mass/springConstant)).toFixed(2)}s</p>
          </div>

          <button 
            onClick={() => {setPosition(0); setVelocity(0);}}
            className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition flex items-center justify-center gap-2"
          >
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             Stop & Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default HookesLaw;