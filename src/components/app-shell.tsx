"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { useProgress } from "@/hooks/use-progress";
import { getAllChapters } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { progress, loaded } = useProgress();
  const total = getAllChapters().length;

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:block">
        <AppSidebar completedChapters={loaded ? progress.completedChapters : []} />
      </div>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:hidden">
          <Sheet>
            <SheetTrigger className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              <AppSidebar completedChapters={loaded ? progress.completedChapters : []} />
            </SheetContent>
          </Sheet>
          <span className="text-sm font-semibold">תכנות מתקדם C#</span>
          {loaded && (
            <span className="mr-auto text-xs text-muted-foreground">
              {progress.completedChapters.length}/{total} פרקים
            </span>
          )}
        </header>
        <main className="flex-1 bg-gradient-to-b from-background via-background to-violet-500/[0.03]">
          {children}
        </main>
      </div>
    </div>
  );
}
