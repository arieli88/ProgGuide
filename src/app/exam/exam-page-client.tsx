"use client";

import type { ExamQuestion } from "@/types/course";
import { ExamView } from "@/components/exam-view";
import { useProgress } from "@/hooks/use-progress";

export function ExamPageClient({ questions }: { questions: ExamQuestion[] }) {
  const { recordExamAttempt } = useProgress();

  return (
    <ExamView
      questions={questions}
      onComplete={(result) =>
        recordExamAttempt({
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          score: result.score,
          total: result.total,
          weakTopics: result.weakTopics.map((t) => t.chapterId),
          wrongQuestionIds: result.details.filter((d) => !d.correct).map((d) => d.questionId),
        })
      }
    />
  );
}
