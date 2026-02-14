
export interface EngineStep {
  name: string;
  status: 'pending' | 'processing' | 'completed';
  details: string;
}

export type JobStatus = 'queued' | 'processing' | 'synthesizing' | 'completed' | 'failed';

export interface Scene {
  description: string;
  camera: string;
  lighting: string;
  duration: string;
}

export interface EngineBreakdown {
  storyboard: Scene[];
  subject: string;
  visual_style: string;
  voice: {
    gender: 'male' | 'female';
    accent: string;
    text: string;
  };
  output_type: 'video' | 'image';
  finalSystemPrompt: string; 
}

export type OutputType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'ALL';

export interface GenerationResult {
  id: string;
  jobId: string;
  prompt: string;
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  breakdown?: EngineBreakdown;
  timestamp: number;
  status: 'completed' | 'failed';
  outputType: OutputType;
  isFavorite?: boolean;
}

export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  PAYMENT = 'PAYMENT',
  DASHBOARD = 'DASHBOARD',
  STUDIO = 'STUDIO',
  LIVE = 'LIVE',
  HISTORY = 'HISTORY',
  TEMPLATES = 'TEMPLATES',
  PROFILE = 'PROFILE',
  SETTINGS = 'SETTINGS',
  ANALYTICS = 'ANALYTICS',
  TRENDING = 'TRENDING'
}

export interface Template {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}
