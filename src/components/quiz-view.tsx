"use client";

import type { ChapterPractice } from "@/types/course";
import { McQuizPanel } from "@/components/mc-quiz-panel";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface QuizViewProps {
  practice: ChapterPractice;
  chapterTitle: string;
  onAnswer?: (questionId: string, selectedId: string, correct: boolean) => void;
}

export function QuizView({ practice, chapterTitle, onAnswer }: QuizViewProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <h1 className="mb-2 text-2xl font-bold">תרגול: {chapterTitle}</h1>
      <p className="mb-6 text-muted-foreground">
        {practice.multipleChoice.length} שאלות אמריקאיות · {practice.openQuestions.length} שאלות פתוחות ·{" "}
        {practice.codeExercises.length} תרגילי קוד
      </p>

      <Tabs defaultValue="mc">
        <TabsList className="mb-6">
          <TabsTrigger value="mc">שאלות אמריקאיות</TabsTrigger>
          <TabsTrigger value="open">שאלות פתוחות</TabsTrigger>
          <TabsTrigger value="code">תרגילי קוד</TabsTrigger>
        </TabsList>

        <TabsContent value="mc">
          <McQuizPanel
            questions={practice.multipleChoice}
            onAnswer={onAnswer}
          />
        </TabsContent>

        <TabsContent value="open" className="space-y-4">
          {practice.openQuestions.map((q, i) => (
            <Card key={q.id}>
              <CardHeader>
                <CardTitle className="text-base">{i + 1}. {q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                {q.hint && <p className="mb-2 text-sm text-muted-foreground">רמז: {q.hint}</p>}
                <Callout type="tip" title="תשובה לדוגמה">
                  {q.sampleAnswer}
                </Callout>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="code" className="space-y-4">
          {practice.codeExercises.map((ex) => (
            <Card key={ex.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge>{ex.type}</Badge>
                  <CardTitle className="text-base">{ex.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p>{ex.prompt}</p>
                {ex.starterCode && <CodeBlock code={ex.starterCode} title="Starter code" />}
                <Callout type="tip" title="פתרון">
                  <CodeBlock code={ex.solution} title="Solution" />
                  <p className="mt-2">{ex.explanation}</p>
                </Callout>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
