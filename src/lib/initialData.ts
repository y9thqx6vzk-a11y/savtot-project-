import { ProjectData } from '../types/project';

export const sampleProject: ProjectData = {
  // שלב 1: סיפור
  oneLiner: "אפליקציית רשת להנגשת עולם ניהול הפרויקטים ומעקב יומיומי ללא עומס",
  problem: "העומס שיש הרבה פעמים בפרויקטים, וכתוצאה מאותו עומס נוצר בלאגן, ודחייה או ביטול של הפרויקט.",
  targetAudience: "כל אחד שרוצה בצורה מקצועית ופשוטה לייצר תוכנית עבודה, ואז מקום לעקוב אחרי הביצועים שלו, בצורה יומיומית.",
  dayInTheLife: "המשתמש מתחיל את העבודה בכמה שלבים פשוטים, מתכנן בצורה נכונה, ועוקב יומיומית ללא בלאגן אחר השגת הערך האמיתי.",

  // שלב 2: חלוקה לנושאים ולמידה
  knowledgeGaps: [
    {
      id: "kg-1",
      description: "פיתוח אפליקציית רשת בסיוע בינה מלאכותית (גוגל ג'מיני) והרצה ב-Vercel",
      category: "critical",
      mitigation: "הקמת שלד ראשוני ב-Next.js, חיבור לגיטהאב והרצה ב-Vercel לאימות מהיר"
    },
    {
      id: "kg-2",
      description: "העמקת מתודולוגיות ניהול פרויקטים ומדידת תוצאות מפתח (ספרי Kahneman, Goldratt, Doerr)",
      category: "acquired",
      mitigation: "יישום עקרונות The Goal, Thinking Fast & Slow ו-Measure What Matters בממשק"
    },
    {
      id: "kg-3",
      description: "הבדלה בין פער קריטי (חוסר בשלות טכנולוגית) לפער נרכש (תוך כדי עבודה)",
      category: "critical",
      mitigation: "ספייק הנדסי לבחינת טכנולוגיות טרם אימוצן בליבת המערכת"
    }
  ],

  // שלב 3: חלוקה לאפיקים + פרה-מורטם
  avenues: [
    {
      id: "ave-1",
      title: "אפיק 1: קליטת החלום והסיפור (Stage 1)",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-1",
          title: "ממשק אשף רציף וממוקד להגדרת הסיפור והחזון",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: true,
          okr: { metric: "זמן מענה ממוצע לשלב", current: 2, target: 3, unit: "דקות" }
        },
        {
          id: "t-2",
          title: "זיהוי פערי ידע וסיווג פער קריטי מול נרכש",
          isEssential: true,
          isBottleneck: true,
          delayDays: 1,
          completed: false,
          okr: { metric: "סיכונים קריטיים שאותרו", current: 2, target: 2, unit: "סיכונים" }
        }
      ]
    },
    {
      id: "ave-2",
      title: "אפיק 2: לו״ז דינמי וחוצצי ביטחון ברמזור",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-3",
          title: "השמת חוצצים בשלושת המוקדים: צוואר בקבוק, ענפי משנה וסוף פרויקט",
          isEssential: true,
          isBottleneck: true,
          delayDays: 0,
          completed: false,
          okr: { metric: "כיסוי חוצצי ביטחון", current: 100, target: 100, unit: "%" }
        },
        {
          id: "t-4",
          title: "אלגוריתם שיטת הרמזור (ירוק < 33%, צהוב 33-66%, אדום > 66%)",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: true,
          okr: { metric: "דיוק התרעות רמזור", current: 100, target: 100, unit: "%" }
        }
      ]
    },
    {
      id: "ave-3",
      title: "אפיק 3: לוח השלד ומעקב ערך יומיומי (Stage 2)",
      isCriticalPath: true,
      tasks: [
        {
          id: "t-5",
          title: "תצוגת שלד משימות נקייה עם מתג סינון גרסת חצי הזמן (MVP)",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "הפחתת עומס ויזואלי", current: 80, target: 80, unit: "%" }
        },
        {
          id: "t-6",
          title: "הטמעת מדדי OKRs כמותיים: 'אין תוצאת מפתח ללא מספר'",
          isEssential: true,
          isBottleneck: false,
          delayDays: 0,
          completed: false,
          okr: { metric: "משימות בעלות מספר יעד", current: 6, target: 6, unit: "משימות" }
        }
      ]
    }
  ],
  preMortem: "מה יכול להשתבש ולגרום למוות של הפרויקט? עומס יתר של פיצ'רים וסיבוך הממשק, שיובילו לבלאגן ולביטול הפרויקט.",

  // שלב 4: מבט מבחוץ
  referenceProject: "כלי ניהול פרויקטים מבוסס לוחות Kanban",
  plannedDurationDays: 14,
  actualDurationDays: 24,
  optimismGapPercent: 71,
  addedValueText: "פשטות קיצונית, מעבר דו-שלבי מחלום לשלד, וחוצץ רמזור במקום לו״ז קשיח.",
  lessonsLearnedText: "הימנעות מלוחות זמנים קשיחים ומחנק משימות – מתן רמת אמינות באחוזים וחוצץ בצווארי בקבוק.",
  historicalBenchmarks: [
    {
      id: 'bench-1',
      title: 'פיתוח לוח משימות אישי',
      plannedDays: 14,
      actualDays: 24,
      gapPercent: 71,
      addedValue: "ממשק פשוט יותר",
      lessonsLearned: "הלו״ז נמתח פי 1.7 בגלל היעדר חוצץ ביטחון"
    },
    {
      id: 'bench-2',
      title: 'מערכת תיעוד יומיומית',
      plannedDays: 20,
      actualDays: 28,
      gapPercent: 40,
      addedValue: "ללא צורך בהתקנה",
      lessonsLearned: "צווארי בקבוק שלא זוהו גרמו לביטול שלבים"
    }
  ],

  // שלב 6: חוצץ ביטחון
  totalBufferDays: 8,
  bottleneckBufferDays: 3,
  subBranchBufferDays: 2,
  endProjectBufferDays: 3,
};
