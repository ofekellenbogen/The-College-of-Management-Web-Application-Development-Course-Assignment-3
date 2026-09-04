# 🎮 משחק אינטראקטיבי ללימוד HTTP ו-REST API
### **המכללה למינהל | הקורס לפיתוח יישומי אינטרנט — מטלה 3**

---

## 📌 אודות הפרויקט
משחק אינטראקטיבי הממחיש בצורה מעשית וחווייתית את אופן התקשורת בין **צד הלקוח (Client)** ל**צד השרת (Server)** באמצעות פרוטוקול **HTTP** ועקרונות **REST API**.

במהלך המשחק, השחקן נחשף לתרחישים אמיתיים מעולם פיתוח ה-Web (כגון קטלוג מוצרים ומערכת ביקורות), מרכיב בעצמו בקשות HTTP אמיתיות (Method, Path, Query Parameters, Request Body), שולח אותן באמצעות **AJAX**, ומקבל תגובה חיה ומשוב מפורט משרת ה-Node.js.

> [!NOTE]
> **הבהרת סביבת הרצה:**  
> בהתאם להנחיות המטלה, הפרויקט כולל שרת Node.js & Express פעיל המנהל נתונים בזיכרון, ולכן יש **להריצו בסביבה מקומית** ולא ב-GitHub Pages.

---

## 🚀 הוראות התקנה והרצה מקומית

