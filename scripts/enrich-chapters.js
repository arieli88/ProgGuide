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

const inheritance = load("inheritance");
Object.assign(inheritance, {
  sections: [
    { id: "def", title: "מהי ירושה?", content: "ירושה מאפשרת למחלקה יורשת (Derived) לקבל שדות ומתודות ממחלקת בסיס (Base). ב-C#: class Dog : Pet. מטרות: שימוש חוזר בקוד (DRY), בנייה על פונקציונליות קיימת, היררכיה לוגית." },
    { id: "levels", title: "רמות ירושה", content: "ירושה חד-שלבית: DigitalBook יורש ישירות מ-Book. רב-שלבית: Fiction יורש מ-PaperBook שיורש מ-Book. C# תומך בירושה יחידה בלבד — לא מספר מחלקות בסיס." },
    { id: "access", title: "מודיפיירים", content: "public — נגיש הכל; private — רק בתוך המחלקה; protected — המחלקה והיורשים. לשיתוף עם יורשים משתמשים ב-protected." },
    { id: "ctors", title: "בנאים וירושה", content: "בנאי של מחלקת בסיס לא יורש. ביורש חובה להגדיר בנאים ולקרוא :base(...). סדר ביצוע: הקצאת זיכרון לבסיס → בנאי בסיס → זיכרון ליורש → בנאי יורש." },
  ],
  codeExamples: [
    { id: "inh-1", title: "ירושה בסיסית", level: "basic", code: "class Pet {\n  protected double weight;\n  public Pet(double w) { weight = w; }\n}\nclass Dog : Pet {\n  public string Race;\n  public Dog(string race, double w) : base(w) {\n    Race = race;\n  }\n}", language: "csharp", explanation: "Dog מקבל weight מ-Pet; הבנאי קורא ל-base(w)." },
    { id: "inh-2", title: "גישה ל-protected", level: "intermediate", code: "class Furniture {\n  protected double price;\n  protected void setPrice(double p) {\n    if (p > 0) price = p;\n  }\n}\nclass Chair : Furniture {\n  public void UpdatePrice(double p) { setPrice(p); }\n}", language: "csharp", explanation: "יורש יכול להשתמש ב-protected של הבסיס." },
  ],
  commonMistakes: [
    { title: "שכחת base()", description: "בנאי יורש לא קורא לבסיס", why: "שדות הבסיס לא מאותחלים", howToAvoid: "הוסף :base(...) או הסתמך על בנאי ברירת מחדל של בסיס" },
    { title: "הנחה שבנאי יורש", description: "חושבים שבנאי הבסיס זמין אוטומטית", why: "בנאים לא יורשים", howToAvoid: "הגדר בנאים מפורשים ביורש" },
  ],
  examTips: ["בנאי לא יורש — שאלה קלאסית", "C# — ירושה יחידה", "protected לשיתוף עם יורשים", "סדר: base לפני derived"],
  comparisons: [{ title: "Single vs Multi level", left: "רמה אחת", right: "מספר רמות", rows: [{ aspect: "דוגמה", left: "DigitalBook : Book", right: "Fiction : PaperBook : Book" }, { aspect: "עומק", left: "ילד ישיר", right: "נכד ומעלה" }] }],
  summary: "ירושה בונה היררכיית IS-A, חוסכת כפילות, ודורשת תשומת לב לבנאים ולמודיפיירים.",
});
save("inheritance", inheritance);

