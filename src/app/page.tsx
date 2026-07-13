import Link from "next/link";
import { ArrowLeft, BookOpen, GraduationCap, Sparkles, Target, Zap } from "lucide-react";
import { LinkButton } from "@/components/link-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getAllChallengeQuestions,
  getAllChapters,
  getCourseIndex,
  getFinalExamQuestions,
} from "@/lib/content";
import { HomeProgress } from "@/components/home-progress";

export default function HomePage() {
  const course = getCourseIndex();
  const chapters = getAllChapters();
  const examCount = getFinalExamQuestions().length;
  const challengeCount = getAllChallengeQuestions().length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-bl from-violet-600/20 via-indigo-600/10 to-transparent p-8 md:p-12">
        <div className="relative z-10">
          <Badge className="mb-4 bg-violet-600/80">קורס תכנות מתקדם</Badge>
          <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">{course.title}</h1>
          <p className="mb-8 max-w-2xl text-lg text-muted-foreground">{course.description}</p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href={`/learn/${chapters[0]?.id}`} size="lg" className="bg-gradient-to-l from-violet-600 to-indigo-600">
              <BookOpen className="ml-2 h-4 w-4" />
              התחלת לימוד
            </LinkButton>
            <LinkButton href="/exam" variant="outline" size="lg">
              <GraduationCap className="ml-2 h-4 w-4" />
              מבחן מסכם
            </LinkButton>
          </div>
        </div>
        <Sparkles className="absolute left-8 top-8 h-24 w-24 text-violet-500/20" />
      </section>

      <HomeProgress totalChapters={chapters.length} />

      <section className="mb-12">
        <Card className="overflow-hidden border-amber-500/30 bg-gradient-to-bl from-amber-500/15 via-orange-500/10 to-transparent">
          <CardContent className="flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge className="mb-3 bg-amber-600/90">אתגר הסופי</Badge>
              <h2 className="mb-2 text-2xl font-bold">כל השאלות — מקום אחד</h2>
              <p className="max-w-xl text-muted-foreground">
                {challengeCount} שאלות אמריקאיות מכל פרקי הקורס — מעורבבות, עם הסברים וניווט קדימה/אחורה.
              </p>
            </div>
            <LinkButton href="/final-challenge" size="lg" className="shrink-0 bg-gradient-to-l from-amber-600 to-orange-600">
              התחלת אתגר הסופי
            </LinkButton>
          </CardContent>
        </Card>
      </section>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">מסלול הלימוד</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {course.modules.map((mod, i) => (
            <Card key={mod.id} className="group transition-all hover:border-violet-500/30 hover:shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
                    {i + 1}
                  </div>
                  <CardTitle>{mod.title}</CardTitle>
                </div>
                <CardDescription>{mod.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {mod.chapterIds.map((id) => {
                    const ch = chapters.find((c) => c.id === id);
                    if (!ch) return null;
                    return (
                      <li key={id}>
                        <Link
                          href={`/learn/${id}`}
                          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent group-hover:text-foreground"
                        >
                          <span>{ch.title}</span>
                          <ArrowLeft className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: Target, title: "מבוסס על הקורס", desc: "תוכן מנוסח מחדש לפי המצגות, התרגולים והמבחנים" },
          { icon: Zap, title: "תרגול אינטראקטיבי", desc: "שאלות אמריקאיות, פתוחות ותרגילי קוד לכל פרק" },
          { icon: GraduationCap, title: "מבחן מסכם", desc: `מבחן לכל קובץ תרגול + מבחן מאוחד של ${examCount} שאלות, עם פירוט טעויות` },
        ].map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="border-border/60 bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <Icon className="mb-3 h-8 w-8 text-violet-500" />
              <h3 className="mb-1 font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  );
}
