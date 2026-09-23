"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step4OutsideView({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { project, updateProject, setActiveStep, getAverageOptimismBias, addHistoricalBenchmark } = useAppStore();
  const { transition } = useAppMotion();

  const [plannedText, setPlannedText] = useState(
    project.plannedDurationDays ? `${project.plannedDurationDays} days` : ""
  );
  const [actualText, setActualText] = useState(
    project.actualDurationDays ? `${project.actualDurationDays} days` : ""
  );

  const plannedParsed = parseDuration(plannedText);
  const actualParsed = parseDuration(actualText);

  // Auto-calculate optimism gap whenever parsed days change
  useEffect(() => {
    if (plannedParsed && actualParsed && plannedParsed.days > 0 && actualParsed.days > 0) {
      const gap = ((actualParsed.days - plannedParsed.days) / plannedParsed.days) * 100;
      updateProject({
        plannedDurationDays: plannedParsed.days,
        actualDurationDays: actualParsed.days,
        optimismGapPercent: Math.round(gap),
      });
    }
  }, [plannedParsed?.days, actualParsed?.days, updateProject]);

  const handleSaveBenchmark = () => {
    if (project.referenceProject && plannedParsed && actualParsed) {
      addHistoricalBenchmark({
        title: project.referenceProject,
        plannedDays: plannedParsed.days,
        actualDays: actualParsed.days,
        gapPercent: project.optimismGapPercent,
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSaveBenchmark();
      setActiveStep(5);
    }
  };

  const avgBias = getAverageOptimismBias();

  if (!isActive && isPast) {
    return (
      <motion.div layout transition={transition} className="text-zinc-400 text-sm space-y-1">
        <div className="text-zinc-200 font-medium truncate">Reference: {project.referenceProject || "None"}</div>
        <div className="text-xs text-zinc-500 font-mono">
          Planned: {project.plannedDurationDays}d | Actual: {project.actualDurationDays}d | Gap: <span className={project.optimismGapPercent > 20 ? 'text-zinc-200 font-bold' : 'text-zinc-400'}>+{project.optimismGapPercent}%</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      <p className="text-sm text-zinc-400 leading-relaxed font-light">
        To prevent <span className="text-white font-medium">Commitment Fallacy</span>, anchor your schedule against similar past projects. How long did they <i>actually</i> take?
      </p>

      {/* Aggregate Bias Highlight */}
      {project.historicalBenchmarks && project.historicalBenchmarks.length > 0 && (
        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Historical Baseline</div>
            <div className="text-xs text-zinc-300 mt-0.5">
              Based on {project.historicalBenchmarks.length} past projects, your average bias is <span className="font-mono font-bold text-white">+{avgBias}%</span>
            </div>
          </div>
          <span className="text-xs font-mono text-zinc-400 border border-zinc-800 px-2 py-1 rounded">
            Auto-Calibrated
          </span>
        </div>
      )}

      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Reference Project</label>
        <input 
          className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-300 transition-colors font-medium text-white placeholder:text-zinc-700"
          placeholder="e.g. Previous v1 MVP, or an analogous codebase"
          value={project.referenceProject}
          onChange={(e) => updateProject({ referenceProject: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Planned Duration</label>
            {plannedParsed && (
              <span className="text-[11px] font-mono text-zinc-400">
                {plannedParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-300 transition-colors font-mono text-white placeholder:text-zinc-700"
            placeholder="e.g. 2 weeks, 14d, 48h"
            value={plannedText}
            onChange={(e) => setPlannedText(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs tracking-wider uppercase text-zinc-500 font-medium block">Actual Duration</label>
            {actualParsed && (
              <span className="text-[11px] font-mono text-zinc-400">
                {actualParsed.formatted}
              </span>
            )}
          </div>
          <input 
            type="text"
            className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm focus:outline-none focus:border-zinc-300 transition-colors font-mono text-white placeholder:text-zinc-700"
            placeholder="e.g. 3.5 weeks, 21d"
            value={actualText}
            onChange={(e) => setActualText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      {/* Calculated Optimism Gap Card */}
      <div className="bg-zinc-950 p-4 border border-zinc-800/80 rounded-md">
        <div className="flex justify-between items-baseline">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-medium">Calculated Optimism Gap</div>
            <div className="text-2xl font-light font-mono mt-1 text-white tracking-tight">
              +{project.optimismGapPercent}%
            </div>
          </div>
          {project.optimismGapPercent > 0 && (
            <span className="text-xs text-zinc-400 font-mono">
              Suggested Buffer: ~{Math.ceil((plannedParsed?.days || 14) * (project.optimismGapPercent / 100))} days
            </span>
          )}
        </div>
        <p className="text-xs text-zinc-500 mt-2 font-light">
          Cognitive calibration: Teams routinely underestimate friction by {project.optimismGapPercent || 30}%. Step 6 will pre-load this buffer.
        </p>
      </div>

      <div className="pt-4 flex items-center justify-between border-t border-zinc-900">
        <div className="text-xs text-zinc-600">Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-zinc-400">Cmd + Enter</kbd> to continue</div>
        <button 
          onClick={() => {
            handleSaveBenchmark();
            setActiveStep(5);
          }}
          className="bg-white text-black px-4 py-1.5 rounded text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Continue
        </button>
      </div>
    </motion.div>
  );
}