const polymorphism = load("polymorphism");
Object.assign(polymorphism, {
  sections: [
    { id: "meaning", title: "משמעות פולימורפיזם", content: "פולימורפיזם = 'צורות רבות'. אובייקט יכול להתנהג אחרת דרך ממשק משותף." },
    { id: "static", title: "פולימורפיזם סטטי (Overloading)", content: "אותה מתודה, פרמטרים שונים באותה מחלקה. המהדר בוחר בזמן קומפילציה. דוגמה: Add(int,int) ו-Add(double,double)." },
    { id: "dynamic", title: "פולימורפיזם דינמי (Overriding)", content: "virtual בבסיס, override ביורש. הקריאה נקבעת לפי סוג האובייקט בזמן ריצה: Pet p = new Dog(); p.Eat() → Eat של Dog." },
    { id: "object", title: "מחלקת Object", content: "כל מחלקה יורשת מ-Object. ToString(), Equals() — מומלץ לדרוס לייצוג משמעותי." },
  ],
  codeExamples: [
    { id: "poly-1", title: "virtual / override", level: "basic", code: "class Pet {\n  public virtual void Eat() {\n    Console.WriteLine(\"Pet eating\");\n  }\n}\nclass Dog : Pet {\n  public override void Eat() {\n    Console.WriteLine(\"Dog eating\");\n  }\n}\nPet p = new Dog();\np.Eat(); // Dog eating", language: "csharp", explanation: "הפניה מטיפוס בסיס מפעילה מימוש של היורש." },
  ],
  examTips: ["override דורש virtual", "בלי override — method hiding", "טיפוס ריצה קובע", "Overloading ≠ Overriding"],
  comparisons: [{ title: "override מול overload", left: "Override", right: "Overload", rows: [{ aspect: "מתי", left: "ירושה, אותה חתימה", right: "אותה מחלקה, חתימות שונות" }, { aspect: "פתרון", left: "זמן ריצה", right: "זמן קומפילציה" }] }],
  summary: "פולימורפיזם מאפשר קוד גמיש: Overloading לגיוון חתימות, Overriding להתנהגות שונה ביורשים.",
});
save("polymorphism", polymorphism);

const casting = load("casting-relationships");
Object.assign(casting, {
  sections: [
    { id: "isa", title: "IS-A", content: "Dog IS-A Pet — ירושה. אובייקט יורש מכיל את כל מה שיש בבסיס." },
    { id: "hasa", title: "HAS-A", content: "Agent HAS-A Car — קומפוזיציה. אובייקטים נפרדים בזיכרון; Agent מחזיק הפניה ל-Car." },
    { id: "up", title: "Upcasting", content: "Pet p = new Dog(); — המרה מיורש לבסיס. תמיד בטוחה, מרומזת." },
    { id: "down", title: "Downcasting", content: "Dog d = (Dog)p; — מפורש. סיכון: InvalidCastException. עדיף is/as לפני המרה." },
    { id: "operators", title: "is ו-as", content: "is מחזיר bool; as מחזיר null בכישלון במקום חריגה." },
  ],
  examTips: ["Upcast בטוח", "Downcast מסוכן", "is/as לפני cast", "בסיס לא רואה מתודות יורש בלבד"],
  summary: "הבנת IS-A מול HAS-A וסוגי Casting קריטית לקריאת קוד ולמבחן.",
});
save("casting-relationships", casting);

const interfaces = load("interfaces-abstract");
Object.assign(interfaces, {
  sections: [
    { id: "interface", title: "ממשקים", content: "ממשק מגדיר חוזה התנהגות — מה, לא איך. מחלקה יכולה לממש מספר ממשקים. מימוש מתודה — public, בלי override." },
    { id: "abstract", title: "מחלקות מופשטות", content: "abstract class — לא ניתן ליצור ממנה מופע. יכולה להכיל שדות, בנאים, מתודות קונקרטיות ומופשטות. יורש שלא מממש abstract חייב להיות abstract." },
    { id: "when", title: "מתי מה?", content: "Abstract — IS-A חזק, קוד משותף. Interface — חוזה התנהגות בין מחלקות לא קשורות (Phone ו-ElectricCar + IChargeable)." },
  ],
  codeExamples: [
    { id: "if-1", title: "מימוש ממשק", level: "basic", code: "interface IChargeable {\n  void Charge();\n}\nclass Phone : IChargeable {\n  public void Charge() {\n    BatteryChargePercent = 100;\n  }\n}", language: "csharp", explanation: "מימוש חייב להיות public." },
  ],
  examTips: ["ממשק ללא שדות מופע", "override לא לממשק", "abstract ללא מופע", "ממשקים מרובים מותרים"],
  comparisons: [{ title: "Interface מול Abstract", left: "Interface", right: "Abstract Class", rows: [{ aspect: "מופע", left: "לא", right: "לא" }, { aspect: "שדות", left: "לא (בחומר הקורס)", right: "כן" }, { aspect: "ירושה", left: "מרובה", right: "יחידה" }] }],
  summary: "ממשקים ומופשטות מאפשרים עיצוב גמיש: חוזה מול תבנית חלקית.",
});
save("interfaces-abstract", interfaces);

