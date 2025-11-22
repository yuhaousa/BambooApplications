
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface NaturalSelectionProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface Bunny {
  id: number;
  x: number;
  y: number;
  color: 'white' | 'brown';
  age: number;
}

const NaturalSelection: React.FC<NaturalSelectionProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bunnies, setBunnies] = useState<Bunny[]>([{id: 1, x: 400, y: 250, color: 'white', age: 0}]);
  const [envColor, setEnvColor] = useState<'snow' | 'desert'>('snow');
  const [wolves, setWolves] = useState(false);
  const [generation, setGeneration] = useState(0);

  useEffect(() => {
      const whiteCount = bunnies.filter(b => b.color === 'white').length;
      const brownCount = bunnies.filter(b => b.color === 'brown').length;
      
      onContextUpdate({
          name: "Natural Selection",
          description: "Observe how traits affect survival. White bunnies hide in snow; brown bunnies hide in desert.",
          parameters: {
              "Environment": envColor,
              "Predators": wolves ? "Active" : "None",
              "White Bunnies": whiteCount,
              "Brown Bunnies": brownCount,
              "Total Population": bunnies.length,
              "Generation": generation
          }
      });
  }, [bunnies, envColor, wolves, generation, onContextUpdate]);

  // Sim Step
  useEffect(() => {
      const interval = setInterval(() => {
          if (bunnies.length === 0) return;
          if (bunnies.length > 200) return; // Cap

          setBunnies(prev => {
              const next = [];
              let reproduced = false;

              for (const b of prev) {
                  // Movement
                  let nx = b.x + (Math.random() - 0.5) * 20;
                  let ny = b.y + (Math.random() - 0.5) * 20;
                  nx = Math.max(50, Math.min(750, nx));
                  ny = Math.max(50, Math.min(450, ny));
                  
                  // Survival Check
                  let survivalChance = 0.99;
                  if (wolves) {
                      const isCamo = (envColor === 'snow' && b.color === 'white') || (envColor === 'desert' && b.color === 'brown');
                      if (!isCamo) survivalChance = 0.90; // Harder to survive if visible
                  }
                  
                  if (Math.random() < survivalChance) {
                      const newAge = b.age + 1;
                      next.push({...b, x: nx, y: ny, age: newAge});
                      
                      // Reproduction (Simplified)
                      if (Math.random() < 0.05 && prev.length < 150) {
                          // Mutation chance
                          const mut = Math.random() < 0.1; 
                          const childColor = mut ? (b.color === 'white' ? 'brown' : 'white') : b.color;
                          next.push({
                              id: Date.now() + Math.random(),
                              x: nx, y: ny,
                              color: childColor,
                              age: 0
                          });
                          reproduced = true;
                      }
                  }
              }
              if (reproduced) setGeneration(g => g + 0.1); // Rough generation tracker
              return next;
          });

      }, 200);
      return () => clearInterval(interval);
  }, [wolves, envColor]);

  useEffect(() => {
      const canvas = canvasRef.current;
      if(!canvas) return;
      const ctx = canvas.getContext('2d');
      if(!ctx) return;

      ctx.fillStyle = envColor === 'snow' ? '#f9fafb' : '#fde68a';
      ctx.fillRect(0,0,canvas.width, canvas.height);
      
      // Draw Bunnies
      bunnies.forEach(b => {
          ctx.beginPath();
          ctx.arc(b.x, b.y, 8, 0, Math.PI*2);
          ctx.fillStyle = b.color === 'white' ? '#fff' : '#78350f';
          ctx.fill();
          ctx.strokeStyle = '#9ca3af';
          ctx.stroke();
      });
      
      if (wolves) {
          ctx.font = "40px sans-serif";
          ctx.fillText("🐺", 700, 50);
      }

  }, [bunnies, envColor, wolves]);

  const addBunny = (color: 'white' | 'brown') => {
      setBunnies(prev => [...prev, {id: Date.now(), x: 400, y: 250, color, age: 0}]);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-50">
      <div className="flex-1 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
        <canvas ref={canvasRef} width={800} height={500} className="w-full h-full object-contain"/>
      </div>
      <div className="w-full lg:w-80 bg-white p-6 rounded-2xl shadow-lg border border-gray-200 space-y-6">
         <h2 className="font-bold text-lg">Environment</h2>
         <div className="flex gap-2">
             <button onClick={()=>setEnvColor('snow')} className={`flex-1 p-2 rounded border ${envColor==='snow'?'bg-gray-200 font-bold':''}`}>Snow</button>
             <button onClick={()=>setEnvColor('desert')} className={`flex-1 p-2 rounded border ${envColor==='desert'?'bg-yellow-200 font-bold':''}`}>Desert</button>
         </div>
         <div>
             <label className="flex items-center space-x-2">
                 <input type="checkbox" checked={wolves} onChange={e => setWolves(e.target.checked)} className="w-4 h-4"/>
                 <span className="font-bold">Add Wolves (Predators)</span>
             </label>
         </div>
         <div className="pt-4 border-t">
             <h3 className="font-bold text-sm mb-2">Add Mutations</h3>
             <div className="flex gap-2">
                <button onClick={()=>addBunny('white')} className="flex-1 bg-white border border-gray-300 p-2 rounded hover:bg-gray-50">Add White</button>
                <button onClick={()=>addBunny('brown')} className="flex-1 bg-amber-800 text-white p-2 rounded hover:bg-amber-900">Add Brown</button>
             </div>
         </div>
      </div>
    </div>
  );
};

export default NaturalSelection;