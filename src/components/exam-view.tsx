"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { ExamQuestion, ExamResult } from "@/types/course";
import { getChapterTitle } from "@/lib/content";
import { CodeBlock } from "@/components/code-block";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamResultsSummary } from "@/components/exam-results-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ExamViewProps {
  questions: ExamQuestion[];
  onComplete?: (result: ExamResult) => void;
}

export function ExamView({ questions, onComplete }: ExamViewProps) {
  const shuffled = useMemo(() => [...questions].sort(() => Math.random() - 0.5).slice(0, 50), [questions]);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  const current = shuffled[index];

  const submit = () => {
    const details = shuffled.map((q) => {
      const selectedId = answers[q.id] ?? "";
      const correct = selectedId === q.correctId;
      return {
        questionId: q.id,
        correct,
        selectedId,
        correctId: q.correctId,
        chapterId: q.chapterIds[0],
      };
    });
    const score = details.filter((d) => d.correct).length;
    const weakMap = new Map<string, number>();
    details.filter((d) => !d.correct).forEach((d) => {
      weakMap.set(d.chapterId, (weakMap.get(d.chapterId) ?? 0) + 1);
    });
    const weakTopics = [...weakMap.entries()].map(([chapterId, wrongCount]) => ({
      chapterId,
      title: getChapterTitle(chapterId),
      wrongCount,
    }));
    const res: ExamResult = {
      score,
      total: shuffled.length,
      percentage: Math.round((score / shuffled.length) * 100),
      weakTopics,
      details,
    };
    setResult(res);
    setFinished(true);
    onComplete?.(res);
  };

  const handleSelect = (optionId: string) => {
    setAnswers((a) => ({ ...a, [current.id]: optionId }));
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <h1 className="mb-4 text-3xl font-bold">מבחן מסכם</h1>
          <p className="mb-8 text-muted-foreground">
            {shuffled.length} שאלות מעורבבות מכל נושאי הקורס · קלות, בינוניות וקשות
          </p>
          <Button size="lg" onClick={() => setStarted(true)} className="bg-gradient-to-l from-violet-600 to-indigo-600">
            התחלת מבחן
          </Button>
        </motion.div>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ExamResultsSummary title="תוצאות המבחן" result={result} variant="violet" />

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">פירוט טעויות</h3>
          {result.details.filter((d) => !d.correct).length === 0 ? (
            <p className="text-muted-foreground">כל הכבוד! לא היו טעויות.</p>
          ) : (
            result.details.filter((d) => !d.correct).map((d) => {
              const q = shuffled.find((x) => x.id === d.questionId)!;
              const correctText = q.options.find((o) => o.id === d.correctId)?.text;
              return (
                <Card key={d.questionId} className="border-red-500/20">
                  <CardContent className="pt-4 text-sm">
                    <p className="mb-2 font-medium whitespace-pre-line">{q.question}</p>
                    {q.code && <CodeBlock code={q.code} compact />}
                    <p className="mb-1 text-emerald-600">תשובה נכונה: {correctText}</p>
                    <p className="text-muted-foreground">{q.explanation}</p>
                    {q.detailedExplanation && (
                      <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/40 p-2 text-muted-foreground">
                        {q.detailedExplanation}
                      </p>
                    )}
                    <Link href={`/learn/${d.chapterId}`} className="mt-2 inline-block text-violet-500 text-xs underline">
                      חזרה לחומר: {getChapterTitle(d.chapterId)}
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <Button
          className="mt-6 w-full"
          onClick={() => {
            setStarted(false);
            setFinished(false);
            setIndex(0);
            setAnswers({});
          }}
        >
          מבחן חוזר
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-4 flex justify-between text-sm text-muted-foreground">
        <span>שאלה {index + 1} / {shuffled.length}</span>
        <Badge variant="outline">{current.difficulty}</Badge>
      </div>
      <Progress value={((index + 1) / shuffled.length) * 100} className="mb-6 h-2" />

      <ExamQuestionCard
        question={current}
        selectedId={answers[current.id]}
        revealed={false}
        locked={false}
        onSelect={handleSelect}
        onReveal={() => {}}
      />

      <div className="mt-6 flex gap-2">
        <Button variant="outline" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
          הקודם
        </Button>
        {index < shuffled.length - 1 ? (
          <Button className="flex-1" disabled={!answers[current.id]} onClick={() => setIndex((i) => i + 1)}>
            הבא
          </Button>
        ) : (
          <Button className="flex-1" disabled={Object.keys(answers).length < shuffled.length} onClick={submit}>
            סיום וציון
          </Button>
        )}
      </div>
    </div>
  );
}
