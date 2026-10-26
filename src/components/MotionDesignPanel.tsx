import React, { useState } from 'react';
import { 
  Palette, 
  Plus, 
  Trash2, 
  Sparkles, 
  Tag, 
  ShieldCheck, 
  Star, 
  Flame, 
  Zap,
  MousePointerClick
} from 'lucide-react';
import { StoryboardScene, MotionOverlay, StickerType } from '../types';

interface MotionDesignPanelProps {
  activeScene: StoryboardScene;
  activeSceneIndex: number;
  onUpdateScene: (index: number, updated: Partial<StoryboardScene>) => void;
}

export const MotionDesignPanel: React.FC<MotionDesignPanelProps> = ({
  activeScene,
  activeSceneIndex,
  onUpdateScene,
}) => {
  const [newType, setNewType] = useState<StickerType>('badge_promo');
  const [newText, setNewText] = useState('-50% CETTE SEMAINE');
  const [newSubtext, setNewSubtext] = useState('Stock Limité');
  const [newPosition, setNewPosition] = useState<MotionOverlay['position']>('top_right');
  const [newColorTheme, setNewColorTheme] = useState<MotionOverlay['colorTheme']>('red');
  const [newAnimation, setNewAnimation] = useState<MotionOverlay['animation']>('bounce');

  const presetStickers: {
    type: StickerType;
    label: string;
    text: string;
    subtext: string;
    color: MotionOverlay['colorTheme'];
    anim: MotionOverlay['animation'];
    pos: MotionOverlay['position'];
    icon: any;
  }[] = [
    {
      type: 'badge_promo',
      label: 'Badge Promo -50%',
      text: '-50% AUJOURD’HUI',
      subtext: 'Offre Spéciale',
      color: 'red',
      anim: 'bounce',
      pos: 'top_right',
      icon: Tag,
    },
    {
      type: 'badge_limited',
      label: 'Urgence Stock Faible',
      text: 'STOCK TRÈS LIMITÉ',
      subtext: 'Plus que 7 pièces',
      color: 'amber',
      anim: 'pulse',
      pos: 'top_left',
      icon: Flame,
    },
    {
      type: 'badge_trust',
      label: 'Garantie & Livraison 24h',
      text: 'LIVRAISON 24H OFFERTE',
      subtext: 'Satisfait ou Remboursé',
      color: 'emerald',
      anim: 'slide_in',
      pos: 'top_left',
      icon: ShieldCheck,
    },
    {
      type: 'badge_rating',
      label: 'Avis Clients 4.9/5',
      text: '★ ★ ★ ★ ★ 4.9/5',
      subtext: '12 800+ Avis Vérifiés',
      color: 'emerald',
      anim: 'pop',
      pos: 'top',
      icon: Star,
    },
    {
      type: 'cta_button',
      label: 'Bouton Commander',
      text: 'COMMANDER MAINTENANT',
      subtext: 'Paiement Sécurisé',
      color: 'indigo',
      anim: 'pulse',
      pos: 'bottom',
      icon: MousePointerClick,
    },
    {
      type: 'price_tag',
      label: 'Luxe & Or Noir',
      text: 'ÉCRIN PRESTIGE 59€',
      subtext: 'Édition Numérotée',
      color: 'black_gold',
      anim: 'glow',
      pos: 'top_right',
      icon: Sparkles,
    },
  ];

  const handleAddPreset = (preset: typeof presetStickers[0]) => {
    const overlay: MotionOverlay = {
      id: `ov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: preset.type,
      text: preset.text,
      subtext: preset.subtext,
      position: preset.pos,
      colorTheme: preset.color,
      animation: preset.anim,
      startTimeSec: 0,
      durationSec: activeScene.durationSec || 4,
    };

    const currentOverlays = activeScene.overlays || [];
    onUpdateScene(activeSceneIndex, {
      overlays: [...currentOverlays, overlay],
    });
  };

  const handleAddCustom = () => {
    if (!newText.trim()) return;
    const overlay: MotionOverlay = {
      id: `ov_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: newType,
      text: newText,
      subtext: newSubtext,
      position: newPosition,
      colorTheme: newColorTheme,
      animation: newAnimation,
      startTimeSec: 0,
      durationSec: activeScene.durationSec || 4,
    };

    const currentOverlays = activeScene.overlays || [];
    onUpdateScene(activeSceneIndex, {
      overlays: [...currentOverlays, overlay],
    });
  };

  const handleDeleteOverlay = (overlayId: string) => {
    const filtered = (activeScene.overlays || []).filter((o) => o.id !== overlayId);
    onUpdateScene(activeSceneIndex, { overlays: filtered });
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Palette className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-white">Motion Design & Éléments Graphiques Animés</h2>
        </div>
        <p className="text-xs text-slate-400">
          Ajoutez des badges promotionnels animés, des stickers d'urgence, des prix barrés et des boutons d'appel à l'action percutants.
        </p>
      </div>

      {/* Typography Style Switcher for Scene */}
      <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-3">
        <h3 className="text-xs font-semibold text-slate-200">
          Style Typographique des Sous-Titres (Scène 0{activeSceneIndex + 1})
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'tiktok_bold', name: 'TikTok Punchy', desc: 'Gras jaune & blanc fort contraste' },
            { id: 'minimal_luxury', name: 'Luxe Minimal', desc: 'Cadre verre noir & typographie dorée' },
            { id: 'neon_glow', name: 'Néon Cyber Glow', desc: 'Lueur cyan intense & tech' },
            { id: 'clean_boxed', name: 'Boîte Épurée', desc: 'Fond sombre semi-transparent élégant' },
          ].map((style) => (
            <button
              key={style.id}
              onClick={() => onUpdateScene(activeSceneIndex, { captionStyle: style.id as any })}
              className={`p-2.5 rounded-lg border text-left transition-all ${
                activeScene.captionStyle === style.id
                  ? 'border-indigo-500 bg-indigo-600/15 text-white shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold">{style.name}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{style.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 1-Click Ready Motion Presets */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-slate-200">
          Stickers & Éléments Prêts à l'Emploi (1-Clic pour ajouter)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {presetStickers.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleAddPreset(preset)}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-850 hover:border-indigo-500/50 text-left transition-all group flex items-start gap-3"
              >
                <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-indigo-600/20 text-slate-300 group-hover:text-indigo-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center justify-between">
                    <span>{preset.label}</span>
                    <Plus className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-[11px] font-mono text-indigo-400 font-medium">{preset.text}</div>
                  <div className="text-[10px] text-slate-500">{preset.subtext}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scene Motion Elements List */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-semibold text-slate-200 flex items-center justify-between">
          <span>Éléments Actifs sur la Scène 0{activeSceneIndex + 1}</span>
          <span className="text-[11px] text-slate-400 font-mono">
            {(activeScene.overlays || []).length} élément(s)
          </span>
        </h3>

        {(!activeScene.overlays || activeScene.overlays.length === 0) ? (
          <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-slate-500 text-xs">
            Aucun sticker motion sur cette scène. Cliquez sur un des éléments ci-dessus pour l'ajouter instantanément.
          </div>
        ) : (
          <div className="space-y-2">
            {activeScene.overlays.map((ov) => (
              <div
                key={ov.id}
                className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                  <div>
                    <div className="text-xs font-bold text-white">{ov.text}</div>
                    <div className="text-[10px] text-slate-400">
                      Position : {ov.position} · Animation : {ov.animation} · Thème : {ov.colorTheme}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteOverlay(ov.id)}
                  className="p-1.5 text-slate-400 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                  title="Supprimer l'élément"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
