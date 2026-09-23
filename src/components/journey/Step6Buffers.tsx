"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step6Buffers({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, updateTask, getSuggestedBufferDays, getAverageOptimismBias } = useAppStore();
  const { transition } = useAppMotion();

  const [bufferText, setBufferText] = useState(
    project.totalBufferDays ? `${project.totalBufferDays} ימים` : ""
  );

  const parsed = parseDuration(bufferText);

  useEffect(() => {
    if (parsed && parsed.days >= 0) {
      updateProject({ totalBufferDays: parsed.days });
    }
  }, [parsed?.days, updateProject]);

  const handleTaskBottleneckToggle = (aveId: string, taskId: string, current: boolean) => {
    updateTask(aveId, taskId, { isBottleneck: !current });
  };

  const allTasks = project.avenues.flatMap(a => a.tasks.map(t => ({ ...t, aveId: a.id })));
  const bottleneckTasks = allTasks.filter(t => t.isBottleneck);
  const suggestedDays = getSuggestedBufferDays();
  const avgBias = getAverageOptimismBias();

  const handleApplySuggested = () => {
    setBufferText(`${suggestedDays} ימים`);
    updateProject({ totalBufferDays: suggestedDays });
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-sm space-y-1">
        <div className="font-medium text-[#1d1d1f] dark:text-white font-mono">
          חוצץ כולל: {project.totalBufferDays} ימים
        </div>
        <div className="text-xs text-[#86868b]">
          {bottleneckTasks.length} משימות סומנו כצוואר בקבוק / נתיב קריטי
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
            תקציב חוצץ כולל (Total Buffer Budget)
          </label>
          {parsed && (
            <span className="text-xs font-mono text-[#555] dark:text-zinc-300">
              פוענח: {parsed.formatted}
            </span>
          )}
        </div>
        <p className="text-xs text-[#86868b] font-light">
          כמה ימי עיכוב כוללים הפרויקט מסוגל לספוג לפני קריסה של תאריך היעד הסופי?
        </p>

        <input 
          type="text"
          className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-2 text-2xl focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white font-mono text-[#1d1d1f] dark:text-white placeholder:text-[#a8a49c] tracking-tight"
          placeholder="למשל: שבוע, 7 ימים, 48 שעות"
          value={bufferText}
          onChange={(e) => setBufferText(e.target.value)}
        />

        {suggestedDays > 0 && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#666] dark:text-zinc-400">
              המלצה לפי הטיית עבר (+{avgBias}%): <strong className="text-[#1d1d1f] dark:text-white font-mono">{suggestedDays} ימים</strong>
            </span>
            <button
              onClick={handleApplySuggested}
              className="text-xs text-[#1d1d1f] dark:text-zinc-300 bg-white/80 dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-700 hover:border-[#1d1d1f] px-3 py-1 rounded-full transition-colors font-medium shadow-sm"
            >
              החל באפר מוצע
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-[#e8e5dc] dark:border-zinc-900">
        <div>
          <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
            תיוג צווארי בקבוק (Bottlenecks)
          </label>
          <p className="text-xs text-[#86868b] font-light mt-0.5">
            סמן משימות שלא ניתן להקביל. כל עיכוב בהן מקזז ישירות מתקציב החוצץ הכללי.
          </p>
        </div>
        
        <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
          {allTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                task.isBottleneck 
                  ? 'bg-[#1d1d1f] text-white dark:bg-white dark:text-black border-transparent shadow-sm' 
                  : 'bg-white/70 dark:bg-zinc-950/70 border-[#e2ded5] dark:border-zinc-800 text-[#555] hover:bg-[#f7f5ef]'
              }`}
              onClick={() => handleTaskBottleneckToggle(task.aveId, task.id, task.isBottleneck)}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${task.isBottleneck ? 'bg-amber-400' : 'bg-[#c5c0b5]'}`} />
                <span className="text-sm font-medium">{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {task.isBottleneck && (
                  <span className="text-[10px] font-mono tracking-wider uppercase border border-current/30 px-2 py-0.5 rounded-full">
                    צוואר בקבוק
                  </span>
                )}
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.isBottleneck ? 'border-current bg-current/20' : 'border-[#c5c0b5]'}`}>
                  {task.isBottleneck && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Light Rules */}
      <div className="bg-[#f7f5ef] dark:bg-zinc-950 p-4 border border-[#e5e1d6] dark:border-zinc-900 rounded-2xl">
        <div className="text-xs text-[#86868b] font-semibold mb-3 tracking-wider uppercase">
          מדיניות רמזור החוצצים (Traffic Light System)
        </div>
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-[#e8e5dc] dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
            <span className="font-mono text-[#555] dark:text-zinc-300">&lt; 33% (תקין)</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-[#e8e5dc] dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
            <span className="font-mono text-[#555] dark:text-zinc-300">33%-66% (זהירות)</span>
          </div>
          <div className="flex items-center gap-2 bg-white/70 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-[#e8e5dc] dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
            <span className="font-mono text-[#555] dark:text-zinc-300">&gt; 66% (קריטי)</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => setActiveStep(7)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב הבא ←
        </button>
      </div>
    </motion.div>
  );
}
