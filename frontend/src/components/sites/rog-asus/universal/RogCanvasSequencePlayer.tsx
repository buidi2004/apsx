'use client';

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface RogCanvasSequencePlayerProps {
  /** Array of image URLs or relative paths */
  frames?: string[];
  /** Or URL to sequence-manifest.json */
  manifestUrl?: string;
  /** Height of scroll pin container (e.g. "300vh") */
  containerHeight?: string;
  /** Section title or caption */
  title?: string;
  subtitle?: string;
  className?: string;
}

export function RogCanvasSequencePlayer({
  frames: initialFrames,
  manifestUrl,
  containerHeight = '300vh',
  title = 'ROG MATRIX 3D EXPLODED ARCHITECTURE',
  subtitle = 'Cuộn chuột để giải mã kiến trúc tản nhiệt và linh kiện tối tân',
  className = ''
}: RogCanvasSequencePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState<string[]>(initialFrames || []);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  // 1. Fetch manifest if provided
  useEffect(() => {
    if (manifestUrl && (!frames || frames.length === 0)) {
      fetch(manifestUrl)
        .then(res => res.json())
        .then(data => {
          if (data && Array.isArray(data.frames)) {
            setFrames(data.frames.map((f: any) => typeof f === 'string' ? f : f.url));
          }
        })
        .catch(err => console.error('Failed to load sequence manifest:', err));
    }
  }, [manifestUrl]);

  // 2. Preload frames
  useEffect(() => {
    if (!frames || frames.length === 0) return;

    let loaded = 0;
    const total = frames.length;
    const loadedImages: HTMLImageElement[] = [];

    frames.forEach((src, idx) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        setLoadedCount(loaded);
        if (loaded >= Math.min(total, 10)) {
          setIsReady(true);
        }
      };
      loadedImages[idx] = img;
    });

    imagesRef.current = loadedImages;
  }, [frames]);

  // 3. Setup GSAP ScrollTrigger
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || imagesRef.current.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const total = imagesRef.current.length;
    const currentFrame = { index: 0 };

    const render = (index: number) => {
      const img = imagesRef.current[Math.floor(index)];
      if (!img || !img.complete) return;

      // Handle high-DPI
      const dpr = window.devicePixelRatio || 1;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, w, h);

      // Draw image object-contain
      const hRatio = w / img.width;
      const vRatio = h / img.height;
      const ratio = Math.min(hRatio, vRatio);
      const centerShiftX = (w - img.width * ratio) / 2;
      const centerShiftY = (h - img.height * ratio) / 2;

      ctx.drawImage(
        img,
        0, 0, img.width, img.height,
        centerShiftX, centerShiftY, img.width * ratio, img.height * ratio
      );
      ctx.restore();
    };

    // Initial draw
    render(0);

    // GSAP ScrollTrigger
    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      pin: canvas.parentElement,
      scrub: 0.5, // 0.5s inertia scrub
      onUpdate: (self) => {
        const frameIdx = Math.min(total - 1, Math.floor(self.progress * (total - 1)));
        if (currentFrame.index !== frameIdx) {
          currentFrame.index = frameIdx;
          render(frameIdx);
        }
      }
    });

    const handleResize = () => render(currentFrame.index);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      trigger.kill();
    };
  }, [frames, isReady]);

  return (
    <div
      ref={containerRef}
      style={{ height: containerHeight }}
      className={`relative w-full bg-[#050505] text-white select-none ${className}`}
    >
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Glow Background Element */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_rgba(255,0,54,0.12)_0%,_rgba(0,0,0,0)_70%)]" />

        {/* Text Header */}
        <div className="absolute top-24 z-20 text-center px-4 max-w-4xl">
          <span className="text-[#FF0036] font-mono text-xs uppercase tracking-widest font-bold">
            [ Canvas 3D Frame Sequence ]
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-wider mt-2">
            {title}
          </h2>
          <p className="text-zinc-400 text-sm md:text-base mt-2">
            {subtitle}
          </p>
        </div>

        {/* 60FPS Canvas */}
        <canvas
          ref={canvasRef}
          className="w-full h-full max-h-[85vh] object-contain z-10"
        />

        {/* Preload Status Bar (if loading) */}
        {!isReady && frames.length > 0 && (
          <div className="absolute bottom-10 z-20 flex flex-col items-center">
            <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF0036] transition-all duration-150"
                style={{ width: `${Math.round((loadedCount / frames.length) * 100)}%` }}
              />
            </div>
            <span className="text-zinc-500 font-mono text-xs mt-2">
              Loading 3D frames: {loadedCount}/{frames.length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default RogCanvasSequencePlayer;
