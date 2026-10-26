import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Trash2, 
  Clock, 
  Smartphone, 
  Square, 
  Monitor, 
  Check, 
  Sparkles,
  Download
} from 'lucide-react';
import { AdProject } from '../types';
import { INITIAL_PROJECT } from '../data/defaultTemplates';

interface ProjectsLibraryProps {
  currentProject: AdProject;
  onLoadProject: (project: AdProject) => void;
  onNewProject: () => void;
}

const STORAGE_KEY = 'vidia_saved_projects_v1';

export const ProjectsLibrary: React.FC<ProjectsLibraryProps> = ({
  currentProject,
  onLoadProject,
  onNewProject,
}) => {
  const [savedProjects, setSavedProjects] = useState<AdProject[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedProjects(parsed);
          return;
        }
      }
    } catch (e) {
      console.warn('Could not read saved projects:', e);
    }
    // initialize with default
    setSavedProjects([INITIAL_PROJECT]);
  }, []);

  const persist = (projects: AdProject[]) => {
    setSavedProjects(projects);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Storage quota exceeded or error:', e);
    }
  };

  const handleSaveCurrent = () => {
    const updated = {
      ...currentProject,
      updatedAt: Date.now(),
    };
    const existingIdx = savedProjects.findIndex((p) => p.id === currentProject.id);
    let nextList: AdProject[];
    if (existingIdx >= 0) {
      nextList = [...savedProjects];
      nextList[existingIdx] = updated;
    } else {
      nextList = [updated, ...savedProjects];
    }
    persist(nextList);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedProjects.length <= 1) return;
    const filtered = savedProjects.filter((p) => p.id !== id);
    persist(filtered);
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FolderKanban className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-white">Bibliothèque de Projets Publicitaires</h2>
          </div>
          <p className="text-xs text-slate-400">
            Tous vos projets sont stockés localement sur votre appareil sans limite de temps ni abonnement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveCurrent}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Check className="w-3.5 h-3.5 text-emerald-400" />
            <span>{saveSuccess ? 'Sauvegardé !' : 'Enregistrer le Projet Actuel'}</span>
          </button>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouveau Projet Vierge</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {savedProjects.map((proj) => {
          const isCurrent = proj.id === currentProject.id;
          const dur = proj.scenes.reduce((acc, s) => acc + s.durationSec, 0);
          const firstImg = proj.scenes[0]?.imageUrl;

          return (
            <div
              key={proj.id}
              onClick={() => onLoadProject(proj)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between group ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-950/30 shadow-lg shadow-indigo-500/10'
                  : 'border-slate-800 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-850'
              }`}
            >
              <div className="space-y-3">
                <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-950 border border-slate-800 relative">
                  {firstImg && (
                    <img
                      src={firstImg}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] text-white flex items-center gap-1 border border-white/10">
                    {proj.aspectRatio === '9:16' && <Smartphone className="w-3 h-3 text-indigo-400" />}
                    {proj.aspectRatio === '1:1' && <Square className="w-3 h-3 text-indigo-400" />}
                    {proj.aspectRatio === '16:9' && <Monitor className="w-3 h-3 text-indigo-400" />}
                    <span>{proj.aspectRatio}</span>
                  </div>
                  {isCurrent && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 text-[10px] font-semibold">
                      En cours d'édition
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                    {proj.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>{proj.scenes.length} scènes</span>
                    <span aria-hidden="true">·</span>
                    <span>{dur.toFixed(1)}s</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  {new Date(proj.updatedAt || Date.now()).toLocaleDateString('fr-FR')}
                </span>

                {savedProjects.length > 1 && (
                  <button
                    onClick={(e) => handleDelete(proj.id, e)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                    title="Supprimer le projet"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
