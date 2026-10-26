import React, { useState, useEffect } from 'react';
import { 
  Mic, 
  Volume2, 
  Play, 
  Sparkles, 
  Music, 
  Radio, 
  Sliders, 
  Wand2, 
  Check, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { AdProject, StoryboardScene } from '../types';
import { audioEngine } from '../services/audioEngine';
import { generateAdStoryboard } from '../services/geminiService';

interface VoiceoverPanelProps {
  project: AdProject;
  onUpdateProject: (updated: Partial<AdProject>) => void;
  onUpdateScenes: (scenes: StoryboardScene[]) => void;
}

export const VoiceoverPanel: React.FC<VoiceoverPanelProps> = ({
  project,
  onUpdateProject,
  onUpdateScenes,
}) => {
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isPlayingSample, setIsPlayingSample] = useState(false);
  const [sampleText, setSampleText] = useState(
    'Découvrez notre formule exclusive ! Commandez dès aujourd\'hui et bénéficiez de 40% de réduction immédiate.'
  );

  // AI Script Modal state
  const [productName, setProductName] = useState('Sonic Pro ANC');
  const [category, setCategory] = useState('High-Tech & Audio');
  const [targetAudience, setTargetAudience] = useState('Passionnés de musique et télétravailleurs');
  const [keyBenefit, setKeyBenefit] = useState('Silence absolu et 60h d\'autonomie');
  const [offerPrice, setOfferPrice] = useState('89€ au lieu de 149€');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationSuccess, setGenerationSuccess] = useState(false);

  useEffect(() => {
    const loadVoices = () => {
      const v = audioEngine.getAvailableVoices();
      setBrowserVoices(v);
    };

    loadVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  const handleTestVoice = () => {
    setIsPlayingSample(true);
    audioEngine.speakVoiceover(
      sampleText,
      project.voiceoverVoiceId,
      project.voiceoverRate,
      project.voiceoverPitch,
      project.voiceoverVolume,
      () => setIsPlayingSample(false)
    );
  };

  const handleGenerateAIScripts = async () => {
    setIsGenerating(true);
    setGenerationSuccess(false);
    try {
      const newScenes = await generateAdStoryboard({
        productName,
        category,
        targetAudience,
        keyBenefit,
        offerPrice,
      });

      if (newScenes && newScenes.length > 0) {
        onUpdateScenes(newScenes);
        onUpdateProject({ title: `Campagne : ${productName}` });
        setGenerationSuccess(true);
        setTimeout(() => setGenerationSuccess(false), 4000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const musicTracks: { id: AdProject['audioTheme']; name: string; desc: string; icon: string }[] = [
    {
      id: 'energetic_trap',
      name: 'Trap Énergique & TikTok',
      desc: 'Beat lourd 130 BPM avec 808 sub bass pour captiver l\'attention.',
      icon: '🔥',
    },
    {
      id: 'luxury_ambient',
      name: 'Ambiance Luxe & Sérénité',
      desc: 'Nappes soyeuses pour cosmétiques, parfums et mode.',
      icon: '✨',
    },
    {
      id: 'tech_future',
      name: 'High-Tech Synth 124 BPM',
      desc: 'Synthétiseurs arpeggiés pour gadgets, SaaS et innovations.',
      icon: '⚡',
    },
    {
      id: 'lofi_chill',
      name: 'Lo-Fi Chill & Posé',
      desc: 'Rythmique douce 84 BPM pour artisanat, café et bien-être.',
      icon: '☕',
    },
    {
      id: 'none',
      name: 'Aucune Musique (Voix Pure)',
      desc: 'Seule la voix off sera audible pour un style brut.',
      icon: '🔇',
    },
  ];

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Mic className="w-4 h-4" />
          </div>
          <h2 className="text-base font-semibold text-white">Voix Off & Sonorisation Publicitaire</h2>
        </div>
        <p className="text-xs text-slate-400">
          Générez des voix off percutantes en illimité et mixez-les avec une musique de fond adaptée au rythme publicitaire.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voiceover Settings */}
        <div className="lg:col-span-6 space-y-5">
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span>Configuration de la Voix Off</span>
              <span className="text-[10px] text-emerald-400 font-medium">100% Illimité Sans Crédits</span>
            </h3>

            {/* Voice dropdown */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-slate-400">Sélection de la Voix</label>
              <select
                value={project.voiceoverVoiceId}
                onChange={(e) => onUpdateProject({ voiceoverVoiceId: e.target.value })}
                className="w-full bg-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
              >
                <option value="">Voix Française Standard (Système)</option>
                {browserVoices
                  .filter((v) => v.lang.startsWith('fr') || v.lang.startsWith('en'))
                  .map((v) => (
                    <option key={v.voiceURI} value={v.voiceURI}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
              </select>
            </div>

            {/* Rate / Speed Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Débit de parole :</span>
                <span className="text-indigo-400 font-mono font-medium">{project.voiceoverRate.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min={0.8}
                max={1.4}
                step={0.05}
                value={project.voiceoverRate}
                onChange={(e) => onUpdateProject({ voiceoverRate: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Tonalité (Pitch) :</span>
                <span className="text-indigo-400 font-mono font-medium">{project.voiceoverPitch.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min={0.8}
                max={1.3}
                step={0.05}
                value={project.voiceoverPitch}
                onChange={(e) => onUpdateProject({ voiceoverPitch: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Test Voice Sample button */}
            <div className="pt-2">
              <button
                disabled={isPlayingSample}
                onClick={handleTestVoice}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-850 rounded-lg border border-slate-700 transition-colors"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400 ml-0.5" />
                <span>{isPlayingSample ? 'Écoute en cours...' : 'Tester un échantillon de la voix'}</span>
              </button>
            </div>
          </div>

          {/* Background Music Soundtrack Selector */}
          <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-indigo-400" />
                <span>Bande Son & Musique de Fond</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Web Audio Synth</span>
            </h3>

            <div className="space-y-2">
              {musicTracks.map((trk) => {
                const isActive = project.audioTheme === trk.id;
                return (
                  <button
                    key={trk.id}
                    onClick={() => onUpdateProject({ audioTheme: trk.id })}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all flex items-start gap-2.5 ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-600/15 text-white'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-base">{trk.icon}</span>
                    <div className="flex-1 space-y-0.5">
                      <div className="text-xs font-semibold flex items-center justify-between">
                        <span className={isActive ? 'text-indigo-300' : 'text-slate-300'}>{trk.name}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-snug">{trk.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Music volume slider */}
            {project.audioTheme !== 'none' && (
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Volume de la musique :</span>
                  <span className="text-indigo-400 font-mono font-medium">
                    {Math.round(project.audioVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1.0}
                  step={0.05}
                  value={project.audioVolume}
                  onChange={(e) => onUpdateProject({ audioVolume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Script Generator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 rounded-xl border border-indigo-900/40 space-y-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-semibold text-white">Générateur IA de Scripts & Voix Off</h3>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Renseignez votre produit et notre intelligence artificielle génère automatiquement un storyboard de 5 scènes avec les accroches et les textes de voix off optimisés pour la conversion.
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Nom du Produit</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Catégorie</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-300">Offre / Prix Promo</label>
                  <input
                    type="text"
                    value={offerPrice}
                    onChange={(e) => setOfferPrice(e.target.value)}
                    className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Bénéfice Clé Unique</label>
                <input
                  type="text"
                  value={keyBenefit}
                  onChange={(e) => setKeyBenefit(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-300">Public Cible</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  className="w-full bg-slate-800 text-slate-100 text-xs rounded-lg px-3 py-2 border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                disabled={isGenerating}
                onClick={handleGenerateAIScripts}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-md shadow-indigo-600/30 transition-all"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Création du Storyboard IA en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Générer le Storyboard & les Voix Off IA</span>
                  </>
                )}
              </button>

              {generationSuccess && (
                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nouveau storyboard et voix off appliqués avec succès !</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
