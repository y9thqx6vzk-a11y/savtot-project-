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
        <span className="font-mono font-medium text-[#1d1d1f] dark:text-white">{tasksWithOkr}</span> מתוך <span className="font-mono">{allTasks.length}</span> משימות מוגדרות עם OKR כמותי.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div>
        <p className="text-sm text-[#1d1d1f] dark:text-zinc-200 font-medium border-r-2 border-[#1d1d1f] dark:border-white pr-3 mb-2">
          "אם אין בזה מספר, זה לא OKR."
        </p>
        <p className="text-xs text-[#86868b] font-light">
          חבר כל משימה למדד תוצאה מדיד שניתן להוכיח מספרית (זמן טעינה &lt; 1s, תמיכה ב-1,000 משתמשים, 0 באגים קריטיים).
        </p>
      </div>

      <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
        {allTasks.map(task => (
          <div key={task.id} className="p-3.5 border border-[#e2ded5] dark:border-zinc-800 rounded-2xl bg-white/70 dark:bg-zinc-950/70 shadow-sm">
            <div className="text-sm font-medium text-[#1d1d1f] dark:text-white mb-3 flex items-center justify-between">
              <span>{task.title}</span>
              <span className="text-[10px] font-mono text-[#86868b] uppercase border border-[#e2ded5] dark:border-zinc-800 px-2 py-0.5 rounded-full">
                {task.isEssential ? 'MVP' : 'רשות'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">שם המדד</label>
                <input 
                  className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-1 text-sm text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
                  placeholder="למשל: זמן טעינה, כיסוי בדיקות"
                  value={task.okr.metric}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, metric: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">יעד מספרי</label>
                <input 
                  type="number"
                  className="w-full bg-transparent border-b border-[#d8d4ca] dark:border-zinc-800 pb-1 text-sm font-mono text-[#1d1d1f] dark:text-zinc-200 focus:outline-none focus:border-[#1d1d1f] dark:focus:border-white placeholder:text-[#a8a49c]"
                  placeholder="למשל: 100"
                  value={task.okr.target || ""}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, target: Number(e.target.value) } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-[#86868b] font-semibold block mb-1">יחידת מידה</label>
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
        <div className="text-xs text-[#86868b]">התכנון הושלם. מוכן למעבר לדשבורד הבקרה.</div>
        <button 
          onClick={() => setStage(2)}
          className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-6 py-2.5 rounded-full text-xs font-semibold hover:opacity-90 transition-opacity shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
        >
          חולל את לוח השלד (The Skeleton) ←
        </button>
      </div>
    </motion.div>
  );
}
