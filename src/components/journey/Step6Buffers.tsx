"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step6Buffers({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, updateTask, updateAvenue } = useAppStore();
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

      {/* Project Dates & Total Buffer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
            לוח זמנים כללי לפרויקט
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-[11px] text-zinc-500 block mb-1">תאריך התחלה</span>
              <input 
                type="date"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300"
                value={project.startDate || ""}
                onChange={(e) => updateProject({ startDate: e.target.value })}
              />
            </div>
            <div>
              <span className="text-[11px] text-zinc-500 block mb-1">תאריך יעד לסיום</span>
              <input 
                type="date"
                className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded px-2.5 py-1.5 text-zinc-900 dark:text-zinc-100 font-mono text-xs focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-300"
                value={project.endDate || ""}
                onChange={(e) => updateProject({ endDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block">
              תקציב חוצץ ביטחון כולל
            </label>
            {parsed && (
              <span className="text-[11px] font-mono text-zinc-500">
                פוענח: {parsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            dir="rtl"
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded px-3 py-1.5 text-base focus:outline-none font-mono text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 transition-colors"
            placeholder="למשל: שבוע, 7 ימים, 48 שעות"
            value={bufferText}
            onChange={(e) => setBufferText(e.target.value)}
          />
        </div>
      </div>

      {/* Avenue & Task Milestones / Dates Scheduling */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs tracking-wider uppercase font-semibold text-zinc-500 dark:text-zinc-400 block">
            הגדרת זמנים לאפיקים ולמשימות (יוצגו בלוח השנה)
          </label>
          <span className="text-[11px] text-zinc-400 font-mono">אופציונלי</span>
        </div>

        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 no-scrollbar">
          {project.avenues.map((ave) => (
            <div key={ave.id} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-2.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-400 font-mono">
                  אפיק: {ave.title}
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <input 
                    type="date"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-800 dark:text-zinc-200 font-mono"
                    value={ave.startDate || ""}
                    onChange={(e) => updateAvenue(ave.id, { startDate: e.target.value })}
                    title="התחלת האפיק"
                  />
                  <span className="text-zinc-400">עד</span>
                  <input 
                    type="date"
                    className="bg-zinc-50 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1 text-[11px] text-zinc-800 dark:text-zinc-200 font-mono"
                    value={ave.endDate || ""}
                    onChange={(e) => updateAvenue(ave.id, { endDate: e.target.value })}
                    title="סיום האפיק"
                  />
                </div>
              </div>

              {/* Tasks under avenue with date selection */}
              <div className="mr-3 border-r border-zinc-200 dark:border-zinc-800 pr-3 space-y-1.5">
                {ave.tasks.map((task) => (
                  <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1 text-xs">
                    <span className="text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
                      • {task.title}
                      {task.isBottleneck && (
                        <span className="mr-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1 rounded">צוואר בקבוק</span>
                      )}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <input 
                        type="date"
                        className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-[10px] text-zinc-800 dark:text-zinc-200 font-mono"
                        value={task.startDate || ""}
                        onChange={(e) => updateTask(ave.id, task.id, { startDate: e.target.value })}
                        title="תאריך התחלה"
                      />
                      <span className="text-zinc-400 text-[10px]">עד</span>
                      <input 
                        type="date"
                        className="bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-1.5 py-0.5 text-[10px] text-zinc-800 dark:text-zinc-200 font-mono"
                        value={task.endDate || ""}
                        onChange={(e) => updateTask(ave.id, task.id, { endDate: e.target.value })}
                        title="תאריך יעד"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
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
