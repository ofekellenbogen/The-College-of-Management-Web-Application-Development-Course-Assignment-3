/**
 * Game Stage Definitions & Server-Side Verification Logic
 * Note: Correct answers and verification rules are strictly stored on the server!
 */

const gameStages = [
  {
    id: 1,
    title: "שלב 1: שליפת כל המוצרים",
    description: "עליך להציג את קטלוג כל המוצרים הקיימים במערכת: בחר במתודת GET ובנתיב המשאב /api/products.",
    instruction: "עליך להציג את קטלוג כל המוצרים הקיימים במערכת: בחר במתודת GET ובנתיב המשאב /api/products.",
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
      if (reqInfo.basePath !== "/api/products") {
        return { success: false, message: "הנתיב שגוי. הנתיב הסטנדרטי ב-REST לשליפת רשימת מוצרים הוא /api/products." };
      }
      const meaningfulQueryParams = Object.keys(reqInfo.query).filter(k => k !== 'stageId');
      if (meaningfulQueryParams.length > 0) {
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
    description: "עליך לצפות בפרטי מוצר בודד בעל מזהה (ID) מספר 1: שלח בקשת GET עם Route Parameter לנתיב /api/products/1.",
    instruction: "עליך לצפות בפרטי מוצר בודד בעל מזהה (ID) מספר 1: שלח בקשת GET עם Route Parameter לנתיב /api/products/1.",
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
      if (reqInfo.basePath !== "/api/products/1") {
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
    description: "משתמש מנסה לפתוח קישור ישן למוצר מספר 999 שכבר אינו קיים: שלח בקשת GET לנתיב /api/products/999 ובחן את תגובת השגיאה (404 Not Found) מהשרת.",
    instruction: "משתמש מנסה לפתוח קישור ישן למוצר מספר 999 שכבר אינו קיים: שלח בקשת GET לנתיב /api/products/999 ובחן את תגובת השגיאה (404 Not Found) מהשרת.",
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
      if (reqInfo.basePath !== "/api/products/999") {
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
    description: "סנן את המוצרים והצג אך ורק פריטים מקטגוריית 'Electronics': שלח בקשת GET לנתיב /api/products עם ה-Query Parameter המתאים (category=Electronics).",
    instruction: "סנן את המוצרים והצג אך ורק פריטים מקטגוריית 'Electronics': שלח בקשת GET לנתיב /api/products עם ה-Query Parameter המתאים (category=Electronics).",
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
      const category = (reqInfo.query.category || '').toLowerCase();
      if (category !== "electronics") {
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
    description: "הצג מוצרים מקטגוריית 'Books' ממוינים לפי מחיר מהזול ליקר: שלח בקשת GET עם שילוב של מספר Query Parameters (קטגוריה Books, מיון sortBy=price וסדר order=asc).",
    instruction: "הצג מוצרים מקטגוריית 'Books' ממוינים לפי מחיר מהזול ליקר: שלח בקשת GET עם שילוב של מספר Query Parameters (קטגוריה Books, מיון sortBy=price וסדר order=asc).",
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
      const category = (reqInfo.query.category || '').toLowerCase();
      if (category !== "books") {
        return { success: false, message: "חסר או שגוי הפרמטר category=Books." };
      }
      const sortBy = (reqInfo.query.sortBy || '').toLowerCase();
      if (sortBy !== "price") {
        return { success: false, message: "עליך להגדיר מיון לפי מחיר: sortBy=price." };
      }
      const order = (reqInfo.query.order || 'asc').toLowerCase();
      if (order !== "asc") {
        return { success: false, message: "למיון מהזול ליקר יש להגדיר order=asc." };
      }
      return {
        success: true,
        message: "מדהים! שילבת בהצלחה מספר Query Parameters והשרת סינן ומיין את הנתונים בפועל!"
      };
    }
  },
  {
    id: 6,
    title: "שלב 6: יצירת מוצר חדש (POST + Request Body)",
    description: "הוסף ספר חדש למערכת ('Node.js in Action', קטגוריה Books, מחיר 34.00, מלאי inStock: true): שלח בקשת POST לנתיב /api/products עם הנתונים בגוף הבקשה (JSON Body).",
    instruction: "הוסף ספר חדש למערכת ('Node.js in Action', קטגוריה Books, מחיר 34.00, מלאי inStock: true): שלח בקשת POST לנתיב /api/products עם הנתונים בגוף הבקשה (JSON Body).",
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
      if (reqInfo.basePath !== "/api/products") {
        return { success: false, message: "הנתיב ליצירת מוצר חדש הוא /api/products." };
      }
      const body = reqInfo.body;
      if (!body || typeof body !== "object") {
        return { success: false, message: "חובה לשלוח Request Body במבנה JSON תקני." };
      }
      if (!body.name || !body.category || body.price === undefined) {
        return { success: false, message: "גוף הבקשה חייב להכיל לפחות name, category ו-price." };
      }
      const name = String(body.name).toLowerCase();
      if (!name.includes("node") && !name.includes("action") && !name.includes("book")) {
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
    description: "עדכן את מחיר המקלדת (מוצר מזהה 4) ל-69.99 ש\"ח: שלח בקשת PATCH (או PUT) לנתיב /api/products/4 עם Request Body המכיל את המחיר המעודכן.",
    instruction: "עדכן את מחיר המקלדת (מוצר מזהה 4) ל-69.99 ש\"ח: שלח בקשת PATCH (או PUT) לנתיב /api/products/4 עם Request Body המכיל את המחיר המעודכן.",
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
      if (reqInfo.basePath !== "/api/products/4") {
        return { success: false, message: "עליך לציין את מזהה המוצר 4 בנתיב: /api/products/4." };
      }
      const body = reqInfo.body;
      if (!body || body.price === undefined || body.price === null) {
        return { success: false, message: "גוף הבקשה חייב לכלול את השדה price עם המחיר המעודכן (69.99)." };
      }
      if (Math.abs(Number(body.price) - 69.99) > 0.01) {
        return { success: false, message: "המחיר המעודכן צריך להיות 69.99." };
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
    description: "הספל (מוצר מזהה 7) אזל לצמיתות מהמלאי: שלח בקשת DELETE לנתיב המוצר /api/products/7 כדי להסירו מזיכרון השרת.",
    instruction: "הספל (מוצר מזהה 7) אזל לצמיתות מהמלאי: שלח בקשת DELETE לנתיב המוצר /api/products/7 כדי להסירו מזיכרון השרת.",
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
      if (reqInfo.basePath !== "/api/products/7") {
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
    description: "שלוף את כל חוות הדעת והביקורות (reviews) המקושרות למוצר מזהה 1: שלח בקשת GET למשאב ההיררכי המקושר /api/products/1/reviews.",
    instruction: "שלוף את כל חוות הדעת והביקורות (reviews) המקושרות למוצר מזהה 1: שלח בקשת GET למשאב ההיררכי המקושר /api/products/1/reviews.",
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
      if (reqInfo.basePath !== "/api/products/1/reviews") {
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
    description: "הוסף ביקורת חדשה למוצר מזהה 2 (כותב: 'Dana Ron', דירוג: 5, תוכן: 'Must have for developers!'): שלח בקשת POST לנתיב /api/products/2/reviews עם גוף הבקשה (JSON Body).",
    instruction: "הוסף ביקורת חדשה למוצר מזהה 2 (כותב: 'Dana Ron', דירוג: 5, תוכן: 'Must have for developers!'): שלח בקשת POST לנתיב /api/products/2/reviews עם גוף הבקשה (JSON Body).",
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
      if (reqInfo.basePath !== "/api/products/2/reviews") {
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

/**
 * Server-side unified stage validation runner
 * Used by both the request-intercepting Middleware and /api/game/verify
 */
function validateStageRequest(stageId, rawReqInfo, db) {
  const numId = parseInt(stageId, 10);
  const stage = gameStages.find(s => s.id === numId);
  if (!stage) {
    return {
      found: false,
      stageId: numId,
      isCorrect: false,
      feedback: `שלב עם מזהה ${stageId} לא נמצא במערכת.`,
      expectedStatus: 404
    };
  }

  // Parse path and clean base path
  let fullPath = (rawReqInfo.path || rawReqInfo.originalUrl || '').trim();
  // Strip protocol/host if accidentally passed
  fullPath = fullPath.replace(/^https?:\/\/[^/]+/i, '');
  if (!fullPath.startsWith('/')) {
    fullPath = '/' + fullPath;
  }
  let cleanPath = fullPath.split('?')[0];
  // Strip trailing slash if longer than 1 character
  if (cleanPath.length > 1 && cleanPath.endsWith('/')) {
    cleanPath = cleanPath.slice(0, -1);
  }

  // Query normalization
  const query = { ...(rawReqInfo.query || {}) };
  delete query.stageId; // Don't let meta param interfere with stage query requirements

  const reqInfo = {
    method: (rawReqInfo.method || 'GET').toUpperCase(),
    path: cleanPath,
    basePath: cleanPath,
    fullPath: fullPath,
    query: query,
    body: rawReqInfo.body || null
  };

  const validationResult = stage.validate(reqInfo, db);
  return {
    found: true,
    stageId: stage.id,
    isCorrect: validationResult.success,
    feedback: validationResult.message,
    expectedStatus: stage.expectedStatus
  };
}

module.exports = {
  gameStages,
  resourceSchemas,
  getClientStages,
  validateStageRequest
};
