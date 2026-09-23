"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step4OutsideView({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, getAverageOptimismBias, addHistoricalBenchmark } = useAppStore();
  const { transition } = useAppMotion();

  const [plannedText, setPlannedText] = useState(
    project.plannedDurationDays ? `${project.plannedDurationDays} ימים` : ""
  );
  const [actualText, setActualText] = useState(
    project.actualDurationDays ? `${project.actualDurationDays} ימים` : ""
  );

  const plannedParsed = parseDuration(plannedText);
  const actualParsed = parseDuration(actualText);

  // Auto-calculate optimism gap whenever parsed days change
  useEffect(() => {
    if (plannedParsed && actualParsed && plannedParsed.days > 0 && actualParsed.days > 0) {
      const gap = ((actualParsed.days - plannedParsed.days) / plannedParsed.days) * 100;
      updateProject({
        plannedDurationDays: plannedParsed.days,
        actualDurationDays: actualParsed.days,
        optimismGapPercent: Math.round(gap),
      });
    }
  }, [plannedParsed?.days, actualParsed?.days, updateProject]);

  const handleSaveBenchmark = () => {
    if (project.referenceProject && plannedParsed && actualParsed) {
      addHistoricalBenchmark({
        title: project.referenceProject,
        plannedDays: plannedParsed.days,
        actualDays: actualParsed.days,
        gapPercent: project.optimismGapPercent,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSaveBenchmark();
      setActiveStep(5);
    }
  };

  const avgBias = getAverageOptimismBias();

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-sm space-y-1">
        <div className="font-medium text-[#1d1d1f] dark:text-zinc-200 truncate">
          פרויקט רפרנס: {project.referenceProject || "ללא רפרנס"}
        </div>
        <div className="text-xs text-[#86868b] font-mono">
          תוכנן: {project.plannedDurationDays} ימים | בפועל: {project.actualDurationDays} ימים | פער: <span className={project.optimismGapPercent > 20 ? 'text-[#1d1d1f] dark:text-white font-bold' : 'text-[#86868b]'}>+{project.optimismGapPercent}%</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <p className="text-sm text-[#86868b] dark:text-zinc-400 leading-relaxed font-light">
        כדי למנוע את <span className="text-[#1d1d1f] dark:text-white font-medium">כשל ההתחייבות (Commitment Fallacy)</span>, עגן את הלו״ז לפרויקט עבר דומה. כמה זמן הוא באמת ארך?
      </p>

      {/* Aggregate Bias Highlight */}
      {project.historicalBenchmarks && project.historicalBenchmarks.length > 0 && (
        <div className="p-4 bg-[#f5f3ee] dark:bg-zinc-950 border border-[#e5e1d6] dark:border-zinc-850 rounded-2xl flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">כיול היסטורי אוטומטי</div>
            <div className="text-xs text-[#1d1d1f] dark:text-zinc-300 mt-0.5">
              על בסיס {project.historicalBenchmarks.length} פרויקטים קודמים, ממוצע האופטימיות שלך הוא <span className="font-mono font-bold text-[#1d1d1f] dark:text-white">+{avgBias}%</span>
            </div>
          </div>
          <span className="text-xs font-mono text-[#555] dark:text-zinc-400 bg-white/80 dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 px-2.5 py-1 rounded-full shadow-sm">
            מכויל אישית
          </span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">פרויקט רפרנס דומה</label>
        <input 
          className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white transition-colors font-medium text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c]"
          placeholder="למשל: גרסה 1 של המוצר הקודם, או מודול דומה"
          value={project.referenceProject}
          onChange={(e) => updateProject({ referenceProject: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">משך מתוכנן</label>
            {plannedParsed && (
              <span className="text-[11px] font-mono text-[#555] dark:text-zinc-400">
                {plannedParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white transition-colors font-mono text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c]"
            placeholder="למשל: שבועיים, 14 יום, 48 שעות"
            value={plannedText}
            onChange={(e) => setPlannedText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">משך בפועל</label>
            {actualParsed && (
              <span className="text-[11px] font-mono text-[#555] dark:text-zinc-400">
                {actualParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white transition-colors font-mono text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c]"
            placeholder="למשל: 3 שבועות, 21 יום"
            value={actualText}
            onChange={(e) => setActualText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Calculated Optimism Gap Card */}
      <div className="bg-[#f7f5ef] dark:bg-zinc-950 p-4 border border-[#e5e1d6] dark:border-zinc-850 rounded-2xl">
        <div className="flex justify-between items-baseline">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-[#86868b] font-semibold">פער אופטימיות מחושב</div>
            <div className="text-2xl font-light font-mono mt-1 text-[#1d1d1f] dark:text-white tracking-tight">
              +{project.optimismGapPercent}%
            </div>
          </div>
          {project.optimismGapPercent > 0 && (
            <span className="text-xs text-[#666] dark:text-zinc-400 font-mono">
              תוספת באפר מומלצת: כ-{Math.ceil((plannedParsed?.days || 14) * (project.optimismGapPercent / 100))} ימים
            </span>
          )}
        </div>
        <p className="text-xs text-[#86868b] mt-2 font-light">
          כיול קוגניטיבי: צוותים נוטים להעריך בחסר חיכוך בלתי צפוי ב-{project.optimismGapPercent || 30}%. בשלב 6 נזין מקדם ביטחון זה באופן יזום.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => {
            handleSaveBenchmark();
            setActiveStep(5);
          }}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב הבא ←
        </button>
      </div>
    </motion.div>
  );
}
