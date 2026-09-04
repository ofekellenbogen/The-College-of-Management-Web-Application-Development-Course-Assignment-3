/**
 * Game Stage Definitions & Server-Side Verification Logic
 * Note: Correct answers and verification rules are strictly stored on the server!
 */

const gameStages = [
  {
    id: 1,
    title: "שלב 1: שליפת כל המוצרים",
    description: "תרחיש: משתמש נכנס לדף הקטלוג הראשי ומבקש להציג את רשימת כל המוצרים הקיימים במערכת.",
    instruction: "בחר את מתודת ה-HTTP המתאימה והגדר את הנתיב לשליפת כל המוצרים.",
    hint: "בשליפת נתונים משתמשים במתודת GET ובנתיב משאב ברבים: /api/products",
    expectedMethod: "GET",
    expectedPath: "/api/products",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["GET Requests", "REST Resource Naming"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "מתודת ה-HTTP שנבחרה שגויה. לשליפת מידע יש להשתמש ב-GET." };
      }
      if (reqInfo.path !== "/api/products") {
        return { success: false, message: "הנתיב שגוי. הנתיב הסטנדרטי ב-REST לשליפת רשימת מוצרים הוא /api/products." };
      }
      if (Object.keys(reqInfo.query).length > 0) {
        return { success: false, message: "בשלב זה אין צורך ב-Query Parameters, בקשנו את כל המוצרים ללא סינון." };
      }
      return {
        success: true,
        message: "מעולה! שלחת בקשת GET תקנית לשליפת כל המוצרים ב-REST."
      };
    }
  },
  {
    id: 2,
    title: "שלב 2: שליפת מוצר בודד לפי מזהה",
    description: "תרחיש: משתמש לחץ על המוצר עם מזהה (ID) מספר 1 ורוצה לצפות בפרטים המלאים שלו.",
    instruction: "השתמש ב-Route Parameter כדי לשלוף את המוצר שערך ה-ID שלו הוא 1.",
    hint: "ב-REST, מזהה משאב ספציפי מועבר כחלק מהנתיב (Route Parameter), למשל: /api/products/1",
    expectedMethod: "GET",
    expectedPath: "/api/products/1",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["GET Requests", "Route Parameters"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "שליפת מוצר בודד מתבצעת באמצעות מתודת GET." };
      }
      if (reqInfo.path !== "/api/products/1") {
        return { success: false, message: "הנתיב אינו תקין. עליך לציין Route Parameter עם ה-ID 1 (לדוגמה: /api/products/1)." };
      }
      return {
        success: true,
        message: "כל הכבוד! עשית שימוש נכון ב-Route Parameter לשליפת משאב ספציפי."
      };
    }
  },
  {
    id: 3,
    title: "שלב 3: טיפול בשגיאת משאב שאינו קיים (404)",
    description: "תרחיש: משתמש מנסה לפתוח קישור ישן למוצר עם מזהה 999 שכבר אינו קיים במערכת. עליך לבחון את תגובת השגיאה מהשרת.",
    instruction: "שלח בקשת GET לשליפת מוצר עם ID שווה ל-999 וצפה ב-Status Code שהשרת מחזיר.",
    hint: "כאשר משאב לא נמצא, השרת מחזיר קוד סטטוס 404 Not Found. הנתיב: /api/products/999",
    expectedMethod: "GET",
    expectedPath: "/api/products/999",
    requiresBody: false,
    expectedStatus: 404,
    concepts: ["HTTP Status Codes", "Error Handling (404 Not Found)", "Route Parameters"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "עליך לשלוח בקשת GET לשליפת המוצר." };
      }
      if (reqInfo.path !== "/api/products/999") {
        return { success: false, message: "הנתיב צריך לפנות למזהה 999: /api/products/999." };
      }
      return {
        success: true,
        message: "מצוין! השרת החזיר בצדק 404 Not Found עם הודעת שגיאה מסודרת במבנה JSON."
      };
    }
  },
  {
    id: 4,
    title: "שלב 4: סינון מוצרים באמצעות Query Parameter",
    description: "תרחיש: המשתמש מבקש לראות אך ורק מוצרים השייכים לקטגוריית 'Electronics'.",
    instruction: "הגדר בקשת GET עם Query Parameter המתאים לסינון לפי category=Electronics.",
    hint: "Query Parameters מתווספים לאחר סימן שאלה ? ב-URL, למשל: /api/products?category=Electronics",
    expectedMethod: "GET",
    expectedPath: "/api/products",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["GET Requests", "Query Parameters", "Data Filtering"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "סינון נתונים נעשה באמצעות בקשת GET." };
      }
      if (reqInfo.basePath !== "/api/products") {
        return { success: false, message: "הנתיב הבסיסי צריך להיות /api/products." };
      }
      if (reqInfo.query.category !== "Electronics") {
        return { success: false, message: "עליך להגדיר Query Parameter בשם category עם הערך Electronics." };
      }
      return {
        success: true,
        message: "יופי! השרת סינן בהצלחה והחזיר רק את מוצרי Electronics."
      };
    }
  },
  {
    id: 5,
    title: "שלב 5: שילוב מספר Query Parameters (סינון + מיון)",
    description: "תרחיש: המשתמש מעוניין לצפות במוצרים מקטגוריית 'Books' כשהם ממוינים לפי מחיר מהזול ליקר (sortBy=price, order=asc).",
    instruction: "שלח בקשת GET המשלבת יותר מ-Query Parameter אחד: category=Books וגם sortBy=price וגם order=asc.",
    hint: "מחברים מספר Query Parameters עם סימן אמפרסנד &, לדוגמה: /api/products?category=Books&sortBy=price&order=asc",
    expectedMethod: "GET",
    expectedPath: "/api/products",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["Multiple Query Parameters", "Sorting & Filtering Combinations"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "שליפה ומיון מתבצעים באמצעות GET." };
      }
      if (reqInfo.basePath !== "/api/products") {
        return { success: false, message: "הנתיב הבסיסי הוא /api/products." };
      }
      if (reqInfo.query.category !== "Books") {
        return { success: false, message: "חסר או שגוי הפרמטר category=Books." };
      }
      if (reqInfo.query.sortBy !== "price") {
        return { success: false, message: "עליך להגדיר מיון לפי מחיר: sortBy=price." };
      }
      if (reqInfo.query.order && reqInfo.query.order !== "asc") {
        return { success: false, message: "למיון מהזול ליקר יש להגדיר order=asc." };
      }
      return {
        success: true,
        message: "מדהים! שילבת בהצלחה מספר Query Parameters והשרת סינן ומייין את הנתונים בפועל!"
      };
    }
  },
  {
    id: 6,
    title: "שלב 6: יצירת מוצר חדש (POST + Request Body)",
    description: "תרחיש: מנהל המערכת מוסיף ספר חדש למערכת בשם 'Node.js in Action' במחיר 34.00, קטגוריה 'Books', במלאי (inStock: true).",
    instruction: "בחר במתודת POST, נתיב המשאב /api/products והעבר בגוף הבקשה (Request Body) אובייקט JSON תואם.",
    hint: "יצירת משאב נעשית עם POST לנתיב /api/products עם JSON Body המכיל name, category, price, inStock.",
    expectedMethod: "POST",
    expectedPath: "/api/products",
    requiresBody: true,
    expectedStatus: 201,
    concepts: ["POST Requests", "Request Body (JSON)", "HTTP Status 201 Created"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "POST") {
        return { success: false, message: "יצירת משאב חדש מתבצעת במתודת POST." };
      }
      if (reqInfo.path !== "/api/products") {
        return { success: false, message: "הנתיב ליצירת מוצר חדש הוא /api/products." };
      }
      const body = reqInfo.body;
      if (!body || typeof body !== "object") {
        return { success: false, message: "חובה לשלוח Request Body במבנה JSON תקני." };
      }
      if (!body.name || !body.category || body.price === undefined) {
        return { success: false, message: "גוף הבקשה חייב להכיל לפחות name, category ו-price." };
      }
      if (body.name.toLowerCase().indexOf("node") === -1 && body.name.toLowerCase().indexOf("action") === -1) {
        return { success: false, message: "שם המוצר נדרש להיות 'Node.js in Action' או דומה." };
      }
      return {
        success: true,
        message: "מעולה! המוצר נוסף לזיכרון השרת והשרת השיב עם סטטוס 201 Created!"
      };
    }
  },
  {
    id: 7,
    title: "שלב 7: עדכון משאב קיים (PUT / PATCH + Route Param + Body)",
    description: "תרחיש: מבצע מיוחד! מחיר המקלדת (מוצר מזהה 4) ירד ל-69.99 ש\"ח. עליך לעדכן את המוצר בשרת.",
    instruction: "שלח בקשת PATCH (או PUT) לנתיב של מוצר 4 עם Request Body הכולל את המחיר המעודכן: price: 69.99.",
    hint: "שילוב של Route Parameter (/api/products/4), מתודת PATCH/PUT ו-Request Body בפורמט JSON.",
    expectedMethod: "PATCH",
    expectedPath: "/api/products/4",
    requiresBody: true,
    expectedStatus: 200,
    concepts: ["PUT/PATCH Requests", "Route Parameters + Request Body combination"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "PATCH" && reqInfo.method !== "PUT") {
        return { success: false, message: "לעדכון משאב יש להשתמש ב-PATCH (עדכון חלקי) או PUT (עדכון מלא)." };
      }
      if (reqInfo.path !== "/api/products/4") {
        return { success: false, message: "עליך לציין את מזהה המוצר 4 בנתיב: /api/products/4." };
      }
      const body = reqInfo.body;
      if (!body || (body.price === undefined && !body.price)) {
        return { success: false, message: "גוף הבקשה חייב לכלול את השדה price עם המחיר המעודכן (69.99)." };
      }
      if (Number(body.price) !== 69.99) {
        return { success: false, message: "המחיר המעודכן צריך להיות בדיוק 69.99." };
      }
      return {
        success: true,
        message: "מצוין! המוצר עודכן בהצלחה בזיכרון השרת והמחיר החדש נשמר."
      };
    }
  },
  {
    id: 8,
    title: "שלב 8: מחיקת משאב (DELETE + Route Parameter)",
    description: "תרחיש: הספל (מוצר מזהה 7) אזל לצמיתות מהמלאי ויש להסירו מהמערכת.",
    instruction: "בחר במתודת DELETE ושלח בקשה למחיקת מוצר עם ID שווה ל-7.",
    hint: "ב-REST, מחיקת משאב נעשית ע\"י DELETE לנתיב המשאב הספציפי: /api/products/7",
    expectedMethod: "DELETE",
    expectedPath: "/api/products/7",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["DELETE Requests", "Route Parameters", "HTTP Status 200/204"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "DELETE") {
        return { success: false, message: "מחיקת משאב מתבצעת במתודת DELETE." };
      }
      if (reqInfo.path !== "/api/products/7") {
        return { success: false, message: "הנתיב למחיקת מוצר 7 הוא /api/products/7." };
      }
      return {
        success: true,
        message: "מעולה! המוצר נמחק בהצלחה מזיכרון השרת."
      };
    }
  },
  {
    id: 9,
    title: "שלב 9: משאבים מקושרים (Nested Resource / Relationship)",
    description: "תרחיש: משתמש רוצה לצפות בכל חוות הדעת והביקורות (reviews) שנכתבו עבור מוצר מזהה 1.",
    instruction: "השתמש במבנה REST היררכי כדי לשלוף את הביקורות של מוצר 1: /api/products/1/reviews.",
    hint: "ייצוג קשר בין משאבים ב-REST נעשה באמצעות נתיב משורשר: /api/products/:productId/reviews",
    expectedMethod: "GET",
    expectedPath: "/api/products/1/reviews",
    requiresBody: false,
    expectedStatus: 200,
    concepts: ["Nested Resources", "Resource Relationships (1:N)", "GET with Nested Routes"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "GET") {
        return { success: false, message: "שליפת נתוני הביקורות נעשית במתודת GET." };
      }
      if (reqInfo.path !== "/api/products/1/reviews") {
        return { success: false, message: "הנתיב ההיררכי התקני לשליפת ביקורות של מוצר 1 הוא /api/products/1/reviews." };
      }
      return {
        success: true,
        message: "יופי של עבודה! שלפת בהצלחה את הביקורות המקושרות למוצר."
      };
    }
  },
  {
    id: 10,
    title: "שלב 10: הוספת משאב מקושר (POST ל-Nested Resource + Body)",
    description: "תרחיש: לקוח בשם 'Dana Ron' רוצה להוסיף ביקורת עם דירוג 5 וטקסט 'Must have for developers!' עבור מוצר מזהה 2.",
    instruction: "שלח בקשת POST לנתיב /api/products/2/reviews עם גוף בקשה JSON הכולל author, rating, comment.",
    hint: "הוספת ביקורת למוצר מסוים מתבצעת ע\"י POST ל-/api/products/2/reviews עם JSON Body.",
    expectedMethod: "POST",
    expectedPath: "/api/products/2/reviews",
    requiresBody: true,
    expectedStatus: 201,
    concepts: ["Nested Resource Creation", "POST + Route Param + Request Body", "Complex REST Relationship"],
    validate: (reqInfo, db) => {
      if (reqInfo.method !== "POST") {
        return { success: false, message: "הוספת ביקורת חדשה נעשית באמצעות POST." };
      }
      if (reqInfo.path !== "/api/products/2/reviews") {
        return { success: false, message: "הנתיב להוספת ביקורת למוצר 2 הוא /api/products/2/reviews." };
      }
      const body = reqInfo.body;
      if (!body || typeof body !== "object") {
        return { success: false, message: "חובה להעביר JSON Body עם פרטי הביקורת." };
      }
      if (!body.author || !body.rating || !body.comment) {
        return { success: false, message: "הביקורת חייבת להכיל author, rating (מספר בין 1 ל-5) ו-comment." };
      }
      return {
        success: true,
        message: "מדהים! סיימת בהצלחה את כל שלבי המשחק והבנת לעומק את עקרונות ה-REST ו-HTTP!"
      };
    }
  }
];

