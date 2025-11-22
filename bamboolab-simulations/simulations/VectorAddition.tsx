
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface VectorAdditionProps {
  onContextUpdate: (context: SimContextData) => void;
}

const VectorAddition: React.FC<VectorAdditionProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ax, setAx] = useState(100); const [ay, setAy] = useState(-50);
  const [bx, setBx] = useState(50); const [by, setBy] = useState(100);

  const rx = ax + bx;
  const ry = ay + by;
  const rMag = Math.sqrt(rx*rx + ry*ry);
  const rAng = Math.atan2(-ry, rx) * 180 / Math.PI; // Canvas Y is inverted

  useEffect(() => {
    onContextUpdate({
      name: "Vector Addition",
      description: "Visualize vector summation R = A + B. Tail-to-head method.",
      parameters: {
        "Vector A": `(${ax}, ${-ay})`,
        "Vector B": `(${bx}, ${-by})`,
        "Resultant R": `(${rx}, ${-ry})`,
        "|R| Magnitude": rMag.toFixed(1),
        "Direction": `${rAng.toFixed(1)}°`
      }
    });
  }, [ax, ay, bx, by, rx, ry, rMag, rAng, onContextUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    if(!ctx) return;
    
    ctx.clearRect(0,0,canvas.width, canvas.height);
    const cx = canvas.width/2;
    const cy = canvas.height/2;

    // Grid
    ctx.strokeStyle = '#e5e7eb';
    for(let i=0; i<canvas.width; i+=50) { ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,canvas.height); ctx.stroke(); }
    for(let i=0; i<canvas.height; i+=50) { ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(canvas.width,i); ctx.stroke(); }
    
    // Axes
    ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();

    const drawVector = (x: number, y: number, dx: number, dy: number, color: string, label: string) => {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+dx, y+dy);
        ctx.strokeStyle = color; ctx.lineWidth = 4; ctx.stroke();
        
        // Arrow
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(x+dx, y+dy);
        ctx.lineTo(x+dx - 15*Math.cos(angle-Math.PI/6), y+dy - 15*Math.sin(angle-Math.PI/6));
        ctx.lineTo(x+dx - 15*Math.cos(angle+Math.PI/6), y+dy - 15*Math.sin(angle+Math.PI/6));
        ctx.fillStyle = color; ctx.fill();
        
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(label, x+dx/2 + 10, y+dy/2);
    };

    // Draw A from Origin
    drawVector(cx, cy, ax, ay, '#3b82f6', 'A');
    // Draw B from Head of A
    drawVector(cx + ax, cy + ay, bx, by, '#ef4444', 'B');
    // Draw Resultant
    drawVector(cx, cy, rx, ry, '#10b981', 'R');

  }, [ax, ay, bx, by, rx, ry]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
         <h2 className="font-bold text-lg">Components</h2>
         
         <div className="border-l-4 border-blue-500 pl-3">
             <h3 className="font-bold text-blue-600">Vector A</h3>
             <label className="block text-xs">X: {ax}</label>
             <input type="range" min="-200" max="200" value={ax} onChange={e => setAx(Number(e.target.value))} className="w-full"/>
             <label className="block text-xs">Y: {-ay}</label>
             <input type="range" min="-200" max="200" value={-ay} onChange={e => setAy(-Number(e.target.value))} className="w-full"/>
         </div>

         <div className="border-l-4 border-red-500 pl-3">
             <h3 className="font-bold text-red-600">Vector B</h3>
             <label className="block text-xs">X: {bx}</label>
             <input type="range" min="-200" max="200" value={bx} onChange={e => setBx(Number(e.target.value))} className="w-full"/>
             <label className="block text-xs">Y: {-by}</label>
             <input type="range" min="-200" max="200" value={-by} onChange={e => setBy(-Number(e.target.value))} className="w-full"/>
         </div>
         
         <div className="bg-green-50 p-2 rounded text-green-800 font-bold text-center border border-green-200">
             R = A + B
         </div>
      </div>
    </div>
  );
};

export default VectorAddition;