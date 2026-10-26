import React, { useState, useRef } from 'react';
import { 
  X, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Film, 
  Smartphone, 
  Square, 
  Monitor, 
  RefreshCw,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AdProject, AspectRatioType } from '../types';
import { videoRenderer } from '../services/videoRenderer';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AdProject;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [fps, setFps] = useState<number>(30);
  const recordingCanvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  const totalDuration = project.scenes.reduce((acc, s) => acc + s.durationSec, 0) || 15;

  const getExportDimensions = (ratio: AspectRatioType, res: '1080p' | '720p') => {
    if (res === '1080p') {
      if (ratio === '9:16') return { width: 1080, height: 1920 };
      if (ratio === '1:1') return { width: 1080, height: 1080 };
      return { width: 1920, height: 1080 };
    } else {
      if (ratio === '9:16') return { width: 720, height: 1280 };
      if (ratio === '1:1') return { width: 720, height: 720 };
      return { width: 1280, height: 720 };
    }
  };

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setExportedUrl(null);

    const dims = getExportDimensions(project.aspectRatio, resolution);
    const canvas = document.createElement('canvas');
    canvas.width = dims.width;
    canvas.height = dims.height;
    recordingCanvasRef.current = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // Preload all images
    const loadedImages = new Map<string, HTMLImageElement>();
    const loadPromises = project.scenes.map((sc) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = sc.imageUrl;
        img.onload = () => {
          loadedImages.set(sc.imageUrl, img);
          resolve();
        };
        img.onerror = () => resolve();
      });
    });
    await Promise.all(loadPromises);

    // Set up MediaRecorder
    let stream: MediaStream;
    try {
      stream = canvas.captureStream(fps);
    } catch (e) {
      console.error('Canvas captureStream failed:', e);
      setIsExporting(false);
      return;
    }

    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
      ? 'video/webm;codecs=vp9'
      : 'video/webm';

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 8000000, // 8 Mbps high quality
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setExportedUrl(url);
      setIsExporting(false);
      setProgress(100);

      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    };

    recorder.start(100);

    // Frame-by-frame rendering loop
    const totalFrames = Math.ceil(totalDuration * fps);
    let currentFrame = 0;

    const renderNextFrame = () => {
      if (currentFrame >= totalFrames) {
        recorder.stop();
        return;
      }

      const currentTime = (currentFrame / totalFrames) * totalDuration;

      videoRenderer.drawFrame({
        canvas,
        ctx,
        width: dims.width,
        height: dims.height,
        timeSec: currentTime,
        totalDurationSec: totalDuration,
        scenes: project.scenes,
        loadedImages,
        aspectRatio: project.aspectRatio,
      });

      currentFrame++;
      const currentPct = Math.min(99, Math.round((currentFrame / totalFrames) * 100));
      setProgress(currentPct);

      requestAnimationFrame(renderNextFrame);
    };

    requestAnimationFrame(renderNextFrame);
  };

  const handleDownload = () => {
    if (!exportedUrl) return;
    const a = document.createElement('a');
    a.href = exportedUrl;
    const slug = project.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `vidia_${slug}_${project.aspectRatio.replace(':', 'x')}_${resolution}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#0f1423] border border-slate-800 rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Exporter la Vidéo Publicitaire</h2>
              <p className="text-xs text-slate-400">
                Génération directe locale · Sans filigrane · Rendu haute vitesse
              </p>
            </div>
          </div>
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Body content */}
        <div className="p-6 space-y-5">
          {!exportedUrl && !isExporting && (
            <div className="space-y-4">
              {/* Summary of export */}
              <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Projet :</span>
                  <span className="font-semibold text-white truncate max-w-[220px]">{project.title}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Format :</span>
                  <span className="font-mono text-indigo-400 font-semibold">{project.aspectRatio}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Durée totale :</span>
                  <span className="font-mono text-slate-200">{totalDuration.toFixed(1)} secondes</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>Nombre de scènes :</span>
                  <span className="font-mono text-slate-200">{project.scenes.length} scènes animées</span>
                </div>
              </div>

              {/* Resolution options */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Qualité du rendu</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setResolution('1080p')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      resolution === '1080p'
                        ? 'border-indigo-500 bg-indigo-600/15 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">Full HD 1080p</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Idéal TikTok, Reels, Shorts & Ads</div>
                  </button>
                  <button
                    onClick={() => setResolution('720p')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      resolution === '720p'
                        ? 'border-indigo-500 bg-indigo-600/15 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold">Standard HD 720p</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Rendu ultra rapide & léger</div>
                  </button>
                </div>
              </div>

              {/* Framerate */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Fluidité d'animation :</span>
                  <span className="font-mono text-indigo-400 font-semibold">{fps} FPS</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFps(30)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      fps === 30
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    30 FPS (Standard Web)
                  </button>
                  <button
                    onClick={() => setFps(60)}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-medium transition-colors ${
                      fps === 60
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    60 FPS (Ultra Fluide)
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartExport}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-600/30"
              >
                <Film className="w-4 h-4" />
                <span>Lancer le Rendu & Télécharger la Vidéo</span>
              </button>
            </div>
          )}

          {/* Export in progress */}
          {isExporting && (
            <div className="py-6 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
                <RefreshCw className="w-7 h-7 animate-spin" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Génération Vidéo en cours...</h3>
                <p className="text-xs text-slate-400">
                  Compilation des animations 60 FPS, transitions, motion design et typographie.
                </p>
              </div>

              <div className="space-y-1.5 max-w-xs mx-auto">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Progression</span>
                  <span className="text-indigo-400 font-bold tabular-nums">{progress}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full transition-all duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Export Success */}
          {exportedUrl && (
            <div className="py-4 space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Vidéo Publicitaire Prête !</h3>
                <p className="text-xs text-slate-400">
                  Votre vidéo a été rendue en haute résolution sans filigrane.
                </p>
              </div>

              {/* Preview player */}
              <div className="max-w-xs mx-auto aspect-video rounded-xl overflow-hidden bg-black border border-slate-700">
                <video
                  src={exportedUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Télécharger le Fichier Vidéo</span>
                </button>
                <button
                  onClick={onClose}
                  className="py-2.5 px-4 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
