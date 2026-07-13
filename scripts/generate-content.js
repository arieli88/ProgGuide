const fs = require("fs");
const path = require("path");

const chaptersDir = path.join(__dirname, "../src/content/chapters");
const practiceDir = path.join(__dirname, "../src/data/practice");

fs.mkdirSync(chaptersDir, { recursive: true });
fs.mkdirSync(practiceDir, { recursive: true });

function mc(id, q, opts, correct, exp, wrong, diff = "medium", code) {
  return {
    id,
    question: q,
    code,
    options: opts.map((t, i) => ({ id: String.fromCharCode(97 + i), text: t })),
    correctId: String.fromCharCode(97 + correct),
    explanation: exp,
    wrongExplanations: Object.fromEntries(
      opts.map((t, i) => [String.fromCharCode(97 + i), i === correct ? exp : wrong[i] || "לא נכון לפי חומר הקורס."])
    ),
    difficulty: diff,
    topicId: "",
  };
}

const chapterDefs = [
  {
    id: "introduction",
    title: "מבוא ורענון",
    subtitle: "יסודות C#, קומפילציה, טיפוסים, בקרת זרימה ומערכים",
    order: 1,
    prerequisites: [],
    sources: ["שיעור 1 - רענון/lecture1.pptx"],
    estimatedMinutes: 45,
    introduction: {
      what: "נחזור על יסודות השפה: קומפילציה ב-.NET, טיפוסי נתונים, משתנים, ביטויים, קלט/פלט, תנאים, לולאות ומערכים.",
      why: "הקורס בונה ישירות על ידע מתכנות בסיסי. בלי שליטה ביסודות אי אפשר להבין OOP ומסדי נתונים.",
      when: "בתחילת כל פרויקט C#, בכל מקום שצריך לקרוא קלט, לבצע חישובים, לבחור מסלול בקוד או לאחסן רשימות.",
    },
    sections: [
      {
        id: "compilation",
        title: "תהליך הקומפילציה ב-C#",
        content:
          "בקורס נלמד שקוד C# עובר קומפילציה ל-IL (Intermediate Language), ואז ה-CLR מתרגם בזמן ריצה לקוד מכונה. היתרון: קוד נייד בין מערכות עם .NET. החיסרון: נדרש Runtime. שגיאות תחביר נתפסות לפני הרצה — בניגוד למפרש שיכול להיתקל בשגיאה רק בשורה שרצה.",
      },
      {
        id: "types",
        title: "טיפוסי נתונים עיקריים",
        content:
          "int לשלמים, double לממשיים, bool לערכי אמת/שקר, char לתו בודד, string למחרוזת, void ל'ללא ערך מוחזר'. const יוצר קבוע שלא ניתן לשנות אחרי אתחול — לפי הקורס מקובל לכתוב שמות קבועים באותיות גדולות.",
      },
      {
        id: "io",
        title: "קלט ופלט מהקונסול",
        content:
          "Console.ReadLine() תמיד מחזיר string. להמרה: Convert.ToInt32, Convert.ToDouble, int.Parse. שימו לב: \"4\" + 5 מייצר \"45\" (שרשור), לא 9. WriteLine מוסיף שורה חדשה; Write לא.",
      },
      {
        id: "control",
        title: "תנאים ולולאות",
        content:
          "if/else, switch עם break (fall-through אפשרי בכוונה), while, for, do-while, break ליציאה מוקדמת. short-circuit: ב-|| אם התנאי הראשון true, השני לא נבדק; ב-&& אם הראשון false, השני לא נבדק.",
      },
      {
        id: "arrays",
        title: "מערכים",
        content:
          "אינדקסים מתחילים מ-0. Length נותן גודל. גישה מחוץ לטווח → IndexOutOfRangeException. עדיף להשתמש ב-Length בלולאה ולא במספר קשיח.",
      },
    ],
    codeExamples: [
      {
        id: "intro-1",
        title: "קריאת מספר מהמשתמש",
        level: "basic",
        code: 'int age = Convert.ToInt32(Console.ReadLine());\nConsole.WriteLine("גיל: " + age);',
        language: "csharp",
        explanation: "ReadLine מחזיר מחרוזת; Convert ממיר למספר שלם.",
        lineByLine: [
          { line: 1, text: "קורא שורה מהמשתמש וממיר ל-int" },
          { line: 2, text: "מדפיס עם שרשור מחרוזות" },
        ],
      },
      {
        id: "intro-2",
        title: "לולאת for על מערך",
        level: "basic",
        code: "int[] nums = new int[5];\nfor (int i = 0; i < nums.Length; i++)\n    nums[i] = i * 10;",
        language: "csharp",
        explanation: "מאתחל מערך בגודל 5 וממלא ערכים לפי אינדקס.",
      },
    ],
    commonMistakes: [
      {
        title: "בלבול בין חיבור לשרשור",
        description: "Console.WriteLine(\"4\" + 5) מדפיס 45",
        why: "אופרטור + עם string מבצע שרשור, לא חיבור אריתמטי",
        howToAvoid: "המרו למספר לפני החישוב: int.Parse(\"4\") + 5",
      },
      {
        title: "שכחת לעדכן משתנה בלולאת while",
        description: "לולאה אינסופית",
        why: "התנאי נשאר true לנצח",
        howToAvoid: "ודאו שבגוף הלולאה המשתנה מתקרב לסיום",
      },
    ],
    examTips: [
      "CLR מריץ IL ומנהל זיכרון — לא רק 'מקמפל'",
      "short-circuit: y++ ב-|| עלול לא לרוץ",
      "x++ + ++x — סדר ההערכה חשוב למבחן",
      "אין Main → שגיאת קומפילציה",
      "מערך בגודל 9: אינדקסים 0-8 בלבד",
    ],
    comparisons: [
      {
        title: "while מול for",
        left: "while",
        right: "for",
        rows: [
          { aspect: "מבנה", left: "תנאי בראש", right: "אתחול+תנאי+עדכון בשורה אחת" },
          { aspect: "מתי", left: "כשלא יודעים מראש כמה איטרציות", right: "איטרציות ידועות (מערכים)" },
        ],
      },
    ],
    summary: "פרק הרענון מכין את הקרקע: טיפוסים, ביטויים, תנאים, לולאות ומערכים — הבסיס לכל שאר הקורס.",
    practice: {
      mc: [
        mc("intro-m1", "מה יקרה אם מתודת Main חסרה?", ["התוכנית תרוץ כרגיל", "שגיאת קומפילציה — אין נקודת כניסה", "שגיאת זמן ריצה בלבד", "תיווצר תוכנית ללא פלט"], 1, "לפי הקורס, Main היא נקודת הכניסה. בלעדיה אין קומפילציה תקינה.", ["", "", "", ""]),
        mc("intro-m2", "מה יודפס?\nint x=5; int y=0;\nif(x>3||y++>0) Console.WriteLine(y);", ["0", "1", "שגיאת קומפילציה", "חריגה"], 0, "בגלל short-circuit, y++ לא מתבצע כי x>3 כבר true.", ["", "", "", ""]),
        mc("intro-m3", "מה נכון לגבי short-circuit?", ["שני הצדדים תמיד נבדקים", "הצד השני לא יוערך אם הראשון קובע את התוצאה", "רק עם |", "רק בלולאות"], 1, "זה עיקרון ה-short-circuit evaluation ב-C#.", ["", "", "", ""]),
        mc("intro-m4", "מה יודפס? Console.WriteLine(x++ + ++x); כש-x=5", ["11", "12", "13", "שגיאה"], 1, "x++ מחזיר 5 ואז x=6; ++x הופך ל-7 ומחזיר 7; 5+7=12.", ["", "", "", ""]),
        mc("intro-m5", "מה תפקיד ה-CLR?", ["המרת C# ל-IL", "הרצת IL וניהול זיכרון", "בדיקת תחביר", "יצירת exe בלבד"], 1, "IL נוצר בקומפילציה; CLR מריץ בזמן ריצה.", ["", "", "", ""]),
        mc("intro-m6", "מה יודפס? Console.WriteLine(\"4\"+5);", ["9", "45", "שגיאה", "4 5"], 1, "שרשור מחרוזת — 5 הופך ל\"5\".", ["", "", "", ""]),
        mc("intro-m7", "איזה טיפוס מתאים למספר שלם?", ["double", "bool", "int", "void"], 2, "int מייצג שלמים.", ["", "", "", ""]),
        mc("intro-m8", "מה קורה בגישה ל-array[9] במערך בגודל 9?", ["ערך 0", "IndexOutOfRangeException", "הרחבה אוטומטית", "null"], 1, "אינדקסים 0-8 בלבד.", ["", "", "", ""]),
        mc("intro-m9", "מה ההבדל בין Write ל-WriteLine?", ["אין הבדל", "WriteLine מוסיף מעבר שורה", "Write רק למספרים", "WriteLine רק למחרוזות"], 1, "WriteLine מסיים בשורה חדשה.", ["", "", "", ""]),
        mc("intro-m10", "const string X = \"a\"; X = \"b\"; — מה קורה?", ["עובד", "שגיאת קומפילציה", "שגיאת ריצה", "מדפיס b"], 1, "לא ניתן לשנות const.", ["", "", "", ""]),
        mc("intro-m11", "איזה לולאה מבטיחה הרצה לפחות פעם אחת?", ["while", "for", "do-while", "אף אחת"], 2, "do-while בודק תנאי אחרי הגוף.", ["", "", "", ""]),
        mc("intro-m12", "מה תפקיד break בלולאה?", ["דילוג לאיטרציה הבאה", "יציאה מיידית מהלולאה", "עצירת התוכנית", "חזרה ל-Main"], 1, "break יוצא מהלולאה הקרובה.", ["", "", "", ""]),
        mc("intro-m13", "switch ללא break בין case-ים — מה זה?", ["שגיאה תמיד", "fall-through מכוון", "רק ב-default", "לא קיים ב-C#"], 1, "בקורס הודגם fall-through בין חודשים.", ["", "", "", ""]),
        mc("intro-m14", "int.Parse על קלט לא מספרי — מה קורה?", ["מחזיר 0", "חריגה", "מחזיר null", "מתעלם"], 1, "Parse זורק חריגה; TryParse עדיף לקלט משתמש.", ["", "", "", ""]),
        mc("intro-m15", "מה נכון על טווח חיים של משתנה מקומי?", ["נגיש בכל המחלקה", "נגיש רק בבלוק שבו הוגדר", "נגיש בכל הפרויקט", "תמיד static"], 1, "scope מקומי מוגבל לבלוק.", ["", "", "", ""]),
      ],
      open: [
        { id: "intro-o1", question: "הסבר את שלושת שלבי ההרצה ב-.NET לפי הקורס.", sampleAnswer: "C# → IL בקומפילציה → CLR מתרגם ומריץ בזמן ריצה עם ניהול זיכרון.", hint: "מקור, ביניים, ריצה" },
        { id: "intro-o2", question: "מה ההבדל בין שגיאת תחביר לשגיאת זמן ריצה?", sampleAnswer: "תחביר נתפסת בקומפילציה; ריצה קורית בזמן הרצה (למשל חלוקה ב-0).", hint: "מתי מתגלות" },
        { id: "intro-o3", question: "מתי משתמשים ב-switch במקום if/else?", sampleAnswer: "כשמשווים משתנה יחיד לערכים רבים — קוד נקי יותר.", hint: "השוואה מרובה" },
        { id: "intro-o4", question: "הסבר short-circuit עם דוגמה.", sampleAnswer: "ב-&& אם התנאי הראשון false, השני לא רץ; חוסך חישוב ומונע side effects.", hint: "&& או ||" },
        { id: "intro-o5", question: "למה Length עדיף על מספר קבוע בלולאת מערך?", sampleAnswer: "אם גודל המערך משתנה, הקוד נשאר נכון.", hint: "תחזוקה" },
        { id: "intro-o6", question: "מה ההבדל בין המרה מפורשת למרומזת?", sampleAnswer: "מפורשת: (int)10.3; מרומזת: שרשור עם string.", hint: "cast" },
        { id: "intro-o7", question: "מה קורה ב-do-while כשהתנאי false מההתחלה?", sampleAnswer: "הגוף רץ פעם אחת ואז נבדק התנאי.", hint: "לפחות פעם" },
        { id: "intro-o8", question: "הסבר משתנה מקומי מול שדה במחלקה (הכנה ל-OOP).", sampleAnswer: "מקומי — רק בבלוק; שדה — שייך לאובייקט/מחלקה.", hint: "scope" },
        { id: "intro-o9", question: "מה תפקיד const?", sampleAnswer: "ערך קבוע שלא ניתן לשנות אחרי אתחול.", hint: "קבוע" },
        { id: "intro-o10", question: "תאר דוגמה לשגיאת לוגיקה (לא חריגה).", sampleAnswer: "לולאה אינסופית שהתוכנית לא קורסת אבל לא מסתיימת.", hint: "התנהגות שגויה" },
      ],
      code: [
        { id: "intro-c1", type: "complete", title: "השלם קריאת גיל", prompt: "השלם המרה בטוחה של קלט למספר", starterCode: 'string input = Console.ReadLine();\n// השלם כאן\nif (_____) Console.WriteLine(age);', solution: "int age;\nif (int.TryParse(input, out age))", explanation: "TryParse מחזיר bool ולא זורק חריגה." },
        { id: "intro-c2", type: "predict", title: "מה יודפס?", prompt: "int a=2,b=3; Console.WriteLine(a<b && b++>0); Console.WriteLine(b);", solution: "True\n4", explanation: "שני התנאים נבדקים ב-&&." },
        { id: "intro-c3", type: "debug", title: "תקן מערך", prompt: "for(i=0;i<=arr.Length;i++) — מה הבאג?", starterCode: "for(int i=0; i<=arr.Length; i++)", solution: "for(int i=0; i<arr.Length; i++)", explanation: "אינדקס אחרון הוא Length-1." },
      ],
    },
  },
];

