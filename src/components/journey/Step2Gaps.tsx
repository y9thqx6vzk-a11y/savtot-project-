"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useState } from "react";
import { GapCategory } from "@/types/project";

export default function Step2Gaps({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep } = useAppStore();
  const [newDesc, setNewDesc] = useState("");
  const [newCat, setNewCat] = useState<GapCategory>("tech");
  const [newMit, setNewMit] = useState("");

  const handleAdd = () => {
    if (!newDesc.trim()) return;
    const gap = {
      id: Math.random().toString(36).substr(2, 9),
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

  if (!isActive && isPast) {
    return (
      <motion.div layout className="text-zinc-400 text-sm space-y-2">
        {project.knowledgeGaps.length === 0 ? (
          <div>No knowledge gaps identified.</div>
        ) : (
          project.knowledgeGaps.map(g => (
            <div key={g.id} className="flex gap-2 items-center">
              <span className="w-2 h-2 rounded-full bg-zinc-700" />
              <span className="truncate">{g.description}</span>
            </div>
          ))
        )}
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="space-y-4">
        {project.knowledgeGaps.map((gap) => (
          <div key={gap.id} className="p-3 border border-zinc-800 rounded-md flex justify-between items-start group">
            <div>
              <div className="text-sm text-zinc-300">{gap.description}</div>
              <div className="text-xs text-zinc-600 mt-1 flex gap-2">
                <span className="uppercase text-[10px] bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{gap.category}</span>
                <span>Mitigation: {gap.mitigation}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(gap.id)} className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
          </div>
        ))}
      </div>

      <div className="bg-zinc-950 p-4 border border-zinc-900 rounded-md space-y-3">
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
          placeholder="New gap / unknown assumption..."
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && document.getElementById('step2-mit')?.focus()}
        />
        <div className="flex gap-2">
          {['tech', 'market', 'execution'].map(cat => (
            <button
              key={cat}
              onClick={() => setNewCat(cat as GapCategory)}
              className={`text-xs px-2 py-1 rounded-md border capitalize ${newCat === cat ? 'bg-zinc-800 border-zinc-600 text-white' : 'bg-transparent border-zinc-800 text-zinc-500'}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <input 
          id="step2-mit"
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-400"
          placeholder="Mitigation experiment (e.g. build prototype)"
          value={newMit}
          onChange={(e) => setNewMit(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleAdd();
              e.preventDefault();
            }
          }}
        />
        <button onClick={handleAdd} className="text-xs text-zinc-400 hover:text-white mt-2">
          + Add Gap (or press Enter)
        </button>
      </div>

      <div className="pt-4 flex items-center justify-between">
         <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded-md">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => setActiveStep(3)}
          className="bg-white text-black px-4 py-1.5 rounded-md text-sm hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
