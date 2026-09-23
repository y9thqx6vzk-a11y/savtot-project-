"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function Step7OKRs({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateTask } = useAppStore();

  const allTasks = project.avenues.flatMap(a => a.tasks.map(t => ({ ...t, aveId: a.id })));

  if (!isActive && isPast) {
    const tasksWithOkr = allTasks.filter(t => t.okr.target > 0).length;
    return (
      <motion.div layout className="text-zinc-400 text-sm">
        {tasksWithOkr} / {allTasks.length} tasks have quantitative OKRs.
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="space-y-2">
        <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-zinc-700 pl-3 mb-6">
          "If it doesn't have a number, it's not an OKR."
        </p>
        
        <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 no-scrollbar">
          {allTasks.map(task => (
            <div key={task.id} className="p-3 border border-zinc-800 rounded-md bg-zinc-950/50">
              <div className="text-sm text-zinc-300 mb-3">{task.title}</div>
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] text-zinc-600 block mb-1 uppercase">Metric Name</label>
                  <input 
                    className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm focus:outline-none focus:border-zinc-400"
                    placeholder="e.g. Latency, Conversion"
                    value={task.okr.metric}
                    onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, metric: e.target.value } })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-600 block mb-1 uppercase">Target</label>
                  <input 
                    type="number"
                    className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm focus:outline-none focus:border-zinc-400"
                    placeholder="e.g. 50"
                    value={task.okr.target || ""}
                    onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, target: Number(e.target.value) } })}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-zinc-600 block mb-1 uppercase">Unit</label>
                  <input 
                    className="w-full bg-transparent border-b border-zinc-800 pb-1 text-sm focus:outline-none focus:border-zinc-400"
                    placeholder="e.g. ms, %"
                    value={task.okr.unit}
                    onChange={(e) => updateTask(task.aveId, task.id, { okr: { ...task.okr, unit: e.target.value } })}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
