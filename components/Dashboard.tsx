
import React, { useState } from 'react';
import { View, GenerationResult, User } from '../types';

interface DashboardProps {
  onNavigate: (view: View) => void;
  recentGenerations: GenerationResult[];
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate, recentGenerations, user }) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      {/* Top Status & Credits Bar */}
      <div className="flex flex-wrap gap-4 items-center justify-between glass p-4 rounded-[2.5rem] border-white/5 shadow-xl">
        <div className="flex items-center gap-8 px-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Compute Node: Healthy</span>
          </div>
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-950 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-500">
                  <i className="fa-solid fa-user"></i>
                </div>
              ))}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3.1k Active Creators</span>
          </div>
        </div>
        <div className="flex items-center gap-6 bg-slate-950/50 px-6 py-2 rounded-full border border-white/5">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Weekly Limit</span>
              <span className="text-xs font-black text-white">{user.credits} / 15 Credits</span>
           </div>
           <div className="flex gap-1.5 h-4 items-center">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`w-1.5 h-3 rounded-full ${i < user.credits ? 'bg-orange-500 shadow-[0_0_5px_rgba(249,115,22,0.5)]' : 'bg-slate-800'}`}></div>
              ))}
           </div>
        </div>
      </div>

      {/* Hero: Studio Hub Launcher */}
      <section className="relative overflow-hidden rounded-[4.5rem] p-12 lg:p-20 bg-gradient-to-br from-slate-900 via-slate-950 to-black border border-white/5 shadow-2xl group">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent pointer-events-none blur-3xl group-hover:from-orange-500/15 transition-all duration-1000"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-blue-600/5 blur-[160px] rounded-full pointer-events-none animate-pulse-soft"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-6">
              <div className="inline-flex px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-orange-950/20">
                PRO-GPU CLUSTER ACTIVE
              </div>
              <h2 className="text-6xl lg:text-9xl font-black leading-[0.85] tracking-tighter">
                Write <span className="gradient-text">Viral</span> <br />
                Bharat Stories.
              </h2>
              <p className="text-xl text-slate-400 leading-relaxed font-medium max-w-lg">
                The high-performance AI foundry for Indian creators. Multi-scene cinematic 9:16 reels, rendered in 48s.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-5">
              <button
                onClick={() => onNavigate(View.STUDIO)}
                className="bg-orange-500 hover:bg-orange-600 px-12 py-7 rounded-[2.5rem] font-black text-xl flex items-center gap-4 transition-all active:scale-95 shadow-3xl shadow-orange-900/40 btn-glow"
              >
                Launch Studio Hub
                <i className="fa-solid fa-clapperboard"></i>
              </button>
              <button
                onClick={() => onNavigate(View.TEMPLATES)}
                className="bg-slate-900 hover:bg-slate-800 px-10 py-7 rounded-[2.5rem] font-black text-xl flex items-center gap-4 transition-all active:scale-95 border border-slate-800 shadow-xl"
              >
                Prompt Library
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 glass p-10 rounded-[3.5rem] space-y-8 relative shadow-3xl border-white/10">
            <div className="flex justify-between items-center">
              <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500">Quick Prompt Entry</h3>
              <div className="flex gap-2">
                 <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                 <span className="w-1.5 h-1.5 bg-slate-700 rounded-full"></span>
              </div>
            </div>
            <textarea 
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. 'Mumbai Rain, Cyberpunk Vibe, Woman walking with Umbrella, Slow-motion...'"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-3xl p-6 text-base font-medium outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500/30 transition-all h-40 no-scrollbar resize-none leading-relaxed shadow-inner"
            />
            <div className="flex flex-wrap gap-2">
               {['#MumbaiRain', '#FounderStory', '#Holi2025'].map(tag => (
                 <button key={tag} onClick={() => setQuickPrompt(tag.slice(1) + ' style prompt...')} className="text-[9px] font-black uppercase text-slate-600 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 hover:text-orange-500 hover:border-orange-500/30 transition-all">
                   {tag}
                 </button>
               ))}
            </div>
            <button 
              onClick={() => { if (quickPrompt) onNavigate(View.STUDIO); }}
              className="w-full py-6 bg-gradient-to-r from-orange-600 to-orange-400 rounded-3xl font-black text-xs uppercase tracking-[0.3em] text-white transition-all shadow-2xl active:scale-[0.98] flex items-center justify-center gap-3"
            >
              <i className="fa-solid fa-bolt"></i>
              Instant Synthesis
            </button>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
         {/* Trending Styles - Visual Carousel */}
         <section className="lg:col-span-2 space-y-10">
            <div className="flex justify-between items-end px-4">
              <div>
                <h3 className="text-3xl font-black mb-1">Trending <span className="text-orange-500">Aesthetics</span></h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Viral Style Injections</p>
              </div>
              <button onClick={() => onNavigate(View.TEMPLATES)} className="text-[11px] font-black text-orange-400 hover:text-orange-300 uppercase tracking-widest transition-colors flex items-center gap-2">
                Browse All <i className="fa-solid fa-arrow-right-long"></i>
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               {[
                 { title: 'Cyber-Mumbai', img: 'https://images.unsplash.com/photo-1570160897040-30430ade2270?q=80&w=400&h=600&fit=crop', tag: 'Neon/Urban' },
                 { title: 'Kerala Vedic', img: 'https://images.unsplash.com/photo-1545127398-14699f999348?q=80&w=400&h=600&fit=crop', tag: 'Ethereal/Nature' }
               ].map((style, i) => (
                 <div key={i} className="group relative aspect-[9/14] rounded-[3.5rem] overflow-hidden border border-white/5 cursor-pointer shadow-2xl transition-all hover:scale-[1.02]">
                    <img src={style.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    <div className="absolute bottom-10 left-10 right-10">
                       <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-2 block">{style.tag}</span>
                       <h4 className="text-3xl font-black text-white">{style.title}</h4>
                    </div>
                    <div className="absolute inset-0 bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                       <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                          <i className="fa-solid fa-wand-sparkles text-2xl"></i>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </section>

         {/* Right Sidebar: Quick stats & Challenges */}
         <section className="space-y-12">
            <div className="glass p-10 rounded-[3.5rem] border-white/5 space-y-8 shadow-2xl">
              <h3 className="text-xl font-black">Weekly <span className="text-orange-500">Quest</span></h3>
              <div className="p-7 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10 space-y-5">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Global Event</span>
                    <span className="text-[9px] font-bold text-slate-500 bg-slate-900 px-3 py-1 rounded-full">Ends in 2d</span>
                 </div>
                 <h4 className="font-black text-xl">#IndiaRising2025</h4>
                 <p className="text-xs text-slate-400 font-medium leading-relaxed">Create a cinematic montage of futuristic Indian cities using the Cyberpunk template.</p>
                 <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                       {[1, 2, 3, 4].map(i => <div key={i} className="w-7 h-7 rounded-full bg-slate-800 border-2 border-slate-950 flex items-center justify-center text-[8px] font-black text-slate-600"><i className="fa-solid fa-user"></i></div>)}
                    </div>
                    <span className="text-[9px] font-bold text-slate-500 ml-2 uppercase tracking-widest">+1.4k Participating</span>
                 </div>
                 <button onClick={() => onNavigate(View.STUDIO)} className="w-full py-5 bg-orange-500 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] text-white shadow-xl shadow-orange-900/40 hover:bg-orange-600 active:scale-95 transition-all">Enter Global Quest</button>
              </div>
            </div>

            <div className="space-y-6">
               <h3 className="text-xl font-black px-4">Production <span className="text-orange-500">Nodes</span></h3>
               <div className="grid grid-cols-1 gap-5">
                  {[
                    { label: 'Cluster Latency', val: '38ms', icon: 'fa-bolt-lightning', color: 'text-orange-500' },
                    { label: 'GPU Utilization', val: '84%', icon: 'fa-microchip', color: 'text-blue-500' },
                    { label: 'Success Rate', val: '99.9%', icon: 'fa-shield-halved', color: 'text-emerald-500' }
                  ].map((s, i) => (
                    <div key={i} className="glass p-7 rounded-[2.5rem] border-white/5 flex items-center gap-6 hover:bg-slate-900/50 transition-all cursor-pointer">
                       <div className={`w-14 h-14 rounded-2xl bg-slate-950 border border-white/5 flex items-center justify-center ${s.color} shadow-xl`}>
                          <i className={`fa-solid ${s.icon} text-xl`}></i>
                       </div>
                       <div>
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className="text-xl font-black text-white">{s.val}</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </section>
      </div>
    </div>
  );
};

export default Dashboard;
