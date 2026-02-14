
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../geminiService';
import { GenerationResult, EngineBreakdown, OutputType, JobStatus, Scene } from '../types';

interface CreatorStudioProps {
  onSuccess: (result: GenerationResult) => void;
  hasApiKey: boolean;
  onSelectKey: () => void;
  initialPrompt?: string;
  onPromptUsed?: () => void;
}

const CreatorStudio: React.FC<CreatorStudioProps> = ({ onSuccess, hasApiKey, onSelectKey, initialPrompt, onPromptUsed }) => {
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
        setSuggestions(['Try adding camera movement...', 'Mention a subject...']);
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
    addLog(`INITIALIZING: Parsing narrative logic...`);
    try {
      const result = await gemini.runPromptEngine(prompt);
      setBreakdown(result);
      addLog(`BLUEPRINT: Segmented into ${result.storyboard.length} high-fidelity scenes.`);
    } catch (err) {
      addLog(`FATAL: Blueprint engine rejected context.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const synthesize = async () => {
    if (!breakdown) return;
    setIsGenerating(true);
    setJobStatus('synthesizing');
    try {
      addLog(`DISPATCH: Requesting vertical visual stack (9:16)...`);
      setCurrentStep(1);
      const img = await gemini.generateImage(breakdown);
      setLowResPreview(img);
      addLog(`CACHE: Low-res preview available.`);
      
      setCurrentStep(2);
      addLog(`AUDIO: Synthesizing ${breakdown.voice.gender} voiceover track.`);
      const audio = await gemini.generateAudio(breakdown.voice.text, 'pro', breakdown.voice.gender);
      
      setCurrentStep(3);
      addLog(`VIDEO: Interpolating ${breakdown.storyboard.length} scenes via Veo-3.1...`);
      const video = await gemini.generateVideo(breakdown, img);
      
      const finalRes: GenerationResult = {
        id: Math.random().toString(36).substr(2, 9),
        jobId: `JOB-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
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
      addLog(`SUCCESS: Production ready for distribution.`);
    } catch (err) {
      addLog(`FATAL: Production pipeline snapped.`);
    } finally {
      setIsGenerating(false);
      setJobStatus(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
      <div className="lg:col-span-7 space-y-8">
        <div className="glass p-10 rounded-[3rem] border-t-8 border-orange-500 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl"></div>
          
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-3xl font-black tracking-tight">Bharat <span className="text-orange-500">Editor</span></h2>
             <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-[9px] font-black uppercase text-slate-500">Live Synthesis Node</span>
             </div>
          </div>

          {!breakdown ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your story... (e.g. 'A Bangalore tech founder having coffee at sunrise, zoom to his laptop screen...')"
                  className="w-full h-48 bg-slate-950/60 border border-slate-800 rounded-[2rem] p-8 text-xl font-medium outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500/50 transition-all no-scrollbar"
                />
                
                {suggestions.length > 0 && (
                  <div className="absolute -bottom-12 left-2 flex gap-2 overflow-x-auto no-scrollbar max-w-full">
                    {suggestions.map((s, i) => (
                      <button key={i} onClick={() => setPrompt(p => p + ' ' + s)} className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-[9px] font-bold text-orange-500/70 whitespace-nowrap hover:text-orange-500 transition-colors">
                        + {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Format</p>
                    <div className="bg-slate-950 p-2 rounded-2xl border border-slate-800 flex">
                       {['VIDEO', 'IMAGE', 'ALL'].map(t => (
                         <button key={t} onClick={() => setOutputType(t as OutputType)} className={`flex-1 py-2.5 rounded-xl text-[10px] font-black transition-all ${outputType === t ? 'bg-orange-500 text-white shadow-lg' : 'text-slate-500'}`}>{t}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest ml-4">Ratio</p>
                    <div className="h-[58px] bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center text-[11px] font-black text-emerald-500 gap-2">
                       <i className="fa-solid fa-mobile-screen-button"></i> 9:16 VERTICAL
                    </div>
                 </div>
              </div>

              <button 
                onClick={startEngine}
                disabled={isGenerating || !prompt}
                className="w-full py-6 bg-orange-500 text-white rounded-[2rem] font-black text-xl shadow-3xl shadow-orange-900/40 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {isGenerating ? <i className="fa-solid fa-dna fa-spin"></i> : <i className="fa-solid fa-wand-sparkles"></i>}
                {isGenerating ? 'Analyzing...' : 'Generate Storyboard'}
              </button>
            </div>
          ) : (
            <div className="space-y-8 animate-fadeIn">
              <div className="space-y-4">
                 <div className="flex justify-between items-center px-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Multi-Scene Timeline</p>
                    <button className="text-[10px] font-black text-orange-500 uppercase flex items-center gap-1 hover:underline">
                      <i className="fa-solid fa-plus text-[8px]"></i> Add Scene
                    </button>
                 </div>
                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {breakdown.storyboard.map((s, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveSceneIndex(i)}
                        className={`flex-none w-24 py-3 rounded-2xl border font-black text-[10px] uppercase transition-all ${activeSceneIndex === i ? 'bg-orange-500 border-orange-400 text-white shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-600'}`}
                      >
                        Scene {i+1}
                      </button>
                    ))}
                 </div>
                 
                 <div className="bg-slate-950/80 p-6 rounded-[2.5rem] border border-slate-800 space-y-4 shadow-inner" key={activeSceneIndex}>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
                          <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Camera Motion</p>
                          <p className="text-[10px] font-bold text-slate-200">{breakdown.storyboard[activeSceneIndex].camera}</p>
                       </div>
                       <div className="p-3 bg-slate-900/50 rounded-xl border border-white/5">
                          <p className="text-[8px] font-black text-slate-600 uppercase mb-1">Lighting</p>
                          <p className="text-[10px] font-bold text-slate-200">{breakdown.storyboard[activeSceneIndex].lighting}</p>
                       </div>
                    </div>
                    <p className="text-sm font-medium text-slate-400 italic leading-relaxed px-2">"{breakdown.storyboard[activeSceneIndex].description}"</p>
                 </div>
              </div>

              <div className="p-5 bg-orange-500/5 rounded-[2.5rem] border border-orange-500/10">
                 <p className="text-[10px] font-black text-orange-500 uppercase mb-2 flex items-center gap-2">
                    <i className="fa-solid fa-microphone-lines"></i> Dynamic Narration
                 </p>
                 <p className="text-xs text-slate-300 italic font-medium">"{breakdown.voice.text}"</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <button onClick={() => setBreakdown(null)} className="py-4 bg-slate-900 text-slate-500 rounded-3xl font-black text-xs uppercase tracking-widest border border-slate-800 hover:bg-slate-800 transition-all">Re-Draft</button>
                 <button onClick={synthesize} disabled={isGenerating} className="py-4 bg-orange-500 text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    {isGenerating ? 'Rendering...' : 'Launch Production'}
                 </button>
              </div>
            </div>
          )}
        </div>

        <div className="glass p-6 rounded-[2.5rem] h-44 overflow-hidden shadow-inner border border-white/5">
           <div className="flex justify-between items-center mb-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Synthesis Node Logs</p>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
           </div>
           <div className="space-y-1.5 font-mono text-[10px] no-scrollbar overflow-y-auto h-24">
              {workerLogs.map((log, i) => (
                <p key={i} className={i === 0 ? 'text-orange-500 font-bold' : 'text-slate-700'}>{'>'} {log}</p>
              ))}
              {workerLogs.length === 0 && <p className="text-slate-800 italic">Waiting for signal...</p>}
           </div>
        </div>
      </div>

      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="relative w-full max-w-[320px]">
           <div className="relative aspect-[9/19.5] bg-slate-950 rounded-[4rem] border-[12px] border-slate-900 shadow-[0_100px_200px_-50px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-white/10">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-slate-900 rounded-b-3xl z-30"></div>
              
              {!currentResult && !lowResPreview ? (
                <div className="h-full flex flex-col items-center justify-center p-10 text-center text-slate-800 opacity-20">
                   <i className="fa-solid fa-play text-6xl mb-6"></i>
                   <p className="text-[10px] font-black uppercase tracking-[0.4em]">9:16 Studio <br />Output Monitor</p>
                </div>
              ) : (
                <div className="h-full relative animate-fadeIn">
                   {currentResult?.videoUrl ? (
                     <video src={currentResult.videoUrl} className="h-full w-full object-cover" controls autoPlay loop />
                   ) : lowResPreview ? (
                     <div className="h-full relative">
                        <img src={lowResPreview} className="h-full w-full object-cover animate-pulse blur-md" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <div className="text-center space-y-4">
                              <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                              <p className="text-[10px] font-black text-white uppercase tracking-widest">Rendering HD...</p>
                           </div>
                        </div>
                     </div>
                   ) : null}
                </div>
              )}
           </div>

           {currentResult && (
             <div className="mt-8 grid grid-cols-2 gap-4 animate-slideUp">
                <a href={currentResult.videoUrl} download className="bg-white text-black py-4 rounded-3xl font-black text-[10px] uppercase text-center flex items-center justify-center gap-2">
                   <i className="fa-solid fa-download"></i> Save
                </a>
                <button onClick={() => alert("Shared internally!")} className="bg-slate-900 text-white py-4 rounded-3xl font-black text-[10px] uppercase border border-slate-800 flex items-center justify-center gap-2">
                   <i className="fa-solid fa-share-nodes"></i> Share
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default CreatorStudio;
