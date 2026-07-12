"use client";

import type { LessonCard, LessonDiagram, LessonInlineCode, LessonStep, LessonTable } from "@/types/course";
import { CodeBlock } from "@/components/code-block";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowLeft } from "lucide-react";

export function LessonSteps({ steps }: { steps: LessonStep[] }) {
  return (
    <ol className="my-6 space-y-0">
      {steps.map((step, i) => (
        <li key={step.number} className="relative flex gap-4 pb-8 last:pb-0">
          {i < steps.length - 1 && (
            <span className="absolute right-[1.15rem] top-10 h-[calc(100%-2rem)] w-px bg-violet-500/30" />
          )}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
            {step.number}
          </span>
          <div className="flex-1 rounded-xl border border-border/60 bg-card/50 p-4">
            <h4 className="mb-1 font-semibold text-foreground">{step.title}</h4>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function LessonCards({ cards }: { cards: LessonCard[] }) {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-4"
        >
          <h4 className="mb-1 font-semibold">{card.title}</h4>
          {card.subtitle && <p className="mb-2 text-xs text-muted-foreground">{card.subtitle}</p>}
          {card.highlight && (
            <p className="mb-2 rounded-lg bg-violet-500/10 px-2 py-1 text-sm font-medium text-violet-600 dark:text-violet-300">
              {card.highlight}
            </p>
          )}
          <ul className="space-y-1 text-sm text-muted-foreground">
            {card.items.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-violet-500">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function LessonTableView({ table }: { table: LessonTable }) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {table.headers.map((h) => (
              <th key={h} className="px-4 py-3 text-right font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr key={i} className="border-b border-border/40 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-muted-foreground">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function LessonInlineCodeBlock({ block }: { block: LessonInlineCode }) {
  return (
    <div className="my-6">
      <CodeBlock code={block.code} title={block.title} />
      {block.annotations && block.annotations.length > 0 && (
        <div className="mt-3 space-y-2 rounded-xl border border-border/60 bg-muted/30 p-4" dir="rtl">
          <p className="text-sm font-medium">פירוט שורות:</p>
          {block.annotations.map((a, i) => (
            <div key={`${a.line}-${i}`} className="flex gap-2 text-sm">
              <span className="shrink-0 font-mono text-violet-500">שורה {a.line}</span>
              <span className="text-muted-foreground">{a.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PipelineDiagram({ diagram }: { diagram: LessonDiagram }) {
  return (
    <div className="my-6 overflow-x-auto">
      {diagram.title && <p className="mb-3 text-sm font-medium text-muted-foreground">{diagram.title}</p>}
      <div className="flex min-w-max items-stretch gap-2">
        {diagram.nodes.map((node, i) => (
          <div key={node.id} className="flex items-center gap-2">
            <div className="flex w-44 flex-col rounded-xl border border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-transparent p-4 text-center">
              <span className="mb-1 text-xs font-medium text-violet-500">שלב {i + 1}</span>
              <span className="font-semibold">{node.label}</span>
              {node.description && (
                <span className="mt-2 text-xs leading-relaxed text-muted-foreground">{node.description}</span>
              )}
            </div>
            {i < diagram.nodes.length - 1 && (
              <ArrowLeft className="h-5 w-5 shrink-0 text-violet-400" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowDiagram({ diagram }: { diagram: LessonDiagram }) {
  return (
    <div className="my-6 space-y-3">
      {diagram.title && <p className="text-sm font-medium text-muted-foreground">{diagram.title}</p>}
      {diagram.nodes.map((node, i) => (
        <div key={node.id} className="flex flex-col items-center">
          <div className="w-full max-w-lg rounded-xl border border-border/60 bg-card/60 p-4 text-center">
            <p className="font-semibold">{node.label}</p>
            {node.description && <p className="mt-1 text-sm text-muted-foreground">{node.description}</p>}
          </div>
          {i < diagram.nodes.length - 1 && <ArrowDown className="my-1 h-5 w-5 text-violet-400" />}
        </div>
      ))}
    </div>
  );
}

function HierarchyDiagram({ diagram }: { diagram: LessonDiagram }) {
  const cols = diagram.columns ?? [diagram.nodes];
  return (
    <div className="my-6">
      {diagram.title && <p className="mb-4 text-sm font-medium text-muted-foreground">{diagram.title}</p>}
      <div className="flex flex-wrap justify-center gap-6">
        {cols.map((col, ci) => (
          <div key={ci} className="flex flex-col items-center gap-3">
            {col.map((node) => (
              <div
                key={node.id}
                className={cn(
                  "rounded-xl border p-4 text-center",
                  ci === 0 ? "border-violet-500/40 bg-violet-500/10 min-w-48" : "border-indigo-500/30 bg-indigo-500/5 min-w-40"
                )}
              >
                <p className="font-semibold">{node.label}</p>
                {node.description && (
                  <p className="mt-2 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">{node.description}</p>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlueprintDiagram({ diagram }: { diagram: LessonDiagram }) {
  const classNode = diagram.nodes.find((n) => n.id === "class");
  const instances = diagram.nodes.filter((n) => n.id !== "class");
  return (
    <div className="my-6 rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5 p-6">
      {diagram.title && <p className="mb-4 text-center text-sm font-medium">{diagram.title}</p>}
      <div className="flex flex-col items-center gap-6 lg:flex-row lg:justify-center">
        {classNode && (
          <div className="w-full max-w-xs rounded-xl border-2 border-dashed border-violet-500/50 bg-card p-5 text-center">
            <span className="mb-2 inline-block rounded-full bg-violet-600/20 px-3 py-0.5 text-xs font-medium text-violet-600">מחלקה (Blueprint)</span>
            <p className="text-lg font-bold">{classNode.label}</p>
            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{classNode.description}</p>
          </div>
        )}
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-muted-foreground">new → מופעים</span>
          <ArrowLeft className="h-6 w-6 text-violet-400 lg:rotate-90" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {instances.map((inst) => (
            <div key={inst.id} className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
              <span className="mb-1 inline-block text-xs font-medium text-emerald-600">אובייקט</span>
              <p className="font-semibold">{inst.label}</p>
              <p className="mt-2 whitespace-pre-line text-xs text-muted-foreground">{inst.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CallStackDiagram({ diagram }: { diagram: LessonDiagram }) {
  return (
    <div className="my-6 flex justify-center">
      <div className="w-full max-w-sm">
        {diagram.title && <p className="mb-3 text-center text-sm font-medium text-muted-foreground">{diagram.title}</p>}
        <div className="space-y-1">
          {diagram.nodes.map((node, i) => (
            <div
              key={node.id}
              className={cn(
                "rounded-lg border px-4 py-3 text-center transition-all",
                i === 0 ? "border-violet-500 bg-violet-500/20 font-semibold" : "border-border/60 bg-muted/30 text-sm"
              )}
            >
              {node.label}
              {node.description && <p className="mt-1 text-xs font-normal text-muted-foreground">{node.description}</p>}
            </div>
          ))}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">↑ הקריאה הנוכחית בראש המחסנית</p>
      </div>
    </div>
  );
}

export function LessonDiagramView({ diagram }: { diagram: LessonDiagram }) {
  switch (diagram.kind) {
    case "pipeline":
      return <PipelineDiagram diagram={diagram} />;
    case "flow":
      return <FlowDiagram diagram={diagram} />;
    case "hierarchy":
      return <HierarchyDiagram diagram={diagram} />;
    case "blueprint":
      return <BlueprintDiagram diagram={diagram} />;
    case "callstack":
      return <CallStackDiagram diagram={diagram} />;
    default:
      return <FlowDiagram diagram={diagram} />;
  }
}
