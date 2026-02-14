
import React from 'react';

const Analytics: React.FC = () => {
  const stats = [
    { label: 'Cloud GPU Health', value: '98.4%', trend: 'Operational', icon: 'fa-microchip', color: 'text-orange-500' },
    { label: 'Job Queue Length', value: '12 Items', trend: 'Low Latency', icon: 'fa-list-ul', color: 'text-blue-500' },
    { label: 'Cluster Scale', value: '14 Nodes', trend: '+2 Scaled', icon: 'fa-server', color: 'text-emerald-500' },
    { label: 'Storage Usage', value: '4.2 TB', trend: 'S3-East-1', icon: 'fa-database', color: 'text-purple-500' },
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black mb-2">System <span className="text-orange-500">Mainframe</span></h2>
          <p className="text-slate-400 font-medium uppercase text-[10px] tracking-[0.3em]">Administrator Level 04 Access</p>
        </div>
        <div className="flex gap-3 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <button className="px-5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300">Live Telemetry</button>
          <button className="px-5 py-2.5 bg-orange-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-900/20">Purge Cache</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="glass p-8 rounded-[3rem] border border-slate-800 relative group overflow-hidden transition-all hover:border-orange-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-orange-500/10 transition-all"></div>
            <div className="w-14 h-14 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <i className={`fa-solid ${stat.icon} ${stat.color} text-xl`}></i>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="space-y-2">
              <h3 className="text-4xl font-black text-white">{stat.value}</h3>
              <p className={`text-[10px] font-black uppercase tracking-widest ${i === 0 || i === 2 ? 'text-emerald-500' : 'text-slate-500'}`}>
                {stat.trend}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 glass p-10 rounded-[4rem] border border-slate-800 h-[32rem] relative flex flex-col">
          <div className="flex justify-between items-center mb-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Node Dispatch Latency (ms)</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-[9px] font-black text-slate-600 uppercase">Image</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="text-[9px] font-black text-slate-600 uppercase">Video</span>
               </div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-3 px-2 pb-6 border-b border-slate-800/30">
            {[65, 80, 50, 95, 75, 110, 85, 95, 60, 120, 70, 90, 105, 80, 115, 65].map((val, i) => (
              <div key={i} className="flex-1 bg-slate-800/20 rounded-t-xl relative group transition-all cursor-pointer">
                <div 
                  style={{ height: `${val}%` }} 
                  className={`w-full rounded-t-xl transition-all shadow-lg group-hover:shadow-current ${i % 3 === 0 ? 'bg-orange-500/80' : 'bg-slate-700/80 group-hover:bg-blue-500'}`}
                ></div>
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-10 scale-90">
                  <span className="bg-white text-black text-[9px] font-black px-2.5 py-1.5 rounded-lg shadow-2xl">{val}ms</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-6 px-4 text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
            <span>NODE-01</span>
            <span>NODE-08</span>
            <span>NODE-16</span>
          </div>
        </div>

        <div className="glass p-10 rounded-[4rem] border border-slate-800 space-y-12 flex flex-col justify-between">
          <div className="space-y-10">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Cluster Resource Load</h3>
            <div className="space-y-10">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Memory Allocation</span>
                  <span className="text-white">78.2 GB</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-orange-500 w-[78%] rounded-full shadow-[0_0_15px_rgba(249,115,22,0.4)]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">GPU Shaders</span>
                  <span className="text-white">42.1k Ops</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-blue-500 w-[42%] rounded-full shadow-[0_0_15px_rgba(59,130,246,0.4)]"></div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                  <span className="text-slate-400">Throughput</span>
                  <span className="text-white">12.5 Gbit</span>
                </div>
                <div className="h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div className="h-full bg-emerald-500 w-[92%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)]"></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-slate-800 flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <i className="fa-solid fa-shield-check"></i>
             </div>
             <div className="flex-1">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">System Audit</p>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest leading-none">Security Verified</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
