"use client";

import type { MultipleChoiceQuestion } from "@/types/course";
import { CodeBlock } from "@/components/code-block";
import { QuestionOptionText } from "@/components/question-option-text";
import { Callout } from "@/components/callout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamQuestionCardProps {
  question: MultipleChoiceQuestion;
  selectedId?: string;
  revealed: boolean;
  locked: boolean;
  allowReveal?: boolean;
  onSelect: (optionId: string) => void;
  onReveal: () => void;
}

export function ExamQuestionCard({
  question,
  selectedId,
  revealed,
  locked,
  allowReveal = false,
  onSelect,
  onReveal,
}: ExamQuestionCardProps) {
  const correctOption = question.options.find((o) => o.id === question.correctId);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Badge variant="outline">{question.difficulty}</Badge>
          {!revealed && allowReveal && (
            <Button variant="outline" size="sm" onClick={onReveal} className="shrink-0">
              <Eye className="ml-1 h-4 w-4" />
              הצג תשובה נכונה
            </Button>
          )}
        </div>
        <CardTitle className="text-base leading-relaxed whitespace-pre-line">{question.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {question.termsContext?.map((t) => (
          <Callout key={t.term} type="info" title={t.term}>
            {t.explanation}
          </Callout>
        ))}
        {question.code && <CodeBlock code={question.code} />}
        {question.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const isCorrect = opt.id === question.correctId;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={locked}
              onClick={() => onSelect(opt.id)}
              className={cn(
                "w-full rounded-xl border p-4 text-right text-sm transition-all",
                !locked && "hover:border-violet-500/50",
                locked && "cursor-default opacity-90",
                isSelected && !revealed && "border-violet-500 bg-violet-500/10",
                revealed && isCorrect && "border-emerald-500 bg-emerald-500/15 ring-1 ring-emerald-500/30",
                revealed && isSelected && !isCorrect && "border-red-500 bg-red-500/10"
              )}
            >
              <span className="flex items-center justify-between gap-2">
                <QuestionOptionText text={opt.text} />
                {revealed && isCorrect && (
                  <Badge className="shrink-0 bg-emerald-600">תשובה נכונה</Badge>
                )}
              </span>
            </button>
          );
        })}
        {revealed && (
          <Callout type="tip" title="הסבר">
            <p className="mb-1">
              <strong>תשובה נכונה:</strong>{" "}
              <QuestionOptionText text={correctOption?.text ?? ""} />
            </p>
            <p>{question.explanation}</p>
            {question.detailedExplanation && (
              <p className="mt-2 whitespace-pre-line rounded-lg bg-muted/40 p-2 text-sm text-muted-foreground">
                {question.detailedExplanation}
              </p>
            )}
            {locked && (
              <p className="mt-2 text-xs text-muted-foreground">
                לא ניתן לשנות תשובה לאחר הצגת התשובה הנכונה.
              </p>
            )}
          </Callout>
        )}
      </CardContent>
    </Card>
  );
}
