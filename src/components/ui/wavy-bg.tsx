"use client";

import { useEffect, useRef, useCallback } from "react";

interface Cloud {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  vx: number;
  vy: number;
  wobblePhase: number;
  wobbleSpeed: number;
  wobbleAmp: number;
}

export default function WavyBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const cloudsRef = useRef<Cloud[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const bgDrawn = useRef(false);

  // Generate cloud particles
  const initClouds = useCallback((width: number, height: number) => {
    const clouds: Cloud[] = [];
    const count = 22;
    for (let i = 0; i < count; i++) {
      clouds.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 100 + Math.random() * 220,
        opacity: 0.015 + Math.random() * 0.035,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.12,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.0003 + Math.random() * 0.0004,
        wobbleAmp: 15 + Math.random() * 30,
      });
    }
    return clouds;
  }, []);

  const animate = useCallback(() => {
    const canvasRef0 = canvasRef.current;
    if (!canvasRef0) return;
    const ctx = canvasRef0.getContext("2d");
    if (!ctx) return;

    canvasRef0.width = window.innerWidth;
    canvasRef0.height = window.innerHeight;
    const w = canvasRef0.width;
    const h = canvasRef0.height;

    const isDark =
      document.documentElement.getAttribute("data-theme") === "dark";
    const base = isDark ? "rgba(155, 168, 171, " : "rgba(74, 92, 106, ";

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, h);
    if (isDark) {
      bg.addColorStop(0, "#06141B");
      bg.addColorStop(0.5, "#0a1e2a");
      bg.addColorStop(1, "#06141B");
    } else {
      bg.addColorStop(0, "#e8edee");
      bg.addColorStop(0.5, "#dce3e5");
      bg.addColorStop(1, "#e8edee");
    }
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    const time = Date.now();
    const mouse = mouseRef.current;

    // Soft radial gradient for a single cloud
    const drawCloud = (cx: number, cy: number, radius: number, opacity: number) => {
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      grad.addColorStop(0, base + (opacity * 1.0).toFixed(4) + ")");
      grad.addColorStop(0.4, base + (opacity * 0.7).toFixed(4) + ")");
      grad.addColorStop(0.7, base + (opacity * 0.3).toFixed(4) + ")");
      grad.addColorStop(1, base + "0)");
      ctx.fillStyle = grad;
      ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
    };

    const clouds = cloudsRef.current;
    for (const c of clouds) {
      // Drift
      c.x += c.vx;
      c.y += c.vy;
      // Wobble
      c.wobblePhase += c.wobbleSpeed;
      const wobbleX = Math.cos(c.wobblePhase) * c.wobbleAmp;
      const wobbleY = Math.sin(c.wobblePhase) * c.wobbleAmp * 0.6;
      // Mouse repulsion (subtle)
      const dx = (c.x + wobbleX) - mouse.x;
      const dy = (c.y + wobbleY) - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const influence = Math.max(0, 1 - dist / 350);
      const pushX = (dx / dist) * influence * 3;
      const pushY = (dy / dist) * influence * 3;

      const drawX = c.x + wobbleX + pushX;
      const drawY = c.y + wobbleY + pushY;

      drawCloud(drawX, drawY, c.radius, c.opacity);

      // Wrap around
      if (c.x < -c.radius * 2) c.x = w + c.radius;
      if (c.x > w + c.radius * 2) c.x = -c.radius;
      if (c.y < -c.radius * 2) c.y = h + c.radius;
      if (c.y > h + c.radius * 2) c.y = -c.radius;
    }

    // Secondary layer — larger, more transparent, slower
    for (const c of clouds) {
      const scale = 1.4;
      const offsetX = Math.sin(c.wobblePhase * 0.7) * c.radius * scale;
      const offsetY = Math.cos(c.wobblePhase * 0.5) * c.radius * 0.8 * scale;
      const ox = c.x + offsetX;
      const oy = c.y + offsetY;
      drawCloud(ox, oy, c.radius * scale * 0.6, c.opacity * 0.5);
    }

    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      mouseRef.current = { x: t.clientX, y: t.clientY };
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    // Initialize clouds
    cloudsRef.current = [];

    const onResize = () => {
      if (cloudsRef.current.length === 0) {
        // lazy init
      }
    };
    window.addEventListener("resize", onResize);

    // Start animation
    if (cloudsRef.current.length === 0) {
      // Delayed so canvas is mounted
      setTimeout(() => {
        if (canvasRef.current) {
          cloudsRef.current = initClouds(
            canvasRef.current.width,
            canvasRef.current.height
          );
        }
      }, 50);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("resize", onResize);
    };
  }, [animate, initClouds]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
