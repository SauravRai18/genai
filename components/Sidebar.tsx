
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'HUB', icon: 'fa-house' },
    { id: View.STUDIO, label: 'Studio', icon: 'fa-clapperboard' },
    { id: View.LIVE, label: 'Brainstorm', icon: 'fa-comment-dots' },
    { id: View.TEMPLATES, label: 'Presets', icon: 'fa-layer-group' },
    { id: View.HISTORY, label: 'Vault', icon: 'fa-clock-rotate-left' },
  ];

  const adminItems = [
    { id: View.PROFILE, label: 'Profile', icon: 'fa-user' },
    { id: View.ANALYTICS, label: 'Insights', icon: 'fa-chart-line' },
    { id: View.SETTINGS, label: 'Config', icon: 'fa-sliders' },
  ];

  return (
    <aside className="w-80 glass border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0 z-50 overflow-hidden">
      <div className="p-10 flex-1 space-y-16">
        <div className="space-y-6">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-10 ml-6">Creator Base</p>
          <nav className="space-y-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all font-black text-sm uppercase tracking-widest group ${
                  currentView === item.id
                    ? 'bg-orange-500 text-white shadow-2xl shadow-orange-900/40 scale-[1.05]'
                    : 'hover:bg-slate-900/80 text-slate-500 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-lg group-hover:scale-110 transition-transform`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em] mb-10 ml-6">Terminal</p>
          <nav className="space-y-4">
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-5 px-8 py-5 rounded-[2rem] transition-all font-black text-sm uppercase tracking-widest group ${
                  currentView === item.id
                    ? 'bg-slate-900 text-orange-500 border border-orange-500/20 shadow-xl'
                    : 'hover:bg-slate-900/80 text-slate-500 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-6 text-lg group-hover:scale-110 transition-transform`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-10 border-t border-slate-800 bg-slate-950/20">
        <div 
          onClick={() => setView(View.PROFILE)}
          className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[3rem] p-8 border border-slate-800 relative overflow-hidden group cursor-pointer hover:border-orange-500/40 transition-all shadow-3xl"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-orange-500"></div>
          <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-[0.4em] font-black">Plan: Founder Pro</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-3xl font-black text-white">₹99<span className="text-sm text-slate-600 font-normal">/wk</span></p>
              <div className="flex items-center gap-2.5 mt-2">
                 <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                 <p className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">GPU Priority</p>
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-600 group-hover:text-orange-500 group-hover:bg-slate-700 transition-all shadow-2xl">
              <i className="fa-solid fa-chevron-right text-lg"></i>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
