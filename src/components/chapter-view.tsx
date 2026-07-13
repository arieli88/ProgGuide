"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CheckCircle2, Dumbbell } from "lucide-react";
import type { Chapter } from "@/types/course";
import {
  LessonCards,
  LessonDiagramView,
  LessonInlineCodeBlock,
  LessonSteps,
  LessonTableView,
} from "@/components/lesson-visuals";
import { Callout } from "@/components/callout";
import { CodeBlock } from "@/components/code-block";
import { LinkButton } from "@/components/link-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface ChapterViewProps {
  chapter: Chapter;
  prev?: Chapter;
  next?: Chapter;
  onComplete?: () => void;
  isCompleted?: boolean;
}

export function ChapterView({ chapter, prev, next, onComplete, isCompleted }: ChapterViewProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl px-6 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">דף הבית</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{chapter.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Badge variant="outline" className="mb-3">
            פרק {chapter.order} · ~{chapter.estimatedMinutes} דקות
          </Badge>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">{chapter.title}</h1>
          <p className="text-lg text-muted-foreground">{chapter.subtitle}</p>
        </div>
        <LinkButton
          href={`/practice/${chapter.id}`}
          className="shrink-0 bg-gradient-to-l from-violet-600 to-indigo-600"
        >
          <Dumbbell className="ml-1 h-4 w-4" />
          תרגול מבחן
        </LinkButton>
      </div>

      <Tabs defaultValue="lesson" className="mb-8">
        <TabsList className={`mb-6 grid w-full ${chapter.projectAnalysis?.length ? "grid-cols-4" : "grid-cols-3"}`}>
          <TabsTrigger value="lesson">שיעור</TabsTrigger>
          <TabsTrigger value="code">דוגמאות קוד</TabsTrigger>
          {chapter.projectAnalysis && chapter.projectAnalysis.length > 0 && (
            <TabsTrigger value="projects">ניתוח פרויקטים</TabsTrigger>
          )}
          <TabsTrigger value="exam-tips">למבחן</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson" className="space-y-6">
          <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
            <CardHeader>
              <CardTitle>הקדמה</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-relaxed">
              <p><strong>מה נלמד:</strong> {chapter.introduction.what}</p>
              <p><strong>למה זה חשוב:</strong> {chapter.introduction.why}</p>
              <p><strong>מתי משתמשים:</strong> {chapter.introduction.when}</p>
            </CardContent>
          </Card>

          {chapter.sections.map((section, i) => (
            <motion.section
              key={section.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              <div className="space-y-4 leading-relaxed text-muted-foreground">
                {section.content.split("\n\n").map((para, pi) => (
                  <p key={pi} className="whitespace-pre-line">{para}</p>
                ))}
              </div>
              {section.steps && section.steps.length > 0 && <LessonSteps steps={section.steps} />}
              {section.cards && section.cards.length > 0 && <LessonCards cards={section.cards} />}
              {section.diagram && <LessonDiagramView diagram={section.diagram} />}
              {section.inlineCode && <LessonInlineCodeBlock block={section.inlineCode} />}
              {section.table && <LessonTableView table={section.table} />}
              {section.callouts?.map((c, j) => (
                <Callout key={j} type={c.type} title={c.title}>
                  {c.content}
                </Callout>
              ))}
            </motion.section>
          ))}

          {chapter.comparisons.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">השוואות</h2>
              {chapter.comparisons.map((cmp) => (
                <Card key={cmp.title} className="mb-4">
                  <CardHeader>
                    <CardTitle className="text-base">{cmp.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="py-2 text-right">היבט</th>
                            <th className="py-2 text-right">{cmp.left}</th>
                            <th className="py-2 text-right">{cmp.right}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cmp.rows.map((row) => (
                            <tr key={row.aspect} className="border-b border-border/50">
                              <td className="py-2 font-medium">{row.aspect}</td>
                              <td className="py-2 text-muted-foreground">{row.left}</td>
                              <td className="py-2 text-muted-foreground">{row.right}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div>
            <h2 className="mb-4 text-xl font-semibold">טעויות נפוצות</h2>
            <div className="space-y-4">
              {chapter.commonMistakes.map((m) => (
                <Callout key={m.title} type="warning" title={m.title}>
                  <p className="mb-1">{m.description}</p>
                  <p><strong>למה:</strong> {m.why}</p>
                  <p><strong>איך להימנע:</strong> {m.howToAvoid}</p>
                </Callout>
              ))}
            </div>
          </div>

          <Callout type="note" title="מקורות">
            תוכן מבוסס על: {chapter.sources.join(" · ")}
          </Callout>

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm leading-relaxed"><strong>סיכום:</strong> {chapter.summary}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          {chapter.codeExamples.length === 0 ? (
            <p className="text-muted-foreground">דוגמאות קוד נוספות בתרגול ובפרויקטים בחומר הקורס.</p>
          ) : (
            chapter.codeExamples.map((ex) => (
              <div key={ex.id}>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-semibold">{ex.title}</h3>
                  <Badge variant="secondary">{ex.level}</Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">{ex.explanation}</p>
                <CodeBlock code={ex.code} lineByLine={ex.lineByLine} />
              </div>
            ))
          )}
        </TabsContent>

        {chapter.projectAnalysis && chapter.projectAnalysis.length > 0 && (
          <TabsContent value="projects" className="space-y-6">
            {chapter.projectAnalysis.map((project) => (
              <Card key={project.id} className="border-indigo-500/20">
                <CardHeader>
                  <CardTitle>{project.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">מקור: {project.sourcePath}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="leading-relaxed">{project.overview}</p>
                  {project.classes.map((cls) => (
                    <div key={cls.className} className="rounded-xl border border-border/60 p-4">
                      <h3 className="mb-1 font-semibold">{cls.className}</h3>
                      <p className="mb-2 text-sm text-muted-foreground">{cls.role}</p>
                      {(cls.inherits || cls.implements) && (
                        <p className="mb-3 text-xs">
                          {cls.inherits && <span>יורש: {cls.inherits} · </span>}
                          {cls.implements && <span>מממש: {cls.implements.join(", ")}</span>}
                        </p>
                      )}
                      <div className="space-y-2">
                        {cls.members.map((m) => (
                          <div key={m.name} className="rounded-lg bg-muted/40 px-3 py-2 text-sm">
                            <span className="font-mono text-violet-500">{m.name}</span>
                            <Badge variant="outline" className="mr-2 text-[10px]">{m.kind}</Badge>
                            <p className="mt-1 text-muted-foreground">{m.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <Callout type="info" title="זרימת הרצה">
                    {project.executionFlow}
                  </Callout>
                  <Callout type="exam" title="קשר למבחן">
                    <ul className="list-disc space-y-1 pr-5">
                      {project.examConnections.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </Callout>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        )}

        <TabsContent value="exam-tips">
          <Callout type="exam" title="דברים שחייבים לזכור למבחן">
            <ul className="list-disc space-y-2 pr-5">
              {chapter.examTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </Callout>
        </TabsContent>
      </Tabs>

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-6">
        <div className="flex gap-2">
          {prev ? (
            <LinkButton href={`/learn/${prev.id}`} variant="outline">
              <ArrowRight className="ml-1 h-4 w-4" />
              {prev.title}
            </LinkButton>
          ) : (
            <div />
          )}
          {next && (
            <LinkButton href={`/learn/${next.id}`} variant="outline">
              {next.title}
              <ArrowLeft className="mr-1 h-4 w-4" />
            </LinkButton>
          )}
        </div>
        <div className="flex gap-2">
          <LinkButton href={`/practice/${chapter.id}`} variant="secondary">
            <Dumbbell className="ml-1 h-4 w-4" />
            תרגול מבחן
          </LinkButton>
          {!isCompleted && onComplete && (
            <Button onClick={onComplete} className="bg-gradient-to-l from-violet-600 to-indigo-600">
              <CheckCircle2 className="ml-1 h-4 w-4" />
              סימון כהושלם
            </Button>
          )}
          {isCompleted && (
            <Badge className="bg-emerald-600 px-3 py-1">הושלם ✓</Badge>
          )}
        </div>
      </div>
    </motion.div>
  );
}
