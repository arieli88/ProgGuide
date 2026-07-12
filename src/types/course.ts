export type CalloutType = "info" | "warning" | "tip" | "note" | "exam";

export interface CalloutBlock {
  type: CalloutType;
  title: string;
  content: string;
}

export interface LessonStep {
  number: number;
  title: string;
  body: string;
}

export interface LessonCard {
  title: string;
  subtitle?: string;
  items: string[];
  highlight?: string;
}

export interface LessonDiagramNode {
  id: string;
  label: string;
  description?: string;
}

export interface LessonDiagramEdge {
  from: string;
  to: string;
  label?: string;
}

export interface LessonDiagram {
  kind: "flow" | "pipeline" | "hierarchy" | "callstack" | "blueprint";
  title?: string;
  nodes: LessonDiagramNode[];
  edges?: LessonDiagramEdge[];
  columns?: LessonDiagramNode[][];
}

export interface LessonInlineCode {
  title?: string;
  code: string;
  annotations?: { line: number; text: string }[];
}

export interface LessonTable {
  headers: string[];
  rows: string[][];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  callouts?: CalloutBlock[];
  steps?: LessonStep[];
  cards?: LessonCard[];
  diagram?: LessonDiagram;
  inlineCode?: LessonInlineCode;
  table?: LessonTable;
}

export interface CodeLineExplanation {
  line: number;
  text: string;
}

export interface CodeExample {
  id: string;
  title: string;
  level: "basic" | "intermediate" | "advanced";
  code: string;
  language: "csharp";
  explanation: string;
  lineByLine?: CodeLineExplanation[];
}

export interface Comparison {
  title: string;
  left: string;
  right: string;
  rows: { aspect: string; left: string; right: string }[];
}

export interface Mistake {
  title: string;
  description: string;
  why: string;
  howToAvoid: string;
}

export interface ChapterIntroduction {
  what: string;
  why: string;
  when: string;
}

export interface ProjectMemberAnalysis {
  name: string;
  kind: "field" | "property" | "constructor" | "method" | "operator" | "interface";
  explanation: string;
}

export interface ProjectClassAnalysis {
  className: string;
  role: string;
  inherits?: string;
  implements?: string[];
  members: ProjectMemberAnalysis[];
}

export interface ProjectAnalysis {
  id: string;
  title: string;
  sourcePath: string;
  overview: string;
  classes: ProjectClassAnalysis[];
  executionFlow: string;
  examConnections: string[];
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  prerequisites: string[];
  sources: string[];
  estimatedMinutes: number;
  introduction: ChapterIntroduction;
  sections: ContentSection[];
  codeExamples: CodeExample[];
  commonMistakes: Mistake[];
  examTips: string[];
  comparisons: Comparison[];
  summary: string;
  projectAnalysis?: ProjectAnalysis[];
}

export interface MultipleChoiceOption {
  id: string;
  text: string;
}

export interface TermExplanation {
  term: string;
  explanation: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  code?: string;
  termsContext?: TermExplanation[];
  options: MultipleChoiceOption[];
  correctId: string;
  explanation: string;
  detailedExplanation?: string;
  wrongExplanations: Record<string, string>;
  difficulty: "easy" | "medium" | "hard";
  topicId: string;
}

export interface OpenQuestion {
  id: string;
  question: string;
  hint?: string;
  sampleAnswer: string;
  topicId: string;
}

export interface CodeExercise {
  id: string;
  type: "complete" | "debug" | "write" | "predict";
  title: string;
  prompt: string;
  starterCode?: string;
  solution: string;
  explanation: string;
  topicId: string;
}

export interface ChapterPractice {
  chapterId: string;
  multipleChoice: MultipleChoiceQuestion[];
  openQuestions: OpenQuestion[];
  codeExercises: CodeExercise[];
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  chapterIds: string[];
}

export interface CourseIndex {
  title: string;
  description: string;
  modules: CourseModule[];
  chapters: { id: string; title: string; order: number }[];
}

export interface ExamQuestion extends MultipleChoiceQuestion {
  chapterIds: string[];
}

export interface UserProgress {
  completedChapters: string[];
  answeredQuestions: Record<string, string>;
  examAttempts: ExamAttempt[];
  practiceStats: Record<string, { correct: number; total: number }>;
}

export interface ExamAttempt {
  id: string;
  date: string;
  score: number;
  total: number;
  weakTopics: string[];
  wrongQuestionIds: string[];
}

export interface ExamResult {
  score: number;
  total: number;
  percentage: number;
  weakTopics: { chapterId: string; title: string; wrongCount: number }[];
  details: {
    questionId: string;
    correct: boolean;
    selectedId: string;
    correctId: string;
    chapterId: string;
  }[];
}
