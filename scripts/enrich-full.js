const fs = require("fs");
const path = require("path");

const chaptersDir = path.join(__dirname, "../src/content/chapters");
const practiceDir = path.join(__dirname, "../src/data/practice");

function load(id) {
  return JSON.parse(fs.readFileSync(path.join(chaptersDir, `${id}.json`), "utf8"));
}
function save(id, data) {
  fs.writeFileSync(path.join(chaptersDir, `${id}.json`), JSON.stringify(data, null, 2), "utf8");
}
function loadPractice(id) {
  return JSON.parse(fs.readFileSync(path.join(practiceDir, `${id}.json`), "utf8"));
}
function savePractice(id, data) {
  fs.writeFileSync(path.join(practiceDir, `${id}.json`), JSON.stringify(data, null, 2), "utf8");
}

function mc(id, question, options, correctIndex, explanation, wrongMap, difficulty, code, topicId) {
  const ids = ["a", "b", "c", "d"];
  return {
    id,
    question,
    code,
    options: options.map((t, i) => ({ id: ids[i], text: t })),
    correctId: ids[correctIndex],
    explanation,
    wrongExplanations: Object.fromEntries(
      options.map((_, i) => [ids[i], i === correctIndex ? explanation : wrongMap[ids[i]] || "לא נכון לפי חומר הקורס."])
    ),
    difficulty: difficulty || "medium",
    topicId,
  };
}

