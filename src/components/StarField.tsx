"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  color: string;
  baseOpacity: number;
  twinklePeriod: number;
  twinklePhase: number;
  baseShadowBlur: number;
  isGlow: boolean;
}

interface ShootingStar {
  x: number;
  y: number;
  angle: number;
  speed: number;
  tailLength: number;
  color: string;
  opacity: number;
  phase: "fadein" | "move" | "fadeout";
  phaseTime: number;
  isLong: boolean;
  lineWidth: number;
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function randColor() {
  const t = Math.random();
  const r = Math.round(255 - t * (255 - 200));
  const g = Math.round(255 - t * (255 - 192));
  const b = 255;
  return `rgb(${r},${g},${b})`;
}

function parseColor(c: string): [number, number, number] {
  const m = c.match(/rgb\((\d+),(\d+),(\d+)\)/);
  return m ? [+m[1], +m[2], +m[3]] : [255, 255, 255];
}

export default function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0,
      h = 0;
    const isMobile = () => window.innerWidth <= 480;
    const scaleFactor = () => (isMobile() ? 0.7 : 1);

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = w + "px";
      canvas!.style.height = h + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();

    // --- Stars ---
    const baseStarCount = 120;
    const glowStarCount = 18;
    let stars: Star[] = [];

    function initStars() {
      stars = [];
      const sf = scaleFactor();
      const sc = Math.round(baseStarCount * sf);
      const gc = Math.round(glowStarCount * sf);

      for (let i = 0; i < sc; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: rand(0.5, 2),
          color: randColor(),
          baseOpacity: rand(0.2, 0.7),
          twinklePeriod: rand(2000, 6000),
          twinklePhase: rand(0, Math.PI * 2),
          baseShadowBlur: rand(4, 8),
          isGlow: false,
        });
      }
      const glowColors = ["#A78BFA", "#6C8EFF"];
      for (let i = 0; i < gc; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          radius: rand(2, 4),
          color: glowColors[Math.floor(Math.random() * glowColors.length)],
          baseOpacity: rand(0.3, 0.6),
          twinklePeriod: rand(3000, 8000),
          twinklePhase: rand(0, Math.PI * 2),
          baseShadowBlur: rand(15, 30),
          isGlow: true,
        });
      }
    }
    initStars();

    // --- Shooting stars ---
    let shootingStars: ShootingStar[] = [];
    let nextShootTime = performance.now() + rand(3000, 8000);

    function spawnShooting(now: number) {
      if (shootingStars.length >= 2) return;
      const isLong = Math.random() < 0.2;
      shootingStars.push({
        x: rand(0, w),
        y: rand(0, h * 0.2),
        angle: rand(25, 45) * (Math.PI / 180),
        speed: isLong ? rand(900, 1200) : rand(600, 900),
        tailLength: isLong ? rand(200, 280) : rand(80, 150),
        color: isLong
          ? Math.random() < 0.5
            ? "#C8C0FF"
            : "#A0B4FF"
          : "#FFFFFF",
        opacity: 0,
        phase: "fadein",
        phaseTime: 0,
        isLong,
        lineWidth: rand(1, 1.5),
      });
      nextShootTime = now + rand(3000, 8000);
    }

    // --- Animation ---
    let lastTime = 0;
    let animId = 0;
    let paused = false;

    function handleVisibility() {
      paused = document.hidden;
      if (!paused) {
        lastTime = performance.now();
        animId = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    function loop(now: number) {
      if (paused) return;
      const dt = lastTime ? Math.min(now - lastTime, 100) : 16;
      lastTime = now;

      ctx!.clearRect(0, 0, w, h);

      // Draw stars
      for (const s of stars) {
        const t =
          Math.sin((now / s.twinklePeriod) * Math.PI * 2 + s.twinklePhase) *
            0.5 +
          0.5;
        const opacity = s.baseOpacity * (0.15 + t * 0.85);
        const blur = s.baseShadowBlur * (0.4 + t * 0.6);
        const [r, g, b] = parseColor(s.color);

        ctx!.save();
        ctx!.shadowColor = s.color;
        ctx!.shadowBlur = blur * s.radius;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${opacity})`;
        ctx!.fill();
        ctx!.restore();
      }

      // Spawn shooting stars
      if (now >= nextShootTime) {
        spawnShooting(now);
      }

      // Update & draw shooting stars
      const alive: ShootingStar[] = [];
      for (const ss of shootingStars) {
        ss.phaseTime += dt;
        if (ss.phase === "fadein") {
          ss.opacity = Math.min(ss.phaseTime / 100, 1);
          if (ss.phaseTime >= 100) {
            ss.phase = "move";
            ss.phaseTime = 0;
          }
        } else if (ss.phase === "move") {
          const dist = ss.speed * (dt / 1000);
          ss.x += Math.cos(ss.angle) * dist;
          ss.y += Math.sin(ss.angle) * dist;
          const moveDuration = (ss.tailLength * 2) / ss.speed * 1000;
          if (ss.phaseTime >= moveDuration) {
            ss.phase = "fadeout";
            ss.phaseTime = 0;
          }
        } else {
          ss.opacity = Math.max(1 - ss.phaseTime / 200, 0);
          const dist = ss.speed * (dt / 1000);
          ss.x += Math.cos(ss.angle) * dist;
          ss.y += Math.sin(ss.angle) * dist;
          if (ss.opacity <= 0) continue;
        }

        // Out of bounds check
        if (ss.x > w + 100 || ss.y > h + 100 || ss.x < -100 || ss.y < -100)
          continue;

        // Draw tail
        const tailX = ss.x - Math.cos(ss.angle) * ss.tailLength;
        const tailY = ss.y - Math.sin(ss.angle) * ss.tailLength;
        const grad = ctx!.createLinearGradient(ss.x, ss.y, tailX, tailY);
        const cm = ss.color === "#FFFFFF" ? "255,255,255" : ss.color === "#C8C0FF" ? "200,192,255" : "160,180,255";
        grad.addColorStop(0, `rgba(${cm},${0.8 * ss.opacity})`);
        grad.addColorStop(1, `rgba(${cm},0)`);

        ctx!.save();
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = ss.lineWidth;
        ctx!.lineCap = "round";
        ctx!.beginPath();
        ctx!.moveTo(ss.x, ss.y);
        ctx!.lineTo(tailX, tailY);
        ctx!.stroke();

        // Draw head
        ctx!.shadowColor = "#FFFFFF";
        ctx!.shadowBlur = 8;
        ctx!.beginPath();
        ctx!.arc(ss.x, ss.y, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${ss.opacity})`;
        ctx!.fill();
        ctx!.restore();

        alive.push(ss);
      }
      shootingStars = alive;

      animId = requestAnimationFrame(loop);
    }

    animId = requestAnimationFrame(loop);

    function handleResize() {
      const oldW = w,
        oldH = h;
      resize();
      // Maintain star positions proportionally
      for (const s of stars) {
        s.x = (s.x / oldW) * w;
        s.y = (s.y / oldH) * h;
      }
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
