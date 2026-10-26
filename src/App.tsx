import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CanvasPlayer } from './components/CanvasPlayer';
import { StoryboardEditor } from './components/StoryboardEditor';
import { ImageToVideoPanel } from './components/ImageToVideoPanel';
import { VoiceoverPanel } from './components/VoiceoverPanel';
import { MotionDesignPanel } from './components/MotionDesignPanel';
import { ProjectsLibrary } from './components/ProjectsLibrary';
import { TemplatesModal } from './components/TemplatesModal';
import { ExportModal } from './components/ExportModal';
import { AdProject, StoryboardScene, AspectRatioType, AdTemplate } from './types';
import { INITIAL_PROJECT, PRESET_TEMPLATES, createProductSvgDataUri } from './data/defaultTemplates';

export default function App() {
  const [project, setProject] = useState<AdProject>(() => {
    try {
      const saved = localStorage.getItem('vidia_active_project');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
    return INITIAL_PROJECT;
  });

  const [activeTab, setActiveTab] = useState<string>('storyboard');
  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0) || 15;

  // Persist active project to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('vidia_active_project', JSON.stringify(project));
    } catch (e) {
      // ignore
    }
  }, [project]);

  // Main playback timer loop
  useEffect(() => {
    if (!isPlaying) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + dt;
        if (next >= totalDuration) {
          return 0; // loop
        }
        return next;
      });

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, totalDuration]);

  // Spacebar keyboard listener to toggle play
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update scene at index
  const handleUpdateScene = (index: number, updated: Partial<StoryboardScene>) => {
    setProject((prev) => {
      const newScenes = [...prev.scenes];
      if (newScenes[index]) {
        newScenes[index] = { ...newScenes[index], ...updated };
      }
      return { ...prev, scenes: newScenes, updatedAt: Date.now() };
    });
  };

  // Add new scene
  const handleAddScene = () => {
    const newIdx = project.scenes.length + 1;
    const newScene: StoryboardScene = {
      id: `scene_${Date.now()}`,
      title: `Scène 0${newIdx}`,
      role: 'custom',
      imageUrl: project.scenes[0]?.imageUrl || createProductSvgDataUri('sneaker'),
      durationSec: 3.5,
      motionPreset: 'ken_burns_in',
      transition: 'fade',
      headline: 'VOTRE MESSAGE CLÉ',
      subheadline: 'Bénéfice majeur de votre offre',
      captionPosition: 'bottom',
      captionStyle: 'tiktok_bold',
      voiceoverScript: 'Découvrez notre produit révolutionnaire dès aujourd\'hui.',
      overlays: [],
    };
    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, newScene],
      updatedAt: Date.now(),
    }));
    setActiveSceneIndex(project.scenes.length);
  };

  // Duplicate scene
  const handleDuplicateScene = (index: number) => {
    const source = project.scenes[index];
    if (!source) return;
    const dup: StoryboardScene = {
      ...source,
      id: `scene_dup_${Date.now()}`,
      title: `${source.title} (Copie)`,
    };
    const newScenes = [...project.scenes];
    newScenes.splice(index + 1, 0, dup);
    setProject((prev) => ({ ...prev, scenes: newScenes, updatedAt: Date.now() }));
    setActiveSceneIndex(index + 1);
  };

  // Delete scene
  const handleDeleteScene = (index: number) => {
    if (project.scenes.length <= 1) return;
    const newScenes = project.scenes.filter((_, i) => i !== index);
    setProject((prev) => ({ ...prev, scenes: newScenes, updatedAt: Date.now() }));
    setActiveSceneIndex(Math.max(0, index - 1));
  };

  // Move scene
  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= project.scenes.length) return;
    const newScenes = [...project.scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIdx];
    newScenes[targetIdx] = temp;
    setProject((prev) => ({ ...prev, scenes: newScenes, updatedAt: Date.now() }));
    setActiveSceneIndex(targetIdx);
  };

  // Single Image-to-Video handler
  const handleApplySingleVideo = (scene: StoryboardScene) => {
    setProject((prev) => ({
      ...prev,
      scenes: [scene],
      updatedAt: Date.now(),
    }));
    setActiveSceneIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setActiveTab('storyboard');
  };

  const handleSendToStoryboard = (scene: StoryboardScene) => {
    setProject((prev) => ({
      ...prev,
      scenes: [...prev.scenes, scene],
      updatedAt: Date.now(),
    }));
    setActiveSceneIndex(project.scenes.length);
    setActiveTab('storyboard');
  };

  // Template loader
  const handleSelectTemplate = (template: AdTemplate) => {
    setProject((prev) => ({
      ...prev,
      title: template.name,
      aspectRatio: template.aspectRatio,
      audioTheme: template.audioTheme,
      scenes: template.scenes.map((s) => ({ ...s, id: `tmpl_${Date.now()}_${s.id}` })),
      updatedAt: Date.now(),
    }));
    setActiveSceneIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  // New Blank Project
  const handleNewProject = () => {
    const fresh: AdProject = {
      ...INITIAL_PROJECT,
      id: `proj_${Date.now()}`,
      title: 'Nouvelle Campagne Vidéo',
      updatedAt: Date.now(),
    };
    setProject(fresh);
    setActiveSceneIndex(0);
    setCurrentTime(0);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        aspectRatio={project.aspectRatio}
        onAspectRatioChange={(ratio) => setProject((prev) => ({ ...prev, aspectRatio: ratio }))}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenTemplates={() => setIsTemplatesOpen(true)}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying(!isPlaying)}
      />

      {/* Main SaaS Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sceneCount={project.scenes.length}
          totalDuration={totalDuration}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onOpenNewProject={handleNewProject}
        />

        {/* Center & Right Split Workspace */}
        <main className="flex-1 grid grid-cols-1 xl:grid-cols-12 gap-5 p-5 overflow-y-auto">
          {/* Video Player Column */}
          <div className="xl:col-span-5 flex flex-col">
            <CanvasPlayer
              project={project}
              activeSceneIndex={activeSceneIndex}
              onSelectScene={(idx) => {
                setActiveSceneIndex(idx);
                let acc = 0;
                for (let i = 0; i < idx; i++) acc += project.scenes[i].durationSec;
                setCurrentTime(acc);
              }}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              currentTime={currentTime}
              onSeek={setCurrentTime}
              onAspectRatioChange={(ratio) => setProject((prev) => ({ ...prev, aspectRatio: ratio }))}
              canvasRefOut={canvasRef}
            />
          </div>

          {/* Interactive Feature Editor Column */}
          <div className="xl:col-span-7 flex flex-col">
            {activeTab === 'storyboard' && (
              <StoryboardEditor
                scenes={project.scenes}
                activeSceneIndex={activeSceneIndex}
                onSelectScene={(idx) => {
                  setActiveSceneIndex(idx);
                  let acc = 0;
                  for (let i = 0; i < idx; i++) acc += project.scenes[i].durationSec;
                  setCurrentTime(acc);
                }}
                onUpdateScene={handleUpdateScene}
                onAddScene={handleAddScene}
                onDuplicateScene={handleDuplicateScene}
                onDeleteScene={handleDeleteScene}
                onMoveScene={handleMoveScene}
              />
            )}

            {activeTab === 'image_to_video' && (
              <ImageToVideoPanel
                onApplySingleVideo={handleApplySingleVideo}
                onSendToStoryboard={handleSendToStoryboard}
              />
            )}

            {activeTab === 'voiceover' && (
              <VoiceoverPanel
                project={project}
                onUpdateProject={(up) => setProject((prev) => ({ ...prev, ...up }))}
                onUpdateScenes={(scenes) => setProject((prev) => ({ ...prev, scenes }))}
              />
            )}

            {activeTab === 'motion' && (
              <MotionDesignPanel
                activeScene={project.scenes[activeSceneIndex] || project.scenes[0]}
                activeSceneIndex={activeSceneIndex}
                onUpdateScene={handleUpdateScene}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectsLibrary
                currentProject={project}
                onLoadProject={(loaded) => {
                  setProject(loaded);
                  setActiveSceneIndex(0);
                  setCurrentTime(0);
                  setIsPlaying(false);
                }}
                onNewProject={handleNewProject}
              />
            )}
          </div>
        </main>
      </div>

      {/* Templates Modal */}
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Full HD Video Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />
    </div>
  );
}
