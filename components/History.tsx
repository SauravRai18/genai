
import React, { useState } from 'react';
import { GenerationResult } from '../types';

interface HistoryProps {
  items: GenerationResult[];
  toggleFavorite: (id: string) => void;
  onItemsChange: (items: GenerationResult[]) => void;
}

const History: React.FC<HistoryProps> = ({ items, toggleFavorite, onItemsChange }) => {
  const [filter, setFilter] = useState<'ALL' | 'FAVORITES'>('ALL');

  const deleteItem = (id: string) => {
    if (window.confirm("Purge this production from the vault?")) {
      onItemsChange(items.filter(item => item.id !== id));
    }
  };

  const filteredItems = filter === 'ALL' ? items : items.filter(item => item.isFavorite);

  return (
    <div className="space-y-10 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-4">
        <div className="space-y-2">
          <h2 className="text-5xl font-black tracking-tighter">The <span className="text-orange-500">Vault</span></h2>
          <p className="text-slate-500 font-black uppercase text-[11px] tracking-[0.4em]">Cinematic Production Archives</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-2 rounded-[2rem] border border-slate-800 shadow-inner">
           <button 
            onClick={() => setFilter('ALL')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'ALL' ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
           >
             All Logs
           </button>
           <button 
            onClick={() => setFilter('FAVORITES')}
            className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${filter === 'FAVORITES' ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Starred
           </button>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="glass rounded-[4rem] p-32 text-center border-dashed border-2 border-slate-800 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-900/20 blur-[100px] rounded-full"></div>
          <div className="relative z-10 space-y-8">
            <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-slate-800 mx-auto shadow-2xl">
              <i className={`fa-solid ${filter === 'FAVORITES' ? 'fa-star' : 'fa-box-archive'} text-slate-700 text-4xl`}></i>
            </div>
            <div className="space-y-2">
              <p className="text-slate-500 font-black uppercase tracking-[0.5em] text-sm">
                {filter === 'FAVORITES' ? 'No pinned signals' : 'Vault Initialized'}
              </p>
              <p className="text-xs text-slate-700 font-black uppercase tracking-widest">Begin production in the Studio HUB</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 px-2">
          {filteredItems.map((item) => (
            <div key={item.id} className="glass rounded-[3.5rem] overflow-hidden flex flex-col hover:border-orange-500/50 transition-all group relative shadow-2xl">
              <div className="aspect-[9/16] bg-slate-950 relative overflow-hidden">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-900">
                    <i className="fa-solid fa-microphone text-4xl text-slate-700"></i>
                  </div>
                )}
                
                <div className="absolute top-6 right-6 flex flex-col gap-3 z-20">
                   <button 
                    onClick={() => toggleFavorite(item.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-xl border transition-all shadow-2xl ${item.isFavorite ? 'bg-orange-500 border-orange-400 text-white' : 'bg-black/30 border-white/10 text-white hover:bg-white/20'}`}
                   >
                     <i className={`fa-solid fa-star text-base ${item.isFavorite ? 'animate-pulse' : ''}`}></i>
                   </button>
                   <button 
                    onClick={() => deleteItem(item.id)}
                    className="w-12 h-12 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 text-white hover:bg-red-500/80 hover:border-red-500 transition-all flex items-center justify-center shadow-2xl"
                   >
                     <i className="fa-solid fa-trash text-base"></i>
                   </button>
                </div>

                <div className="absolute top-6 left-6 z-20">
                  <span className="bg-orange-500 text-white text-[10px] px-4 py-1.5 rounded-xl font-black uppercase tracking-widest shadow-2xl border border-orange-400">
                    {item.jobId}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                   <p className="text-[11px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-2">
                      <i className="fa-solid fa-clock"></i> {new Date(item.timestamp).toLocaleDateString()}
                   </p>
                   <p className="text-base font-bold text-white line-clamp-3 italic leading-relaxed">
                     "{item.prompt}"
                   </p>
                </div>
              </div>
              
              <div className="p-8 bg-slate-900/40 border-t border-white/5 flex justify-between items-center group/btn">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Encrypted S3</span>
                 </div>
                 <button className="text-[10px] font-black text-orange-500 uppercase tracking-widest flex items-center gap-3 hover:translate-x-2 transition-transform">
                    View Production <i className="fa-solid fa-arrow-right"></i>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
