"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";

interface ChaosLandingProps {
  theme: "light" | "dark";
  onFinish: () => void;
}

const PROJECT_TERMS = [
  "תקציב", "לוח זמנים", "אבן דרך", "תעדוף", "ספרינט", "משאבים", "תכנון", "ביצוע", "בקרה", "דדליין",
  "חזון", "יעדים", "מדדים", "אסטרטגיה", "סיכונים", "חסמים", "צוואר בקבוק", "רטרוספקטיבה", "לקוחות", "ספקים",
  "חוזה", "משא ומתן", "רכש", "איכות", "QA", "הפצה", "פיתוח", "עיצוב", "שיווק", "ROI",
  "KPI", "OKR", "גאנט", "נתיב קריטי", "תלויות", "MVP", "אב טיפוס", "משוב", "באגים", "תחזוקה",
  "תמיכה", "ניהול תצורה", "בורד", "משימות", "אג'ייל", "סקראם", "קאנבאן", "אינטגרציה", "תפוקה", "שעות עבודה",
  "חומרים", "היתרים", "רגולציה", "פרופיל סיכון", "ניהול שינויים", "בעלי עניין", "עלות-תועלת", "הערכת זמנים", "תמחור",
  "בלת״ם", "מלאי", "השקה", "פיילוט", "תחקיר", "ישיבת התנעה", "Kickoff", "מעקב", "סטטוס", "דאשבורד",
  "אופטימיזציה", "יעילות", "פרודוקטיביות"
];

interface Particle {
  text: string;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  rotation: number;
  rotSpeed: number;
  fontSize: number;
  scale: number;
  baseAlpha: number;
  alpha: number;
  delayOffset: number;
  swirlAngle: number;
  swirlRadius: number;
}

