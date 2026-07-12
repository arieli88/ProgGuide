import { getAllChallengeQuestions } from "@/lib/content";
import { FinalChallengePageClient } from "./final-challenge-page-client";

export const metadata = {
  title: "אתגר הסופי | תכנות מתקדם C#",
  description: "כל שאלות הקורס מעורבבות — האתגר המלא לפני המבחן",
};

export default function FinalChallengePage() {
  const questions = getAllChallengeQuestions();
  return <FinalChallengePageClient questions={questions} />;
}
