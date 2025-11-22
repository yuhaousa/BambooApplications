
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface WaveInterferenceProps {
  onContextUpdate: (context: SimContextData) => void;
  type?: 'sound' | 'light' | 'water';
}

const WaveInterference: React.FC<WaveInterferenceProps> = ({ onContextUpdate, type = 'water' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  
  const [frequency, setFrequency] = useState(2); // Hz
  const [amplitude, setAmplitude] = useState(1);
  const [separation, setSeparation] = useState(2); // Source separation
  const [isDoubleSource, setIsDoubleSource] = useState(true);

  // Simulation time
  const timeRef = useRef(0);

  useEffect(() => {
    onContextUpdate({
      name: `Wave Interference (${type})`,
      description: "Explore wave interference patterns, constructive and destructive interference.",
      parameters: {
        "Frequency": `${frequency} Hz`,
        "Amplitude": amplitude.toString(),
        "Sources": isDoubleSource ? "Two (Interference)" : "One",
        "Separation": isDoubleSource ? `${separation} m` : "N/A"
      }
    });
  }, [frequency, amplitude, separation, isDoubleSource, type, onContextUpdate]);

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    timeRef.current += 0.05;

    // Create image data for field
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    // Source positions
    const cy = height / 2;
    const cx = 50;
    const s1y = isDoubleSource ? cy - (separation * 20) : cy;
    const s2y = cy + (separation * 20);

    // Color mapping
    const getR = (val: number) => {
        if (type === 'light') return val > 0 ? 0 : 0; // Greenish
        if (type === 'sound') return 100 + val * 100;
        return 50 + val * 100; // Water blueish
    };
    const getG = (val: number) => {
        if (type === 'light') return 128 + val * 127; // Green light
        if (type === 'sound') return 100 + val * 100; // Grayscale sound
        return 150 + val * 80; // Water
    };
    const getB = (val: number) => {
        if (type === 'light') return 0;
        if (type === 'sound') return 100 + val * 100;
        return 255; // Water
    };

    // Very simplified wave field calculation
    // Resolution scaling for performance
    const res = 4; 
    for (let y = 0; y < height; y += res) {
      for (let x = 0; x < width; x += res) {
        // Dist to Source 1
        const d1 = Math.sqrt((x - cx)**2 + (y - s1y)**2);
        const phase1 = d1 * 0.1 - timeRef.current * frequency;
        let val = Math.sin(phase1) * amplitude;

        if (isDoubleSource) {
            // Dist to Source 2
            const d2 = Math.sqrt((x - cx)**2 + (y - s2y)**2);
            const phase2 = d2 * 0.1 - timeRef.current * frequency;
            val += Math.sin(phase2) * amplitude;
            val /= 2; // Normalize
        }
        
        // Falloff
        val *= Math.max(0, 1 - x / (width * 1.2));

        const r = getR(val);
        const g = getG(val);
        const b = getB(val);

        // Fill block
        for(let dy=0; dy<res; dy++){
            for(let dx=0; dx<res; dx++){
                 if(y+dy < height && x+dx < width) {
                    const idx = ((y+dy) * width + (x+dx)) * 4;
                    data[idx] = r;
                    data[idx + 1] = g;
                    data[idx + 2] = b;
                    data[idx + 3] = 255;
                 }
            }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    
    // Draw Sources
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath(); ctx.arc(cx, s1y, 8, 0, Math.PI*2); ctx.fill();
    if (isDoubleSource) {
        ctx.beginPath(); ctx.arc(cx, s2y, 8, 0, Math.PI*2); ctx.fill();
    }

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [frequency, amplitude, separation, isDoubleSource, type]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-800 relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={500} 
          className="w-full h-full object-contain"
        />
      </div>

      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-2">Wave Controls</h2>
        
        <div className="space-y-6">
          <div>
             <label className="flex items-center space-x-2 font-medium text-gray-700">
               <input 
                type="checkbox" 
                checked={isDoubleSource} 
                onChange={(e) => setIsDoubleSource(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-gray-300"
               />
               <span>Two Sources (Interference)</span>
             </label>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Frequency: {frequency} Hz</label>
            <input 
              type="range" min="1" max="10" step="0.5" value={frequency} 
              onChange={(e) => setFrequency(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
          </div>

           <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Source Separation</label>
            <input 
              type="range" min="0" max="5" step="0.5" value={separation} 
              disabled={!isDoubleSource}
              onChange={(e) => setSeparation(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-600 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaveInterference;
