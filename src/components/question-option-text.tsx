"use client";

import { CodeBlock } from "@/components/code-block";
import { isCodeLikeAnswer, shouldUseCodeBlock } from "@/lib/question-display";

interface QuestionOptionTextProps {
  text: string;
}

export function QuestionOptionText({ text }: QuestionOptionTextProps) {
  if (!isCodeLikeAnswer(text)) {
    return <span>{text}</span>;
  }
  if (shouldUseCodeBlock(text)) {
    return <CodeBlock code={text} compact />;
  }
  return (
    <code className="block rounded-lg bg-zinc-950 px-3 py-2 text-left font-mono text-sm text-sky-300" dir="ltr">
      {text}
    </code>
  );
}
