"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step6Buffers({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, updateTask, getSuggestedBufferDays, getAverageOptimismBias } = useAppStore();
  const { transition } = useAppMotion();

  const [bufferText, setBufferText] = useState(
    project.totalBufferDays ? `${project.totalBufferDays} days` : ""
  );

  const parsed = parseDuration(bufferText);

  useEffect(() => {
    if (parsed && parsed.days >= 0) {
      updateProject({ totalBufferDays: parsed.days });
    }
  }, [parsed?.days, updateProject]);

  const handleTaskBottleneckToggle = (aveId: string, taskId: string, current: boolean) => {
    updateTask(aveId, taskId, { isBottleneck: !current });
  };

  const allTasks = project.avenues.flatMap(a => a.tasks.map(t => ({ ...t, aveId: a.id })));
  const bottleneckTasks = allTasks.filter(t => t.isBottleneck);
  const suggestedDays = getSuggestedBufferDays();
  const avgBias = getAverageOptimismBias();

  const handleApplySuggested = () => {
    setBufferText(`${suggestedDays} days`);
    updateProject({ totalBufferDays: suggestedDays });
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-zinc-400 text-sm space-y-1">
        <div className="text-zinc-200 font-medium font-mono">Total Buffer: {project.totalBufferDays} days</div>
        <div className="text-xs text-zinc-500">{bottleneckTasks.length} Bottleneck / Critical Tasks</div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <div className="space-y-3">
        <div className="flex justify-between items-baseline">
          <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Total Buffer Budget</label>
          {parsed && (
            <span className="text-xs font-mono text-zinc-300">
              Parsed: {parsed.formatted}
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 font-light">
          How much calendar slippage can this project absorb before catastrophic failure?
        </p>

        <input 
          type="text"
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-2xl focus:outline-none focus:border-zinc-300 font-mono text-white placeholder:text-zinc-700 tracking-tight"
          placeholder="e.g. 7 days, 1.5 weeks, 48h"
          value={bufferText}
          onChange={(e) => setBufferText(e.target.value)}
        />

        {suggestedDays > 0 && (
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-zinc-400">
              Suggested from historical bias (+{avgBias}%): <strong className="text-white font-mono">{suggestedDays} days</strong>
            </span>
            <button
              onClick={handleApplySuggested}
              className="text-xs text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-600 px-2.5 py-1 rounded transition-colors"
            >
              Apply Suggested
            </button>
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-900">
        <div>
          <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Tag Bottleneck Tasks</label>
          <p className="text-xs text-zinc-500 font-light mt-0.5">
            Identify steps that cannot be parallelized. Delays in these tasks directly consume the buffer.
          </p>
        </div>
        
        <div className="max-h-60 overflow-y-auto space-y-1 pr-2 no-scrollbar border border-zinc-900 rounded p-1">
          {allTasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-center justify-between p-2 rounded transition-colors cursor-pointer ${task.isBottleneck ? 'bg-zinc-900 text-white' : 'hover:bg-zinc-950 text-zinc-400'}`}
              onClick={() => handleTaskBottleneckToggle(task.aveId, task.id, task.isBottleneck)}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full ${task.isBottleneck ? 'bg-white' : 'bg-zinc-700'}`} />
                <span className="text-sm font-medium">{task.title}</span>
              </div>
              <div className="flex items-center gap-2">
                {task.isBottleneck && (
                  <span className="text-[10px] font-mono tracking-wider uppercase border border-zinc-700 px-1.5 py-0.5 rounded text-zinc-300">
                    Bottleneck
                  </span>
                )}
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${task.isBottleneck ? 'border-white bg-white text-black' : 'border-zinc-800'}`}>
                  {task.isBottleneck && <span className="text-[10px] font-bold">✓</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Light Rules */}
      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md">
        <div className="text-xs text-zinc-400 font-medium mb-3 tracking-wider uppercase">Traffic Light Buffer Policy</div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span className="text-zinc-400 font-mono">&lt; 33% (Safe)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#eab308]" />
            <span className="text-zinc-400 font-mono">33%-66% (Caution)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-zinc-400 font-mono">&gt; 66% (Critical)</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(7)}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