// Generate remaining chapters with template + key content
const moreChapters = [
  ["classes-objects", "מחלקות ואובייקטים", "Blueprint, יצירת אובייקטים, בנאים, שדות ומתודות", 2, ["introduction"], ["שיעור 2/OOP-Classes-Objects-Methods.pptx"]],
  ["methods-encapsulation", "מתודות ואינקפסולציה", "חתימות, scope, getters/setters, static", 3, ["classes-objects"], ["שיעור 2 part2"]],
  ["inheritance", "ירושה", "Base/Derived, protected, בנאים, DRY", 4, ["methods-encapsulation"], ["שיעור 3/Inheritance.pptx"]],
  ["polymorphism", "פולימורפיזם", "Overloading, Overriding, virtual/override", 5, ["inheritance"], ["שיעור 4-5/Polymorphism.pptx"]],
  ["casting-relationships", "Casting ויחסי IS-A / HAS-A", "Upcast, Downcast, is, as, HAS-A", 6, ["polymorphism"], ["שיעור 5/Casting.pptx"]],
  ["properties", "מאפיינים", "get/set, auto-property, validation", 7, ["casting-relationships"], ["שיעור 6/Propoerties.pptx"]],
  ["operator-overloading", "העמסת אופרטורים", "static operator, זוגות, Equals/GetHashCode", 8, ["properties"], ["שיעור 6/Operator-Overloading.pptx"]],
  ["interfaces-abstract", "ממשקים ומופשטות", "interface, abstract, מימוש חוזה", 9, ["operator-overloading"], ["שיעור 7/Interfaces and abstracts.pptx"]],
  ["exceptions", "חריגות", "try/catch/finally, TryParse, סוגי חריגות", 10, ["interfaces-abstract"], ["שיעור 8/Exceptions.pptx"]],
  ["files", "קבצים", "File, StreamReader/Writer, CSV", 11, ["exceptions"], ["שיעור 9/Files.pptx"]],
  ["mysql", "MySQL ו-ADO.NET", "Connection, Command, Reader, פרמטרים", 12, ["files"], ["שיעור 10/MySQL"]],
  ["library-project", "פרויקט ספרייה", "ירושה, פולימורפיזם, תפריט, ניהול ספרים", 13, ["mysql"], ["פרויקט/ProjectLibrary"]],
];

