
import React from 'react';

const Settings: React.FC = () => {
  return (
    <div className="max-w-4xl animate-fadeIn space-y-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-black">App <span className="text-orange-500">Settings</span></h2>
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest mt-1">Configure your creative environment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-gear text-orange-500"></i>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">General Configuration</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-black text-slate-200">Auto-Save Creations</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Automatically store all outputs in the Vault</p>
              </div>
              <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-black text-slate-200">High-Resolution Previews</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Enable 1080p previews (Uses more bandwidth)</p>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full relative cursor-pointer border border-slate-700">
                <div className="absolute left-1 top-1 w-4 h-4 bg-slate-600 rounded-full"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <div>
                <p className="text-sm font-black text-slate-200">Language Detection</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Detect Hinglish/Regional context in prompts</p>
              </div>
              <div className="w-12 h-6 bg-orange-500 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass p-8 rounded-[2.5rem] border border-slate-800 space-y-8">
          <div className="flex items-center gap-3">
            <i className="fa-solid fa-shield-halved text-orange-500"></i>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-300">Security & Privacy</h3>
          </div>
          <div className="space-y-4">
             <button className="w-full flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="text-sm font-black text-slate-200">Change Password</span>
                <i className="fa-solid fa-chevron-right text-slate-700"></i>
             </button>
             <button className="w-full flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
                <span className="text-sm font-black text-slate-200">Two-Factor Authentication</span>
                <span className="text-[8px] font-black uppercase px-2 py-0.5 bg-slate-800 text-slate-500 rounded border border-slate-700">Disabled</span>
             </button>
             <button className="w-full flex justify-between items-center p-4 bg-slate-900/50 rounded-2xl border border-red-900/20 hover:bg-red-900/10 transition-colors group">
                <span className="text-sm font-black text-red-500">Delete Account</span>
                <i className="fa-solid fa-trash-can text-red-900/50 group-hover:text-red-500 transition-colors"></i>
             </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
