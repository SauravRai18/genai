
import { GoogleGenAI, Type, Modality, GenerateContentResponse, LiveServerMessage } from "@google/genai";
import { EngineBreakdown } from "./types";

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiService {
  private getAi() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async runPromptEngine(userInput: string): Promise<EngineBreakdown> {
    const ai = this.getAi();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ACT AS THE BHARATAI STORYBOARD & CINEMATIC PROMPT ENGINE. 
      Input User Text: "${userInput}"

      TASK: Convert this text into a MULTI-SCENE structured JSON for high-end cinematic Indian content.
      
      ADVANCED ENHANCEMENT RULES:
      1. Storytelling (Multi-Scene): Break the concept into 2-3 logical scenes (Intro, Mid-action, Close-up/Hook). 
      2. Cinematic Camera: Use dynamic movements (Dolly-in, Side-tracking, Drone wide-angle, Slow-motion).
      3. Dynamic Narration: Create engaging Hinglish/English scripts with questions or inspirational hooks.
      4. Multi-Element: Specify clear foreground characters/props vs background environment (e.g. Mumbai streets, Bangalore rooftops).
      5. Indian Context: Strictly Indian ethnicity, clothing (Kurta, Saree, Modern Indian Fashion), and regional landmarks.

      REQUIRED SCHEMA:
      {
        "storyboard": [
          {
            "description": "Visual details for this scene (Foreground/Background)",
            "camera": "Specific motion/angle optimized for 9:16",
            "lighting": "e.g. Cyberpunk Mumbai Neon, Golden Hour, Soft Morning Sun",
            "duration": "e.g. 4 seconds"
          }
        ],
        "subject": "Detailed character profile",
        "visual_style": "Overarching cinematic aesthetic",
        "voice": {
          "gender": "male or female",
          "accent": "Indian English or Hinglish",
          "text": "Unified narration script including a hook or CTA (max 40 words)"
        },
        "output_type": "video or image",
        "finalSystemPrompt": "Consolidated mega-prompt for the Vibe AI model (Veo/Image) focusing on vertical 9:16 storytelling."
      }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyboard: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  camera: { type: Type.STRING },
                  lighting: { type: Type.STRING },
                  duration: { type: Type.STRING }
                },
                required: ["description", "camera", "lighting", "duration"]
              }
            },
            subject: { type: Type.STRING },
            visual_style: { type: Type.STRING },
            voice: {
              type: Type.OBJECT,
              properties: {
                gender: { type: Type.STRING, enum: ['male', 'female'] },
                accent: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["gender", "accent", "text"]
            },
            output_type: { type: Type.STRING, enum: ['video', 'image'] },
            finalSystemPrompt: { type: Type.STRING }
          },
          required: ["storyboard", "subject", "visual_style", "voice", "output_type", "finalSystemPrompt"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  }

  async generateImage(breakdown: EngineBreakdown): Promise<string> {
    const ai = this.getAi();
    const imagePrompt = `${breakdown.subject}, ${breakdown.storyboard[0].description}, ${breakdown.visual_style}, 9:16 vertical portrait, highly realistic cinematic detail`;
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
      config: { imageConfig: { aspectRatio: "9:16" } }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("No image data returned from Gemini");
  }

  async generateVideo(breakdown: EngineBreakdown, imageBase64: string): Promise<string> {
    const ai = this.getAi();
    const timelinePrompt = breakdown.storyboard.map((s, i) => `Scene ${i+1}: ${s.description} with ${s.camera} movement`).join(". ") + ". Overall: " + breakdown.visual_style;
    
    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: timelinePrompt + ", cinematic vertical 9:16 reels style",
      image: {
        imageBytes: imageBase64.split(',')[1],
        mimeType: 'image/png'
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '9:16'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const videoResp = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await videoResp.blob();
    return URL.createObjectURL(blob);
  }

  async generateAudio(script: string, tone: string, gender: 'male' | 'female'): Promise<string> {
    const ai = this.getAi();
    const voiceName = gender === 'male' ? 'Kore' : 'Puck';
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Narrate with a high-end Indian accent: ${script}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName } },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const audioData = decode(base64Audio);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
    return URL.createObjectURL(this.audioBufferToWav(audioBuffer));
  }

  private audioBufferToWav(buffer: AudioBuffer): Blob {
    const numOfChan = buffer.numberOfChannels;
    const length = buffer.length * numOfChan * 2 + 44;
    const bufferArray = new ArrayBuffer(length);
    const view = new DataView(bufferArray);
    const channels = [];
    let i; let sample; let offset = 0; let pos = 0;
    const setUint16 = (data: number) => { view.setUint16(pos, data, true); pos += 2; };
    const setUint32 = (data: number) => { view.setUint32(pos, data, true); pos += 4; };
    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
    setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
    setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
    for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset]));
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
        view.setInt16(pos, sample, true); pos += 2;
      }
      offset++;
    }
    return new Blob([bufferArray], { type: 'audio/wav' });
  }

  connectLive(callbacks: any) {
    const ai = this.getAi();
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        systemInstruction: 'You are BharatAI, an Indian Creative Director. Help creators storyboard viral 9:16 multi-scene videos using Hinglish. Focus on cinematic camera logic.',
      }
    });
  }
}

export const gemini = new GeminiService();
