"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step3Avenues({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();
  const [newAve, setNewAve] = useState("");
  const [isCrit, setIsCrit] = useState(true);

  const handleAdd = () => {
    if (!newAve.trim()) return;
    const avenue = {
      id: Math.random().toString(36).substring(2, 9),
      title: newAve.trim(),
      isCriticalPath: isCrit,
      tasks: [],
    };
    // Purge system-suggested sample avenues (ave-*) when user adds their own
    const existingAvenues = project.avenues.filter(a => !a.id.startsWith("ave-"));
    updateProject({ avenues: [...existingAvenues, avenue] });
    setNewAve("");
    setIsCrit(false);
  };

  const handleRemove = (id: string) => {
    updateProject({ avenues: project.avenues.filter(a => a.id !== id) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(4);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-sm space-y-1.5">
        <div className="flex gap-2 text-xs mb-1">
          <span className="text-zinc-500 font-mono">{project.avenues.length} אפיקי פעולה</span>
        </div>
        {project.avenues.map(a => (
          <div key={a.id} className="truncate text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{a.title}</span>
            {a.isCriticalPath && (
              <span className="text-red-600 dark:text-red-400 text-[10px] font-mono border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 px-1.5 rounded">
                שלד בסיסי
              </span>
            )}
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* Explanation */}
      <div className="space-y-2 text-xs text-zinc-500 font-light leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <p>
          בשונה מנושאים שמתעסקים ב״מה התוכן״, <strong>אפיקים מתמקדים בדרך הפעולה</strong> (בין 3 ל-7 דרכים).
        </p>
        <p className="bg-zinc-50 dark:bg-zinc-900/40 p-2.5 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
          <strong>כלל זהב לשלד הפרויקט (3-5 צעדים מרכזיים):</strong> אם מוציאים אפילו שלב אחד מהשלד הבסיסי – התהליך נשבר.
        </p>
      </div>

      {/* Avenues List */}
      <div className="space-y-3">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          אפיקי פעולה (3 עד 7 אפיקים)
        </label>
        
        {project.avenues.map((ave) => (
          <div key={ave.id} className="p-3 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-900/50 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{ave.title}</span>
              {ave.isCriticalPath && (
                <span className="text-[10px] font-mono text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-1.5 py-0.5 rounded font-semibold">
                  צעד חיוני בשלד
                </span>
              )}
            </div>
            <button onClick={() => handleRemove(ave.id)} className="text-zinc-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}

        {/* Add Avenue Form */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 border border-zinc-200 dark:border-zinc-800 rounded space-y-3">
          <input 
            dir="rtl"
            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
            placeholder="הגדר אפיק פעולה חדש..."
            value={newAve}
            onChange={(e) => setNewAve(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
                e.preventDefault();
              }
            }}
          />
          <div className="flex items-center gap-2 pt-1">
            <input 
              type="checkbox" 
              id="crit" 
              checked={isCrit} 
              onChange={e => setIsCrit(e.target.checked)} 
              className="accent-zinc-900 dark:accent-white w-4 h-4 cursor-pointer" 
            />
            <label htmlFor="crit" className="text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
              זהו צעד מרכזי בשלד (3-5 צעדים שבלעדיהם התהליך נשבר לחלוטין)
            </label>
          </div>
          <div className="flex justify-end pt-1">
            <button 
              onClick={handleAdd} 
              className="text-xs bg-zinc-900 text-white dark:bg-white dark:text-black px-4 py-1.5 rounded font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
            >
              + הוסף אפיק פעולה
            </button>
          </div>
        </div>
      </div>

      {/* Pre-mortem */}
      <div className="space-y-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          פרה-מורטם לפרויקט (Pre-Mortem Analysis)
        </label>
        <p className="text-xs text-zinc-500 font-light leading-relaxed">
          מדמיינים מראש מה יכול להשתבש, מה יגרום ל״מוות״ של הפרויקט כדי לתרגם זאת למשימות מנע:
        </p>
        <textarea 
          dir="rtl"
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded-md p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400 leading-relaxed"
          rows={3}
          placeholder="מה יגרום למוות של הפרויקט אם לא ניערך לכך?..."
          value={project.preMortem}
          onChange={(e) => updateProject({ preMortem: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => setActiveStep(4)}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 4 ←
        </button>
      </div>
    </motion.div>
  );
}
