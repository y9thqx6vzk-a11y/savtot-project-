"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step1Story({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(2);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-sm space-y-1">
        <div className="font-medium text-[#1d1d1f] dark:text-white truncate">
          {project.oneLiner || "פרויקט ללא שם"}
        </div>
        <div className="text-xs text-[#86868b] truncate">
          קהל יעד: {project.targetAudience || "טרם הוגדר"}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          משפט מחץ לפרויקט (One-Liner)
        </label>
        <input 
          autoFocus
          className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-xl font-light text-[#1d1d1f] dark:text-white focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white transition-colors placeholder:text-[#a8a49c] dark:placeholder:text-zinc-700"
          placeholder="למשל: כלי תכנון פרויקטים נקי להפחתת עומס קוגניטיבי"
          value={project.oneLiner}
          onChange={(e) => updateProject({ oneLiner: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step1-prob')?.focus()}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          הבעיה המרכזית (The Problem)
        </label>
        <textarea 
          id="step1-prob"
          className="w-full bg-white/70 dark:bg-zinc-950/70 border border-[#e2ded5] dark:border-zinc-800 focus:border-[#1d1d1f] dark:focus:border-zinc-500 rounded-xl p-3 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-[#a8a49c] dark:placeholder:text-zinc-700 shadow-sm"
          rows={2}
          placeholder="איזה כאב חד הפרויקט בא לעקור מהשורש?"
          value={project.problem}
          onChange={(e) => updateProject({ problem: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          קהל היעד (Target Audience)
        </label>
        <input 
          className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white transition-colors placeholder:text-[#a8a49c] dark:placeholder:text-zinc-700"
          placeholder="עבור מי בדיוק הפרויקט מיועד?"
          value={project.targetAudience}
          onChange={(e) => updateProject({ targetAudience: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          היום שאחרי ההשקה (Day in the Life)
        </label>
        <textarea 
          className="w-full bg-white/70 dark:bg-zinc-950/70 border border-[#e2ded5] dark:border-zinc-800 focus:border-[#1d1d1f] dark:focus:border-zinc-500 rounded-xl p-3 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-[#a8a49c] dark:placeholder:text-zinc-700 shadow-sm"
          rows={2}
          placeholder="תאר איך נראית המציאות לאחר שהפרויקט פועל בהצלחה..."
          value={project.dayInTheLife}
          onChange={(e) => updateProject({ dayInTheLife: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר מהיר
        </div>
        <button 
          onClick={() => setActiveStep(2)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב הבא ←
        </button>
      </div>
    </motion.div>
  );
}
