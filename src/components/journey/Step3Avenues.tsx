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
      title: newAve,
      isCriticalPath: isCrit,
      tasks: [],
    };
    updateProject({ avenues: [...project.avenues, avenue] });
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
          <span className="text-[#86868b] font-mono">{project.avenues.length} אפיקי פעולה</span>
        </div>
        {project.avenues.map(a => (
          <div key={a.id} className="truncate text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#86868b]" />
            <span className="font-medium text-[#1d1d1f] dark:text-zinc-200">{a.title}</span>
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
      
      {/* Explanation from user prompt */}
      <div className="space-y-2 text-xs text-[#666] dark:text-zinc-400 font-light leading-relaxed border-r-2 border-[#1d1d1f] dark:border-white pr-3">
        <p>
          בשונה מנושאים שמתעסקים ב״מה התוכן״, <strong>אפיקים מתמקדים בדרך הפעולה</strong>. נחלק את הפרויקט לבין <strong>3 עד 7 דרכי פעולה</strong> שונות המספרות את סיפור חוויית המשתמש מהמוצר.
        </p>
        <p className="bg-[#f7f5ef] dark:bg-zinc-900 p-2.5 rounded-xl border border-[#e5e1d6] dark:border-zinc-800 text-[#1d1d1f] dark:text-zinc-200">
          <strong>כלל זהב לשלד הפרויקט (3-5 צעדים מרכזיים):</strong> אם מוציאים אפילו שלב אחד מהשלד הבסיסי – התהליך כולו נשבר.
        </p>
      </div>

      {/* Avenues List */}
      <div className="space-y-3">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          אפיקי פעולה (בין 3 ל-7 אפיקים)
        </label>
        
        {project.avenues.map((ave) => (
          <div key={ave.id} className="p-3.5 border border-[#e2ded5] dark:border-zinc-800 rounded-xl bg-white/70 dark:bg-zinc-950/70 shadow-sm flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#1d1d1f] dark:text-white">{ave.title}</span>
              {ave.isCriticalPath && (
                <span className="text-[10px] font-mono text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full font-semibold">
                  צעד חיוני בשלד (Critical)
                </span>
              )}
            </div>
            <button onClick={() => handleRemove(ave.id)} className="text-[#86868b] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">✕</button>
          </div>
        ))}

        {/* Add Avenue */}
        <div className="bg-[#f7f5ef] dark:bg-zinc-950 p-4 border border-[#e5e1d6] dark:border-zinc-900 rounded-2xl space-y-3">
          <input 
            className="w-full bg-transparent border-b border-[#dcd8ce] dark:border-zinc-800 pb-2 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
            placeholder="הגדר אפיק פעולה (למשל: קליטת החלום, ניהול לו״ז דינמי, לוח בקרה)..."
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
              className="accent-[#1d1d1f] w-4 h-4 cursor-pointer" 
            />
            <label htmlFor="crit" className="text-xs text-[#555] dark:text-zinc-400 cursor-pointer select-none">
              זהו צעד מרכזי בשלד (3-5 צעדים שבלעדיהם התהליך נשבר לחלוטין)
            </label>
          </div>
          <button 
            onClick={handleAdd} 
            className="text-xs text-[#1d1d1f] dark:text-zinc-300 font-semibold hover:opacity-80 transition-opacity pt-1 block"
          >
            + הוסף אפיק פעולה
          </button>
        </div>
      </div>

      {/* Pre-mortem Analysis */}
      <div className="space-y-2 pt-4 border-t border-[#e8e5dc] dark:border-zinc-900">
        <label className="text-xs tracking-wider uppercase font-semibold text-[#86868b] block">
          פרה-מורטם לפרויקט (Pre-Mortem Analysis)
        </label>
        <p className="text-xs text-[#86868b] font-light leading-relaxed">
          מדמיינים מראש מה יכול להשתבש, מה יגרום ל״מוות״ של הפרויקט. מטרת הפרה-מורטם היא להגדיר כבר עכשיו את הסיכונים והחששות ולתרגם אותם למשימות בשלב הבא:
        </p>
        <textarea 
          className="w-full bg-white/70 dark:bg-zinc-950/70 border border-[#e2ded5] dark:border-zinc-800 focus:border-[#1d1d1f] dark:focus:border-zinc-500 rounded-xl p-3 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-[#a8a49c] dark:placeholder:text-zinc-700 shadow-sm"
          rows={3}
          placeholder="מה יגרום למוות של הפרויקט? (למשל: בלאגן בריבוי פיצ'רים, חוסר אימוץ על ידי משתמשים עקב מורכבות)..."
          value={project.preMortem}
          onChange={(e) => updateProject({ preMortem: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">
          הקש <kbd className="px-2 py-0.5 bg-white dark:bg-zinc-900 border border-[#d8d4ca] dark:border-zinc-800 rounded font-mono text-[11px] shadow-sm">Cmd + Enter</kbd> למעבר
        </div>
        <button 
          onClick={() => setActiveStep(4)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-sm"
        >
          המשך לשלב 4 ←
        </button>
      </div>
    </motion.div>
  );
}
