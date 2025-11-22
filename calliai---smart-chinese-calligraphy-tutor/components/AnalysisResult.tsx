import React from 'react';
import { AnalysisResponse, ErrorType, Language } from '../types';
import { getTranslation } from '../translations';
import { Star, AlertTriangle, CheckCircle, Info, MoveRight, ArrowDownUp, Link2, XCircle, Lightbulb, ChevronRight } from 'lucide-react';

interface Props {
  result: AnalysisResponse | null;
  isLoading: boolean;
  hasError: boolean;
  language: Language;
  onStrokeClick?: (index: number | null) => void;
  selectedStroke?: number | null;
}

const ErrorIcon = ({ type }: { type: ErrorType }) => {
  switch (type) {
    case 'DIRECTION': return <ArrowDownUp className="w-5 h-5 text-orange-600" />;
    case 'ORDER': return <MoveRight className="w-5 h-5 text-purple-600" />;
    case 'CONNECTION': return <Link2 className="w-5 h-5 text-blue-600" />;
    case 'SHAPE': return <XCircle className="w-5 h-5 text-red-600" />;
    default: return <AlertTriangle className="w-5 h-5 text-gray-600" />;
  }
};

export const AnalysisResult: React.FC<Props> = ({ result, isLoading, hasError, language, onStrokeClick, selectedStroke }) => {
  const t = getTranslation(language);

  if (hasError) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-8 bg-red-50 rounded-2xl border border-red-100 text-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-red-700 mb-2">{t.errorLoading}</h3>
        <p className="text-red-600">{t.errorDesc}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-8 bg-white rounded-2xl border border-paper-shadow shadow-sm animate-pulse">
        <div className="w-16 h-16 bg-gray-200 rounded-full mb-6"></div>
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="space-y-3 w-full max-w-xs">
          <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-20 bg-gray-100 rounded-xl w-full"></div>
        </div>
        <p className="mt-8 text-gray-500 text-sm font-medium">{t.analyzingBtn}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col justify-center items-center p-8 bg-white rounded-2xl border border-paper-shadow shadow-sm text-center">
        
        {/* Hero Icon for Tips */}
        <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-yellow-100">
           <Lightbulb className="w-8 h-8 text-yellow-600" />
        </div>

        <h3 className="text-xl font-bold text-ink-black mb-2 font-serif">{t.tipsTitle}</h3>
        <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">{t.tipsSubtitle}</p>

        {/* Tips List */}
        <div className="w-full max-w-sm space-y-3 mb-8 text-left">
           {t.tips && t.tips.map((tip: string, i: number) => (
              <div key={i} className="flex items-center p-3 bg-rice-paper rounded-xl border border-paper-shadow transition-transform hover:scale-[1.02]">
                 <span className="w-6 h-6 flex items-center justify-center bg-cinnabar text-white text-xs font-bold rounded-full flex-shrink-0 mr-3 shadow-sm">
                   {i + 1}
                 </span>
                 <span className="font-medium text-gray-700 text-sm md:text-base">{tip}</span>
                 <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" /> 
              </div>
           ))}
        </div>

        {/* CTA / Footer */}
        <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-4 py-2 rounded-full">
           <Info className="w-4 h-4" />
           <span>{t.placeholder}</span>
        </div>
      </div>
    );
  }

  const isGoodScore = result.score >= 8;
  const isPassScore = result.score >= 6;
  
  let scoreColor = 'text-red-500';
  if (isGoodScore) scoreColor = 'text-green-600';
  else if (isPassScore) scoreColor = 'text-orange-500';

  // Filter only errors or significant improvements
  const errors = result.strokeAnalysis.filter(s => !s.isCorrect);
  const perfect = result.strokeAnalysis.every(s => s.isCorrect);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-paper-shadow overflow-hidden animate-fade-in h-full flex flex-col">
      {/* Header Banner */}
      <div className={`p-6 ${perfect ? 'bg-green-50' : 'bg-rice-paper'} border-b border-paper-shadow flex-shrink-0`}>
        <div className="flex justify-between items-start">
          <div>
             <h2 className="text-2xl font-bold font-serif text-ink-black mb-1">{t.analysisTitle}</h2>
             <div className="flex items-center gap-2 flex-wrap">
                {perfect ? (
                  <span className="flex items-center text-green-700 text-sm font-bold bg-green-100 px-2 py-1 rounded">
                    <CheckCircle className="w-4 h-4 mr-1" /> {t.perfectStrokes}
                  </span>
                ) : (
                  <span className="flex items-center text-orange-700 text-sm font-bold bg-orange-100 px-2 py-1 rounded">
                    <AlertTriangle className="w-4 h-4 mr-1" /> {errors.length} {t.issuesFound}
                  </span>
                )}
             </div>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-sm text-gray-500 font-medium uppercase tracking-wider">{t.scoreLabel}</span>
             <span className={`text-4xl font-black ${scoreColor}`}>{result.score}<span className="text-lg text-gray-400 font-normal">/10</span></span>
          </div>
        </div>
        <p className="mt-3 text-gray-600 italic text-sm">"{result.positiveFeedback}"</p>
      </div>

      {/* Scrollable Content */}
      <div className="p-6 overflow-y-auto flex-grow space-y-6">
        
        {/* General Critique */}
        <div>
          <h3 className="font-bold text-gray-800 mb-2">{t.generalAssessment}</h3>
          <p className="text-gray-700 leading-relaxed text-sm">
            {result.critique}
          </p>
        </div>

        {/* Specific Error Breakdown */}
        <div>
           <h3 className="font-bold text-gray-800 mb-3 flex items-center justify-between">
              <span>{t.strokeDetails}</span>
              <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                {errors.length === 0 ? t.allGood : t.actionRequired}
              </span>
           </h3>
           
           {errors.length === 0 ? (
             <div className="p-6 bg-green-50 rounded-xl text-center border border-green-100">
               <Star className="w-8 h-8 text-green-500 mx-auto mb-2" />
               <p className="text-green-800 font-medium">{t.allGoodDesc}</p>
             </div>
           ) : (
             <div className="space-y-3">
               {errors.map((stroke, i) => {
                 const isSelected = selectedStroke === stroke.strokeIndex;
                 return (
                 <div 
                    key={i} 
                    className={`bg-white border p-4 rounded-xl shadow-sm flex gap-4 transition-all cursor-pointer ${isSelected ? 'border-cinnabar ring-1 ring-cinnabar bg-red-50' : 'border-gray-200 hover:border-cinnabar hover:shadow-md'}`}
                    onClick={() => onStrokeClick && onStrokeClick(isSelected ? null : stroke.strokeIndex)}
                 >
                   <div className="flex-shrink-0 flex flex-col items-center gap-1">
                      <span className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center font-bold font-serif">
                        {stroke.strokeIndex}
                      </span>
                      <div className="bg-gray-100 p-1 rounded-md">
                        <ErrorIcon type={stroke.errorType} />
                      </div>
                   </div>
                   <div className="flex-grow">
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded text-white bg-cinnabar uppercase tracking-wide">
                          {t.errorTypes[stroke.errorType] || stroke.errorType}
                        </span>
                     </div>
                     <p className="text-gray-800 font-medium text-sm mb-1">
                       {stroke.explanation}
                     </p>
                     <div className="flex items-start gap-1.5 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg mt-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{stroke.correction}</span>
                     </div>
                   </div>
                 </div>
                 );
               })}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};