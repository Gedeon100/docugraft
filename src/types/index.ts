export type AspectRatioType = '9:16' | '1:1' | '16:9';

export type MotionPresetType = 
  | 'ken_burns_in'
  | 'ken_burns_out'
  | 'parallax_tilt'
  | 'kinetic_glitch'
  | 'luxury_float'
  | 'neon_sweep'
  | 'dynamic_snap';

export type TransitionType = 
  | 'fade'
  | 'slide_left'
  | 'zoom_in'
  | 'flash_white'
  | 'wipe_up'
  | 'none';

export type StickerType = 
  | 'badge_promo'
  | 'badge_limited'
  | 'badge_trust'
  | 'badge_rating'
  | 'cta_button'
  | 'price_tag'
  | 'custom_text';

export interface MotionOverlay {
  id: string;
  type: StickerType;
  text: string;
  subtext?: string;
  position: 'top' | 'center' | 'bottom' | 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right';
  xPercent?: number;
  yPercent?: number;
  colorTheme: 'red' | 'indigo' | 'amber' | 'emerald' | 'cyan' | 'black_gold';
  animation: 'pulse' | 'bounce' | 'slide_in' | 'glow' | 'pop';
  startTimeSec: number;
  durationSec: number;
  scale?: number;
}

export interface StoryboardScene {
  id: string;
  title: string;
  role: 'hook' | 'problem' | 'solution' | 'proof' | 'cta' | 'custom';
  imageUrl: string;
  imageAlt?: string;
  durationSec: number;
  motionPreset: MotionPresetType;
  transition: TransitionType;
  headline: string;
  subheadline: string;
  captionPosition: 'top' | 'center' | 'bottom';
  captionStyle: 'tiktok_bold' | 'minimal_luxury' | 'neon_glow' | 'clean_boxed';
  overlays: MotionOverlay[];
  voiceoverScript: string;
}

export interface AdProject {
  id: string;
  title: string;
  aspectRatio: AspectRatioType;
  scenes: StoryboardScene[];
  audioTheme: 'energetic_trap' | 'lofi_chill' | 'luxury_ambient' | 'tech_future' | 'none';
  audioVolume: number; // 0 to 1
  voiceoverVoiceId: string;
  voiceoverRate: number; // 0.8 to 1.4
  voiceoverPitch: number; // 0.8 to 1.3
  voiceoverVolume: number; // 0 to 1
  enableAutoSubtitles: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface AdTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  aspectRatio: AspectRatioType;
  audioTheme: 'energetic_trap' | 'lofi_chill' | 'luxury_ambient' | 'tech_future';
  scenes: StoryboardScene[];
}

export interface ExportSettings {
  aspectRatio: AspectRatioType;
  fps: number;
  quality: 'hd' | 'fullhd';
  format: 'webm' | 'mp4';
}
