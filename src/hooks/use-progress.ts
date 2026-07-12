"use client";

import { useCallback, useEffect, useState } from "react";
import type { ExamAttempt, UserProgress } from "@/types/course";

const STORAGE_KEY = "csharp-course-progress";

const defaultProgress: UserProgress = {
  completedChapters: [],
  answeredQuestions: {},
  examAttempts: [],
  practiceStats: {},
};

export function useProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setProgress({ ...defaultProgress, ...JSON.parse(raw) });
    } catch {
      setProgress(defaultProgress);
    }
    setLoaded(true);
  }, []);

  const persist = useCallback((next: UserProgress) => {
    setProgress(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const markChapterComplete = useCallback(
    (chapterId: string) => {
      if (progress.completedChapters.includes(chapterId)) return;
      persist({ ...progress, completedChapters: [...progress.completedChapters, chapterId] });
    },
    [persist, progress]
  );

  const recordAnswer = useCallback(
    (questionId: string, selectedId: string, correct: boolean, topicId: string) => {
      const stats = { ...progress.practiceStats };
      const current = stats[topicId] ?? { correct: 0, total: 0 };
      if (!progress.answeredQuestions[questionId]) {
        stats[topicId] = {
          correct: current.correct + (correct ? 1 : 0),
          total: current.total + 1,
        };
      }
      persist({
        ...progress,
        answeredQuestions: { ...progress.answeredQuestions, [questionId]: selectedId },
        practiceStats: stats,
      });
    },
    [persist, progress]
  );

  const recordExamAttempt = useCallback(
    (attempt: ExamAttempt) => {
      persist({ ...progress, examAttempts: [...progress.examAttempts, attempt] });
    },
    [persist, progress]
  );

  const getCompletionPercent = useCallback(
    (totalChapters: number) => {
      if (totalChapters === 0) return 0;
      return Math.round((progress.completedChapters.length / totalChapters) * 100);
    },
    [progress.completedChapters.length]
  );

  const getSuccessRate = useCallback(() => {
    const totals = Object.values(progress.practiceStats);
    const correct = totals.reduce((s, t) => s + t.correct, 0);
    const total = totals.reduce((s, t) => s + t.total, 0);
    return total === 0 ? 0 : Math.round((correct / total) * 100);
  }, [progress.practiceStats]);

  return {
    progress,
    loaded,
    markChapterComplete,
    recordAnswer,
    recordExamAttempt,
    getCompletionPercent,
    getSuccessRate,
  };
}
