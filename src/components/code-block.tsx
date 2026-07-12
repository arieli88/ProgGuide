"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CodeBlockProps {
  code: string;
  title?: string;
  lineByLine?: { line: number; text: string }[];
  compact?: boolean;
}

export function CodeBlock({ code, title, lineByLine, compact }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const lines = code.split("\n");

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border/60 bg-zinc-950 shadow-lg" dir="ltr">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="text-left text-xs font-medium text-zinc-400">{title ?? "C#"}</span>
        <Button variant="ghost" size="icon-xs" onClick={copy} className="text-zinc-400 hover:text-white">
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        </Button>
      </div>
      <div className="overflow-x-auto p-4 text-left">
        <pre className={`font-mono text-sm leading-relaxed text-sky-300 ${compact ? "" : ""}`}>
          <code className="block whitespace-pre text-left">
            {lines.map((line, i) => (
              <div key={i} className="flex flex-row text-left">
                <span className="inline-block w-8 shrink-0 select-none text-right text-zinc-600">{i + 1}</span>
                <span className="flex-1 whitespace-pre text-left">{line || " "}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
      {lineByLine && lineByLine.length > 0 && (
        <div className="border-t border-white/10 bg-zinc-900/80 p-4 text-sm" dir="rtl">
          <p className="mb-2 font-medium text-zinc-300">הסבר שורה-שורה:</p>
          <ul className="space-y-1 text-zinc-400">
            {lineByLine.map((l, i) => (
              <li key={`${l.line}-${i}`}>
                <span className="font-mono text-violet-400">שורה {l.line}:</span> {l.text}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
