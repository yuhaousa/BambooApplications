
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface RefractionProps {
  onContextUpdate: (context: SimContextData) => void;
}

const Refraction: React.FC<RefractionProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [n1, setN1] = useState(1.0); // Air
  const [n2, setN2] = useState(1.33); // Water
  const [angle, setAngle] = useState(45); // Incidence

  // Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const rad1 = (angle * Math.PI) / 180;
  const sin2 = (n1 * Math.sin(rad1)) / n2;
  const valid = Math.abs(sin2) <= 1;
  const rad2 = valid ? Math.asin(sin2) : 0; // 0 if Total Internal Reflection
  const angle2 = (rad2 * 180) / Math.PI;

  useEffect(() => {
    onContextUpdate({
      name: "Refraction (Snell's Law)",
      description: "Light bending between mediums. n1 sin(θ1) = n2 sin(θ2).",
      parameters: {
        "Index n1 (Top)": n1,
        "Index n2 (Bottom)": n2,
        "Incident Angle": `${angle}°`,
        "Refracted Angle": valid ? `${angle2.toFixed(1)}°` : "Total Internal Reflection",
        "Material 1": n1 === 1 ? "Air" : n1 === 1.33 ? "Water" : "Glass",
        "Material 2": n2 === 1 ? "Air" : n2 === 1.33 ? "Water" : "Glass",
      }
    });
  }, [n1, n2, angle, angle2, valid, onContextUpdate]);

  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      const w = canvas.width;
      const h = canvas.height;
      const cy = h / 2;
      const cx = w / 2;

      ctx.clearRect(0,0,w,h);

      // Medium 1 (Top)
      ctx.fillStyle = n1 === 1 ? '#ffffff' : n1 === 1.33 ? '#e0f2fe' : '#cbd5e1';
      ctx.fillRect(0, 0, w, cy);
      
      // Medium 2 (Bottom)
      ctx.fillStyle = n2 === 1 ? '#ffffff' : n2 === 1.33 ? '#e0f2fe' : '#cbd5e1';
      ctx.fillRect(0, cy, w, cy);

      // Normal Line
      ctx.beginPath();
      ctx.setLineDash([5,5]);
      ctx.strokeStyle = '#94a3b8';
      ctx.moveTo(cx, 0); ctx.lineTo(cx, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Incident Ray
      const len = 200;
      const x1 = cx - len * Math.sin(rad1);
      const y1 = cy - len * Math.cos(rad1);
      
      ctx.beginPath();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ef4444'; // Red Laser
      ctx.moveTo(x1, y1);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Refracted Ray
      if (valid) {
          const x2 = cx + len * Math.sin(rad2);
          const y2 = cy + len * Math.cos(rad2);
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
      } else {
          // Reflection
          const x2 = cx + len * Math.sin(rad1);
          const y2 = cy - len * Math.cos(rad1); // Reflection goes back up
          ctx.beginPath();
          ctx.strokeStyle = '#ef4444';
          ctx.moveTo(cx, cy);
          ctx.lineTo(x2, y2);
          ctx.stroke();
      }

  }, [n1, n2, angle, rad1, rad2, valid]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
         <h2 className="font-bold text-lg">Materials</h2>
         <div>
            <label className="block text-sm font-bold">Medium 1 (n1)</label>
            <select value={n1} onChange={e => setN1(Number(e.target.value))} className="w-full p-2 border rounded">
                <option value={1.0}>Air (1.00)</option>
                <option value={1.33}>Water (1.33)</option>
                <option value={1.5}>Glass (1.50)</option>
            </select>
         </div>
         <div>
            <label className="block text-sm font-bold">Medium 2 (n2)</label>
            <select value={n2} onChange={e => setN2(Number(e.target.value))} className="w-full p-2 border rounded">
                <option value={1.0}>Air (1.00)</option>
                <option value={1.33}>Water (1.33)</option>
                <option value={1.5}>Glass (1.50)</option>
                <option value={2.42}>Diamond (2.42)</option>
            </select>
         </div>
         <div>
             <label className="block text-sm font-bold">Incidence Angle</label>
             <input type="range" min="0" max="85" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-full"/>
         </div>
      </div>
    </div>
  );
};

export default Refraction;