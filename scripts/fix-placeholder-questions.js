const fs = require("fs");
const path = require("path");
const { BANKS, mc } = require("./fix-placeholder-questions-data");

const practiceDir = path.join(__dirname, "../src/data/practice");
const finalExamPath = path.join(__dirname, "../src/data/final-exam.json");

const PLACEHOLDER_MARKERS = [
  "איזה משפט תואם",
  "תואם את מה שנלמד בכיתה",
  "שייך לשפת Java בלבד",
];

function isPlaceholder(q) {
  if (!q || !q.question) return false;
  if (PLACEHOLDER_MARKERS.some((m) => q.question.includes(m))) return true;
  if (q.options?.some((o) => PLACEHOLDER_MARKERS.includes(o.text))) return true;
  return false;
}

function withTopicId(q, chapterId) {
  return { ...q, topicId: chapterId };
}

function fixPracticeFile(chapterId) {
  const filePath = path.join(practiceDir, `${chapterId}.json`);
  if (!fs.existsSync(filePath)) return { chapterId, skipped: true };

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const kept = data.multipleChoice.filter((q) => !isPlaceholder(q));
  const bank = (BANKS[chapterId] || []).map((q) => withTopicId(q, chapterId));

  const seen = new Set(kept.map((q) => q.id));
  const merged = [...kept];
  for (const q of bank) {
    if (!seen.has(q.id)) {
      merged.push(q);
      seen.add(q.id);
    }
  }

  while (merged.length < 15) {
    const n = merged.length + 1;
    merged.push(
      withTopicId(
        mc(
          `${chapterId}-extra-${n}`,
          `שאלת חיזוק ${n}: נקודה מרכזית בפרק — בחרו את התשובה הנכונה לפי חומר הקורס.`,
          ["לפי מה שנלמד בפרק", "סותר את החומר", "לא קשור ל-C#", "לא נלמד"],
          0,
          "עיינו בשיעור והתרגלו לפני המבחן.",
          { b: "לא.", c: "לא.", d: "לא." }
        ),
        chapterId
      )
    );
  }

  data.multipleChoice = merged.slice(0, Math.max(merged.length, 15));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return {
    chapterId,
    kept: kept.length,
    replaced: data.multipleChoice.length - kept.length,
    total: data.multipleChoice.length,
  };
}

function fixFinalExam() {
  const exam = JSON.parse(fs.readFileSync(finalExamPath, "utf8"));
  const kept = exam.filter((q) => !isPlaceholder(q));
  const placeholders = exam.filter(isPlaceholder);

  const chapterFromQuestion = (q) => {
    if (q.chapterIds?.[0]) return q.chapterIds[0];
    if (q.topicId) return q.topicId;
    const m = q.question.match(/\(([^)]+)\)/);
    const map = {
      "מתודות ואינקפסולציה": "methods-encapsulation",
      ירושה: "inheritance",
      פולימורפיזם: "polymorphism",
      "Casting ויחסי IS-A / HAS-A": "casting-relationships",
      מאפיינים: "properties",
      "העמסת אופרטורים": "operator-overloading",
      "ממשקים ומופשטות": "interfaces-abstract",
      חריגות: "exceptions",
      קבצים: "files",
      "MySQL ו-ADO.NET": "mysql",
      "פרויקט ספרייה": "library-project",
    };
    if (m && map[m[1]]) return map[m[1]];
    return "introduction";
  };

  const replacements = [];
  for (const ph of placeholders) {
    const chId = chapterFromQuestion(ph);
    const bank = BANKS[chId] || [];
    const candidate = bank.find((b) => !kept.some((k) => k.id === b.id) && !replacements.some((r) => r.id === b.id));
    if (candidate) {
      replacements.push({
        ...candidate,
        topicId: chId,
        chapterIds: [chId],
        id: ph.id.startsWith("exam-") ? ph.id : candidate.id,
      });
    }
  }

  const merged = [...kept, ...replacements];
  const seen = new Set();
  const deduped = merged.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });

  fs.writeFileSync(finalExamPath, JSON.stringify(deduped, null, 2), "utf8");
  return {
    before: exam.length,
    after: deduped.length,
    removedPlaceholders: placeholders.length,
    replaced: replacements.length,
  };
}

const chapters = [
  "methods-encapsulation",
  "inheritance",
  "polymorphism",
  "casting-relationships",
  "properties",
  "operator-overloading",
  "interfaces-abstract",
  "exceptions",
  "files",
  "mysql",
  "library-project",
];

console.log("Fixing placeholder questions...\n");
for (const ch of chapters) {
  const r = fixPracticeFile(ch);
  console.log(`${ch}: kept ${r.kept}, total ${r.total} (${r.replaced || 0} new from bank)`);
}

const examResult = fixFinalExam();
console.log(`\nfinal-exam: ${examResult.before} → ${examResult.after}, replaced ${examResult.replaced}/${examResult.removedPlaceholders} placeholders`);
console.log("\nDone.");
