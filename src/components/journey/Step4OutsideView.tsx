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
        addedValue: project.addedValueText,
        lessonsLearned: project.lessonsLearnedText,
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
        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          רפרנס: {project.referenceProject || "ללא רפרנס"}
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          תוכנן: {project.plannedDurationDays} ימים | בפועל: {project.actualDurationDays} ימים | פער: <span className={project.optimismGapPercent > 20 ? 'text-zinc-950 dark:text-white font-bold' : 'text-zinc-500'}>+{project.optimismGapPercent}%</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="text-xs text-zinc-500 font-light leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        מחפשים פרויקטים דומים ובודקים: כמה זמן הם לקחו? איזה ערך מוסף יש בפרויקט שלנו? מה אפשר ללמוד מהפרויקטים האלו?
      </div>

      {/* Aggregate Bias Highlight */}
      {project.historicalBenchmarks && project.historicalBenchmarks.length > 0 && (
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono font-semibold">כיול היסטורי אוטומטי</div>
            <div className="text-xs text-zinc-800 dark:text-zinc-200 mt-0.5">
              ממוצע האופטימיות שלך מ-{project.historicalBenchmarks.length} פרויקטים: <span className="font-mono font-bold text-zinc-950 dark:text-white">+{avgBias}%</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
            כיול רפרנס
          </span>
        </div>
      )}

      {/* Reference Project */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          פרויקט דומה שנבנה בעבר (Reference Project)
        </label>
        <input 
          className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-medium text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400"
          placeholder="שם של פרויקט דומה בעבר..."
          value={project.referenceProject}
          onChange={(e) => updateProject({ referenceProject: e.target.value })}
        />
      </div>

      {/* Durations */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">כמה זמן תוכנן?</label>
            {plannedParsed && (
              <span className="text-[11px] font-mono text-zinc-500">
                {plannedParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-mono text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400"
            placeholder="למשל: שבועיים, 14 יום"
            value={plannedText}
            onChange={(e) => setPlannedText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">כמה זמן לקח בפועל?</label>
            {actualParsed && (
              <span className="text-[11px] font-mono text-zinc-500">
                {actualParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-100 transition-colors font-mono text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400"
            placeholder="למשל: 4 שבועות, 28 יום"
            value={actualText}
            onChange={(e) => setActualText(e.target.value)}
          />
        </div>
      </div>

      {/* Added Value */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          איזה ערך מוסף ייחודי יש בפרויקט שלנו?
        </label>
        <textarea 
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400"
          rows={2}
          placeholder="במה הפתרון שלנו פשוט, חזק ומדויק יותר?"
          value={project.addedValueText || ""}
          onChange={(e) => updateProject({ addedValueText: e.target.value })}
        />
      </div>

      {/* Lessons Learned */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          מה אפשר ללמוד מהפרויקטים האלו?
        </label>
        <textarea 
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400"
          rows={2}
          placeholder="לקחים מרכזיים מפרויקט העבר..."
          value={project.lessonsLearnedText || ""}
          onChange={(e) => updateProject({ lessonsLearnedText: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Gap Display */}
      {project.optimismGapPercent > 0 && (
        <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 border border-zinc-200 dark:border-zinc-800 rounded flex justify-between items-center">
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-400 font-semibold">פער סטיית זמנים</div>
            <div className="text-lg font-mono text-zinc-950 dark:text-white">+{project.optimismGapPercent}% מעבר למתוכנן</div>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            תוספת באפר מומלצת: כ-{Math.ceil((plannedParsed?.days || 14) * (project.optimismGapPercent / 100))} ימים
          </span>
        </div>
      )}

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => {
            handleSaveBenchmark();
            setActiveStep(5);
          }}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 5 ←
        </button>
      </div>
    </motion.div>
  );
}
