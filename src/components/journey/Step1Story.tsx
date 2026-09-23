"use client";

import { useAppStore } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";

export default function Step1Story({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(2);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout className="text-zinc-400 text-sm space-y-1">
        <div className="text-white truncate">{project.oneLiner || "Untitled Project"}</div>
        <div className="truncate">For: {project.targetAudience}</div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Project One-Liner</label>
        <input 
          autoFocus
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-xl focus:outline-none focus:border-zinc-400 transition-colors"
          placeholder="e.g., A minimalist project planner"
          value={project.oneLiner}
          onChange={(e) => updateProject({ oneLiner: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step1-prob')?.focus()}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Main Problem</label>
        <textarea 
          id="step1-prob"
          className="w-full bg-transparent border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
          rows={2}
          placeholder="What pain point are you solving?"
          value={project.problem}
          onChange={(e) => updateProject({ problem: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Target Audience</label>
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400 transition-colors"
          placeholder="Who is this specifically for?"
          value={project.targetAudience}
          onChange={(e) => updateProject({ targetAudience: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-zinc-500 block">Day in the Life (Post-Launch)</label>
        <textarea 
          className="w-full bg-transparent border border-zinc-800 rounded-md p-3 text-sm focus:outline-none focus:border-zinc-400 transition-colors resize-none"
          rows={2}
          placeholder="Describe the transformed future state..."
          value={project.dayInTheLife}
          onChange={(e) => updateProject({ dayInTheLife: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(2)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
