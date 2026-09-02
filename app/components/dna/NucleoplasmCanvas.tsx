"use client";

import React, { useEffect, useRef } from "react";
import { AppState } from "@/lib/types";

interface CanvasProps {
  state: AppState;
}

interface NucleoplasmParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  type: 'dATP' | 'dTTP' | 'dGTP' | 'dCTP' | 'ATP' | 'UTP';
  size: number;
  opacity: number;
}

interface ReactionFlash {
  x: number;
  y: number;
  age: number; // 0 to 1
  label: string;
}

export default function NucleoplasmCanvas({ state }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<NucleoplasmParticle[]>([]);
  const flashesRef = useRef<ReactionFlash[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const lastFlashTimeRef = useRef<number>(0);

  // Initialize pool of free dNTPs and ribonucleotides
  useEffect(() => {
    if (particlesRef.current.length === 0) {
      const types: NucleoplasmParticle['type'][] = ['dATP', 'dTTP', 'dGTP', 'dCTP', 'ATP', 'UTP'];
      for (let i = 0; i < 90; i++) {
        particlesRef.current.push({
          x: Math.random() * 1200,
          y: Math.random() * 600,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          type: types[Math.floor(Math.random() * types.length)],
          size: Math.random() * 2 + 1.5,
          opacity: Math.random() * 0.4 + 0.2
        });
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = (time: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = time;
      const deltaTime = Math.min(64, time - lastTimeRef.current);
      lastTimeRef.current = time;

      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (state.showParticles && !prefersReduced) {
        // SVG coordinate mapping factors (SVG is 1100 x 600)
        const scaleX = width / 1100;
        const scaleY = height / 600;

        // Current target active sites in canvas coordinates
        const progress = state.progress;
        const forkX = (220 + (progress / 1000) * 700) * scaleX;
        const polLeadX = (140 + Math.min(forkX / scaleX - 45, (progress / 1000) * 700)) * scaleX;
        const polLeadY = 202 * scaleY;

        const isSynthesizing = state.isPlaying && progress >= 300 && progress <= 980;

        // Periodically emit pyrophosphate (PPi) release flash
        if (isSynthesizing && time - lastFlashTimeRef.current > 400 / state.speed) {
          lastFlashTimeRef.current = time;
          flashesRef.current.push({
            x: polLeadX,
            y: polLeadY,
            age: 0,
            label: 'PPi'
          });
        }

        // Draw and update nucleoplasm substrate particles
        const particles = particlesRef.current;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];

          // Substrate attraction toward active polymerase
          if (isSynthesizing) {
            const dx = polLeadX - (p.x * scaleX);
            const dy = polLeadY - (p.y * scaleY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 * scaleX && dist > 10) {
              p.vx += (dx / dist) * 0.015 * state.speed;
              p.vy += (dy / dist) * 0.015 * state.speed;
            }
          }

          // Damping and drift
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx * deltaTime * 0.05 * (state.isPlaying ? state.speed : 0.4);
          p.y += p.vy * deltaTime * 0.05 * (state.isPlaying ? state.speed : 0.4);

          // Wrap bounds (in 1100x600 space)
          if (p.x < 0) p.x = 1100;
          if (p.x > 1100) p.x = 0;
          if (p.y < 0) p.y = 600;
          if (p.y > 600) p.y = 0;

          const screenX = p.x * scaleX;
          const screenY = p.y * scaleY;

          // Render particle
          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.type.startsWith('d') ? `rgba(37, 99, 235, ${p.opacity})` : `rgba(219, 39, 119, ${p.opacity})`;
          ctx.fill();

          // Render label for a subset of larger particles
          if (p.size > 2.6 && state.showLabels) {
            ctx.font = '9px "IBM Plex Mono", monospace';
            ctx.fillStyle = `rgba(100, 116, 139, ${p.opacity * 1.2})`;
            ctx.fillText(p.type, screenX + 5, screenY + 3);
          }
        }

        // Draw reaction flashes (PPi release)
        for (let i = flashesRef.current.length - 1; i >= 0; i--) {
          const flash = flashesRef.current[i];
          flash.age += deltaTime * 0.002 * state.speed;

          if (flash.age >= 1) {
            flashesRef.current.splice(i, 1);
            continue;
          }

          const radius = 6 + flash.age * 22;
          const alpha = (1 - flash.age) * 0.6;

          ctx.beginPath();
          ctx.arc(flash.x, flash.y - flash.age * 15, radius, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.font = 'bold 9px "IBM Plex Mono", monospace';
          ctx.fillStyle = `rgba(5, 150, 105, ${alpha})`;
          ctx.fillText(`+ ${flash.label}`, flash.x + 10, flash.y - flash.age * 20);
        }
      }

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [state.isPlaying, state.speed, state.showLabels, state.showParticles, state.progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
}
