import React, { useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Sparkles, 
  Clock, 
  Move, 
  Type, 
  SlidersHorizontal,
  Image as ImageIcon
} from 'lucide-react';
import { StoryboardScene, MotionPresetType, TransitionType } from '../types';
import { SAMPLE_PRODUCTS } from '../data/defaultTemplates';

interface StoryboardEditorProps {
  scenes: StoryboardScene[];
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
  onUpdateScene: (index: number, updated: Partial<StoryboardScene>) => void;
  onAddScene: () => void;
  onDuplicateScene: (index: number) => void;
  onDeleteScene: (index: number) => void;
  onMoveScene: (index: number, direction: 'up' | 'down') => void;
}

export const StoryboardEditor: React.FC<StoryboardEditorProps> = ({
  scenes,
  activeSceneIndex,
  onSelectScene,
  onUpdateScene,
  onAddScene,
  onDuplicateScene,
  onDeleteScene,
  onMoveScene,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const selectedScene = scenes[activeSceneIndex] || scenes[0];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateScene(activeSceneIndex, {
            imageUrl: event.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const motionOptions: { id: MotionPresetType; label: string }[] = [
    { id: 'ken_burns_in', label: 'Zoom Avant Cinématique (Ken Burns)' },
    { id: 'ken_burns_out', label: 'Zoom Arrière Révélation' },
    { id: 'parallax_tilt', label: 'Parallaxe 3D & Inclinaison' },
    { id: 'kinetic_glitch', label: 'Glitch Énergique & Flash' },
    { id: 'luxury_float', label: 'Lévitation Douce & Luxe' },
    { id: 'neon_sweep', label: 'Balayage Néon Lumineux' },
    { id: 'dynamic_snap', label: 'Rebond Percutant (Snap)' },
  ];

  const transitionOptions: { id: TransitionType; label: string }[] = [
    { id: 'fade', label: 'Fondu Enchaîné' },
    { id: 'flash_white', label: 'Flash Blanc Éclair' },
    { id: 'slide_left', label: 'Glissement Latéral' },
    { id: 'wipe_up', label: 'Volet Vertical' },
    { id: 'zoom_in', label: 'Zoom Avant Smash' },
    { id: 'none', label: 'Coupure Franche' },
  ];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header & Add Scene Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-white">Storyboard Publicitaire</h2>
          <p className="text-xs text-slate-400">
            Structurez votre vidéo en scènes captivantes pour maximiser les conversions.
          </p>
        </div>
        <button
          onClick={onAddScene}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter une Scène</span>
        </button>
      </div>

      {/* Horizontal / Grid Scene Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {scenes.map((scene, idx) => {
          const isSelected = idx === activeSceneIndex;
          return (
            <div
              key={scene.id}
              onClick={() => onSelectScene(idx)}
              className={`p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md shadow-indigo-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-indigo-400">
                    Scène 0{idx + 1}
                  </span>
                  <span className="text-[10px] font-mono tabular-nums text-slate-400">
                    {scene.durationSec}s
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative">
                  <img
                    src={scene.imageUrl}
                    alt={scene.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1">
                    <span className="text-[9px] text-white font-medium truncate">
                      {scene.headline || scene.title}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role kicker */}
              <div className="mt-2 text-[10px] text-slate-400 capitalize truncate">
                {scene.role === 'hook' && "Accroche Choc"}
                {scene.role === 'problem' && "Problème Client"}
                {scene.role === 'solution' && "Révélation Produit"}
                {scene.role === 'proof' && "Avis & Preuve"}
                {scene.role === 'cta' && "Appel à l'Action"}
                {scene.role === 'custom' && "Personnalisée"}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Scene Inspector & Editor */}
      {selectedScene && (
        <div className="flex-1 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 space-y-5 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                Scène 0{activeSceneIndex + 1}
              </span>
              <input
                type="text"
                value={selectedScene.title}
                onChange={(e) => onUpdateScene(activeSceneIndex, { title: e.target.value })}
                className="text-sm font-semibold bg-transparent text-white border-b border-transparent hover:border-slate-700 focus:border-indigo-500 focus:outline-none px-1"
              />
            </div>

            <div className="flex items-center gap-1">
              <button
                disabled={activeSceneIndex === 0}
                onClick={() => onMoveScene(activeSceneIndex, 'up')}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800"
                title="Déplacer vers la gauche"
              >
                <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
              </button>
              <button
                disabled={activeSceneIndex === scenes.length - 1}
                onClick={() => onMoveScene(activeSceneIndex, 'down')}
                className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800"
                title="Déplacer vers la droite"
              >
                <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
              </button>
              <button
                onClick={() => onDuplicateScene(activeSceneIndex)}
                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                title="Dupliquer la scène"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={scenes.length <= 1}
                onClick={() => onDeleteScene(activeSceneIndex)}
                className="p-1.5 text-slate-400 hover:text-red-400 disabled:opacity-30 disabled:pointer-events-none rounded hover:bg-slate-800"
                title="Supprimer la scène"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Visual & Image Slot */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Image / Photo du Produit</span>
                <span className="text-[11px] text-indigo-400 font-normal">JPG, PNG, WebP</span>
              </label>

              <div className="flex gap-3 items-center">
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shrink-0 relative">
                  <img
                    src={selectedScene.imageUrl}
                    alt={selectedScene.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer Ma Photo</span>
                  </button>

                  {/* Sample presets picker */}
                  <div className="text-[11px] text-slate-400">Ou choisir un produit démo :</div>
                  <div className="flex flex-wrap gap-1">
                    {SAMPLE_PRODUCTS.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => onUpdateScene(activeSceneIndex, { imageUrl: prod.imageUrl })}
                        className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        {prod.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Duration and Motion controls */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    <span>Durée de la scène : <strong className="text-white font-mono">{selectedScene.durationSec}s</strong></span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={0.5}
                    value={selectedScene.durationSec}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { durationSec: parseFloat(e.target.value) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Rôle marketing</label>
                  <select
                    value={selectedScene.role}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { role: e.target.value as any })}
                    className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="hook">Accroche Choc (Hook)</option>
                    <option value="problem">Problème / Douleur Client</option>
                    <option value="solution">Démonstration / Révélation</option>
                    <option value="proof">Preuve Sociale / Avis Client</option>
                    <option value="cta">Appel à l'Action & Offre</option>
                    <option value="custom">Scène Personnalisée</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Motion preset & Text controls */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                    <Move className="w-3 h-3 text-indigo-400" />
                    <span>Animation Caméra</span>
                  </label>
                  <select
                    value={selectedScene.motionPreset}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { motionPreset: e.target.value as any })}
                    className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    {motionOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Transition Entrante</label>
                  <select
                    value={selectedScene.transition}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { transition: e.target.value as any })}
                    className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  >
                    {transitionOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Headlines and captions */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Titre / Accroche Visuelle</label>
                  <input
                    type="text"
                    value={selectedScene.headline}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { headline: e.target.value })}
                    placeholder="Ex: ARRÊTEZ DE COURIR SANS AMORTI !"
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500 font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-300">Sous-titre / Avantage Clé</label>
                  <input
                    type="text"
                    value={selectedScene.subheadline}
                    onChange={(e) => onUpdateScene(activeSceneIndex, { subheadline: e.target.value })}
                    placeholder="Ex: 94% des coureurs constatent un soulagement immédiat"
                    className="w-full bg-slate-800 text-slate-300 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Voiceover text preview for this scene */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Texte de la Voix Off pour cette scène</span>
                  <span className="text-[10px] text-emerald-400">Synthèse vocale incluse</span>
                </label>
                <textarea
                  rows={2}
                  value={selectedScene.voiceoverScript}
                  onChange={(e) => onUpdateScene(activeSceneIndex, { voiceoverScript: e.target.value })}
                  placeholder="Ce que la voix off prononce durant cette scène..."
                  className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg p-2.5 border border-slate-700 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
