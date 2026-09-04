# משחק ללימוד HTTP ו-REST API (מטלה 3)
> **הקורס לפיתוח יישומי אינטרנט | המכללה למינהל**

אפליקציית Web אינטראקטיבית הממחישה את אופן התקשורת בין צד הלקוח לצד השרת באמצעות פרוטוקול HTTP ועקרונות REST API. המשחק מציג תרחישים אמיתיים שבהם המשתמש מרכיב ושולח בקשות HTTP אמיתיות לשרת Node.js & Express, ומקבל משוב מדויק בזמן אמת.

---

## 🚀 הוראות התקנה והרצה מקומית

### דרישות מוקדמות
- [Node.js](https://nodejs.org/) (גרסה 16 ומעלה)
- `npm` (מותקן אוטומטית עם Node.js)

### שלבי הרצה:
1. **שכפול המאגר / פתיחת התיקייה:**
   ```bash
   git clone https://github.com/ofekellenbogen/The-College-of-Management-Web-Application-Development-Course-Assignment-3.git
   cd The-College-of-Management-Web-Application-Development-Course-Assignment-3
   ```

2. **התקנת תלויות השרת:**
   ```bash
   npm install
   ```

3. **הפעלת השרת:**
   ```bash
   npm start
   ```
   *להרצה במצב פיתוח עם טעינה אוטומטית (Live Reload):*
   ```bash
   npm run dev
   ```

4. **פתיחת האפליקציה בדפדפן:**
   פתחו את הדפדפן וגשו לכתובת:
   - 🎮 **עמוד המשחק הראשי:** [http://localhost:3000](http://localhost:3000)
   - 📋 **עמוד סכמות המערכת (SSR):** [http://localhost:3000/schemas](http://localhost:3000/schemas)

---

## 🛠️ מאפיינים טכנולוגיים וארכיטקטורה

- **צד שרת (Backend):**
  - **Node.js** ו-**Express**.
  - ניהול שני משאבים מקושרים: `products` (מוצרים) ו-`reviews` (ביקורות) בקשר של 1 לרבים (1:N Relationship).
  - שמירת נתונים בזיכרון השרת (In-Memory Data Store) עם טעינה ראשונית מקובץ JSON ואפשרות איפוס מהיר.
  - ארכיטקטורת RESTful טהורה ונתיבים עקביים תחת הקידומת `/api`.
  - מנוע תבניות **EJS** לרינדור עמודים בצד השרת (Server-Side Rendering).
  - בדיקת נכונות השלבים (Verification Engine) מתבצעת אך ורק בצד השרת, ללא חשיפת הפתרונות לקליינט.

- **צד לקוח (Frontend):**
  - **Vanilla JavaScript** נקי, מודולרי ותקני (ללא ספריות חיצוניות).
  - שליחת בקשות אמיתיות באמצעות **AJAX (Fetch API)** ללא ריענון עמוד.
  - עיצוב Modern UI מתקדם ויוקרתי (Glassmorphism, Dark Theme, טיפוגרפיית Google Fonts, ואנימציות מיקרו).
  - **רספונסיביות מלאה** למסכי מחשב, טאבלטים ומכשירים ניידים.
  - קבצי ה-CSS וה-JavaScript מופרדים לחלוטין לקבצים חיצוניים תחת תיקיית `public/`.

---

## 🎮 שלבי המשחק (10 שלבים עשירים ומגוונים)

המשחק כולל 10 שלבים שונים המכסים את כל הנושאים הנדרשים ומעבר:

1. **שלב 1 (GET All):** שליפת כל המוצרים (`GET /api/products`) - היכרות עם שליפת משאבים.
2. **שלב 2 (Route Parameter):** שליפת מוצר בודד לפי מזהה (`GET /api/products/1`).
3. **שלב 3 (404 Error Handling):** בקשה למשאב שאינו קיים (`GET /api/products/999`) ובחינת תגובת השגיאה והסטטוס 404 Not Found.
4. **שלב 4 (Query Parameter):** סינון מוצרים לפי קטגוריה (`GET /api/products?category=Electronics`).
5. **שלב 5 (Multiple Query Parameters):** שילוב סינון ומיון לפי מחיר (`GET /api/products?category=Books&sortBy=price&order=asc`).
6. **שלב 6 (POST + Request Body):** יצירת מוצר חדש עם גוף בקשה JSON והחזרת סטטוס 201 Created.
7. **שלב 7 (PUT/PATCH + Route Param + Body):** עדכון פרטי מחיר של מוצר קיים (`PATCH /api/products/4`).
8. **שלב 8 (DELETE + Route Param):** מחיקת מוצר קיים מזיכרון השרת (`DELETE /api/products/7`).
9. **שלב 9 (Nested Resources):** שליפת ביקורות עבור מוצר ספציפי (`GET /api/products/1/reviews`).
10. **שלב 10 (Nested Resource Creation):** הוספת ביקורת חדשה למוצר קיים (`POST /api/products/2/reviews`).

---

## 🌟 תוספות ופיצ'רים מתקדמים
- **לוח מעקב בזמן אמת (Live Server State):** הצגת טבלאות נתונים המשתנות בזמן אמת בזיכרון השרת עם כל בקשת POST / PATCH / DELETE.
- **מערכת ניקוד והתקדמות:** מעקב אחר מספר ניסיונות, צבירת ניקוד והתקדמות באחוזים.
- **חופש ניווט:** אפשרות לחזור לשלבים קודמים בכל עת דרך סרגל השלבים העליון.
- **יומן תגובה עשיר:** הצגת קוד סטטוס צבעוני, זמני תגובה במילישניות, וגוף תגובה מעוצב ומודגש עם כפתור העתקה.
