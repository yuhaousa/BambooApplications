
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import AITutor from './components/AITutor';
import Courses from './components/Courses';
import CoursesPage from './components/CoursesPage';
import DemoPage from './components/DemoPage';
import Footer from './components/Footer';
import TopBanner from './components/TopBanner';

type View = 'home' | 'courses' | 'demo';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-brand-accent selection:text-brand-dark bg-[#020617]">
      <TopBanner />
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-grow relative">
        {/* Ambient Background Glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/20 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-accent/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        </div>

        <div className="relative z-10">
          {currentView === 'home' && (
            <>
              <Hero onWatchDemo={() => {
                setCurrentView('demo');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
              <Features />
              <div id="ai-demo" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
                 <div className="mb-12 text-center">
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 neon-text">
                      Experience Neural Learning
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                      Interact with our Gemini-powered adaptive tutor. It analyzes your proficiency in real-time.
                    </p>
                  </div>
                <AITutor />
              </div>
              <Courses onViewAll={() => {
                setCurrentView('courses');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </>
          )}

          {currentView === 'courses' && <CoursesPage />}
          
          {currentView === 'demo' && <DemoPage />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default App;
