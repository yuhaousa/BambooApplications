import React, { useState, useRef } from 'react';
import { DrawingCanvas, CanvasHandle } from './components/DrawingCanvas';
import { AnalysisResult } from './components/AnalysisResult';
import { evaluateHandwriting } from './services/geminiService';
import { AnalysisResponse, AppState, Language } from './types';
import { getTranslation } from './translations';
import { Eraser, RotateCcw, PenTool, CheckCircle2, Loader2, BookOpen, Eye, Globe, PlayCircle } from 'lucide-react';

export default function App() {
  const [targetChar, setTargetChar] = useState<string>('永');
  const [appState, setAppState] = useState<AppState>('idle');
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [showGuide, setShowGuide] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [highlightedStroke, setHighlightedStroke] = useState<number | null>(null);
  
  const canvasRef = useRef<CanvasHandle>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposing = useRef(false);

  const t = getTranslation(language);

  const handleCompositionStart = () => {
    isComposing.current = true;
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    isComposing.current = false;
    const val = e.currentTarget.value;
    handleInputCommit(val);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (isComposing.current) {
      setTargetChar(val);
      return;
    }
    handleInputCommit(val);
  };

  const handleInputCommit = (val: string) => {
    if (!val) {
      setTargetChar('');
      setAnalysis(null);
      setHighlightedStroke(null);
      setAppState('idle');
      canvasRef.current?.clear();
      setShowGuide(true);
      return;
    }

    // Take the last character entered to allow easy replacement
    const char = val.slice(-1);
    
    // Reset if character changed
    if (char !== targetChar || val.length > 1) {
       setTargetChar(char);
       // Only clear results if it's a new valid char
       if (analysis) setAnalysis(null);
       setHighlightedStroke(null);
       setAppState('idle');
       canvasRef.current?.clear();
       setShowGuide(true);
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as Language;
    setLanguage(newLang);
    // Clear analysis to ensure users don't see mixed language states (e.g. English text in Thai UI)
    if (analysis) {
      setAnalysis(null);
      setHighlightedStroke(null);
      setAppState('idle');
    }
  };

  const handleAnalyze = async () => {
    if (!canvasRef.current) return;
    
    if (canvasRef.current.isEmpty()) {
      alert(t.pleaseWrite);
      return;
    }

    setAppState('analyzing');
    setAnalysis(null);
    setHighlightedStroke(null);

    try {
      const imageData = canvasRef.current.getRainbowImage(); 
      const result = await evaluateHandwriting(targetChar, imageData, language);
      setAnalysis(result);
      setAppState('result');
      setShowGuide(false);
    } catch (error) {
      console.error("Analysis failed", error);
      setAppState('error');
    }
  };

  const handleClear = () => {
    canvasRef.current?.clear();
    setAnalysis(null);
    setHighlightedStroke(null);
    setAppState('idle');
    setShowGuide(true);
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
  };

  const handleDemo = () => {
    canvasRef.current?.animateCharacter();
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 font-sans text-ink-black">
      {/* Header */}
      <header className="mb-8 text-center relative w-full max-w-5xl">
        
        {/* Language Selector - Absolute on desktop, relative stacked on mobile */}
        <div className="absolute right-0 top-0 hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-paper-shadow shadow-sm z-20">
          <Globe className="w-4 h-4 text-gray-500" />
          <select 
            value={language} 
            onChange={handleLanguageChange}
            className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer"
          >
            <option value="en">English</option>
            <option value="zh">中文</option>
            <option value="th">ไทย</option>
          </select>
        </div>

        {/* Mobile Language Selector */}
        <div className="md:hidden flex justify-center mb-4">
           <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-paper-shadow shadow-sm">
              <Globe className="w-4 h-4 text-gray-500" />
              <select 
                value={language} 
                onChange={handleLanguageChange}
                className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none"
              >
                <option value="en">English</option>
                <option value="zh">中文</option>
                <option value="th">ไทย</option>
              </select>
           </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink-black mb-2 flex items-center justify-center gap-3">
          <PenTool className="w-8 h-8 text-cinnabar" />
          <span>{t.title}</span>
        </h1>
        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto">
          {t.subtitle}
        </p>
      </header>

      {/* Main Workspace */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Column: Controls & Canvas */}
        <div className="flex flex-col gap-6">
          
          {/* Character Input */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-paper-shadow flex items-center gap-4 justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-gray-400" />
              <span className="font-medium text-gray-700">{t.characterLabel}</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={targetChar}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              onChange={handleInput}
              onFocus={(e) => e.target.select()}
              className="w-24 text-center text-3xl font-serif border-b-2 border-cinnabar focus:outline-none bg-transparent"
              placeholder="字"
            />
          </div>

          {/* Canvas Area */}
          <div className="relative flex flex-col items-center">
            <DrawingCanvas 
              ref={canvasRef} 
              targetChar={targetChar} 
              showGuide={showGuide}
              highlightedStroke={highlightedStroke}
            />
            
            {/* Canvas Toolbar */}
            <div className="mt-4 flex flex-wrap justify-center gap-3 bg-white px-6 py-3 rounded-full shadow-lg border border-paper-shadow">
              <button 
                onClick={handleUndo}
                className="p-2 text-gray-600 hover:text-ink-black hover:bg-gray-100 rounded-full transition-colors"
                title={t.undo}
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 my-auto"></div>
              <button 
                onClick={handleClear}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title={t.clear}
              >
                <Eraser className="w-5 h-5" />
              </button>
              <div className="w-px h-6 bg-gray-200 my-auto"></div>
              
              {/* Demo Button */}
              <button 
                onClick={handleDemo}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100"
                title={t.demo}
              >
                <PlayCircle className="w-4 h-4" />
                {t.demo}
              </button>

              <div className="w-px h-6 bg-gray-200 my-auto"></div>

              <button 
                onClick={() => setShowGuide(!showGuide)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium ${showGuide ? 'text-white bg-cinnabar' : 'text-gray-600 hover:bg-gray-100'}`}
                title={showGuide ? t.tracingOn : t.tracingOff}
              >
                <Eye className="w-4 h-4" />
                {showGuide ? t.tracingOn : t.tracingOff}
              </button>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleAnalyze}
            disabled={appState === 'analyzing' || !targetChar}
            className={`
              w-full py-4 rounded-xl text-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all
              ${appState === 'analyzing' 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98]'}
            `}
          >
            {appState === 'analyzing' ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                {t.analyzingBtn}
              </>
            ) : (
              <>
                <CheckCircle2 className="w-6 h-6" />
                {t.analyzeBtn}
              </>
            )}
          </button>
        </div>

        {/* Right Column: Feedback */}
        <div className="flex flex-col h-[600px] lg:h-[700px]">
          <AnalysisResult 
            result={analysis} 
            isLoading={appState === 'analyzing'} 
            hasError={appState === 'error'}
            language={language}
            onStrokeClick={setHighlightedStroke}
            selectedStroke={highlightedStroke}
          />
        </div>
      </div>
    </div>
  );
}