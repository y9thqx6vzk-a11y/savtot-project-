"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { GapCategory } from "@/types/project";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step2Gaps({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const { transition } = useAppMotion();
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState<GapCategory>("tech");
  const [newMit, setNewMit] = useState("");

  const handleAdd = () => {
    if (!newDesc.trim()) return;
    const gap = {
      id: Math.random().toString(36).substring(2, 9),
      description: newDesc,
      category: newCat,
      mitigation: newMit || "To be defined",
    };
    updateProject({ knowledgeGaps: [...project.knowledgeGaps, gap] });
    setNewDesc("");
    setNewMit("");
  };

  const handleRemove = (id: string) => {
    updateProject({ knowledgeGaps: project.knowledgeGaps.filter(g => g.id !== id) });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      setActiveStep(3);
    }
  };

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-zinc-400 text-sm space-y-1.5">
        {project.knowledgeGaps.length === 0 ? (
          <div className="text-zinc-600 italic">No knowledge gaps logged.</div>
        ) : (
          project.knowledgeGaps.map(g => (
            <div key={g.id} className="flex gap-2 items-center text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
              <span className="text-zinc-300 font-medium truncate">{g.description}</span>
              <span className="text-[10px] font-mono text-zinc-600 uppercase border border-zinc-800 px-1 rounded">{g.category}</span>
            </div>
          ))
        )}
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <p className="text-sm text-zinc-400 font-light leading-relaxed">
        Identify critical unknowns, unverified technical assumptions, or dependencies that could silently derail the project.
      </p>

      <div className="space-y-3">
        {project.knowledgeGaps.map((gap) => (
          <div key={gap.id} className="p-3 border border-zinc-900 rounded bg-zinc-950 flex justify-between items-start group">
            <div>
              <div className="text-sm text-zinc-200 font-medium">{gap.description}</div>
              <div className="text-xs text-zinc-500 mt-1 flex gap-2 items-center">
                <span className="uppercase text-[10px] font-mono bg-black px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-400">{gap.category}</span>
                <span>Mitigation: {gap.mitigation}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(gap.id)} className="text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded space-y-3">
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-700"
          placeholder="New unknown assumption or risk..."
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step2-mit')?.focus()}
        />
        <div className="flex gap-2">
          {(['tech', 'market', 'execution'] as GapCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setNewCat(cat)}
              className={`text-[11px] font-mono uppercase px-2.5 py-1 rounded border transition-colors ${newCat === cat ? 'bg-white border-white text-black font-semibold' : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-zinc-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input 
          id="step2-mit"
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-200 focus:outline-none focus:border-zinc-400 placeholder:text-zinc-700"
          placeholder="Mitigation experiment (e.g. build 1-day spike, interview 3 users)"
          value={newMit}
          onChange={(e) => setNewMit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
              e.preventDefault();
            } else {
              handleKeyDown(e);
            }
          }}
        />
        <button onClick={handleAdd} className="text-xs text-zinc-400 hover:text-white transition-colors">
          + Add Gap Item
        </button>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(3)}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
