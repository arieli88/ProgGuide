"use client";

import type { MultipleChoiceQuestion } from "@/types/course";
import { FinalChallengeView } from "@/components/final-challenge-view";
import { useProgress } from "@/hooks/use-progress";

export function FinalChallengePageClient({ questions }: { questions: MultipleChoiceQuestion[] }) {
  const { recordExamAttempt } = useProgress();

  return (
    <FinalChallengeView
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
