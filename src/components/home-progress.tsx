"use client";

import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProgress } from "@/hooks/use-progress";

interface HomeProgressProps {
  totalChapters: number;
}

export function HomeProgress({ totalChapters }: HomeProgressProps) {
  const { progress, loaded, getCompletionPercent, getSuccessRate } = useProgress();

  if (!loaded) return null;

  const completion = getCompletionPercent(totalChapters);
  const success = getSuccessRate();
  const exams = progress.examAttempts.length;
  const questions = Object.values(progress.practiceStats).reduce((s, t) => s + t.total, 0);

  return (
    <Card className="mb-12 border-violet-500/20">
      <CardHeader>
        <CardTitle className="text-lg">ההתקדמות שלך</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div>
            <p className="text-2xl font-bold">{progress.completedChapters.length}/{totalChapters}</p>
            <p className="text-xs text-muted-foreground">פרקים שהושלמו</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{questions}</p>
            <p className="text-xs text-muted-foreground">שאלות שנענו</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{exams}</p>
            <p className="text-xs text-muted-foreground">מבחנים</p>
          </div>
          <div>
            <p className="text-2xl font-bold">{success}%</p>
            <p className="text-xs text-muted-foreground">אחוז הצלחה</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>התקדמות בקורס</span>
            <span>{completion}%</span>
          </div>
          <Progress value={completion} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
