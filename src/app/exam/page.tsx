import { getExamBundles } from "@/lib/content";
import { ExamPageClient } from "./exam-page-client";

export const metadata = {
  title: "מבחן מסכם | תכנות מתקדם C#",
};

export default function ExamPage() {
  const bundles = getExamBundles();
  return <ExamPageClient bundles={bundles} />;
}
