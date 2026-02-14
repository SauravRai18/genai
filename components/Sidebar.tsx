
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Studio HUB', icon: 'fa-house' },
    { id: View.STUDIO, label: 'Production', icon: 'fa-clapperboard' },
    { id: View.LIVE, label: 'Brainstorm', icon: 'fa-comment-dots' },
    { id: View.TEMPLATES, label: 'Master Presets', icon: 'fa-layer-group' },
    { id: View.HISTORY, label: 'The Vault', icon: 'fa-box-archive' },
  ];

  const adminItems = [
    { id: View.PROFILE, label: 'Profile', icon: 'fa-user' },
    { id: View.ANALYTICS, label: 'Node Metrics', icon: 'fa-chart-line' },
    { id: View.SETTINGS, label: 'System Prefs', icon: 'fa-sliders' },
  ];

  return (
    <aside className="w-72 glass border-r border-slate-800 hidden md:flex flex-col h-screen sticky top-0 z-50">
      <div className="p-8 flex-1 flex flex-col gap-12 overflow-y-auto no-scrollbar">
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-6 ml-4">Creative Base</p>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest group ${
                  currentView === item.id
                    ? 'bg-orange-500 text-white shadow-2xl shadow-orange-900/40 scale-[1.03]'
                    : 'hover:bg-slate-900 text-slate-500 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-base group-hover:scale-110 transition-transform`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-6 ml-4">Terminal</p>
          <nav className="space-y-2">
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black text-sm uppercase tracking-widest group ${
                  currentView === item.id
                    ? 'bg-slate-900 text-orange-500 border border-orange-500/30'
                    : 'hover:bg-slate-900 text-slate-500 hover:text-slate-200'
                }`}
              >
                <i className={`fa-solid ${item.icon} w-5 text-base group-hover:scale-110 transition-transform`}></i>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="p-8 border-t border-slate-800 bg-slate-950/30">
        <div 
          onClick={() => setView(View.PROFILE)}
          className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] p-7 border border-slate-800 relative overflow-hidden group cursor-pointer hover:border-orange-500/40 transition-all shadow-3xl"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500"></div>
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Active Plan</p>
                <i className="fa-solid fa-bolt-lightning text-orange-500 text-[10px] animate-pulse"></i>
             </div>
             <div>
                <p className="text-2xl font-black text-white">Founder <span className="text-orange-500">Pro</span></p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">₹99/week • Priority GPU</p>
             </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
