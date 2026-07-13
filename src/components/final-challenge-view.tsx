"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Trophy } from "lucide-react";
import type { ExamResult, MultipleChoiceQuestion } from "@/types/course";
import { getChapterTitle } from "@/lib/content";
import { CodeBlock } from "@/components/code-block";
import { QuestionOptionText } from "@/components/question-option-text";
import { ExamQuestionCard } from "@/components/exam-question-card";
import { ExamResultsSummary } from "@/components/exam-results-summary";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FinalChallengeViewProps {
  questions: MultipleChoiceQuestion[];
  onComplete?: (result: ExamResult) => void;
}

export function FinalChallengeView({ questions, onComplete }: FinalChallengeViewProps) {
  const shuffled = useMemo(
    () => [...questions].sort(() => Math.random() - 0.5),
    [questions]
  );
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);

  const current = shuffled[index];
  const isRevealed = revealed[current?.id] ?? false;
  const isLocked = isRevealed;

  const submit = () => {
    const details = shuffled.map((q) => {
      const selectedId = answers[q.id] ?? "";
      const correct = selectedId === q.correctId;
      return {
        questionId: q.id,
        correct,
        selectedId,
        correctId: q.correctId,
        chapterId: q.topicId,
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

  const handleReveal = () => {
    setRevealed((prev) => ({ ...prev, [current.id]: true }));
  };

  const handleSelect = (optionId: string) => {
    if (isLocked) return;
    setAnswers((a) => ({ ...a, [current.id]: optionId }));
  };

  if (!started) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Trophy className="mx-auto mb-4 h-16 w-16 text-amber-500" />
          <h1 className="mb-4 text-3xl font-bold">אתגר הסופי</h1>
          <p className="mb-8 text-muted-foreground">
            {shuffled.length} שאלות אמריקאיות מכל פרקי הקורס — ללא כפילויות, עם הסברים וניווט
          </p>
          <Button size="lg" onClick={() => setStarted(true)} className="bg-gradient-to-l from-amber-600 to-orange-600">
            התחלת אתגר
          </Button>
        </motion.div>
      </div>
    );
  }

  if (finished && result) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <ExamResultsSummary title="תוצאות אתגר הסופי" result={result} variant="amber" />

        <div className="mt-6 space-y-4">
          <h3 className="font-semibold">פירוט עם הסברים</h3>
          {result.details.map((d) => {
            const q = shuffled.find((x) => x.id === d.questionId)!;
            const selectedText = q.options.find((o) => o.id === d.selectedId)?.text;
            const correctText = q.options.find((o) => o.id === d.correctId)?.text;
            return (
              <Card key={d.questionId} className={d.correct ? "border-emerald-500/20" : "border-red-500/20"}>
                <CardContent className="pt-4 text-sm">
                  <p className="mb-2 font-medium whitespace-pre-line">{q.question}</p>
                  {q.code && <CodeBlock code={q.code} compact />}
                  <p className={cn("mb-1", d.correct ? "text-emerald-600" : "text-red-600")}>
                    {d.correct ? "✓ נכון" : "✗ שגוי"}
                  </p>
                  {!d.correct && d.selectedId && (
                    <p className="mb-1 text-muted-foreground">
                      בחרת: <QuestionOptionText text={selectedText ?? ""} />
                    </p>
                  )}
                  <p className="mb-1 text-emerald-600">
                    תשובה נכונה: <QuestionOptionText text={correctText ?? ""} />
                  </p>
                  <p>{q.explanation}</p>
                  {q.detailedExplanation && (
                    <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/40 p-2 text-muted-foreground">
                      {q.detailedExplanation}
                    </p>
                  )}
                  <Link href={`/learn/${d.chapterId}`} className="mt-2 inline-block text-violet-500 text-xs underline">
                    חזרה לפרק: {getChapterTitle(d.chapterId)}
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Button
          className="mt-6 w-full"
          onClick={() => {
            setStarted(false);
            setFinished(false);
            setIndex(0);
            setAnswers({});
            setRevealed({});
          }}
        >
          ניסיון חוזר
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
        revealed={isRevealed}
        locked={isLocked}
        allowReveal
        onSelect={handleSelect}
        onReveal={handleReveal}
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
          <Button
            className="flex-1 bg-gradient-to-l from-amber-600 to-orange-600"
            disabled={Object.keys(answers).length < shuffled.length}
            onClick={submit}
          >
            סיום האתגר
          </Button>
        )}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        ענית על {Object.keys(answers).length} מתוך {shuffled.length} שאלות
      </p>
    </div>
  );
}