### 📋 דרישות מוקדמות
- **[Node.js](https://nodejs.org/)** (גרסה 16 ומעלה)
- **npm** (מותקן אוטומטית יחד עם Node.js)

---

### 💻 שלבי ההרצה (צעד אחר צעד)

#### 1️⃣ שכפול המאגר וכניסה לתיקייה
פתחו את הטרמינל / PowerShell והריצו:
```bash
git clone https://github.com/ofekellenbogen/The-College-of-Management-Web-Application-Development-Course-Assignment-3.git
cd The-College-of-Management-Web-Application-Development-Course-Assignment-3
```

#### 2️⃣ התקנת התלויות והחבילות (Dependencies)
```bash
npm install
```

#### 3️⃣ הפעלת השרת
```bash
npm start
```
> 💡 *להרצה במצב פיתוח עם רענון אוטומטי (Nodemon):* `npm run dev`

#### 4️⃣ פתיחת האפליקציה בדפדפן
לאחר שהשרת רץ, גשו לכתובות הבאות בדפדפן:
- 🎮 **עמוד המשחק הראשי:** [`http://localhost:3000`](http://localhost:3000)
- 📋 **עמוד סכמות המערכת (SSR):** [`http://localhost:3000/schemas`](http://localhost:3000/schemas)

---

## 🕹️ מהלך המשחק — 10 שלבי לימוד מגוונים

המשחק כולל **10 שלבים מתקדמים** המתרגלים מגוון רחב של מושגים ותרחישים בעולם ה-REST:

| שלב | נושא המשימה | מתודת HTTP | נתיב הבקשה (Endpoint) | מושגים מתורגלים |
| :---: | :--- | :---: | :--- | :--- |
| **1** | **שליפת כל המוצרים** | `GET` | `/api/products` | שליפת משאב ברבים, REST Naming |
| **2** | **שליפת מוצר בודד לפי מזהה** | `GET` | `/api/products/1` | Route Parameters, שליפת משאב יחיד |
| **3** | **טיפול בשגיאת משאב לא קיים** | `GET` | `/api/products/999` | HTTP 404 Not Found, Error Handling |
| **4** | **סינון מוצרים לפי קטגוריה** | `GET` | `/api/products?category=Electronics` | Query Parameters, סינון נתונים |
| **5** | **שילוב סינון ומיון מרובה** | `GET` | `/api/products?category=Books&sortBy=price&order=asc` | Multiple Query Parameters, מיון וסינון משולב |
| **6** | **הוספת מוצר חדש** | `POST` | `/api/products` | Request Body (JSON), HTTP 201 Created |
| **7** | **עדכון מחיר של מוצר קיים** | `PATCH` | `/api/products/4` | Route Param + Request Body, עדכון חלקי |
| **8** | **מחיקת מוצר מהמערכת** | `DELETE` | `/api/products/7` | Route Param, מחיקת משאב ב-REST |
| **9** | **שליפת ביקורות של מוצר** | `GET` | `/api/products/1/reviews` | Nested Resources, קשר 1 לרבים (1:N) |
| **10** | **הוספת ביקורת למוצר מקושר** | `POST` | `/api/products/2/reviews` | יצירת משאב היררכי, Body + Route Param |

---

## 🛠️ ארכיטקטורה ורכיבי המערכת

### 🖥️ צד שרת (Backend)
- **Node.js & Express:** ניהול מלא של בקשות ה-REST API ושרת ה-Web.
- **משאבים מקושרים (Relational Resources):** ניהול שני משאבים — `Products` ו-`Reviews` — עם תמיכה בקשרי גומלין ושרשור נתיבים (Nested Routing).
- **ניהול נתונים בזיכרון (In-Memory DB):** הנתונים נטענים מקובץ JSON ראשוני ונשמרים בזיכרון השרת. כל פעולת הוספה, עדכון או מחיקה משנה את הנתונים בפועל ומאפשרת לבחון את ההשפעה בבקשות הבאות.
- **Server-Side Rendering (EJS):** עמוד המשחק ועמוד הסכמות (`/schemas`) מרונדרים בצד השרת.
- **מנוע אימות פתרונות (Verification Engine):** בדיקת נכונות השלבים מתבצעת **אך ורק בשרת** (`POST /api/game/verify`), ללא חשיפת פתרונות לקליינט.

### 💻 צד לקוח (Frontend)
- **Pure Vanilla JavaScript:** קוד לקוח מודולרי ונקי, ללא שימוש בספריות צד-שלישי.
- **תקשורת AJAX אסינכרונית:** שליחת בקשות HTTP אמיתיות ועדכון דינמי של הממשק ללא טעינה מחדש של הדף.
- **בונה בקשות אינטראקטיבי (Request Builder):** בחירת Method, עריכת נתיב ו-Route Params, הוספה דינמית של Query Parameters, ועורך JSON Body עם בדיקת תקינות.
- **תצוגת תגובה עשירה (Live Response Viewer):** הצגת Status Code צבעוני, זמני תגובה במילישניות, גוף תגובה מפורמט וכפתור העתקה.
- **לוח תמונת מצב חיה (Live Server State):** טבלאות נתונים המציגות את מצב השרת בזמן אמת.
- **חוויית משתמש ועיצוב מודרני:** עיצוב Dark Theme מתקדם, Glassmorphism, רספונסיביות מלאה למחשב ולנייד, מעקב התקדמות וניקוד.

---

## 📂 מבנה התיקיות בפרויקט

```text
├── data/
│   └── initialData.json        # קובץ הנתונים הראשוני של המוצרים והביקורות
├── public/
│   ├── css/
│   │   └── style.css           # עיצוב האפליקציה (CSS Design System)
│   └── js/
│       └── game.js             # לוגיקת צד לקוח, AJAX וממשק משתמש (Vanilla JS)
├── server/
│   ├── db.js                   # ניהול מסד הנתונים בזיכרון השרת
│   ├── gameConfig.js           # הגדרות שלבי המשחק ולוגיקת האימות בשרת
│   └── routes/
│       ├── game.js             # נתיבי אימות המשחק ואיפוס הנתונים
│       ├── products.js         # נתיבי REST עבור משאב המוצרים
│       └── reviews.js          # נתיבי REST עבור משאב הביקורות
├── views/
│   ├── 404.ejs                 # עמוד שגיאה 404
│   ├── index.ejs               # עמוד המשחק הראשי (SSR)
│   └── schemas.ejs             # עמוד סכמות המערכת ומפת ה-API (SSR)
├── index.html                  # עמוד תיעוד מעוצב ודינמי עבור GitHub Pages
├── package.json                # הגדרות הפרויקט ותלויות ה-Node.js
├── README.md                   # תיעוד הפרויקט והוראות הרצה
└── server.js                   # נקודת הכניסה הראשית והפעלת שרת ה-Express
```

---

## 👥 מגישים
- **אופק אלנבוגן**
- **בן/בת הזוג לצוות**

---
*נבנה במסגרת תרגיל 3 בקורס פיתוח יישומי אינטרנט, המכללה למינהל.*
