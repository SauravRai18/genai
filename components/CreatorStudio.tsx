
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../geminiService';
import { GenerationResult, EngineBreakdown, OutputType, JobStatus, Scene, User } from '../types';

interface CreatorStudioProps {
  onSuccess: (result: GenerationResult) => void;
  hasApiKey: boolean;
  onSelectKey: () => void;
  initialPrompt?: string;
  onPromptUsed?: () => void;
  user: User;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ onSuccess, hasApiKey, onSelectKey, initialPrompt, onPromptUsed, user }) => {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [breakdown, setBreakdown] = useState<EngineBreakdown | null>(null);
  const [outputType, setOutputType] = useState<OutputType>('ALL');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [workerLogs, setWorkerLogs] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [lowResPreview, setLowResPreview] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setWorkerLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (onPromptUsed) onPromptUsed();
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (prompt.length > 5 && !breakdown) {
      const keywords = ['mumbai', 'travel', 'food', 'startup', 'diwali', 'kerala'];
      const matched = keywords.filter(k => prompt.toLowerCase().includes(k));
      if (matched.length > 0) {
        setSuggestions(matched.map(m => `Add more ${m} specific lighting...`));
      } else {
        setSuggestions(['Add sweeping camera drone shot...', 'Focus on human expressions...']);
      }
    } else {
      setSuggestions([]);
    }
  }, [prompt, breakdown]);

  const startEngine = async () => {
    if (!prompt.trim()) return;
    if (!hasApiKey) {
      await onSelectKey();
    }
    setIsGenerating(true);
    addLog(`ENGINE-CORE: Parsing narrative context...`);
    try {
      const result = await gemini.runPromptEngine(prompt);
      setBreakdown(result);
      addLog(`BLUEPRINT: Segmented into ${result.storyboard.length} high-fidelity scenes.`);
    } catch (err) {
      addLog(`FATAL: Blueprint synthesis rejected.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const synthesize = async () => {
    if (!breakdown) return;
    if (user.credits <= 0) {
      alert("Insufficient Credits. Please top up your account.");
      return;
    }

    setIsGenerating(true);
    setJobStatus('synthesizing');
    try {
      addLog(`CREDIT: Deducting production credit...`);
      addLog(`DISPATCH: Initiating high-fidelity render pipeline (9:16)...`);
      setCurrentStep(1);
      const img = await gemini.generateImage(breakdown);
      setLowResPreview(img);
      addLog(`CACHE: Visual keyframes staged in S3.`);
      
      setCurrentStep(2);
      addLog(`AUDIO: Synthesizing ${breakdown.voice.gender} native narration.`);
      const audio = await gemini.generateAudio(breakdown.voice.text, 'pro', breakdown.voice.gender);
      
      setCurrentStep(3);
      addLog(`VIDEO: Stitching scenes via Veo-3.1 engine...`);
      const video = await gemini.generateVideo(breakdown, img);
      
      const finalRes: GenerationResult = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: `PROD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
        prompt,
        imageUrl: img,
        videoUrl: video,
        audioUrl: audio,
        breakdown,
        timestamp: Date.now(),
        status: 'completed',
        outputType
      };
      setCurrentResult(finalRes);
      onSuccess(finalRes);
      addLog(`SUCCESS: Full production delivered to history.`);
    } catch (err) {
      addLog(`FATAL: Production pipeline snapped. Credit not deducted.`);
    } finally {
      setIsGenerating(false);
      setJobStatus(null);
    }
  };

  const addScene = () => {
    if (!breakdown) return;
    const newScene: Scene = {
      id: Math.random().toString(36).substr(2, 5),
      description: "Enter scene description here...",
      camera: "Drone wide angle",
      lighting: "Cinematic golden hour",
      duration: "4s",
      subject: breakdown.subject
    };
    setBreakdown({
      ...breakdown,
      storyboard: [...breakdown.storyboard, newScene]
    });
    setActiveSceneIndex(breakdown.storyboard.length);
    addLog(`STORYBOARD: Added scene #${breakdown.storyboard.length + 1}`);
  };

  const removeScene = (index: number) => {
    if (!breakdown || breakdown.storyboard.length <= 1) return;
    const newStoryboard = [...breakdown.storyboard];
    newStoryboard.splice(index, 1);
    setBreakdown({ ...breakdown, storyboard: newStoryboard });
    setActiveSceneIndex(Math.max(0, index - 1));
    addLog(`STORYBOARD: Removed scene #${index + 1}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-7 space-y-8">
        <div className="glass p-10 rounded-[3rem] border-t-8 border-orange-500 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 blur-[80px] pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-10">
             <div className="flex items-center gap-4">
               <h2 className="text-3xl font-black tracking-tight">Bharat <span className="text-orange-500">Editor</span></h2>
               <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                  <span className="text-[9px] font-black uppercase text-orange-500 tracking-widest">9:16 REEL MODE</span>
               </div>
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></span>
                <span className="text-[9px] font-black uppercase text-slate-500">Node-01 Active</span>
             </div>
          </div>

          {!breakdown ? (
            <div className="space-y-8 animate-fadeIn">
              <div className="relative">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 ml-4">Creative Concept Brief</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your story... (e.g. 'A Bangalore tech founder having coffee at sunrise, zoom to his laptop screen...')"
                  className="w-full h-56 bg-slate-950/60 border border-slate-800 rounded-[2.5rem] p-8 text-xl font-medium outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all no-scrollbar leading-relaxed"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute -bottom-6 left-4 flex gap-2 overflow-x-auto no-scrollbar max-w-full pb-2">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => setPrompt(p => p + ' ' + s)} className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-full text-[10px] font-bold text-orange-500/70 whitespace-nowrap hover:text-orange-500 hover:border-orange-500/30 transition-all">
                        + {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                 <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-4">Synthesis Targets</p>
                    <div className="bg-slate-950 p-2 rounded-[1.8rem] border border-slate-800 flex shadow-inner">
                       {['VIDEO', 'IMAGE', 'ALL'].map(t => (
                         <button key={t} onClick={() => setOutputType(t as OutputType)} className={`flex-1 py-3 rounded-2xl text-[10px] font-black tracking-widest transition-all ${outputType === t ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}>{t}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-4">Production Frame</p>
                    <div className="h-[66px] bg-slate-950 border border-slate-800 rounded-[1.8rem] flex items-center justify-center text-[12px] font-black text-emerald-500 gap-3 shadow-inner">
                       <i className="fa-solid fa-mobile-screen-button"></i> VERTICAL 9:16
                    </div>
                 </div>
              </div>

              <button 
                onClick={startEngine}
                disabled={isGenerating || !prompt}
                className="w-full py-8 rounded-[2.5rem] bg-orange-500 text-white font-black text-2xl shadow-3xl shadow-orange-900/50 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-4 group btn-glow"
              >
                {isGenerating ? <i className="fa-solid fa-dna fa-spin"></i> : <i className="fa-solid fa-wand-sparkles group-hover:rotate-12 transition-transform"></i>}
                {isGenerating ? 'Synthesizing Blueprint...' : 'Generate Storyboard'}
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-fadeIn">
              <div className="space-y-6">
                 <div className="flex justify-between items-center px-4">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Timeline Segmentation</p>
                    <button onClick={addScene} className="text-[11px] font-black text-orange-500 uppercase flex items-center gap-2 hover:bg-orange-500/10 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-orange-500/20">
                      <i className="fa-solid fa-plus text-[10px]"></i> New Scene
                    </button>
                 </div>
                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 px-2">
                    {breakdown.storyboard.map((s, i) => (
                      <div key={i} className="relative group/scene">
                        <button 
                          onClick={() => setActiveSceneIndex(i)}
                          className={`flex-none w-28 py-4 rounded-[1.5rem] border font-black text-[11px] uppercase tracking-widest transition-all ${activeSceneIndex === i ? 'bg-orange-500 border-orange-400 text-white shadow-2xl scale-105' : 'bg-slate-900 border-slate-800 text-slate-600 hover:text-slate-400'}`}
                        >
                          Scene {i+1}
                        </button>
                        {breakdown.storyboard.length > 1 && (
                          <button onClick={() => removeScene(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/scene:opacity-100 transition-opacity border-2 border-slate-950">
                             <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        )}
                      </div>
                    ))}
                 </div>
                 
                 <div className="bg-slate-950/80 p-8 rounded-[3.5rem] border border-slate-800 space-y-6 shadow-inner relative group" key={activeSceneIndex}>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 shadow-xl">
                          <p className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Motion Node</p>
                          <input 
                            value={breakdown.storyboard[activeSceneIndex].camera} 
                            onChange={(e) => {
                               const sb = [...breakdown.storyboard];
                               sb[activeSceneIndex].camera = e.target.value;
                               setBreakdown({...breakdown, storyboard: sb});
                            }}
                            className="text-[11px] font-bold text-slate-200 bg-transparent outline-none w-full border-b border-transparent focus:border-orange-500/50"
                          />
                       </div>
                       <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 shadow-xl">
                          <p className="text-[9px] font-black text-slate-600 uppercase mb-2 tracking-widest">Aesthetic Node</p>
                          <input 
                            value={breakdown.storyboard[activeSceneIndex].lighting} 
                            onChange={(e) => {
                               const sb = [...breakdown.storyboard];
                               sb[activeSceneIndex].lighting = e.target.value;
                               setBreakdown({...breakdown, storyboard: sb});
                            }}
                            className="text-[11px] font-bold text-slate-200 bg-transparent outline-none w-full border-b border-transparent focus:border-orange-500/50"
                          />
                       </div>
                    </div>
                    <textarea 
                      value={breakdown.storyboard[activeSceneIndex].description}
                      onChange={(e) => {
                         const sb = [...breakdown.storyboard];
                         sb[activeSceneIndex].description = e.target.value;
                         setBreakdown({...breakdown, storyboard: sb});
                      }}
                      className="w-full bg-transparent text-lg font-medium text-slate-400 italic leading-relaxed px-2 h-32 no-scrollbar outline-none resize-none focus:text-slate-200 transition-colors"
                    />
                 </div>
              </div>

              <div className="p-7 bg-orange-500/5 rounded-[3rem] border border-orange-500/10 shadow-inner group">
                 <p className="text-[11px] font-black text-orange-500 uppercase mb-3 flex items-center gap-3 tracking-[0.3em]">
                    <i className="fa-solid fa-microphone-lines animate-pulse"></i> Global Narration Script
                 </p>
                 <textarea 
                  value={breakdown.voice.text}
                  onChange={(e) => setBreakdown({...breakdown, voice: {...breakdown.voice, text: e.target.value}})}
                  className="w-full bg-transparent text-sm text-slate-300 italic font-medium leading-relaxed outline-none h-16 no-scrollbar resize-none focus:text-white transition-colors"
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                 <button onClick={() => setBreakdown(null)} className="py-6 bg-slate-900 text-slate-500 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] border border-slate-800 hover:bg-slate-800 hover:text-slate-300 transition-all shadow-xl">Purge Blueprint</button>
                 <button onClick={synthesize} disabled={isGenerating} className="py-6 bg-orange-500 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-3xl shadow-orange-900/40 active:scale-95 transition-all btn-glow">
                    {isGenerating ? 'Rendering...' : `Finalize & Render (1 Credit)`}
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass p-7 rounded-[3rem] h-52 overflow-hidden shadow-inner border border-white/5 relative">
           <div className="flex justify-between items-center mb-6">
              <p className="text-[11px] font-black text-slate-600 uppercase tracking-[0.5em]">Synthesis Logs</p>
              <div className="flex items-center gap-3">
                 <span className="text-[9px] font-black text-emerald-500">Live</span>
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></div>
              </div>
           </div>
           <div className="space-y-2 font-mono text-[10px] no-scrollbar overflow-y-auto h-28 pr-4">
              {workerLogs.map((log, i) => (
                <p key={i} className={i === 0 ? 'text-orange-500 font-bold' : 'text-slate-700'}>{'>'} {log}</p>
              ))}
              {workerLogs.length === 0 && <p className="text-slate-800 italic">Listening for creative signals...</p>}
           </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="relative w-full max-w-[340px] group/device">
           <div className="relative aspect-[9/19.6] bg-slate-950 rounded-[4.5rem] border-[14px] border-slate-900 shadow-[0_120px_240px_-60px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-white/10 group-hover/device:ring-orange-500/20 transition-all duration-700">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-10 bg-slate-900 rounded-b-[2rem] z-30 shadow-inner flex items-center justify-center">
                 <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
              </div>
              
              {!currentResult && !lowResPreview ? (
                <div className="h-full flex flex-col items-center justify-center p-14 text-center text-slate-800 opacity-20">
                   <div className="w-24 h-24 bg-slate-900 rounded-[3rem] flex items-center justify-center border border-white/5 mb-10 shadow-3xl">
                      <i className="fa-solid fa-play text-5xl"></i>
                   </div>
                   <p className="text-[11px] font-black uppercase tracking-[0.6em] leading-relaxed">9:16 Vertical <br />Studio Monitor</p>
                </div>
              ) : (
                <div className="h-full relative animate-fadeIn bg-black">
                   {currentResult?.videoUrl ? (
                     <video src={currentResult.videoUrl} className="h-full w-full object-cover" controls autoPlay loop />
                   ) : lowResPreview ? (
                     <div className="h-full relative">
                        <img src={lowResPreview} className="h-full w-full object-cover animate-pulse blur-xl scale-110" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                           <div className="text-center space-y-6">
                              <div className="w-16 h-16 border-[6px] border-orange-500 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_20px_rgba(249,115,22,0.4)]"></div>
                              <div className="space-y-1">
                                 <p className="text-[12px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Rendering...</p>
                                 <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Vibe Veo-3.1 Active</p>
                              </div>
                           </div>
                        </div>
                     </div>
                   ) : null}
                </div>
              )}
           </div>

           {currentResult && (
             <div className="mt-10 grid grid-cols-2 gap-5 animate-slideUp">
                <a href={currentResult.videoUrl} download className="bg-white text-black py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest text-center flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-100 transition-all active:scale-95">
                   <i className="fa-solid fa-download"></i> Save File
                </a>
                <button onClick={() => {
                   navigator.clipboard.writeText(window.location.href);
                   alert("Production link copied to clipboard!");
                }} className="bg-slate-900 text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest border border-slate-800 flex items-center justify-center gap-3 shadow-2xl hover:bg-slate-800 transition-all active:scale-95">
                   <i className="fa-solid fa-paper-plane"></i> Publish
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CreatorStudio;
