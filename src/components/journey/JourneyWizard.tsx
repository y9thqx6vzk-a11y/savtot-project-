"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { sampleProject } from "@/lib/initialData";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";
import JsonUploader from "@/components/ui/JsonUploader";
import ProjectSwitcher from "@/components/ui/ProjectSwitcher";
import ShareModal from "@/components/ui/ShareModal";
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
    { id: 1, component: Step1Story, title: "שלב 1: סיפור" },
    { id: 2, component: Step2Gaps, title: "שלב 2: חלוקה לנושאים ולמידה" },
    { id: 3, component: Step3Avenues, title: "שלב 3: חלוקה לאפיקים + פרה-מורטם" },
    { id: 4, component: Step4OutsideView, title: "שלב 4: מבט מבחוץ" },
    { id: 5, component: Step5Tasks, title: "שלב 5: פירוק משימות ותעדוף" },
    { id: 6, component: Step6Buffers, title: "שלב 6: בניית לו״ז וחוצץ ביטחון" },
    { id: 7, component: Step7OKRs, title: "שלב 7: מדד ערך וזיהוי בעיות" },
  ];

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 relative font-sans text-right" dir="rtl">
      {/* Top Bar Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle />
          <ProjectSwitcher />
          <ShareModal />
          <JsonUploader />
          <button 
            onClick={handleLoadSample}
            className="text-xs px-2.5 py-1.5 rounded transition-colors font-mono border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 shadow-xs"
          >
            טען דוגמה
          </button>
        </div>

        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Stage 1: The Journey
        </span>
      </div>

      {/* Main Header */}
      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={transition}
        className="mb-14"
      >
        <h1 className="text-3xl font-light tracking-tight text-zinc-950 dark:text-zinc-50">
          חלום למציאות - איך לתכנן את הפרויקט הבא שלי.
        </h1>
        <p className="text-sm text-zinc-500 mt-2 font-light leading-relaxed">
          כל פרויקט, כמו הפרויקט הנוכחי - מתחיל בסיפור פשוט, חלום, איזשהו דמיון שיש לי. בחלק הראשון של תכנון וניהול ״הפרויקט שלי״ נעבור שלב אחר שלב עם שאלות להכוונה.
        </p>
      </motion.div>

      {/* Progressive Disclosure Steps */}
      <div className="space-y-6 pb-64">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          const isPast = step.id < activeStep;
          
          if (step.id > activeStep) return null;

          const StepComponent = step.component;

          return (
            <div 
              key={step.id} 
              id={`step-${step.id}`}
              className={`transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-100 cursor-pointer'}`}
              onClick={() => { if (!isActive) setActiveStep(step.id) }}
            >
              <div className="text-xs font-mono tracking-wide text-zinc-500 mb-2 flex items-center justify-between">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}</span>
                {isPast && (
                  <span className="text-[10px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">לחץ לעריכה</span>
                )}
              </div>
              <div className={`border-r-2 pr-6 py-2 transition-colors ${
                isActive 
                  ? 'border-zinc-900 dark:border-zinc-100' 
                  : 'border-zinc-200 dark:border-zinc-800'
              }`}>
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
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#09090b] dark:via-[#09090b]/95 flex justify-center z-20"
        >
          <button 
            onClick={() => setStage(2)}
            className="bg-zinc-950 text-white dark:bg-white dark:text-black px-8 py-3 rounded font-medium transition-colors hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-md text-sm font-mono"
          >
            עבור ללוח השלד (The Skeleton) ←
          </button>
        </motion.div>
      )}
    </div>
  );
}
