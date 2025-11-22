import React from 'react';
import { SimulationType } from '../types';

interface SimulationCardProps {
  title: string;
  description: string;
  image: string;
  type: SimulationType;
  isNew?: boolean;
  onClick: (type: SimulationType) => void;
}

const SimulationCard: React.FC<SimulationCardProps> = ({ title, description, image, type, isNew, onClick }) => {
  return (
    <div 
      onClick={() => onClick(type)}
      className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-200 group flex flex-col relative h-full"
    >
      {/* New Ribbon */}
      {isNew && (
        <div className="absolute top-0 right-0 z-10 overflow-hidden w-24 h-24 pointer-events-none">
          <div className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold px-8 py-1 transform rotate-45 translate-x-[28px] translate-y-[16px] shadow-md">
            NEW!
          </div>
        </div>
      )}
      
      {/* Thumbnail Image */}
      <div className="relative aspect-[5/3] overflow-hidden bg-gray-100 border-b border-gray-100">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
           <div className="bg-white/90 rounded-full p-4 shadow-lg transform scale-75 group-hover:scale-100 transition-all duration-300 backdrop-blur-sm">
              <svg className="w-8 h-8 text-brand-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
           </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-brand-600 transition-colors leading-tight">
          {title}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>
      
      {/* Bottom Interaction Hint */}
      <div className="px-5 pb-5 mt-auto flex items-center justify-between border-t border-gray-50 pt-3">
         <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider">Simulation</span>
         <div className="w-6 h-6 rounded-full bg-brand-50 flex items-center justify-center group-hover:bg-brand-600 transition-colors duration-300">
            <svg className="w-3 h-3 text-brand-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
         </div>
      </div>
    </div>
  );
};

export default SimulationCard;