export default function ChaosLanding({ theme, onFinish }: ChaosLandingProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [phase, setPhase] = useState<"chaos" | "cohesion" | "anchor" | "ready">("chaos");
  const [isExiting, setIsExiting] = useState(false);
  const transitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const handleComplete = useCallback(() => {
    if (isExiting) return;
    setIsExiting(true);
    if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    setTimeout(() => {
      onFinish();
    }, 600);
  }, [isExiting, onFinish]);

  // Handle user interaction to transition (scroll, click, touch, keydown)
  useEffect(() => {
    if (phase !== "ready" && phase !== "anchor") return;

    const handleInteraction = () => {
      handleComplete();
    };

    window.addEventListener("wheel", handleInteraction, { passive: true });
    window.addEventListener("touchstart", handleInteraction, { passive: true });
    window.addEventListener("keydown", handleInteraction);

    return () => {
      window.removeEventListener("wheel", handleInteraction);
      window.removeEventListener("touchstart", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [phase, handleComplete]);

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const centerX = width / 2;
    const centerY = height / 2;

    // Generate 1000 particles
    const particles: Particle[] = [];
    const count = 1000;

    for (let i = 0; i < count; i++) {
      const text = PROJECT_TERMS[Math.floor(Math.random() * PROJECT_TERMS.length)];
      // Spread across viewport with margins
      const px = Math.random() * (width + 200) - 100;
      const py = Math.random() * (height + 200) - 100;
      const vx = (Math.random() - 0.5) * 0.6;
      const vy = (Math.random() - 0.5) * 0.6;
      const rot = (Math.random() - 0.5) * 1.2;
      const rotSpeed = (Math.random() - 0.5) * 0.006;
      const fontSize = Math.floor(Math.random() * 7) + 11; // 11px to 17px
      // Subtle opacity so 1000 words form a sophisticated cloud rather than an unreadable blinding mess
      const baseAlpha = Math.random() * 0.22 + (theme === "dark" ? 0.12 : 0.08);

      // Center cluster target with slight organic dispersion
      const spreadAngle = Math.random() * Math.PI * 2;
      const spreadDist = Math.random() * 120;
      const targetX = centerX + Math.cos(spreadAngle) * spreadDist;
      const targetY = centerY + Math.sin(spreadAngle) * spreadDist;

      particles.push({
        text,
        x: px,
        y: py,
        startX: px,
        startY: py,
        targetX,
        targetY,
        vx,
        vy,
        rotation: rot,
        rotSpeed,
        fontSize,
        scale: 1,
        baseAlpha,
        alpha: baseAlpha,
        delayOffset: Math.random() * 0.35, // slight organic stagger during cohesion
        swirlAngle: (Math.random() - 0.5) * 2.5,
        swirlRadius: Math.random() * 80 + 30,
      });
    }

    const startTime = performance.now();
    let cohesionSnapshotTaken = false;

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000; // in seconds

      ctx.clearRect(0, 0, width, height);

      // Phase updates
      if (elapsed >= 5.0) {
        setPhase((prev) => (prev !== "ready" ? "ready" : prev));
      } else if (elapsed >= 4.0) {
        setPhase((prev) => (prev !== "anchor" ? "anchor" : prev));
      } else if (elapsed >= 2.0) {
        setPhase((prev) => (prev !== "cohesion" ? "cohesion" : prev));
      }

      // Record snapshot positions right when cohesion starts
      if (elapsed >= 2.0 && !cohesionSnapshotTaken) {
        cohesionSnapshotTaken = true;
        for (let i = 0; i < count; i++) {
          particles[i].startX = particles[i].x;
          particles[i].startY = particles[i].y;
        }
      }

      const isDarkMode = theme === "dark";
      const particleTextColor = isDarkMode ? "228, 228, 231" : "39, 39, 42"; // zinc-200 vs zinc-800

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Draw particles if still visible (elapsed < 4.2s)
      if (elapsed < 4.2) {
        for (let i = 0; i < count; i++) {
          const p = particles[i];

          if (elapsed < 2.0) {
            // Chaos Phase (0-2s): Float gently, rotate slowly
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            // Soft screen boundary wrap
            if (p.x < -150) p.x = width + 150;
            if (p.x > width + 150) p.x = -150;
            if (p.y < -150) p.y = height + 150;
            if (p.y > height + 150) p.y = -150;
          } else {
            // Cohesion Phase (2-4s): Magnetize & converge to center
            const cohesionTime = Math.min(1, Math.max(0, (elapsed - 2.0) / 2.0));
            // Apply organic delay offset
            const localProgress = Math.min(1, Math.max(0, (cohesionTime - p.delayOffset) / (1 - p.delayOffset)));

            // Quintic / cubic ease in-out for magnetic suction effect
            const ease =
              localProgress < 0.5
                ? 4 * localProgress * localProgress * localProgress
                : 1 - Math.pow(-2 * localProgress + 2, 3) / 2;

            // Swirl curve towards center
            const currentAngle = p.swirlAngle * (1 - ease) * 3;
            const currentRadius = p.swirlRadius * (1 - ease);
            const swirlOffsetX = Math.cos(currentAngle) * currentRadius;
            const swirlOffsetY = Math.sin(currentAngle) * currentRadius;

            p.x = p.startX * (1 - ease) + p.targetX * ease + swirlOffsetX;
            p.y = p.startY * (1 - ease) + p.targetY * ease + swirlOffsetY;
            p.rotation = p.rotation * (1 - ease * 0.9);
            p.scale = Math.max(0.05, 1 - ease * 0.85);

            // Fade out as they get swallowed into the core center
            const fadeStart = 0.5;
            if (localProgress > fadeStart) {
              const fadeRatio = (localProgress - fadeStart) / (1 - fadeStart);
              p.alpha = p.baseAlpha * (1 - fadeRatio);
            }
          }

          if (p.alpha <= 0.005) continue;

          ctx.save();
          ctx.translate(p.x, p.y);
          if (p.rotation !== 0) ctx.rotate(p.rotation);
          if (p.scale !== 1) ctx.scale(p.scale, p.scale);

          ctx.font = `${p.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
          ctx.fillStyle = `rgba(${particleTextColor}, ${p.alpha})`;
          ctx.fillText(p.text, 0, 0);
          ctx.restore();
        }
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [theme]);

  // Phase 6: Automatic transition 3 seconds after subtitle is fully visible (around 5s + 3s = 8s)
  useEffect(() => {
    if (phase === "ready") {
      transitionTimerRef.current = setTimeout(() => {
        handleComplete();
      }, 3000);
    }

    return () => {
      if (transitionTimerRef.current) clearTimeout(transitionTimerRef.current);
    };
  }, [phase, handleComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      className={`fixed inset-0 z-50 overflow-hidden select-none flex flex-col items-center justify-center cursor-pointer ${
        theme === "dark" ? "bg-[#09090b] text-white" : "bg-white text-zinc-950"
      }`}
      onClick={handleComplete}
      dir="rtl"
    >
      {/* Background Interactive Canvas (1000 Words) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Subtle radial glow at the center */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
          phase !== "chaos" ? "opacity-100" : "opacity-0"
        } ${
          theme === "dark"
            ? "bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_60%)]"
            : "bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_0%,transparent_60%)]"
        }`}
      />

      {/* Skip Button in Top Corner */}
      <div className="absolute top-6 left-6 z-20">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 font-medium backdrop-blur-md ${
            theme === "dark"
              ? "bg-zinc-900/70 border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:border-zinc-700"
              : "bg-zinc-100/70 border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300"
          }`}
        >
          <span>דלג</span>
          <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
        </button>
      </div>

      {/* Center Typography Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center pointer-events-none">
        
        {/* Main Text (Reveals during Cohesion 2-4s) */}
        <AnimatePresence>
          {(phase === "cohesion" || phase === "anchor" || phase === "ready") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88, filter: "blur(14px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 1.1,
                ease: [0.16, 1, 0.3, 1], // Apple-style spring ease
              }}
              className="flex flex-col items-center"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase border backdrop-blur-md transition-colors bg-zinc-500/10 border-zinc-500/20 text-zinc-600 dark:text-zinc-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
                <span>מכאוס לסדר</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.18] sm:leading-[1.15]">
                <span className="block text-zinc-900 dark:text-white drop-shadow-sm">
                  למי שיש לו מה
                </span>
                <span className="block mt-1 sm:mt-2 bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-900 dark:from-white dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent">
                  ומחפש איך לעשות את ה-איך
                </span>
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle (Reveals during Anchor 4-5s) */}
        <AnimatePresence>
          {(phase === "anchor" || phase === "ready") && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
                delay: 0.1,
              }}
              className="mt-6 sm:mt-8 max-w-2xl flex flex-col items-center"
            >
              <p className="text-base sm:text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                לכל פרויקט שיש לך, מבניית אפליקציה, ועד בניית פרגולה.
              </p>
              <p className="mt-2 text-sm sm:text-lg md:text-xl font-medium text-zinc-900 dark:text-zinc-200">
                7 צעדים כדי לתכנן את הפרויקט הבא שלך בצורה נגישה.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interactive Call-To-Action prompt (Ready Phase) */}
        <AnimatePresence>
          {phase === "ready" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="mt-10 sm:mt-12 flex flex-col items-center gap-3 pointer-events-auto"
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleComplete();
                }}
                className={`group px-6 py-3 rounded-full text-sm font-semibold tracking-wide shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
                  theme === "dark"
                    ? "bg-white text-zinc-950 hover:bg-zinc-200 shadow-white/5"
                    : "bg-zinc-950 text-white hover:bg-zinc-800 shadow-zinc-900/10"
                }`}
              >
                <span>בואו נתחיל</span>
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              </button>

              <span className="text-xs text-zinc-600 dark:text-zinc-400 animate-pulse">
                לחץ בכל מקום או גלול למעבר
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
