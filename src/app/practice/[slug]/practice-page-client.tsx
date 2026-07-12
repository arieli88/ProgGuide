"use client";

import type { ChapterPractice } from "@/types/course";
import { QuizView } from "@/components/quiz-view";
import { useProgress } from "@/hooks/use-progress";

interface PracticePageClientProps {
  practice: ChapterPractice;
  chapterTitle: string;
}

export function PracticePageClient({ practice, chapterTitle }: PracticePageClientProps) {
  const { recordAnswer } = useProgress();
  return (
    <QuizView
      practice={practice}
      chapterTitle={chapterTitle}
      onAnswer={(id, selected, correct) => recordAnswer(id, selected, correct, practice.chapterId)}
    />
  );
}