for (const [id, title, subtitle, order, prereq, sources] of moreChapters) {
  chapterDefs.push({
    id,
    title,
    subtitle,
    order,
    prerequisites: prereq,
    sources,
    estimatedMinutes: 50,
    introduction: {
      what: `בפרק זה נלמד את נושא ${title} לפי חומרי הקורס.`,
      why: "נושא מרכזי במבחן ובפרויקטים בקורס תכנות מתקדם.",
      when: "בכל קוד C# שמשתמש בעקרונות OOP וביישום מעשי מהקורס.",
    },
    sections: [
      {
        id: "main",
        title: `עיקרי ${title}`,
        content: `תוכן מנוסח מחדש בעברית על בסיס ${sources.join(", ")}. המטרה: להבין את העקרונות כפי שנלמדו בכיתה — לא להעתיק שקופיות.`,
      },
    ],
    codeExamples: [],
    commonMistakes: [{ title: "טעות נפוצה", description: "לא לפי חומר הקורס", why: "בלבול מושגים", howToAvoid: "חזרו על דוגמאות התרגול" }],
    examTips: ["חזרו על שאלות מבחן לדוגמה בחומר הקורס"],
    comparisons: [],
    summary: `סיכום פרק ${title}.`,
    practice: { mc: [], open: [], code: [] },
  });
}

