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
        <span className="font-mono font-medium text-[#1d1d1f] dark:text-white">{tasksWithOkr}</span> מתוך <span className="font-mono">{allTasks.length}</span> משימות מוגדרות עם תוצאות מפתח כמותיות.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Guidance text from user prompt */}
      <div className="space-y-2 text-xs text-[#666] dark:text-zinc-400 font-light leading-relaxed border-r-2 border-[#1d1d1f] dark:border-white pr-3">
        <p>
          בשלב זה נבדוק <strong>כמה ערך המוצר שלנו נותן</strong> – שאנו עומדים ביעדים אמיתיים ולא סתם מסמנים וי על משימות שאינן באמת חשובות.
        </p>
        <p>
          המטרה היא <strong>לא למדוד כמה משימות ביצענו ביחס לזמן שהשקענו</strong>, אלא למדוד אם ביצענו משימות עם <strong>ערך אמיתי</strong>.
        </p>
        <p className="bg-[#f7f5ef] dark:bg-zinc-900 p-2.5 rounded-xl border border-[#e5e1d6] dark:border-zinc-800 text-[#1d1d1f] dark:text-zinc-200">
          <strong>״זה לא תוצאת מפתח אם אין שם מספר״</strong> – מדד כמותי ומספר יעד הם נתון שלא ניתן לפרשנות.
        </p>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
        {allTasks.map(task => (
          <div key={task.id} className="p-3.5 border border-[#e2ded5] dark:border-zinc-800 rounded-2xl bg-white/70 dark:bg-zinc-950/70 shadow-sm">
            <div className="text-sm font-medium text-[#1d1d1f] dark:text-white mb-3 flex items-center justify-between">
              <span>{task.title}</span>
              <span className="text-[10px] font-mono text-[#86868b] uppercase border border-[#e2ded5] dark:border-zinc-800 px-2 py-0.5 rounded-full">
                {task.isEssential ? 'חיוני ל-MVP' : 'תוספת'}
              </span>
            </div>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">
                  מה היעד? מה אנחנו מנסים להשיג?
                </label>
                <input 
                  className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-1 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
                  placeholder="למשל: זמן רינדור מהיר, אימות הנחה קריטית"
                  value={task.okr.metric}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, metric: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">
                  תוצאת מפתח (מספר יעד)
                </label>
                <input 
                  type="number"
                  className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-1 text-sm font-mono text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
                  placeholder="למשל: 100"
                  value={task.okr.target || ""}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, target: Number(e.target.value) } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">
                  יחידת מידה
                </label>
                <input 
                  className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-1 text-sm font-mono text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
                  placeholder="למשל: ms, %, משתמשים"
                  value={task.okr.unit}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, unit: e.target.value } })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-[#e8e5dc] dark:border-zinc-900">
        <div className="text-xs text-[#86868b]">התוכנית הושלמה. נעבור ללוח השלד (The Skeleton) למעקב וביצוע.</div>
        <button 
          onClick={() => setStage(2)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
        >
          עבור ללוח השלד (The Skeleton) ←
        </button>
      </div>
    </motion.div>
  );
}
