import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface BalancingActProps {
  onContextUpdate: (context: SimContextData) => void;
}

const BalancingAct: React.FC<BalancingActProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  // Left Side Object
  const [m1, setM1] = useState(10); // kg
  const [d1, setD1] = useState(2); // meters from fulcrum

  // Right Side Object
  const [m2, setM2] = useState(5); // kg
  const [d2, setD2] = useState(4); // meters from fulcrum

  const [supportsRemoved, setSupportsRemoved] = useState(false);
  
  // Physics State
  const [beamAngle, setBeamAngle] = useState(0); // radians
  const [angularVelocity, setAngularVelocity] = useState(0);

  const SCALE = 60; // pixels per meter
  const FULCRUM_X = 400;
  const FULCRUM_Y = 350;
  const MAX_ANGLE = 0.35; // ~20 degrees, hits ground

  useEffect(() => {
    const torque1 = m1 * 9.8 * d1;
    const torque2 = m2 * 9.8 * d2;
    const netTorque = torque1 - torque2; // Counter-Clockwise is positive here for simplicity math
    
    onContextUpdate({
      name: "Balancing Act (Torque Lab)",
      description: "Experiment with torque balance. Torque = Force x Distance. Balance the beam by adjusting masses and distances.",
      parameters: {
        "Left Mass": `${m1} kg`,
        "Left Distance": `${d1} m`,
        "Right Mass": `${m2} kg`,
        "Right Distance": `${d2} m`,
        "Left Torque": `${torque1.toFixed(1)} Nm`,
        "Right Torque": `${torque2.toFixed(1)} Nm`,
        "Net Torque": `${netTorque.toFixed(1)} Nm`,
        "State": supportsRemoved ? (Math.abs(beamAngle) >= MAX_ANGLE ? "Crashed" : "Balancing") : "Supported"
      }
    });
  }, [m1, m2, d1, d2, beamAngle, supportsRemoved, onContextUpdate]);

  const animate = useCallback(() => {
    if (!supportsRemoved) {
        // Reset slowly if supports return
        if (Math.abs(beamAngle) > 0.01) {
             setBeamAngle(prev => prev * 0.9);
             setAngularVelocity(0);
             requestRef.current = requestAnimationFrame(animate);
        } else {
             setBeamAngle(0);
        }
        return;
    }

    // Physics
    // Torque = (m1 * g * d1 * cos(theta)) - (m2 * g * d2 * cos(theta))
    // Moment of Inertia I approx sum(m*r^2)
    const g = 9.8;
    const netTorque = (m1 * g * d1) - (m2 * g * d2); // Simplified, assuming small angles cos(theta)~=1
    
    // Approximate Moment of Inertia for point masses + beam
    const I = (m1 * d1 * d1) + (m2 * d2 * d2) + 10; // +10 for beam inertia
    
    const alpha = netTorque / I;
    const dt = 0.02; // slower time step for better feel
    
    setAngularVelocity(w => w + alpha * dt);
    setBeamAngle(theta => {
        let newTheta = theta - (angularVelocity * dt); // direction flip due to screen coords
        
        // Ground Collision
        if (newTheta > MAX_ANGLE) {
            newTheta = MAX_ANGLE;
            setAngularVelocity(0); // inelastic collision
        } else if (newTheta < -MAX_ANGLE) {
            newTheta = -MAX_ANGLE;
            setAngularVelocity(0);
        }
        return newTheta;
    });

    requestRef.current = requestAnimationFrame(animate);
  }, [supportsRemoved, m1, m2, d1, d2, angularVelocity, beamAngle]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw Ground
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, FULCRUM_Y + 60, canvas.width, 10);

    // Draw Fulcrum Triangle
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(FULCRUM_X, FULCRUM_Y);
    ctx.lineTo(FULCRUM_X - 30, FULCRUM_Y + 60);
    ctx.lineTo(FULCRUM_X + 30, FULCRUM_Y + 60);
    ctx.fill();

    // Save context for rotating beam
    ctx.save();
    ctx.translate(FULCRUM_X, FULCRUM_Y);
    ctx.rotate(beamAngle);

    // Draw Beam
    const beamLen = 350; // half length pixels
    ctx.fillStyle = '#f59e0b'; // Wood color
    ctx.fillRect(-beamLen, -10, beamLen * 2, 20);
    ctx.strokeStyle = '#d97706';
    ctx.strokeRect(-beamLen, -10, beamLen * 2, 20);

    // Draw Marks
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    for(let i=1; i<=5; i++) {
        ctx.fillRect(-i * SCALE, -10, 2, 20);
        ctx.fillRect(i * SCALE, -10, 2, 20);
    }

    // Draw Mass 1 (Left)
    const x1 = -d1 * SCALE;
    const s1 = 30 + (m1 * 2); // size based on mass
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(x1 - s1/2, -10 - s1, s1, s1);
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${m1}kg`, x1 - 10, -10 - s1/2 + 4);

    // Draw Mass 2 (Right)
    const x2 = d2 * SCALE;
    const s2 = 30 + (m2 * 2);
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(x2 - s2/2, -10 - s2, s2, s2);
    ctx.fillStyle = 'white';
    ctx.fillText(`${m2}kg`, x2 - 10, -10 - s2/2 + 4);

    ctx.restore();

    // Draw Supports if present
    if (!supportsRemoved) {
        ctx.fillStyle = 'rgba(100, 116, 139, 0.5)';
        // Left support
        ctx.fillRect(FULCRUM_X - 300, FULCRUM_Y + 10, 20, 50);
        // Right support
        ctx.fillRect(FULCRUM_X + 280, FULCRUM_Y + 10, 20, 50);
    }

  }, [beamAngle, m1, m2, d1, d2, supportsRemoved]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-sky-50"
        />
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow text-xs">
            Torque = Force × Distance
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Experiment Controls</h2>
        
        <div className="space-y-6">
           {/* Left Side Control */}
           <div className="bg-red-50 p-3 rounded-xl border border-red-100">
             <h3 className="font-bold text-red-800 mb-2">Left Object</h3>
             <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-gray-600">Mass: {m1}kg</label>
                    <input type="range" min="1" max="20" value={m1} onChange={(e)=>setM1(Number(e.target.value))} className="w-full h-1 bg-red-200 rounded accent-red-600"/>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-600">Position: {d1}m</label>
                    <input type="range" min="0.5" max="5" step="0.5" value={d1} onChange={(e)=>setD1(Number(e.target.value))} className="w-full h-1 bg-red-200 rounded accent-red-600"/>
                </div>
             </div>
           </div>

           {/* Right Side Control */}
           <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
             <h3 className="font-bold text-blue-800 mb-2">Right Object</h3>
             <div className="space-y-3">
                <div>
                    <label className="text-xs font-bold text-gray-600">Mass: {m2}kg</label>
                    <input type="range" min="1" max="20" value={m2} onChange={(e)=>setM2(Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded accent-blue-600"/>
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-600">Position: {d2}m</label>
                    <input type="range" min="0.5" max="5" step="0.5" value={d2} onChange={(e)=>setD2(Number(e.target.value))} className="w-full h-1 bg-blue-200 rounded accent-blue-600"/>
                </div>
             </div>
           </div>

           <button 
            onClick={() => setSupportsRemoved(!supportsRemoved)}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-md transition transform hover:scale-[1.02] ${supportsRemoved ? 'bg-gray-600' : 'bg-brand-600'}`}
           >
             {supportsRemoved ? 'Reset Supports' : 'Remove Supports'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default BalancingAct;