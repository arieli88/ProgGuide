import { notFound } from "next/navigation";
import { getAllChapters, getChapterById, getChapterPractice } from "@/lib/content";
import { PracticePageClient } from "./practice-page-client";

export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.id }));
}

export default async function PracticePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterById(slug);
  const practice = getChapterPractice(slug);
  if (!chapter || !practice) notFound();
  return <PracticePageClient practice={practice} chapterTitle={chapter.title} />;
}
