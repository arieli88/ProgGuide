"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteFooter } from "@/components/site-footer";
import { useProgress } from "@/hooks/use-progress";
import { getAllChapters } from "@/lib/content";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";

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
            <SheetContent
              side="right"
              className="fixed inset-y-0 right-0 z-50 h-full w-72 max-w-[min(85vw,18rem)] border-l p-0"
            >
              <AppSidebar {...sidebarProps} />
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
        <SiteFooter />
      </div>
    </div>
  );
}