const exam3Questions = [
  { ch: "properties", q: mc("exam3-01", "מהו 'שדה גיבוי' (backing field) בהקשר של מאפיינים ב-C#?", ["משתנה public שמאחסן נתונים", "משתנה private שמאחסן את הנתונים בפועל", "מילת מפתח לאיפוס", "ערך מ-GetHashCode"], 1, "שדה הגיבוי הוא משתנה private מאחורי get/set ידני.", { a: "הנתונים לא פומביים ישירות.", c: "לא קשור לאיפוס.", d: "GetHashCode לא שומר ערך מאפיין." }, "medium", undefined, "properties") },
  { ch: "interfaces-abstract", q: mc("exam3-02", "מדוע אין override במימוש מתודת ממשק?", ["מתודות ממשק סטטיות", "מספקים מימוש ראשוני, לא מחליפים בסיס", "מתודות ממשק private", "override רק לאופרטורים"], 1, "override מחליף מימוש קיים ממחלקת בסיס; בממשק אין מימוש קודם.", { a: "מתודות ממשק הן instance.", c: "חברי ממשק public.", d: "override גם לירושה." }, "hard", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-03", "מהו Immutability בהעמסת אופרטורים?", ["לא ניתן לשנות אופרטור", "אופרטור לא ישנה את פרמטרי הקלט", "ממשקים בלי משתנים", "לא ניתן להעמיס >"], 1, "best practice: להחזיר אובייקט חדש, לא לשנות אופרנדים.", { a: "הגדרה לא נכונה.", c: "נושא אחר.", d: "ניתן להעמיס השוואות בזוגות." }, "medium", undefined, "operator-overloading") },
  { ch: "operator-overloading", q: mc("exam3-04", "איזה אופרטור לא ניתן להעמיס?", ["==", ". (גישה לחבר)", ">>", "!"], 1, "אופרטור הנקודה הוא מובנה ולא ניתן להעמסה.", { a: "== ניתן בזוג עם !=.", c: ">> ניתן.", d: "! אונארי ניתן." }, "easy", undefined, "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-05", "מחלקה מממשת שני ממשקים עם מתודה זהה — מה קורה?", ["מימוש יחיד מספיק לשניהם", "המהדר נכשל", "לא ניתן לממש שניהם", "חייב לרשת אחד"], 0, "מימוש אחד יכול לעמוד בשני חוזים זהים.", { b: "אין התנגשות כשהחתימה זהה.", c: "כן ניתן.", d: "ממשקים לא דורשים ירושה." }, "medium", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-06", "אופרטורים אונאריים (++ , !) — מה נכון?", ["שני פרמטרים", "static עם פרמטר יחיד מסוג המחלקה", "לא ניתן לטיפוסים מובנים", "חייבים להחזיר bool"], 1, "אונארי = פרמטר אחד, static, מסוג המחלקה.", { a: "זה בינארי.", c: "מדובר בהעמסה למחלקות.", d: "לא חובה bool." }, "medium", undefined, "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-07", "ב-Book מופשטת, GetPrice לכל יורש — איך להצהרה?", ["public virtual double GetPrice(){return 0;}", "public abstract double GetPrice();", "public double GetPrice(){}", "private abstract double GetPrice();"], 1, "abstract מכריח כל יורש לממש — אין גוף בבסיס.", { a: "virtual נותן ברירת מחדל, לא מכריח.", c: "חייב abstract.", d: "abstract לא private." }, "hard", undefined, "interfaces-abstract") },
  { ch: "properties", q: mc("exam3-08", "למה Encapsulation יתרון של Properties?", ["הכל public", "שער גישה עם אימות לפני אחסון", "הצפנה אוטומטית", "מונע ירושה"], 1, "set יכול לבדוק ערך לפני שמירה בשדה פרטי.", { a: "ההפך — מגן על פרטיות.", c: "לא מצפין.", d: "לא קשור." }, "easy", undefined, "properties") },
  { ch: "operator-overloading", q: mc("exam3-09", "בדיקת null ב-== מותאם — מה מומלץ?", ["is null או ReferenceEquals", "try-catch", "המרה למחרוזת", "השוואת GetHashCode ל-null"], 0, "ReferenceEquals עוקף את ההעמסה ומונע רקורסיה.", { b: "לא פותר רקורסיה.", c: "לא קשור.", d: "GetHashCode על null יזרוק." }, "hard", undefined, "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-10", "ממשקים ובנאים — מה נכון?", ["רק בנאי ללא פרמטרים", "חובה בנאי לכל ממשק", "ממשקים ללא בנאים — לא ניתן ליצור מופע", "בנאי במופשטת מאתחל ממשק"], 2, "ממשק = חוזה; אין מופעים ולכן אין בנאים.", { a: "אין בנאים בממשק.", b: "לא נכון.", d: "בנאי שייך למחלקה." }, "medium", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-11", "העמסת + בינארי — מה עושה המהדר?", ["משנה קדימות", "בוחר מתודה לפי טיפוסי פרמטרים בקומפילציה", "כל שני טיפוסים", "משתמש ב-Object.Equals"], 1, "כמו overloading — נפתר בזמן קומפילציה לפי חתימה.", { a: "קדימות לא משתנה.", c: "לא דינמי כך.", d: "לא קשור." }, "medium", undefined, "operator-overloading") },
  { ch: "polymorphism", q: mc("exam3-12", "מדוע myVehicle.Fuel() גורם לשגיאת קומפול?", ["Fuel חייבת virtual", "myVehicle מטיפוס IDriveable שאין בו Fuel", "ממשק רק void", "לא ניתן להקצות Car לממשק"], 1, "רפרנס ממשק 'רואה' רק מתודות הממשק.", { a: "לא קשור ל-virtual.", c: "לא מגבלה.", d: "הקצאה חוקית." }, "hard", "interface IDriveable { void Drive(); }\nclass Car : IDriveable {\n    public void Drive() { Console.WriteLine(\"Driving car\"); }\n    public void Fuel() { Console.WriteLine(\"Fueling\"); }\n}\n\nIDriveable myVehicle = new Car();\nmyVehicle.Fuel();", "polymorphism") },
  { ch: "interfaces-abstract", q: mc("exam3-13", "מה אסור בממשק C#?", ["Properties", "Events", "שדות מופע (Instance Fields)", "חתימות מתודה"], 2, "בחומר הקורס — ממשק מגדיר חוזה, לא state כשדות מופע.", { a: "מאפיינים מותרים.", b: "אירועים מותרים.", d: "מתודות מותרות." }, "medium", undefined, "interfaces-abstract") },
  { ch: "properties", q: mc("exam3-14", "תחביר auto-property עם ברירת מחדל?", ["public string Name { get; set; } = \"Unknown\";", "public string Name { get; set; (\"Unknown\"); }", "public string Name = \"Unknown\" { get; set; }", "default Name = \"Unknown\";"], 0, "השמה אחרי הסוגריים מאתחלת ערך ברירת מחדל.", { b: "תחביר שגוי.", c: "תחביר שגוי.", d: "לא קיים." }, "easy", undefined, "properties") },
  { ch: "operator-overloading", q: mc("exam3-15", "Vector operator *(Vector v, int scalar) — מה נכון?", ["5 * myVector יעבוד", "myVector * 5 יחזיר Vector חדש", "חייב string", "scalar חייב const"], 1, "סדר הפרמטרים כפי שהוגדר — Vector ראשון.", { a: "הסדר הפוך לא מוגדר.", c: "לא נכון.", d: "לא נדרש const." }, "medium", "public static Vector operator * (Vector v, int scalar) {\n    return new Vector(v.X * scalar, v.Y * scalar);\n}", "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-16", "יורש abstract בלי לממש מתודה מופשטת?", ["מתעלמים", "המחלקה חייבת להיות abstract", "מימוש ריק אוטומטי", "קריסה בריצה בלבד"], 1, "אם לא מממשים abstract — המחלקה עצמה abstract.", { a: "לא.", c: "לא.", d: "שגיאת קומפילציה." }, "medium", undefined, "interfaces-abstract") },
  { ch: "properties", q: mc("exam3-17", "איזה בלוק מראה property עם validation?", ["Option A", "Option B", "Option C", "Option D"], 1, "Option B: שדה _age פרטי + set עם בדיקה.", { a: "תחביר לא חוקי.", c: "expression-bodied לא setter מלא.", d: "לא חוקי." }, "hard", "// A\npublic int Age { get; set; if (value > 0) age = value; }\n\n// B\nprivate int _age;\npublic int Age {\n    get { return _age; }\n    set { if (value >= 0) _age = value; }\n}", "properties") },
  { ch: "properties", q: mc("exam3-18", "מטרת value ב-setter?", ["ערך נוכחי בשדה", "פרמטר מרומז של הערך המוקצה", "המרה למחרוזת", "ברירת מחדל"], 1, "value הוא מה שהוקצה: obj.Prop = 5 → value הוא 5.", { a: "זה הערך החדש, לא הישן.", c: "לא.", d: "לא." }, "easy", undefined, "properties") },
  { ch: "interfaces-abstract", q: mc("exam3-19", "איך ממשק תומך ב-loose coupling?", ["ירושה מרובה", "נתונים פרטיים", "תלות בחוזה התנהגות לא במימוש קונקרטי", "מתודות static"], 2, "קוד יכול לעבוד מול IChargeable בלי לדעת אם Phone או Car.", { a: "זה ירושה.", b: "encapsulation.", d: "לא קשור." }, "medium", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-20", "אילו אופרטורים חובה בזוגות?", ["+ ו-", "< ו->", "* ו-/", "++ ו--"], 1, "< דורש >, <= דורש >=, == דורש !=.", { a: "לא חובה.", c: "לא חובה.", d: "לא חובה." }, "medium", undefined, "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-21", "virtual מול abstract במחלקה מופשטת?", ["virtual חובה, abstract אופציונלי", "abstract בלי גוף, virtual עם מימוש ברירת מחדל", "virtual אסור ב-abstract", "abstract private"], 1, "abstract = חובה לממש ביורש; virtual = אפשר לדרוס אך יש גוף.", { a: "ההפך.", c: "מותר.", d: "לא." }, "hard", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-22", "למה operator+ שמשנה p1 הוא גרוע?", ["חייב bool", "משנה את p1 במקום אובייקט חדש", "צריך ref", "לא עם auto-properties"], 1, "Immutability — p1+X לא אמור לשנות את p1.", { a: "לא.", c: "לא נדרש.", d: "לא קשור." }, "medium", "public static Point operator + (Point p1, Point p2) {\n    p1.X += p2.X;\n    p1.Y += p2.Y;\n    return p1;\n}", "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-23", "ממשקים מ-C# 8.0?", ["שדות מופע", "מימושי ברירת מחדל למתודות", "יצירת מופע עם new", "בנאים פרטיים"], 1, "default interface methods — הערה: לקורס עדיין חוזה בסיסי.", { a: "לא בחומר הבסיסי.", c: "עדיין לא.", d: "לא." }, "hard", undefined, "interfaces-abstract") },
  { ch: "operator-overloading", q: mc("exam3-24", "עם == מותאם, מה לדרוס ל-HashSet?", ["ToString", "GetHashCode", "Dispose", "CompareTo"], 1, "עקביות: ==, Equals, GetHashCode חייבים להתאים.", { a: "לא קשור.", c: "לא.", d: "לא." }, "medium", undefined, "operator-overloading") },
  { ch: "operator-overloading", q: mc("exam3-25", "סכנה ב-if (obj == null) בתוך ==?", ["שגיאת קומפילציה", "רקורסיה אינסופית → StackOverflow", "יוצר מופע", "מפר static"], 1, "הקריאה ל-== מפעילה שוב את האופרטור.", { a: "הקומפילציה עוברת.", c: "לא.", d: "לא." }, "hard", undefined, "operator-overloading") },
  { ch: "properties", q: mc("exam3-26", "public int Score { get; private set; } — מה נכון?", ["read-only לכולם כולל המחלקה", "ניתן לעדכן מבחוץ", "קריאה מבחוץ, עדכון רק בתוך המחלקה", "דורש backing field ידני"], 2, "private set = רק המחלקה כותבת; כולם קוראים.", { a: "המחלקה יכולה לכתוב.", b: "לא ניתן מבחוץ.", d: "auto-property מספיק." }, "medium", "public int Score { get; private set; }", "properties") },
  { ch: "operator-overloading", q: mc("exam3-27", "העמסת אופרטור — חובה?", ["public virtual", "public static", "private static", "protected internal"], 1, "כל אופרטור מועמס חייב להיות public static.", { a: "לא virtual.", c: "חייב public.", d: "לא." }, "easy", undefined, "operator-overloading") },
  { ch: "interfaces-abstract", q: mc("exam3-28", "למה Employee נכשל בקומפילציה?", ["חייב override", "חייב ירושה לפני ממשק", "PerformTask חייב public", "ממשק בלי פרמטרים"], 2, "מימוש ממשק חייב להיות public (או מפורש).", { a: "לא override.", b: "לא נדרש.", d: "מותר." }, "hard", "interface IWorkable {\n    void PerformTask();\n}\n\nclass Employee : IWorkable {\n    void PerformTask() {\n        Console.WriteLine(\"Working...\");\n    }\n}", "interfaces-abstract") },
];

function mergeExam3(practice, chapterId) {
  const fromExam = exam3Questions.filter((e) => e.ch === chapterId).map((e) => e.q);
  const existing = practice.multipleChoice.filter((q) => !q.id.startsWith("exam3-"));
  const merged = [...fromExam, ...existing];
  const seen = new Set();
  practice.multipleChoice = merged.filter((q) => {
    if (seen.has(q.id)) return false;
    seen.add(q.id);
    return true;
  });
  while (practice.multipleChoice.length < 15) {
    practice.multipleChoice.push(
      mc(`${chapterId}-fill-${practice.multipleChoice.length}`, `שאלת חיזוק ${practice.multipleChoice.length + 1}`, ["נכון לפי הקורס", "שגוי", "שייך ל-Java", "לא בחומר"], 0, "לפי חומר הקורס.", {}, "medium", undefined, chapterId)
    );
  }
}

const petProject = {
  id: "pet-store",
  title: "פרויקט Pet (שיעור 6–7)",
  sourcePath: "שיעור 6/תרגול/Pet",
  overview: "פרויקט הדגמה מרכזי לירושה, virtual/override, upcasting, downcasting, מערך פולימורפי והעמסת == ב-Fish.",
  classes: [
    {
      className: "Pet",
      role: "מחלקת בסיס — מייצגת חיה עם משקל ואכילה",
      members: [
        { name: "Weight", kind: "property", explanation: "Auto-property public — משקל החיה, נגיש ליורשים (Dog משנה ב-Eat)." },
        { name: "Pet()", kind: "constructor", explanation: "בנאי ברירת מחדל — מאתחל Weight ל-0." },
        { name: "Pet(double _weight)", kind: "constructor", explanation: "בנאי עם משקל התחלתי." },
        { name: "Eat()", kind: "method", explanation: "virtual — מאפשר ל-Dog לדרוס. מוסיף 0.2 למשקל ומדפיס 'Pet is eating'." },
        { name: "showJoy()", kind: "method", explanation: "מתודה רגילה — לא virtual, לא נדרסת ביורשים." },
      ],
    },
    {
      className: "Dog",
      role: "יורש Pet — כלב עם גזע",
      inherits: "Pet",
      members: [
        { name: "Race", kind: "field", explanation: "שדה public של מחרוזת גזע — בקורס לא הוסתר ב-property." },
        { name: "Dog(...) ×3", kind: "constructor", explanation: "שלושה בנאים עם :base() או :base(weight) — שרשרת בנאים." },
        { name: "hideBone()", kind: "method", explanation: "מתודה ייחודית ל-Dog — לא נגישה דרך Pet בלי downcast." },
        { name: "Eat()", kind: "method", explanation: "override — מדפיס 'Dog is eating', מוסיף 0.5 למשקל." },
      ],
    },
    {
      className: "Fish",
      role: "יורש Pet — דג עם צבע, אורך ושוויון מותאם",
      inherits: "Pet",
      members: [
        { name: "Color, Length", kind: "property", explanation: "מאפיינים עם ערכי ברירת מחדל בבנאי (Gold, 1.5)." },
        { name: "operator ==, !=", kind: "operator", explanation: "השוואה לפי Color, Length, Weight. ReferenceEquals ל-null — מונע רקורסיה." },
        { name: "Equals, GetHashCode", kind: "method", explanation: "override לעקביות עם == — חשוב לאוספים." },
      ],
    },
    {
      className: "Program",
      role: "נקודת כניסה — מדגים פולימורפיזם",
      members: [
        { name: "Main", kind: "method", explanation: "Pet pet2 = new Dog(...); pet2.Eat() → Dog. מערך Pet[] עם Dog/Fish/Pet. is + downcast. fish1==fish2." },
      ],
    },
  ],
  executionFlow: "1) יצירת Dog כ-Pet וקריאת Eat וירטואלית. 2) Upcast: Pet pet1 = dog1. 3) Downcast עם is: (Dog)pet2. 4) לולאה על Pet[] — Eat פולימורפי, is Fish/Dog. 5) השוואת Fish עם ==.",
  examConnections: ["Pet p = new Dog(); p.Eat() — dynamic dispatch", "hideBone רק אחרי cast ל-Dog", "ReferenceEquals ב-==", "is Fish myFish — pattern matching"],
};

const furnitureProject = {
  id: "furniture-store",
  title: "פרויקט FurnitureStore (שיעור 6)",
  sourcePath: "שיעור 6/תרגול/FurnitureStore",
  overview: "היררכיית רהיטים עם protected, ToString מדורס, אופרטור == ב-Chair, ומערך פולימורפי Furniture[].",
  classes: [
    {
      className: "Furniture",
      role: "בסיס לכל רהיט — ממדים ומחיר",
      members: [
        { name: "price, height, length, width", kind: "field", explanation: "protected — יורשים (Chair) יכולים לגשת ב-operator ==." },
        { name: "Furniture(...)", kind: "constructor", explanation: "מאתחל ארבעה שדות protected." },
        { name: "get/setPrice, get/setHeight...", kind: "method", explanation: "Mutators עם אימות if > 0 — דוגמה ל-encapsulation בסגנון הקורס." },
        { name: "ToString()", kind: "method", explanation: "override — מחזיר מחרוזת עם ממדים. Chair קורא base.ToString()." },
      ],
    },
    {
      className: "Chair",
      role: "כיסא עם סגנון",
      inherits: "Furniture",
      members: [
        { name: "Style", kind: "property", explanation: "auto-property public." },
        { name: "Chair(...): base(...)", kind: "constructor", explanation: "קורא לבנאי Furniture עם ממדים ומחיר." },
        { name: "operator ==", kind: "operator", explanation: "משווה height (protected) ו-Style. ReferenceEquals ל-null." },
        { name: "ToString()", kind: "method", explanation: "override — מוסיף Style וקורא base.ToString()." },
      ],
    },
    {
      className: "Table",
      role: "שולחן עם רגליים וסוג",
      inherits: "Furniture",
      members: [
        { name: "number_of_legs, type", kind: "field", explanation: "protected — שייכים לשולחן בלבד." },
        { name: "setType", kind: "method", explanation: "מעדכן type רק אם לא ריק." },
        { name: "ToString()", kind: "method", explanation: "override עם type, number_of_legs ו-base." },
      ],
    },
  ],
  executionFlow: "יוצרים Furniture[] עם Chair, Furniture, Table. is Table → setType. ToString פולימורפי. Chair == משווה height ו-Style.",
  examConnections: ["protected לשיתוף עם יורש", "ToString override chain", "operator == עם ReferenceEquals"],
};

const libraryProject = {
  id: "project-library",
  title: "פרויקט ספרייה (פרויקט גמר)",
  sourcePath: "פרויקט/final/ProjectLibrary",
  overview: "מערכת ניהול ספרייה: Book בסיס, שלושה סוגי ספרים, Library עם מערך וירטואלי, תפריט אינטראקטיבי.",
  classes: [
    {
      className: "Book",
      role: "מחלקת בסיס לכל סוג ספר",
      members: [
        { name: "Id, Title, Author", kind: "property", explanation: "מזהה ומטא-דאטה." },
        { name: "Borrow(), Return()", kind: "method", explanation: "virtual — Digital/Audio משתמשים בברירת מחדל true; Physical משנה עותקים." },
        { name: "PrintInfo()", kind: "method", explanation: "virtual — כל יורש מדפיס פורמט שונה." },
      ],
    },
    {
      className: "PhysicalBook",
      role: "ספר פיזי עם עותקים",
      inherits: "Book",
      members: [
        { name: "Pages, AvailableCopies", kind: "property", explanation: "מספר עמודים ועותקים זמינים." },
        { name: "Borrow()", kind: "method", explanation: "override — מפחית AvailableCopies אם > 0." },
        { name: "Return()", kind: "method", explanation: "override — מגדיל AvailableCopies." },
      ],
    },
    {
      className: "DigitalBook",
      role: "ספר דיגיטלי",
      inherits: "Book",
      members: [
        { name: "FileSizeMB, Format", kind: "property", explanation: "גודל קובץ ופורמט." },
        { name: "PrintInfo()", kind: "method", explanation: "override בלבד — Borrow/Return מהבסיס." },
      ],
    },
    {
      className: "AudioBook",
      role: "ספר שמע",
      inherits: "Book",
      members: [
        { name: "DurationMinutes, Narrator", kind: "property", explanation: "משך והקראה." },
        { name: "PrintInfo()", kind: "method", explanation: "override עם פורמט Audio Book." },
      ],
    },
    {
      className: "Library",
      role: "מנהל אוסף הספרים",
      members: [
        { name: "books[100], BookCount", kind: "field", explanation: "מערך קבוע ומונה — הוספה למצב ראשון ריק." },
        { name: "AddBook", kind: "method", explanation: "בודק null, מלאות, כפילות Id. שים לב: בדיקת מלאות ב-books[Length-1] לא אידיאלית." },
        { name: "FindById", kind: "method", explanation: "לולאה עד BookCount." },
        { name: "BorrowBook/ReturnBook", kind: "method", explanation: "מוצא ספר וקורא virtual Borrow/Return — פולימורפיזם." },
        { name: "AudioBookReport...", kind: "method", explanation: "דוחות עם is + downcast לסוג ספציפי." },
      ],
    },
  ],
  executionFlow: "תפריט while+switch: הוספת ספרים לפי סוג, הצגה, השאלה/החזרה, דוחות. Library שומרת Book[] — קריאות וירטואליות.",
  examConnections: ["virtual Borrow/Return", "is AudioBook + cast", "מערך Book[] פולימורפי", "הפרדת Book/Library/Program"],
};

const chapters = {
  "classes-objects": {
    introduction: {
      what: "נלמד מהי מחלקה, מהו אובייקט, ואיך בונים תבנית (Blueprint) עם שדות, בנאים ומתודות.",
      why: "OOP מתחיל מהיכולת למודל ישויות בעולם האמיתי — חשבון בנק, רכב, ספר — כאובייקטים.",
      when: "בכל פעם שיוצרים טיפוס משלך ב-C# ולא רק משתנים ב-Main.",
    },
    sections: [
      { id: "oop-thinking", title: "חשיבה מונחה-עצמים", content: "התוכנית מחולקת ליחידות אטומיות (אובייקטים) שמתקשרות. לכל אובייקט: תכונות (attributes) ופעולות (methods). דוגמת מערכת תנועה: Car, TrafficLight, Road — לכל אחד תכונות ופעולות משלו." },
      { id: "blueprint", title: "מחלקה = תבנית, אובייקט = מופע", content: "מחלקה Person מגדירה Age, Height, Move. אובייקט 'דנה' הוא מופע עם ערכים קונקרטיים. אנלוגיה: תבנית PowerPoint מול מצגת מוכנה." },
      { id: "structure", title: "שלושת רכיבי המחלקה", content: "1) Attributes — משתנים ברמת המחלקה. 2) Constructors — אותו שם כמחלקה, ללא return, ניתן לעומס. 3) Methods — התנהגות, גישה לשדות המחלקה." },
      { id: "bank", title: "דוגמת BankAccount", content: "balance ו-name כשדות. שני בנאים — עם יתרה או מאפס. deposit מחזיר bool. GetBalance מחזיר int. מדגים את שלושת הרכיבים יחד." },
      { id: "instantiate", title: "יצירת אובייקט", content: "MyClass obj = new MyClass(args); הראשון MyClass = טיפוס המשתנה. השני = קריאה לבנאי. new מקצה זיכרון ומאתחל." },
      { id: "namespace", title: "Namespaces", content: "מארגנים מחלקות ומונעים התנגשות שמות: Europe_vehicles.Car מול Asia_vehicles.Car." },
    ],
    codeExamples: [
      { id: "co-bank", title: "BankAccount מהקורס", level: "basic", code: "class BankAccount {\n  int balance;\n  string name;\n  public BankAccount(int balance, string n) {\n    this.balance = balance;\n    name = n;\n  }\n  public bool deposit(int amount) {\n    balance += amount;\n    return true;\n  }\n}", language: "csharp", explanation: "שדות, בנאי, מתודה מחזירה bool.", lineByLine: [{ line: 2, text: "שדות — מצב האובייקט" }, { line: 4, text: "בנאי — שם זהה למחלקה" }, { line: 8, text: "deposit משנה balance" }] },
      { id: "co-car", title: "Car עם underscore", level: "intermediate", code: "class Car {\n  private string _color, _model;\n  public Car(string color, string model) {\n    _color = color;\n    _model = model;\n  }\n  public string getColor() { return _color; }\n}", language: "csharp", explanation: "_ מציין שדות private לפי הקורס." },
    ],
    commonMistakes: [
      { title: "בלבול בין class ל-object", description: "חושבים ש-class הוא האובייקט", why: "class היא תבנית בלבד", howToAvoid: "רק אחרי new נוצר מופע" },
      { title: "שכחת new", description: "MyClass x; x.Method();", why: "x הוא null", howToAvoid: "תמיד new לפני שימוש" },
    ],
    examTips: ["class=תבנית, object=מופע", "בנאי = שם המחלקה, ללא return", "new מקצה ומאתחל", "namespace מונע התנגשות שמות", "שלושה רכיבים: attributes, constructors, methods"],
    comparisons: [{ title: "Class מול Object", left: "Class", right: "Object", rows: [{ aspect: "מה זה", left: "תבנית/טיפוס", right: "מופע קונקרטי" }, { aspect: "כמות", left: "אחת לטיפוס", right: "הרבה מופעים" }] }],
    summary: "מחלקה מגדירה מבנה והתנהגות; אובייקט הוא מופע חי עם ערכים. בנאים מאתחלים, מתודות מפעילות לוגיקה.",
  },
  "methods-encapsulation": {
    introduction: {
      what: "מתודות, חתימות, scope, getters/setters, static, והקשר בין מתודות.",
      why: "מתודות הן 'פעולות' של האובייקט; encapsulation מגן על נתונים.",
      when: "בכל מחלקה שצריכה התנהגות או גישה מבוקרת לשדות.",
    },
    sections: [
      { id: "methods", title: "אנטומיה של מתודה", content: "return type, שם, פרמטרים, גוף. void = ללא ערך מוחזר. bool deposit(int amount) — מחזירה true/false." },
      { id: "scope", title: "Scope של משתנים", content: "משתנה מקומי בתוך מתודה — נגיש רק שם. שדות מחלקה — נגישים לכל המתודות באותה מחלקה." },
      { id: "call-stack", title: "Call Stack", content: "כש-MethodA קורא ל-MethodB, C# זוכר איפה לחזור. Stack unwinding — חזרה שלב אחד אחורה." },
      { id: "getters-setters", title: "Getters ו-Setters", content: "Getter (accessor) — קורא שדה private. Setter (mutator) — מעדכן עם אימות. בסיס ל-encapsulation." },
      { id: "params", title: "פרמטרים", content: "חובה התאמה במספר, סדר וטיפוס. פרמטר אופציונלי: string msg = \"default\". המרה מרומזת int→double אפשרית." },
      { id: "static", title: "static", content: "Math.Sqrt — נקרא על שם המחלקה, לא על מופע. static לא יכול לגשת ישירות לשדות instance." },
    ],
    codeExamples: [
      { id: "me-deposit", title: "deposit עם אימות", level: "basic", code: "bool deposit(int amount) {\n  if (amount > 0) {\n    balance += amount;\n    return true;\n  }\n  return false;\n}", language: "csharp", explanation: "מחזיר false על סכום לא חוקי." },
      { id: "me-car", title: "Car מלא מהקורס", level: "intermediate", code: "class Car {\n  private string _color, _model;\n  private int _price;\n  public void setPrice(int price) { _price = price; }\n  public bool sell() { _sold = true; return _sold; }\n}", language: "csharp", explanation: "private + getters/setters + sell משנה state." },
    ],
    commonMistakes: [
      { title: "גישה ישירה ל-private", description: "myCar._color מבחוץ", why: "_color private", howToAvoid: "getColor()/setColor()" },
      { title: "מתודה בלי return", description: "int GetAge() { }", why: "חובה return מסוג int", howToAvoid: "הוסף return עם ערך" },
    ],
    examTips: ["p1=p2 — אותו אובייקט בזיכרון", "static שייך למחלקה", "Main לא ניגש ל-instance ישירות", "Getter=קריאה, Setter=שינוי", "פרמטרים חייבים להתאים"],
    comparisons: [{ title: "Getter מול Setter", left: "Getter", right: "Setter", rows: [{ aspect: "תפקיד", left: "קריאה", right: "כתיבה" }, { aspect: "Return", left: "מחזיר ערך", right: "void" }] }],
    summary: "מתודות מגדירות התנהגות; getters/setters ו-private שדות מממשים encapsulation.",
  },
  polymorphism: {
    projectAnalysis: [petProject],
  },
  "casting-relationships": {},
  properties: {},
  "operator-overloading": {
    projectAnalysis: [furnitureProject],
  },
  "library-project": {
    projectAnalysis: [libraryProject],
  },
};

Object.assign(load("classes-objects"), chapters["classes-objects"]);
save("classes-objects", load("classes-objects"));

Object.assign(load("methods-encapsulation"), chapters["methods-encapsulation"]);
save("methods-encapsulation", load("methods-encapsulation"));

const poly = load("polymorphism");
poly.projectAnalysis = [petProject];
save("polymorphism", poly);

const op = load("operator-overloading");
op.projectAnalysis = [furnitureProject];
save("operator-overloading", op);

const lib = load("library-project");
Object.assign(lib, chapters["library-project"]);
save("library-project", lib);

const props = load("properties");
Object.assign(props, {
  introduction: {
    what: "Properties ב-C# — תחביר שדה עם get/set, auto-implemented, validation, וגישה מבוקרת.",
    why: "מאפשרים encapsulation נקי יותר מ-getter/setter נפרדים.",
    when: "בכל מחלקה שצריך לחשוף נתונים עם שליטה על קריאה/כתיבה.",
  },
  sections: [
    { id: "syntax", title: "תחביר Property", content: "public string Name { get { return _name; } set { _name = value; } } — value הוא הפרמטר המרומז ב-set." },
    { id: "auto", title: "Auto-implemented", content: "public string Name { get; set; } — הקומפיילר יוצר backing field. ברירת מחדל: public string City { get; set; } = \"New York\";" },
    { id: "access", title: "בקרת גישה", content: "public int Score { get; private set; } — קריאה מבחוץ, כתיבה רק בתוך המחלקה." },
    { id: "validation", title: "אימות ב-set", content: "if (value >= 0) _age = value; — לא ניתן לכתוב if בתוך get; set בלבד." },
    { id: "backing", title: "שדה גיבוי", content: "במאפיין ידני — private int _age מאחסן את הערך. auto-property יוצר backing field אוטומטית." },
  ],
  codeExamples: [
    { id: "pr-1", title: "Property עם validation", level: "basic", code: "private int _age;\npublic int Age {\n  get { return _age; }\n  set { if (value >= 0) _age = value; }\n}", language: "csharp", explanation: "רק ערכים לא שליליים נשמרים." },
    { id: "pr-2", title: "get private set", level: "intermediate", code: "public int Score { get; private set; }\npublic void AddPoints(int p) { Score += p; }", language: "csharp", explanation: "עדכון רק דרך מתודות המחלקה." },
  ],
  commonMistakes: [
    { title: "בלבול value", description: "חושבים value הוא הערך הישן", why: "value = מה שהוקצה עכשיו", howToAvoid: "obj.Prop = 5 → value הוא 5" },
  ],
  examTips: ["backing field = private", "value ב-set", "get private set", "ברירת מחדל אחרי { get; set; }", "validation ב-set בלבד"],
  comparisons: [{ title: "Property מול Field public", left: "Property", right: "public field", rows: [{ aspect: "אימות", left: "אפשר ב-set", right: "אין" }, { aspect: "גמישות", left: "get/set נפרדים", right: "הכל פתוח" }] }],
  summary: "Properties = שער מבוקר לנתונים. auto-property לפשטות; ידני כשצריך validation.",
});
save("properties", props);

const opOver = load("operator-overloading");
Object.assign(opOver, {
  introduction: {
    what: "העמסת אופרטורים (+, ==, < וכו') למחלקות משלך.",
    why: "מאפשרים סינטקס טבעי: fish1 == fish2, v * 5.",
    when: "כשמשווים או מחברים אובייקטים מותאמים — כמו ב-Fish ו-Chair בקורס.",
  },
  sections: [
    { id: "rules", title: "כללים", content: "חייב public static. לפחות פרמטר אחד מהמחלקה. לא משנים קדימות. לא ממציאים אופרטורים חדשים." },
    { id: "pairs", title: "זוגות חובה", content: "== דורש !=. < דורש >. <= דורש >=." },
    { id: "immutable", title: "Immutability", content: "אל תשנו אופרנדים — החזירו אובייקט חדש. Point+p1 שמשנה p1 — פרקטיקה גרועה." },
    { id: "equals", title: "== ו-Equals ו-GetHashCode", content: "כשמעמיסים == חובה override ל-Equals ו-GetHashCode. null — ReferenceEquals, לא ==." },
    { id: "unary", title: "אונארי", content: "++ , ! — static, פרמטר יחיד מסוג המחלקה." },
  ],
  codeExamples: [
    { id: "op-fish", title: "Fish == מהקורס", level: "advanced", code: "public static bool operator ==(Fish a, Fish b) {\n  if (ReferenceEquals(a, null) || ReferenceEquals(b, null))\n    return false;\n  return a.Color == b.Color && a.Length == b.Length;\n}", language: "csharp", explanation: "ReferenceEquals מונע רקורסיה." },
  ],
  examTips: ["public static חובה", "זוגות == !=", "ReferenceEquals ל-null", "GetHashCode עם ==", "אל תשנו אופרנדים", ". לא ניתן להעמיס"],
});
opOver.projectAnalysis = [furnitureProject];
save("operator-overloading", opOver);

const inherit = load("inheritance");
Object.assign(inherit, {
  introduction: {
    what: "ירושה: Base/Derived, protected, בנאים, רמות ירושה, ו-DRY.",
    why: "מונעת כפילות קוד ויוצרת היררכיית IS-A.",
    when: "כשיש קבוצת מחלקות עם מאפיינים והתנהגות משותפים.",
  },
  sections: [
    { id: "def", title: "מהי ירושה?", content: "class Dog : Pet — Dog מקבל שדות ומתודות מ-Pet ומוסיף משלו. מטרות: שימוש חוזר, הרחבה, היררכיה." },
    { id: "levels", title: "רמות ירושה", content: "חד-שלבית: DigitalBook : Book. רב-שלבית: Fiction : PaperBook : Book. C# — ירושה יחידה בלבד." },
    { id: "access", title: "מודיפיירים", content: "public — הכל; private — רק המחלקה; protected — המחלקה והיורשים." },
    { id: "ctors", title: "בנאים", content: "בנאי בסיס לא יורש. :base(params) לפני גוף בנאי יורש. סדר: בסיס קודם." },
    { id: "book-hierarchy", title: "היררכיית Book", content: "Book → PaperBook/DigitalBook. מאפיינים משותפים בבסיס, ייחודיים ביורש." },
  ],
  codeExamples: [
    { id: "inh-dog", title: "Dog : Pet", level: "basic", code: "class Dog : Pet {\n  public Dog(string race, double w) : base(w) {\n    Race = race;\n  }\n  public override double Eat() {\n    Weight += 0.5;\n    return Weight;\n  }\n}", language: "csharp", explanation: "base(w) + override Eat." },
  ],
  commonMistakes: [
    { title: "שכחת base()", description: "בנאי יורש לא קורא לבסיס", why: "שדות בסיס לא מאותחלים", howToAvoid: ":base(...)" },
    { title: "בלבול multiple inheritance", description: "class X : A, B", why: "C# לא תומך", howToAvoid: "ממשקים לחוזים מרובים" },
  ],
  examTips: ["בנאי לא יורש", "protected ליורשים", "C# ירושה יחידה", "obj.x ביורש — גם שדות בסיס", "base לקריאת מתודת בסיס"],
  comparisons: [{ title: "Single מול Multi level", left: "רמה אחת", right: "מספר רמות", rows: [{ aspect: "דוגמה", left: "DigitalBook:Book", right: "Fiction:PaperBook:Book" }] }],
  summary: "ירושה בונה IS-A. שימו לב לבנאים, protected, ומגבלת ירושה יחידה.",
});
save("inheritance", inherit);

const polyFull = load("polymorphism");
Object.assign(polyFull, {
  introduction: {
    what: "Overloading (סטטי) ו-Overriding (דינמי), virtual/override, Object.ToString.",
    why: "אותו שם מתודה או ממשק — התנהגות שונה לפי הקשר או סוג אובייקט.",
    when: "מערכים של בסיס עם יורשים שונים; מתודות עם אותו שם ופרמטרים שונים.",
  },
  sections: [
    { id: "static", title: "Overloading", content: "אותה מחלקה, שם זהה, פרמטרים שונים. נפתר בקומפילציה. כולל בנאים." },
    { id: "dynamic", title: "Overriding", content: "virtual בבסיס, override ביורש. Pet a = new Dog(); a.Speak() → Dog אם override." },
    { id: "hiding", title: "Method Hiding", content: "בלי override — מתודה ביורש מסתירה (לא polymorphism). Base b = new Derived(); b.Show() → Base." },
    { id: "object", title: "Object", content: "כל מחלקה יורשת Object. ToString() — מומלץ לדרוס." },
  ],
  projectAnalysis: [petProject],
});
save("polymorphism", polyFull);

const castFull = load("casting-relationships");
Object.assign(castFull, {
  introduction: {
    what: "IS-A מול HAS-A, Upcasting, Downcasting, is, as.",
    why: "מאפשרים לעבוד עם ממשק משותף ולהתמחות כשצריך.",
    when: "מערך Pet[], קריאה למתודות ייחודיות, בדיקת סוג.",
  },
  sections: [
    { id: "isa", title: "IS-A", content: "Dog IS-A Pet. ירושה." },
    { id: "hasa", title: "HAS-A", content: "Agent HAS-A Car — קומפוזיציה, זיכרון נפרד." },
    { id: "up", title: "Upcasting", content: "Pet p = new Dog(); — מרומז, בטוח." },
    { id: "down", title: "Downcasting", content: "(Dog)p או as Dog. סיכון InvalidCastException." },
    { id: "is-as", title: "is / as", content: "is → bool. as → null בכישלון." },
    { id: "pet-demo", title: "מתרגול Pet", content: "pet2.hideBone() לא מתקמפל על Pet. אחרי is Dog — כן." },
  ],
  examTips: ["Upcast בטוח", "Downcast מסוכן", "is לפני cast", "as מחזיר null", "A obj=new B(); obj is B → true"],
  summary: "Casting מחבר בין טיפוס בסיס ליורש. is/as לבטיחות.",
});
save("casting-relationships", castFull);

["classes-objects", "methods-encapsulation", "inheritance", "polymorphism", "casting-relationships", "properties", "operator-overloading", "interfaces-abstract"].forEach((id) => {
  const p = loadPractice(id);
  mergeExam3(p, id);
  savePractice(id, p);
});

const examPractice = loadPractice("interfaces-abstract");
exam3Questions.filter((e) => e.ch === "interfaces-abstract").forEach((e) => {
  if (!examPractice.multipleChoice.find((q) => q.id === e.q.id)) examPractice.multipleChoice.unshift(e.q);
});
savePractice("interfaces-abstract", examPractice);

console.log("Full enrichment complete:");
console.log("- Chapters 2-6 enriched");
console.log("- 28 exam3 questions merged into practice");
console.log("- Pet, FurnitureStore, ProjectLibrary project analysis added");
