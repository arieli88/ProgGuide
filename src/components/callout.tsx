import type { CalloutType } from "@/types/course";
import { AlertTriangle, BookOpen, Info, Lightbulb, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const styles: Record<CalloutType, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "border-sky-500/30 bg-sky-500/10 text-sky-900 dark:text-sky-100" },
  warning: { icon: AlertTriangle, className: "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100" },
  tip: { icon: Lightbulb, className: "border-violet-500/30 bg-violet-500/10 text-violet-900 dark:text-violet-100" },
  note: { icon: BookOpen, className: "border-border bg-muted/50" },
  exam: { icon: GraduationCap, className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100" },
};

interface CalloutProps {
  type?: CalloutType;
  title: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const { icon: Icon, className } = styles[type];
  return (
    <div className={cn("my-4 rounded-xl border p-4 backdrop-blur-sm", className)}>
      <div className="mb-2 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="text-sm leading-relaxed opacity-90">{children}</div>
    </div>
  );
}
