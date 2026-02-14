
import React from 'react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8 overflow-hidden relative">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-orange-600/10 blur-[150px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse delay-700"></div>

      <div className="relative z-10 max-w-5xl space-y-16">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 animate-fadeIn">
            <span className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping"></span>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-orange-500">India's Leading AI Creative Studio</span>
          </div>
          
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.9] animate-slideUp">
            CINEMATIC <br />
            <span className="gradient-text">BHARAT</span> AI
          </h1>
          
          <p className="text-xl md:text-3xl text-slate-400 font-medium max-w-3xl mx-auto leading-relaxed animate-slideUp delay-100">
            One click to generate stunning 9:16 vertical reels, photorealistic scenes, and local voiceovers.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 animate-slideUp delay-200">
          <button
            onClick={onGetStarted}
            className="group relative bg-orange-500 hover:bg-orange-600 px-14 py-7 rounded-[2rem] font-black text-2xl transition-all shadow-2xl shadow-orange-900/60 active:scale-95 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              Launch Creator Studio
              <i className="fa-solid fa-arrow-right group-hover:translate-x-3 transition-transform"></i>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          
          <div className="flex flex-col items-start gap-1">
             <div className="flex items-center gap-3 text-white font-black text-lg uppercase tracking-widest">
                <span>₹99 / Week</span>
             </div>
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Cancel anytime • 4K Quality</p>
          </div>
        </div>

        {/* Cinematic Mockup Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 animate-fadeIn delay-300">
          {[
            { label: 'Vertical Video', val: '9:16' },
            { label: 'Resolution', val: '4K+' },
            { label: 'Voice Acting', val: 'Native' },
            { label: 'Prompt Engine', val: 'Hinglish' }
          ].map((item, i) => (
            <div key={i} className="glass p-6 rounded-[2rem] border border-slate-800/50 space-y-2">
              <p className="text-2xl font-black text-white">{item.val}</p>
              <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="pt-20 space-y-6 animate-fadeIn delay-400">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] opacity-50">High-Performance Multimodal Stack</p>
          <div className="flex justify-center gap-16 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
            <i className="fa-solid fa-bolt text-4xl"></i>
            <i className="fa-solid fa-layer-group text-4xl"></i>
            <i className="fa-solid fa-code text-4xl"></i>
            <i className="fa-solid fa-wand-sparkles text-4xl"></i>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-slideUp { animation: slideUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fadeIn { animation: fadeIn 1.2s ease-out forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
};

export default LandingPage;
