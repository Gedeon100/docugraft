import React from 'react';
import { Download, Sparkles, Play, ShieldCheck, Film } from 'lucide-react';
import { AspectRatioType } from '../types';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  aspectRatio: AspectRatioType;
  onAspectRatioChange: (ratio: AspectRatioType) => void;
  onOpenExport: () => void;
  onOpenTemplates: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  aspectRatio,
  onAspectRatioChange,
  onOpenExport,
  onOpenTemplates,
  isPlaying,
  onTogglePlay,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-[#0e1422] border-b border-slate-800/80 sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <Film className="w-4 h-4 text-white" />
        </div>
        <a href="/" className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-indigo-400 transition-colors">
          Vidia Studio
        </a>
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 ml-2">
          <span>Édition SaaS</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400 font-medium">Illimité & Sans Abonnement</span>
        </div>
      </div>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        <button
          onClick={() => onTabChange('storyboard')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'storyboard' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Studio Storyboard
        </button>
        <button
          onClick={() => onTabChange('image_to_video')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'image_to_video' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Image en Vidéo
        </button>
        <button
          onClick={onOpenTemplates}
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-left"
        >
          Modèles Publicitaires
        </button>
        <button
          onClick={() => onTabChange('voiceover')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'voiceover' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Voix Off & Son
        </button>
        <button
          onClick={() => onTabChange('motion')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 text-left ${
            activeTab === 'motion' ? 'text-indigo-400 font-semibold' : ''
          }`}
        >
          Motion Design
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onTogglePlay}
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0"
        >
          <Play className={`w-3.5 h-3.5 ${isPlaying ? 'text-amber-400' : 'text-slate-300'}`} />
          <span>{isPlaying ? 'Pause' : 'Aperçu Direct'}</span>
        </button>

        <button
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-all shadow-md shadow-indigo-600/30 whitespace-nowrap shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exporter la Vidéo HD</span>
        </button>
      </div>
    </header>
  );
};
