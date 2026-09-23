"use client";

import { useMemo, useState } from "react";
import { ProjectData } from "@/types/project";

interface CalendarViewProps {
  project: ProjectData;
  onSelectTask?: (avenueId: string, taskId: string) => void;
}

interface CalendarItem {
  id: string;
  title: string;
  type: "avenue" | "task" | "bottleneck";
  startDate: string;
  endDate: string;
  avenueTitle?: string;
  completed?: boolean;
}

export default function CalendarTimelineView({ project }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(() => {
    if (project.startDate) return new Date(project.startDate);
    return new Date();
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Gather all items that have dates
  const calendarItems: CalendarItem[] = useMemo(() => {
    const items: CalendarItem[] = [];

    // Project range (if defined)
    if (project.startDate && project.endDate) {
      items.push({
        id: "project-total",
        title: project.oneLiner ? `פרויקט: ${project.oneLiner.slice(0, 25)}...` : "מסגרת פרויקט",
        type: "avenue",
        startDate: project.startDate,
        endDate: project.endDate,
      });
    }

    // Avenues
    project.avenues.forEach((ave) => {
      if (ave.startDate && ave.endDate) {
        items.push({
          id: ave.id,
          title: `אפיק: ${ave.title}`,
          type: "avenue",
          startDate: ave.startDate,
          endDate: ave.endDate,
        });
      }

      // Tasks
      ave.tasks.forEach((t) => {
        if (t.startDate || t.endDate) {
          const s = t.startDate || t.endDate!;
          const e = t.endDate || t.startDate!;
          items.push({
            id: t.id,
            title: t.title,
            type: t.isBottleneck ? "bottleneck" : "task",
            startDate: s,
            endDate: e,
            avenueTitle: ave.title,
            completed: t.completed,
          });
        }
      });
    });

    return items;
  }, [project]);

  // Calendar month days calculation
  const { monthName, daysInMonth, startWeekday, prevMonthDays } = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInCurrentMonth = lastDayOfMonth.getDate();
    
    // In JS: 0=Sun, 1=Mon, ..., 6=Sat
    // For Israeli RTL week starting Sunday:
    const startDay = firstDayOfMonth.getDay(); 

    const prevMonthLastDate = new Date(year, month, 0).getDate();

    const monthNamesHe = [
      "ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני",
      "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"
    ];

    return {
      monthName: `${monthNamesHe[month]} ${year}`,
      daysInMonth: daysInCurrentMonth,
      startWeekday: startDay,
      prevMonthDays: prevMonthLastDate,
    };
  }, [year, month]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Helper to format YYYY-MM-DD
  const formatDayString = (day: number) => {
    const mStr = String(month + 1).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    return `${year}-${mStr}-${dStr}`;
  };

  // Days grid
  const daysGrid = useMemo(() => {
    const grid: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = [];

    // Prev month padding
    for (let i = startWeekday - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const prevM = month === 0 ? 12 : month;
      const prevY = month === 0 ? year - 1 : year;
      grid.push({
        dateStr: `${prevY}-${String(prevM).padStart(2, "0")}-${String(d).padStart(2, "0")}`,
        dayNum: d,
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      grid.push({
        dateStr: formatDayString(d),
        dayNum: d,
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill weeks (multiple of 7)
    const remaining = 7 - (grid.length % 7);
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const nextM = month === 11 ? 1 : month + 2;
        const nextY = month === 11 ? year + 1 : year;
        grid.push({
          dateStr: `${nextY}-${String(nextM).padStart(2, "0")}-${String(i).padStart(2, "0")}`,
          dayNum: i,
          isCurrentMonth: false,
        });
      }
    }

    return grid;
  }, [year, month, startWeekday, daysInMonth, prevMonthDays]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);

  return (
    <div className="space-y-6">
      {/* Legend & Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 sm:p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        {/* Navigation */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-1.5">
            <button 
              onClick={handlePrevMonth}
              className="p-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              ←
            </button>
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 min-w-[110px] text-center font-sans">
              {monthName}
            </span>
            <button 
              onClick={handleNextMonth}
              className="p-1.5 px-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300 transition-colors"
            >
              →
            </button>
          </div>
          <button
            onClick={handleToday}
            className="text-xs px-2.5 py-1 rounded border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            היום
          </button>
        </div>

        {/* Pastel Color Legend */}
        <div className="flex items-center gap-3 text-xs font-mono flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-indigo-100 border border-indigo-300 dark:bg-indigo-950/70 dark:border-indigo-800" />
            <span className="text-zinc-600 dark:text-zinc-400">אפיק</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/70 dark:border-emerald-800" />
            <span className="text-zinc-600 dark:text-zinc-400">משימה</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-100 border border-amber-300 dark:bg-amber-950/70 dark:border-amber-800" />
            <span className="text-zinc-600 dark:text-zinc-400">צוואר בקבוק</span>
          </div>
        </div>
      </div>

      {/* Empty State warning if no dates have been set yet */}
      {calendarItems.length === 0 && (
        <div className="p-4 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 text-center text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/40">
          לא הוגדרו עדיין תאריכים לפרויקט, לאפיקים או למשימות. ניתן להגדיר תאריכים בשלב 6 במסע או בהגדרות המשימות.
        </div>
      )}

      {/* Calendar Grid - with smooth horizontal scroll container on mobile */}
      <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm no-scrollbar">
        <div className="min-w-[540px]">
          {/* Days Header */}
          <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/80 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 py-2.5">
            <div>א׳</div>
            <div>ב׳</div>
            <div>ג׳</div>
            <div>ד׳</div>
            <div>ה׳</div>
            <div>ו׳</div>
            <div>ש׳</div>
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-zinc-200 dark:divide-zinc-800">
            {daysGrid.map((dayObj, idx) => {
              const isToday = dayObj.dateStr === todayStr;

              // Find matching items for this day
              const dayItems = calendarItems.filter((item) => {
                return dayObj.dateStr >= item.startDate && dayObj.dateStr <= item.endDate;
              });

              return (
                <div
                  key={idx}
                  className={`min-h-[90px] sm:min-h-[105px] p-1.5 transition-colors flex flex-col justify-between ${
                    !dayObj.isCurrentMonth
                      ? "bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-400 dark:text-zinc-600"
                      : isToday
                      ? "bg-indigo-50/20 dark:bg-indigo-950/10"
                      : "bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200"
                  }`}
                >
                {/* Date Header inside cell */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`text-[11px] font-mono px-1.5 py-0.5 rounded ${
                      isToday
                        ? "bg-indigo-600 text-white font-bold"
                        : "text-zinc-500 dark:text-zinc-400 font-medium"
                    }`}
                  >
                    {dayObj.dayNum}
                  </span>
                </div>

                {/* Items for this date */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] no-scrollbar flex-1">
                  {dayItems.map((item) => {
                    let badgeStyle = "";
                    if (item.type === "avenue") {
                      badgeStyle = "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300";
                    } else if (item.type === "bottleneck") {
                      badgeStyle = "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300";
                    } else {
                      badgeStyle = "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300";
                    }

                    return (
                      <div
                        key={item.id}
                        title={`${item.title} (${item.startDate} עד ${item.endDate})`}
                        className={`text-[10px] px-1.5 py-0.5 rounded border truncate transition-opacity ${badgeStyle} ${
                          item.completed ? "opacity-60 line-through" : ""
                        }`}
                      >
                        {item.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      {/* Timeline Summary Table (Gantt list view) */}
      <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-3">
        <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider font-sans">
          רשימת זמנים מרוכזת (Timeline)
        </h4>

        {calendarItems.length === 0 ? (
          <div className="text-xs text-zinc-400">אין פריטים עם תאריכים מוגדרים.</div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {calendarItems.map((item) => {
              let tag = "משימה";
              let tagColor = "text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800";
              if (item.type === "avenue") {
                tag = "אפיק";
                tagColor = "text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800";
              } else if (item.type === "bottleneck") {
                tag = "צוואר בקבוק";
                tagColor = "text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800";
              }

              return (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-mono ${tagColor}`}>
                      {tag}
                    </span>
                    <span className={`font-medium ${item.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}`}>
                      {item.title}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <span>{item.startDate}</span>
                    <span>←</span>
                    <span>{item.endDate}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
