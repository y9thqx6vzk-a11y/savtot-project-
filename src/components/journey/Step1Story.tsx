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
        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          {project.oneLiner || "פרויקט ללא שם"}
        </div>
        <div className="text-xs text-zinc-500 truncate">
          עבור: {project.targetAudience || "טרם הוגדר"}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="text-xs text-zinc-500 font-light border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        כל פרויקט מתחיל בסיפור פשוט, חלום, איזשהו דמיון שיש לי. כאן נכתוב אותו בעזרת 4 שאלות הכוונה:
      </div>

      {/* שאלה 1: תאר את הפרויקט במשפט אחד */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          מה הפרויקט שאני רוצה לבצע? (תאר את הפרויקט במשפט אחד)
        </label>
        <input 
          autoFocus
          className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-xl font-light text-zinc-950 dark:text-zinc-50 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors placeholder:text-zinc-400"
          placeholder="למשל: אפליקציית רשת להנגשת עולם ניהול הפרויקטים ומעקב יומיומי ללא עומס"
          value={project.oneLiner}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ oneLiner: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step1-prob')?.focus()}
        />
      </div>

      {/* שאלה 2: מה הבעיה העיקרית שאני בא לפתור? */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          מה הבעיה העיקרית שאני בא לפתור?
        </label>
        <textarea 
          id="step1-prob"
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400"
          rows={3}
          placeholder="למשל: העומס שיש הרבה פעמים בפרויקטים, וכתוצאה מאותו עומס נוצר בלאגן, ודחייה או ביטול של הפרויקט."
          value={project.problem}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ problem: e.target.value })}
        />
      </div>

      {/* שאלה 3: עבור מי? */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          עבור מי? (קהל היעד)
        </label>
        <input 
          className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 pb-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-950 dark:focus:border-zinc-50 transition-colors placeholder:text-zinc-400"
          placeholder="למשל: לכל אחד שרוצה בצורה מקצועית ופשוטה לייצר תוכנית עבודה, ואז מקום לעקוב אחרי הביצועים שלו בצורה יומיומית."
          value={project.targetAudience}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ targetAudience: e.target.value })}
        />
      </div>

      {/* שאלה 4: איך נראה יום בחיי משתמש, אחרי שהכל מוכן? */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
          איך נראה יום בחיי משתמש, אחרי שהכל מוכן?
        </label>
        <textarea 
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400"
          rows={2}
          placeholder="למשל: המשתמש מבין בכמה שלבים פשוטים איך להתחיל, מתכנן בצורה נכונה, ומנהל מעקב יומיומי רגוע ללא בלאגן."
          value={project.dayInTheLife}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ dayInTheLife: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => setActiveStep(2)}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 2 ←
        </button>
      </div>
    </motion.div>
  );
}
