
import React from 'react';
import { Share2, Cpu, Database, Activity } from 'lucide-react';

const DemoPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4">
           <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-mono text-brand-primary">LIVE SIMULATION</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">
          Neural Interface Demo
        </h1>
        <p className="text-slate-400 max-w-2xl">
          Observe how the Gemini-powered kernel adapts to student inputs in real-time. This is a simulation of the Level 4 immersive environment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Video Player Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative aspect-video bg-slate-900 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
            {/* 
                Video Player with Sound Enabled.
                Removed 'muted' and 'autoPlay' to allow audio playback.
                Added 'controls' for user interaction.
            */}
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              poster="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Tech Overlay UI (Visual only, pointer events none) */}
            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 m-4 rounded-xl flex flex-col justify-between p-4 z-10">
                <div className="flex justify-between w-full">
                    <span className="w-4 h-4 border-t-2 border-l-2 border-brand-accent/50"></span>
                    <span className="w-4 h-4 border-t-2 border-r-2 border-brand-accent/50"></span>
                </div>
                <div className="flex justify-between w-full">
                    <span className="w-4 h-4 border-b-2 border-l-2 border-brand-accent/50"></span>
                    <span className="w-4 h-4 border-b-2 border-r-2 border-brand-accent/50"></span>
                </div>
                
                {/* Simulated Rec/Live Indicator */}
                <div className="absolute top-8 right-8 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-mono text-red-400 tracking-widest">REC</span>
                </div>
            </div>
          </div>

          <div className="flex gap-4">
             <button className="flex-1 py-4 bg-brand-primary hover:bg-brand-glow text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                Start Free Trial
             </button>
             <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white transition-all">
                <Share2 size={20} />
             </button>
          </div>
        </div>

        {/* Tech Specs / Sidebar */}
        <div className="space-y-6">
           <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Cpu size={20} className="text-brand-accent" />
                 Simulation Metrics
              </h3>
              <div className="space-y-4">
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                       <span>Vocab Retention</span>
                       <span className="text-green-400">98.4%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full w-[98%] bg-green-500 rounded-full"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                       <span>Latency</span>
                       <span className="text-brand-primary">12ms</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full w-[15%] bg-brand-primary rounded-full"></div>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                       <span>Context Awareness</span>
                       <span className="text-purple-400">High</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full w-[85%] bg-purple-500 rounded-full"></div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-2xl border border-white/10">
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                 <Database size={20} className="text-brand-accent" />
                 Active Modules
              </h3>
              <ul className="space-y-3">
                 {[
                   "Real-time Phonetic Correction",
                   "Syntax Prediction Engine",
                   "Cultural Nuance Injector",
                   "Memory Reinforcement Loop"
                 ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-slate-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-brand-primary"></div>
                       {item}
                    </li>
                 ))}
              </ul>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
