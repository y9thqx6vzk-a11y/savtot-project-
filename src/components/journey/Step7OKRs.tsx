"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step7OKRs({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateTask, setStage } = useAppStore();
  const { transition } = useAppMotion();

  const allTasks = project.avenues.flatMap(a => a.tasks.map(t => ({ ...t, aveId: a.id })));

  if (!isActive && isPast) {
    const tasksWithOkr = allTasks.filter(t => t.okr.target > 0).length;
    return (
      <motion.div layout transition={transition} className="text-sm">
        <span className="font-mono font-medium text-zinc-900 dark:text-zinc-100">{tasksWithOkr}</span> מתוך <span className="font-mono">{allTasks.length}</span> משימות מוגדרות עם תוצאות מפתח כמותיות.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Guidance text from user prompt */}
      <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <p>
          בשלב זה נבדוק <strong>כמה ערך המוצר שלנו נותן</strong> – שאנו עומדים ביעדים אמיתיים ולא סתם מסמנים וי על משימות שאינן באמת חשובות.
        </p>
        <p>
          המטרה היא <strong>לא למדוד כמה משימות ביצענו ביחס לזמן שהשקענו</strong>, אלא למדוד אם ביצענו משימות עם <strong>ערך אמיתי</strong>.
        </p>
        <p className="bg-zinc-50 dark:bg-zinc-900 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">
          <strong>״זה לא תוצאת מפתח אם אין שם מספר״</strong> – מדד כמותי ומספר יעד הם נתון שלא ניתן לפרשנות.
        </p>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
        {allTasks.map(task => (
          <div key={task.id} className="p-3.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 shadow-sm">
            <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3 flex items-center justify-between">
              <span>{task.title}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase border border-zinc-200 dark:border-zinc-800 px-2 py-0.5 rounded">
                {task.isEssential ? 'חיוני ל-MVP' : 'תוספת'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">
                  מה היעד? מה אנחנו מנסים להשיג?
                </label>
                <input 
                  dir="rtl"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-4 py-2.5 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
                  placeholder="למשל: זמן רינדור מהיר, אימות הנחה קריטית"
                  value={task.okr.metric}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, metric: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">
                  תוצאת מפתח (מספר יעד)
                </label>
                <input 
                  type="number"
                  dir="rtl"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-4 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
                  placeholder="למשל: 100"
                  value={task.okr.target || ""}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, target: Number(e.target.value) } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 dark:text-zinc-400 font-semibold block mb-1">
                  יחידת מידה
                </label>
                <input 
                  dir="rtl"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-4 py-2.5 text-sm font-mono text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors placeholder:text-zinc-400"
                  placeholder="למשל: ms, %, משתמשים"
                  value={task.okr.unit}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, unit: e.target.value } })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-500 dark:text-zinc-400">התוכנית הושלמה. נעבור ללוח השלד (The Skeleton) למעקב וביצוע.</div>
        <button 
          onClick={() => setStage(2)}
          className="bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 px-6 py-2.5 rounded-md text-xs font-medium hover:bg-zinc-800 dark:hover:bg-white transition-colors shadow-sm"
        >
          עבור ללוח השלד (The Skeleton) ←
        </button>
      </div>
    </motion.div>
  );
}
