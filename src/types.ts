export interface Scene {
  id: string;
  timeStart: number;
  timeEnd: number;
  title: string;
  veoPrompt: string;
  camera: string;
  style: string;
  imageUrl?: string;
  isGenerating?: boolean;
}

export interface LyricLine {
  text: string;
  time: number; // in seconds from start
  section: string; // 'Intro' | 'Verse 1' | 'Chorus' | 'Verse 2' | 'Outro'
}

export interface RapProject {
  characterImage: string; // base64 or url
  characterDescription: string;
  theme: string;
  bpm: number;
  beatType: 'Boom Bap' | 'Trap' | 'West Coast';
  lyrics: LyricLine[];
  scenes: Scene[];
}

export interface Asset {
  id: string;
  name: string;
  type: 'video' | 'image' | 'text' | 'audio';
  dataUrl: string; // Base64 or object URL or plain text (for txt)
  size: string;
  uploadedAt: string;
}

export interface UserStats {
  bpmCount: number;
  barsGenerated: number;
  videoRenders: number;
}

export interface UserProfile {
  username: string;
  email: string;
  avatarColor: string;
  signedIn: boolean;
  stats: UserStats;
}

export interface StudioSettings {
  visualQuality: 'Ultra (4K)' | 'Standard (1080p)' | 'Draft (480p)';
  reverbActive: boolean;
  loopActive: boolean;
  seedType: 'Constant' | 'Randomized';
  themePreset: 'Space Violet' | 'Cyberpunk Gold' | 'Matrix Emerald' | 'Crimson Velvet';
}

