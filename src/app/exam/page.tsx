import { getFinalExamQuestions } from "@/lib/content";
import { ExamPageClient } from "./exam-page-client";

export const metadata = {
  title: "מבחן מסכם | תכנות מתקדם C#",
};

export default function ExamPage() {
  const questions = getFinalExamQuestions();
  return <ExamPageClient questions={questions} />;
}
