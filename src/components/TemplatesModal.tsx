import React from 'react';
import { X, Film, Check, Sparkles, Smartphone, Square, Monitor, Clock } from 'lucide-react';
import { PRESET_TEMPLATES } from '../data/defaultTemplates';
import { AdTemplate } from '../types';

interface TemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AdTemplate) => void;
}

export const TemplatesModal: React.FC<TemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1423] border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Modèles Publicitaires Haute Conversion</h2>
              <p className="text-xs text-slate-400">
                Structures éprouvées par les plus grandes marques pour TikTok, Reels et YouTube Ads.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRESET_TEMPLATES.map((tmpl) => {
              const totalSec = tmpl.scenes.reduce((acc, s) => acc + s.durationSec, 0);
              return (
                <div
                  key={tmpl.id}
                  className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/60 rounded-xl p-4 flex flex-col justify-between transition-all group"
                >
                  <div className="space-y-3">
                    {/* Thumbnail preview of first scene */}
                    <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative">
                      <img
                        src={tmpl.scenes[0].imageUrl}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-medium text-white flex items-center gap-1 border border-white/10">
                        {tmpl.aspectRatio === '9:16' && <Smartphone className="w-3 h-3 text-indigo-400" />}
                        {tmpl.aspectRatio === '1:1' && <Square className="w-3 h-3 text-indigo-400" />}
                        {tmpl.aspectRatio === '16:9' && <Monitor className="w-3 h-3 text-indigo-400" />}
                        <span>{tmpl.aspectRatio}</span>
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-indigo-950/80 backdrop-blur-sm text-[10px] font-mono text-indigo-300 border border-indigo-500/30">
                        {tmpl.scenes.length} scènes
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wide">
                        {tmpl.category}
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                        {tmpl.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{totalSec}s</span>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTemplate(tmpl);
                        onClose();
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors shadow-sm"
                    >
                      <span>Utiliser ce Modèle</span>
                      <Sparkles className="w-3 h-3 text-amber-300" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
