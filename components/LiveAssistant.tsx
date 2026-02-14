
import React, { useState, useEffect, useRef } from 'react';
import { gemini, decode, decodeAudioData, encode } from '../geminiService';
import { LiveServerMessage, Blob } from '@google/genai';

const LiveAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState('Standby');
  const [transcription, setTranscription] = useState<string[]>([]);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startSession = async () => {
    try {
      setStatus('Connecting...');
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = gemini.connectLive({
        onopen: () => {
          setStatus('Listening');
          setIsActive(true);
          
          const source = inputAudioContextRef.current!.createMediaStreamSource(streamRef.current!);
          const scriptProcessor = inputAudioContextRef.current!.createScriptProcessor(4096, 1, 1);
          
          scriptProcessor.onaudioprocess = (e) => {
            if (!isActive && !sessionRef.current) return;
            const inputData = e.inputBuffer.getChannelData(0);
            const l = inputData.length;
            const int16 = new Int16Array(l);
            for (let i = 0; i < l; i++) int16[i] = inputData[i] * 32768;
            
            const pcmBlob: Blob = {
              data: encode(new Uint8Array(int16.buffer)),
              mimeType: 'audio/pcm;rate=16000',
            };
            
            sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
          };
          
          source.connect(scriptProcessor);
          scriptProcessor.connect(inputAudioContextRef.current!.destination);
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (base64Audio && audioContextRef.current) {
            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContextRef.current.currentTime);
            const buffer = await decodeAudioData(decode(base64Audio), audioContextRef.current, 24000, 1);
            const source = audioContextRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioContextRef.current.destination);
            source.start(nextStartTimeRef.current);
            nextStartTimeRef.current += buffer.duration;
            sourcesRef.current.add(source);
            source.onended = () => sourcesRef.current.delete(source);
          }

          if (message.serverContent?.interrupted) {
            sourcesRef.current.forEach(s => s.stop());
            sourcesRef.current.clear();
            nextStartTimeRef.current = 0;
          }
        },
        onerror: (e) => {
          console.error('Live Error:', e);
          setStatus('Error');
          stopSession();
        },
        onclose: () => {
          setStatus('Closed');
          stopSession();
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('Failed to Start');
    }
  };

  const stopSession = () => {
    setIsActive(false);
    setStatus('Standby');
    if (sessionRef.current) sessionRef.current.close();
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    sessionRef.current = null;
    streamRef.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold mb-4">Live <span className="gradient-text">Brainstorm</span></h2>
        <p className="text-slate-400 max-w-md mx-auto">
          Talk to BharatAI in real-time. Discuss your video ideas, scripts, or cultural references with your AI creative director.
        </p>
      </div>

      <div className="relative w-64 h-64 flex items-center justify-center">
        <div className={`absolute inset-0 bg-orange-500/20 rounded-full blur-3xl transition-opacity duration-700 ${isActive ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
        <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive ? 'border-orange-500 scale-110' : 'border-slate-800'}`}>
          <button
            onClick={isActive ? stopSession : startSession}
            className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-white transition-all shadow-2xl ${isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'}`}
          >
            <i className={`fa-solid ${isActive ? 'fa-microphone-slash' : 'fa-microphone'} text-4xl mb-2`}></i>
            <span className="font-bold">{isActive ? 'End Session' : 'Start Talking'}</span>
          </button>
        </div>
      </div>

      <div className="mt-12 glass px-8 py-3 rounded-full border border-slate-700">
        <span className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500 animate-ping' : 'bg-slate-500'}`}></span>
          <span className="font-medium text-slate-300">Status: {status}</span>
        </span>
      </div>

      <div className="mt-8 text-sm text-slate-500 italic">
        "Try saying: 'Chai recipe ke liye reel idea batao...'"
      </div>
    </div>
  );
};

export default LiveAssistant;
