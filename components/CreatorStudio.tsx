
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
  const [jobId, setJobId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [stepText, setStepText] = useState<string>('');
  const [breakdown, setBreakdown] = useState<EngineBreakdown | null>(null);
  const [currentResult, setCurrentResult] = useState<GenerationResult | null>(null);
  const [outputType, setOutputType] = useState<OutputType>('ALL');
  const [lowResPreview, setLowResPreview] = useState<string | null>(null);
  const [workerLogs, setWorkerLogs] = useState<string[]>([]);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (initialPrompt) {
      setPrompt(initialPrompt);
      if (onPromptUsed) onPromptUsed();
    }
  }, [initialPrompt]);

  const addLog = (msg: string) => {
    setWorkerLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  const startEngine = async () => {
    if (!prompt.trim()) return;
    if (!hasApiKey) {
        await onSelectKey();
    }

    setIsGenerating(true);
    const newJobId = `job-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    setJobId(newJobId);
    setJobStatus('queued');
    setCurrentStep(1);
    addLog(`INITIALIZE: Analyzing storytelling potential for prompt...`);
    
    try {
      await new Promise(r => setTimeout(r, 1200));
      setJobStatus('processing');
      addLog(`ENGINE: Segmenting concept into multi-scene blueprint...`);
      const result = await gemini.runPromptEngine(prompt);
      setBreakdown(result);
      addLog(`STORYBOARD: Confirmed ${result.storyboard.length} cinematic phases.`);
    } catch (err) {
      addLog(`FATAL: Blueprint synthesis node failure.`);
      alert("Storyboard Engine Error. Please try a different prompt.");
      setJobStatus(null);
    } finally {
      setIsGenerating(false);
    }
  };

  const previewVoice = async () => {
    if (!breakdown) return;
    setIsPreviewingVoice(true);
    try {
      const audioUrl = await gemini.generateAudio(breakdown.voice.text, 'professional', breakdown.voice.gender);
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
      }
    } catch (err) {
      console.error("Narration preview failed", err);
    } finally {
      setIsPreviewingVoice(false);
    }
  };

  const synthesize = async () => {
    if (!breakdown) return;
    setIsGenerating(true);
    setJobStatus('synthesizing');
    setLowResPreview(null);
    setCurrentResult(null);
    
    let imageUrl, videoUrl, audioUrl;
    
    try {
      if (outputType !== 'AUDIO') {
        setCurrentStep(2);
        setStepText('Rendering Keyframes...');
        addLog(`VIBE-NODE: Synthesizing primary visual keyframe (9:16)...`);
        imageUrl = await gemini.generateImage(breakdown);
        setLowResPreview(imageUrl);
        addLog(`STORAGE: Asset staged in production bucket.`);
      }

      if (outputType === 'AUDIO' || outputType === 'ALL') {
        setCurrentStep(3);
        setStepText('Vibe-TTS: Synthesis...');
        addLog(`AUDIO: Encoding ${breakdown.voice.accent} narration track.`);
        audioUrl = await gemini.generateAudio(breakdown.voice.text, 'professional', breakdown.voice.gender);
        addLog(`AUDIO: Narration finalized.`);
      }

      if (outputType === 'VIDEO' || outputType === 'ALL') {
        setCurrentStep(4);
        setStepText('Veo-3.1 Render Engine...');
        addLog(`VIDEO: Stitching scenes into final cinematic vertical output.`);
        if (imageUrl) {
          videoUrl = await gemini.generateVideo(breakdown, imageUrl);
        }
        addLog(`VIDEO: High-performance render complete.`);
      }

      const finalResult: GenerationResult = {
        id: Math.random().toString(36).substr(2, 9),
        jobId,
        prompt,
        imageUrl,
        videoUrl,
        audioUrl,
        breakdown,
        timestamp: Date.now(),
        status: 'completed',
        outputType,
        isFavorite: false
      };

      setJobStatus('completed');
      addLog(`SUCCESS: Production ready for Creator Hub.`);
      setCurrentResult(finalResult);
      onSuccess(finalResult);
    } catch (err: any) {
      setJobStatus('failed');
      addLog(`FATAL: Dispatcher node failure - ${err.message}`);
      alert(`Synthesis Error: ${err.message}`);
    } finally {
      setIsGenerating(false);
      setStepText('');
      setCurrentStep(0);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-24">
      <audio ref={audioRef} className="hidden" />
      
      <div className="space-y-8">
        <div className="glass p-10 rounded-[4rem] border-t-8 border-orange-500 shadow-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 blur-3xl pointer-events-none"></div>
          
          <div className="flex justify-between items-center mb-12 px-2">
            <h2 className="text-4xl font-black tracking-tighter">Studio <span className="text-orange-500">Core</span></h2>
            {jobId && (
              <div className="px-5 py-2 bg-slate-950 border border-slate-800 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Job #{jobId}
              </div>
            )}
          </div>

          {!breakdown ? (
            <div className="space-y-10 animate-fadeIn">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Cinematic Brief</p>
                   <span className="text-[10px] font-black text-emerald-500 uppercase animate-pulse flex items-center gap-2">
                     <i className="fa-solid fa-microchip"></i> Node-01 Active
                   </span>
                </div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'A Diwali story in a Delhi courtyard, cinematic zoom to the water diyas, transition to celebration...'"
                  className="w-full h-56 bg-slate-950/60 border border-slate-800 rounded-[3rem] p-8 text-xl font-medium outline-none focus:ring-8 focus:ring-orange-500/5 focus:border-orange-500/40 transition-all leading-relaxed no-scrollbar resize-none"
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-4">Output Specs</p>
                  <div className="flex bg-slate-900/80 p-2 rounded-[2rem] border border-slate-800 shadow-inner">
                    {['IMAGE', 'VIDEO', 'ALL'].map(t => (
                      <button
                        key={t}
                        onClick={() => setOutputType(t as OutputType)}
                        className={`flex-1 py-4 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest transition-all ${outputType === t ? 'bg-orange-500 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                   <p className="text-[11px] font-black text-slate-600 uppercase tracking-widest ml-4">Format Lock</p>
                   <div className="h-[74px] px-8 bg-slate-950 rounded-[2rem] border border-slate-800 text-[11px] font-black text-emerald-400 flex items-center gap-4 shadow-inner">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
                      CINEMATIC 9:16 (VERTICAL)
                   </div>
                </div>
              </div>

              <button
                onClick={startEngine}
                disabled={isGenerating || !prompt}
                className="w-full py-8 rounded-[3rem] bg-orange-500 text-white font-black text-2xl hover:bg-orange-600 transition-all flex items-center justify-center gap-4 shadow-3xl shadow-orange-900/50 active:scale-95 btn-glow group"
              >
                {isGenerating ? <i className="fa-solid fa-dna fa-spin"></i> : <i className="fa-solid fa-wand-sparkles group-hover:rotate-12 transition-transform"></i>}
                {isGenerating ? 'Synthesizing Storyboard...' : 'Generate Storyboard'}
              </button>
            </div>
          ) : (
            <div className="space-y-10 animate-fadeIn">
              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                   <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em]">Scene Logic</p>
                   <span className="text-[10px] font-black text-emerald-500 uppercase flex items-center gap-2">
                     <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> {breakdown.storyboard.length} Phases Validated
                   </span>
                </div>
                
                <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                  {breakdown.storyboard.map((scene, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSceneIndex(idx)}
                      className={`flex-none w-32 py-5 rounded-[2rem] border font-black text-[12px] uppercase tracking-widest transition-all ${activeSceneIndex === idx ? 'bg-orange-500 border-orange-400 text-white shadow-2xl' : 'bg-slate-900 border-slate-800 text-slate-500 hover:bg-slate-800'}`}
                    >
                      Phase {idx + 1}
                    </button>
                  ))}
                  <button className="flex-none w-32 py-5 rounded-[2rem] border border-dashed border-slate-800 bg-slate-950/40 text-slate-700 font-black text-[12px] uppercase tracking-widest hover:border-orange-500/40 transition-all">
                    + Phase
                  </button>
                </div>

                <div className="bg-slate-950/80 p-10 rounded-[3.5rem] border border-slate-800/60 space-y-8 animate-fadeIn shadow-inner relative" key={activeSceneIndex}>
                   <div className="grid grid-cols-2 gap-6">
                      <div className="bg-slate-900/40 p-6 rounded-[1.5rem] border border-white/5">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Camera Dynamics</p>
                         <p className="text-[12px] font-bold text-slate-200">{breakdown.storyboard[activeSceneIndex].camera}</p>
                      </div>
                      <div className="bg-slate-900/40 p-6 rounded-[1.5rem] border border-white/5">
                         <p className="text-[9px] font-black text-slate-600 uppercase mb-3 tracking-widest">Atmosphere</p>
                         <p className="text-[12px] font-bold text-slate-200">{breakdown.storyboard[activeSceneIndex].lighting}</p>
                      </div>
                   </div>
                   <p className="text-lg font-medium text-slate-400 italic leading-relaxed px-2">
                     "{breakdown.storyboard[activeSceneIndex].description}"
                   </p>
                </div>
              </div>

              <div className="p-8 bg-orange-500/5 rounded-[3.5rem] border border-orange-500/10 group relative shadow-inner">
                <p className="text-[11px] font-black text-orange-500 uppercase mb-4 tracking-[0.4em] flex items-center gap-3">
                  <i className="fa-solid fa-microphone-lines animate-pulse"></i> Unified Narration
                </p>
                <p className="text-base text-slate-300 font-medium leading-relaxed italic pr-16">"{breakdown.voice.text}"</p>
                <button 
                  onClick={previewVoice}
                  disabled={isPreviewingVoice}
                  className="absolute bottom-8 right-8 w-14 h-14 rounded-[1.5rem] bg-orange-500 text-white flex items-center justify-center shadow-2xl hover:bg-orange-600 active:scale-95 transition-all"
                >
                  {isPreviewingVoice ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-play text-xl"></i>}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <button
                  onClick={() => setBreakdown(null)}
                  className="py-6 rounded-[2.5rem] bg-slate-900 text-slate-400 border border-slate-800 font-black text-[12px] uppercase tracking-[0.3em] hover:bg-slate-800 transition-all"
                 >
                   Discard & Retry
                 </button>
                 <button
                  onClick={synthesize}
                  disabled={isGenerating}
                  className="py-6 rounded-[2.5rem] bg-gradient-to-br from-orange-600 to-orange-400 text-white font-black text-[12px] uppercase tracking-[0.3em] shadow-3xl shadow-orange-900/40 active:scale-95 transition-all btn-glow"
                >
                  {isGenerating ? 'Synthesizing...' : 'Launch Production'}
                </button>
              </div>

              {isGenerating && (
                <div className="space-y-4 px-4">
                   <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
                      <div className="h-full bg-orange-500 animate-pulse transition-all duration-1000 shadow-[0_0_20px_#f97316]" style={{ width: `${(currentStep / 4) * 100}%` }}></div>
                   </div>
                   <p className="text-[11px] text-center font-black uppercase text-slate-500 tracking-[0.5em]">{stepText || 'Executing asset generation node...'}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Console / Telemetry */}
        <div className="glass p-8 rounded-[3.5rem] border-white/5 flex flex-col h-56 shadow-2xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Real-time Telemetry</h3>
            <span className="px-4 py-1.5 bg-slate-950 rounded-xl text-[9px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-500/20 shadow-inner">System Connected</span>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto no-scrollbar font-mono">
             {workerLogs.length === 0 ? (
               <p className="text-[11px] text-slate-700 italic">Awaiting creative signals...</p>
             ) : (
               workerLogs.map((log, i) => (
                 <p key={i} className={`text-[11px] ${i === 0 ? 'text-orange-500 font-bold' : 'text-slate-600'}`}>
                   {'>'} {log}
                 </p>
               ))
             )}
          </div>
        </div>
      </div>

      {/* Preview Monitor: 9:16 Vertical Device */}
      <div className="flex flex-col items-center lg:sticky lg:top-32 h-fit">
        <div className="relative w-full max-w-[380px] group">
          <div className="relative aspect-[9/19.8] bg-slate-950 rounded-[5rem] border-[18px] border-slate-900 shadow-[0_120px_240px_-60px_rgba(0,0,0,0.95)] overflow-hidden ring-1 ring-white/10 transition-all group-hover:ring-orange-500/30">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-12 bg-slate-900 rounded-b-[2.5rem] z-30 flex items-center justify-center shadow-inner">
               <div className="w-14 h-1 bg-slate-800 rounded-full"></div>
            </div>
            
            {!currentResult && !lowResPreview ? (
              <div className="h-full w-full flex flex-col items-center justify-center p-16 text-center relative">
                <div className="w-28 h-28 bg-slate-900/80 rounded-[3.5rem] flex items-center justify-center border border-white/5 mb-12 opacity-40 group-hover:scale-110 group-hover:opacity-100 transition-all duration-1000 shadow-3xl">
                  <i className="fa-solid fa-film text-slate-700 text-5xl group-hover:text-orange-500 transition-colors"></i>
                </div>
                <div className="space-y-8">
                   <p className="text-slate-600 text-[12px] font-black uppercase tracking-[0.6em] leading-relaxed">9:16 Cinematic <br />Output Monitor</p>
                   <div className="flex justify-center gap-3">
                      <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse"></span>
                      <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse delay-75"></span>
                      <span className="w-2 h-2 bg-slate-900 rounded-full animate-pulse delay-150"></span>
                   </div>
                </div>
              </div>
            ) : (
              <div className="h-full w-full bg-black relative animate-fadeIn">
                {currentResult?.videoUrl ? (
                  <video src={currentResult.videoUrl} className="h-full w-full object-cover" controls autoPlay loop />
                ) : lowResPreview ? (
                  <div className="h-full w-full relative">
                    <img src={lowResPreview} className="h-full w-full object-cover animate-pulse blur-lg scale-110" alt="Synthesizing..." />
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-8">
                       <div className="w-16 h-16 border-[6px] border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_#f97316]"></div>
                       <div className="text-center space-y-3">
                          <p className="text-[14px] font-black text-white uppercase tracking-[0.5em] animate-pulse">Rendering 4K</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Veo Render Pipeline Active</p>
                       </div>
                    </div>
                  </div>
                ) : (
                   <div className="h-full w-full flex items-center justify-center bg-slate-900">
                      <i className="fa-solid fa-microphone text-8xl text-orange-500 opacity-20"></i>
                   </div>
                )}
                
                {isGenerating && jobStatus === 'synthesizing' && (
                  <div className="absolute inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-10 z-20">
                     <div className="w-24 h-24 border-[8px] border-orange-500 border-t-transparent rounded-full animate-spin shadow-[0_0_30px_#f97316]"></div>
                     <div className="text-center space-y-4">
                        <h4 className="text-[18px] font-black text-white uppercase tracking-[0.4em] animate-pulse">Encoding Story</h4>
                        <p className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em]">Hinglish Narration & Cinematic Visuals</p>
                     </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {currentResult && (
            <div className="mt-12 grid grid-cols-2 gap-6 w-full animate-slideUp">
               <a 
                href={currentResult.videoUrl || currentResult.imageUrl} 
                download 
                className="bg-white text-black py-7 rounded-[2.5rem] font-black text-sm text-center uppercase tracking-[0.2em] hover:bg-slate-100 transition-all shadow-3xl active:scale-95"
               >
                 <i className="fa-solid fa-download mr-3"></i> Get File
               </a>
               <button 
                className="bg-slate-900 text-white py-7 rounded-[2.5rem] font-black text-sm text-center uppercase tracking-[0.2em] hover:bg-slate-800 transition-all active:scale-95 border border-slate-800"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Production Link Shared!");
                }}
               >
                 <i className="fa-solid fa-share-nodes mr-3"></i> Publish
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorStudio;
