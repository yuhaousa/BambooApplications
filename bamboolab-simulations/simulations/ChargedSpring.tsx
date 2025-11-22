
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SimContextData } from '../types';

interface ChargedSpringProps {
  onContextUpdate: (context: SimContextData) => void;
}

const ChargedSpring: React.FC<ChargedSpringProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);

  // Parameters
  const [mass, setMass] = useState(5); // kg
  const [k, setK] = useState(20); // N/m (Spring Constant)
  const [charge, setCharge] = useState(2); // Coulombs (micro/scaled)
  const [eField, setEField] = useState(0); // N/C (Electric Field Strength)
  
  // State
  const [y, setY] = useState(0); // Displacement from natural length
  const [v, setV] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const G = 9.8;
  
  // Forces
  // F_gravity = m * g (down)
  // F_spring = -k * y (up if y>0)
  // F_electric = q * E (down if q, E > 0)
  // Net = mg + qE - ky
  const electricForce = charge * eField;
  const gravityForce = mass * G;
  const netForceAtRest = gravityForce + electricForce;
  const equilibriumY = netForceAtRest / k;

  useEffect(() => {
    onContextUpdate({
      name: "Charged Spring (Integrated Lab)",
      description: "A charged mass on a spring inside an electric field. Combines Hooke's Law with Electrostatics.",
      parameters: {
        "Mass": `${mass} kg`,
        "Spring Constant (k)": `${k} N/m`,
        "Charge (q)": `${charge} C`,
        "Electric Field (E)": `${eField} N/C`,
        "Electric Force (qE)": `${electricForce.toFixed(1)} N`,
        "New Equilibrium": `${equilibriumY.toFixed(2)} m`
      }
    });
  }, [mass, k, charge, eField, electricForce, equilibriumY, onContextUpdate]);

  const animate = useCallback(() => {
    if (isDragging) return;

    // Physics Update
    // a = F_net / m
    const damping = 0.2 * v;
    const fSpring = -k * y;
    const fNet = gravityForce + electricForce + fSpring - damping;
    const acc = fNet / mass;
    
    const dt = 0.05;
    setV(prev => prev + acc * dt);
    setY(prev => prev + v * dt);

    requestRef.current = requestAnimationFrame(animate);
  }, [isDragging, mass, k, gravityForce, electricForce, v, y]);

  useEffect(() => {
      requestRef.current = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Dragging
  const handleMouseDown = () => { setIsDragging(true); setV(0); };
  const handleMouseUp = () => setIsDragging(false);
  const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      // simple mapping, assume y=0 is at screen Y=150
      const rect = canvas.getBoundingClientRect();
      const my = e.clientY - rect.top;
      const newY = (my - 150) / 10; // Scale 10px = 1m
      setY(newY);
  };

  // Draw
  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0,0,w,h);

      // Draw Capacitor Plates
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(100, 20, 200, 10); // Top Plate
      ctx.fillRect(100, 450, 200, 10); // Bottom Plate
      
      // Voltage indicators
      if (eField !== 0) {
          const topColor = eField > 0 ? '#ef4444' : '#3b82f6';
          const botColor = eField > 0 ? '#3b82f6' : '#ef4444';
          ctx.fillStyle = topColor; ctx.fillRect(100, 20, 200, 10);
          ctx.fillStyle = botColor; ctx.fillRect(100, 450, 200, 10);
          
          // Field Lines
          ctx.strokeStyle = 'rgba(0,0,0,0.1)';
          ctx.setLineDash([5,5]);
          for(let i=120; i<300; i+=20) {
              ctx.beginPath(); ctx.moveTo(i, 30); ctx.lineTo(i, 450); ctx.stroke();
          }
          ctx.setLineDash([]);
      }

      const originY = 150;
      const scale = 10;
      const currentYPx = originY + y * scale;

      // Draw Spring
      ctx.beginPath();
      ctx.moveTo(200, 30);
      const coils = 15;
      const springLen = currentYPx - 30 - 20; // -20 for mass radius
      const dy = springLen / coils;
      for(let i=0; i<coils; i++) {
          ctx.lineTo(200 + (i%2===0?10:-10), 30 + i*dy);
      }
      ctx.lineTo(200, currentYPx - 20);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Mass
      ctx.beginPath();
      ctx.arc(200, currentYPx, 20, 0, Math.PI*2);
      ctx.fillStyle = charge > 0 ? '#ef4444' : charge < 0 ? '#3b82f6' : '#94a3b8';
      ctx.fill();
      ctx.stroke();
      
      // Charge Symbol
      ctx.fillStyle = 'white';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(charge > 0 ? '+' : charge < 0 ? '-' : '', 200, currentYPx);

      // Forces Vectors
      // Gravity
      ctx.beginPath(); ctx.moveTo(200, currentYPx); ctx.lineTo(200, currentYPx + mass * 2);
      ctx.strokeStyle = '#10b981'; ctx.lineWidth=3; ctx.stroke();
      
      // Electric
      if (electricForce !== 0) {
          ctx.beginPath(); ctx.moveTo(200, currentYPx); 
          ctx.lineTo(200, currentYPx + electricForce * 2);
          ctx.strokeStyle = '#f59e0b'; ctx.stroke();
      }

  }, [y, mass, charge, eField, electricForce]);


  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
            ref={canvasRef} width={800} height={500} 
            onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
            className="w-full h-full object-contain bg-white cursor-ns-resize"
        />
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
         <h2 className="font-bold text-lg">Forces</h2>
         
         <div>
            <label className="block text-sm font-bold">Electric Field (N/C)</label>
            <input type="range" min="-10" max="10" value={eField} onChange={e=>setEField(Number(e.target.value))} className="w-full"/>
            <div className="flex justify-between text-xs"><span>Up (-)</span><span>Off</span><span>Down (+)</span></div>
         </div>

         <div>
            <label className="block text-sm font-bold">Charge (q)</label>
            <input type="range" min="-5" max="5" value={charge} onChange={e=>setCharge(Number(e.target.value))} className="w-full"/>
         </div>

         <div>
            <label className="block text-sm font-bold">Spring Constant (k)</label>
            <input type="range" min="5" max="50" value={k} onChange={e=>setK(Number(e.target.value))} className="w-full"/>
         </div>
         
         <div className="bg-yellow-50 p-2 rounded text-xs border border-yellow-200">
             The Equilibrium position changes based on the net force of Gravity and Electricity.
         </div>
      </div>
    </div>
  );
};

export default ChargedSpring;