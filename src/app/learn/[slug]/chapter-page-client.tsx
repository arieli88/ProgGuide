"use client";

import type { Chapter } from "@/types/course";
import { ChapterView } from "@/components/chapter-view";
import { useProgress } from "@/hooks/use-progress";

interface ChapterPageClientProps {
  chapter: Chapter;
  prev?: Chapter;
  next?: Chapter;
}

export function ChapterPageClient({ chapter, prev, next }: ChapterPageClientProps) {
  const { progress, markChapterComplete } = useProgress();
  const isCompleted = progress.completedChapters.includes(chapter.id);

  return (
    <ChapterView
      chapter={chapter}
      prev={prev}
      next={next}
      isCompleted={isCompleted}
      onComplete={() => markChapterComplete(chapter.id)}
    />
  );
}
