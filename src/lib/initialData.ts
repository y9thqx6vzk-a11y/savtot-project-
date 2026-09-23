import { ProjectData } from '../types/project';

export const sampleProject: ProjectData = {
  oneLiner: "כלי תכנון פרויקטים להפחתת עומס קוגניטיבי",
  problem: "כלים מסורתיים כמו Jira עמוסים מדי, רועשים ומסיחים את הדעת מהעבודה המהותית.",
  targetAudience: "מפתחים עצמאיים, פאונדרים וצוותים זריזים שמחפשים פשטות ומיקוד.",
  dayInTheLife: "המשתמש מתכנן פרויקט שלם ב-10 דקות ועוקב אחריו בנחת ללא תפריטים מסובכים ובירוקרטיה.",
  knowledgeGaps: [
    {
      id: "kg-1",
      description: "ביצועי אנימציות גובה רציפות ב-Framer Motion",
      category: "tech",
      mitigation: "בניית אב-טיפוס ובדיקה במכשירים ניידים"
    },
    {
      id: "kg-2",
      description: "אימות נכונות המשתמשים לעבוד ללא תפריטי צד",
      category: "market",
      mitigation: "ראיון 5 משתמשי בטא ראשונים"
    }
  ],
  avenues: [
    {
      id: "ave-1",
      title: "ארכיטקטורת ליבה",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-1",
          title: "הגדרת Next.js ו-Tailwind בעיצוב חם בהשראת אפל",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: true,
          okr: { metric: "זמן הקמה", current: 1, target: 1, unit: "ימים" }
        },
        {
          id: "t-2",
          title: "מימוש מנגנון סנכרון ושמירה מושהה ב-Zustand",
          isEssential: true,
          isBottleneck: true,
          delayDays: 1,
          completed: false,
          okr: { metric: "תקלות סנכרון", current: 0, target: 0, unit: "באגים" }
        }
      ]
    },
    {
      id: "ave-2",
      title: "לוח בקרת השלד (Stage 2)",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-3",
          title: "בניית ממשק רמזור החוצצים הדינמי",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "זמן רינדור", current: 16, target: 16, unit: "מילישניות" }
        },
        {
          id: "t-4",
          title: "ייצוא נתוני פרויקט לקובץ JSON ו-Markdown",
          isEssential: false,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "אורך פונקציה", current: 30, target: 50, unit: "שורות" }
        }
      ]
    },
    {
      id: "ave-3",
      title: "הפצה והשקה",
      isCriticalPath: false,
      tasks: [
        {
          id: "t-5",
          title: "חיבור דומיין והגדרת Vercel Analytics",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "זמן טעינה", current: 0.8, target: 1.0, unit: "שניות" }
        }
      ]
    }
  ],
  preMortem: "הפרויקט נכשל משום שהממשק הפך לעמוס מדי ברכיבים, מה שסתר את העיקרון המקורי של שקט נפשי.",
  referenceProject: "אפליקציית ניהול משימות מינימליסטית",
  plannedDurationDays: 14,
  actualDurationDays: 20,
  optimismGapPercent: 43,
  historicalBenchmarks: [
    {
      id: 'bench-1',
      title: 'עיצוב מחדש של מערכת התשלומים והאימות',
      plannedDays: 14,
      actualDays: 20,
      gapPercent: 43,
    },
    {
      id: 'bench-2',
      title: 'מנוע סנכרון בזמן אמת',
      plannedDays: 30,
      actualDays: 40,
      gapPercent: 33,
    }
  ],
  totalBufferDays: 6,
};