const exceptions = load("exceptions");
Object.assign(exceptions, {
  sections: [
    { id: "types", title: "סוגי שגיאות", content: "תחביר — קומפילציה; ריצה — Exceptions; לוגיקה — התוכנית רצה אך טועה." },
    { id: "try", title: "try/catch/finally", content: "try — קוד מסוכן; catch — טיפול; finally — תמיד רץ (ניקוי)." },
    { id: "tryparse", title: "TryParse", content: "int.TryParse מחזיר bool ומשתמש ב-out — עדיף על try/catch לקלט משתמש." },
    { id: "common", title: "חריגות נפוצות", content: "DivideByZeroException, IndexOutOfRangeException, NullReferenceException, InvalidCastException, StackOverflowException." },
  ],
  examTips: ["finally תמיד רץ", "TryParse לקלט", "catch ספציפי לפני כללי", "אימות קלט מונע חריגה"],
  summary: "חריגות מנהלות כשלים בזמן ריצה; TryParse ואימות מונעים קריסות מיותרות.",
});
save("exceptions", exceptions);

const mysql = load("mysql");
Object.assign(mysql, {
  sections: [
    { id: "conn", title: "חיבור", content: "MySqlConnection עם connection string. using מבטיח סגירה ומניעת דליפות." },
    { id: "read", title: "קריאה", content: "ExecuteReader → MySqlDataReader. Read() בלולאה. GetInt32, GetString לפי עמודה." },
    { id: "write", title: "כתיבה", content: "INSERT/UPDATE/DELETE → ExecuteNonQuery מחזיר מספר שורות." },
    { id: "params", title: "פרמטרים", content: "@name + Parameters.AddWithValue — מונע SQL Injection." },
    { id: "repo", title: "Repository", content: "Model = נתונים; Repository = SQL; Main = לוגיקה. הפרדת אחריות." },
  ],
  examTips: ["using לחיבור", "ExecuteNonQuery ל-UPDATE", "פרמטרים לא שרשור", "Reader פתוח — לא פקודה נוספת"],
  summary: "ADO.NET עם MySQL: חיבור בטוח, פרמטרים, ודפוס Repository.",
});
save("mysql", mysql);

const library = load("library-project");
Object.assign(library, {
  sections: [
    { id: "overview", title: "מבנה הפרויקט", content: "Book בסיס עם Borrow/Return/PrintInfo וירטואליים. PhysicalBook, DigitalBook, AudioBook יורשים ומתמחים. Library מנהלת מערך Book[100]." },
    { id: "poly", title: "פולימורפיזם בפרויקט", content: "Library שומרת Book[]; קריאה ל-Borrow() מפעילה מימוש לפי סוג בפועל. דוחות לפי is AudioBook וכו'." },
    { id: "menu", title: "תפריט", content: "לולאת while + switch: הוספה, הצגה, השאלה, החזרה, דוחות, יציאה." },
  ],
  codeExamples: [
    { id: "lib-1", title: "מחלקת Book", level: "intermediate", code: "class Book {\n  public int Id { get; set; }\n  public virtual bool Borrow() { return true; }\n  public virtual void PrintInfo() {\n    Console.WriteLine($\"{Title} by {Author}\");\n  }\n}", language: "csharp", explanation: "מתודות וירטואליות לדריסה ביורשים." },
  ],
  examTips: ["PhysicalBook משנה AvailableCopies ב-Borrow", "דוחות עם is ו-downcast", "מערך פולימורפי של Book"],
  summary: "פרויקט הספרייה מיישם את כל עקרונות OOP מהקורס ביישום שלם.",
});
save("library-project", library);

console.log("Enriched chapters");
