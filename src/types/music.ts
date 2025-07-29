export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  artwork?: string;
  genre?: string;
  year?: number;
  liked?: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  artwork?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  isPaused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isShuffling: boolean;
  repeatMode: 'none' | 'one' | 'all';
  queue: Track[];
  currentIndex: number;
}

export interface AudioVisualization {
  frequencies: Uint8Array;
  waveform: Uint8Array;
}

export type ViewMode = 'library' | 'playlists' | 'queue' | 'search' | 'settings';

export interface UserPreferences {
  theme: 'dark' | 'light' | 'auto';
  visualizations: boolean;
  crossfade: boolean;
  crossfadeDuration: number;
  equalizer: EqualizerSettings;
}

export interface EqualizerSettings {
  enabled: boolean;
  presets: EqualizerPreset[];
  currentPreset: string;
  customBands: number[];
}

export interface EqualizerPreset {
  id: string;
  name: string;
  bands: number[];
}