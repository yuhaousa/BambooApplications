
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface CircuitLabProps {
  onContextUpdate: (context: SimContextData) => void;
}

const CircuitLab: React.FC<CircuitLabProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [voltage, setVoltage] = useState(9); // Volts
  const [resistance, setResistance] = useState(500); // Ohms
  const current = voltage / resistance; // Amps
  
  const electronOffset = useRef(0);

  useEffect(() => {
    onContextUpdate({
      name: "Circuit Lab (Ohm's Law)",
      description: "Explore the relationship between Voltage (V), Current (I), and Resistance (R). V = IR.",
      parameters: {
        "Voltage": `${voltage} V`,
        "Resistance": `${resistance} Ω`,
        "Current": `${(current * 1000).toFixed(1)} mA`,
        "Power": `${(voltage * current * 1000).toFixed(1)} mW`
      }
    });
  }, [voltage, resistance, current, onContextUpdate]);

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw Circuit Wire (Rectangle loop)
      const padding = 100;
      const w = canvas.width - padding * 2;
      const h = canvas.height - padding * 2;
      const x = padding;
      const y = padding;

      ctx.beginPath();
      ctx.strokeStyle = '#fbbf24'; // Copper color
      ctx.lineWidth = 8;
      ctx.rect(x, y, w, h);
      ctx.stroke();

      // Draw Battery (Left side)
      const by = y + h/2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 10, by - 30, 20, 60); // Clear wire
      // Battery Graphic
      ctx.fillStyle = '#334155';
      ctx.fillRect(x - 15, by - 20, 30, 40); // Body
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(x - 10, by - 30, 20, 10); // Positive terminal
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${voltage}V`, x, by + 5);

      // Draw Resistor (Top side)
      const rx = x + w/2;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(rx - 40, y - 10, 80, 20); // Clear wire
      // Zigzag
      ctx.beginPath();
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 4;
      ctx.moveTo(rx - 40, y);
      for(let i=0; i<4; i++) {
          ctx.lineTo(rx - 30 + i*20, y - 15);
          ctx.lineTo(rx - 20 + i*20, y + 15);
      }
      ctx.lineTo(rx + 40, y);
      ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.fillText(`${resistance}Ω`, rx, y - 25);

      // Draw Electrons
      // Speed depends on current
      const speed = current * 2000; 
      electronOffset.current -= speed; 
      
      ctx.fillStyle = '#3b82f6';
      const totalLen = 2 * w + 2 * h;
      const electronSpacing = 40;
      
      for (let dist = 0; dist < totalLen; dist += electronSpacing) {
          let d = (dist + electronOffset.current) % totalLen;
          if (d < 0) d += totalLen;

          let ex = 0, ey = 0;
          // Map distance to rectangle coordinates
          if (d < w) { // Top edge (moving right)
              ex = x + d; ey = y;
          } else if (d < w + h) { // Right edge (moving down)
              ex = x + w; ey = y + (d - w);
          } else if (d < 2 * w + h) { // Bottom edge (moving left)
              ex = x + w - (d - (w + h)); ey = y + h;
          } else { // Left edge (moving up)
              ex = x; ey = y + h - (d - (2 * w + h));
          }

          // Skip battery area and resistor area visually for cleanness
          if (Math.abs(ex - rx) < 40 && Math.abs(ey - y) < 10) continue;
          if (Math.abs(ex - x) < 20 && Math.abs(ey - by) < 30) continue;

          ctx.beginPath();
          ctx.arc(ex, ey, 4, 0, Math.PI * 2);
          ctx.fill();
      }

      // Light Bulb (Bottom Side) visual indicator of power
      const bulbX = x + w/2;
      const bulbY = y + h;
      
      // Glow
      const brightness = Math.min((current * 1000) / 50, 1); // max glow at 50mA
      if (brightness > 0.01) {
          const gradient = ctx.createRadialGradient(bulbX, bulbY, 10, bulbX, bulbY, 60);
          gradient.addColorStop(0, `rgba(253, 224, 71, ${brightness})`);
          gradient.addColorStop(1, 'rgba(253, 224, 71, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath(); ctx.arc(bulbX, bulbY, 60, 0, Math.PI*2); ctx.fill();
      }

      // Bulb Glass
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, 20, 0, Math.PI, true); // half circle
      ctx.lineTo(bulbX - 10, bulbY + 10);
      ctx.lineTo(bulbX + 10, bulbY + 10);
      ctx.fillStyle = `rgba(253, 224, 71, ${0.2 + brightness * 0.8})`;
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 2;
      ctx.stroke();

      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [voltage, resistance, current]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain bg-gray-50"
        />
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow font-mono text-sm text-gray-800">
           <div>I = V / R</div>
           <div className="text-xl font-bold text-brand-600">{(current * 1000).toFixed(1)} mA</div>
        </div>
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Circuit Components</h2>
        
        <div className="space-y-6">
           <div className="bg-red-50 p-3 rounded-xl border border-red-100">
             <label className="block text-sm font-bold text-red-800 mb-1">Battery Voltage (V)</label>
             <input 
               type="range" min="1.5" max="12" step="0.5" value={voltage} 
               onChange={(e) => setVoltage(Number(e.target.value))}
               className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-600"
             />
             <div className="text-right text-xs font-bold text-red-600">{voltage} V</div>
           </div>

           <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
             <label className="block text-sm font-bold text-slate-700 mb-1">Resistor (Ω)</label>
             <input 
               type="range" min="100" max="1000" step="50" value={resistance} 
               onChange={(e) => setResistance(Number(e.target.value))}
               className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
             />
             <div className="text-right text-xs font-bold text-slate-600">{resistance} Ω</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CircuitLab;
