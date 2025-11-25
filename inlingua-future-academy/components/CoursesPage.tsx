
import React, { useState } from 'react';
import { Course, CourseLevel } from '../types';
import { ArrowUpRight, Search, Filter, Clock, BarChart, Zap } from 'lucide-react';

const ALL_COURSES: Course[] = [
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
  },
  {
    id: '4',
    title: 'German Engineering Basics',
    language: 'German',
    description: 'Technical terminology for automotive and robotics industries. Includes schematic reading.',
    level: CourseLevel.Intermediate,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    duration: '10 Weeks'
  },
  {
    id: '5',
    title: 'Spanish for Digital Nomads',
    language: 'Spanish',
    description: 'Essential phrases for remote work, housing, and social life in Latin America and Spain.',
    level: CourseLevel.Beginner,
    image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
    duration: '6 Weeks'
  },
  {
    id: '6',
    title: 'Japanese Cyber-Culture',
    language: 'Japanese',
    description: 'Advanced comprehension of modern Japanese media, gaming, and internet subcultures.',
    level: CourseLevel.Advanced,
    image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80',
    duration: '16 Weeks'
  },
  {
    id: '7',
    title: 'Korean Media & Ent.',
    language: 'Korean',
    description: 'Analyze K-Drama scripts and K-Pop lyrics to understand cultural nuances and slang.',
    level: CourseLevel.Beginner,
    image: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=800&q=80',
    duration: '8 Weeks'
  },
  {
    id: '8',
    title: 'Global Leadership English',
    language: 'English',
    description: 'Rhetoric and public speaking for C-Suite executives. AI speech pattern analysis included.',
    level: CourseLevel.Advanced,
    image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
    duration: '12 Weeks'
  }
];

const COURSES_CATEGORIES = ['All', 'English', 'Mandarin', 'French', 'German', 'Spanish', 'Japanese', 'Korean'];

const CoursesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = ALL_COURSES.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.language === selectedCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto relative">
      {/* Header */}
      <div className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
          <Zap size={12} className="text-yellow-400" />
          <span className="text-xs font-mono text-slate-300">ACADEMIC MODULES V2.5</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-4">
          Course Catalogue
        </h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Browse our full library of neural-enhanced language modules. Select a program to initiate data transfer.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 glass-panel p-6 rounded-xl">
        
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {COURSES_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category 
                  ? 'bg-brand-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search modules..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div key={course.id} className="group flex flex-col bg-slate-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:-translate-y-1">
              
              {/* Image Header */}
              <div className="h-48 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10 opacity-80" />
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 z-20">
                   <span className="bg-black/60 backdrop-blur border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                      {course.language}
                   </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className={`flex items-center gap-1 font-bold ${
                    course.level === CourseLevel.Business ? 'text-purple-400' :
                    course.level === CourseLevel.Advanced ? 'text-red-400' :
                    course.level === CourseLevel.Intermediate ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    <BarChart size={14} />
                    {course.level}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500 font-mono">
                    <Clock size={14} />
                    {course.duration}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-slate-400 text-sm mb-6 line-clamp-2 flex-1">
                  {course.description}
                </p>

                <button className="w-full py-3 mt-auto bg-white/5 hover:bg-brand-primary hover:text-white border border-white/10 hover:border-brand-primary rounded-lg text-slate-300 font-medium transition-all flex items-center justify-center gap-2 group/btn">
                  <span>Initialize Module</span>
                  <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
            <div className="inline-block p-4 rounded-full bg-slate-800/50 mb-4">
              <Filter size={32} className="text-slate-600" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No modules found</h3>
            <p className="text-slate-500">Try adjusting your search criteria or neural filter parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
