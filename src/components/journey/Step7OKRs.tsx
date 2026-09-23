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
      <motion.div layout transition={transition} className="text-zinc-400 text-sm">
        <span className="text-white font-mono">{tasksWithOkr}</span> / <span className="font-mono">{allTasks.length}</span> tasks configured with quantitative OKRs.
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div>
        <p className="text-sm text-zinc-300 font-light border-l-2 border-white pl-3 mb-2">
          "If it doesn't have a number, it's not an OKR."
        </p>
        <p className="text-xs text-zinc-500 font-light">
          Anchor every task to an objective metric (e.g. latency &lt; 50ms, conversion = 4%, test coverage = 90%).
        </p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
        {allTasks.map(task => (
          <div key={task.id} className="p-3.5 border border-zinc-900 rounded bg-zinc-950">
            <div className="text-sm font-medium text-white mb-3 flex items-center justify-between">
              <span>{task.title}</span>
              <span className="text-[10px] font-mono text-zinc-500 uppercase">
                {task.isEssential ? 'MVP' : 'Extra'}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-2">
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block mb-1">Metric</label>
                <input 
                  className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm text-zinc-200 focus:outline-none focus:border-zinc-300 placeholder:text-zinc-700"
                  placeholder="e.g. Latency, Conversion"
                  value={task.okr.metric}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, metric: e.target.value } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block mb-1">Target</label>
                <input 
                  type="number"
                  className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-300 placeholder:text-zinc-700"
                  placeholder="e.g. 50"
                  value={task.okr.target || ""}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, target: Number(e.target.value) } })}
                />
              </div>
              <div>
                <label className="text-[10px] tracking-wider uppercase text-zinc-500 font-medium block mb-1">Unit</label>
                <input 
                  className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-300 placeholder:text-zinc-700"
                  placeholder="e.g. ms, %, users"
                  value={task.okr.unit}
                  onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, unit: e.target.value } })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">All set. Ready to generate control dashboard.</div>
        <button 
          onClick={() => setStage(2)}
          className="bg-white text-black px-6 py-2 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
        >
          Generate Skeleton Dashboard
        </button>
      </div>
    </motion.div>
  );
}
