import type { Chapter, ChapterPractice, CourseIndex, ExamQuestion, MultipleChoiceQuestion } from "@/types/course";
import courseIndexData from "@/data/course-index.json";
import finalExamData from "@/data/final-exam.json";

import introduction from "@/content/chapters/introduction.json";
import classesObjects from "@/content/chapters/classes-objects.json";
import methodsEncapsulation from "@/content/chapters/methods-encapsulation.json";
import inheritance from "@/content/chapters/inheritance.json";
import polymorphism from "@/content/chapters/polymorphism.json";
import castingRelationships from "@/content/chapters/casting-relationships.json";
import properties from "@/content/chapters/properties.json";
import operatorOverloading from "@/content/chapters/operator-overloading.json";
import interfacesAbstract from "@/content/chapters/interfaces-abstract.json";
import exceptions from "@/content/chapters/exceptions.json";
import files from "@/content/chapters/files.json";
import mysql from "@/content/chapters/mysql.json";
import libraryProject from "@/content/chapters/library-project.json";

import practiceIntroduction from "@/data/practice/introduction.json";
import practiceClassesObjects from "@/data/practice/classes-objects.json";
import practiceMethodsEncapsulation from "@/data/practice/methods-encapsulation.json";
import practiceInheritance from "@/data/practice/inheritance.json";
import practicePolymorphism from "@/data/practice/polymorphism.json";
import practiceCastingRelationships from "@/data/practice/casting-relationships.json";
import practiceProperties from "@/data/practice/properties.json";
import practiceOperatorOverloading from "@/data/practice/operator-overloading.json";
import practiceInterfacesAbstract from "@/data/practice/interfaces-abstract.json";
import practiceExceptions from "@/data/practice/exceptions.json";
import practiceFiles from "@/data/practice/files.json";
import practiceMysql from "@/data/practice/mysql.json";
import practiceLibraryProject from "@/data/practice/library-project.json";

const chapters: Chapter[] = [
  introduction,
  classesObjects,
  methodsEncapsulation,
  inheritance,
  polymorphism,
  castingRelationships,
  properties,
  operatorOverloading,
  interfacesAbstract,
  exceptions,
  files,
  mysql,
  libraryProject,
] as Chapter[];

const practiceMap: Record<string, ChapterPractice> = {
  introduction: practiceIntroduction as ChapterPractice,
  "classes-objects": practiceClassesObjects as ChapterPractice,
  "methods-encapsulation": practiceMethodsEncapsulation as ChapterPractice,
  inheritance: practiceInheritance as ChapterPractice,
  polymorphism: practicePolymorphism as ChapterPractice,
  "casting-relationships": practiceCastingRelationships as ChapterPractice,
  properties: practiceProperties as ChapterPractice,
  "operator-overloading": practiceOperatorOverloading as ChapterPractice,
  "interfaces-abstract": practiceInterfacesAbstract as ChapterPractice,
  exceptions: practiceExceptions as ChapterPractice,
  files: practiceFiles as ChapterPractice,
  mysql: practiceMysql as ChapterPractice,
  "library-project": practiceLibraryProject as ChapterPractice,
};

export function getCourseIndex(): CourseIndex {
  return courseIndexData as CourseIndex;
}

export function getAllChapters(): Chapter[] {
  return [...chapters].sort((a, b) => a.order - b.order);
}

export function getChapterById(id: string): Chapter | undefined {
  return chapters.find((c) => c.id === id);
}

export function getAdjacentChapters(id: string): { prev?: Chapter; next?: Chapter } {
  const sorted = getAllChapters();
  const index = sorted.findIndex((c) => c.id === id);
  return {
    prev: index > 0 ? sorted[index - 1] : undefined,
    next: index < sorted.length - 1 ? sorted[index + 1] : undefined,
  };
}

export function getChapterPractice(chapterId: string): ChapterPractice | undefined {
  return practiceMap[chapterId];
}

export function getFinalExamQuestions(): ExamQuestion[] {
  return finalExamData as ExamQuestion[];
}

export function searchChapters(query: string): Chapter[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return getAllChapters().filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.subtitle.toLowerCase().includes(q) ||
      c.sections.some((s) => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q))
  );
}

export function getChapterTitle(id: string): string {
  return getChapterById(id)?.title ?? id;
}

export function getAllChallengeQuestions(): MultipleChoiceQuestion[] {
  const seenIds = new Set<string>();
  const seenText = new Set<string>();
  const all: MultipleChoiceQuestion[] = [];

  for (const chapter of getAllChapters()) {
    const practice = practiceMap[chapter.id];
    if (!practice) continue;
    for (const q of practice.multipleChoice) {
      const textKey = q.question.trim();
      if (seenIds.has(q.id) || seenText.has(textKey)) continue;
      seenIds.add(q.id);
      seenText.add(textKey);
      all.push({ ...q, topicId: q.topicId || chapter.id });
    }
  }

  return all;
}
