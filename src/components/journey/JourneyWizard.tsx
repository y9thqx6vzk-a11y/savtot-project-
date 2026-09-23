"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { sampleProject } from "@/lib/initialData";
import { motion } from "framer-motion";
import { useAppMotion } from "@/lib/useMotionConfig";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Step1Story from "./Step1Story";
import Step2Gaps from "./Step2Gaps";
import Step3Avenues from "./Step3Avenues";
import Step4OutsideView from "./Step4OutsideView";
import Step5Tasks from "./Step5Tasks";
import Step6Buffers from "./Step6Buffers";
import Step7OKRs from "./Step7OKRs";

export default function JourneyWizard() {
  const { activeStep, setActiveStep, updateProject, setStage, theme } = useAppStore();
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
    { id: 1, component: Step1Story, title: "1. הסיפור והחזון" },
    { id: 2, component: Step2Gaps, title: "2. פערי ידע ואי-ודאות" },
    { id: 3, component: Step3Avenues, title: "3. אפיקים ופרה-מורטם" },
    { id: 4, component: Step4OutsideView, title: "4. המבט מבחוץ וכיול זמנים" },
    { id: 5, component: Step5Tasks, title: "5. פירוק משימות ותיוג MVP" },
    { id: 6, component: Step6Buffers, title: "6. לוח זמנים ובאפר רמזור" },
    { id: 7, component: Step7OKRs, title: "7. ערך ומדדי תוצאה (OKRs)" },
  ];

  const isLight = theme === 'light';

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 relative font-sans text-right" dir="rtl">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button 
            onClick={handleLoadSample}
            className={`text-xs px-3.5 py-1.5 rounded-full transition-all duration-200 border font-medium ${
              isLight
                ? 'bg-[#ffffff] text-[#555] border-[#e2ded5] hover:text-[#1d1d1f] hover:border-[#c5c0b5] shadow-[0_1px_4px_rgba(0,0,0,0.03)]'
                : 'bg-[#1c1c1e] text-[#86868b] border-[#2c2c30] hover:text-white hover:border-[#3e3e44]'
            }`}
          >
            טען תוכנית דוגמה (1-Click Blueprint)
          </button>
        </div>

        <span className="text-[11px] font-mono uppercase tracking-widest text-[#86868b]">
          שלב 1 מתוך 2: המסע
        </span>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={transition}
        className="mb-14"
      >
        <h1 className="text-3xl font-normal tracking-tight text-[#1d1d1f] dark:text-[#f5f5f7]">
          המסע לתכנון שקט
        </h1>
        <p className="text-sm text-[#86868b] dark:text-[#a1a1aa] mt-1.5 font-light leading-relaxed">
          שבעה צעדים רציפים מונחי-מקלדת שמפרקים עומס קוגניטיבי והופכים רעיון מופשט לשלד עבודה ברור.
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
              className={`transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-100 cursor-pointer'}`}
              onClick={() => { if (!isActive) setActiveStep(step.id) }}
            >
              <div className="text-xs font-mono tracking-wide text-[#86868b] mb-2 flex items-center justify-between">
                <span className="font-semibold text-[#1d1d1f] dark:text-[#f5f5f7]">{step.title}</span>
                {isPast && (
                  <span className="text-[10px] text-[#8e8e93] hover:underline">לחץ לעריכה</span>
                )}
              </div>
              <div className={`border-r-2 pr-6 py-2 transition-colors ${
                isActive 
                  ? 'border-[#1d1d1f] dark:border-white' 
                  : 'border-[#e5e2da] dark:border-[#2c2c30]'
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
          className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#fbfaf7] via-[#fbfaf7]/95 to-transparent dark:from-[#0c0c0e] dark:via-[#0c0c0e]/95 flex justify-center z-20"
        >
          <button 
            onClick={() => setStage(2)}
            className="bg-[#1d1d1f] text-white dark:bg-white dark:text-black px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_4px_20px_rgba(0,0,0,0.12)] hover:scale-[1.02] text-sm"
          >
            חולל את לוח השלד (The Skeleton) ←
          </button>
        </motion.div>
      )}
    </div>
  );
}
