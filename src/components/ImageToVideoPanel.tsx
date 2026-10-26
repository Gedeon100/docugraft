import React, { useRef, useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Play, 
  Move, 
  Clock, 
  Check, 
  Layers, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { MotionPresetType, StoryboardScene } from '../types';
import { SAMPLE_PRODUCTS } from '../data/defaultTemplates';

interface ImageToVideoPanelProps {
  onApplySingleVideo: (scene: StoryboardScene) => void;
  onSendToStoryboard: (scene: StoryboardScene) => void;
}

export const ImageToVideoPanel: React.FC<ImageToVideoPanelProps> = ({
  onApplySingleVideo,
  onSendToStoryboard,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_PRODUCTS[0].imageUrl);
  const [activePreset, setActivePreset] = useState<MotionPresetType>('ken_burns_in');
  const [duration, setDuration] = useState<number>(4);
  const [headline, setHeadline] = useState<string>('DÉCOUVREZ L’INNOVATION 2026');
  const [subheadline, setSubheadline] = useState<string>('L’élégance ultime à portée de main.');
  const [voiceText, setVoiceText] = useState<string>('Découvrez la nouvelle référence que tout le monde s\'arrache.');
  const [badgeText, setBadgeText] = useState<string>('OFFRE LIMITÉE -50%');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presets: { id: MotionPresetType; name: string; desc: string; icon: string }[] = [
    {
      id: 'ken_burns_in',
      name: 'Zoom Avant Cinématique',
      desc: 'Plongée progressive et élégante vers le cœur du produit.',
      icon: '🔍',
    },
    {
      id: 'ken_burns_out',
      name: 'Zoom Arrière Révélation',
      desc: 'Révélation en grand angle majestueux.',
      icon: '🔎',
    },
    {
      id: 'parallax_tilt',
      name: 'Parallaxe 3D & Profondeur',
      desc: 'Mouvement fluide de caméra simulant un rendu 3D haute qualité.',
      icon: '🌐',
    },
    {
      id: 'luxury_float',
      name: 'Lévitation Douce & Luxe',
      desc: 'Flottement aérien subtil pour produits haut de gamme et cosmétiques.',
      icon: '✨',
    },
    {
      id: 'neon_sweep',
      name: 'Balayage Néon Cyber',
      desc: 'Faisceau lumineux balayant la surface du produit.',
      icon: '⚡',
    },
    {
      id: 'kinetic_glitch',
      name: 'Glitch Énergique & Street',
      desc: 'Effet percutant pour le sportswear, streetwear et la tech.',
      icon: '💥',
    },
    {
      id: 'dynamic_snap',
      name: 'Rebond Snap TikTok',
      desc: 'Entrée explosive synchronisée pour stopper le scroll.',
      icon: '🎯',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSelectedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const buildScene = (): StoryboardScene => {
    return {
      id: `img2vid_${Date.now()}`,
      title: 'Conversion Image en Vidéo',
      role: 'solution',
      imageUrl: selectedImage,
      durationSec: duration,
      motionPreset: activePreset,
      transition: 'fade',
      headline: headline,
      subheadline: subheadline,
      captionPosition: 'bottom',
      captionStyle: 'tiktok_bold',
      voiceoverScript: voiceText,
      overlays: badgeText ? [
        {
          id: `badge_${Date.now()}`,
          type: 'badge_limited',
          text: badgeText,
          position: 'top_left',
          colorTheme: 'amber',
          animation: 'pulse',
          startTimeSec: 0,
          durationSec: duration,
        }
      ] : [],
    };
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-white">Convertisseur Image en Vidéo Direct</h2>
        </div>
        <p className="text-xs text-slate-400">
          Transformez n'importe quelle photo statique en vidéo publicitaire animée avec caméra 3D, effets cinématiques et voix off.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Selection & Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Photo Source</label>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-700 relative group flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Produit sélectionné"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-500 transition-all flex items-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Remplacer la photo</span>
                </button>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Importer une photo de mon produit</span>
            </button>
          </div>

          {/* Quick presets picker */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400">Exemples de produits prêts à l'emploi :</span>
            <div className="grid grid-cols-3 gap-1.5">
              {SAMPLE_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => {
                    setSelectedImage(prod.imageUrl);
                    setHeadline(prod.tagline.toUpperCase());
                    setBadgeText(prod.promoBadge);
                  }}
                  className={`p-1.5 rounded-lg border text-left transition-colors flex items-center gap-2 ${
                    selectedImage === prod.imageUrl
                      ? 'border-indigo-500 bg-indigo-950/40 text-white'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                    <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-medium truncate">{prod.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Motion Presets & Video Settings */}
        <div className="lg:col-span-7 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Sélectionnez l'Animation & le Mouvement de Caméra
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presets.map((preset) => {
                const isActive = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setActivePreset(preset.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-lg">{preset.icon}</span>
                    <div className="space-y-0.5">
                      <div className="text-xs font-semibold flex items-center gap-1.5">
                        <span className={isActive ? 'text-indigo-300' : 'text-slate-200'}>{preset.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-400 ml-auto" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {preset.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Duration slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium">Durée de l'animation vidéo :</span>
              <span className="text-indigo-400 font-mono font-semibold">{duration} secondes</span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={0.5}
              value={duration}
              onChange={(e) => setDuration(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Texts & Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Accroche Publicitaire (Titre)</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-400">Badge Promo (Sticker)</label>
              <input
                type="text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
                placeholder="Ex: -50% OFFRE FLASH"
                className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Voiceover script input */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-400">Texte Voix Off (Lu automatiquement)</label>
            <input
              type="text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onApplySingleVideo(buildScene())}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-all shadow-md shadow-indigo-600/20"
            >
              <Play className="w-4 h-4 ml-0.5" />
              <span>Générer & Voir la Vidéo Immédiatement</span>
            </button>
            <button
              onClick={() => onSendToStoryboard(buildScene())}
              className="flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Ajouter au Storyboard Actuel</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
