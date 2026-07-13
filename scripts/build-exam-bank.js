const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "../src/data/final-exam.json");

function mc(id, question, options, correctId, explanation, chapterIds, extra = {}) {
  const wrongExplanations = Object.fromEntries(
    options.map(([oid]) => [oid, oid === correctId ? explanation : "תשובה שגויה — עיינו בהסבר."])
  );
  return {
    id,
    question,
    options: options.map(([oid, text]) => ({ id: oid, text })),
    correctId,
    explanation,
    wrongExplanations,
    difficulty: extra.difficulty ?? "medium",
    topicId: chapterIds[0],
    chapterIds,
    ...(extra.code ? { code: extra.code } : {}),
    ...(extra.detailedExplanation ? { detailedExplanation: extra.detailedExplanation } : {}),
    ...(extra.termsContext ? { termsContext: extra.termsContext } : {}),
  };
}

const practiceExam = [
  mc("pe-01", "מה יקרה אם מתודת Main חסרה?", [
    ["a", "התוכנית תתקמפל ותפעל כרגיל"],
    ["b", "שגיאת קומפילציה — אין נקודת כניסה"],
    ["c", "שגיאת זמן ריצה בעת ההפעלה"],
    ["d", "תיווצר תוכנית ללא פלט"],
  ], "b", "Main היא נקודת הכניסה — בלעדיה אין קומפילציה תקינה.", ["introduction"]),
  mc("pe-02", "מה יהיה הפלט של הקוד הבא?", [
    ["a", "0"],
    ["b", "1"],
    ["c", "שגיאת קומפילציה"],
    ["d", "חריגה בזמן ריצה"],
  ], "a", "בגלל short-circuit ב-||, y++ לא מתבצע כי x>3 כבר true.", ["introduction"], {
    code: "int x = 5;\nint y = 0;\nif (x > 3 || y++ > 0)\n    Console.WriteLine(y);",
    detailedExplanation: "x>3 → true, הצד השני לא נבדק, y נשאר 0.",
    termsContext: [{ term: "Short-circuit", explanation: "ב-||: אם הצד הראשון true, הצד השני לא מוערך." }],
  }),
  mc("pe-03", "איזה משפט נכון לגבי short-circuit evaluation ב-C#?", [
    ["a", "שני התנאים תמיד נבדקים"],
    ["b", "הביטוי השני לא יוערך אם הראשון כבר קובע את התוצאה"],
    ["c", "זה קורה רק עם אופרטור |"],
    ["d", "זה קורה רק בלולאות"],
  ], "b", "זה עיקרון ה-short-circuit — חוסך הערכה מיותרת ו-side effects.", ["introduction"]),
  mc("pe-04", "מה יודפס?", [
    ["a", "11"],
    ["b", "12"],
    ["c", "13"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "x++ מחזיר 5 ואז x=6; ++x מעלה ל-7; 5+7=12.", ["introduction"], {
    code: "int x = 5;\nConsole.WriteLine(x++ + ++x);",
  }),
  mc("pe-05", "מה תפקיד ה-CLR במודל ההרצה של C#?", [
    ["a", "להמיר קוד C# ל-IL"],
    ["b", "להריץ IL ולנהל זיכרון"],
    ["c", "לבדוק שגיאות תחביר"],
    ["d", "ליצור קובץ exe"],
  ], "b", "הקומפילציה מייצרת IL; CLR מריץ ומנהל זיכרון בזמן ריצה.", ["introduction"]),
  mc("pe-06", "מה היתרון המרכזי של אנקפסולציה?", [
    ["a", "שיפור מהירות ריצה משמעותי"],
    ["b", "הגנה על שלמות הנתונים ואכיפת כללים דרך ממשק מבוקר"],
    ["c", "ביטול הצורך בבנאים"],
    ["d", "מניעת שימוש בירושה"],
  ], "b", "שדות פרטיים + גישה מבוקרת שומרים על שלמות הנתונים.", ["methods-encapsulation"]),
  mc("pe-07", "מה יהיה הפלט של הקוד הבא?", [
    ["a", "null"],
    ["b", "Dana"],
    ["c", "שגיאת קומפילציה"],
    ["d", "Person"],
  ], "b", "p1 ו-p2 מצביעים לאותו אובייקט — שינוי ב-p2 משפיע על p1.", ["classes-objects"], {
    code: "class Person { public string Name; }\nPerson p1 = new Person();\nPerson p2 = p1;\np2.Name = \"Dana\";\nConsole.WriteLine(p1.Name);",
  }),
  mc("pe-08", "מה יודפס?", [
    ["a", "10"],
    ["b", "20"],
    ["c", "0"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "c2 מצביע לאותו Counter כמו c1 — Value משותף.", ["classes-objects"], {
    code: "class Counter { public int Value; }\nCounter c1 = new Counter();\nc1.Value = 10;\nCounter c2 = c1;\nc2.Value = 20;\nConsole.WriteLine(c1.Value);",
  }),
  mc("pe-09", "איזו מילת מפתח משמשת ליצירת מופע של מחלקה?", [
    ["a", "create"],
    ["b", "class"],
    ["c", "new"],
    ["d", "object"],
  ], "c", "new מקצה זיכרון וקורא לבנאי.", ["classes-objects"]),
  mc("pe-10", "איזה עקרון OOP מאפשר לאובייקט להתנהג בדרכים שונות?", [
    ["a", "Encapsulation"],
    ["b", "Abstraction"],
    ["c", "Polymorphism"],
    ["d", "Compilation"],
  ], "c", "פולימורפיזם = התנהגות שונה לפי סוג האובייקט בפועל.", ["polymorphism"]),
  mc("pe-11", "מה יודפס?", [
    ["a", "5"],
    ["b", "10"],
    ["c", "15"],
    ["d", "שגיאה"],
  ], "a", "יורש יורש שדות public/protected של הבסיס — obj.x מגיע מ-A.", ["inheritance"], {
    code: "class A { public int x = 5; }\nclass B : A { public int y = 10; }\nB obj = new B();\nConsole.WriteLine(obj.x);",
  }),
  mc("pe-12", "מה תפקיד מילת המפתח base?", [
    ["a", "יצירת מחלקה חדשה"],
    ["b", "גישה לחברי מחלקת הבסיס"],
    ["c", "המרה לטיפוס בסיס"],
    ["d", "מחיקת אובייקט"],
  ], "b", "base מאפשר גישה לבנאים ולמתודות של מחלקת האב.", ["inheritance"]),
  mc("pe-13", "אם למחלקת בסיס אין בנאי ריק, מה חייבת המחלקה היורשת לעשות?", [
    ["a", "להגדיר שדה פרטי"],
    ["b", "לקרוא לבנאי הבסיס במפורש"],
    ["c", "להשתמש ב-virtual"],
    ["d", "להשתמש ב-static"],
  ], "b", "חייבים : base(...) עם הפרמטרים המתאימים.", ["inheritance"]),
  mc("pe-14", "מה לא ניתן להוריש?", [
    ["a", "שדות public"],
    ["b", "שדות protected"],
    ["c", "בנאי"],
    ["d", "מתודות virtual"],
  ], "c", "בנאי לא יורש — כל מחלקה מגדירה בנאים משלה.", ["inheritance"]),
  mc("pe-15", "מה יקרה אם מחלקה יורשת תנסה override למתודה שאינה virtual?", [
    ["a", "המתודה תידרס כרגיל"],
    ["b", "שגיאת קומפילציה"],
    ["c", "המתודה תוסתר אוטומטית"],
    ["d", "חריגה בזמן ריצה"],
  ], "b", "override דורש virtual או abstract בבסיס.", ["polymorphism"]),
  mc("pe-16", "מה יודפס?", [
    ["a", "Base"],
    ["b", "Derived"],
    ["c", "שגיאת קומפילציה"],
    ["d", "חריגה"],
  ], "a", "בלי override — hiding; המשתנה מטיפוס Base קורא ל-Base.Show.", ["polymorphism"], {
    code: "class Base { public virtual void Show() { Console.WriteLine(\"Base\"); } }\nclass Derived : Base { public void Show() { Console.WriteLine(\"Derived\"); } }\nBase b = new Derived();\nb.Show();",
  }),
  mc("pe-17", "מה יודפס?", [
    ["a", "Animal"],
    ["b", "Dog"],
    ["c", "שגיאה"],
    ["d", "null"],
  ], "b", "override + virtual — הקריאה לפי טיפוס הריצה (Dog).", ["polymorphism"], {
    code: "class Animal { public virtual void Speak() { Console.WriteLine(\"Animal\"); } }\nclass Dog : Animal { public override void Speak() { Console.WriteLine(\"Dog\"); } }\nAnimal a = new Dog();\na.Speak();",
  }),
  mc("pe-18", "מה יקרה אם נשמיט override במחלקה יורשת?", [
    ["a", "שגיאת קומפילציה"],
    ["b", "המתודה תוסתר (method hiding)"],
    ["c", "פולימורפיזם מלא"],
    ["d", "חריגה בזמן ריצה"],
  ], "b", "בלי override — new/hiding, לא פולימורפיזם דרך משתנה בסיס.", ["polymorphism"]),
  mc("pe-19", "מה ההבדל בין overriding ל-overloading?", [
    ["a", "אין הבדל"],
    ["b", "overriding דורש virtual"],
    ["c", "overloading דורש ירושה"],
    ["d", "overriding קורה באותה מחלקה בלבד"],
  ], "b", "overriding = ירושה + virtual; overloading = חתימות שונות באותה מחלקה.", ["polymorphism"]),
  mc("pe-20", "איזה טיפוס יקבע איזו מתודה תרוץ בפולימורפיזם?", [
    ["a", "טיפוס המשתנה בזמן קומפילציה"],
    ["b", "טיפוס האובייקט בזמן ריצה"],
    ["c", "טיפוס הבסיס בלבד"],
    ["d", "טיפוס ה-namespace"],
  ], "b", "Dynamic dispatch — לפי האובייקט בפועל בזיכרון.", ["polymorphism"]),
  mc("pe-21", "מהי המרה Implicit?", [
    ["a", "המרה שדורשת cast מפורש"],
    ["b", "המרה שמתבצעת אוטומטית"],
    ["c", "המרה בין מחלקות לא קשורות"],
    ["d", "המרה שמוחקת נתונים"],
  ], "b", "Upcast מיורש לבסיס — בטוח ואוטומטי.", ["casting-relationships"]),
  mc("pe-22", "מה יקרה אם נבצע Downcasting שגוי?", [
    ["a", "שגיאת קומפילציה"],
    ["b", "InvalidCastException בזמן ריצה"],
    ["c", "הערך יהיה null"],
    ["d", "לא יקרה דבר"],
  ], "b", "cast מפורש לא תקין בזמן ריצה זורק InvalidCastException.", ["casting-relationships"]),
  mc("pe-23", "לגבי Interfaces, מה נכון?", [
    ["a", "ממשק יכול להכיל שדות מופע רגילים"],
    ["b", "מחלקה יכולה לממש מספר ממשקים"],
    ["c", "ניתן ליצור אובייקטים של ממשק"],
    ["d", "interface מחליף הורשה"],
  ], "b", "C# תומך בממשקים מרובים; אין שדות מופע בממשק.", ["interfaces-abstract"]),
  mc("pe-24", "מה יודפס?", [
    ["a", "true"],
    ["b", "false"],
    ["c", "שגיאת קומפילציה"],
    ["d", "חריגה"],
  ], "a", "האובייקט בפועל הוא B — obj is B מחזיר true.", ["casting-relationships"], {
    code: "class A { }\nclass B : A { }\nA obj = new B();\nConsole.WriteLine(obj is B);",
  }),
  mc("pe-25", "מה תוצאת הקוד הבא?", [
    ["a", "true"],
    ["b", "false"],
    ["c", "שגיאת קומפילציה"],
    ["d", "חריגה"],
  ], "b", "as מצליח — b לא null, לכן b == null הוא false.", ["casting-relationships"], {
    code: "class A { }\nclass B : A { }\nA obj = new B();\nB b = obj as B;\nConsole.WriteLine(b == null);",
  }),
  mc("pe-26", "מה יקרה בהמרה מפורשת (downcast) לא תקינה?", [
    ["a", "שגיאת קומפילציה"],
    ["b", "InvalidCastException בזמן ריצה"],
    ["c", "יוחזר null"],
    ["d", "יוחזר 0"],
  ], "b", "A obj = new A(); B b = (B)obj — חריגה בזמן ריצה.", ["casting-relationships"], {
    code: "class A { }\nclass B : A { }\nA obj = new A();\nB b = (B)obj;",
  }),
  mc("pe-27", "מה המשמעות?", [
    ["a", "לא ניתן לקרוא ל-Name"],
    ["b", "ניתן לשנות את Name מכל מקום"],
    ["c", "ניתן לקרוא מכל מקום אך לשנות רק בתוך המחלקה"],
    ["d", "שגיאת קומפילציה"],
  ], "c", "public get; private set — קריאה חופשית, שינוי רק בתוך המחלקה.", ["properties"], {
    code: "class User { public string Name { get; private set; } }",
  }),
  mc("pe-28", "איזה משפט על אובייקטים סטטיים נכון?", [
    ["a", "static שייך למופע"],
    ["b", "static שייך למחלקה ומשותף לכל המופעים"],
    ["c", "static ניתן להגדיר רק בתוך Main"],
    ["d", "static לא יכול להיות מתודה"],
  ], "b", "static שייך למחלקה, לא למופע בודד.", ["methods-encapsulation"]),
  mc("pe-29", "מה מחזירה ExecuteNonQuery עבור UPDATE?", [
    ["a", "הטבלה המעודכנת"],
    ["b", "מספר השורות שהושפעו"],
    ["c", "אובייקט DataReader"],
    ["d", "true/false בלבד"],
  ], "b", "ExecuteNonQuery מחזירה int — מספר שורות שהושפעו.", ["mysql"]),
  mc("pe-30", "מה יקרה אם נקרא ל-ExecuteReader() בלי לפתוח את החיבור?", [
    ["a", "יוחזר Reader ריק"],
    ["b", "תיזרק InvalidOperationException"],
    ["c", "יוחזר 0"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "חייבים conn.Open() לפני פקודות על החיבור.", ["mysql"]),
  mc("pe-31", "אם MySqlDataReader פתוח ומריצים פקודה נוספת על אותו חיבור?", [
    ["a", "זה יעבוד תמיד"],
    ["b", "תתרחש חריגה — Reader פעיל על החיבור"],
    ["c", "הפקודה השנייה תסגור את ה-Reader"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "לא ניתן להריץ פקודה נוספת כל עוד Reader פתוח.", ["mysql"]),
  mc("pe-32", "מה הדרך הסטנדרטית לטיפול בשגיאות מסד נתונים?", [
    ["a", "try/catch (לעיתים עם using)"],
    ["b", "foreach"],
    ["c", "override"],
    ["d", "static בלבד"],
  ], "a", "try/catch + using לניהול משאבים וחריגות.", ["mysql"]),
  mc("pe-33", "מה יודפס?", [
    ["a", "Base"],
    ["b", "Derived"],
    ["c", "שגיאת קומפילציה"],
    ["d", "null"],
  ], "b", "virtual/override — b מצביע על Derived בפועל.", ["polymorphism"], {
    code: "class Base { public virtual string Get() { return \"Base\"; } }\nclass Derived : Base { public override string Get() { return \"Derived\"; } }\nBase b = new Derived();\nConsole.WriteLine(b.Get());",
  }),
  mc("pe-34", "מה יהיה הפלט של תרחיש ההמרה הבא?", [
    ["a", "Int"],
    ["b", "String"],
    ["c", "None"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "val הוא string בפועל — is string מתקיים.", ["casting-relationships"], {
    code: "object val = \"100\";\nif (val is int) Console.Write(\"Int\");\nelse if (val is string) Console.Write(\"String\");\nelse Console.Write(\"None\");",
  }),
  mc("pe-35", "מה ידפיס קטע הקוד הבא?", [
    ["a", "Plastic"],
    ["b", "Paper"],
    ["c", "PaperPlastic"],
    ["d", "PlasticPaper"],
  ], "c", "base.Print() מדפיס Paper, ואז Plastic — סה\"כ PaperPlastic.", ["polymorphism"], {
    code: "class Printer { public virtual void Print() { Console.Write(\"Paper\"); } }\nclass Printer3D : Printer { public override void Print() { base.Print(); Console.Write(\"Plastic\"); } }\nPrinter p = new Printer3D();\np.Print();",
  }),
  mc("pe-36", "מה חסר כדי להבטיח סגירת חיבור MySQL גם בחריגה?", [
    ["a", "שימוש בבלוק using או finally"],
    ["b", "הוספת COMMIT"],
    ["c", "הגדרת CommandTimeout"],
    ["d", "אין צורך — החיבור נסגר אוטומטית"],
  ], "a", "using או finally מבטיחים Dispose/Close גם בחריגה.", ["mysql"], {
    code: "MySqlConnection conn = new MySqlConnection(cs);\nconn.Open();\nMySqlCommand cmd = new MySqlCommand(sql, conn);\ncmd.ExecuteNonQuery();\nconn.Close();",
  }),
];

const lilachExam = [
  mc("le-01", "מה הערך של s?", [
    ["a", "Ticket"],
    ["b", "Economy"],
    ["c", "Business"],
    ["d", "Economy+Business"],
  ], "d", "base.GetTypeName() מחזיר Economy, ואז מוסיפים +Business.", ["polymorphism"], {
    code: "class Ticket { public virtual string GetTypeName() { return \"Ticket\"; } }\nclass EconomyTicket : Ticket { public override string GetTypeName() { return \"Economy\"; } }\nclass BusinessTicket : EconomyTicket { public override string GetTypeName() { return base.GetTypeName() + \"+Business\"; } }\nTicket t = new BusinessTicket();\nstring s = t.GetTypeName();",
  }),
  mc("le-02", "מה יודפס?", [
    ["a", "F0 IF0"],
    ["b", "F1 IF1 IF0"],
    ["c", "F1 IF0 IF1"],
    ["d", "F0 IF1 IF0"],
  ], "b", "InternationalFlight() → this(10) → base(10) → F1, IF1, ואז IF0.", ["inheritance"], {
    code: "class Flight { public Flight() { Console.Write(\"F0 \"); } public Flight(int id) { Console.Write(\"F1 \"); } }\nclass InternationalFlight : Flight {\n  public InternationalFlight() : this(10) { Console.Write(\"IF0 \"); }\n  public InternationalFlight(int id) : base(id) { Console.Write(\"IF1 \"); }\n}\nInternationalFlight f = new InternationalFlight();",
  }),
  mc("le-03", "מה יקרה בקוד הנוסעים?", [
    ["a", "הקוד תקין"],
    ["b", "שגיאת קומפילציה ב-PassportNumber = newPassport"],
    ["c", "שגיאת זמן ריצה"],
    ["d", "PassportNumber יתעדכן בהצלחה"],
  ], "b", "private set — רק בתוך Passenger מותר להציב.", ["properties"], {
    code: "class Passenger { public string PassportNumber { get; private set; } public Passenger(string p) { PassportNumber = p; } }\nclass VipPassenger : Passenger {\n  public VipPassenger(string p) : base(p) { }\n  public void UpdatePassport(string newPassport) { PassportNumber = newPassport; }\n}",
  }),
  mc("le-04", "מה ערך result?", [
    ["a", "300"],
    ["b", "350"],
    ["c", "500"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "EconomyTicket.CalcPrice מחזיר basePrice + 50 → 350.", ["polymorphism"], {
    code: "class Ticket { public virtual int CalcPrice(int basePrice) { return basePrice; } }\nclass EconomyTicket : Ticket { public override int CalcPrice(int basePrice) { return basePrice + 50; } }\nTicket t = new EconomyTicket();\nint result = t.CalcPrice(300);",
  }),
  mc("le-05", "איזו קביעה נכונה לגבי הקריאה x.Print() כאשר A x = new B() ו-B משתמש ב-new?", [
    ["a", "יודפס B"],
    ["b", "יודפס A"],
    ["c", "InvalidCastException"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "new מסתיר — הקריאה לפי טיפוס המשתנה (A).", ["polymorphism"], {
    code: "class A { public void Print() { Console.Write(\"A\"); } }\nclass B : A { public new void Print() { Console.Write(\"B\"); } }\nA x = new B();\nx.Print();",
  }),
  mc("le-06", "מה יודפס?", [
    ["a", "A"],
    ["b", "B"],
    ["c", "C"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "C לא דורס — הדריסה האחרונה היא B.Log.", ["polymorphism"], {
    code: "class A { public virtual void Log() { Console.Write(\"A\"); } }\nclass B : A { public override void Log() { Console.Write(\"B\"); } }\nclass C : B { }\nA obj = new C();\nobj.Log();",
  }),
  mc("le-07", "איזה מגדיר גישה מתאים לשדה פנימי שיורשים יכולים לגשת אליו אך חוץ לא?", [
    ["a", "public"],
    ["b", "private"],
    ["c", "protected"],
    ["d", "internal"],
  ], "c", "protected — ליורשים בלבד, לא לקוד חיצוני.", ["inheritance"]),
  mc("le-08", "מה נכון לגבי GetNumber() ו-flightNumber protected?", [
    ["a", "שגיאת קומפילציה"],
    ["b", "GetNumber יחזיר את מספר הטיסה בהצלחה"],
    ["c", "flightNumber נגיש רק באותה מחלקה"],
    ["d", "חייבים public על flightNumber"],
  ], "b", "protected נגיש במחלקה יורשת.", ["inheritance"], {
    code: "class Flight { protected int flightNumber; public Flight(int num) { flightNumber = num; } }\nclass DomesticFlight : Flight {\n  public DomesticFlight(int num) : base(num) { }\n  public int GetNumber() { return flightNumber; }\n}",
  }),
  mc("le-09", "מה ערך s?", [
    ["a", "Meal"],
    ["b", "OnBoard"],
    ["c", "OnBoard: Meal"],
    ["d", "שגיאת קומפילציה"],
  ], "c", "Wrap קורא ל-GetDescription ומחזיר prefix + \": \" + תיאור.", ["interfaces-abstract"], {
    code: "abstract class Service { public abstract string GetDescription(); public string Wrap(string prefix) { return prefix + \": \" + GetDescription(); } }\nclass MealService : Service { public override string GetDescription() { return \"Meal\"; } }\nService srv = new MealService();\nstring s = srv.Wrap(\"OnBoard\");",
  }),
  mc("le-10", "מה נכון לגבי מימוש interface?", [
    ["a", "OnlineCheckIn חייבת להיות abstract"],
    ["b", "CanCheckIn חייבת להיות private"],
    ["c", "הקוד תקין — המתודה חייבת להיות public"],
    ["d", "אי אפשר לממש interface ב-C#"],
  ], "c", "מימוש interface חייב public.", ["interfaces-abstract"], {
    code: "interface ICheckIn { bool CanCheckIn(int hoursBefore); }\nclass OnlineCheckIn : ICheckIn { public bool CanCheckIn(int hoursBefore) { return hoursBefore <= 24; } }",
  }),
  mc("le-11", "מה יקרה בזמן ריצה?", [
    ["a", "יעבוד — c לא null"],
    ["b", "שגיאת קומפילציה"],
    ["c", "InvalidCastException"],
    ["d", "c יהיה null"],
  ], "c", "האובייקט VipPassenger, לא CrewMember — cast מפורש נכשל.", ["casting-relationships"], {
    code: "class Passenger { }\nclass VipPassenger : Passenger { }\nclass CrewMember : Passenger { }\nPassenger p = new VipPassenger();\nCrewMember c = (CrewMember)p;",
  }),
  mc("le-12", "מה יודפס?", [
    ["a", "True"],
    ["b", "False"],
    ["c", "InvalidCastException"],
    ["d", "שגיאת קומפילציה"],
  ], "a", "as מחזיר null בלי חריגה — c == null → True.", ["casting-relationships"], {
    code: "class Passenger { }\nclass VipPassenger : Passenger { }\nclass CrewMember : Passenger { }\nPassenger p = new VipPassenger();\nCrewMember c = p as CrewMember;\nConsole.WriteLine(c == null);",
  }),
  mc("le-13", "מה הערך של x?", [
    ["a", "10"],
    ["b", "15"],
    ["c", "20"],
    ["d", "35"],
  ], "d", "base.Points() → 15, +20 → 35.", ["polymorphism"], {
    code: "class Ticket { public virtual int Points() { return 10; } }\nclass EconomyTicket : Ticket { public override int Points() { return 15; } }\nclass BusinessTicket : EconomyTicket { public override int Points() { return base.Points() + 20; } }\nEconomyTicket t = new BusinessTicket();\nint x = t.Points();",
  }),
  mc("le-14", "איזו קביעה נכונה לגבי internal?", [
    ["a", "נגיש רק בתוך המחלקה"],
    ["b", "נגיש רק ליורשים"],
    ["c", "נגיש באותה Assembly"],
    ["d", "נגיש רק באותו קובץ"],
  ], "c", "internal — גישה ברמת הפרויקט/Assembly.", ["methods-encapsulation"]),
  mc("le-15", "איזו שאילתה מחזירה קוד טיסה ומספר הזמנות (כולל טיסות ללא הזמנות)?", [
    ["a", "SELECT f.code, COUNT(*) FROM Flights f JOIN Bookings b ON f.id = b.flight_id GROUP BY f.code"],
    ["b", "SELECT f.code, COUNT(b.id) FROM Flights f LEFT JOIN Bookings b ON f.id = b.flight_id GROUP BY f.code"],
    ["c", "SELECT code, COUNT(*) FROM Bookings GROUP BY code"],
    ["d", "SELECT f.code FROM Flights f WHERE COUNT(*) > 0"],
  ], "b", "LEFT JOIN + COUNT(b.id) שומר טיסות בלי הזמנות.", ["mysql"]),
  mc("le-16", "איזו שאילתה מחזירה נוסעים עם יותר מ-3 הזמנות?", [
    ["a", "SELECT passenger_id FROM Bookings WHERE COUNT(*) > 3 GROUP BY passenger_id"],
    ["b", "SELECT passenger_id FROM Bookings GROUP BY passenger_id HAVING COUNT(*) > 3"],
    ["c", "SELECT passenger_id FROM Bookings HAVING COUNT(*) > 3"],
    ["d", "SELECT DISTINCT passenger_id FROM Bookings WHERE bookings > 3"],
  ], "b", "סינון אגרגטיבי — HAVING אחרי GROUP BY.", ["mysql"]),
  mc("le-17", "מה ההבדל הנכון בין WHERE ל-HAVING?", [
    ["a", "WHERE אחרי GROUP BY"],
    ["b", "אין הבדל"],
    ["c", "WHERE לפני קיבוץ, HAVING על קבוצות אחרי קיבוץ"],
    ["d", "HAVING למיון בלבד"],
  ], "c", "WHERE מסנן שורות; HAVING מסנן קבוצות.", ["mysql"]),
  mc("le-18", "מה תחזיר השאילתה?", [
    ["a", "כל הטיסות"],
    ["b", "רק טיסות עם לפחות הזמנה אחת"],
    ["c", "רק טיסות בלי הזמנות"],
    ["d", "רק טיסות עם יותר מהזמנה אחת"],
  ], "b", "IN (SELECT flight_id FROM Bookings) — טיסות עם הזמנות.", ["mysql"], {
    code: "SELECT f.code FROM Flights f WHERE f.id IN (SELECT flight_id FROM Bookings);",
  }),
  mc("le-19", "מה מחזירה ExecuteNonQuery בדרך כלל?", [
    ["a", "MySqlDataReader"],
    ["b", "ערך יחיד"],
    ["c", "מספר השורות שהושפעו"],
    ["d", "רשימת אובייקטים"],
  ], "c", "int — מספר שורות שהושפעו.", ["mysql"]),
  mc("le-20", "מה יקרה ב-ExecuteScalar בלי conn.Open()?", [
    ["a", "x יהיה 0"],
    ["b", "x יהיה null"],
    ["c", "חריגת זמן ריצה — החיבור לא פתוח"],
    ["d", "שגיאת קומפילציה"],
  ], "c", "חייבים לפתוח חיבור לפני פקודות.", ["mysql"], {
    code: "MySqlConnection conn = new MySqlConnection(cs);\nMySqlCommand cmd = new MySqlCommand(\"SELECT COUNT(*) FROM Bookings\", conn);\nobject x = cmd.ExecuteScalar();",
  }),
  mc("le-21", "למה משתמשים בפרמטרים בשאילתות SQL?", [
    ["a", "לאפשר GROUP BY"],
    ["b", "למנוע SQL Injection ולטפל בטיפוסים"],
    ["c", "להאיץ SELECT תמיד"],
    ["d", "להימנע מ-using"],
  ], "b", "פרמטרים מונעים שרשור מסוכן של קלט משתמש.", ["mysql"]),
  mc("le-22", "מה יודפס?", [
    ["a", "X"],
    ["b", "D"],
    ["c", "F"],
    ["d", "DF"],
  ], "d", "חלוקה באפס → catch מדפיס D, finally תמיד מדפיס F.", ["exceptions"], {
    code: "try {\n  int a = 10, b = 0;\n  int c = a / b;\n  Console.Write(\"X\");\n} catch (DivideByZeroException) {\n  Console.Write(\"D\");\n} finally {\n  Console.Write(\"F\");\n}",
  }),
  mc("le-23", "מה יודפס?", [
    ["a", "100"],
    ["b", "150"],
    ["c", "300"],
    ["d", "שגיאת קומפילציה"],
  ], "c", "t מצביע על BusinessTicket — Price מחזיר 300.", ["polymorphism"], {
    code: "class Ticket { public virtual int Price() { return 100; } }\nclass EconomyTicket : Ticket { public override int Price() { return 150; } }\nclass BusinessTicket : Ticket { public override int Price() { return 300; } }\nTicket t = new BusinessTicket();\nConsole.WriteLine(t.Price());",
  }),
  mc("le-24", "מה יודפס?", [
    ["a", "Flight"],
    ["b", "Domestic"],
    ["c", "Charter"],
    ["d", "שגיאת קומפילציה"],
  ], "b", "f מטיפוס DomesticFlight — new ב-Charter לא משתתף בפולימורפיזם.", ["polymorphism"], {
    code: "class Flight { public virtual string TypeName() { return \"Flight\"; } }\nclass DomesticFlight : Flight { public override string TypeName() { return \"Domestic\"; } }\nclass CharterFlight : DomesticFlight { public new string TypeName() { return \"Charter\"; } }\nDomesticFlight f = new CharterFlight();\nConsole.WriteLine(f.TypeName());",
  }),
  mc("le-25", "מה יודפס?", [
    ["a", "10"],
    ["b", "30"],
    ["c", "40"],
    ["d", "60"],
  ], "c", "פולימורפיזם ברשימה: 10 + 30 + 0 = 40.", ["polymorphism"], {
    code: "class Passenger { public virtual int Points() { return 10; } }\nclass VipPassenger : Passenger { public override int Points() { return 30; } }\nclass CrewMember : Passenger { public override int Points() { return 0; } }\nList<Passenger> list = new List<Passenger>();\nlist.Add(new Passenger());\nlist.Add(new VipPassenger());\nlist.Add(new CrewMember());\nint total = 0;\nforeach (Passenger p in list) total += p.Points();\nConsole.WriteLine(total);",
  }),
  mc("le-26", "מה הערך של s?", [
    ["a", "A"],
    ["b", "B"],
    ["c", "BC"],
    ["d", "AC"],
  ], "c", "C.F() קורא base.F() → B, ואז מוסיף C.", ["polymorphism"], {
    code: "class A { public virtual string F() { return \"A\"; } }\nclass B : A { public override string F() { return \"B\"; } }\nclass C : B { public override string F() { return base.F() + \"C\"; } }\nA obj = new C();\nstring s = obj.F();",
  }),
];

const all = [...practiceExam, ...lilachExam];
const seenId = new Set();
const deduped = all.filter((q) => {
  if (seenId.has(q.id)) return false;
  seenId.add(q.id);
  return true;
});

fs.writeFileSync(OUT, JSON.stringify(deduped, null, 2), "utf8");
console.log(`Wrote ${deduped.length} exam questions to final-exam.json`);
