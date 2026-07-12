function section(id, title, paragraphs, callouts) {
  const content = (Array.isArray(paragraphs) ? paragraphs : [paragraphs]).join("\n\n");
  const block = { id, title, content };
  if (callouts && callouts.length > 0) block.callouts = callouts;
  return block;
}

function c(type, title, content) {
  return { type, title, content };
}

const CHAPTER_ENRICHMENTS = {
  introduction: {
    estimatedMinutes: 60,
    introduction: {
      what: "פרק הרענון מכסה את יסודות C#: תהליך הקומפילציה ב-.NET, טיפוסי נתונים, משתנים וביטויים, קלט/פלט, תנאים, לולאות, מערכים ו-scope — כפי שנלמד בשיעור 1.",
      why: "קורס תכנות מתקדם בונה ישירות על ידע זה. שאלות מבחן על short-circuit, x++/++x, CLR ו-Main חוזרות שוב ושוב.",
      when: "בתחילת כל פרויקט Console, בכל קוד שקורא קלט, מבצע חישובים, בוחר מסלול ב-if/switch, או עובד עם מערכים.",
    },
    sections: [
      section("compilation-overview", "מקמפל מול מפרש", [
        "מקמפל מתרגם את כל קוד המקור לפני ההרצה. שגיאות תחביר מתגלות מראש — התוכנית לא תרוץ עד שמתקנים.",
        "מפרש מתרגם ומריץ שורה-שורה בזמן ריצה. שגיאה עלולה להופיע רק כשמגיעים לשורה הבעייתית.",
        "ב-C# אנחנו עובדים עם קומפילציה — זה מאפשר לתפוס באגים מוקדם ולייצר קוד יעיל יותר.",
      ], [c("exam", "לזכור", "שגיאת תחביר = קומפילציה. חריגה בזמן ריצה = Exception.")]),
      section("dotnet-pipeline", "תהליך הקומפילציה ב-.NET", [
        "שלב 1: קוד C# נכתב על ידי המפתח.",
        "שלב 2: הקומפיילר מייצר IL (Intermediate Language) — קוד ביניים שאינו תלוי במעבד ספציפי.",
        "שלב 3: CLR (Common Language Runtime) מתרגם IL לקוד מכונה בזמן ריצה (JIT) ומריץ את התוכנית.",
        "יתרונות: ניידות בין מערכות עם .NET, ניהול זיכרון אוטומטי (GC), אבטחה מנוהלת.",
        "חסרונות: נדרש Runtime מותקן, עומס קל מ-JIT.",
      ], [
        c("info", "CLR", "לא 'מקמפל' C# ל-IL — זה תפקיד הקומפיילר. CLR מריץ IL ומנהל זיכרון."),
        c("exam", "שלושה שלבים", "C# → IL (קומפילציה) → מכונה (CLR/JIT בזמן ריצה)"),
      ]),
      section("main-entry", "נקודת כניסה — Main", [
        "כל תוכנית Console חייבת מתודת Main כנקודת כניסה.",
        "בלי Main — שגיאת קומפילציה: אין נקודת התחלה לתוכנית.",
        "Visual Studio יוצרת אוטומטית מחלקת Program עם Main בפרויקט Console חדש.",
      ], [c("exam", "Main חסרה", "שגיאת קומפילציה — לא שגיאת ריצה.")]),
      section("types", "טיפוסי נתונים", [
        "int — מספרים שלמים. double — ממשיים. bool — true/false. char — תו בודד במרכאות בודדות. string — מחרוזת במרכאות כפולות. void — 'ללא ערך' (למתודות).",
        "const יוצר קבוע שלא ניתן לשנות אחרי אתחול. מקובל לכתוב שמות const באותיות גדולות.",
        "בחירת טיפוס נכונה חוסכת באגים: אל תשתמשו ב-double לספירה שלמות.",
      ]),
      section("variables-expressions", "משתנים וביטויים", [
        "הצהרה: int x, y; או int z = 5;",
        "ביטויים משלבים משתנים, קבועים ואופרטורים. z = z + 1 ו-z++ שקולים להגדלת z ב-1.",
        "שרשור מחרוזות: \"hello\" + \"world\" → \"helloworld\". \"4\" + 5 → \"45\" (המרה מרומזת ל-string).",
      ], [c("warning", "שרשור מול חיבור", "\"4\" + 5 מדפיס 45, לא 9. להמרה מפורשת: int.Parse(\"4\") + 5")]),
      section("increment", "Postfix ו-Prefix — x++ ו-++x", [
        "x++ (postfix): מחזיר את הערך הנוכחי, ואז מגדיל את x ב-1.",
        "++x (prefix): מגדיל את x ב-1, ואז מחזיר את הערך החדש.",
        "בביטוי x++ + ++x עם x=5: קודם x++ מחזיר 5 (x הופך ל-6), אחר כך ++x מגדיל ל-7 ומחזיר 7. התוצאה: 12.",
        "הערכה היא משמאל לימין — סדר האופרנדים קובע.",
      ], [c("exam", "שאלת קלאסית", "x=5 → x++ + ++x = 12, לא 11 ולא 13.")]),
      section("io", "קלט ופלט", [
        "Console.ReadLine() תמיד מחזיר string. להמרה: Convert.ToInt32, Convert.ToDouble, int.Parse.",
        "int.Parse על קלט לא מספרי זורק חריגה. TryParse עדיף לקלט משתמש — מחזיר bool ו-out.",
        "WriteLine מוסיף מעבר שורה. Write לא. שניהם תומכים בשרשור עם +.",
      ]),
      section("boolean", "ביטויים בוליאניים", [
        "אופרטורים יחסיים: ==, !=, <, <=, >, >=.",
        "אופרטורים לוגיים: && (AND), || (OR), ! (NOT).",
        "ביטוי בוליאני משמש ב-if, while, for.",
      ]),
      section("short-circuit", "Short-circuit evaluation", [
        "ב-&&: אם התנאי הראשון false — השני לא נבדק.",
        "ב-||: אם התנאי הראשון true — השני לא נבדק.",
        "דוגמה: int x=5, y=0; if(x>3 || y++>0) — y++ לא רץ כי x>3 כבר true. y נשאר 0.",
        "שונה מ-& ו-| שתמיד מעריכים שני הצדדים.",
      ], [
        c("exam", "y++ ב-||", "אם הצד הראשון true — y++ לא מתבצע!"),
        c("tip", "שימוש מעשי", "short-circuit חוסך חישוב ומונע קריאות מיותרות — אבל גם מסתיר side effects."),
      ]),
      section("control-if", "if/else ו-switch", [
        "if/else לבחירה בין שני מסלולים. ניתן לקנן if בתוך if — מומלץ סוגריים {} גם לשורה בודדת.",
        "switch משווה ערך יחיד למקרים רבים. break מונע fall-through — אלא אם כוונתם לכך במכוון (כמו בדוגמת חודשים בקורס).",
        "default תופס כל ערך שלא התאים ל-case.",
      ]),
      section("loops", "לולאות", [
        "while — בודק תנאי לפני כל איטרציה. עלול לא לרוץ אפילו פעם אחת.",
        "for — אתחול, תנאי ועדכון בשורה אחת. אידיאלי כשיודעים כמה איטרציות.",
        "do-while — גוף הלולאה רץ לפחות פעם אחת, התנאי נבדק אחרי הגוף.",
        "break יוצא מהלולאה מיד. שכחת לעדכן משתנה ב-while → לולאה אינסופית.",
      ], [c("exam", "do-while", "הלולאה היחידה שמבטיחה הרצה לפחות פעם אחת.")]),
      section("scope", "Scope וטווח חיים", [
        "משתנה מקומי נגיש רק בבלוק שבו הוגדר (הבלוק הפנימי ביותר).",
        "לא ניתן להגדיר משתנה באותו שם פעמיים באותו בלוק — שגיאת קומפילציה.",
        "משתנה v בתוך if לא נגיש מחוץ ל-if.",
      ]),
      section("arrays", "מערכים", [
        "מערך = אוסף מסודר באינדקסים. אינדקסים מתחילים מ-0.",
        "int[] arr = new int[9] — אינדקסים תקינים: 0 עד 8. arr[9] → IndexOutOfRangeException.",
        "Length מחזיר גודל. בלולאת for: i < arr.Length — לא i <= Length.",
        "מערך בגודל קבוע — לא גדל אוטומטית.",
      ], [c("exam", "אינדקס 9 במערך 9", "שגיאת ריצה — IndexOutOfRangeException.")]),
    ],
    codeExamples: [
      {
        id: "intro-3",
        title: "Short-circuit עם ||",
        level: "intermediate",
        code: "int x = 5, y = 0;\nif (x > 3 || y++ > 0)\n    Console.WriteLine(y); // 0",
        language: "csharp",
        explanation: "y++ לא רץ כי x>3 כבר true.",
      },
      {
        id: "intro-4",
        title: "x++ + ++x",
        level: "intermediate",
        code: "int x = 5;\nConsole.WriteLine(x++ + ++x); // 12",
        language: "csharp",
        explanation: "5 + 7 = 12. x בסוף הביטוי הוא 7.",
      },
    ],
    commonMistakes: [
      { title: "בלבול חיבור ושרשור", description: "\"4\" + 5 מדפיס 45", why: "+ עם string משרשר", howToAvoid: "המרו למספר לפני חישוב" },
      { title: "שכחת עדכון ב-while", description: "לולאה אינסופית", why: "התנאי נשאר true", howToAvoid: "עדכנו משתנה בגוף הלולאה" },
      { title: "אינדקס מחוץ לטווח", description: "i <= arr.Length", why: "אינדקס אחרון הוא Length-1", howToAvoid: "i < arr.Length" },
      { title: "הנחה ש-y++ תמיד רץ", description: "בתנאי ||/&&", why: "short-circuit", howToAvoid: "בדקו אם הצד הראשון קובע את התוצאה" },
    ],
    examTips: [
      "CLR מריץ IL — לא ממיר C# ל-IL",
      "short-circuit: y++ ב-|| עלול לא לרוץ",
      "x++ + ++x עם x=5 → 12",
      "אין Main → שגיאת קומפילציה",
      "מערך[9] בגודל 9 → אינדקסים 0-8",
      "do-while רץ לפחות פעם אחת",
      "const לא ניתן לשינוי",
    ],
    comparisons: [
      {
        title: "while מול for",
        left: "while",
        right: "for",
        rows: [
          { aspect: "מבנה", left: "תנאי בראש", right: "אתחול+תנאי+עדכון" },
          { aspect: "מתי", left: "איטרציות לא ידועות", right: "איטרציות ידועות" },
        ],
      },
      {
        title: "&& מול &",
        left: "&& (short-circuit)",
        right: "& (ללא short-circuit)",
        rows: [
          { aspect: "הערכה", left: "עוצר כשאפשר", right: "תמיד שני הצדדים" },
          { aspect: "שימוש", left: "תנאים לוגיים", right: "ביטים (נדיר בקורס)" },
        ],
      },
    ],
    summary: "פרק הרענון הוא הבסיס לכל הקורס: קומפילציה ו-CLR, טיפוסים, ביטויים, short-circuit, לולאות ומערכים. שליטה כאן = פחות טעויות במבחן ובפרויקטים.",
  },

  "classes-objects": {
    estimatedMinutes: 55,
    introduction: {
      what: "מבוא לתכנות מונחה עצמים: מחלקות כתבנית (Blueprint), אובייקטים כמופעים, בנאים, שדות ומתודות — לפי שיעור 2.",
      why: "OOP הוא לב הקורס. בלי הבנה של class מול object אי אפשר להמשיך לירושה, פולימורפיזם ופרויקט הספרייה.",
      when: "בכל פעם שמגדירים מבנה נתונים עם התנהגות — Person, Book, Pet, Library.",
    },
    sections: [
      section("oop-intro", "מהו OOP?", [
        "תכנות מונחה עצמים מחלק את התוכנית ליחידות — אובייקטים — שכל אחד מחזיק נתונים ומתודות.",
        "אובייקטים מתקשרים ביניהם בקריאות מתודה — לא רק בפונקציות גלובליות.",
        "ארבעת עמודי OOP בקורס: אינקפסולציה, ירושה, פולימורפיזם, הפשטה (ממשקים/abstract).",
      ]),
      section("class-vs-object", "מחלקה מול אובייקט", [
        "מחלקה (class) = תבנית/שרטוט. מגדירה מה יכול להיות לאובייקט.",
        "אובייקט (object/instance) = מופע קונקרטי בזיכרון עם ערכים ספציפיים.",
        "אנלוגיה: מחלקת Person היא 'טופס'; אובייקט 'דנה, גיל 25' הוא מופע מלא.",
      ], [c("exam", "הגדרה", "class = תבנית, object = מופע בזיכרון.")]),
      section("class-components", "רכיבי מחלקה", [
        "שדות (fields/attributes) — משתנים ששייכים לאובייקט.",
        "בנאים (constructors) — מתודה מיוחדת לאתחול. שם זהה למחלקה, ללא return.",
        "מתודות (methods) — התנהגות: פעולות שהאובייקט מבצע.",
      ]),
      section("constructors", "בנאים", [
        "בנאי חייב שם זהה לשם המחלקה.",
        "אין return type — לא int, לא void.",
        "ניתן לעשות overloading לבנאים — פרמטרים שונים.",
        "בלי בנאי מפורש — הקומפיילר יוצר בנאי ברירת מחדל (אם אין בנאים אחרים).",
      ], [c("exam", "בנאי", "שם = שם המחלקה. לא static. לא return.")]),
      section("creating-objects", "יצירת אובייקט — new", [
        "תחביר: MyClass obj = new MyClass();",
        "new מקצה זיכרון לעצם וקורא לבנאי.",
        "כל אובייקט הוא עותק נפרד — שינוי באחד לא משפיע באחר (למעט static).",
      ]),
      section("fields-access", "שדות ונראות", [
        "public — נגיש מכל מקום. private — רק בתוך המחלקה.",
        "בקורס מדגישים להסתיר נתונים (private) ולחשוף דרך מתודות או properties.",
        "שדה public פשוט — מהיר ללמידה אך פחות בטוח.",
      ]),
      section("methods-basics", "מתודות בסיסיות", [
        "מתודה = פונקציה ששייכת למחלקה. קוראים דרך אובייקט: obj.Method().",
        "פרמטרים וערך מוחזר — כמו פונקציות רגילות.",
        "void = אין ערך מוחזר.",
      ]),
      section("this-keyword", "מילת this", [
        "this מפנה לאובייקט הנוכחי.",
        "שימושי כשפרמטר בבנאי בשם זהה לשדה: this.name = name.",
        "מאפשר להבדיל בין שדה למשתנה מקומי.",
      ]),
      section("memory-model", "אובייקטים בזיכרון", [
        "משתנה מחזיק הפניה (reference) לאובייקט בזיכרון heap.",
        "שני משתנים יכולים להצביע לאותו אובייקט.",
        "כשאין הפניות — GC של CLR משחרר זיכרון.",
      ]),
      section("person-example", "דוגמת Person מהקורס", [
        "מחלקת Person עם שם וגיל, בנאי שמאתחל, ו-PrintInfo שמדפיס.",
        "יצירת Person p = new Person(\"דנה\", 25) ואז p.PrintInfo().",
        "זו התבנית לכל מחלקה בפרויקטים הבאים.",
      ]),
      section("main-in-class", "Main ומחלקות", [
        "Main יכולה להיות בתוך מחלקה Program.",
        "ממנה יוצרים אובייקטים וקוראים למתודות.",
        "הפרדה בין לוגיקה ראשית (Main) לבין מחלקות עסקיות.",
      ]),
    ],
    codeExamples: [
      {
        id: "co-2",
        title: "בנאי עם this",
        level: "basic",
        code: "class Person {\n  private string _name;\n  public Person(string name) {\n    this._name = name;\n  }\n}",
        language: "csharp",
        explanation: "this מבדיל בין פרמטר לשדה.",
      },
      {
        id: "co-3",
        title: "יצירת מספר אובייקטים",
        level: "basic",
        code: "Person a = new Person(\"דנה\");\nPerson b = new Person(\"יוסי\");\na.PrintInfo();\nb.PrintInfo();",
        language: "csharp",
        explanation: "שני מופעים נפרדים מאותה מחלקה.",
      },
    ],
    commonMistakes: [
      { title: "בלבול class ו-object", description: "חושבים ש-Person הוא אובייקט", why: "Person היא מחלקה", howToAvoid: "new Person() יוצר אובייקט" },
      { title: "בנאי עם return", description: "public void Person()", why: "בנאי לא מחזיר ערך", howToAvoid: "ללא return type" },
      { title: "שכחת new", description: "Person p; p.PrintInfo()", why: "p הוא null", howToAvoid: "p = new Person()" },
    ],
    examTips: ["class=תבנית, object=מופע", "בנאי = שם המחלקה", "new מקצה וקורא לבנאי", "בנאים ניתנים ל-overload"],
    comparisons: [
      {
        title: "מחלקה מול אובייקט",
        left: "Class",
        right: "Object",
        rows: [
          { aspect: "מהות", left: "תבנית", right: "מופע קונקרטי" },
          { aspect: "כמות", left: "הגדרה אחת", right: "רבים ממחלקה אחת" },
        ],
      },
    ],
    summary: "מחלקה מגדירה מבנה והתנהגות; אובייקט הוא מופע חי בזיכרון. בנאים מאתחלים; מתודות מגדירות פעולות.",
  },

  "methods-encapsulation": {
    estimatedMinutes: 55,
    introduction: {
      what: "מתודות מתקדמות, חתימות, overloading, scope, getters/setters, static — המשך שיעור 2.",
      why: "אינקפסולציה מגנה על נתונים ומאפשרת שינוי מימוש פנימי בלי לשבור קוד חיצוני.",
      when: "בכל מחלקה שצריכה להסתיר שדות ולחשוף ממשק מבוקר.",
    },
    sections: [
      section("method-signature", "חתימת מתודה", ["שם + סוגי פרמטרים + ערך מוחזר = חתימה.", "שינוי חתימה מאפשר overloading — אותו שם, פרמטרים שונים.", "המהדר בוחר את המתודה הנכונה בזמן קומפילציה."]),
      section("overloading", "Overloading", ["אותה מחלקה, שם מתודה זהה, רשימות פרמטרים שונות.", "חל גם על בנאים — Dog(), Dog(string), Dog(string, double).", "לא ניתן לעשות overload רק לפי return type."]),
      section("encapsulation", "אינקפסולציה", ["הסתרת נתונים פנימיים (private) וחשיפת ממשק מבוקר.", "מונע שינוי ישיר שמפר את חוקי העסק (גיל שלילי, מחיר שלילי).", "עקרון: שדות private, גישה דרך מתודות או properties."]),
      section("getters-setters", "Getters ו-Setters", ["getName() מחזיר ערך. setName(value) מעדכן עם אימות.", "if (value > 0) this.price = value — דוגמה מהקורס ל-Furniture.", "מכינים את הקרקע ל-Properties בפרק הבא."]),
      section("static", "static", ["שייך למחלקה, לא למופע. קוראים ClassName.Method().", "משתנה static אחד משותף לכל המופעים.", "Main היא static — נקראת בלי ליצור אובייקט Program."]),
      section("scope-methods", "Scope במתודות", ["משתנה מקומי במתודה — רק בתוך המתודה.", "פרמטרים — כמו משתנים מקומיים.", "שדה מחלקה — נגיש בכל המתודות של המחלקה."]),
      section("pass-by-value", "העברת פרמטרים", ["טיפוסי ערך (int, double) — עותק. שינוי בפרמטר לא משנה את המקור.", "טיפוסי הפניה — מעבירים הפניה; שינוי באובייקט נראה בחוץ.", "חשוב להבין בהעברת מערכים ואובייקטים."]),
      section("validation", "אימות ב-setter", ["setPrice: if (p > 0) price = p; — לא שומר ערכים לא חוקיים.", "שכבת הגנה ראשונה לפני חריגות.", "עדיף מניעה על פני try/catch."]),
      section("furniture-demo", "דוגמת Furniture מהקורס", ["שדות protected price, height...", "מתודות get/set עם אימות.", "Chair יורש ומשתמש ב-protected ב-operator ==."]),
      section("design-principles", "עקרונות עיצוב", ["DRY — אל תחזרו קוד. מתודות משותפות במחלקת בסיס.", "ממשק ברור — שמות מתודות אומרים מה קורה.", "הכנה לירושה ולפולימורפיזם."]),
    ],
    codeExamples: [
      { id: "me-1", title: "Overloading", level: "basic", code: "void Print(int x) { }\nvoid Print(string s) { }", language: "csharp", explanation: "חתימות שונות — אותו שם." },
      { id: "me-2", title: "Getter/Setter", level: "basic", code: "private double price;\npublic void setPrice(double p) {\n  if (p > 0) price = p;\n}", language: "csharp", explanation: "אימות לפני שמירה." },
    ],
    commonMistakes: [
      { title: "שדות public ישירות", description: "כל אחד משנה price", why: "אין אימות", howToAvoid: "private + setter" },
      { title: "בלבול static ו-instance", description: "obj.Method() על static", why: "static שייך למחלקה", howToAvoid: "ClassName.Method()" },
    ],
    examTips: ["overloading = חתימות שונות", "static = שייך למחלקה", "encapsulation = private שדות", "set עם אימות"],
    comparisons: [{ title: "instance מול static", left: "Instance", right: "Static", rows: [{ aspect: "שייכות", left: "לאובייקט", right: "למחלקה" }, { aspect: "קריאה", left: "obj.M()", right: "Class.M()" }] }],
    summary: "מתודות עם overloading, אינקפסולציה עם getters/setters, ו-static — בסיס לעיצוב מחלקות נכון.",
  },

  inheritance: {
    estimatedMinutes: 60,
    introduction: {
      what: "ירושה: מחלקה יורשת (Derived) ממחלקת בסיס (Base), מקבלת שדות ומתודות, מוסיפה והרחיבה.",
      why: "DRY, היררכיית IS-A, קוד משותף במקום אחד.",
      when: "Dog : Pet, PhysicalBook : Book, Fiction : PaperBook : Book.",
    },
    sections: [
      section("inheritance-def", "מהי ירושה?", ["תחביר: class Dog : Pet", "יורש מקבל שדות ומתודות public/protected מהבסיס.", "מוסיף שדות ומתודות משלו.", "מטרות: שימוש חוזר, הרחבה, פולימורפיזם."]),
      section("isa", "IS-A", ["Dog IS-A Pet — כלב הוא סוג של חיה.", "ירושה מבטאת יחס 'הוא סוג של'.", "לא כל קשר לוגי דורש ירושה — לפעמים HAS-A (קומפוזיציה)."]),
      section("single-inheritance", "ירושה יחידה ב-C#", ["מחלקה יורשת ממחלקת בסיס אחת בלבד.", "class X : A, B — לא חוקי ב-C#.", "לחוזים מרובים — ממשקים (interfaces)."]),
      section("access-modifiers", "מודיפיירי גישה", ["public — הכל. private — רק המחלקה. protected — מחלקה + יורשים.", "יורש לא רואה private של הבסיס.", "protected אידיאלי לשיתוף עם יורשים."]),
      section("constructors-inheritance", "בנאים וירושה", ["בנאי של בסיס לא יורש אוטומטית.", "ביורש: public Dog(string r, double w) : base(w) { }", "סדר: הקצאת זיכרון לבסיס → בנאי בסיס → זיכרון ליורש → בנאי יורש."]),
      section("base-keyword", "מילת base", ["קריאה לבנאי בסיס: : base(args).", "קריאה למתודת בסיס: base.Method().", "שימושי כש-override מוסיף ולא מחליף לגמרי."]),
      section("levels", "רמות ירושה", ["חד-שלבית: DigitalBook : Book.", "רב-שלבית: Fiction : PaperBook : Book.", "שרשרת ארוכה — כל יורש מקבל מהבסיס ומעלה."]),
      section("book-hierarchy", "היררכיית Book", ["Book — שדות משותפים: כותרת, מחבר.", "PaperBook, DigitalBook — מאפיינים ייחודיים.", "דוגמה מרכזית לפרויקט הספרייה."]),
      section("field-access-derived", "גישה לשדות בסיס", ["יורש יכול לגשת ל-public ו-protected של הבסיס.", "obj.x ביורש — x יכול להיות שדה שהוגדר בבסיס.", "שאלה במבחן: איזה שדות נגישים."]),
      section("when-not-inherit", "מתי לא לרשת?", ["HAS-A — Agent עם Car, לא Agent : Car.", "ירושה רק ל-IS-A אמיתי.", "עומס ירושה מורכבת — לשקול קומפוזיציה."]),
    ],
    codeExamples: [
      { id: "inh-2", title: "שרשרת בנאים", level: "intermediate", code: "class Dog : Pet {\n  public Dog(string race, double w) : base(w) {\n    Race = race;\n  }\n}", language: "csharp", explanation: "base(w) קורא לבנאי Pet." },
    ],
    commonMistakes: [
      { title: "שכחת base()", description: "שדות בסיס לא מאותחלים", why: "בנאי לא יורש", howToAvoid: ":base(...)" },
      { title: "multiple inheritance", description: "class X : A, B", why: "C# לא תומך", howToAvoid: "ממשקים" },
    ],
    examTips: ["בנאי לא יורש", "protected ליורשים", "C# ירושה יחידה", "base() לפני גוף יורש", "obj.x גם משדות בסיס"],
    comparisons: [{ title: "Single מול Multi level", left: "רמה אחת", right: "מספר רמות", rows: [{ aspect: "דוגמה", left: "DigitalBook:Book", right: "Fiction:PaperBook:Book" }] }],
    summary: "ירושה בונה IS-A, חוסכת כפילות, דורשת תשומת לב לבנאים, protected ומגבלת ירושה יחידה.",
  },

  polymorphism: {
    estimatedMinutes: 60,
    introduction: {
      what: "פולימורפיזם: Overloading (סטטי) ו-Overriding (דינמי), virtual/override, Object.",
      why: "קוד גמיש — אותו ממשק, התנהגות שונה לפי סוג אובייקט בפועל.",
      when: "Pet p = new Dog(); p.Eat() → מימוש של Dog.",
    },
    sections: [
      section("poly-meaning", "משמעות פולימורפיזם", ["'צורות רבות' — אובייקט מתנהג אחרת לפי הקשר.", "מאפשר לכתוב קוד שעובד עם מחלקת בסיס ומקבל יורשים שונים."]),
      section("overloading", "Overloading — פולימורפיזם סטטי", ["אותה מחלקה, שם זהה, פרמטרים שונים.", "נפתר בזמן קומפילציה — המהדר בוחר חתימה.", "כולל בנאים ומתודות רגילות."]),
      section("overriding", "Overriding — פולימורפיזם דינמי", ["virtual בבסיס, override ביורש.", "אותה חתימה. מימוש שונה.", "נפתר בזמן ריצה לפי סוג האובייקט האמיתי."]),
      section("virtual-override", "virtual ו-override", ["בלי virtual — לא ניתן override אמיתי.", "override מחליף מימוש. דורש virtual/abstract בבסיס.", "Pet p = new Dog(); p.Eat() — קורא ל-Eat של Dog אם override."]),
      section("method-hiding", "Method Hiding", ["מתודה ביורש בלי override — מסתירה (new).", "Base b = new Derived(); b.Show() → Show של Base.", "לא פולימורפיזם דינמי — הטיפוס הסטטי קובע."]),
      section("object-class", "מחלקת Object", ["כל מחלקה יורשת מ-Object.", "ToString(), Equals(), GetHashCode() — ניתן לדרוס.", "מומלץ לדרוס ToString לייצוג משמעותי."]),
      section("poly-array", "מערך פולימורפי", ["Pet[] pets = { new Dog(), new Fish(), new Pet() };", "לולאה: pets[i].Eat() — כל אחד לפי סוגו.", "דפוס מרכזי בפרויקט Pet ובספרייה."]),
      section("pet-project", "פרויקט Pet", ["Pet.Eat virtual, Dog.Eat override.", "pet2 = new Dog(); pet2.Eat() → Dog.", "hideBone() רק ב-Dog — לא דרך Pet בלי cast."]),
      section("overload-vs-override", "Overloading מול Overriding", ["Overload: אותה מחלקה, חתימות שונות, קומפילציה.", "Override: ירושה, חתימה זהה, ריצה.", "שאלה נפוצה במבחן — אל תבלבלו!"]),
      section("exam-scenarios", "תרחישי מבחן", ["מה יודפס אחרי Pet p = new Dog(); p.Eat();", "האם override דורש virtual? כן.", "Overloading בבנאים — כמה בנאים באותה מחלקה."]),
    ],
    commonMistakes: [
      { title: "בלבול overload ו-override", description: "שניהם 'אותו שם'", why: "מנגנונים שונים", howToAvoid: "overload=חתימות, override=ירושה" },
      { title: "שכחת virtual", description: "override לא עובד", why: "צריך virtual בבסיס", howToAvoid: "virtual + override" },
    ],
    examTips: ["override דורש virtual", "בלי override — hiding", "טיפוס ריצה קובע", "Overloading ≠ Overriding", "Pet p=new Dog(); p.Eat() → Dog"],
    comparisons: [{ title: "override מול overload", left: "Override", right: "Overload", rows: [{ aspect: "מתי", left: "ירושה", right: "אותה מחלקה" }, { aspect: "פתרון", left: "ריצה", right: "קומפילציה" }] }],
    summary: "פולימורפיזם סטטי (overloading) ודינמי (virtual/override) — לב OOP ולפרויקטים בקורס.",
  },

  "casting-relationships": {
    estimatedMinutes: 55,
    introduction: {
      what: "יחסי IS-A ו-HAS-A, Upcasting, Downcasting, is, as — שיעור 5.",
      why: "מאפשר לעבוד עם טיפוס בסיס ולהתמחות ליורש כשצריך.",
      when: "מערך Pet[], קריאה ל-hideBone(), דוחות לפי סוג ספר.",
    },
    sections: [
      section("isa-deep", "IS-A — ירושה", ["Dog IS-A Pet. כל Dog הוא Pet.", "Upcasting טבעי: Pet p = new Dog();", "מאפשר פולימורפיזם."]),
      section("hasa", "HAS-A — קומפוזיציה", ["Agent HAS-A Car — בעלות, לא ירושה.", "אובייקטים נפרדים; Agent מחזיק הפניה ל-Car.", "לא IS-A: סוכן אינו מכונית."]),
      section("upcasting", "Upcasting", ["המרה מיורש לבסיס — מרומזת ובטוחה.", "Pet p = new Dog(); — תמיד תקין.", "מאבדים גישה למתודות שרק ביורש (hideBone)."]),
      section("downcasting", "Downcasting", ["המרה מבסיס ליורש: Dog d = (Dog)p;", "סיכון: InvalidCastException אם האובייקט לא באמת Dog.", "תמיד בדקו עם is לפני cast."]),
      section("is-operator", "אופרטור is", ["if (pet is Dog) { ... }", "מחזיר bool — האם האובייקט מהטיפוס.", "C# מודרני: if (pet is Dog d) — cast ומשתנה בבת אחת."]),
      section("as-operator", "אופרטור as", ["Dog d = pet as Dog;", "מחזיר null בכישלון — לא זורק חריגה.", "עדיף כשלא בטוחים בסוג."]),
      section("compile-vs-runtime", "שגיאות קומפילציה מול ריצה", ["pet.hideBone() — לא מתקמפל: Pet לא מכיר hideBone.", "Downcast ואז hideBone() — תקין.", "הטיפוס הסטטי של המשתנה קובע מה המהדר מאפשר."]),
      section("poly-cast-combo", "Casting + פולימורפיזם", ["Pet[] עם Dog ו-Fish. לולאה: Eat פולימורפי.", "is Fish → גישה ל-Color. is Dog → hideBone()."]),
      section("exam-trick", "טריק מבחן: A obj = new B()", ["obj is B → true (האובייקט בפועל הוא B).", "גישה למתודות של B דורשת cast אם obj מטיפוס A.", "הבחנה בין טיפוס סטטי לדינמי."]),
      section("when-cast", "מתי להשתמש?", ["Upcast — תמיד כשמעבירים לפונקציה שמקבלת בסיס.", "Downcast — כשיודעים/בודקים שצריך מתודה ייחודית ליורש."]),
    ],
    codeExamples: [
      { id: "cast-1", title: "is + downcast", level: "intermediate", code: "Pet p = new Dog();\nif (p is Dog d)\n    d.hideBone();", language: "csharp", explanation: "בדיקה בטוחה לפני גישה ל-Dog." },
    ],
    commonMistakes: [
      { title: "Downcast בלי בדיקה", description: "(Dog)pet על Fish", why: "InvalidCastException", howToAvoid: "is/as" },
      { title: "בלבול IS-A ו-HAS-A", description: "Agent : Car", why: "לא ירושה", howToAvoid: "HAS-A = שדה Car" },
    ],
    examTips: ["Upcast בטוח", "Downcast מסוכן", "is לפני cast", "as → null", "A obj=new B(); obj is B → true"],
    comparisons: [{ title: "IS-A מול HAS-A", left: "IS-A", right: "HAS-A", rows: [{ aspect: "קשר", left: "ירושה", right: "הרכבה" }, { aspect: "דוגמה", left: "Dog:Pet", right: "Agent+Car" }] }],
    summary: "Casting מחבר בין בסיס ליורש. is/as לבטיחות. IS-A לירושה, HAS-A לקומפוזיציה.",
  },

  properties: {
    estimatedMinutes: 50,
    introduction: {
      what: "Properties — get/set, auto-implemented, validation, backing field, גישה מבוקרת.",
      why: "אינקפסולציה נקייה יותר מ-getter/setter נפרדים. סטנדרט ב-C#.",
      when: "בכל שדה שצריך לחשוף עם אימות או read-only חלקי.",
    },
    sections: [
      section("property-syntax", "תחביר Property", ["public string Name { get { return _name; } set { _name = value; } }", "value — פרמטר מרומז ב-set (מה שהוקצה).", "get מחזיר, set מעדכן."]),
      section("backing-field", "שדה גיבוי", ["private string _name מאחסן את הערך בפועל.", "Property הוא 'שער' — לא הנתון עצמו.", "במבחן: backing field = private."]),
      section("auto-property", "Auto-implemented", ["public string Name { get; set; }", "הקומפיילר יוצר backing field אוטומטית.", "מתאים כשאין לוגיקה מיוחדת ב-get/set."]),
      section("default-value", "ברירת מחדל", ["public string City { get; set; } = \"New York\";", "אתחול אחרי הסוגריים.", "שאלה במבחן — תחביר נכון."]),
      section("access-control", "בקרת גישה", ["public int Score { get; private set; }", "קריאה מבחוץ, כתיבה רק במחלקה.", "דפוס נפוץ לנתונים שרק המחלקה מעדכנת."]),
      section("validation-set", "אימות ב-set", ["set { if (value >= 0) _age = value; }", "לא ניתן if מלא בתוך get ב-auto — validation ב-set בלבד.", "מונע ערכים לא חוקיים."]),
      section("value-keyword", "מילת value", ["obj.Age = 5 → ב-set, value הוא 5.", "לא הערך הישן — הערך החדש שהוקצה.", "טעות נפוצה במבחן."]),
      section("property-vs-field", "Property מול שדה public", ["Property מאפשר אימות ושינוי מימוש פנימי.", "שדה public — גישה ישירה, בלי הגנה.", "בפרויקטים — העדיפו properties."]),
      section("expression-bodied", "Expression-bodied", ["public string Name => _name;", "קיצור ל-get בלבד.", "לא מתאים ל-set עם validation מורכב."]),
      section("exam-properties", "שאלות מבחן", ["איזה בלוק מראה validation נכון? — set עם if.", "מהו backing field? — private.", "מהו value? — פרמטר ה-set."]),
    ],
    commonMistakes: [
      { title: "בלבול value", description: "value = ערך ישן", why: "value = חדש", howToAvoid: "obj.P=5 → value=5" },
      { title: "validation ב-get", description: "if בתוך get auto", why: "לא תחביר תקין", howToAvoid: "validation ב-set" },
    ],
    examTips: ["backing field = private", "value ב-set", "get private set", "ברירת מחדל אחרי { get; set; }", "validation ב-set"],
    comparisons: [{ title: "Property מול Field", left: "Property", right: "public field", rows: [{ aspect: "אימות", left: "כן", right: "לא" }] }],
    summary: "Properties = שער מבוקר. auto לפשטות; ידני ל-validation.",
  },

  "operator-overloading": {
    estimatedMinutes: 55,
    introduction: {
      what: "העמסת אופרטורים (+, ==, <, ++) למחלקות — Fish, Chair, Vector.",
      why: "סינטקס טבעי: fish1 == fish2, v * 5.",
      when: "השוואה או חיבור אובייקטים מותאמים.",
    },
    sections: [
      section("op-rules", "כללי העמסה", ["חייב public static.", "לפחות פרמטר אחד מהמחלקה.", "לא משנים קדימות אופרטורים.", "לא ממציאים אופרטורים חדשים (. לא ניתן)."]),
      section("binary-operators", "אופרטורים בינאריים", ["operator + (Point a, Point b)", "שני פרמטרים. מחזירים טיפוס (לרוב המחלקה).", "המהדר בוחר לפי חתימה בקומפילציה."]),
      section("unary-operators", "אופרטורים אונאריים", ["operator ++ (Vector v) — פרמטר יחיד מסוג המחלקה.", "static, public.", "++ , ! , true/false."]),
      section("pairs", "זוגות חובה", ["== דורש !=. < דורש >. <= דורש >=.", "אי-עמידה — שגיאת קומפילציה."]),
      section("immutability", "Immutability", ["אל תשנו אופרנדים — החזירו אובייקט חדש.", "p1 + p2 שמשנה p1 — פרקטיקה גרועה.", "כמו string ב-C#."]),
      section("equals-hashcode", "== , Equals , GetHashCode", ["עקביות: אם == אומר שווים — Equals ו-GetHashCode חייבים להתאים.", "חשוב ל-HashSet ו-Dictionary.", "override לשלושתם."]),
      section("null-check", "בדיקת null ב-==", ["if (obj == null) בתוך operator== → רקורסיה!", "השתמשו ב-ReferenceEquals(a, null).", "StackOverflowException — שאלה במבחן."]),
      section("fish-chair", "Fish ו-Chair מהקורס", ["Fish משווה Color, Length, Weight.", "Chair משווה height (protected) ו-Style.", "שניהם ReferenceEquals ל-null."]),
      section("non-overloadable", "מה לא ניתן להעמיס", [". (גישה לחבר), = (השמה), ?: ועוד.", "שאלה: איזה אופרטור לא ניתן — הנקודה."]),
      section("vector-scalar", "Vector * scalar", ["operator *(Vector v, int scalar) — סדר פרמטרים קובע.", "myVector * 5 עובד. 5 * myVector לא אלא אם הגדרתם גם."]),
    ],
    examTips: ["public static חובה", "זוגות == !=", "ReferenceEquals ל-null", "GetHashCode עם ==", "אל תשנו אופרנדים", ". לא ניתן להעמיס"],
    summary: "העמסת אופרטורים — static, זוגות, immutability, ועקביות עם Equals.",
  },

  "interfaces-abstract": {
    estimatedMinutes: 60,
    introduction: {
      what: "ממשקים (interface) ומחלקות מופשטות (abstract) — חוזה מול תבנית חלקית.",
      why: "גמישות: ממשקים מרובים, הפשטה בלי מימוש מלא.",
      when: "IChargeable ל-Phone ו-Car; Book abstract עם GetPrice.",
    },
    sections: [
      section("interface-def", "מהו ממשק?", ["מגדיר חוזה — מה, לא איך.", "אין שדות מופע (בחומר הקורס).", "מתודות ללא מימוש — המחלקה מממשת."]),
      section("implementing", "מימוש ממשק", ["class Phone : IChargeable { public void Charge() { } }", "מימוש חייב public.", "לא override — אין מימוש קודם בממשק."]),
      section("multiple-interfaces", "ממשקים מרובים", ["class X : IA, IB — מותר.", "מימוש אחד למתודה זהה בשני ממשקים — מספיק.", "לא ירושה מרובה של מחלקות."]),
      section("abstract-class", "מחלקה מופשטת", ["abstract class — לא ניתן new.", "יכולה: שדות, בנאים, מתודות קונקרטיות ומופשטות.", "abstract method — בלי גוף, יורש חייב לממש."]),
      section("abstract-vs-virtual", "abstract מול virtual", ["abstract — אין גוף, חובה לממש ביורש.", "virtual — יש גוף, אפשר לדרוס.", "שניהם במחלקה מופשטת."]),
      section("abstract-inheritance", "יורש של abstract", ["לא מממש abstract → המחלקה חייבת להיות abstract.", "מממש הכל → מחלקה קונקרטית.", "GetPrice() abstract ב-Book — כל יורש מחיר שונה."]),
      section("when-interface", "מתי ממשק?", ["חוזה התנהגות בין מחלקות לא קשורות.", "Phone ו-ElectricCar + IChargeable.", "Loose coupling — תלות בחוזה לא במימוש."]),
      section("when-abstract", "מתי abstract?", ["IS-A חזק + קוד משותף.", "שדות משותפים, מתודות משותפות.", "Book עם שדות + GetPrice abstract."]),
      section("no-instance", "אין מופעים", ["לא new IChargeable(). לא new Book() אם abstract.", "רק מחלקות קונקרטיות יוצרות אובייקטים."]),
      section("exam-interface", "שאלות מבחן", ["למה אין override בממשק? — אין בסיס.", "מה אסור בממשק? — שדות מופע.", "Employee עם PerformTask private — שגיאה, חייב public."]),
    ],
    codeExamples: [
      { id: "if-2", title: "abstract GetPrice", level: "intermediate", code: "abstract class Book {\n  public abstract double GetPrice();\n}", language: "csharp", explanation: "כל יורש חייב לממש." },
    ],
    examTips: ["ממשק ללא שדות מופע", "override לא לממשק", "abstract ללא מופע", "ממשקים מרובים מותרים", "מימוש public"],
    comparisons: [{ title: "Interface מול Abstract", left: "Interface", right: "Abstract", rows: [{ aspect: "שדות", left: "לא", right: "כן" }, { aspect: "ירושה", left: "מרובה", right: "יחידה" }] }],
    summary: "ממשק = חוזה. abstract = תבנית חלקית. בחרו לפי IS-A וקוד משותף.",
  },

  exceptions: {
    estimatedMinutes: 50,
    introduction: {
      what: "חריגות: try/catch/finally, סוגי שגיאות, TryParse, חריגות נפוצות.",
      why: "ניהול כשלים בזמן ריצה בלי לקרוס.",
      when: "קלט משתמש, חלוקה, גישה למערך, המרות.",
    },
    sections: [
      section("error-types", "סוגי שגיאות", ["תחביר — קומפילציה. לא רץ בכלל.", "ריצה — Exception (חלוקה ב-0, אינדקס).", "לוגיקה — רץ אבל תוצאה שגויה (לולאה אינסופית)."]),
      section("try-catch", "try / catch", ["try { קוד מסוכן } catch (Exception ex) { טיפול }", "catch ספציפי לפני כללי.", "לא לבלוע חריגות בשקט בלי סיבה."]),
      section("finally", "finally", ["תמיד רץ — גם אחרי return או catch.", "לניקוי משאבים: סגירת קבצים.", "שאלה במבחן: finally תמיד רץ."]),
      section("tryparse", "TryParse", ["int.TryParse(input, out int n) — מחזיר bool.", "לא זורק על קלט רע.", "עדיף על try/catch לקלט משתמש."]),
      section("common-exceptions", "חריגות נפוצות", ["DivideByZeroException, IndexOutOfRangeException.", "NullReferenceException — גישה ל-null.", "InvalidCastException — downcast שגוי.", "StackOverflowException — רקורסיה אינסופית."]),
      section("throw", "זריקת חריגה", ["throw new ArgumentException(\"...\");", "מאותות על מצב לא חוקי.", "בקורס — בעיקר הבנה, לא יצירה מורכבת."]),
      section("validation-first", "אימות לפני חריגה", ["בדקו null, טווח, פורמט לפני פעולה.", "TryParse במקום Parse לקלט.", "מניעה עדיפה על טיפול."]),
      section("nested-try", "try מקונן", ["אפשר — לא תמיד מומלץ.", "catch פנימי לטיפול מקומי.", "finally לכל try — נפרד."]),
      section("file-db-exceptions", "חריגות בקבצים ו-DB", ["FileNotFoundException, IOException.", "MySQL — חיבור נכשל, שאילתה שגויה.", "using מפחית דליפות גם בחריגה."]),
      section("exam-exceptions", "שאלות מבחן", ["Parse על טקסט — חריגה. TryParse — false.", "finally אחרי catch — עדיין רץ.", "איזה חריגה ב-array[9] בגודל 9? IndexOutOfRange."]),
    ],
    codeExamples: [
      { id: "ex-1", title: "TryParse", level: "basic", code: "if (int.TryParse(input, out int age))\n    Console.WriteLine(age);", language: "csharp", explanation: "בטוח לקלט משתמש." },
    ],
    examTips: ["finally תמיד רץ", "TryParse לקלט", "catch ספציפי לפני כללי", "Parse זורק", "IndexOutOfRange במערך"],
    summary: "חריגות לכשלי ריצה. TryParse ואימות מונעים קריסות.",
  },

  files: {
    estimatedMinutes: 50,
    introduction: {
      what: "עבודה עם קבצים: File, StreamReader/Writer, נתיבים, CSV — שיעור 9.",
      why: "אחסון מתמשך מחוץ לזיכרון — דוחות, ייבוא נתונים.",
      when: "קריאת/כתיבת טקסט, לוגים, קבצי הגדרות.",
    },
    sections: [
      section("file-class", "מחלקת File", ["File.ReadAllText, WriteAllText — פשוט לקבצים קטנים.", "File.Exists — בדיקה לפני קריאה.", "נתיב מלא או יחסי לתיקיית העבודה."]),
      section("streams", "StreamReader / StreamWriter", ["קריאה שורה-שורה — חסכוני לקבצים גדולים.", "using מבטיח סגירה.", "ReadLine() עד null בסוף קובץ."]),
      section("using-statement", "using לניהול משאבים", ["using (var reader = new StreamReader(path)) { }", "Dispose נקרא אוטומטית — גם בחריגה.", "מונע דליפת handles."]),
      section("paths", "נתיבים", ["@\"C:\\data\\file.txt\" — verbatim.", "Path.Combine — בניית נתיב בטוחה.", "Directory.CreateDirectory אם צריך."]),
      section("csv-basics", "CSV בסיסי", ["שורות מופרדות בפסיק או טאב.", "Split(',') לפיצול.", "שימו לב לקלט עם פסיקים בתוך שדה — בקורס פשוט."]),
      section("append", "הוספה לקובץ", ["StreamWriter עם append: true.", "או File.AppendAllText.", "לוגים — לא דורסים קובץ קיים."]),
      section("exceptions-files", "חריגות בקבצים", ["FileNotFoundException — קובץ לא קיים.", "IOException — קובץ נעול.", "תמיד בדקו Exists או try/catch."]),
      section("encoding", "קידוד", ["UTF-8 ברירת מחדל לטקסט.", "עברית בקבצים — UTF-8.", "StreamReader עם Encoding אם צריך."]),
      section("best-practices", "Best practices", ["using תמיד לסטרימים.", "לא להשאיר Reader פתוח.", "בדיקת נתיב לפני כתיבה."]),
      section("exam-files", "שאלות מבחן", ["מה עושה using? — סוגר משאב.", "ReadLine מחזיר null בסוף.", "File vs Stream — קבצים גדולים → Stream."]),
    ],
    codeExamples: [
      { id: "file-1", title: "קריאת קובץ", level: "basic", code: "using (var r = new StreamReader(\"data.txt\"))\n{\n    string line;\n    while ((line = r.ReadLine()) != null)\n        Console.WriteLine(line);\n}", language: "csharp", explanation: "שורה אחר שורה עם using." },
    ],
    examTips: ["using סוגר משאב", "ReadLine → null בסוף", "FileNotFoundException", "Stream לקבצים גדולים"],
    summary: "קבצים עם File וסטרימים. using לסגירה בטוחה.",
  },

  mysql: {
    estimatedMinutes: 60,
    introduction: {
      what: "ADO.NET עם MySQL: חיבור, Command, Reader, ExecuteNonQuery, פרמטרים, Repository.",
      why: "אפליקציות אמיתיות שומרות נתונים במסד.",
      when: "CRUD על טבלאות — סטודנטים, ספרים, משתמשים.",
    },
    sections: [
      section("connection", "חיבור MySQL", ["MySqlConnection עם connection string.", "Server, Database, User, Password.", "using — סגירה אוטומטית."]),
      section("open-close", "פתיחה וסגירה", ["conn.Open() לפני פקודות.", "Close או using בסוף.", "דליפת חיבורים — בעיה נפוצה."]),
      section("execute-reader", "ExecuteReader — SELECT", ["MySqlCommand + ExecuteReader → MySqlDataReader.", "while (reader.Read()) — שורה אחר שורה.", "GetInt32(\"id\"), GetString(\"name\") לפי עמודה."]),
      section("execute-nonquery", "ExecuteNonQuery — INSERT/UPDATE/DELETE", ["מחזיר מספר שורות שהושפעו.", "לא מחזיר תוצאות SELECT.", "שאלה: UPDATE → ExecuteNonQuery."]),
      section("parameters", "פרמטרים", ["@name + cmd.Parameters.AddWithValue(\"@name\", value).", "מונע SQL Injection.", "לא לשרשר קלט משתמש ישירות ל-SQL!"]),
      section("repository-pattern", "דפוס Repository", ["Model — נתונים (Student).", "Repository — SQL וגישה ל-DB.", "Main/Service — לוגיקה.", "הפרדת אחריות."]),
      section("reader-open", "Reader פתוח", ["בזמן Reader פתוח — לא פקודה נוספת על אותו connection.", "סגרו Reader לפני פקודה הבאה.", "שאלה במבחן."]),
      section("crud-flow", "זרימת CRUD", ["Create: INSERT + ExecuteNonQuery.", "Read: SELECT + Reader.", "Update/Delete: ExecuteNonQuery."]),
      section("connection-string", "Connection String", ["מחרוזת אחת עם כל הפרטים.", "בפרויקט אמיתי — מ-config, לא בקוד.", "בקורס — בדוגמאות ב-Main."]),
      section("exam-mysql", "שאלות מבחן", ["using לחיבור.", "ExecuteNonQuery ל-UPDATE.", "פרמטרים לא שרשור.", "Reader.Read() בלולאה."]),
    ],
    codeExamples: [
      { id: "db-1", title: "SELECT עם Reader", level: "intermediate", code: "using (var conn = new MySqlConnection(cs))\n{\n  conn.Open();\n  var cmd = new MySqlCommand(\"SELECT * FROM books\", conn);\n  using (var r = cmd.ExecuteReader())\n    while (r.Read())\n      Console.WriteLine(r.GetString(\"title\"));\n}", language: "csharp", explanation: "using כפול לחיבור ו-reader." },
      { id: "db-2", title: "INSERT עם פרמטר", level: "intermediate", code: "cmd.CommandText = \"INSERT INTO books (title) VALUES (@t)\";\ncmd.Parameters.AddWithValue(\"@t\", title);\ncmd.ExecuteNonQuery();", language: "csharp", explanation: "פרמטר במקום שרשור." },
    ],
    examTips: ["using לחיבור", "ExecuteNonQuery ל-UPDATE/INSERT", "פרמטרים @name", "Reader פתוח — לא פקודה נוספת", "Read() בלולאה"],
    summary: "MySQL דרך ADO.NET: חיבור בטוח, Reader לקריאה, NonQuery לכתיבה, פרמטרים.",
  },

  "library-project": {
    estimatedMinutes: 70,
    introduction: {
      what: "פרויקט גמר — מערכת ספרייה: Book, PhysicalBook, DigitalBook, AudioBook, Library, תפריט.",
      why: "מיישם את כל OOP מהקורס בפרויקט שלם.",
      when: "הגשת פרויקט, הכנה למבחן מעשי.",
    },
    sections: [
      section("project-structure", "מבנה הפרויקט", ["Book — מחלקת בסיס.", "שלושה יורשים: Physical, Digital, Audio.", "Library — מנהל מערך Book[100].", "Program — תפריט Main."]),
      section("book-base", "מחלקת Book", ["Id, Title, Author — properties.", "Borrow(), Return(), PrintInfo() — virtual.", "ברירת מחדל: Borrow מחזיר true."]),
      section("physical-book", "PhysicalBook", ["Pages, AvailableCopies.", "override Borrow — מפחית עותקים אם > 0.", "override Return — מגדיל עותקים."]),
      section("digital-audio", "DigitalBook ו-AudioBook", ["Digital: FileSizeMB, Format. Borrow מהבסיס.", "Audio: DurationMinutes, Narrator. PrintInfo ייחודי.", "override PrintInfo — פורמט שונה לכל סוג."]),
      section("library-class", "מחלקת Library", ["Book[] books, BookCount.", "AddBook — בדיקת null, מלאות, כפילות Id.", "FindById, BorrowBook, ReturnBook — פולימורפיזם."]),
      section("polymorphism-lib", "פולימורפיזם בספרייה", ["books[i] מטיפוס Book — קריאה ל-Borrow() מפעילה מימוש נכון.", "Physical מפחית עותקים; Digital לא.", "זה לב הפרויקט."]),
      section("reports", "דוחות", ["AudioBookReport — לולאה + is AudioBook.", "Downcast לגישה ל-Narrator.", "ספירה לפי סוג עם is."]),
      section("menu", "תפריט משתמש", ["while(true) + switch.", "הוספה, הצגה, השאלה, החזרה, דוחות, יציאה.", "TryParse לבחירת תפריט."]),
      section("add-book-flow", "הוספת ספר", ["בחירת סוג 1/2/3.", "קלט Id, Title, Author + שדות ייחודיים.", "library.AddBook(new PhysicalBook(...))."]),
      section("exam-library", "חיבור למבחן", ["virtual Borrow/Return.", "מערך Book[] פולימורפי.", "is + cast לדוחות.", "הפרדת Book / Library / Program."]),
    ],
    examTips: ["PhysicalBook משנה AvailableCopies", "דוחות עם is", "מערך פולימורפי Book[]", "virtual Borrow", "BookCount לא Length"],
    summary: "פרויקט הספרייה — יישום מלא של ירושה, פולימורפיזם, ומערך פולימורפי.",
  },
};

module.exports = { CHAPTER_ENRICHMENTS, section, c };
