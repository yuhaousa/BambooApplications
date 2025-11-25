
import React from 'react';
import { Course, CourseLevel } from '../types';
import { ArrowUpRight } from 'lucide-react';

const COURSES: Course[] = [
  {
    id: '1',
    title: 'Business English Accelerator',
    language: 'English',
    description: 'Master boardroom dynamics and negotiation strategies with AI-simulated stakeholders.',
    level: CourseLevel.Business,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    duration: '8 Weeks'
  },
  {
    id: '2',
    title: 'Mandarin for Tech Pros',
    language: 'Mandarin',
    description: 'Specialized vocabulary for the Shenzhen hardware ecosystem and software development.',
    level: CourseLevel.Intermediate,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80',
    duration: '12 Weeks'
  },
  {
    id: '3',
    title: 'Rapid French Immersion',
    language: 'French',
    description: 'From zero to conversational in 4 weeks using our proprietary VR environments.',
    level: CourseLevel.Beginner,
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    duration: '4 Weeks'
  }
];

interface CoursesProps {
  onViewAll?: () => void;
}

const Courses: React.FC<CoursesProps> = ({ onViewAll }) => {
  return (
    <section id="courses" className="py-24 bg-black relative">
       {/* Background Grid */}
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
       
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-2">Deployed Modules</h2>
            <p className="text-slate-400">Select your download path.</p>
          </div>
          <button 
            onClick={onViewAll}
            className="hidden md:flex items-center gap-2 text-brand-accent hover:text-white transition-colors group"
          >
            View Full Catalogue <ArrowUpRight size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {COURSES.map((course) => (
            <div key={course.id} className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 hover:border-brand-primary/50 transition-all duration-500">
              
              {/* Image */}
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10"></div>
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono border border-white/20 text-white">
                  {course.language}
                </div>
              </div>

              {/* Content */}
              <div className="p-6 relative z-20">
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-xs font-bold px-2 py-1 rounded bg-white/5 ${
                    course.level === CourseLevel.Business ? 'text-purple-400' : 'text-brand-accent'
                  }`}>
                    {course.level}
                  </span>
                  <span className="text-slate-500 text-xs font-mono">{course.duration}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-primary transition-colors">
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-6 line-clamp-2">
                  {course.description}
                </p>

                <button className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 group-hover:border-brand-primary/30">
                  Initialize <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile View All Button */}
        <div className="mt-8 md:hidden text-center">
           <button 
              onClick={onViewAll}
              className="inline-flex items-center gap-2 text-brand-accent hover:text-white transition-colors"
           >
              View Full Catalogue <ArrowUpRight size={18} />
           </button>
        </div>
      </div>
    </section>
  );
};

export default Courses;
