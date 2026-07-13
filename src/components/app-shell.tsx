"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { useProgress } from "@/hooks/use-progress";
import { getAllChapters } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { progress, loaded } = useProgress();
  const total = getAllChapters().length;
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarProps = {
    completedChapters: loaded ? progress.completedChapters : [],
    onNavigate: () => setMobileOpen(false),
  };

  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 lg:block">
        <AppSidebar {...sidebarProps} />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="gap-0 p-0">
              <AppSidebar {...sidebarProps} />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">תכנות מתקדם C#</span>
          <Link
            href="/exam"
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "mr-auto gap-1.5 text-xs"
            )}
          >
            <GraduationCap className="h-3.5 w-3.5" />
            תרגול מבחן
          </Link>
          {loaded && (
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {progress.completedChapters.length}/{total} פרקים
            </span>
          )}
        </header>

        <main className="flex-1 bg-gradient-to-b from-background via-background to-violet-500/[0.03]">
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
