import React from 'react';
import { Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer id="about-us" className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-2xl font-display font-bold text-white mb-4">inlingua</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Pioneering language acquisition since 1972. Reimagined for the singularity era in 2025. Singapore's premier AI-enhanced language institute.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-slate-400 hover:text-brand-primary transition-colors"><Linkedin size={20} /></a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Academy</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-brand-accent transition-colors">About our AI</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Course Catalogue</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Corporate Solutions</a></li>
              <li><a href="#" className="hover:text-brand-accent transition-colors">Placement Test</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="text-white font-bold mb-6">Coordinates</h4>
             <ul className="space-y-4 text-sm text-slate-400">
               <li className="flex items-start gap-3">
                 <MapPin size={18} className="text-brand-primary shrink-0" />
                 <span>51 Cuppage Road, #10-12<br />Singapore 229469</span>
               </li>
               <li className="flex items-center gap-3">
                 <Phone size={18} className="text-brand-primary shrink-0" />
                 <span>+65 6737 6666</span>
               </li>
               <li className="flex items-center gap-3">
                 <Mail size={18} className="text-brand-primary shrink-0" />
                 <span>info@inlingua.edu.sg</span>
               </li>
             </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-6">Uplink</h4>
            <p className="text-slate-500 text-xs mb-4">Subscribe for updates on new language models.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter email" 
                className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-brand-primary w-full"
              />
              <button className="bg-brand-primary hover:bg-brand-glow text-white px-4 py-2 rounded-r-lg font-bold text-sm transition-colors">
                Join
              </button>
            </div>
          </div>

        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-600">
          <p>© 1972 - 2025 inlingua School of Languages. CPE Reg No: 197201555Z.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-slate-400">Privacy Protocol</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;