const fs = require("fs");
const path = require("path");
const buildChapterData = require("./enrich-presentation-data");

const ROOT = path.join(__dirname, "..");
const CHAPTERS_DIR = path.join(ROOT, "src/content/chapters");

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

function callout(type, title, content) {
  return { type, title, content };
}

function section(id, title, paragraphs, extras = {}) {
  const content = (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).join("\n\n");
  const block = { id, title, content };
  if (extras.callouts?.length) block.callouts = extras.callouts;
  if (extras.steps?.length) block.steps = extras.steps;
  if (extras.cards?.length) block.cards = extras.cards;
  if (extras.diagram) block.diagram = extras.diagram;
  if (extras.inlineCode) block.inlineCode = extras.inlineCode;
  if (extras.table) block.table = extras.table;
  return block;
}

function steps(items) {
  return items.map((item, index) => ({
    number: index + 1,
    title: item.title,
    body: item.body,
  }));
}

function cards(items) {
  return items;
}

function diagram(spec) {
  return spec;
}

function inlineCode(spec) {
  return spec;
}

function table(headers, rows) {
  return { headers, rows };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function mergeChapter(existing, enrichment) {
  const result = { ...existing };

  if (enrichment.introduction) result.introduction = enrichment.introduction;
  if (enrichment.sections) result.sections = enrichment.sections;
  if (enrichment.estimatedMinutes) result.estimatedMinutes = enrichment.estimatedMinutes;

  if (enrichment.summary) {
    result.summary = enrichment.summary;
  }

  if (enrichment.codeExamples) {
    const map = new Map((existing.codeExamples || []).map((e) => [e.id, e]));
    for (const ex of enrichment.codeExamples) {
      map.set(ex.id, map.has(ex.id) ? { ...map.get(ex.id), ...ex } : ex);
    }
    result.codeExamples = Array.from(map.values());
  }

  if (enrichment.commonMistakes) {
    const keep = (existing.commonMistakes || []).filter((m) => m.title !== "טעות נפוצה");
    result.commonMistakes =
      enrichment.commonMistakes.length >= 2
        ? enrichment.commonMistakes
        : [...enrichment.commonMistakes, ...keep];
  }

  if (enrichment.examTips) {
    result.examTips = [...new Set([...enrichment.examTips, ...(existing.examTips || [])])];
  }

  if (enrichment.comparisons?.length) {
    result.comparisons = enrichment.comparisons;
  }

  if (enrichment.projectAnalysis?.length) {
    const map = new Map((existing.projectAnalysis || []).map((p) => [p.id, p]));
    for (const pa of enrichment.projectAnalysis) {
      map.set(pa.id, map.has(pa.id) ? { ...map.get(pa.id), ...pa } : pa);
    }
    result.projectAnalysis = Array.from(map.values());
  }

  return result;
}

const api = { section, steps, cards, diagram, inlineCode, table, callout };
const CHAPTER_DATA = buildChapterData(api);

function main() {
  const counts = {};

  for (const id of CHAPTER_IDS) {
    const chapterPath = path.join(CHAPTERS_DIR, `${id}.json`);
    const existing = readJson(chapterPath);
    const enrichment = CHAPTER_DATA[id];

    if (!enrichment) {
      console.warn(`No presentation data for chapter: ${id}`);
      continue;
    }

    const merged = mergeChapter(existing, enrichment);
    writeJson(chapterPath, merged);
    counts[id] = merged.sections.length;
    console.log(`${id}: ${counts[id]} sections`);
  }

  console.log("\nSection counts per chapter:");
  for (const id of CHAPTER_IDS) {
    console.log(`  ${id}: ${counts[id] ?? "skipped"}`);
  }
}

main();