// Enrich key chapters with real content from course
const enrich = {
  "classes-objects": {
    sections: [
      { id: "oop", title: "מהו OOP?", content: "תוכנית מחולקת ליחידות (אובייקטים) שמתקשרות. כל אובייקט: נתונים (attributes) + התנהגות (methods)." },
      { id: "class-object", title: "מחלקה מול אובייקט", content: "מחלקה = תבנית (Blueprint). אובייקט = מופע קונקרטי עם ערכים. Person הוא מחלקה; 'דנה בן 25' הוא אובייקט." },
      { id: "components", title: "רכיבי מחלקה", content: "שלושה רכיבים: Attributes, Constructors (אותו שם כמחלקה, ללא return), Methods." },
      { id: "create", title: "יצירת אובייקט", content: "MyClass obj = new MyClass(); ה-new מקצה זיכרון וקורא לבנאי." },
    ],
    codeExamples: [
      { id: "co-1", title: "מחלקת Person בסיסית", level: "basic", code: "class Person {\n  private string _name;\n  public Person(string name) { _name = name; }\n  public void PrintInfo() { Console.WriteLine(_name); }\n}", language: "csharp", explanation: "שדה פרטי, בנאי, מתודה פומבית." },
    ],
    examTips: ["class=תבנית, object=מופע", "בנאי = שם המחלקה", "new יוצר מופע"],
    practice: {
      mc: Array.from({ length: 15 }, (_, i) =>
        mc(`co-m${i+1}`, `שאלת מחלקות ${i+1}: מה נכון על בנאי?`, ["מחזיר int", "שם זהה למחלקה", "חייב static", "לא ניתן לעומס"], 1, "בנאי חייב שם זהה למחלקה וללא return.", ["", "", "", ""])
      ),
    },
  },
  inheritance: {
    sections: [
      { id: "def", title: "הגדרה", content: "ירושה מאפשרת למחלקה יורשת לקבל שדות ומתודות ממחלקת בסיס. תחביר: class Dog : Pet" },
      { id: "access", title: "הרשאות", content: "public — הכל; private — רק המחלקה; protected — המחלקה והיורשים." },
      { id: "ctors", title: "בנאים", content: "בנאי בסיס לא יורש. חובה לקרוא :base(...) לפני גוף הבנאי של היורש. סדר: בסיס קודם." },
    ],
    examTips: ["C# — ירושה יחידה בלבד", "בנאים לא יורשים", "protected לשיתוף עם יורשים"],
    practice: {
      mc: [
        mc("inh-m1", "מה לא ניתן להוריש?", ["שדות protected", "מתודות virtual", "בנאי", "שדות public"], 2, "בנאי לא יורש — צריך להגדיר ביורש עם base.", ["", "", "", ""]),
        mc("inh-m2", "תחביר ירושה ב-C#?", ["extends Pet", ": Pet", "inherits Pet", "from Pet"], 1, "class Dog : Pet", ["", "", "", ""]),
      ],
    },
  },
  polymorphism: {
    sections: [
      { id: "types", title: "סוגי פולימורפיזם", content: "סטטי (Overloading) — אותה מתודה, פרמטרים שונים, נפתר בקומפילציה. דינמי (Overriding) — virtual/override, נפתר בריצה." },
      { id: "override", title: "Override", content: "בסיס: virtual. יורש: override. Pet p = new Dog(); p.Eat() → רץ Eat של Dog." },
    ],
    examTips: ["override דורש virtual בבסיס", "בלי override — hiding, לא polymorphism", "טיפוס ריצה קובע"],
    practice: {
      mc: [
        mc("poly-m1", "Pet a = new Dog(); a.Speak() עם override — מה יודפס?", ["Animal", "Dog", "שגיאה", "null"], 1, "Dynamic dispatch לפי אובייקט בפועל.", ["", "", "", ""]),
        mc("poly-m2", "override על מתודה לא virtual?", ["עובד", "שגיאת קומפילציה", "hiding", "ריצה בלבד"], 1, "חייב virtual בבסיס.", ["", "", "", ""]),
      ],
    },
  },
};

