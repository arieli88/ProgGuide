"use client";

import type { ExamBundle } from "@/lib/content";
import { ExamView } from "@/components/exam-view";
import { useProgress } from "@/hooks/use-progress";

export function ExamPageClient({ bundles }: { bundles: ExamBundle[] }) {
  const { recordExamAttempt } = useProgress();

  return (
    <ExamView
      bundles={bundles}
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
