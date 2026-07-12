"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MultipleChoiceQuestion } from "@/types/course";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AnswerState {
  selected: string | null;
  revealed: boolean;
}

interface McQuizPanelProps {
  questions: MultipleChoiceQuestion[];
  title?: string;
  onAnswer?: (questionId: string, selectedId: string, correct: boolean) => void;
  showScore?: boolean;
}

export function McQuizPanel({ questions, title, onAnswer, showScore = true }: McQuizPanelProps) {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState<Record<string, AnswerState>>({});

  const current = questions[index];
  const state = states[current?.id] ?? { selected: null, revealed: false };
  const progress = ((index + 1) / questions.length) * 100;

  const score = questions.filter((q) => {
    const s = states[q.id];
    return s?.revealed && s.selected === q.correctId;
  }).length;

  const loadQuestion = useCallback((i: number) => {
    setIndex(i);
  }, []);

  const select = (optId: string) => {
    if (state.revealed) return;
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...state, selected: optId },
    }));
  };

  const check = () => {
    if (!state.selected || state.revealed) return;
    const correct = state.selected === current.correctId;
    setStates((prev) => ({
      ...prev,
      [current.id]: { ...state, revealed: true },
    }));
    onAnswer?.(current.id, state.selected, correct);
  };

  const goPrev = () => {
    if (index > 0) loadQuestion(index - 1);
  };

  const goNext = () => {
    if (index < questions.length - 1) loadQuestion(index + 1);
  };

  useEffect(() => {
    const s = states[current?.id];
    if (s?.revealed && index < questions.length - 1) {
      // keep navigation manual
    }
  }, [current?.id, index, questions.length, states]);

  if (!current) return null;

  return (
    <div>
      {title && <h2 className="mb-4 text-xl font-bold">{title}</h2>}
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <span>שאלה {index + 1} מתוך {questions.length}</span>
        {showScore && <span>ניקוד: {score}</span>}
      </div>
      <Progress value={progress} className="mb-6 h-2" />

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{current.difficulty}</Badge>
              </div>
              <CardTitle className="text-base leading-relaxed whitespace-pre-line">{current.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {current.termsContext && current.termsContext.length > 0 && (
                <div className="space-y-2">
                  {current.termsContext.map((t) => (
                    <Callout key={t.term} type="info" title={t.term}>
                      {t.explanation}
                    </Callout>
                  ))}
                </div>
              )}

              {current.code && <CodeBlock code={current.code} />}

              <div className="space-y-2">
                {current.options.map((opt) => {
                  const isSelected = state.selected === opt.id;
                  const isCorrect = opt.id === current.correctId;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      disabled={state.revealed}
                      onClick={() => select(opt.id)}
                      className={cn(
                        "w-full rounded-xl border p-4 text-right text-sm transition-all",
                        isSelected && !state.revealed && "border-violet-500 bg-violet-500/10",
                        state.revealed && isCorrect && "border-emerald-500 bg-emerald-500/10",
                        state.revealed && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
                      )}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {state.revealed && (
                <Callout
                  type={state.selected === current.correctId ? "tip" : "warning"}
                  title={state.selected === current.correctId ? "תשובה נכונה" : "הסבר"}
                >
                  <p className="mb-2 font-medium">{current.explanation}</p>
                  {current.detailedExplanation && (
                    <div className="mt-3 rounded-lg border border-border/50 bg-muted/30 p-3 text-sm leading-relaxed whitespace-pre-line">
                      {current.detailedExplanation}
                    </div>
                  )}
                  {state.selected !== current.correctId && state.selected && current.wrongExplanations[state.selected] && (
                    <p className="mt-2 text-sm opacity-80">
                      למה הבחירה שלך שגויה: {current.wrongExplanations[state.selected]}
                    </p>
                  )}
                </Callout>
              )}

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={goPrev} disabled={index === 0}>
                  <ArrowRight className="ml-1 h-4 w-4" />
                  הקודם
                </Button>
                {!state.revealed ? (
                  <Button onClick={check} disabled={!state.selected} className="flex-1">
                    בדיקת תשובה
                  </Button>
                ) : (
                  <Button onClick={goNext} disabled={index >= questions.length - 1} className="flex-1">
                    הבא
                    <ArrowLeft className="mr-1 h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" onClick={goNext} disabled={index >= questions.length - 1}>
                  הבא
                  <ArrowLeft className="mr-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
