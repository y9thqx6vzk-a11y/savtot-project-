"use client";

import { useAppStore } from "@/lib/store";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { parseDuration } from "@/lib/durationParser";
import { useAppMotion } from "@/lib/useMotionConfig";

export default function Step4OutsideView({ isActive, isPast }: { isActive: boolean, isPast: boolean }) {
  const { 
    project, 
    updateProject, 
    setActiveStep, 
    getAverageOptimismBias, 
    removeHistoricalBenchmark 
  } = useAppStore();
  const { transition } = useAppMotion();

  const [plannedText, setPlannedText] = useState(
    project.plannedDurationDays ? `${project.plannedDurationDays} ימים` : ""
  );
  const [actualText, setActualText] = useState(
    project.actualDurationDays ? `${project.actualDurationDays} ימים` : ""
  );

  const [showTimeCalibration, setShowTimeCalibration] = useState(
    Boolean(project.plannedDurationDays || project.actualDurationDays)
  );

  const plannedParsed = parseDuration(plannedText);
  const actualParsed = parseDuration(actualText);

  useEffect(() => {
    if (plannedParsed && actualParsed && plannedParsed.days > 0 && actualParsed.days > 0) {
      const gap = ((actualParsed.days - plannedParsed.days) / plannedParsed.days) * 100;
      updateProject({
        plannedDurationDays: plannedParsed.days,
        actualDurationDays: actualParsed.days,
        optimismGapPercent: Math.round(gap),
      });
    } else if (!plannedText.trim() && !actualText.trim()) {
      updateProject({
        plannedDurationDays: 0,
        actualDurationDays: 0,
        optimismGapPercent: 0,
      });
    }
  }, [plannedParsed?.days, actualParsed?.days, plannedText, actualText, updateProject]);

  const handleSaveBenchmark = () => {
    if (!project.referenceProject?.trim()) return;

    const cleanBenchmarks = (project.historicalBenchmarks || []).filter(b => !b.id.startsWith("bench-"));
    const newBench = {
      id: Math.random().toString(36).substring(2, 9),
      title: project.referenceProject.trim(),
      plannedDays: plannedParsed?.days,
      actualDays: actualParsed?.days,
      gapPercent: (plannedParsed && actualParsed) ? project.optimismGapPercent : undefined,
      addedValue: project.addedValueText?.trim(),
      lessonsLearned: project.lessonsLearnedText?.trim(),
      teamOrScale: project.referenceScale?.trim(),
      freeNotes: project.outsideViewNotes?.trim(),
    };

    updateProject({
      historicalBenchmarks: [newBench, ...cleanBenchmarks]
    });
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
      <motion.div layout transition={transition} className="text-sm space-y-1">
        <div className="font-medium text-zinc-900 dark:text-zinc-100 truncate">
          רפרנס: {project.referenceProject || "ללא רפרנס ספציפי"}
        </div>
        <div className="text-xs text-zinc-500 font-mono">
          {project.plannedDurationDays > 0 && project.actualDurationDays > 0 ? (
            <>תוכנן: {project.plannedDurationDays} ימים | בפועל: {project.actualDurationDays} ימים | פער: <span className={project.optimismGapPercent > 20 ? 'text-zinc-950 dark:text-white font-bold' : 'text-zinc-500'}>+{project.optimismGapPercent}%</span></>
          ) : (
            <span>ניתוח איכותני ותצפיות שטח מהמתחרים/השוק</span>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout transition={transition} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      
      {/* Intro Explanation */}
      <div className="space-y-1.5 border-r-2 border-zinc-900 dark:border-zinc-100 pr-3">
        <div className="text-xs font-medium text-zinc-800 dark:text-zinc-200">
          מבט מבחוץ (Outside View) – למידה מהשטח ומהשוק
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-light leading-relaxed">
          כשאנחנו מתכננים פרויקט רק מהראש שלנו, אנחנו נוטים לאופטימיות יתר. כאן בוחנים מה קרה בפועל בפרויקטים דומים, אצל מתחרים או בגרסאות קודמות.
          <br />
          <span className="font-normal text-zinc-700 dark:text-zinc-300">
            אין לכם נתוני זמנים מדויקים? זה טבעי לגמרי.
          </span>{" "}
          השתמשו בשדות הטקסט החופשי, המשאבים והתצפיות כדי ללמוד מניסיון של אחרים.
        </p>
      </div>

      {/* Aggregate Bias Highlight (if available) */}
      {project.historicalBenchmarks && project.historicalBenchmarks.length > 0 && (
        <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono font-semibold">
              מאגר פרויקטי השוואה שמורים ({project.historicalBenchmarks.length})
            </div>
            <div className="text-xs text-zinc-800 dark:text-zinc-200 mt-0.5">
              {avgBias > 0 ? (
                <>ממוצע סטיית הזמנים שלך מפרויקטי עבר: <span className="font-mono font-bold text-zinc-950 dark:text-white">+{avgBias}%</span></>
              ) : (
                <span>נשמרו תובנות איכותיות ורפרנסים למאגר הפרויקט</span>
              )}
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-2 py-0.5 rounded">
            מבט מבחוץ
          </span>
        </div>
      )}

      {/* 1. Reference Project Name */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-700 dark:text-zinc-300 block">
            פרויקט או מוצר דומה להשוואה (Reference Project / Product)
          </label>
          <span className="text-[11px] font-mono text-zinc-400">חובה</span>
        </div>
        <input 
          dir="rtl"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 focus:outline-none transition-colors placeholder:text-zinc-400"
          placeholder="למשל: אפליקציה מתחרה, כלי קודם שבנית, מוצר מוביל בתחום..."
          value={project.referenceProject}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ referenceProject: e.target.value })}
        />
      </div>

      {/* 2. Free Text Field: Market Observations & Qualitative Notes */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline">
          <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-700 dark:text-zinc-300 block">
            תצפיות שטח וטקסט חופשי (מבט מבחוץ)
          </label>
          <span className="text-[11px] font-mono text-zinc-400">טקסט חופשי</span>
        </div>
        <p className="text-[11px] text-zinc-400 font-light">
          מידע שקשה לכמת בימים: תלונות של משתמשים על מוצרים קיימים, במה הם הסתבכו, פיצ'רים מיותרים שהם בנו, איך הם התחילו בקטן, מקורות וקישורים.
        </p>
        <textarea 
          dir="rtl"
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded-md p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400 leading-relaxed"
          rows={3}
          placeholder="רשמו כאן כל תובנה חופשית מהשטח על הפרויקט או המוצר הדומה..."
          value={project.outsideViewNotes || ""}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ outsideViewNotes: e.target.value })}
        />
      </div>

      {/* 3. Team, Scale & Resources (Optional Qualitative Metric) */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-700 dark:text-zinc-300 block">
          סדר גודל, צוות ומשאבים של הפרויקט הדומה (אופציונלי)
        </label>
        <input 
          dir="rtl"
          className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-2 text-sm font-medium text-zinc-950 dark:text-zinc-50 focus:outline-none transition-colors placeholder:text-zinc-400"
          placeholder="למשל: מפתח יחיד ב-Bootstrap, צוות של 3 מהנדסים, חברה גדולה עם תקציב גבוה..."
          value={project.referenceScale || ""}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ referenceScale: e.target.value })}
        />
      </div>

      {/* 4. Lessons Learned & Avoided Pitfalls */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-700 dark:text-zinc-300 block">
          מה אפשר ללמוד מהם? (מוקשים וכשלים שברצוננו למנוע)
        </label>
        <textarea 
          dir="rtl"
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded-md p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400 leading-relaxed"
          rows={2}
          placeholder="איפה הם הסתבכו, מה היה מיותר או אילו טעויות נמנע מראש..."
          value={project.lessonsLearnedText || ""}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ lessonsLearnedText: e.target.value })}
        />
      </div>

      {/* 5. Added Value */}
      <div className="space-y-2">
        <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-700 dark:text-zinc-300 block">
          איזה ערך מוסף ייחודי יש בפרויקט שלנו לעומתם?
        </label>
        <textarea 
          dir="rtl"
          className="w-full bg-zinc-50/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 focus:border-zinc-900 dark:focus:border-zinc-400 rounded-md p-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none transition-colors resize-none placeholder:text-zinc-400 leading-relaxed"
          rows={2}
          placeholder="במה הפתרון שלנו פשוט, חזק, מהיר או ממוקד יותר מהפתרונות הקיימים?"
          value={project.addedValueText || ""}
          onFocus={(e) => e.target.select()}
          onChange={(e) => updateProject({ addedValueText: e.target.value })}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* 6. Optional Time Calibration Toggle & Fields */}
      <div className="border border-zinc-200 dark:border-zinc-800 rounded p-4 space-y-4 bg-zinc-50/40 dark:bg-zinc-900/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
              <span>⏱️</span> השוואת זמנים והטיית אופטימיות (אופציונלי)
            </div>
            <div className="text-[11px] text-zinc-500 font-light mt-0.5">
              רלוונטי בעיקר לפרויקט עבר אישי שלך שבו ידועים זמני התכנון מול הביצוע.
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setShowTimeCalibration(!showTimeCalibration)}
            className="text-xs font-mono text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white underline underline-offset-4"
          >
            {showTimeCalibration ? "הסתר שדות זמנים" : "+ יש לי נתוני זמנים להזין"}
          </button>
        </div>

        {showTimeCalibration && (
          <div className="space-y-4 pt-2 border-t border-zinc-200 dark:border-zinc-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
                    כמה זמן תוכנן?
                  </label>
                  {plannedParsed && (
                    <span className="text-[11px] font-mono text-zinc-500">
                      {plannedParsed.formatted}
                    </span>
                  )}
                </div>
                <input 
                  type="text"
                  dir="rtl"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-1.5 text-sm font-mono text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none transition-colors"
                  placeholder="למשל: שבועיים, 14 יום"
                  value={plannedText}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setPlannedText(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs tracking-wider uppercase font-mono font-medium text-zinc-500 block">
                    כמה זמן לקח בפועל?
                  </label>
                  {actualParsed && (
                    <span className="text-[11px] font-mono text-zinc-500">
                      {actualParsed.formatted}
                    </span>
                  )}
                </div>
                <input 
                  type="text"
                  dir="rtl"
                  className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:border-zinc-900 dark:focus:border-zinc-300 rounded-md px-3 py-1.5 text-sm font-mono text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 focus:outline-none transition-colors"
                  placeholder="למשל: 4 שבועות, 28 יום"
                  value={actualText}
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => setActualText(e.target.value)}
                />
              </div>
            </div>

            {/* Gap Display */}
            {project.optimismGapPercent > 0 && (
              <div className="bg-white dark:bg-zinc-900 p-3 border border-zinc-200 dark:border-zinc-800 rounded flex justify-between items-center">
                <div>
                  <div className="text-[10px] uppercase font-mono text-zinc-400 font-semibold">הטיית האופטימיות שחושבה</div>
                  <div className="text-base font-mono text-zinc-950 dark:text-white">+{project.optimismGapPercent}% מעבר למתוכנן</div>
                </div>
                <span className="text-xs font-mono text-zinc-500">
                  תוספת באפר מומלצת: כ-{Math.ceil((plannedParsed?.days || 14) * (project.optimismGapPercent / 100))} ימים
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Save Benchmark Button & Saved Benchmarks List */}
      <div className="space-y-3">
        {project.referenceProject && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveBenchmark}
              className="text-xs font-mono text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 rounded transition-colors"
            >
              + שמור רפרנס זה למאגר הפרויקטים
            </button>
          </div>
        )}

        {/* List of saved benchmarks */}
        {project.historicalBenchmarks && project.historicalBenchmarks.length > 0 && (
          <div className="space-y-2 pt-2">
            <div className="text-[11px] font-mono uppercase text-zinc-400">רפרנסים שנשמרו:</div>
            <div className="grid grid-cols-1 gap-2">
              {project.historicalBenchmarks.map((bench) => (
                <div 
                  key={bench.id}
                  className="p-3 bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded flex items-start justify-between text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {bench.title}
                    </div>
                    {bench.teamOrScale && (
                      <div className="text-zinc-500 text-[11px]">
                        היקף: {bench.teamOrScale}
                      </div>
                    )}
                    {bench.freeNotes && (
                      <div className="text-zinc-600 dark:text-zinc-400 text-[11px] line-clamp-2">
                        {bench.freeNotes}
                      </div>
                    )}
                    {typeof bench.gapPercent === 'number' && bench.gapPercent > 0 && (
                      <div className="text-[11px] font-mono text-zinc-500">
                        תוכנן: {bench.plannedDays} ימים | בפועל: {bench.actualDays} ימים | פער: +{bench.gapPercent}%
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHistoricalBenchmark(bench.id)}
                    className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 p-1 text-xs"
                    title="מחק רפרנס"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 flex items-center justify-between border-t border-zinc-200 dark:border-zinc-800">
        <div className="text-xs text-zinc-400 font-mono">
          הקש <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300">Enter</kbd> לשמירה ומעבר
        </div>
        <button 
          onClick={() => {
            handleSaveBenchmark();
            setActiveStep(5);
          }}
          className="bg-zinc-950 text-white dark:bg-white dark:text-black px-5 py-2 rounded text-xs font-mono font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          המשך לשלב 5 ←
        </button>
      </div>
    </motion.div>
  );
}
