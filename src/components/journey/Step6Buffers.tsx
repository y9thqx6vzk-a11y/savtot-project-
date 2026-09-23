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
        <div className="font-medium text-zinc-900 dark:text-zinc-100 font-mono">
          חוצץ ביטחון כולל: {project.totalBufferDays} ימים
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {bottleneckTasks.length} משימות בצווארי בקבוק וענפי משנה
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Guidance text from user prompt */}
      <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <p>
          <strong>יש להימנע מלו״ז קשיח</strong> – המטרה היא לו״ז דינמי עם רמת אמינות באחוזים להצלחה בעמידה בזמנים.
        </p>
        <p>
          <strong>מציבים חוצץ ביטחון בשלושה מקומות קריטיים:</strong>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px] pt-1 font-mono">
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <strong className="block text-zinc-900 dark:text-zinc-100 mb-1 font-sans text-xs">1. צוואר בקבוק</strong>
            משימות שללא סיומן שאר הפרויקט ממתין.
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <strong className="block text-zinc-900 dark:text-zinc-100 mb-1 font-sans text-xs">2. הזנת ענפי משנה</strong>
            שלבים שאינם קריטיים לשלד אך יש להם ערך.
          </div>
          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <strong className="block text-zinc-900 dark:text-zinc-100 mb-1 font-sans text-xs">3. סוף פרויקט</strong>
            בלימת סטיות כוללת לפני מסירה סופית.
          </div>
        </div>
      </div>

      {/* Input Total Buffer */}
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-xs tracking-wider uppercase font-semibold text-zinc-500 dark:text-zinc-400 block">
            תקציב חוצץ ביטחון כולל (ימים / שבועות)
          </label>
          {parsed && (
            <span className="text-xs font-mono text-zinc-700 dark:text-zinc-300">
              פוענח: {parsed.formatted}
            </span>
          )}
        </div>

        <input 
          type="text"
          dir="rtl"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-2 text-xl focus:outline-none font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
          placeholder="למשל: שבוע, 7 ימים, 48 שעות"
          value={bufferText}
          onChange={(e) => setBufferText(e.target.value)}
        />

        {suggestedDays > 0 && (
          <div className="pt-1 flex items-center justify-between">
            <span className="text-xs text-zinc-600 dark:text-zinc-400">
              המלצה לפי הטיית עבר (+{avgBias}%): <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{suggestedDays} ימים</strong>
            </span>
            <button
              onClick={handleApplySuggested}
              className="text-xs text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400 px-3 py-1 rounded-md transition-colors font-medium shadow-sm"
            >
              החל באפר מוצע
            </button>
          </div>
        )}
      </div>

      {/* Bottlenecks Tagging */}
      <div className="space-y-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <div>
          <label className="text-xs tracking-wider uppercase font-semibold text-zinc-500 dark:text-zinc-400 block">
            מיקום חוצץ 1: סימון צווארי בקבוק בפרויקט
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal mt-0.5">
            סמן את המשימות שכל עיכוב בהן פוגע ישירות בחוצץ הפרויקט כולו:
          </p>
        </div>
        
        <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 no-scrollbar">
          {allTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
                task.isBottleneck 
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent shadow-sm' 
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850'
              }`}
              onClick={() => handleTaskBottleneckToggle(task.aveId, task.id, task.isBottleneck)}
            >
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${task.isBottleneck ? 'bg-amber-400' : 'bg-zinc-300 dark:bg-zinc-700'}`} />
                <span className="text-sm font-medium">{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {task.isBottleneck && (
                  <span className="text-[10px] font-mono tracking-wider uppercase border border-current/30 px-2 py-0.5 rounded">
                    צוואר בקבוק
                  </span>
                )}
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.isBottleneck ? 'border-current bg-current/20' : 'border-zinc-300 dark:border-zinc-700'}`}>
                  {task.isBottleneck && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Light Rules with exact user definitions */}
      <div className="bg-zinc-50 dark:bg-zinc-900/60 p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-3">
        <div className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider uppercase">
          שיטת הרמזור של חוצצי הביטחון
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] mt-1 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100 block">ירוק – ניצול פחות משליש של החוצץ (&lt; 33%):</strong>
              <span className="text-zinc-600 dark:text-zinc-400">הפרויקט מתקדם כמתוכנן, אין צורך בהתערבות.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mt-1 shrink-0 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100 block">צהוב – ניצול בין שליש לשני שליש של החוצץ (33%-66%):</strong>
              <span className="text-zinc-600 dark:text-zinc-400">מעקב מקרוב וזיהוי מגמות איפה נוצר העיכוב.</span>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444] mt-1 shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            <div>
              <strong className="text-zinc-900 dark:text-zinc-100 block">אדום – ניצול מעל שני שליש של החוצץ (&gt; 66%):</strong>
              <span className="text-zinc-600 dark:text-zinc-400">איתור חסמים והתערבות ממוקדת כדי להחזיר את הפרויקט למסלול.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          הקש <kbd className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[11px]">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => setActiveStep(7)}
          className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-5 py-2 rounded-md text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm"
        >
          המשך לשלב 7 ←
        </button>
      </div>
    </motion.div>
  );
}
