"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Step3Avenues({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const [newAve, setNewAve] = useState("");
  const [isCrit, setIsCrit] = useState(false);

  const handleAdd = () => {
    if (!newAve.trim()) return;
    const avenue = {
      id: Math.random().toString(36).substr(2, 9),
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
      <motion.div layout className="text-zinc-400 text-sm space-y-2">
        <div className="flex gap-2 text-xs uppercase mb-1">
          <span className="text-zinc-500">{project.avenues.length} Avenues</span>
        </div>
        {project.avenues.map(a => (
          <div key={a.id} className="truncate">
            • {a.title} {a.isCriticalPath && <span className="text-red-400/80 text-[10px] ml-1 uppercase">Critical</span>}
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      
      {/* Avenues */}
      <div className="space-y-4">
        <label className="text-sm text-zinc-500 block">Main Avenues (Workstreams)</label>
        
        {project.avenues.map((ave) => (
          <div key={ave.id} className="p-3 border border-zinc-800 rounded-md flex justify-between items-center group">
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-300">{ave.title}</span>
              {ave.isCriticalPath && <span className="text-[10px] text-red-400 border border-red-900/50 bg-red-950/20 px-1.5 py-0.5 rounded uppercase">Critical Path</span>}
            </div>
            <button onClick={() => handleRemove(ave.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}

        <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md space-y-3">
          <input 
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
            placeholder="Add a new avenue (e.g. Core Engine, Authentication)"
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
            <input type="checkbox" id="crit" checked={isCrit} onChange={e => setIsCrit(e.target.checked)} className="accent-zinc-500" />
            <label htmlFor="crit" className="text-xs text-zinc-500 cursor-pointer">Mark as Critical Path (If this fails, project dies)</label>
          </div>
          <button onClick={handleAdd} className="text-xs text-zinc-400 hover:text-white mt-1">
            + Add Avenue (or press Enter)
          </button>
        </div>
      </div>

      {/* Pre-mortem */}
      <div className="space-y-2 pt-4 border-t border-zinc-800/50">
        <label className="text-sm text-zinc-500 block">Pre-mortem Analysis</label>
        <p className="text-xs text-zinc-600 mb-2">Imagine it's 6 months from now and the project completely failed. Why did it happen?</p>
        <textarea 
          className="w-full bg-transparent border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
          rows={3}
          placeholder="The project failed because..."
          value={project.preMortem}
          onChange={(e) => updateProject({ preMortem: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between">
         <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">Cmd + Enter</kbd> on Pre-mortem to continue</div>
        <button 
          onClick={() => setActiveStep(4)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
