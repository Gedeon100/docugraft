import { StoryboardScene, MotionPresetType, TransitionType, MotionOverlay, AspectRatioType } from '../types';

export interface RenderContext {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  timeSec: number;
  totalDurationSec: number;
  scenes: StoryboardScene[];
  loadedImages: Map<string, HTMLImageElement>;
  aspectRatio: AspectRatioType;
}

// Particle system for ambient dust / sparkles
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
}

export class VideoRenderer {
  private particles: Particle[] = [];

  constructor() {
    this.initParticles(40);
  }

  private initParticles(count: number) {
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0006,
        vy: -0.0008 - Math.random() * 0.0006,
        size: 1 + Math.random() * 3,
        alpha: 0.2 + Math.random() * 0.6,
        color: Math.random() > 0.5 ? '#f5d77f' : '#38bdf8',
      });
    }
  }

  // Find active scene and progress within it based on timeSec
  public getActiveSceneState(scenes: StoryboardScene[], timeSec: number) {
    if (!scenes || scenes.length === 0) return null;

    let accum = 0;
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const start = accum;
      const end = accum + scene.durationSec;
      if (timeSec >= start && timeSec < end) {
        const localTime = timeSec - start;
        const progress = Math.min(1, Math.max(0, localTime / scene.durationSec));
        const nextScene = i < scenes.length - 1 ? scenes[i + 1] : null;
        return {
          scene,
          sceneIndex: i,
          localTime,
          progress,
          duration: scene.durationSec,
          nextScene,
        };
      }
      accum = end;
    }

    // Default to last frame of last scene if beyond total
    const lastScene = scenes[scenes.length - 1];
    return {
      scene: lastScene,
      sceneIndex: scenes.length - 1,
      localTime: lastScene.durationSec,
      progress: 1,
      duration: lastScene.durationSec,
      nextScene: null,
    };
  }

  // Draw current frame onto canvas
  public drawFrame(renderCtx: RenderContext) {
    const { ctx, width, height, timeSec, scenes, loadedImages } = renderCtx;
    if (!scenes || scenes.length === 0) {
      ctx.fillStyle = '#0b0f17';
      ctx.fillRect(0, 0, width, height);
      return;
    }

    const state = this.getActiveSceneState(scenes, timeSec);
    if (!state) return;

    const { scene, progress, localTime } = state;
    const img = loadedImages.get(scene.imageUrl);

    // Clear background
    ctx.fillStyle = '#0b0f17';
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Base Product Image with Motion Preset
    ctx.save();
    this.applyMotionPreset(ctx, width, height, scene.motionPreset, progress, img);
    ctx.restore();

    // 2. Draw Ambient Particle Bokeh / Dust
    this.drawParticles(ctx, width, height, progress);

    // 3. Draw Neon light sweep overlay if applicable
    if (scene.motionPreset === 'neon_sweep') {
      this.drawNeonSweep(ctx, width, height, progress);
    }

    // 4. Draw Glitch chromatic aberration if applicable
    if (scene.motionPreset === 'kinetic_glitch') {
      this.drawGlitchLines(ctx, width, height, progress);
    }

    // 5. Draw Scene Transition effect at boundaries
    this.drawTransitionEffect(ctx, width, height, scene.transition, progress);

    // 6. Draw Motion Design Overlays (Badges, CTA, Price Tags)
    if (scene.overlays && scene.overlays.length > 0) {
      scene.overlays.forEach((overlay) => {
        this.drawOverlay(ctx, width, height, overlay, localTime, progress);
      });
    }

    // 7. Draw Captions & Dynamic Typography
    if (scene.headline || scene.subheadline) {
      this.drawCaptions(ctx, width, height, scene, progress, localTime);
    }

    // 8. Draw Top Story Progress Bar (Instagram/TikTok style)
    this.drawStoryProgressBar(ctx, width, height, scenes, timeSec);
  }

  private applyMotionPreset(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    preset: MotionPresetType,
    progress: number,
    img?: HTMLImageElement
  ) {
    ctx.save();
    ctx.translate(width / 2, height / 2);

    let scale = 1.0;
    let dx = 0;
    let dy = 0;
    let rotation = 0;

    switch (preset) {
      case 'ken_burns_in':
        // Smooth push-in
        scale = 1.0 + progress * 0.28;
        dy = -progress * height * 0.04;
        break;
      case 'ken_burns_out':
        // Smooth pull-out reveal
        scale = 1.28 - progress * 0.24;
        dy = progress * height * 0.03;
        break;
      case 'parallax_tilt':
        // 3D camera pan & tilt
        scale = 1.12;
        dx = Math.sin(progress * Math.PI) * width * 0.04;
        dy = Math.cos(progress * Math.PI) * height * 0.025;
        rotation = Math.sin(progress * Math.PI * 2) * 0.015;
        break;
      case 'kinetic_glitch':
        // Jitter & energy
        scale = 1.08 + (Math.sin(progress * 20) * 0.02);
        if (progress < 0.15 || (progress > 0.5 && progress < 0.65)) {
          dx = (Math.random() - 0.5) * 16;
          dy = (Math.random() - 0.5) * 8;
        }
        break;
      case 'luxury_float':
        // Smooth levitation breathing
        scale = 1.05 + Math.sin(progress * Math.PI) * 0.06;
        dy = Math.sin(progress * Math.PI * 2) * (height * 0.03);
        break;
      case 'neon_sweep':
        scale = 1.08 + progress * 0.1;
        break;
      case 'dynamic_snap':
        // Punchy snap entrance
        if (progress < 0.25) {
          const t = progress / 0.25;
          scale = 0.85 + (Math.sin(t * Math.PI * 0.5) * 0.25);
        } else {
          scale = 1.1 - (progress - 0.25) * 0.05;
        }
        break;
      default:
        scale = 1.0;
    }

    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    ctx.translate(dx, dy);

    if (img && img.complete && img.naturalWidth > 0) {
      // Cover fit
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawW = width;
      let drawH = height;

      if (imgRatio > canvasRatio) {
        drawH = height;
        drawW = height * imgRatio;
      } else {
        drawW = width;
        drawH = width / imgRatio;
      }

      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    } else {
      // Styled procedural fallback
      const grad = ctx.createLinearGradient(-width / 2, -height / 2, width / 2, height / 2);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(-width / 2, -height / 2, width, height);

      ctx.fillStyle = '#6366f1';
      ctx.font = `600 ${Math.floor(width * 0.04)}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('CHARGEMENT DU VISUEL...', 0, 0);
    }

    ctx.restore();
  }

  private drawParticles(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
    ctx.save();
    for (const p of this.particles) {
      p.y += p.vy;
      p.x += p.vx;
      if (p.y < 0) p.y = 1;
      if (p.x < 0) p.x = 1;
      if (p.x > 1) p.x = 0;

      const px = p.x * width;
      const py = p.y * height;

      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * (0.6 + Math.sin(progress * 10 + px) * 0.4);
      ctx.fill();
    }
    ctx.restore();
  }

  private drawNeonSweep(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
    ctx.save();
    const sweepX = -width + progress * (width * 3);
    const grad = ctx.createLinearGradient(sweepX, 0, sweepX + width * 0.4, height);
    grad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    grad.addColorStop(0.5, 'rgba(56, 189, 248, 0.35)');
    grad.addColorStop(0.55, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.6, 'rgba(56, 189, 248, 0.35)');
    grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  private drawGlitchLines(ctx: CanvasRenderingContext2D, width: number, height: number, progress: number) {
    if (Math.random() > 0.4) return;
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    const y1 = Math.random() * height;
    ctx.fillRect(0, y1, width, 4 + Math.random() * 8);

    ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
    const y2 = Math.random() * height;
    ctx.fillRect(0, y2, width, 2 + Math.random() * 6);
    ctx.restore();
  }

  private drawTransitionEffect(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    transition: TransitionType,
    progress: number
  ) {
    // Apply at beginning or end of scene
    if (progress < 0.12) {
      const enterP = progress / 0.12;
      ctx.save();
      if (transition === 'fade') {
        ctx.fillStyle = `rgba(11, 15, 23, ${1 - enterP})`;
        ctx.fillRect(0, 0, width, height);
      } else if (transition === 'flash_white') {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.pow(1 - enterP, 2) * 0.9})`;
        ctx.fillRect(0, 0, width, height);
      } else if (transition === 'slide_left') {
        ctx.fillStyle = '#0b0f17';
        ctx.fillRect(enterP * width, 0, width, height);
      } else if (transition === 'wipe_up') {
        ctx.fillStyle = '#0b0f17';
        ctx.fillRect(0, enterP * height, width, height);
      }
      ctx.restore();
    }
  }

  private drawCaptions(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scene: StoryboardScene,
    progress: number,
    localTime: number
  ) {
    ctx.save();
    const style = scene.captionStyle;
    const isPortrait = height > width;

    let targetY = height * 0.82;
    if (scene.captionPosition === 'top') targetY = height * 0.18;
    if (scene.captionPosition === 'center') targetY = height * 0.5;

    // Slight entrance bounce
    const entranceScale = Math.min(1, progress * 4);

    if (style === 'tiktok_bold') {
      // Punchy TikTok bold yellow & white captions
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const fontSizeHead = Math.floor(width * (isPortrait ? 0.068 : 0.045));
      ctx.font = `900 ${fontSizeHead}px 'Plus Jakarta Sans', system-ui, sans-serif`;

      // Draw dark background pill / shadow for 100% contrast
      const lines = this.wrapText(ctx, scene.headline, width * 0.88);
      const lineHeight = fontSizeHead * 1.25;
      const totalH = lines.length * lineHeight;

      ctx.save();
      ctx.translate(width / 2, targetY);
      ctx.scale(entranceScale, entranceScale);

      lines.forEach((line, idx) => {
        const lineY = -totalH / 2 + idx * lineHeight;

        // Heavy dark outline
        ctx.lineJoin = 'round';
        ctx.lineWidth = Math.max(6, fontSizeHead * 0.22);
        ctx.strokeStyle = '#000000';
        ctx.strokeText(line, 0, lineY);

        // Gradient or vibrant yellow text
        ctx.fillStyle = idx === 0 ? '#facc15' : '#ffffff';
        ctx.fillText(line, 0, lineY);
      });

      // Subheadline
      if (scene.subheadline) {
        const subFontSize = Math.floor(fontSizeHead * 0.55);
        ctx.font = `600 ${subFontSize}px 'Plus Jakarta Sans', sans-serif`;
        const subY = totalH / 2 + subFontSize * 1.2;
        ctx.lineWidth = Math.max(4, subFontSize * 0.2);
        ctx.strokeStyle = '#000000';
        ctx.strokeText(scene.subheadline, 0, subY);
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(scene.subheadline, 0, subY);
      }

      ctx.restore();
    } else if (style === 'minimal_luxury') {
      // Luxury minimal editorial typography
      ctx.save();
      ctx.translate(width / 2, targetY);

      // Glass dark backdrop scrim
      const boxW = width * 0.9;
      const boxH = Math.floor(height * 0.16);
      ctx.fillStyle = 'rgba(10, 8, 12, 0.72)';
      this.roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 12);
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const headSize = Math.floor(width * (isPortrait ? 0.052 : 0.032));
      ctx.font = `700 ${headSize}px 'Plus Jakarta Sans', serif`;
      ctx.fillStyle = '#f5d77f';
      ctx.fillText(scene.headline, 0, -headSize * 0.4);

      if (scene.subheadline) {
        const subSize = Math.floor(headSize * 0.6);
        ctx.font = `400 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(scene.subheadline, 0, headSize * 0.7);
      }

      ctx.restore();
    } else if (style === 'neon_glow') {
      // Cyber neon glow typography
      ctx.save();
      ctx.translate(width / 2, targetY);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const headSize = Math.floor(width * (isPortrait ? 0.06 : 0.04));
      ctx.font = `800 ${headSize}px 'Plus Jakarta Sans', sans-serif`;

      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 16;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(scene.headline, 0, 0);

      if (scene.subheadline) {
        ctx.shadowBlur = 8;
        const subSize = Math.floor(headSize * 0.55);
        ctx.font = `600 ${subSize}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = '#38bdf8';
        ctx.fillText(scene.subheadline, 0, headSize * 1.1);
      }
      ctx.restore();
    } else {
      // Clean boxed
      ctx.save();
      ctx.translate(width / 2, targetY);
      const boxW = width * 0.88;
      const boxH = Math.floor(height * 0.15);
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      this.roundRect(ctx, -boxW / 2, -boxH / 2, boxW, boxH, 14);
      ctx.fill();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const headSize = Math.floor(width * (isPortrait ? 0.05 : 0.032));
      ctx.font = `700 ${headSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.fillText(scene.headline, 0, -headSize * 0.35);

      if (scene.subheadline) {
        const subSize = Math.floor(headSize * 0.65);
        ctx.font = `500 ${subSize}px 'Plus Jakarta Sans', sans-serif`;
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(scene.subheadline, 0, headSize * 0.7);
      }
      ctx.restore();
    }

    ctx.restore();
  }

  private drawOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    overlay: MotionOverlay,
    localTime: number,
    progress: number
  ) {
    if (localTime < overlay.startTimeSec || localTime > overlay.startTimeSec + overlay.durationSec) {
      return;
    }

    ctx.save();
    let x = width * 0.5;
    let y = height * 0.5;

    const pad = width * 0.06;
    if (overlay.position === 'top_left') {
      x = pad + width * 0.18;
      y = pad + height * 0.06;
    } else if (overlay.position === 'top_right') {
      x = width - pad - width * 0.18;
      y = pad + height * 0.06;
    } else if (overlay.position === 'top') {
      x = width * 0.5;
      y = pad + height * 0.06;
    } else if (overlay.position === 'bottom') {
      x = width * 0.5;
      y = height - pad - height * 0.14;
    } else if (overlay.position === 'bottom_left') {
      x = pad + width * 0.2;
      y = height - pad - height * 0.12;
    } else if (overlay.position === 'bottom_right') {
      x = width - pad - width * 0.2;
      y = height - pad - height * 0.12;
    }

    // Animation scale & motion
    let animScale = 1.0;
    if (overlay.animation === 'pulse') {
      animScale = 1.0 + Math.sin(progress * 12) * 0.06;
    } else if (overlay.animation === 'bounce') {
      animScale = 1.0 + Math.abs(Math.sin(progress * 8)) * 0.12;
    } else if (overlay.animation === 'pop') {
      animScale = Math.min(1.0, (localTime - overlay.startTimeSec) * 5);
    }

    ctx.translate(x, y);
    ctx.scale(animScale, animScale);

    // Color theme
    let bg = '#dc2626';
    let textC = '#ffffff';
    let borderC = 'rgba(255,255,255,0.3)';

    if (overlay.colorTheme === 'amber') {
      bg = '#d97706';
    } else if (overlay.colorTheme === 'emerald') {
      bg = '#059669';
    } else if (overlay.colorTheme === 'indigo') {
      bg = '#4f46e5';
    } else if (overlay.colorTheme === 'cyan') {
      bg = '#0891b2';
    } else if (overlay.colorTheme === 'black_gold') {
      bg = '#18181b';
      borderC = '#d4af37';
      textC = '#f5d77f';
    }

    const badgeWidth = Math.min(width * 0.65, 260);
    const badgeHeight = overlay.subtext ? 58 : 42;

    ctx.fillStyle = bg;
    this.roundRect(ctx, -badgeWidth / 2, -badgeHeight / 2, badgeWidth, badgeHeight, 10);
    ctx.fill();

    ctx.strokeStyle = borderC;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textC;

    const fontSize = overlay.subtext ? 14 : 15;
    ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillText(overlay.text, 0, overlay.subtext ? -8 : 0);

    if (overlay.subtext) {
      ctx.font = `600 11px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = 'rgba(255,255,255,0.85)';
      ctx.fillText(overlay.subtext, 0, 14);
    }

    ctx.restore();
  }

  private drawStoryProgressBar(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scenes: StoryboardScene[],
    timeSec: number
  ) {
    ctx.save();
    const count = scenes.length;
    const gap = 4;
    const barH = 3;
    const totalW = width - (count - 1) * gap - 24;
    const segW = totalW / count;
    const topY = 12;

    let accum = 0;
    for (let i = 0; i < count; i++) {
      const startX = 12 + i * (segW + gap);
      const sc = scenes[i];
      const scStart = accum;
      const scEnd = accum + sc.durationSec;
      accum = scEnd;

      // Inactive segment
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      this.roundRect(ctx, startX, topY, segW, barH, 2);
      ctx.fill();

      // Active fill
      if (timeSec >= scEnd) {
        // Complete
        ctx.fillStyle = '#ffffff';
        this.roundRect(ctx, startX, topY, segW, barH, 2);
        ctx.fill();
      } else if (timeSec >= scStart && timeSec < scEnd) {
        // In progress
        const p = (timeSec - scStart) / sc.durationSec;
        ctx.fillStyle = '#ffffff';
        this.roundRect(ctx, startX, topY, segW * p, barH, 2);
        ctx.fill();
      }
    }
    ctx.restore();
  }

  private roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

export const videoRenderer = new VideoRenderer();