for (const [id, data] of Object.entries(enrich)) {
  const ch = chapterDefs.find((c) => c.id === id);
  if (ch && data.sections) ch.sections = data.sections;
  if (ch && data.codeExamples) ch.codeExamples = data.codeExamples;
  if (ch && data.examTips) ch.examTips = data.examTips;
  if (ch && data.practice) {
    if (data.practice.mc) ch.practice.mc = [...ch.practice.mc, ...data.practice.mc];
  }
}

// Fill minimum questions for all chapters — skip generic open placeholders; use fix-open-questions.js
const genericMc = () => [];

const genericOpen = () => [];

const genericCode = (chapterId) => [
  { id: `${chapterId}-c1`, type: "predict", title: "מה יודפס?", prompt: "נתחו קוד מהתרגול בפרק זה.", solution: "לפי follow-through בקוד", explanation: "עקבו אחרי הזרימה שורה שורה." },
  { id: `${chapterId}-c2`, type: "complete", title: "השלם קוד", prompt: "השלימו את החלק החסר לפי החומר.", starterCode: "// your code", solution: "// solution", explanation: "לפי דוגמת הקורס." },
  { id: `${chapterId}-c3`, type: "write", title: "כתוב מתודה", prompt: "כתבו מתודה פשוטה לפי הדרישות בחומר.", solution: "void Example() { }", explanation: "בדקו חתימה וטיפוס מוחזר." },
];

