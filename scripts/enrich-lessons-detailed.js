const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const CHAPTERS_DIR = path.join(ROOT, "src/content/chapters");
const PRACTICE_DIR = path.join(ROOT, "src/data/practice");
const FINAL_EXAM_PATH = path.join(ROOT, "src/data/final-exam.json");

const CHAPTER_IDS = [
  "introduction",
  "classes-objects",
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

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function section(id, title, paragraphs, callouts) {
  const content = (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).join("\n\n");
  const block = { id, title, content };
  if (callouts && callouts.length > 0) block.callouts = callouts;
  return block;
}

function callout(type, title, content) {
  return { type, title, content };
}

function mergeChapter(existing, enrichment) {
  const result = { ...existing };
  if (enrichment.introduction) result.introduction = enrichment.introduction;
  if (enrichment.sections) result.sections = enrichment.sections;
  if (enrichment.summary) result.summary = enrichment.summary;
  if (enrichment.estimatedMinutes) result.estimatedMinutes = enrichment.estimatedMinutes;

  if (enrichment.codeExamples) {
    const map = new Map((existing.codeExamples || []).map((e) => [e.id, e]));
    for (const ex of enrichment.codeExamples) {
      map.set(ex.id, map.has(ex.id) ? { ...map.get(ex.id), ...ex } : ex);
    }
    result.codeExamples = Array.from(map.values());
  }

  if (enrichment.commonMistakes) {
    const keep = (existing.commonMistakes || []).filter((m) => m.title !== "טעות נפוצה");
    result.commonMistakes = enrichment.commonMistakes.length >= 2 ? enrichment.commonMistakes : [...enrichment.commonMistakes, ...keep];
  }

  if (enrichment.examTips) {
    result.examTips = [...new Set([...enrichment.examTips, ...(existing.examTips || [])])];
  }

  if (enrichment.comparisons && enrichment.comparisons.length > 0) {
    result.comparisons = enrichment.comparisons;
  }

  return result;
}

const TERMS = [
  { pattern: /\bCLR\b/i, term: "CLR", explanation: "Common Language Runtime — סביבת הריצה של .NET. מתרגמת IL לקוד מכונה (JIT), מנהלת זיכרון (GC) ומטפלת בחריגות." },
  { pattern: /\bIL\b/i, term: "IL", explanation: "Intermediate Language — קוד ביניים שמופק בקומפילציה מ-C#. נייד בין מערכות עם .NET Runtime." },
  { pattern: /short-circuit|short circuit/i, term: "Short-circuit", explanation: "ב-&& ו-||: אם התוצאה כבר נקבעת מהצד הראשון, הצד השני לא מוערך — כולל side effects כמו y++." },
  { pattern: /\bvirtual\b/i, term: "virtual", explanation: "מסמן מתודה במחלקת בסיס שניתן לדרוס ביורש. בלי virtual — overriding לא יוצר פולימורפיזם דינמי." },
  { pattern: /\boverride\b/i, term: "override", explanation: "דריסת מימוש virtual/abstract ממחלקת בסיס. דורש חתימה זהה ומילת virtual בבסיס." },
  { pattern: /\babstract\b/i, term: "abstract", explanation: "מחלקה/מתודה מופשטת — אין מימוש (מתודה) או אין מופעים (מחלקה). יורש חייב לממש מתודות abstract או להיות abstract." },
  { pattern: /\binterface\b/i, term: "interface", explanation: "חוזה התנהגות — מגדיר מה המחלקה תעשה, לא איך. מימוש public ללא override. מותר לממש כמה ממשקים." },
  { pattern: /x\+\+|y\+\+|\+\+x/i, term: "Postfix/Prefix ++", explanation: "x++ מחזיר את הערך הישן ואז מגדיל. ++x מגדיל קודם ומחזיר את הערך החדש. בסדר הערכה משמאל לימין." },
  { pattern: /\bupcast/i, term: "Upcasting", explanation: "המרה מיורש לבסיס: Pet p = new Dog() — תמיד בטוחה ומרומזת." },
  { pattern: /\bdowncast/i, term: "Downcasting", explanation: "המרה מבסיס ליורש: (Dog)p — מסוכנת; עדיף is/as לפני cast." },
  { pattern: /\bas\s+operator|\bas\s+\w/i, term: "as", explanation: "אופרטור המרה בטוח: מחזיר null בכישלון במקום לזרוק InvalidCastException." },
  { pattern: /ExecuteNonQuery/i, term: "ExecuteNonQuery", explanation: "מריץ פקודות INSERT/UPDATE/DELETE ומחזיר מספר שורות שהושפעו." },
  { pattern: /ExecuteReader/i, term: "ExecuteReader", explanation: "מריץ SELECT ומחזיר DataReader לקריאת שורות תוצאה." },
  { pattern: /TryParse/i, term: "TryParse", explanation: "מנסה המרה ומחזיר bool. משתמש ב-out לערך — לא זורק חריגה על קלט לא תקין." },
  { pattern: /ReferenceEquals/i, term: "ReferenceEquals", explanation: "בודק זהות הפניה (אותו אובייקט בזיכרון). משמש ב-operator== מותאם כדי למנוע רקורסיה עם null." },
  { pattern: /GetHashCode/i, term: "GetHashCode", explanation: "מחזיר hash code לאובייקט. חייב להיות עקבי עם Equals ו-== מותאם." },
  { pattern: /\bprotected\b/i, term: "protected", explanation: "נגיש במחלקה וביורשים — לא מבחוץ. שימושי לשיתוף נתונים בהיררכיית ירושה." },
  { pattern: /IS-A|HAS-A/i, term: "IS-A / HAS-A", explanation: "IS-A = ירושה (Dog הוא Pet). HAS-A = קומפוזיציה (Agent מחזיק Car)." },
];

const QUESTION_ENRICHMENTS = {
  "intro-m2": {
    code: "int x = 5;\nint y = 0;\nif (x > 3 || y++ > 0)\n    Console.WriteLine(y);",
    termsContext: [{ term: "Short-circuit", explanation: "ב-||: אם x>3 כבר true, y++>0 לא נבדק — y נשאר 0." }],
    detailedExplanation:
      "שלב 1: x=5, y=0.\nשלב 2: בודקים x>3 → true.\nשלב 3: בגלל || ו-short-circuit, הצד השני (y++>0) לא רץ — y לא משתנה.\nשלב 4: מדפיסים y → 0.\n\nאם היה && במקום ||, או אם x היה 2, y++ היה רץ ו-y היה 1.",
  },
  "exam-2": {
    code: "int x = 5;\nint y = 0;\nif (x > 3 || y++ > 0)\n    Console.WriteLine(y);",
    termsContext: [{ term: "Short-circuit", explanation: "ב-||: אם x>3 כבר true, y++>0 לא נבדק — y נשאר 0." }],
    detailedExplanation:
      "שלב 1: x=5, y=0.\nשלב 2: בודקים x>3 → true.\nשלב 3: בגלל || ו-short-circuit, הצד השני (y++>0) לא רץ — y לא משתנה.\nשלב 4: מדפיסים y → 0.",
  },
  "intro-m3": {
    termsContext: [
      { term: "Short-circuit", explanation: "&&: אם הראשון false — השני לא נבדק. ||: אם הראשון true — השני לא נבדק." },
      { term: "&& / ||", explanation: "אופרטורים לוגיים עם short-circuit. שונה מ-& ו-| שתמיד בודקים שני הצדדים." },
    ],
    detailedExplanation:
      "Short-circuit evaluation: המהדר מפסיק להעריך ביטוי לוגי ברגע שהתוצאה כבר ידועה.\n\nדוגמה עם &&: if (false && expensive()) — expensive לא נקרא.\nדוגמה עם ||: if (true || expensive()) — expensive לא נקרא.\n\nחשוב במבחן: side effects (y++, קריאות מתודה) עלולים לא לקרות!",
  },
  "exam-3": {
    termsContext: [
      { term: "Short-circuit", explanation: "&&: אם הראשון false — השני לא נבדק. ||: אם הראשון true — השני לא נבדק." },
    ],
    detailedExplanation:
      "Short-circuit: הצד השני לא מוערך אם הראשון כבר קובע את התוצאה הסופית של && או ||.\n\nזה לא קשור ללולאות ולא דורש | בודד — זה התנהגות של && ו-||.",
  },
  "intro-m4": {
    code: "int x = 5;\nConsole.WriteLine(x++ + ++x);",
    termsContext: [{ term: "Postfix/Prefix ++", explanation: "x++ מחזיר 5 ואז x=6. ++x מגדיל ל-7 ומחזיר 7. סכום: 5+7=12." }],
    detailedExplanation:
      "התחלה: x = 5.\n\nשלב 1 — x++ (postfix): מחזיר 5, אחר כך x הופך ל-6.\nשלב 2 — ++x (prefix): מגדיל x מ-6 ל-7, מחזיר 7.\nשלב 3 — חיבור: 5 + 7 = 12.\n\nטעות נפוצה: לחשוב ששניהם רואים 5 (11) או ששניהם רואים 7 (14). הסדר משמאל לימין קובע.",
  },
  "exam-4": {
    code: "int x = 5;\nConsole.WriteLine(x++ + ++x);",
    termsContext: [{ term: "Postfix/Prefix ++", explanation: "x++ מחזיר 5 ואז x=6. ++x מגדיל ל-7 ומחזיר 7. סכום: 5+7=12." }],
    detailedExplanation:
      "התחלה: x = 5.\n\nשלב 1 — x++: מחזיר 5, x=6.\nשלב 2 — ++x: x=7, מחזיר 7.\nשלב 3: 5+7=12.\n\nx בסוף הביטוי הוא 7, אבל התשובה היא 12.",
  },
  "intro-m5": {
    termsContext: [
      { term: "CLR", explanation: "מריץ IL בזמן ריצה (JIT), מנהל זיכרון ו-GC — לא ממיר C# ל-IL." },
      { term: "IL", explanation: "נוצר בקומפילציה על ידי הקומפיילר של C#, לא על ידי CLR." },
    ],
    detailedExplanation:
      "תהליך .NET לפי הקורס:\n1) C# → קומפילציה → IL (קוד ביניים).\n2) CLR → JIT → קוד מכונה בזמן ריצה.\n3) CLR גם מנהל זיכרון (Garbage Collection) ואבטחה.\n\nתשובה א' שגויה: המרת C# ל-IL נעשית בקומפילציה, לא ב-CLR.",
  },
};

function detectTerms(text) {
  const found = [];
  const seen = new Set();
  for (const { pattern, term, explanation } of TERMS) {
    if (pattern.test(text) && !seen.has(term)) {
      seen.add(term);
      found.push({ term, explanation });
    }
  }
  return found;
}

function extractCodeFromQuestion(question) {
  const lines = question.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    const codeLines = lines.slice(1);
    if (codeLines.some((l) => /[;{}()]|Console\.|int |double |if\s*\(|class |public |void |return /.test(l))) {
      return codeLines.join("\n");
    }
  }
  const inline = question.match(/(?:מה יודפס\??\s*)(.+)/i);
  if (inline && /Console\.|x\+\+|\+\+x|[;{}]/.test(inline[1])) {
    return inline[1].replace(/\s*כש[-\s].*$/i, "").trim();
  }
  if (/^(int |double |if\s*\(|class |public |Console\.)/.test(question.trim())) {
    return question.trim();
  }
  return undefined;
}

function enrichQuestion(q) {
  const text = `${q.question} ${q.explanation || ""}`;
  const specific = QUESTION_ENRICHMENTS[q.id];
  const termsContext = specific?.termsContext || detectTerms(text);
  const code = specific?.code || q.code || extractCodeFromQuestion(q.question);
  const detailedExplanation = specific?.detailedExplanation || q.detailedExplanation;

  const enriched = { ...q };
  if (termsContext.length > 0) enriched.termsContext = termsContext;
  if (code) enriched.code = code;
  if (detailedExplanation) enriched.detailedExplanation = detailedExplanation;
  if (/x\+\+.*\+\+x|\+\+x.*x\+\+/.test(text) && !enriched.detailedExplanation) {
    enriched.detailedExplanation =
      "x++ מחזיר ערך ישן ואז מגדיל. ++x מגדיל קודם ומחזיר ערך חדש. הערכה משמאל לימין.";
  }
  return enriched;
}

function enrichPracticeFile(data) {
  if (data.multipleChoice) {
    data.multipleChoice = data.multipleChoice.map(enrichQuestion);
  }
  return data;
}

const CHAPTER_ENRICHMENTS = require("./enrich-lessons-chapters-data").CHAPTER_ENRICHMENTS;

function enrichChapters() {
  let count = 0;
  for (const id of CHAPTER_IDS) {
    const filePath = path.join(CHAPTERS_DIR, `${id}.json`);
    const existing = readJson(filePath);
    const enrichment = CHAPTER_ENRICHMENTS[id];
    if (!enrichment) {
      console.warn(`No enrichment for chapter: ${id}`);
      continue;
    }
    const merged = mergeChapter(existing, enrichment);
    writeJson(filePath, merged);
    count++;
    console.log(`  chapter: ${id} (${merged.sections.length} sections)`);
  }
  return count;
}

function enrichAllPractice() {
  let files = 0;
  let questions = 0;
  for (const id of CHAPTER_IDS) {
    const filePath = path.join(PRACTICE_DIR, `${id}.json`);
    if (!fs.existsSync(filePath)) continue;
    const data = readJson(filePath);
    const before = JSON.stringify(data);
    const enriched = enrichPracticeFile(data);
    writeJson(filePath, enriched);
    files++;
    questions += enriched.multipleChoice?.length || 0;
    console.log(`  practice: ${id}.json`);
  }
  return { files, questions };
}

function enrichFinalExam() {
  const data = readJson(FINAL_EXAM_PATH);
  const enriched = data.map(enrichQuestion);
  writeJson(FINAL_EXAM_PATH, enriched);
  console.log(`  final-exam.json (${enriched.length} questions)`);
  return enriched.length;
}

function main() {
  console.log("Enriching chapters...");
  const chapterCount = enrichChapters();

  console.log("\nEnriching practice files...");
  const practice = enrichAllPractice();

  console.log("\nEnriching final exam...");
  const examCount = enrichFinalExam();

  console.log("\n--- Summary ---");
  console.log(`Chapters updated: ${chapterCount}`);
  console.log(`Practice files updated: ${practice.files} (${practice.questions} MC questions)`);
  console.log(`Final exam questions enriched: ${examCount}`);
  console.log("Done.");
}

main();
