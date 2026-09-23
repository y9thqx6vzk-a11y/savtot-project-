"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";

export default function Step6Buffers({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, updateTask } = useAppStore();

  const handleTaskBottleneckToggle = (aveId: string, taskId: string, current: boolean) => {
    updateTask(aveId, taskId, { isBottleneck: !current });
  };

  const allTasks = project.avenues.flatMap(a => a.tasks.map(t => ({ ...t, aveId: a.id })));
  const bottleneckTasks = allTasks.filter(t => t.isBottleneck);

  if (!isActive && isPast) {
    return (
      <motion.div layout className="text-zinc-400 text-sm space-y-1">
        <div>Total Buffer: {project.totalBufferDays} days</div>
        <div className="text-xs text-zinc-500">{bottleneckTasks.length} Bottleneck Tasks</div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Total Buffer Budget (Days)</label>
        <p className="text-xs text-zinc-600 mb-2">How many days can the project slip before it's a critical failure?</p>
        <input 
          type="number"
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-2xl focus:outline-none focus:border-zinc-400"
          placeholder="e.g. 7"
          value={project.totalBufferDays || ""}
          onChange={(e) => updateProject({ totalBufferDays: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-4 pt-4">
        <label className="text-sm text-zinc-500 block">Identify Bottleneck Tasks</label>
        <p className="text-xs text-zinc-600 mb-2">Select tasks that, if delayed, delay the entire project (Critical Path).</p>
        
        <div className="max-h-64 overflow-y-auto space-y-1 pr-2 no-scrollbar">
          {allTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-900/50 cursor-pointer" onClick={() => handleTaskBottleneckToggle(task.aveId, task.id, task.isBottleneck)}>
              <span className={`text-sm ${task.isBottleneck ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>{task.title}</span>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${task.isBottleneck ? 'border-yellow-500 bg-yellow-500/20' : 'border-zinc-700'}`}>
                {task.isBottleneck && <span className="w-2 h-2 rounded-full bg-yellow-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md">
        <div className="text-xs text-zinc-400 font-medium mb-3">Traffic Light Configuration (Auto)</div>
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#22c55e]" /> Green: &lt; 33% consumed</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#eab308]" /> Yellow: 33% - 66% consumed</div>
          <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#ef4444]" /> Red: &gt; 66% consumed</div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-end border-t border-zinc-800/50">
        <button 
          onClick={() => setActiveStep(7)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
