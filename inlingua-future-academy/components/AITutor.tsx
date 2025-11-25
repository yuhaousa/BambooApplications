import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, RefreshCw, Cpu, MessageSquare } from 'lucide-react';
import { createChatSession, sendMessage } from '../services/gemini';
import { Chat } from '@google/genai';
import { Message, LanguageOption } from '../types';

const LANGUAGES: LanguageOption[] = [
  { code: 'Spanish', name: 'Spanish', flag: '🇪🇸', greeting: 'Hola! Estoy listo para enseñarte.' },
  { code: 'Mandarin', name: 'Mandarin', flag: '🇨🇳', greeting: '你好！我们开始吧。' },
  { code: 'French', name: 'French', flag: '🇫🇷', greeting: 'Bonjour! Prêt à apprendre?' },
  { code: 'German', name: 'German', flag: '🇩🇪', greeting: 'Hallo! Lass uns Deutsch lernen.' },
];

const AITutor: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState<LanguageOption>(LANGUAGES[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize chat when language changes
    chatSessionRef.current = createChatSession(selectedLang.code);
    setMessages([{
      id: 'init',
      role: 'model',
      text: `${selectedLang.greeting} (I am your ${selectedLang.name} tutor. Let's chat!)`,
      timestamp: Date.now()
    }]);
  }, [selectedLang]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessage(chatSessionRef.current, userMsg.text);
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl border border-brand-accent/30 flex flex-col md:flex-row h-[600px]">
      
      {/* Sidebar / Language Selector */}
      <div className="w-full md:w-64 bg-slate-900/80 p-6 border-r border-white/10 flex flex-col">
        <div className="flex items-center gap-2 mb-8 text-brand-accent">
          <Cpu size={24} />
          <span className="font-display font-bold">Neural Core</span>
        </div>
        
        <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-4">Select Protocol</h3>
        <div className="flex flex-col gap-2 overflow-y-auto">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => setSelectedLang(lang)}
              className={`text-left p-3 rounded-lg transition-all flex items-center gap-3 ${selectedLang.code === lang.code ? 'bg-brand-primary/20 border border-brand-primary text-white' : 'hover:bg-white/5 text-slate-400'}`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-medium text-sm">{lang.name}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-white/10">
           <p className="text-[10px] text-slate-500">
             Powered by Google Gemini 2.5 Flash. Real-time latency optimized.
           </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-950/50 relative">
        {/* Chat Header */}
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
          <div>
            <h2 className="text-white font-bold">{selectedLang.name} Immersion</h2>
            <p className="text-xs text-brand-accent flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live Connection
            </p>
          </div>
          <button 
            onClick={() => {
                chatSessionRef.current = createChatSession(selectedLang.code);
                setMessages([{
                    id: Date.now().toString(),
                    role: 'model',
                    text: selectedLang.greeting,
                    timestamp: Date.now()
                }]);
            }}
            className="p-2 hover:bg-white/10 rounded-full text-slate-400 transition-colors"
            title="Reset Session"
          >
            <RefreshCw size={18} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="bg-slate-800/80 p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-2">
                 <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce"></span>
                 <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-100"></span>
                 <span className="w-2 h-2 bg-brand-accent rounded-full animate-bounce delay-200"></span>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/50 border-t border-white/5">
          <div className="relative flex items-center bg-slate-800/50 rounded-xl border border-white/10 focus-within:border-brand-accent/50 transition-colors">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Type in ${selectedLang.name} or English...`}
              className="flex-1 bg-transparent border-none text-white p-4 focus:ring-0 outline-none placeholder:text-slate-500"
            />
            <div className="flex items-center gap-2 pr-2">
               <button className="p-2 text-slate-400 hover:text-white transition-colors">
                  <Mic size={20} />
               </button>
               <button 
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-brand-primary hover:bg-brand-glow text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
               >
                  <Send size={20} />
               </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AITutor;