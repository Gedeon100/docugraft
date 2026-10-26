import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Smartphone, 
  Square, 
  Monitor, 
  Sparkles 
} from 'lucide-react';
import { AdProject, AspectRatioType } from '../types';
import { videoRenderer } from '../services/videoRenderer';
import { audioEngine } from '../services/audioEngine';

interface CanvasPlayerProps {
  project: AdProject;
  activeSceneIndex: number;
  onSelectScene: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTime: number;
  onSeek: (time: number) => void;
  onAspectRatioChange: (ratio: AspectRatioType) => void;
  canvasRefOut?: React.RefObject<HTMLCanvasElement | null>;
}

export const CanvasPlayer: React.FC<CanvasPlayerProps> = ({
  project,
  activeSceneIndex,
  onSelectScene,
  isPlaying,
  onTogglePlay,
  currentTime,
  onSeek,
  onAspectRatioChange,
  canvasRefOut,
}) => {
  const localCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = canvasRefOut || localCanvasRef;
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isMuted, setIsMuted] = useState(false);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const lastSpokenSceneIdRef = useRef<string | null>(null);

  // Compute total duration
  const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0) || 15;

  // Aspect ratio canvas dimensions
  const getCanvasDimensions = () => {
    switch (project.aspectRatio) {
      case '9:16':
        return { width: 1080, height: 1920, aspectClass: 'aspect-[9/16] max-h-[64vh]' };
      case '1:1':
        return { width: 1080, height: 1080, aspectClass: 'aspect-square max-h-[64vh]' };
      case '16:9':
        return { width: 1920, height: 1080, aspectClass: 'aspect-[16/9] max-h-[64vh] w-full max-w-2xl' };
    }
  };

  const { width, height, aspectClass } = getCanvasDimensions();

  // Preload all scene images
  useEffect(() => {
    project.scenes.forEach((scene) => {
      if (!scene.imageUrl) return;
      if (!loadedImagesRef.current.has(scene.imageUrl)) {
        const img = new Image();
        img.src = scene.imageUrl;
        img.onload = () => {
          loadedImagesRef.current.set(scene.imageUrl, img);
        };
      }
    });
  }, [project.scenes]);

  // Handle Voiceover triggering as time advances
  useEffect(() => {
    if (!isPlaying) {
      audioEngine.stopVoiceover();
      lastSpokenSceneIdRef.current = null;
      return;
    }

    const state = videoRenderer.getActiveSceneState(project.scenes, currentTime);
    if (state && state.scene) {
      const activeScene = state.scene;
      if (lastSpokenSceneIdRef.current !== activeScene.id) {
        lastSpokenSceneIdRef.current = activeScene.id;
        if (!isMuted && activeScene.voiceoverScript) {
          audioEngine.speakVoiceover(
            activeScene.voiceoverScript,
            project.voiceoverVoiceId,
            project.voiceoverRate,
            project.voiceoverPitch,
            project.voiceoverVolume
          );
        }
      }
    }
  }, [isPlaying, currentTime, project.scenes, project.voiceoverVoiceId, project.voiceoverRate, project.voiceoverPitch, project.voiceoverVolume, isMuted]);

  // Music playback sync
  useEffect(() => {
    if (isPlaying && !isMuted) {
      audioEngine.startMusic(project.audioTheme, project.audioVolume);
    } else {
      audioEngine.stopMusic();
    }
    return () => {
      audioEngine.stopMusic();
    };
  }, [isPlaying, project.audioTheme, project.audioVolume, isMuted]);

  // Main 60 FPS Canvas Render Loop
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    videoRenderer.drawFrame({
      canvas,
      ctx,
      width,
      height,
      timeSec: currentTime,
      totalDurationSec: totalDuration,
      scenes: project.scenes,
      loadedImages: loadedImagesRef.current,
      aspectRatio: project.aspectRatio,
    });
  }, [canvasRef, width, height, currentTime, totalDuration, project.scenes, project.aspectRatio]);

  useEffect(() => {
    render();
  }, [render]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    const padSecs = parseFloat(secs) < 10 ? `0${secs}` : secs;
    return `${mins}:${padSecs}`;
  };

  const handleRestart = () => {
    onSeek(0);
    lastSpokenSceneIdRef.current = null;
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Find active scene title
  const currentSceneState = videoRenderer.getActiveSceneState(project.scenes, currentTime);
  const activeSceneTitle = currentSceneState?.scene?.title || 'Scène en cours';

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-between p-4 bg-[#0a0d14] rounded-2xl border border-slate-800/80 shadow-2xl relative w-full h-full min-h-[540px]"
    >
      {/* Top Bar inside Player: Aspect Ratio Switcher & Scene Indicator */}
      <div className="w-full flex items-center justify-between gap-4 pb-3 border-b border-slate-800/60 z-10">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-400">Format :</span>
          <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => onAspectRatioChange('9:16')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                project.aspectRatio === '9:16'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Format vertical TikTok / Reels / Shorts (9:16)"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>9:16</span>
            </button>
            <button
              onClick={() => onAspectRatioChange('1:1')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                project.aspectRatio === '1:1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Format carré Instagram Feed / Facebook (1:1)"
            >
              <Square className="w-3.5 h-3.5" />
              <span>1:1</span>
            </button>
            <button
              onClick={() => onAspectRatioChange('16:9')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                project.aspectRatio === '16:9'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Format horizontal YouTube Ads / Paysage (16:9)"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>16:9</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="text-slate-300 font-medium truncate max-w-[200px]">{activeSceneTitle}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-indigo-400 font-semibold">60 FPS Direct</span>
        </div>
      </div>

      {/* Center Video Canvas Frame */}
      <div className="flex-1 flex items-center justify-center w-full py-2 overflow-hidden">
        <div className={`relative ${aspectClass} rounded-xl overflow-hidden shadow-2xl border border-slate-700/60 bg-black flex items-center justify-center group`}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            className="w-full h-full object-contain"
          />

          {/* Center Play Overlay on Pause */}
          {!isPlaying && (
            <button
              onClick={onTogglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all backdrop-blur-sm z-20 group-hover:bg-indigo-500"
              aria-label="Lancer la vidéo"
            >
              <Play className="w-7 h-7 ml-1" />
            </button>
          )}

          {/* Quick watermark reassurance badge */}
          <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-slate-300 pointer-events-none flex items-center gap-1 border border-white/10">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Sans filigrane</span>
          </div>
        </div>
      </div>

      {/* Bottom Transport Controls & Timeline Scrubber */}
      <div className="w-full space-y-3 pt-3 border-t border-slate-800/60 z-10">
        {/* Timeline Progress Bar */}
        <div className="space-y-1">
          <div className="relative group flex items-center">
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.05}
              value={currentTime}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all hover:h-2.5"
            />
          </div>

          {/* Scene split marks on timeline */}
          <div className="relative w-full h-1 flex">
            {project.scenes.map((scene, idx) => {
              const widthPct = (scene.durationSec / totalDuration) * 100;
              const isCurrent = currentSceneState?.scene?.id === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => {
                    let acc = 0;
                    for (let i = 0; i < idx; i++) acc += project.scenes[i].durationSec;
                    onSeek(acc);
                    onSelectScene(idx);
                  }}
                  style={{ width: `${widthPct}%` }}
                  className={`h-full border-r border-slate-900 transition-colors ${
                    isCurrent ? 'bg-indigo-500' : 'bg-slate-700/60 hover:bg-slate-600'
                  }`}
                  title={`${scene.title} (${scene.durationSec}s)`}
                />
              );
            })}
          </div>
        </div>

        {/* Buttons: Play, Replay, Timecode, Mute, Fullscreen */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="p-2 text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-md shadow-indigo-600/20"
              title={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              title="Recommencer depuis le début"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <div className="text-xs font-mono tabular-nums text-slate-300">
              <span className="font-semibold text-white">{formatTime(currentTime)}</span>
              <span className="text-slate-500 mx-1">/</span>
              <span className="text-slate-400">{formatTime(totalDuration)}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
              title={isMuted ? 'Activer le son' : 'Couper le son'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-slate-300" />}
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors"
              title="Plein écran"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
