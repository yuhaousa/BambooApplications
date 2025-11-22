
import React, { useState, useRef, useEffect } from 'react';
import { Message, SimContextData, SimulationType } from '../types';
import { generateTutorResponse } from '../services/gemini';

interface InlineAITutorProps {
  simContext: SimContextData;
  simulationType: SimulationType;
}

const InlineAITutor: React.FC<InlineAITutorProps> = ({ simContext, simulationType }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: `Hi! I'm your AI lab partner. Ask me anything about ${simContext.name}!`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Reset chat when simulation changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: `Hi! I'm your AI lab partner. Ask me anything about ${simContext.name}!`,
        timestamp: new Date()
      }
    ]);
  }, [simContext.name]);

  // Scroll to bottom on new message or loading state change
  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      if (scrollHeight > clientHeight) {
        chatContainerRef.current.scrollTo({
          top: scrollHeight,
          behavior: 'smooth'
        });
      }
    }
  }, [messages, loading]);

  const handleSend = async (textInput: string = input) => {
    if (!textInput.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: textInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const historyForApi = messages.map(m => ({ role: m.role, text: m.text }));
      historyForApi.push({ role: 'user', text: userMsg.text });

      const responseText = await generateTutorResponse(historyForApi, simContext);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Sorry, I encountered a connection error. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = (type: SimulationType): string[] => {
    switch (type) {
      case SimulationType.DOPPLER:
        return [
          "Explain the Doppler Effect",
          "What happens at Mach 1 (Sonic Boom)?",
          "Why does pitch increase when approaching?",
          "Real world examples?"
        ];
      case SimulationType.SOLAR:
        return [
          "Explain Kepler's Laws",
          "Why are orbits elliptical?",
          "How does gravity affect orbital speed?",
          "What is the orbital period?"
        ];
      case SimulationType.PROJECTILE:
        return [
          "How does launch angle affect range?",
          "What is the effect of gravity?",
          "Explain the trajectory shape"
        ];
      case SimulationType.PENDULUM:
        return [
            "What affects the period?",
            "Explain Potential vs Kinetic energy",
            "How does length change the swing?"
        ];
      case SimulationType.COLLISION:
        return [
            "Conservation of Momentum?",
            "Elastic vs Inelastic collisions",
            "Where did the energy go?"
        ];
      default:
        return [
          "What does this simulation show?",
          "Explain the physics principles",
          "How do the parameters affect the result?"
        ];
    }
  };

  const suggestions = getSuggestions(simulationType);

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden max-w-5xl mx-auto">
      <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
           </div>
           <h3 className="font-bold text-gray-800">AI Experiment Discussion</h3>
        </div>
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Powered by Gemini</span>
      </div>

      <div ref={chatContainerRef} className="h-[400px] overflow-y-auto p-6 space-y-6 bg-white">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
               <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-purple-100 text-purple-600'}`}>
                  {msg.role === 'user' ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                  )}
               </div>
               <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                 msg.role === 'user' 
                   ? 'bg-brand-50 text-brand-900 rounded-tr-none border border-brand-100' 
                   : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
               }`}>
                 {msg.text}
               </div>
            </div>
          </div>
        ))}
        {loading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                 </div>
                 <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                 </div>
              </div>
            </div>
        )}
      </div>

      {/* Suggestions Chips */}
      {!loading && messages.length < 3 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
           {suggestions.map((s, i) => (
             <button 
               key={i}
               onClick={() => handleSend(s)}
               className="text-xs bg-white border border-brand-200 text-brand-700 px-3 py-1.5 rounded-full hover:bg-brand-50 hover:border-brand-300 transition-colors shadow-sm"
             >
               {s}
             </button>
           ))}
        </div>
      )}

      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a question about the experiment results, underlying physics, or specific parameters..."
            className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all shadow-sm"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
        <p className="text-center text-xs text-gray-400 mt-2">AI can make mistakes. Please verify important information.</p>
      </div>
    </div>
  );
};

export default InlineAITutor;
