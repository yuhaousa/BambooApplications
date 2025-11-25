
import React from 'react';
import { ArrowRight, Play, Zap } from 'lucide-react';

interface HeroProps {
  onWatchDemo?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onWatchDemo }) => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-[#020617]">
      {/* Animated Galaxy Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Deep Space Base */}
        <div className="absolute inset-0 bg-slate-950"></div>
        
        {/* Nebulas */}
        <div className="absolute top-[-10%] right-[-5%] w-[70vw] h-[70vw] bg-purple-600/20 rounded-full blur-[100px] animate-[pulse_8s_ease-in-out_infinite] mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-600/20 rounded-full blur-[120px] animate-[pulse_10s_ease-in-out_infinite_reverse] mix-blend-screen"></div>
        <div className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-cyan-500/10 rounded-full blur-[80px] animate-[pulse_12s_ease-in-out_infinite] delay-1000 mix-blend-screen"></div>

        {/* Stars (CSS Radial Gradient Trick) */}
        <div className="absolute inset-0 opacity-50 animate-[spin_100s_linear_infinite]">
           <div className="absolute inset-0 bg-[radial-gradient(white,rgba(255,255,255,0.2)_2px,transparent_3px)] bg-[length:100px_100px]"></div>
        </div>
        
        {/* Moving Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] transform perspective-1000 rotate-x-12 scale-150 opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm animate-fade-in-up">
            <Zap size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-mono text-brand-accent">SYSTEM ONLINE // SINCE 1972 // UPGRADED 2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-500 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Future Language Academy <br />
            <span className="text-brand-accent neon-text relative">
              Transformed.
              <span className="absolute -inset-1 bg-brand-accent/20 blur-xl -z-10 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed backdrop-blur-sm bg-slate-950/30 p-4 rounded-xl border border-white/5">
            Forget rote memorization. inlingua Future Academy fuses our 50-year pedagogical heritage with adaptive Gemini AI to accelerate fluency by 300%.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href="#ai-demo"
              className="px-8 py-4 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-glow transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:shadow-[0_0_30px_rgba(59,130,246,0.8)] hover:scale-105"
            >
              Start Neural Link
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <button 
              onClick={onWatchDemo}
              className="px-8 py-4 border border-white/20 hover:bg-white/5 rounded-lg text-white font-medium backdrop-blur-sm flex items-center justify-center gap-2 transition-all hover:border-white/40"
            >
              <Play size={20} className="fill-current" />
              Watch Demo
            </button>
          </div>

          <div className="mt-12 flex items-center gap-8 text-slate-500 text-sm font-mono">
            <div className="flex flex-col">
              <span className="block text-2xl font-bold text-white">50K+</span>
              <span>Graduates</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex flex-col">
              <span className="block text-2xl font-bold text-white">14</span>
              <span>Languages</span>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
             <div className="flex flex-col">
              <span className="block text-2xl font-bold text-white">2.5</span>
              <span>Gemini Model</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
