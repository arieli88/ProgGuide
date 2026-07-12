"use client";

import Link from "next/link";
import type { ExamResult } from "@/types/course";
import { getChapterTitle } from "@/lib/content";
import { Callout } from "@/components/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ExamResultsSummaryProps {
  title: string;
  result: ExamResult;
  variant?: "violet" | "amber";
}

function getTopicBreakdown(result: ExamResult) {
  const map = new Map<string, { correct: number; total: number }>();
  result.details.forEach((d) => {
    const cur = map.get(d.chapterId) ?? { correct: 0, total: 0 };
    map.set(d.chapterId, {
      correct: cur.correct + (d.correct ? 1 : 0),
      total: cur.total + 1,
    });
  });
  return [...map.entries()]
    .map(([chapterId, s]) => ({
      chapterId,
      title: getChapterTitle(chapterId),
      correct: s.correct,
      total: s.total,
      percentage: Math.round((s.correct / s.total) * 100),
    }))
    .sort((a, b) => a.percentage - b.percentage);
}

function gradeLabel(percentage: number) {
  if (percentage >= 90) return "מצוין";
  if (percentage >= 75) return "טוב מאוד";
  if (percentage >= 60) return "עובר";
  return "לחיזוק";
}

export function ExamResultsSummary({ title, result, variant = "violet" }: ExamResultsSummaryProps) {
  const topics = getTopicBreakdown(result);
  const gradient =
    variant === "amber"
      ? "border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-orange-500/10"
      : "border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-indigo-500/10";
  const barColor = variant === "amber" ? "bg-amber-500" : undefined;

  return (
    <>
      <Card className={cn("mb-6", gradient)}>
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-5xl font-bold">{result.percentage}%</p>
              <p className="text-lg text-muted-foreground">אחוז הצלחה</p>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl font-semibold">{result.score} / {result.total}</p>
              <p className="text-sm text-muted-foreground">{gradeLabel(result.percentage)}</p>
            </div>
          </div>
          <Progress value={result.percentage} className={cn("mt-6 h-4", barColor)} />
          <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-lg bg-emerald-500/10 p-3">
              <p className="font-bold text-emerald-600">{result.score}</p>
              <p className="text-muted-foreground">נכונות</p>
            </div>
            <div className="rounded-lg bg-red-500/10 p-3">
              <p className="font-bold text-red-600">{result.total - result.score}</p>
              <p className="text-muted-foreground">שגויות</p>
            </div>
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="font-bold">{result.total}</p>
              <p className="text-muted-foreground">סה״כ</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">אחוזי הצלחה לפי נושא</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {topics.map((t) => (
            <div key={t.chapterId}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <Link href={`/learn/${t.chapterId}`} className="font-medium hover:text-violet-500 hover:underline">
                  {t.title}
                </Link>
                <span className={cn(
                  "font-semibold",
                  t.percentage >= 60 ? "text-emerald-600" : "text-red-600"
                )}>
                  {t.percentage}% ({t.correct}/{t.total})
                </span>
              </div>
              <Progress value={t.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {result.weakTopics.length > 0 && (
        <Callout type="warning" title="נושאים לחיזוק">
          <ul className="space-y-2">
            {result.weakTopics.map((t) => (
              <li key={t.chapterId}>
                <Link href={`/learn/${t.chapterId}`} className="text-violet-500 underline">
                  {t.title}
                </Link>
                {" "}— {t.wrongCount} טעויות
              </li>
            ))}
          </ul>
        </Callout>
      )}
    </>
  );
}
