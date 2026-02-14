
import React from 'react';

interface ProfileProps {
  isSubscribed: boolean;
}

const Profile: React.FC<ProfileProps> = ({ isSubscribed }) => {
  return (
    <div className="space-y-12 max-w-4xl animate-fadeIn">
      <header className="flex flex-col md:flex-row items-center gap-8 bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none"></div>
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-4xl font-black text-white shadow-2xl ring-8 ring-slate-950/50">
            BA
          </div>
          <button className="absolute bottom-0 right-0 w-10 h-10 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center hover:bg-slate-700 transition-colors">
            <i className="fa-solid fa-camera text-sm text-slate-400"></i>
          </button>
        </div>
        <div className="text-center md:text-left flex-1">
          <h2 className="text-3xl font-black mb-2">Bharat <span className="text-orange-500">Creator</span></h2>
          <p className="text-slate-400 font-medium mb-4">creator@bharat.ai • Premium Studio Member</p>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
              {isSubscribed ? 'Startup Pro' : 'Free Member'}
            </span>
            <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Elite Verified</span>
          </div>
        </div>
        <button className="px-8 py-3 bg-white text-black font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors shadow-xl">Edit Profile</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="glass p-8 rounded-[2rem] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-clapperboard text-orange-500"></i>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-200">Creative Prefs</h3>
          </div>
          <div className="space-y-4">
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-200 uppercase">Default Accent</p>
                  <p className="text-[10px] text-slate-500 font-bold">Indian English (Female)</p>
                </div>
                <button className="text-orange-500 text-[10px] font-black hover:underline">Change</button>
             </div>
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-200 uppercase">Primary City Vibe</p>
                  <p className="text-[10px] text-slate-500 font-bold">Mumbai / Bangalore</p>
                </div>
                <button className="text-orange-500 text-[10px] font-black hover:underline">Change</button>
             </div>
             <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800 flex justify-between items-center">
                <div>
                  <p className="text-xs font-black text-slate-200 uppercase">Aspect Ratio</p>
                  <p className="text-[10px] text-slate-500 font-bold">9:16 Vertical</p>
                </div>
                <button className="text-orange-500 text-[10px] font-black hover:underline">Locked</button>
             </div>
          </div>
        </section>

        <section className="glass p-8 rounded-[2rem] border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-credit-card text-orange-500"></i>
            <h3 className="text-lg font-black uppercase tracking-widest text-slate-200">Billing</h3>
          </div>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-400">Weekly Cycle</span>
              <span className="text-sm font-black text-white">{isSubscribed ? '₹99/week' : 'None'}</span>
            </div>
            {isSubscribed && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-400">Renews On</span>
                <span className="text-sm font-black text-white">May 24, 2024</span>
              </div>
            )}
            <div className="pt-4 border-t border-slate-800 flex flex-col gap-3">
              <button className="w-full py-3 bg-orange-500 text-white font-black rounded-xl text-[10px] uppercase tracking-widest shadow-lg shadow-orange-900/20">
                Manage Subscription
              </button>
            </div>
          </div>
        </section>
      </div>

      <section className="glass p-8 rounded-[2rem] border border-slate-800">
        <h3 className="text-lg font-black uppercase tracking-widest text-slate-200 mb-8">Production History</h3>
        <div className="space-y-4">
          {isSubscribed ? [1, 2, 3].map(i => (
            <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center border border-slate-800">
                  <i className="fa-solid fa-video text-slate-600"></i>
                </div>
                <div>
                  <p className="text-sm font-black text-slate-200">9:16 Video Synthesis</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">May {17 - i}, 2024 • Completed</p>
                </div>
              </div>
              <p className="text-sm font-black text-orange-500">Ready</p>
            </div>
          )) : (
            <p className="text-center py-10 text-slate-500 font-bold italic">No render history found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
