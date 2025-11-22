
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface SolarSystemProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface Body {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  mass: number;
  radius: number;
  color: string;
  trail: {x: number, y: number}[];
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Simulation State
  const [bodies, setBodies] = useState<Body[]>([]);
  const [gConstant, setGConstant] = useState(0.5); // Scaled G
  const [showTrails, setShowTrails] = useState(true);

  const resetToPreset = (type: 'solar' | 'binary' | 'chaos') => {
    const center = { x: 400, y: 250 };
    let newBodies: Body[] = [];

    if (type === 'solar') {
        newBodies = [
            { id: 1, x: center.x, y: center.y, vx: 0, vy: 0, mass: 2000, radius: 25, color: '#fbbf24', trail: [] }, // Sun
            { id: 2, x: center.x + 150, y: center.y, vx: 0, vy: 2.5, mass: 100, radius: 10, color: '#3b82f6', trail: [] }, // Earth-ish
            { id: 3, x: center.x + 250, y: center.y, vx: 0, vy: 1.8, mass: 300, radius: 15, color: '#ef4444', trail: [] }, // Mars-ish
            { id: 4, x: center.x + 60, y: center.y, vx: 0, vy: 4.5, mass: 20, radius: 5, color: '#9ca3af', trail: [] } // Mercury-ish
        ];
    } else if (type === 'binary') {
        newBodies = [
            { id: 1, x: center.x - 100, y: center.y, vx: 0, vy: 1.5, mass: 1000, radius: 20, color: '#fbbf24', trail: [] },
            { id: 2, x: center.x + 100, y: center.y, vx: 0, vy: -1.5, mass: 1000, radius: 20, color: '#f59e0b', trail: [] },
            { id: 3, x: center.x, y: center.y, vx: 2, vy: 0, mass: 50, radius: 8, color: '#3b82f6', trail: [] }
        ];
    } else {
         // Chaos / Random
         for(let i=0; i<8; i++) {
             newBodies.push({
                 id: i,
                 x: Math.random() * 800,
                 y: Math.random() * 500,
                 vx: (Math.random() - 0.5) * 2,
                 vy: (Math.random() - 0.5) * 2,
                 mass: Math.random() * 100 + 50,
                 radius: Math.random() * 10 + 5,
                 color: `hsl(${Math.random() * 360}, 70%, 60%)`,
                 trail: []
             });
         }
    }
    setBodies(newBodies);
  };

  // Initialize
  useEffect(() => {
    resetToPreset('solar');
  }, []);

  // AI Context
  useEffect(() => {
    onContextUpdate({
      name: "Kepler's Laws & Orbital Gravity",
      description: "Simulate gravitational N-body interactions using Newton's Law of Universal Gravitation. Observe Kepler's laws of planetary motion (Orbits, Areas, Periods).",
      parameters: {
        "Bodies Count": bodies.length,
        "Gravitational Constant": gConstant,
        "System Type": "Dynamic N-Body",
        "Simulation Speed": "1x"
      }
    });
  }, [bodies.length, gConstant, onContextUpdate]);

  const animate = useCallback(() => {
    setBodies(prevBodies => {
        // Deep copy for updates
        const nextBodies = prevBodies.map(b => ({...b, trail: [...b.trail]}));
        
        // Physics Steps (simple Euler for demonstration, Verlet is better but verbose)
        for (let i = 0; i < nextBodies.length; i++) {
            let fx = 0;
            let fy = 0;
            for (let j = 0; j < nextBodies.length; j++) {
                if (i === j) continue;
                const b1 = nextBodies[i];
                const b2 = nextBodies[j];
                
                const dx = b2.x - b1.x;
                const dy = b2.y - b1.y;
                const distSq = dx*dx + dy*dy;
                const dist = Math.sqrt(distSq);
                
                if (dist < (b1.radius + b2.radius)) {
                    // Simple collision/merging handling could go here
                    // For now, minimal softening parameter to avoid infinity
                    continue; 
                }

                const force = (gConstant * b1.mass * b2.mass) / distSq;
                fx += force * (dx / dist);
                fy += force * (dy / dist);
            }

            // Update Velocity
            nextBodies[i].vx += fx / nextBodies[i].mass;
            nextBodies[i].vy += fy / nextBodies[i].mass;
        }

        // Update Position
        for (let i = 0; i < nextBodies.length; i++) {
            nextBodies[i].x += nextBodies[i].vx;
            nextBodies[i].y += nextBodies[i].vy;
            
            // Trail Management
            if (showTrails && Math.random() > 0.8) { // optimized trail recording
                nextBodies[i].trail.push({x: nextBodies[i].x, y: nextBodies[i].y});
                if (nextBodies[i].trail.length > 50) nextBodies[i].trail.shift();
            }
        }

        return nextBodies;
    });
    
    requestRef.current = requestAnimationFrame(animate);
  }, [gConstant, showTrails]);

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

    // Deep Space Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = 'white';
    for(let i=0; i<50; i++) {
        const x = (i * 137) % canvas.width;
        const y = (i * 53) % canvas.height;
        ctx.fillRect(x,y, 1, 1);
    }

    bodies.forEach(b => {
        // Draw Trail
        if (showTrails && b.trail.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = b.color;
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.4;
            ctx.moveTo(b.trail[0].x, b.trail[0].y);
            for (let pt of b.trail) ctx.lineTo(pt.x, pt.y);
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }

        // Draw Body
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        
        // Glow effect for "suns"
        if (b.mass > 500) {
            ctx.shadowBlur = 20;
            ctx.shadowColor = b.color;
        } else {
            ctx.shadowBlur = 0;
        }
        
        ctx.fill();
        ctx.shadowBlur = 0;
    });

  }, [bodies, showTrails]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-900">
      <div className="flex-1 bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-800 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain"
        />
        <div className="absolute bottom-4 left-4 text-gray-400 text-xs font-mono">
           Space: Interactive Canvas
        </div>
      </div>

      <div className="w-full lg:w-80 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6 text-white">
        <h2 className="text-xl font-bold border-b border-gray-600 pb-2">Control Center</h2>
        
        <div className="space-y-6">
           <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Presets</label>
              <div className="grid grid-cols-3 gap-2">
                  <button onClick={()=>resetToPreset('solar')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">Solar</button>
                  <button onClick={()=>resetToPreset('binary')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">Binary</button>
                  <button onClick={()=>resetToPreset('chaos')} className="p-2 bg-gray-700 hover:bg-gray-600 rounded text-xs border border-gray-600">Chaos</button>
              </div>
           </div>

           <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Gravity Strength (G)</label>
            <input 
              type="range" min="0.1" max="2.0" step="0.1" value={gConstant} 
              onChange={(e) => setGConstant(Number(e.target.value))}
              className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

           <div>
             <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 cursor-pointer">
               <input 
                type="checkbox" 
                checked={showTrails} 
                onChange={(e) => setShowTrails(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
               />
               <span>Show Orbital Trails</span>
             </label>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg text-xs text-gray-300">
             Click buttons to reset the simulation with new initial conditions.
             Larger masses (Suns) have glowing effects.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarSystem;
