const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "exam-sources");
const OUT = path.join(__dirname, "../src/data/final-exam.json");

function letters() {
  return ["a", "b", "c", "d", "e", "f"];
}

function xmlToText(xmlPath) {
  let xml = fs.readFileSync(xmlPath, "utf8");
  xml = xml.replace(/<w:tab\/>/g, "\t");
  xml = xml.replace(/<\/w:p>/g, "\n");
  xml = xml.replace(/<[^>]+>/g, "");
  return xml
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/\r/g, "");
}

function guessTopic(text) {
  const t = text.toLowerCase();
  if (/mysql|executenonquery|datareader|sql|@name|connection/.test(t)) return "mysql";
  if (/file|stream|readline|using\b|filestream/.test(t)) return "files";
  if (/exception|try|catch|finally|tryparse|throw/.test(t)) return "exceptions";
  if (/interface|abstract|i[A-Z]/.test(t)) return "interfaces-abstract";
  if (/operator\s*\+|operator ==|overload|gethashcode|referenceequals/.test(t)) return "operator-overloading";
  if (/property|backing|get;\s*set|private set|\bvalue\b/.test(t)) return "properties";
  if (/\bis\b|\bas\b|upcast|downcast|cast/.test(t)) return "casting-relationships";
  if (/virtual|override|polymorph|hiding|\bnew\b.*method/.test(t)) return "polymorphism";
  if (/inherit|base\(|protected|:\s*[A-Z]/.test(t)) return "inheritance";
  if (/encapsul|static|overload|getter|setter|private field/.test(t)) return "methods-encapsulation";
  if (/class|object|constructor|namespace|\bnew\b/.test(t)) return "classes-objects";
  if (/main|clr|short-circuit|array|loop|switch/.test(t)) return "introduction";
  return "introduction";
}

function makeQuestion({ id, question, options, correctIndex, explanation, code, sourceFile, topicId, difficulty = "medium" }) {
  const ids = letters();
  const correctId = ids[correctIndex] || "a";
  const opts = options.map((text, i) => ({ id: ids[i], text: String(text).trim() }));
  const topic = topicId || guessTopic(`${question}\n${options.join("\n")}\n${code || ""}`);
  const exp = explanation || "לפי חומר התרגול למבחן.";
  return {
    id,
    question: question.trim(),
    ...(code ? { code: code.trim() } : {}),
    options: opts,
    correctId,
    explanation: exp,
    wrongExplanations: Object.fromEntries(opts.map((o) => [o.id, o.id === correctId ? exp : "תשובה שגויה לפי מבחן התרגול."])),
    difficulty,
    topicId: topic,
    chapterIds: [topic],
    sourceFile,
  };
}

function extractJsArrayLiteral(source, marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Marker not found: ${marker}`);
  const bracketStart = source.indexOf("[", start);
  let depth = 0;
  let inString = false;
  let quote = "";
  let escaped = false;
  for (let i = bracketStart; i < source.length; i++) {
    const ch = source[i];
    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === "\\") {
        escaped = true;
        continue;
      }
      if (ch === quote) inString = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      inString = true;
      quote = ch;
      continue;
    }
    if (ch === "[") depth++;
    if (ch === "]") {
      depth--;
      if (depth === 0) return source.slice(bracketStart, i + 1);
    }
  }
  throw new Error(`Unclosed array after ${marker}`);
}

function parseMivhan3() {
  const html = fs.readFileSync(path.join(SRC, "Mivhan3.html"), "utf8");
  const literal = extractJsArrayLiteral(html, "const questions");
  // eslint-disable-next-line no-eval
  const questions = eval(literal);
  return questions.map((q, i) =>
    makeQuestion({
      id: `m3-${String(i + 1).padStart(2, "0")}`,
      question: q.q,
      options: q.options,
      correctIndex: q.ans,
      code: q.code,
      sourceFile: "מבחן 3.html",
      explanation: "מתוך מבחן 3.html בתיקיית תרגול למבחן.",
    })
  );
}

function parseQuizHub() {
  const html = fs.readFileSync(path.join(SRC, "Quiz_Hub.html"), "utf8");
  const literal = extractJsArrayLiteral(html, "const quizzes");
  // eslint-disable-next-line no-eval
  const quizzes = eval("(" + literal + ")");
  const out = [];
  let n = 0;
  for (const quiz of quizzes) {
    for (const q of quiz.questions) {
      n++;
      out.push(
        makeQuestion({
          id: `qh-${quiz.key}-${String(n).padStart(3, "0")}`,
          question: `[${quiz.quizTitle}] ${q.question}`,
          options: q.options,
          correctIndex: q.correct,
          explanation: q.hint || "מתוך Advanced C# Programming — Quiz Hub.html",
          sourceFile: "Advanced C# Programming — Quiz Hub.html",
          topicId: guessTopic(`${quiz.topic} ${q.question}`),
        })
      );
    }
  }
  return out;
}

/** Load answer keys previously transcribed from the Word exams (same questions). */
function loadAnswerBankFromBuildScript() {
  const map = new Map();
  try {
    const bankPath = path.join(__dirname, "build-exam-bank.js");
    if (!fs.existsSync(bankPath)) return map;
    // Pull pe / le questions by requiring a thin extract — not available as module.
    // Fallback: use current final-exam pe-/le- ids if present.
  } catch (_) {}
  return map;
}

function normalizeQ(s) {
  return String(s)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\w\u0590-\u05FF ?]/g, "")
    .trim()
    .slice(0, 120);
}

function loadPeLeAnswerLookup() {
  const lookup = new Map();
  const existing = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/final-exam.json"), "utf8"));
  for (const q of existing) {
    if (q.id.startsWith("pe-") || q.id.startsWith("le-")) {
      lookup.set(normalizeQ(q.question), q);
      if (q.code) lookup.set(normalizeQ(q.question + "\n" + q.code), q);
    }
  }
  // Also from build script by evaluating export — parse mc calls is heavy; use final-exam for pe/le.
  return lookup;
}

function parsePracticeExamDocx(lookup) {
  const text = xmlToText(path.join(SRC, "Practice_Exam.xml"));
  fs.writeFileSync(path.join(SRC, "Practice_Exam.txt"), text, "utf8");
  const blocks = text.split(/Question\s+\d+/i).slice(1);
  const out = [];
  blocks.forEach((block, i) => {
    const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
    // Prefer Hebrew question line if present after English
    let questionEn = "";
    let questionHe = "";
    let codeLines = [];
    let inCode = false;
    const options = [];
    for (const line of lines) {
      if (/^\d+\)/.test(line)) {
        questionEn = line.replace(/^\d+\)\s*/, "");
        continue;
      }
      if (/^[א-ת].*|מה |איזה |מהו |למה |כיצד /.test(line) && !/^[A-D]\./.test(line) && !questionHe) {
        if (!line.startsWith("Code:") && !/^A\./.test(line)) questionHe = line;
        continue;
      }
      if (/^Code:/i.test(line)) {
        inCode = true;
        const rest = line.replace(/^Code:\s*/i, "");
        if (rest) codeLines.push(rest);
        continue;
      }
      if (/^[A-D]\./.test(line)) {
        inCode = false;
        options.push(line.replace(/^[A-D]\.\s*/, ""));
        continue;
      }
      if (inCode) codeLines.push(line);
    }
    if (options.length < 2) return;
    const question = questionHe || questionEn || `שאלה ${i + 1}`;
    const code = codeLines.join("\n").trim() || undefined;
    const key = normalizeQ(questionEn || question);
    const key2 = normalizeQ(question);
    const known = lookup.get(key) || lookup.get(key2) || lookup.get(normalizeQ((questionEn || question) + (code ? "\n" + code : "")));
    let correctIndex = 0;
    let explanation = "מתוך Practice_Exam.docx בתיקיית תרגול למבחן.";
    if (known) {
      correctIndex = letters().indexOf(known.correctId);
      if (correctIndex < 0) correctIndex = 0;
      explanation = known.explanation || explanation;
    }
    out.push(
      makeQuestion({
        id: `pe-${String(i + 1).padStart(2, "0")}`,
        question: questionHe ? `${questionEn}\n${questionHe}` : question,
        options,
        correctIndex,
        code,
        explanation,
        sourceFile: "Practice_Exam.docx",
        topicId: known?.topicId || known?.chapterIds?.[0],
      })
    );
  });
  return out;
}

function parseLilachExamDocx(lookup) {
  const text = xmlToText(path.join(SRC, "Lilach_Exam.xml"));
  fs.writeFileSync(path.join(SRC, "Lilach_Exam.txt"), text, "utf8");
  // Split on "שאלה N" patterns (Hebrew)
  const parts = text.split(/שאלה\s*\d+/);
  const header = parts[0] || "";
  const blocks = parts.slice(1);
  const sourceName = "תרגול למבחן עם דוגמא מובנית - מבחן לילך.docx";
  const out = [];

  // Prefer using le-* from existing bank if parsing options is fragile — merge by order when counts match
  const leKnown = [...lookup.entries()]
    .filter(([_, q]) => q.id.startsWith("le-"))
    .map(([_, q]) => q)
    .sort((a, b) => a.id.localeCompare(b.id));

  if (leKnown.length >= 20 && blocks.length >= 20) {
    return leKnown.map((q) => ({
      ...q,
      sourceFile: sourceName,
      chapterIds: q.chapterIds || [q.topicId],
    }));
  }

  blocks.forEach((block, i) => {
    const known = leKnown[i];
    if (known) {
      out.push({ ...known, sourceFile: sourceName, chapterIds: known.chapterIds || [known.topicId] });
      return;
    }
    const cleaned = block.trim();
    if (cleaned.length < 40) return;
    out.push(
      makeQuestion({
        id: `le-${String(i + 1).padStart(2, "0")}`,
        question: cleaned.slice(0, 500),
        options: ["א", "ב", "ג", "ד"],
        correctIndex: 0,
        sourceFile: sourceName,
        explanation: "מתוך מבחן לילך — יש לבדוק תשובה בחומר.",
      })
    );
  });
  return out;
}

function dedupe(questions) {
  const seen = new Set();
  const out = [];
  for (const q of questions) {
    const key = normalizeQ(q.question + (q.code || ""));
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
  }
  return out;
}

const lookup = loadPeLeAnswerLookup();
const fromM3 = parseMivhan3();
const fromQh = parseQuizHub();
const fromPe = parsePracticeExamDocx(lookup);
const fromLe = parseLilachExamDocx(lookup);

// If Practice_Exam parse failed to get 36, fall back to pe-* from current bank with source label
let peFinal = fromPe;
if (peFinal.length < 30) {
  peFinal = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/final-exam.json"), "utf8"))
    .filter((q) => q.id.startsWith("pe-"))
    .map((q) => ({ ...q, sourceFile: "Practice_Exam.docx", chapterIds: q.chapterIds || [q.topicId] }));
}

let leFinal = fromLe;
if (leFinal.length < 20) {
  leFinal = JSON.parse(fs.readFileSync(path.join(__dirname, "../src/data/final-exam.json"), "utf8"))
    .filter((q) => q.id.startsWith("le-"))
    .map((q) => ({
      ...q,
      sourceFile: "תרגול למבחן עם דוגמא מובנית - מבחן לילך.docx",
      chapterIds: q.chapterIds || [q.topicId],
    }));
}

const all = dedupe([...fromM3, ...fromQh, ...peFinal, ...leFinal]);
fs.writeFileSync(OUT, JSON.stringify(all, null, 2), "utf8");
console.log(
  JSON.stringify(
    {
      mivhan3: fromM3.length,
      quizHub: fromQh.length,
      practiceExam: peFinal.length,
      lilach: leFinal.length,
      totalUnique: all.length,
      bySource: all.reduce((acc, q) => {
        acc[q.sourceFile] = (acc[q.sourceFile] || 0) + 1;
        return acc;
      }, {}),
    },
    null,
    2
  )
);
