"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { sampleProject } from "@/lib/initialData";
import { motion } from "framer-motion";
import Step1Story from "./Step1Story";
import Step2Gaps from "./Step2Gaps";
import Step3Avenues from "./Step3Avenues";
import Step4OutsideView from "./Step4OutsideView";
import Step5Tasks from "./Step5Tasks";
import Step6Buffers from "./Step6Buffers";
import Step7OKRs from "./Step7OKRs";

export default function JourneyWizard() {
  const { activeStep, setActiveStep, updateProject, setStage } = useAppStore();

  // Scroll to active step
  useEffect(() => {
    const el = document.getElementById(`step-${activeStep}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeStep]);

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
    <div className="max-w-2xl mx-auto py-24 px-6 relative">
      <div className="absolute top-6 right-6">
        <button 
          onClick={handleLoadSample}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-800 px-3 py-1.5 rounded-md"
        >
          Load Example Blueprint
        </button>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-3xl font-light tracking-tight mb-2">The Journey</h1>
        <p className="text-zinc-500">Define your project with cognitive ease.</p>
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
              className={`transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}
              onClick={() => { if (!isActive) setActiveStep(step.id) }}
            >
              <div className="text-sm text-zinc-600 mb-2">{step.title}</div>
              <div className={`border-l-2 pl-6 py-2 ${isActive ? 'border-zinc-300' : 'border-zinc-800'}`}>
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
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent flex justify-center"
        >
          <button 
            onClick={() => setStage(2)}
            className="bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-zinc-200 transition-colors shadow-lg shadow-white/5"
          >
            Generate Skeleton
          </button>
        </motion.div>
      )}
    </div>
  );
}
