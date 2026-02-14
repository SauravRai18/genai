
import React, { useState } from 'react';
import { User, Job, Template } from '../types';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'jobs' | 'templates'>('jobs');
  
  // Mock Admin Data
  const mockUsers: User[] = [
    { id: 'u1', name: 'Aarav Sharma', email: 'aarav@gmail.com', credits: 12, plan: 'WEEKLY', isLoggedIn: true },
    { id: 'u2', name: 'Ishani Roy', email: 'ishani@startup.in', credits: 4, plan: 'PRO', isLoggedIn: true },
    { id: 'u3', name: 'Vikram Singh', email: 'vikram@creator.co', credits: 0, plan: 'FREE', isLoggedIn: false }
  ];

  const mockJobs: Job[] = [
    { id: 'JOB-9821', userId: 'u1', status: 'completed', type: 'VIDEO', timestamp: Date.now() - 120000, prompt: 'Mumbai Cyberpunk Street...' },
    { id: 'JOB-9822', userId: 'u2', status: 'processing', type: 'ALL', timestamp: Date.now() - 30000, prompt: 'Kerala Tea Plantation...' },
    { id: 'JOB-9823', userId: 'u1', status: 'failed', type: 'IMAGE', timestamp: Date.now() - 500000, prompt: 'Delhi Morning Coffee...' }
  ];

  return (
    <div className="space-y-10 animate-fadeIn pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
        <div>
          <h2 className="text-4xl font-black mb-2">Admin <span className="text-orange-500">Mainframe</span></h2>
          <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em]">System Administrator Level 07</p>
        </div>
        
        <div className="flex bg-slate-900/80 p-2 rounded-[2rem] border border-slate-800 shadow-xl">
           {[
             { id: 'users', label: 'Users' },
             { id: 'jobs', label: 'Jobs' },
             { id: 'templates', label: 'Nodes' }
           ].map(tab => (
             <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-3 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
             >
               {tab.label}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 px-2">
        {activeTab === 'jobs' && (
          <div className="glass rounded-[3.5rem] overflow-hidden border border-white/5 shadow-2xl">
             <div className="p-8 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Production Stream</h3>
                <span className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black rounded-xl uppercase tracking-widest animate-pulse">Live Telemetry</span>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead>
                      <tr className="border-b border-slate-800 text-[10px] font-black uppercase text-slate-600 tracking-widest">
                         <th className="px-10 py-6">Job ID</th>
                         <th className="px-10 py-6">User</th>
                         <th className="px-10 py-6">Target</th>
                         <th className="px-10 py-6">Status</th>
                         <th className="px-10 py-6 text-right">Action</th>
                      </tr>
                   </thead>
                   <tbody className="text-xs font-medium text-slate-400">
                      {mockJobs.map(job => (
                        <tr key={job.id} className="border-b border-slate-800/50 hover:bg-white/5 transition-colors group">
                           <td className="px-10 py-6 font-black text-white">{job.id}</td>
                           <td className="px-10 py-6">{job.userId}</td>
                           <td className="px-10 py-6">
                              <span className="px-3 py-1 bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest">{job.type}</span>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-2">
                                 <span className={`w-2 h-2 rounded-full ${job.status === 'completed' ? 'bg-emerald-500' : job.status === 'processing' ? 'bg-blue-500 animate-pulse' : 'bg-red-500'}`}></span>
                                 <span className="uppercase text-[9px] font-black tracking-widest">{job.status}</span>
                              </div>
                           </td>
                           <td className="px-10 py-6 text-right">
                              <button className="text-[9px] font-black uppercase tracking-widest text-orange-500 hover:underline">Re-Run</button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {mockUsers.map(user => (
               <div key={user.id} className="glass p-8 rounded-[3rem] border border-white/5 hover:border-orange-500/30 transition-all group">
                  <div className="flex justify-between items-start mb-6">
                     <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl font-black text-slate-700 border border-slate-800 group-hover:border-orange-500/50 group-hover:text-orange-500 transition-all">
                        {user.name.charAt(0)}
                     </div>
                     <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${user.plan === 'PRO' ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-orange-500/10 border-orange-500/20 text-orange-500'}`}>
                        {user.plan}
                     </span>
                  </div>
                  <h4 className="text-xl font-black text-white mb-1">{user.name}</h4>
                  <p className="text-xs text-slate-500 font-bold mb-6">{user.email}</p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800">
                     <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Credits</p>
                        <p className="text-lg font-black text-white">{user.credits}</p>
                     </div>
                     <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-black text-emerald-500 uppercase">Verified</p>
                     </div>
                  </div>
               </div>
             ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="flex flex-col items-center justify-center py-20 glass rounded-[4rem] border-dashed border-2 border-slate-800">
             <i className="fa-solid fa-layer-group text-6xl text-slate-800 mb-6"></i>
             <p className="text-slate-600 font-black uppercase tracking-[0.5em] text-sm">Cluster Config Encrypted</p>
             <button className="mt-8 px-10 py-4 bg-slate-900 border border-slate-800 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:border-orange-500 transition-all">Decryption Auth Required</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
