
import React, { useState, useEffect, useRef } from 'react';
import { SimContextData } from '../types';

interface DopplerEffectProps {
  onContextUpdate: (context: SimContextData) => void;
}

interface Wave {
  id: number;
  x: number;
  y: number;
  r: number;
  time: number;
}

const DopplerEffect: React.FC<DopplerEffectProps> = ({ onContextUpdate }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Parameters
  const [sourceSpeed, setSourceSpeed] = useState(0); // v (pixels per frame)
  const [frequency, setFrequency] = useState(15); // frames between emissions (lower is higher freq)
  const [isRunning, setIsRunning] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const WAVE_SPEED = 2; // c (pixels per frame)
  const BASE_FREQ = 220; // Hz (Base audio frequency)

  // Simulation State
  const sourcePos = useRef(100);
  const waves = useRef<Wave[]>([]);
  const frameCount = useRef(0);
  const animId = useRef(0);

  // Audio Refs
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const pannerNode = useRef<StereoPannerNode | null>(null);

  const machNumber = Math.abs(sourceSpeed) / WAVE_SPEED;

  useEffect(() => {
    onContextUpdate({
      name: "Doppler Effect",
      description: "Observe how the frequency of waves changes for an observer when the source is moving. Redshift (moving away) vs Blueshift (approaching). Turn on Audio to hear it!",
      parameters: {
        "Source Speed (v)": `${sourceSpeed.toFixed(1)} units/frame`,
        "Wave Speed (c)": `${WAVE_SPEED} units/frame`,
        "Mach Number (v/c)": machNumber.toFixed(2),
        "Status": machNumber > 1 ? "Supersonic (Sonic Boom)" : machNumber === 1 ? "Sonic Barrier" : "Subsonic"
      }
    });
  }, [sourceSpeed, machNumber, onContextUpdate]);

  // Audio Cleanup
  useEffect(() => {
    return () => {
      if (audioCtx.current) {
        audioCtx.current.close();
        audioCtx.current = null;
      }
    };
  }, []);

  const toggleAudio = async () => {
    if (audioEnabled) {
        // Stop
        if (audioCtx.current) {
            await audioCtx.current.suspend();
        }
        setAudioEnabled(false);
    } else {
        // Start
        if (!audioCtx.current) {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            audioCtx.current = new AudioContext();
            
            oscillator.current = audioCtx.current.createOscillator();
            gainNode.current = audioCtx.current.createGain();
            pannerNode.current = audioCtx.current.createStereoPanner();

            oscillator.current.type = 'sawtooth'; // Sawtooth sounds more like an engine/buzzer
            oscillator.current.frequency.value = BASE_FREQ;
            
            // Chain: Osc -> Gain -> Panner -> Dest
            oscillator.current.connect(gainNode.current);
            gainNode.current.connect(pannerNode.current);
            pannerNode.current.connect(audioCtx.current.destination);
            
            oscillator.current.start();
        }
        await audioCtx.current.resume();
        setAudioEnabled(true);
    }
  };

  useEffect(() => {
    const render = () => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      const w = canvasRef.current.width;
      const h = canvasRef.current.height;
      
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, w, h);

      if (isRunning) {
        // Move Source
        sourcePos.current += sourceSpeed;
        
        // Loop source around screen
        if (sourcePos.current > w + 100) sourcePos.current = -100;
        if (sourcePos.current < -100) sourcePos.current = w + 100;

        // Emit Waves
        if (frameCount.current % frequency === 0) {
            waves.current.push({
                id: Date.now() + Math.random(),
                x: sourcePos.current,
                y: h / 2,
                r: 0,
                time: 0
            });
        }
        frameCount.current++;

        // Expand Waves
        waves.current.forEach(wave => {
            wave.r += WAVE_SPEED;
            wave.time++;
        });

        // Remove old waves
        if (waves.current.length > 150) {
             waves.current = waves.current.filter(wave => wave.r < Math.max(w, h) * 1.5);
        }

        // --- AUDIO UPDATE LOGIC ---
        if (audioEnabled && audioCtx.current && oscillator.current && gainNode.current && pannerNode.current) {
            const obsX = w / 2;
            const dist = sourcePos.current - obsX; // Negative = Left, Positive = Right
            
            // Determine approach vs recede
            // Moving Right (Pos Speed): Approaching if dist < 0, Receding if dist > 0
            // Moving Left (Neg Speed): Approaching if dist > 0, Receding if dist < 0
            
            let isApproaching = false;
            if (sourceSpeed > 0 && dist < 0) isApproaching = true;
            if (sourceSpeed < 0 && dist > 0) isApproaching = true;

            // Calculate Doppler Shift Factor
            // f' = f * (c / (c +/- v))
            // +v if receding, -v if approaching
            
            // We clamp the effective speed ratio to avoid infinity at Mach 1
            const speedRatio = Math.min(Math.abs(sourceSpeed) / WAVE_SPEED, 0.90);
            
            let shiftFactor = 1;
            if (isApproaching) {
                shiftFactor = 1 / (1 - speedRatio);
            } else {
                shiftFactor = 1 / (1 + speedRatio);
            }

            // Smooth audio transitions
            const now = audioCtx.current.currentTime;
            
            // Pitch
            oscillator.current.frequency.setTargetAtTime(BASE_FREQ * shiftFactor, now, 0.1);

            // Volume (Distance Attenuation)
            // Max volume 0.1 to save ears
            const maxVol = 0.1;
            const distanceFactor = Math.max(0, 1 - Math.abs(dist) / (w/1.5)); // Linear falloff
            gainNode.current.gain.setTargetAtTime(maxVol * distanceFactor, now, 0.1);

            // Panning (Left to Right)
            const panVal = Math.max(-1, Math.min(1, dist / (w/2)));
            pannerNode.current.pan.setTargetAtTime(panVal, now, 0.1);
        }
      } else {
          // If paused, mute
          if (audioEnabled && gainNode.current && audioCtx.current) {
              gainNode.current.gain.setTargetAtTime(0, audioCtx.current.currentTime, 0.1);
          }
      }

      // Draw Waves
      ctx.lineWidth = 2;
      waves.current.forEach(wave => {
          // Wave fading
          const alpha = Math.max(0, 1 - wave.r / 600);
          
          // Color shift visualization (Redshift/Blueshift) based on compression?
          // Actually in this sim, the wave color is static, but let's make it cool.
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`; // Sky blue
          
          ctx.beginPath();
          ctx.arc(wave.x, wave.y, wave.r, 0, Math.PI * 2);
          ctx.stroke();
      });

      // Draw Source
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(sourcePos.current, h / 2, 10, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw Observer (Ear)
      ctx.font = "40px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("👂", w/2, h/2 + 120);
      
      // Visualization of Observer Zone
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.moveTo(w/2, 0);
      ctx.lineTo(w/2, h);
      ctx.stroke();

      animId.current = requestAnimationFrame(render);
    };
    
    render();
    return () => cancelAnimationFrame(animId.current);
  }, [sourceSpeed, frequency, isRunning, audioEnabled]);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 p-4 bg-gray-900 text-white">
      <div className="flex-1 bg-black rounded-2xl shadow-lg overflow-hidden border border-gray-800 relative">
        <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="w-full h-full object-contain"
        />
        <div className="absolute top-4 left-4 text-xs text-gray-400 space-y-1 pointer-events-none">
            <div>Wave Speed (c) = {WAVE_SPEED}</div>
            <div className={machNumber > 1 ? "text-red-400 font-bold" : ""}>Mach: {machNumber.toFixed(2)}</div>
        </div>
        {audioEnabled && (
            <div className="absolute top-4 right-4 flex items-center gap-2 text-green-400 bg-green-900/30 px-3 py-1 rounded-full border border-green-500/30 animate-pulse">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                <span className="text-xs font-bold">Audio On</span>
            </div>
        )}
      </div>

      <div className="w-full lg:w-80 bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col gap-6">
        <h2 className="text-xl font-bold text-white border-b border-gray-600 pb-2">Doppler Controls</h2>
        
        <div className="space-y-6">
           
           <button
            onClick={toggleAudio}
            className={`w-full py-4 rounded-xl font-bold text-white transition flex items-center justify-center gap-2 ${audioEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'}`}
           >
               {audioEnabled ? (
                   <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                    Mute Sound
                   </>
               ) : (
                   <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    Enable Audio
                   </>
               )}
           </button>

           <div>
             <label className="block text-sm font-bold text-gray-300 mb-1">Source Speed (v)</label>
             <input 
               type="range" min="-4" max="4" step="0.1" value={sourceSpeed} 
               onChange={(e) => setSourceSpeed(Number(e.target.value))}
               className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500"
             />
             <div className="flex justify-between text-xs text-gray-400 mt-1">
                 <span>Left</span>
                 <span>Stationary</span>
                 <span>Right</span>
             </div>
           </div>

           <div>
             <label className="block text-sm font-bold text-gray-300 mb-1">Emission Frequency</label>
             <input 
               type="range" min="5" max="30" step="1" value={35 - frequency} 
               onChange={(e) => setFrequency(35 - Number(e.target.value))}
               className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
             />
             <div className="flex justify-between text-xs text-gray-400 mt-1">
                 <span>Low</span>
                 <span>High</span>
             </div>
           </div>

           <button 
            onClick={() => {
                setIsRunning(!isRunning); 
            }}
            className={`w-full py-3 rounded-xl font-bold text-white transition ${isRunning ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-green-600 hover:bg-green-700'}`}
           >
               {isRunning ? 'Freeze' : 'Resume'}
           </button>
           
           <div className="bg-gray-700/50 p-3 rounded border border-gray-600 text-xs text-gray-300">
               <p className="mb-1"><strong>Audio Tip:</strong> Sound is louder when the source is close to the ear (center). Pitch increases when approaching.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DopplerEffect;
