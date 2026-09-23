"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Step4OutsideView({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();

  // Auto-calculate optimism gap
  useEffect(() => {
    if (project.plannedDurationDays > 0 && project.actualDurationDays > 0) {
      const gap = ((project.actualDurationDays - project.plannedDurationDays) / project.plannedDurationDays) * 100;
      updateProject({ optimismGapPercent: Math.round(gap) });
    } else {
      updateProject({ optimismGapPercent: 0 });
    }
  }, [project.plannedDurationDays, project.actualDurationDays, updateProject]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(5);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout className="text-zinc-400 text-sm space-y-1">
        <div className="truncate">Reference: {project.referenceProject || "None"}</div>
        <div className="text-xs text-zinc-500">
          Planned: {project.plannedDurationDays}d | Actual: {project.actualDurationDays}d | Gap: <span className={project.optimismGapPercent > 20 ? 'text-yellow-500' : 'text-zinc-400'}>+{project.optimismGapPercent}%</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <p className="text-sm text-zinc-400 leading-relaxed">
        To prevent <span className="text-zinc-200">Commitment Fallacy</span>, let's look at similar past projects. How long did they <i>actually</i> take?
      </p>

      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Reference Project</label>
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
          placeholder="Name of a past similar project"
          value={project.referenceProject}
          onChange={(e) => updateProject({ referenceProject: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 block">Planned Duration (Days)</label>
          <input 
            type="number"
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
            placeholder="e.g. 14"
            value={project.plannedDurationDays || ""}
            onChange={(e) => updateProject({ plannedDurationDays: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-zinc-500 block">Actual Duration (Days)</label>
          <input 
            type="number"
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
            placeholder="e.g. 21"
            value={project.actualDurationDays || ""}
            onChange={(e) => updateProject({ actualDurationDays: Number(e.target.value) })}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md">
        <div className="text-xs text-zinc-500">Calculated Optimism Gap</div>
        <div className={`text-2xl font-light mt-1 ${project.optimismGapPercent > 20 ? 'text-yellow-500' : 'text-zinc-300'}`}>
          +{project.optimismGapPercent}%
        </div>
        {project.optimismGapPercent > 0 && (
          <div className="text-xs text-zinc-500 mt-2">
            Consider adding at least this percentage to your buffers in Step 6.
          </div>
        )}
      </div>

      <div className="pt-4 flex items-center justify-between">
         <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(5)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