// Schema definitions for SSR /schemas page
const resourceSchemas = [
  {
    name: "Product (מוצר)",
    resourceEndpoint: "/api/products",
    description: "מייצג פריט בקטלוג החנות, כולל מחיר, זמינות במלאי וקטגוריה.",
    fields: [
      { name: "id", type: "Number", required: true, description: "מזהה ייחודי של המוצר (נוצר אוטומטית)" },
      { name: "name", type: "String", required: true, description: "שם המוצר" },
      { name: "category", type: "String", required: true, description: "קטגוריה (לדוגמה: Books, Electronics, Merchandise)" },
      { name: "price", type: "Number", required: true, description: "מחיר המוצר (חיובי)" },
      { name: "inStock", type: "Boolean", required: false, description: "האם המוצר קיים במלאי (ברירת מחדל: true)" },
      { name: "rating", type: "Number", required: false, description: "דירוג ממוצע בין 1.0 ל-5.0" }
    ],
    example: {
      id: 1,
      name: "JavaScript: The Good Parts",
      category: "Books",
      price: 29.99,
      inStock: true,
      rating: 4.5
    }
  },
  {
    name: "Review (ביקורת)",
    resourceEndpoint: "/api/products/:productId/reviews",
    description: "מייצג חוות דעת ודירוג של משתמש עבור מוצר ספציפי (קשר גומלין של 1 לרבים עם Products).",
    fields: [
      { name: "id", type: "Number", required: true, description: "מזהה ייחודי של הביקורת" },
      { name: "productId", type: "Number", required: true, description: "מזהה המוצר אליו משויכת הביקורת (Foreign Key)" },
      { name: "author", type: "String", required: true, description: "שם כותב/ת הביקורת" },
      { name: "rating", type: "Number", required: true, description: "דירוג במספרים שלמים מ-1 עד 5" },
      { name: "comment", type: "String", required: true, description: "תוכן חוות הדעת" }
    ],
    example: {
      id: 101,
      productId: 1,
      author: "Alice Cohen",
      rating: 5,
      comment: "Essential book for any modern web developer!"
    }
  }
];

// Helper to provide client-safe stage information (WITHOUT validation logic or expected answers)
function getClientStages() {
  return gameStages.map(s => ({
    id: s.id,
    title: s.title,
    description: s.description,
    instruction: s.instruction,
    hint: s.hint,
    requiresBody: s.requiresBody,
    concepts: s.concepts
  }));
}

module.exports = {
  gameStages,
  resourceSchemas,
  getClientStages
};
