import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface GraphingLinesProps {
  onContextUpdate: (context: SimContextData) => void;
}

const GraphingLines: React.FC<GraphingLinesProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [slope, setSlope] = useState(1);
  const [yIntercept, setYIntercept] = useState(0);

  useEffect(() => {
    onContextUpdate({
      name: "Graphing Lines",
      description: "Explore linear equations in slope-intercept form: y = mx + b.",
      parameters: {
        "Slope (m)": slope.toString(),
        "Y-Intercept (b)": yIntercept.toString(),
        "Equation": `y = ${slope}x ${yIntercept >= 0 ? '+' : ''} ${yIntercept}`
      }
    });
  }, [slope, yIntercept, onContextUpdate]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const cx = w / 2;
    const cy = h / 2;
    const scale = 40; // pixels per unit

    ctx.clearRect(0, 0, w, h);

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    
    // Vertical grid lines
    for (let x = cx % scale; x < w; x += scale) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    // Horizontal grid lines
    for (let y = cy % scale; y < h; y += scale) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, cy); ctx.lineTo(w, cy); // X Axis
    ctx.moveTo(cx, 0); ctx.lineTo(cx, h); // Y Axis
    ctx.stroke();

    // Plot Line y = mx + b
    // We need two points at the edges of the screen
    // x ranges roughly from -10 to 10
    const xMin = -15;
    const xMax = 15;
    const y1 = slope * xMin + yIntercept;
    const y2 = slope * xMax + yIntercept;

    const p1 = { x: cx + xMin * scale, y: cy - y1 * scale };
    const p2 = { x: cx + xMax * scale, y: cy - y2 * scale };

    ctx.strokeStyle = '#d946ef'; // Fuchsia
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Intercept Point
    ctx.fillStyle = '#d946ef';
    ctx.beginPath();
    ctx.arc(cx, cy - yIntercept * scale, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#475569';
    ctx.textAlign = 'right';
    ctx.font = '14px sans-serif';
    ctx.fillText(`(0, ${yIntercept})`, cx - 10, cy - yIntercept * scale);

    // Slope triangle (Run = 1)
    const tX = cx + 2 * scale; // start triangle at x=2
    const tY = cy - (slope * 2 + yIntercept) * scale;
    
    ctx.fillStyle = 'rgba(217, 70, 239, 0.2)';
    ctx.beginPath();
    ctx.moveTo(tX, tY);
    ctx.lineTo(tX + scale, tY); // Run of 1
    ctx.lineTo(tX + scale, tY - slope * scale); // Rise of m
    ctx.fill();
    
    ctx.fillStyle = '#d946ef';
    ctx.textAlign = 'center';
    ctx.fillText(`m = ${slope}`, tX + scale + 20, tY - (slope * scale)/2);

  }, [slope, yIntercept]);

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
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Equation Settings</h2>
        
        <div className="text-center mb-4">
            <div className="text-2xl font-mono font-bold text-purple-600 bg-purple-50 py-3 rounded-lg">
                y = <span className="text-pink-600">{slope}</span>x + <span className="text-blue-600">{yIntercept}</span>
            </div>
        </div>

        <div className="space-y-6">
           <div>
             <label className="block text-sm font-bold text-pink-600 mb-1">Slope (m): {slope}</label>
             <input 
               type="range" min="-5" max="5" step="0.1" value={slope} 
               onChange={(e) => setSlope(Number(e.target.value))}
               className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
             />
           </div>

           <div>
             <label className="block text-sm font-bold text-blue-600 mb-1">Y-Intercept (b): {yIntercept}</label>
             <input 
               type="range" min="-8" max="8" step="1" value={yIntercept} 
               onChange={(e) => setYIntercept(Number(e.target.value))}
               className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
             />
           </div>
        </div>
      </div>
    </div>
  );
};

export default GraphingLines;