import React from 'react';
import { 
  Film, 
  Sparkles, 
  Layers, 
  Mic, 
  Palette, 
  FolderKanban, 
  CheckCircle2, 
  Infinity as InfinityIcon,
  Zap,
  Sliders
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  sceneCount: number;
  totalDuration: number;
  onOpenTemplates: () => void;
  onOpenNewProject: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  sceneCount,
  totalDuration,
  onOpenTemplates,
  onOpenNewProject,
}) => {
  const menuItems = [
    { id: 'storyboard', label: 'Studio Storyboard', icon: Layers, badge: `${sceneCount} scènes` },
    { id: 'image_to_video', label: 'Image en Vidéo Direct', icon: Sparkles },
    { id: 'voiceover', label: 'Voix Off & Sonorisation', icon: Mic },
    { id: 'motion', label: 'Motion Design & Stickers', icon: Palette },
    { id: 'projects', label: 'Bibliothèque Projets', icon: FolderKanban },
  ];

  return (
    <aside className="w-64 bg-[#0d121f] border-r border-slate-800/80 flex flex-col justify-between p-4 shrink-0 h-[calc(100vh-57px)] overflow-y-auto">
      <div className="space-y-6">
        {/* Quick action: new ad project */}
        <div className="space-y-2">
          <button
            onClick={onOpenNewProject}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 active:bg-slate-850 rounded-lg border border-slate-700/80 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Nouveau Projet Vidéo</span>
          </button>
          
          <button
            onClick={onOpenTemplates}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800/60 rounded-lg border border-slate-800 transition-colors"
          >
            <Film className="w-3.5 h-3.5 text-indigo-400" />
            <span>Parcourir les Modèles</span>
          </button>
        </div>

        {/* Navigation list */}
        <div className="space-y-1">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider px-2 mb-2">
            Outils de Création
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Project live telemetry / duration indicator */}
        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Durée publicitaire</span>
            <span className="font-mono tabular-nums text-slate-200 font-semibold">{totalDuration.toFixed(1)}s</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, (totalDuration / 30) * 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Recommandé TikTok</span>
            <span>15s – 30s</span>
          </div>
        </div>
      </div>

      {/* Free & Unlimited Guarantee Box (Sans Abonnement) */}
      <div className="pt-4 border-t border-slate-800/80">
        <div className="p-3 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 rounded-xl border border-indigo-900/40 space-y-2">
          <div className="flex items-center gap-2">
            <InfinityIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Création 100% Illimitée</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Aucun abonnement ni carte bancaire requis. Exportations Full HD illimitées et sans filigrane.
          </p>
          <div className="space-y-1 text-[11px] text-slate-300 pt-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Rendu GPU local haute vitesse</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Voix off illimitées incluses</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Aucun logo ou filigrane forcé</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
