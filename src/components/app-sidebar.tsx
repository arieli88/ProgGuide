"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Brain, ClipboardCheck, GraduationCap, Home, Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCourseIndex } from "@/lib/content";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState } from "react";

interface AppSidebarProps {
  completedChapters?: string[];
  onNavigate?: () => void;
}

export function AppSidebar({ completedChapters = [], onNavigate }: AppSidebarProps) {
  const pathname = usePathname();
  const course = getCourseIndex();
  const [search, setSearch] = useState("");

  const nav = [
    { href: "/", label: "דף הבית", icon: Home },
    { href: "/final-challenge", label: "אתגר הסופי", icon: Trophy },
    { href: "/exam", label: "מבחן מסכם", icon: GraduationCap },
    { href: "/progress", label: "התקדמות", icon: ClipboardCheck },
  ];

  const filteredModules = course.modules.map((m) => ({
    ...m,
    chapters: m.chapterIds
      .map((id) => course.chapters.find((c) => c.id === id)!)
      .filter((c) => !search || c.title.includes(search)),
  })).filter((m) => m.chapters.length > 0);

  return (
    <aside className="flex h-full w-72 max-w-[85vw] flex-col overflow-hidden border-l border-border/60 bg-card/40 backdrop-blur-xl">
      <div className="shrink-0 border-b border-border/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">תכנות מתקדם</p>
              <p className="text-[10px] text-muted-foreground">C# OOP</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="חיפוש נושא..."
            className="pr-9 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-3">
        <nav className="mb-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                pathname === href && "bg-accent font-medium"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {filteredModules.map((module) => (
          <div key={module.id} className="mb-4">
            <p className="mb-1 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {module.title}
            </p>
            <div className="space-y-0.5">
              {module.chapters.map((ch) => {
                const learnHref = `/learn/${ch.id}`;
                const done = completedChapters.includes(ch.id);
                return (
                  <Link
                    key={ch.id}
                    href={learnHref}
                    onClick={onNavigate}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent/80",
                      pathname.startsWith(learnHref) && "bg-gradient-to-l from-violet-500/15 to-transparent font-medium"
                    )}
                  >
                    <BookOpen className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="flex-1 truncate">{ch.title}</span>
                    {done && (
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        ✓
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
