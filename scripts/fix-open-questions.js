const fs = require("fs");
const path = require("path");

const practiceDir = path.join(__dirname, "../src/data/practice");

function o(id, question, sampleAnswer, hint, topicId) {
  return { id, question, sampleAnswer, hint, topicId };
}

const OPEN_BANKS = {
  "classes-objects": [
    o("co-o1", "מה ההבדל בין מחלקה (class) לאובייקט (object)?", "מחלקה היא התבנית (blueprint); אובייקט הוא מופע ממשי בזיכרון שנוצר עם new.", "שרטוט מול בניין", "classes-objects"),
    o("co-o2", "מה חייב להיות נכון לגבי בנאי ב-C#?", "שם זהה למחלקה, ללא טיפוס מוחזר (גם לא void), ואפשר לעשות overload.", "שם המחלקה", "classes-objects"),
    o("co-o3", "הסבר את שלושת שלבי יצירת אובייקט.", "הצהרה על משתנה, new שמקצה זיכרון, קריאה לבנאי לאתחול.", "declaration + new", "classes-objects"),
    o("co-o4", "למה משתמשים ב-this בבנאי?", "להבדיל בין שדה של האובייקט לפרמטר עם אותו שם, למשל this.name = name.", "פרמטר מול שדה", "classes-objects"),
    o("co-o5", "מה תפקיד namespace?", "לארגן מחלקות ולמנוע התנגשויות שמות בין ספריות/פרויקטים שונים.", "ארגון שמות", "classes-objects"),
    o("co-o6", "הסבר getters ו-setters בקצרה.", "מתודות לקריאה/כתיבה מבוקרת של שדות private — חלק מאינקפסולציה.", "גישה מבוקרת", "classes-objects"),
    o("co-o7", "מה קורה אם שוכחים new ביצירת אובייקט?", "המשתנה לא מצביע על מופע תקין — בדרך כלל NullReferenceException בשימוש, או שגיאת קומפילציה אם אין אתחול.", "null", "classes-objects"),
    o("co-o8", "תאר דוגמה אחת מ-BankAccount מהקורס.", "יוצרים חשבון עם יתרה ראשונית, קוראים ל-deposit/GetBalance — כל מופע שומר מצב משלו.", "מופעים עם יתרות", "classes-objects"),
    o("co-o9", "מהי Call Stack בקריאת מתודות?", "כשמתודה קוראת למתודה אחרת, ה-runtime זוכר לאן לחזור אחרי שהמתודה הפנימית מסתיימת.", "חזרה לקורא", "classes-objects"),
    o("co-o10", "למה בנאי לא מחזיר ערך?", "תפקידו לאתחל את האובייקט החדש שהקצה new — לא לחשב ערך להחזרה כמו מתודה רגילה.", "אתחול בלבד", "classes-objects"),
  ],

  "methods-encapsulation": [
    o("me-o1", "מהו overloading של מתודות?", "כמה מתודות באותו שם עם חתימות שונות (פרמטרים שונים) — המהדר בוחר לפי הארגומנטים.", "חתימות", "methods-encapsulation"),
    o("me-o2", "מה ההבדל בין מתודת מופע ל-static?", "מופע פועלת על אובייקט ספציפי; static שייכת למחלקה וקוראים לה דרך שם המחלקה.", "אובייקט מול מחלקה", "methods-encapsulation"),
    o("me-o3", "הסבר את עקרון האינקפסולציה.", "הסתרת נתונים פנימיים (private) וחשיפת ממשק מבוקר בלבד — getters/setters או מתודות.", "private", "methods-encapsulation"),
    o("me-o4", "למה עושים validation ב-set?", "כדי למנוע מצבים לא חוקיים (יתרה שלילית, גיל לא הגיוני) לפני שמירת הערך בשדה.", "אימות", "methods-encapsulation"),
    o("me-o5", "מה ההבדל בין פרמטר לארגומנט?", "פרמטר הוא המשתנה בהגדרת המתודה; ארגומנט הוא הערך שמועבר בקריאה.", "הגדרה מול קריאה", "methods-encapsulation"),
    o("me-o6", "מתי מתודה מחזירה void?", "כשהיא מבצעת פעולה (שינוי מצב/הדפסה) בלי להחזיר ערך לתוכנית הקוראת.", "אין ערך מוחזר", "methods-encapsulation"),
    o("me-o7", "הסבר גישה private מול public.", "private נגיש רק מתוך המחלקה; public נגיש מכל מקום — לכן שדות לרוב private וממשק public.", "רמות גישה", "methods-encapsulation"),
    o("me-o8", "למה לא חושפים שדות כ-public ישירות?", "כי אי אפשר לאכוף כללים, לשנות מימוש פנימי בבטחה, או להוסיף לוגיקה בשינוי הערך.", "שליטה", "methods-encapsulation"),
    o("me-o9", "תן דוגמה ל-overload שימושי.", "Print(int) ו-Print(string) — אותו שם, טיפוסי פרמטרים שונים, נוחות לקורא.", "אותו שם", "methods-encapsulation"),
    o("me-o10", "מה הקשר בין encapsulation לפרויקט הספרייה?", "שדות כמו מספר עותקים נשמרים פרטיים ומשתנים רק דרך Borrow/Return עם כללים.", "שליטה במצב", "methods-encapsulation"),
  ],

  inheritance: [
    o("inh-o1", "מהי ירושה ב-C# ומה התחביר?", "מחלקה יורשת מקבלת שדות ומתודות מהבסיס: class Dog : Pet — יחס IS-A.", "Derived : Base", "inheritance"),
    o("inh-o2", "למה בנאי לא יורש?", "כל מחלקה צריכה לאתחל את עצמה; היורש קורא ל-base(...) ואז מאתחל את השדות שלו.", "base()", "inheritance"),
    o("inh-o3", "מה תפקיד protected?", "נגיש במחלקה עצמה וביורשים, אבל לא מבחוץ כמו public.", "ליורשים", "inheritance"),
    o("inh-o4", "הסבר ירושה יחידה ב-C#.", "מחלקה יכולה לרשת ממחלקה אחת בלבד; לממשקים מרובים משתמשים ב-interface.", "מחלקה אחת", "inheritance"),
    o("inh-o5", "מה הסדר בקריאת בנאים בירושה?", "קודם בנאי הבסיס (דרך base או ברירת מחדל), ואז גוף בנאי היורש.", "מלמעלה למטה", "inheritance"),
    o("inh-o6", "מה ההבדל בין IS-A ל-HAS-A?", "IS-A הוא ירושה (Dog הוא Pet); HAS-A הוא הרכבה (Car יש לו Engine כשדה).", "ירושה מול הרכבה", "inheritance"),
    o("inh-o7", "למה ירושה מקדמת DRY?", "קוד משותף נשאר בבסיס במקום לשכפל בכל יורש.", "שימוש חוזר", "inheritance"),
    o("inh-o8", "תן דוגמה מהקורס לירושה.", "PhysicalBook : Book או Dog : Pet — היורש מוסיף שדות/התנהגות ייחודית.", "Book / Pet", "inheritance"),
    o("inh-o9", "מה עושה base.Method()?", "קורא למימוש של המתודה במחלקת הבסיס מתוך היורש.", "קריאה לבסיס", "inheritance"),
    o("inh-o10", "האם שדות private של הבסיס נגישים ביורש?", "לא ישירות — רק דרך public/protected או מתודות של הבסיס.", "private לא יורש גישה", "inheritance"),
  ],

  polymorphism: [
    o("poly-o1", "מהו פולימורפיזם דינמי ב-C#?", "אותה קריאה למתודה מתנהגת לפי סוג האובייקט בפועל בזמן ריצה, עם virtual/override.", "טיפוס ריצה", "polymorphism"),
    o("poly-o2", "מה חייב להיות נכון כדי ש-override יעבוד?", "בבסיס המתודה מסומנת virtual (או abstract), וביורש override.", "virtual בבסיס", "polymorphism"),
    o("poly-o3", "מה יקרה ב-Pet p = new Dog(); p.Eat() כשיש override?", "תיקרא גרסת Dog — לפי האובייקט האמיתי, לא לפי טיפוס המשתנה.", "Dog", "polymorphism"),
    o("poly-o4", "מהו method hiding עם new?", "כשמגדירים מתודה באותו שם בלי override — מסתירים את של הבסיס; הקריאה תלויה בטיפוס המשתנה.", "בלי override", "polymorphism"),
    o("poly-o5", "מה ההבדל בין Overloading ל-Overriding?", "Overloading — חתימות שונות בזמן קומפילציה; Overriding — החלפת התנהגות בירושה בזמן ריצה.", "קומפילציה מול ריצה", "polymorphism"),
    o("poly-o6", "למה פולימורפיזם שימושי בספרייה?", "מערך Book[] יכול להחזיק סוגים שונים, ו-Borrow מתנהג לפי Physical/Digital.", "מערך פולימורפי", "polymorphism"),
    o("poly-o7", "האם אפשר לעשות override למתודה שאינה virtual?", "לא — תקבל שגיאת קומפילציה; צריך virtual בבסיס.", "שגיאה", "polymorphism"),
    o("poly-o8", "הסבר dynamic dispatch בקצרה.", "ה-runtime בוחר את המימוש לפי סוג האובייקט בפועל כשיש virtual/override.", "טבלת מתודות", "polymorphism"),
    o("poly-o9", "מה היתרון של Pet p = new Dog()?", "אפשר לכתוב קוד כללי על טיפוס הבסיס ועדיין לקבל התנהגות ייחודית של היורש.", "גמישות", "polymorphism"),
    o("poly-o10", "תאר טעות נפוצה במבחן על polymorphism.", "לחשוב שטיפוס המשתנה קובע תמיד — ב-override קובע טיפוס הריצה.", "טיפוס משתנה מול אובייקט", "polymorphism"),
  ],

  "casting-relationships": [
    o("cast-o1", "מהו Upcast ולמה הוא בטוח?", "המרה מיורש לבסיס (Dog→Pet) — תמיד חוקית כי כל Dog הוא Pet.", "IS-A", "casting-relationships"),
    o("cast-o2", "מהו Downcast ומתי הוא מסוכן?", "המרה מבסיס ליורש — עלולה להיכשל בזמן ריצה אם האובייקט אינו מהסוג המבוקש.", "InvalidCast", "casting-relationships"),
    o("cast-o3", "מה ההבדל בין is ל-as?", "is מחזיר bool; as מחזיר את האובייקט או null אם ההמרה לא אפשרית.", "בדיקה מול המרה", "casting-relationships"),
    o("cast-o4", "מתי בודקים is לפני cast?", "לפני downcast מפורש — כדי להימנע מחריגה כשהסוג לא מתאים.", "בטיחות", "casting-relationships"),
    o("cast-o5", "מה יחזיד as כשההמרה נכשלת?", "null — בלי לזרוק חריגה (בניגוד ל-cast מפורש).", "null", "casting-relationships"),
    o("cast-o6", "הסבר: A obj = new B(); מה בודק obj is B?", "true — כי האובייקט בפועל הוא B, גם אם המשתנה מטיפוס A.", "טיפוס ריצה", "casting-relationships"),
    o("cast-o7", "מה הקשר בין casting לפולימורפיזם?", "לרוב עובדים עם טיפוס בסיס; רק כשצריך יכולת ייחודית — בודקים ומבצעים downcast.", "מתי לרדת", "casting-relationships"),
    o("cast-o8", "תן דוגמה לשימוש ב-is בפרויקט ספרייה.", "בדוחות: if (book is AudioBook a) — כדי לטפל רק בספרי אודיו.", "דוחות", "casting-relationships"),
    o("cast-o9", "מה ההבדל המרכזי בין המרת ערכים ((int)x) ל-cast בין מחלקות?", "בין ערכים — המרת טיפוס פרימיטיבי; בין מחלקות — בדיקת יחס ירושה בזמן ריצה.", "פרימיטיבי מול OOP", "casting-relationships"),
    o("cast-o10", "למה Upcast לא דורש בדיקה?", "כי לפי ירושה כל מופע של היורש הוא בהכרח מהטיפוס של הבסיס.", "תמיד חוקי", "casting-relationships"),
  ],

  properties: [
    o("prop-o1", "מהי Property ב-C# ולמה עדיפה על שדה ציבורי?", "ממשק get/set עם לוגיקה אפשרית — שולטת בגישה בלי לחשוף את השדה עצמו.", "שליטה", "properties"),
    o("prop-o2", "מהו backing field?", "שדה private שמחזיק את הערך האמיתי מאחורי ה-Property.", "private", "properties"),
    o("prop-o3", "מה המילה value ב-set?", "הערך שהוקצה מימין לסימן = כשכותבים prop = x.", "הערך המוקצה", "properties"),
    o("prop-o4", "איפה שמים validation ב-Property?", "בדרך כלל ב-set — לפני שמירת הערך ל-backing field.", "set", "properties"),
    o("prop-o5", "מה עושה { get; set; }?", "Property אוטומטית עם שדה נסתר — קיצור כשאין לוגיקה מיוחדת.", "auto-property", "properties"),
    o("prop-o6", "מתי משתמשים ב-private set?", "כשהקריאה מבחוץ מותרת, אבל שינוי הערך רק מתוך המחלקה.", "קריאה בלבד מבחוץ", "properties"),
    o("prop-o7", "מה ההבדל בין Property למתודות GetX/SetX?", "Property מספקת תחביר של שדה (obj.Name = ...) עם שליטה של מתודה.", "תחביר נוח", "properties"),
    o("prop-o8", "הסבר init או set חד-כיווני ברעיון הקורס.", "לעיתים רוצים לאפשר השמה בעיקר באתחול ולמנוע שינוי חופשי אחר כך.", "הגבלה", "properties"),
    o("prop-o9", "למה לא לשים לוגיקה כבדה ב-get?", "כי נראה כמו קריאת שדה פשוטה — לוגיקה כבדה מבלבלת ופוגעת בביצועים/בהבנה.", "פשטות", "properties"),
    o("prop-o10", "תן דוגמה מהקורס ל-Property עם אימות.", "Age או Balance — ב-set בודקים טווח חוקי ורק אז שומרים.", "טווח ערכים", "properties"),
  ],

  "operator-overloading": [
    o("op-o1", "מהם התנאים להעמסת אופרטור ב-C#?", "מתודה public static עם המילה operator וטיפוסי פרמטרים מתאימים.", "public static", "operator-overloading"),
    o("op-o2", "למה מעמיסים == יחד עם !=?", "כדי לשמור עקביות לוגית — אם מגדירים שוויון חייבים גם אי-שוויון.", "זוגות", "operator-overloading"),
    o("op-o3", "למה משתמשים ב-ReferenceEquals בבדיקת null?", "כדי להשוות זהות הפניה בלי לקרוא שוב ל-== המועמס (שעלול לגרום ללולאה).", "null בטוח", "operator-overloading"),
    o("op-o4", "מה הקשר בין == ל-GetHashCode?", "אם שני אובייקטים שווים ב-==, רצוי שיהיה להם אותו GetHashCode לאוספים.", "עקביות", "operator-overloading"),
    o("op-o5", "האם מותר לשנות את האופרנדים בתוך operator +?", "לא מומלץ/לא best practice — עדיף להחזיר אובייקט חדש עם התוצאה.", "אובייקט חדש", "operator-overloading"),
    o("op-o6", "אילו אופרטורים אי אפשר להעמיס?", "למשל נקודה (.) והשמה הרגילה — לא כל התחביר של השפה ניתן להעמסה.", ". ו-", "operator-overloading"),
    o("op-o7", "תן דוגמה שימושית להעמסת +.", "חיבור שני וקטורים/כספים שמחזיר מופע חדש עם הסכום.", "ערך חדש", "operator-overloading"),
    o("op-o8", "מתי להעמיס אופרטורים בכלל?", "כשהפעולה טבעית וברורה לקורא הקוד — לא רק כדי לקצר שורה.", "משמעות ברורה", "operator-overloading"),
    o("op-o9", "הסבר העמסת אופרטור המרה בקצרה.", "מאפשרת המרה מפורשת/מרומזת בין טיפוסים שיצרתם, לפי חוקי הבטיחות שתבחרו.", "conversion", "operator-overloading"),
    o("op-o10", "מה הסיכון בהעמסת == בלי זהירות עם null?", "קריאה רקורסיבית או NullReferenceException אם לא בודקים הפניות קודם.", "null", "operator-overloading"),
  ],

  "interfaces-abstract": [
    o("ia-o1", "מהו ממשק (interface) ומה הוא לא כולל?", "חוזה של מתודות/תכונות למימוש; בלי שדות מופע רגילים כמו במחלקה.", "ללא שדות מופע", "interfaces-abstract"),
    o("ia-o2", "מהי מחלקה abstract?", "מחלקה חלקית שלא ניתן ליצור ממנה new; מיועדת לירושה ולכפיית מימוש.", "אין new", "interfaces-abstract"),
    o("ia-o3", "מתי בוחרים interface ומתי abstract?", "interface ליכולות מרובות/חוזה; abstract כשיש בסיס משותף עם קוד משותף ומצב.", "חוזה מול בסיס", "interfaces-abstract"),
    o("ia-o4", "האם מחלקה יכולה לממש כמה ממשקים?", "כן — זו הדרך העיקרית ל'ירושה מרובה' של יכולות ב-C#.", "ממשקים מרובים", "interfaces-abstract"),
    o("ia-o5", "האם משתמשים ב-override על מתודת ממשק?", "לא כמימוש רגיל של ממשק — מממשים את החתימה; override ל-virtual/abstract של מחלקה.", "מימוש מול override", "interfaces-abstract"),
    o("ia-o6", "מה היתרון של הפשטה למבחן/עיצוב?", "כופים מבנה אחיד על יורשים ומפרידים 'מה' חייב להתקיים מ'איך' מממשים.", "חוזה", "interfaces-abstract"),
    o("ia-o7", "למה לא יוצרים מופע של abstract?", "כי חסר בה מימוש מלא — היא שלד בלבד ליורשים קונקרטיים.", "לא שלמה", "interfaces-abstract"),
    o("ia-o8", "מה חייב להיות בנגישות של מימוש ממשק?", "בדרך כלל public — הממשק מגדיר API חיצוני.", "public", "interfaces-abstract"),
    o("ia-o9", "תן דוגמה מעשית מממשק.", "IChargeable על מכשירים שונים — כולם מממשים Charge אחרת.", "יכולת משותפת", "interfaces-abstract"),
    o("ia-o10", "מה הקשר לירושה יחידה?", "מחלקה אחת כבסיס + ממשקים מרובים = גמישות בלי ירושת מחלקות מרובה.", "משלים ירושה", "interfaces-abstract"),
  ],

  exceptions: [
    o("ex-o1", "מהי חריגה (exception)?", "שגיאה בזמן ריצה שמפריעה לזרימה הרגילה — ניתנת ללכידה ב-try/catch.", "זמן ריצה", "exceptions"),
    o("ex-o2", "מה תפקיד finally?", "בלוק שרץ תמיד אחרי try/catch — לסגירת משאבים וניקוי.", "תמיד רץ", "exceptions"),
    o("ex-o3", "למה Prefer ל-TryParse על Parse לקלט משתמש?", "TryParse מחזיר false בלי לזרוק; Parse זורק FormatException על קלט רע.", "לא זורק", "exceptions"),
    o("ex-o4", "מה הסדר הנכון של כמה catch?", "מהספציפי לכללי — אחרת ה-catch הכללי בולע הכל והספציפי לא יגיע.", "ספציפי קודם", "exceptions"),
    o("ex-o5", "תן דוגמה ל-IndexOutOfRangeException.", "גישה ל-arr[9] כשגודל המערך 9 (אינדקסים 0–8).", "גבול מערך", "exceptions"),
    o("ex-o6", "איך אימות קלט מונע חריגות?", "בודקים טווח/פורמט לפני פעולה מסוכנת — פחות כישלונות בריצה.", "מניעה", "exceptions"),
    o("ex-o7", "מה ההבדל בין שגיאת קומפילציה לחריגה?", "קומפילציה נתפסת לפני הרצה; חריגה קורית בזמן ריצה.", "מתי", "exceptions"),
    o("ex-o8", "מתי זורקים throw במתודה שלכם?", "כשמצב לא חוקי שאי אפשר לטפל בו מקומית — מעבירים לטיפול בשכבה מעל.", "מצב לא חוקי", "exceptions"),
    o("ex-o9", "הסבר NullReferenceException בקצרה.", "ניסיון לגשת לחבר של משתנה שערכו null — לא נוצר אובייקט.", "null", "exceptions"),
    o("ex-o10", "למה לא לתפוס Exception באופן גורף בלי טיפול?", "מסתיר באגים; עדיף ללכוד סוגים צפויים ולטפל/לרשום בהתאם.", "אל תבלעו הכל", "exceptions"),
  ],

  files: [
    o("fi-o1", "למה חשוב using בעבודה עם קבצים?", "סוגר את ה-Stream/Writer אוטומטית גם אם יש חריגה — משחרר משאב.", "סגירה", "files"),
    o("fi-o2", "מה מחזיר ReadLine בסוף הקובץ?", "null — סימן שאין יותר שורות לקריאה.", "סוף קובץ", "files"),
    o("fi-o3", "מתי עדיף Stream על File.ReadAllText?", "לקבצים גדולים — קריאה בהדרגה בלי לטעון הכל לזיכרון בבת אחת.", "גודל", "files"),
    o("fi-o4", "מהי FileNotFoundException?", "ניסיון לפתוח קובץ שלא קיים בנתיב שצוין.", "נתיב", "files"),
    o("fi-o5", "הסבר הבדל בין קריאה לכתיבה לקובץ טקסט.", "Reader קורא תוכן קיים; Writer יוצר/דורס/מוסיף לפי המצב שנבחר.", "כיוון", "files"),
    o("fi-o6", "למה סוגרים קובץ גם אחרי שגיאה?", "אחרת המשאב נשאר פתוח — נעילות ודליפות; לכן finally או using.", "משאב", "files"),
    o("fi-o7", "מה הסיכון בכתיבה בלי בדיקות?", "דריסה בטעות, נתיב לא חוקי, או דיסק מלא — צריך try/catch והרשאות.", "כשלים", "files"),
    o("fi-o8", "תאר לולאת קריאה טיפוסית מקובץ.", "while ((line = reader.ReadLine()) != null) { ... }", "עד null", "files"),
    o("fi-o9", "מה הקשר בין קבצים לחריגות?", "פעולות IO רבות זורקות — לכן משלבים try/catch/using.", "IO", "files"),
    o("fi-o10", "מתי משתמשים בנתיב יחסי מול מוחלט?", "יחסי תלוי בתיקיית העבודה; מוחלט מלא ויציב יותר בין סביבות.", "מיקום", "files"),
  ],

  mysql: [
    o("my-o1", "למה using על חיבור MySQL/ADO.NET?", "סוגר את החיבור גם כשיש שגיאה — חשוב למשאבי DB.", "סגירת חיבור", "mysql"),
    o("my-o2", "מתי משתמשים ב-ExecuteNonQuery?", "לפקודות שלא מחזירות טבלה — INSERT/UPDATE/DELETE; מחזיר מספר שורות שהושפעו.", "שינוי נתונים", "mysql"),
    o("my-o3", "למה פרמטרים (@name) עדיפים על שרשור מחרוזות?", "מונעים SQL Injection ומטפלים נכון בסוגי נתונים ומרכאות.", "אבטחה", "mysql"),
    o("my-o4", "מה עושים עם DataReader בלולאה?", "קוראים Row-Row עם Read() כל עוד יש שורות.", "Read()", "mysql"),
    o("my-o5", "מה הסיכון כש-Reader פתוח?", "לרוב אי אפשר להריץ פקודה נוספת על אותו חיבור עד שסוגרים את ה-Reader.", "חיבור תפוס", "mysql"),
    o("my-o6", "הסבר הפרדה בין שכבת UI ל-DB בקצרה.", "הממשק אוסף קלט; שכבת נתונים מריצה SQL — קל יותר לתחזק ולבדוק.", "שכבות", "mysql"),
    o("my-o7", "מה ההבדל בין ExecuteScalar ל-ExecuteReader?", "Scalar לערך יחיד (COUNT); Reader לתוצאה טבלאית עם שורות.", "ערך מול שורות", "mysql"),
    o("my-o8", "למה לא לשמור סיסמאות בחיבור בקוד גלוי בפרודקשן?", "סודות שייכים להגדרות מוגנות/סביבה — לא למחסן הקוד.", "אבטחה", "mysql"),
    o("my-o9", "תאר זרימת UPDATE בטוחה.", "פותחים חיבור ב-using, Command עם פרמטרים, ExecuteNonQuery, בודקים תוצאה.", "@params", "mysql"),
    o("my-o10", "מה קורה אם שוכחים לסגור חיבור?", "דליפת חיבורים — העומס על השרת עולה והאפליקציה עלולה להיתקע.", "pool", "mysql"),
  ],

  "library-project": [
    o("lib-o1", "מה המבנה הכללי של פרויקט הספרייה?", "מחלקת Book והיורשים, Library שמנהלת אוסף, ו-Program/תפריט להפעלה.", "Book / Library", "library-project"),
    o("lib-o2", "איך PhysicalBook משנה AvailableCopies ב-Borrow?", "מפחית עותקים זמינים כשיש מלאי; לא נותן לרדת מתחת לאפס.", "עותקים", "library-project"),
    o("lib-o3", "למה משתמשים במערך פולימורפי Book[]?", "לאחסן סוגי ספרים שונים תחת טיפוס בסיס אחד ולקרוא ל-Borrow/דוחות באופן אחיד.", "פולימורפיזם", "library-project"),
    o("lib-o4", "מה ההבדל בין BookCount ל-Length של המערך?", "BookCount סופר ספרים פעילים/תקינים; Length הוא גודל המערך כולל מקומות ריקים אם יש.", "ספירה לוגית", "library-project"),
    o("lib-o5", "איך דוחות משתמשים ב-is?", "מזהים AudioBook/DigitalBook וכו' כדי להציג מידע ייחודי אחרי בדיקת סוג.", "downcast בטוח", "library-project"),
    o("lib-o6", "מה תפקיד התפריט ב-Main?", "מציג אפשרויות, קורא קלט מהמשתמש, ומפעיל פעולות על Library.", "UI קונסול", "library-project"),
    o("lib-o7", "הסבר virtual Borrow בפרויקט.", "בבסיס התנהגות כללית; ביורשים (Physical) override לפי כללי עותקים.", "override", "library-project"),
    o("lib-o8", "אילו עקרונות OOP מתחברים בפרויקט?", "ירושה, פולימורפיזם, אינקפסולציה, ולרוב גם casting בדוחות.", "סיכום הקורס", "library-project"),
    o("lib-o9", "מה בודקים לפני הוספת ספר?", "מקום פנוי במערך/אוסף, קלט תקין, וסוג הספר המתאים ליצירה.", "הוספה", "library-project"),
    o("lib-o10", "למה הפרויקט טוב כהכנה למבחן?", "מחבר את כל הנושאים בדוגמה אחת שבה רואים קוד עובד מקצה לקצה.", "אינטגרציה", "library-project"),
  ],
};

