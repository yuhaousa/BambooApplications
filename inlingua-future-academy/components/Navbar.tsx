
import React, { useState, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'courses' | 'demo';
  onNavigate: (view: 'home' | 'courses' | 'demo') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (view: 'home' | 'courses', sectionId?: string) => {
    onNavigate(view);
    setIsMenuOpen(false);
    
    if (view === 'home' && sectionId) {
      // If we are already on home, scroll immediately
      // If switching from courses/demo to home, we need a slight delay to allow rendering
      if (currentView !== 'home') {
          setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
      } else {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
      }
    } else if (view === 'home' && !sectionId) {
       window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (view === 'courses') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-10 w-full z-40 transition-all duration-300 ${isScrolled ? 'glass-panel py-3' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="bg-brand-primary p-2 rounded-lg text-white group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow">
            <Sparkles size={24} />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-display font-bold text-xl tracking-wider text-white leading-none">
              inlingua
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-accent">
              Future Academy
            </span>
          </div>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleNavClick('home', 'methodology')}
            className="text-sm font-medium text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-wide focus:outline-none"
          >
            Methodology
          </button>
          
          <button 
            onClick={() => handleNavClick('courses')}
            className={`text-sm font-medium transition-colors uppercase tracking-wide focus:outline-none ${currentView === 'courses' ? 'text-brand-accent' : 'text-slate-300 hover:text-brand-accent'}`}
          >
            Courses
          </button>
          
          <button 
            onClick={() => handleNavClick('home', 'about-us')}
            className="text-sm font-medium text-slate-300 hover:text-brand-accent transition-colors uppercase tracking-wide focus:outline-none"
          >
            About Us
          </button>

          <a href="#ai-demo" 
             onClick={(e) => {
               e.preventDefault();
               handleNavClick('home', 'ai-demo');
             }}
             className="px-6 py-2 bg-brand-primary hover:bg-brand-glow text-white font-bold rounded-full transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center gap-2"
          >
            <span>Try AI Tutor</span>
            <Sparkles size={16} />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel absolute top-full left-0 w-full p-6 flex flex-col gap-4 border-t border-slate-700">
          <button 
             onClick={() => handleNavClick('home', 'methodology')}
             className="text-lg font-medium text-slate-200 text-left"
          >
             Methodology
          </button>
          <button 
             onClick={() => handleNavClick('courses')}
             className="text-lg font-medium text-slate-200 text-left"
          >
             Courses
          </button>
          <button 
             onClick={() => handleNavClick('home', 'about-us')}
             className="text-lg font-medium text-slate-200 text-left"
          >
             About Us
          </button>
          <button 
             onClick={() => handleNavClick('home', 'ai-demo')}
             className="w-full text-center py-3 bg-brand-primary rounded-lg font-bold mt-2"
          >
            Launch AI Tutor
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
