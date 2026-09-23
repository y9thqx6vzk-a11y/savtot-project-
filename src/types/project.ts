export type GapCategory = 'critical' | 'acquired'; // פער קריטי (עלול לבטל פרויקט) מול פער נרכש (נלמד תוך כדי תנועה)

export interface KnowledgeGap {
  id: string;
  description: string;
  category: GapCategory;
  mitigation: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskOKR {
  metric: string; // יעד ומדד כמותי
  target: number; // מספר היעד
  current: number; // מצב נוכחי
  unit: string; // יחידת מידה
}

export interface Task {
  id: string;
  title: string;
  isEssential: boolean; // חיוני לגרסת חצי הזמן / MVP
  isBottleneck: boolean; // צוואר בקבוק
  delayDays: number; // ימי עיכוב
  okr: TaskOKR;
  completed: boolean;
  subtasks?: SubTask[]; // תתי משימות
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface Avenue {
  id: string;
  title: string;
  isCriticalPath: boolean; // שלד בסיסי: 3-5 צעדים שבלעדיהם התהליך נשבר
  tasks: Task[];
  startDate?: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface HistoricalBenchmark {
  id: string;
  title: string;
  plannedDays?: number;
  actualDays?: number;
  gapPercent?: number;
  lessonsLearned?: string;
  addedValue?: string;
  teamOrScale?: string; // היקף צוות / סדר גודל (למשל: יחיד, צוות של 3, מוצר קיים בשוק)
  keyHurdles?: string; // איפה הם הסתבכו או מה הבעיות במוצר שלהם
  freeNotes?: string; // טקסט חופשי, קישורים, תצפיות
}

export interface ProjectData {
  // שלב 1: סיפור
  oneLiner: string;
  problem: string;
  targetAudience: string;
  dayInTheLife: string;

  // שלב 2: חלוקה לנושאים ולמידה
  knowledgeGaps: KnowledgeGap[];

  // שלב 3: חלוקה לאפיקים + פרה-מורטם
  avenues: Avenue[];
  preMortem: string;

  // שלב 4: מבט מבחוץ
  referenceProject: string;
  plannedDurationDays: number;
  actualDurationDays: number;
  optimismGapPercent: number;
  addedValueText?: string;
  lessonsLearnedText?: string;
  outsideViewNotes?: string; // טקסט חופשי לתצפיות שטח, מוצרים מתחרים או מודלים לחיקוי
  referenceScale?: string; // היקף צוות, סדר גודל או משאבים
  historicalBenchmarks: HistoricalBenchmark[];

  // שלב 6: בניית לו״ז וחוצץ ביטחון
  startDate?: string; // תאריך התחלת הפרויקט
  endDate?: string; // תאריך סיום הפרויקט
  totalBufferDays: number;
  bottleneckBufferDays?: number;
  subBranchBufferDays?: number;
  endProjectBufferDays?: number;
}

export interface ProjectRecord {
  id: string;
  name: string;
  updatedAt: number;
  data: ProjectData;
}
