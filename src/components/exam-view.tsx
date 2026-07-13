"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, FileText, Layers } from "lucide-react";
import type { ExamQuestion, ExamResult } from "@/types/course";
import type { ExamBundle } from "@/lib/content";
import { getChapterTitle } from "@/lib/content";
import { CodeBlock } from "@/components/code-block";
import { QuestionOptionText } from "@/components/question-option-text";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamResultsSummary } from "@/components/exam-results-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface ExamViewProps {
  bundles: ExamBundle[];
  onComplete?: (result: ExamResult) => void;
}

export function ExamView({ bundles, onComplete }: ExamViewProps) {
  const [activeBundle, setActiveBundle] = useState<ExamBundle | null>(null);
  const [shuffleKey, setShuffleKey] = useState(0);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  const shuffled = useMemo(() => {
    if (!activeBundle) return [];
    return [...activeBundle.questions].sort(() => Math.random() - 0.5);
  }, [activeBundle, shuffleKey]);

  const current = shuffled[index];
  const answeredCount = Object.keys(answers).length;
  const remainingCount = shuffled.length - answeredCount;

  const startBundle = (bundle: ExamBundle) => {
    setActiveBundle(bundle);
    setShuffleKey((k) => k + 1);
    setIndex(0);
    setAnswers({});
    setFinished(false);
    setResult(null);
  };

  const backToHub = () => {
    setActiveBundle(null);
    setFinished(false);
    setResult(null);
    setIndex(0);
    setAnswers({});
  };

  const submit = () => {
    const details = shuffled.map((q) => {
      const selectedId = answers[q.id] ?? "";
      const correct = selectedId === q.correctId;
      return {
        questionId: q.id,
        correct,
        selectedId,
        correctId: q.correctId,
        chapterId: q.chapterIds?.[0] || q.topicId,
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

  if (!activeBundle) {
    const fileBundles = bundles.filter((b) => b.id !== "all");
    const allBundle = bundles.find((b) => b.id === "all");

    return (
      <div className="mx-auto max-w-3xl px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-3xl font-bold">מבחן מסכם</h1>
          <p className="mb-8 text-muted-foreground">
            בחרו מבחן לפי קובץ מקור מתיקיית «תרגול למבחן», או מבחן מאוחד של כל השאלות.
          </p>

          <div className="mb-8 grid gap-3">
            {fileBundles.map((bundle) => (
              <Card key={bundle.id} className="border-border/70 transition-colors hover:border-violet-500/40">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
                      <FileText className="h-4 w-4 text-violet-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base leading-snug break-words">{bundle.title}</CardTitle>
                      <CardDescription className="mt-1">{bundle.description}</CardDescription>
                    </div>
                    <Badge variant="secondary" className="shrink-0">
                      {bundle.questions.length}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => startBundle(bundle)} className="w-full bg-gradient-to-l from-violet-600 to-indigo-600">
                    התחלת מבחן מהקובץ
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {allBundle && (
            <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/20">
                    <Layers className="h-4 w-4 text-amber-700" />
                  </div>
                  <div>
                    <CardTitle>{allBundle.title}</CardTitle>
                    <CardDescription className="mt-1 text-foreground/70">{allBundle.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  onClick={() => startBundle(allBundle)}
                  className="w-full bg-gradient-to-l from-amber-600 to-orange-600"
                >
                  מבחן מסכם של הכל
                </Button>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    );
  }

  if (finished && result) {
    const wrong = result.details.filter((d) => !d.correct);

    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <p className="mb-2 text-sm text-muted-foreground">{activeBundle.title}</p>
        <ExamResultsSummary title="תוצאות המבחן" result={result} variant="violet" />

        <div className="mt-6 space-y-3">
          <h3 className="font-semibold">שאלות שטעיתם — והתשובה הנכונה</h3>
          {wrong.length === 0 ? (
            <p className="text-muted-foreground">כל הכבוד! לא היו טעויות.</p>
          ) : (
            wrong.map((d) => {
              const q = shuffled.find((x) => x.id === d.questionId)!;
              const correctText = q.options.find((o) => o.id === d.correctId)?.text;
              const selectedText = q.options.find((o) => o.id === d.selectedId)?.text;
              return (
                <Card key={d.questionId} className="border-red-500/20">
                  <CardContent className="pt-4 text-sm">
                    {q.sourceFile && (
                      <p className="mb-1 text-[11px] text-muted-foreground">מקור: {q.sourceFile}</p>
                    )}
                    <p className="mb-2 font-medium whitespace-pre-line">{q.question}</p>
                    {q.code && <CodeBlock code={q.code} compact />}
                    {d.selectedId ? (
                      <p className="mb-1 text-red-600">
                        התשובה שלכם: <QuestionOptionText text={selectedText ?? ""} />
                      </p>
                    ) : (
                      <p className="mb-1 text-red-600">לא נבחרה תשובה</p>
                    )}
                    <p className="mb-1 text-emerald-600">
                      תשובה נכונה: <QuestionOptionText text={correctText ?? ""} />
                    </p>
                    <p className="text-muted-foreground">{q.explanation}</p>
                    {q.detailedExplanation && (
                      <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/40 p-2 text-muted-foreground">
                        {q.detailedExplanation}
                      </p>
                    )}
                    <Link href={`/learn/${d.chapterId}`} className="mt-2 inline-block text-xs text-violet-500 underline">
                      חזרה לחומר: {getChapterTitle(d.chapterId)}
                    </Link>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" className="flex-1" onClick={backToHub}>
            חזרה לבחירת מבחן
          </Button>
          <Button
            className="flex-1"
            onClick={() => startBundle(activeBundle)}
          >
            מבחן חוזר
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button variant="ghost" size="sm" onClick={backToHub}>
          ← בחירת מבחן
        </Button>
        <p className="truncate text-xs text-muted-foreground">{activeBundle.title}</p>
      </div>

      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>
          שאלה {index + 1} / {shuffled.length}
        </span>
        <span className="text-xs">
          נענו {answeredCount} · נשארו {remainingCount}
        </span>
        <Badge variant="outline">{current.difficulty}</Badge>
      </div>
      <Progress value={(answeredCount / shuffled.length) * 100} className="mb-4 h-2" />

      {current.sourceFile && (
        <p className="mb-2 text-[11px] text-muted-foreground">מקור: {current.sourceFile}</p>
      )}

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
          <ArrowRight className="ml-1 h-4 w-4" />
          הקודם
        </Button>
        {index < shuffled.length - 1 ? (
          <Button className="flex-1" onClick={() => setIndex((i) => i + 1)}>
            הבא
            <ArrowLeft className="mr-1 h-4 w-4" />
          </Button>
        ) : (
          <Button className="flex-1" disabled={answeredCount < shuffled.length} onClick={submit}>
            סיום וציון
          </Button>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        אפשר לדפדף בין השאלות בחופשיות. לסיום יש לענות על כל השאלות ({remainingCount} נותרו).
      </p>
    </div>
  );
}
