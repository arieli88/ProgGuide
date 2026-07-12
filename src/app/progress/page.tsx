"use client";

import Link from "next/link";
import { getAllChapters } from "@/lib/content";
import { useProgress } from "@/hooks/use-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/link-button";

export default function ProgressPage() {
  const { progress, loaded, getCompletionPercent, getSuccessRate } = useProgress();
  const chapters = getAllChapters();

  if (!loaded) return <div className="p-8 text-center text-muted-foreground">טוען...</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-8 text-3xl font-bold">התקדמות הלמידה</h1>

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{getCompletionPercent(chapters.length)}%</p>
            <p className="text-sm text-muted-foreground">השלמת קורס</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{getSuccessRate()}%</p>
            <p className="text-sm text-muted-foreground">הצלחה בתרגול</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold">{progress.examAttempts.length}</p>
            <p className="text-sm text-muted-foreground">מבחנים</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>פרקים</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {chapters.map((ch) => {
            const done = progress.completedChapters.includes(ch.id);
            const stats = progress.practiceStats[ch.id];
            return (
              <div key={ch.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{ch.title}</span>
                    {done && <Badge variant="secondary">הושלם</Badge>}
                  </div>
                  {stats && (
                    <p className="text-xs text-muted-foreground">
                      תרגול: {stats.correct}/{stats.total} נכון
                    </p>
                  )}
                </div>
                <LinkButton href={`/learn/${ch.id}`} variant="ghost" size="sm">
                  לפרק
                </LinkButton>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {progress.examAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>היסטוריית מבחנים</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[...progress.examAttempts].reverse().map((a) => (
              <div key={a.id} className="rounded-lg border p-4">
                <div className="mb-2 flex justify-between">
                  <span className="text-sm">{new Date(a.date).toLocaleDateString("he-IL")}</span>
                  <span className="font-bold">{a.score}/{a.total}</span>
                </div>
                <Progress value={(a.score / a.total) * 100} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
