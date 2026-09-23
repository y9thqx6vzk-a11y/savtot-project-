"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step1Story({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(2);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-zinc-400 text-sm space-y-1">
        <div className="text-white font-medium truncate">{project.oneLiner || "Untitled Project"}</div>
        <div className="text-xs text-zinc-500 truncate">Audience: {project.targetAudience}</div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Project One-Liner</label>
        <input 
          autoFocus
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-xl font-light text-white focus:outline-none focus:border-zinc-300 transition-colors placeholder:text-zinc-700"
          placeholder="e.g., A minimalist project planner for focused teams"
          value={project.oneLiner}
          onChange={(e) => updateProject({ oneLiner: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step1-prob')?.focus()}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Main Problem</label>
        <textarea 
          id="step1-prob"
          className="w-full bg-transparent border border-zinc-900 focus:border-zinc-500 rounded p-3 text-sm text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-zinc-700"
          rows={2}
          placeholder="What exact pain point does this eradicate?"
          value={project.problem}
          onChange={(e) => updateProject({ problem: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Target Audience</label>
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-300 transition-colors placeholder:text-zinc-700"
          placeholder="Who is this specifically built for?"
          value={project.targetAudience}
          onChange={(e) => updateProject({ targetAudience: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Day in the Life (Post-Launch Reality)</label>
        <textarea 
          className="w-full bg-transparent border border-zinc-900 focus:border-zinc-500 rounded p-3 text-sm text-zinc-200 focus:outline-none transition-colors resize-none placeholder:text-zinc-700"
          rows={2}
          placeholder="Describe how life changes once this is deployed..."
          value={project.dayInTheLife}
          onChange={(e) => updateProject({ dayInTheLife: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(2)}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
