"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step3Avenues({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();
  const [newAve, setNewAve] = useState("");
  const [isCrit, setIsCrit] = useState(false);

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
      <motion.div layout transition={transition} className="text-zinc-400 text-sm space-y-1.5">
        <div className="flex gap-2 text-xs uppercase mb-1">
          <span className="text-zinc-500 font-mono">{project.avenues.length} Avenues</span>
        </div>
        {project.avenues.map(a => (
          <div key={a.id} className="truncate text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
            <span className="text-zinc-200 font-medium">{a.title}</span>
            {a.isCriticalPath && <span className="text-white text-[9px] font-mono border border-zinc-700 px-1 rounded uppercase">Critical</span>}
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      {/* Avenues */}
      <div className="space-y-4">
        <div>
          <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Main Avenues (Workstreams)</label>
          <p className="text-xs text-zinc-500 font-light mt-0.5">Define 3-7 core pillars. Tag the ones on the critical path.</p>
        </div>
        
        {project.avenues.map((ave) => (
          <div key={ave.id} className="p-3 border border-zinc-900 rounded bg-zinc-950 flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">{ave.title}</span>
              {ave.isCriticalPath && (
                <span className="text-[10px] font-mono text-white border border-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded uppercase">
                  Critical Path
                </span>
              )}
            </div>
            <button onClick={() => handleRemove(ave.id)} className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}

        <div className="bg-zinc-950 p-4 border border-zinc-900 rounded space-y-3">
          <input 
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-700"
            placeholder="Add a new avenue (e.g. Core Engine, Authentication, Billing UI)"
            value={newAve}
            onChange={(e) => setNewAve(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleAdd();
                e.preventDefault();
              }
            }}
          />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="crit" checked={isCrit} onChange={e => setIsCrit(e.target.checked)} className="accent-white" />
            <label htmlFor="crit" className="text-xs text-zinc-400 cursor-pointer select-none">
              Mark as Critical Path (If this workstream is blocked, the launch fails)
            </label>
          </div>
          <button onClick={handleAdd} className="text-xs text-zinc-400 hover:text-white transition-colors">
            + Add Avenue
          </button>
        </div>
      </div>

      {/* Pre-mortem */}
      <div className="space-y-2 pt-4 border-t border-zinc-900">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Pre-Mortem Failure Analysis</label>
        <p className="text-xs text-zinc-500 font-light">Imagine it's 6 months from now and the project collapsed. What was the exact root cause?</p>
        <textarea 
          className="w-full bg-transparent border border-zinc-900 focus:border-zinc-500 rounded p-3 text-sm text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-zinc-700"
          rows={3}
          placeholder="The project failed because..."
          value={project.preMortem}
          onChange={(e) => updateProject({ preMortem: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(4)}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
