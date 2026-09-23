"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { sampleProject } from "@/lib/initialData";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";
import Step1Story from "./Step1Story";
import Step2Gaps from "./Step2Gaps";
import Step3Avenues from "./Step3Avenues";
import Step4OutsideView from "./Step4OutsideView";
import Step5Tasks from "./Step5Tasks";
import Step6Buffers from "./Step6Buffers";
import Step7OKRs from "./Step7OKRs";

export default function JourneyWizard() {
  const { activeStep, setActiveStep, updateProject, setStage } = useAppStore();
  const { transition, shouldReduceMotion } = useAppMotion();

  // Scroll to active step
  useEffect(() => {
    const el = document.getElementById(`step-${activeStep}`);
    if (el) {
      el.scrollIntoView({ behavior: shouldReduceMotion ? "auto" : "smooth", block: "center" });
    }
  }, [activeStep, shouldReduceMotion]);

  const handleLoadSample = () => {
    updateProject(sampleProject);
    setStage(2);
  };

  const steps = [
    { id: 1, component: Step1Story, title: "1. The Story" },
    { id: 2, component: Step2Gaps, title: "2. Knowledge Gaps" },
    { id: 3, component: Step3Avenues, title: "3. Avenues & Pre-mortem" },
    { id: 4, component: Step4OutsideView, title: "4. The Outside View" },
    { id: 5, component: Step5Tasks, title: "5. Task Breakdown" },
    { id: 6, component: Step6Buffers, title: "6. Schedule & Buffers" },
    { id: 7, component: Step7OKRs, title: "7. Value & OKRs" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-20 px-6 relative">
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <button 
          onClick={handleLoadSample}
          className="text-xs text-zinc-400 hover:text-white transition-colors border border-zinc-800 hover:border-zinc-600 px-3 py-1.5 rounded font-mono"
        >
          Load Blueprint Demo
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={transition}
        className="mb-14"
      >
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">Stage 1: Setup Wizard</span>
        <h1 className="text-3xl font-light tracking-tight text-white mt-1">The Journey</h1>
        <p className="text-sm text-zinc-500 mt-1 font-light">Seven sequential steps to eliminate planning friction and cognitive overload.</p>
      </motion.div>

      <div className="space-y-4 pb-64">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const isPast = step.id < activeStep;
          
          if (step.id > activeStep) return null; // Progressive disclosure

          const StepComponent = step.component;

          return (
            <div 
              key={step.id} 
              id={`step-${step.id}`}
              className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}
              onClick={() => { if (!isActive) setActiveStep(step.id) }}
            >
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2 flex items-center justify-between">
                <span>{step.title}</span>
                {isPast && <span className="text-[10px] text-zinc-600">Click to expand</span>}
              </div>
              <div className={`border-l-2 pl-6 py-2 transition-colors ${isActive ? 'border-white' : 'border-zinc-800'}`}>
                <StepComponent isActive={isActive} isPast={isPast} />
              </div>
            </div>
          );
        })}
      </div>
      
      {activeStep === 7 && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={transition}
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent flex justify-center"
        >
          <button 
            onClick={() => setStage(2)}
            className="bg-white text-black px-8 py-3 rounded font-medium hover:bg-zinc-200 transition-colors shadow-xl shadow-white/5 text-sm"
          >
            Generate Skeleton Dashboard
          </button>
        </motion.div>
      )}
    </div>
  );
}