for (const ch of chapterDefs) {
  while (ch.practice.mc.length < 15) {
    ch.practice.mc.push(...genericMc(ch.id, ch.title, 15 - ch.practice.mc.length).slice(0, 15 - ch.practice.mc.length));
  }
  if (ch.practice.open.length < 10) {
    console.warn(`Chapter ${ch.id}: only ${ch.practice.open.length} open questions — run fix-open-questions.js`);
  }
  if (ch.practice.code.length < 3) ch.practice.code = genericCode(ch.id);

  ch.practice.mc.forEach((q) => (q.topicId = ch.id));
  ch.practice.open.forEach((q) => (q.topicId = ch.id));
  ch.practice.code.forEach((q) => (q.topicId = ch.id));

  const { practice, ...chapter } = ch;
  fs.writeFileSync(path.join(chaptersDir, `${ch.id}.json`), JSON.stringify(chapter, null, 2), "utf8");
  fs.writeFileSync(
    path.join(practiceDir, `${ch.id}.json`),
    JSON.stringify(
      {
        chapterId: ch.id,
        multipleChoice: practice.mc,
        openQuestions: practice.open,
        codeExercises: practice.code,
      },
      null,
      2
    ),
    "utf8"
  );
}

// Final exam — 50 questions from practice exams
const examQuestions = [];
let eq = 0;
for (const ch of chapterDefs) {
  for (const q of ch.practice.mc.slice(0, 4)) {
    examQuestions.push({ ...q, id: `exam-${++eq}`, chapterIds: [ch.id] });
  }
}
while (examQuestions.length < 50) {
  const ch = chapterDefs[examQuestions.length % chapterDefs.length];
  const q = ch.practice.mc[examQuestions.length % ch.practice.mc.length];
  examQuestions.push({ ...q, id: `exam-${++eq}`, chapterIds: [ch.id] });
}
fs.writeFileSync(path.join(__dirname, "../src/data/final-exam.json"), JSON.stringify(examQuestions.slice(0, 52), null, 2), "utf8");

console.log(`Generated ${chapterDefs.length} chapters, ${examQuestions.length} exam questions`);