const PLACEHOLDER = "הסבר במילים שלך נקודה מרכזית מפרק זה";

function isPlaceholderOpen(q) {
  return !q?.question || q.question.includes(PLACEHOLDER) || q.sampleAnswer === "תשובה לדוגמה בהתאם לחומר הקורס.";
}

function fixFile(chapterId) {
  const filePath = path.join(practiceDir, `${chapterId}.json`);
  if (!fs.existsSync(filePath)) return { chapterId, skipped: true };

  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const bank = OPEN_BANKS[chapterId];
  if (!bank) return { chapterId, skipped: true, reason: "no bank" };

  const kept = (data.openQuestions || []).filter((q) => !isPlaceholderOpen(q));
  if (kept.length >= 10 && kept.every((q) => !isPlaceholderOpen(q))) {
    return { chapterId, kept: kept.length, replaced: 0, note: "already good" };
  }

  data.openQuestions = bank.map((q) => ({ ...q, topicId: chapterId }));
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  return { chapterId, kept: kept.length, replaced: bank.length };
}

const chapters = Object.keys(OPEN_BANKS);
console.log("Fixing open questions...\n");
for (const ch of chapters) {
  const r = fixFile(ch);
  console.log(`${ch}: kept ${r.kept ?? 0}, replaced ${r.replaced ?? 0}${r.note ? " (" + r.note + ")" : ""}`);
}
console.log("\nDone.");
