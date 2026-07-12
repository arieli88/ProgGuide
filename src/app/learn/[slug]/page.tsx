import { notFound } from "next/navigation";
import { getAdjacentChapters, getAllChapters, getChapterById } from "@/lib/content";
import { ChapterPageClient } from "./chapter-page-client";

export function generateStaticParams() {
  return getAllChapters().map((c) => ({ slug: c.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterById(slug);
  return { title: chapter ? `${chapter.title} | תכנות מתקדם C#` : "פרק" };
}

export default async function LearnPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const chapter = getChapterById(slug);
  if (!chapter) notFound();
  const { prev, next } = getAdjacentChapters(slug);
  return <ChapterPageClient chapter={chapter} prev={prev} next={next} />;
}
