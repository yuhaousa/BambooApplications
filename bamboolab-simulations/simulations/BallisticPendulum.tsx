
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface BallisticPendulumProps {
  onContextUpdate: (context: SimContextData) => void;
}

const BallisticPendulum: React.FC<BallisticPendulumProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [bulletMass, setBulletMass] = useState(0.05); // kg
  const [blockMass, setBlockMass] = useState(1.0); // kg
  const [bulletVelocity, setBulletVelocity] = useState(200); // m/s
  
  // State
  const [hasFired, setHasFired] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  
  // Animation Physics State
  const [bulletX, setBulletX] = useState(50);
  const [theta, setTheta] = useState(0); // Angle of pendulum
  const [omega, setOmega] = useState(0); // Angular velocity
  const [maxHeight, setMaxHeight] = useState(0);

  const LENGTH = 2.5; // meters (String length)
  const G = 9.8;
  
  // Derived
  const initialMomentum = bulletMass * bulletVelocity;
  const combinedMass = bulletMass + blockMass;
  const finalVelocity = initialMomentum / combinedMass;
  const maxTheoreticalHeight = (finalVelocity * finalVelocity) / (2 * G);

  useEffect(() => {
    onContextUpdate({
      name: "Ballistic Pendulum (Integrated Lab)",
      description: "Combine Momentum and Energy principles. A bullet strikes a block, transferring momentum, then the system swings, converting Kinetic Energy to Potential Energy.",
      parameters: {
        "Bullet Mass": `${bulletMass} kg`,
        "Block Mass": `${blockMass} kg`,
        "Bullet Velocity": `${bulletVelocity} m/s`,
        "Collision Velocity": isEmbedded ? `${finalVelocity.toFixed(2)} m/s` : "N/A",
        "Max Height (h)": `${maxHeight.toFixed(3)} m`,
        "Principle 1": "Momentum (Inelastic Collision)",
        "Principle 2": "Conservation of Energy"
      }
    });
  }, [bulletMass, blockMass, bulletVelocity, maxHeight, isEmbedded, finalVelocity, onContextUpdate]);

  const fire = () => {
    setHasFired(true);
    setIsEmbedded(false);
    setBulletX(50);
    setTheta(0);
    setOmega(0);
    setMaxHeight(0);
  };

  const reset = () => {
    setHasFired(false);
    setIsEmbedded(false);
    setBulletX(50);
    setTheta(0);
    setOmega(0);
    setMaxHeight(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const animate = useCallback(() => {
    if (!hasFired) return;

    // Constants for visuals
    const PIVOT_X = 400;
    const BLOCK_START_X = PIVOT_X; // Hanging straight down initially
    
    // Phase 1: Bullet Flight
    if (!isEmbedded) {
        const dt = 0.016;
        const speedPx = bulletVelocity * 5; // Visual scale
        const nextX = bulletX + speedPx * dt;
        
        // Collision Check (Block is roughly at x=400)
        if (nextX >= 380) { // Hit the block visual edge
            setIsEmbedded(true);
            setBulletX(380);
            // Set initial angular velocity for pendulum
            // v = omega * r => omega = v / L
            const initialOmega = finalVelocity / LENGTH;
            setOmega(initialOmega);
        } else {
            setBulletX(nextX);
        }
    } 
    // Phase 2: Pendulum Swing
    else {
        const dt = 0.016; // time step
        // Angular acceleration alpha = -(g/L) sin(theta)
        const alpha = -(G / LENGTH) * Math.sin(theta);
        
        setOmega(prev => prev + alpha * dt);
        setTheta(prev => {
            const next = prev + omega * dt;
            // Calculate Height h = L(1 - cos(theta))
            const h = LENGTH * (1 - Math.cos(next));
            if (h > maxHeight) setMaxHeight(h);
            return next;
        });
        
        // Damping/Stopping (optional, for now let it swing or stop if slow)
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [hasFired, isEmbedded, bulletX, bulletVelocity, finalVelocity, theta, omega, maxHeight]);

  useEffect(() => {
    if (hasFired) {
        requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [hasFired, animate]);

  // Drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const SCALE = 100; // px per meter
    const PIVOT_X = 400;
    const PIVOT_Y = 50;
    const STRING_LEN_PX = LENGTH * SCALE;

    // Draw Pivot
    ctx.fillStyle = '#334155';
    ctx.fillRect(PIVOT_X - 40, PIVOT_Y - 10, 80, 10);

    // Calculate Block Position based on Theta
    const blockX = PIVOT_X + Math.sin(theta) * STRING_LEN_PX;
    const blockY = PIVOT_Y + Math.cos(theta) * STRING_LEN_PX;

    // Draw String
    ctx.beginPath();
    ctx.moveTo(PIVOT_X, PIVOT_Y);
    ctx.lineTo(blockX, blockY);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw Block
    const blockSize = 60;
    ctx.save();
    ctx.translate(blockX, blockY);
    ctx.rotate(-theta); // Keep block aligned with string
    ctx.fillStyle = '#f59e0b'; // Wood
    ctx.fillRect(-blockSize/2, -blockSize/2, blockSize, blockSize);
    ctx.strokeStyle = '#b45309';
    ctx.strokeRect(-blockSize/2, -blockSize/2, blockSize, blockSize);
    ctx.fillStyle = 'white';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${blockMass}kg`, -15, 5);
    ctx.restore();

    // Draw Bullet
    if (!isEmbedded) {
        // Flying bullet
        const bulletY = PIVOT_Y + STRING_LEN_PX; // Aimed at center of block
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(bulletX, bulletY, 10, 4, 0, 0, Math.PI*2);
        ctx.fill();
    } else {
        // Bullet inside block
        ctx.save();
        ctx.translate(blockX, blockY);
        ctx.rotate(-theta);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.ellipse(-10, 0, 10, 4, 0, 0, Math.PI*2); // Embedded slightly left of center
        ctx.fill();
        ctx.restore();
    }
    
    // Draw Height Marker
    if (maxHeight > 0) {
        const maxH_Y = PIVOT_Y + STRING_LEN_PX - (maxHeight * SCALE);
        const base_Y = PIVOT_Y + STRING_LEN_PX;
        
        ctx.beginPath();
        ctx.moveTo(PIVOT_X + 100, maxH_Y);
        ctx.lineTo(PIVOT_X + 150, maxH_Y);
        ctx.strokeStyle = '#ef4444';
        ctx.setLineDash([5,5]);
        ctx.stroke();
        
        ctx.moveTo(PIVOT_X + 100, base_Y);
        ctx.lineTo(PIVOT_X + 150, base_Y);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Arrow
        ctx.beginPath();
        ctx.moveTo(PIVOT_X + 125, base_Y);
        ctx.lineTo(PIVOT_X + 125, maxH_Y);
        ctx.stroke();
        
        ctx.fillStyle = '#ef4444';
        ctx.fillText(`h = ${maxHeight.toFixed(3)}m`, PIVOT_X + 160, (maxH_Y + base_Y)/2);
    }

  }, [theta, bulletX, isEmbedded, maxHeight, blockMass]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain bg-white"/>
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded shadow text-xs">
           <div className="font-bold text-brand-600">Integrated Challenge</div>
           <div>1. Momentum (Collision)</div>
           <div>2. Energy (Swing)</div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Experiment Setup</h2>
        
        <div className="space-y-4">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Bullet Mass (kg)</label>
             <input 
               type="range" min="0.01" max="0.2" step="0.01" value={bulletMass} 
               onChange={(e) => setBulletMass(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-800"
             />
             <div className="text-right text-xs">{bulletMass} kg</div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Bullet Velocity (m/s)</label>
             <input 
               type="range" min="50" max="500" step="10" value={bulletVelocity} 
               onChange={(e) => setBulletVelocity(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
             />
             <div className="text-right text-xs">{bulletVelocity} m/s</div>
           </div>
           
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Block Mass (kg)</label>
             <input 
               type="range" min="0.5" max="5" step="0.1" value={blockMass} 
               onChange={(e) => setBlockMass(Number(e.target.value))}
               className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
             />
             <div className="text-right text-xs">{blockMass} kg</div>
           </div>

           <div className="bg-blue-50 p-3 rounded text-xs text-blue-800">
               <strong>Theoretical Max Height:</strong><br/>
               {maxTheoreticalHeight.toFixed(3)} m
           </div>

           <button 
            onClick={hasFired ? reset : fire}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${hasFired ? 'bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
           >
               {hasFired ? 'Reset' : 'Fire Bullet'}
           </button>
        </div>
      </div>
    </div>
  );
};

export default BallisticPendulum;