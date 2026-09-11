<div dir="rtl">

# משחק אינטראקטיבי ללימוד HTTP ו-REST API
### המכללה למינהל | הקורס לפיתוח יישומי אינטרנט — מטלה 3

---

## 📌 תיאור הפרויקט
משחק אינטראקטיבי הממחיש ומלמד את עקרונות פרוטוקול ה-HTTP וארכיטקטורת REST API.  
האפליקציה פועלת עם שרת **Node.js & Express** ורינדור תבניות **EJS (SSR)**, לצד ממשק לקוח ב-**HTML, CSS ו-Vanilla JavaScript** השולח בקשות AJAX ומציג משוב חי מהשרת.

---

## 📋 דרישות מוקדמות (Prerequisites)
לפני הרצת הפרויקט נדרשת סביבת **Node.js בגרסת LTS (גרסה 18 ומעלה מומלצת)**, הכוללת את מנהל החבילות **npm**.

אם Node.js טרם מותקן על המחשב, ניתן להתקינו באחת מהדרכים הבאות:

### אפשרות א': התקנה ישירה מהטרמינל (CLI) — ללא צורך בדפדפן
* **ב-Windows (ב-PowerShell / Terminal):**
  ```powershell
  winget install OpenJS.NodeJS.LTS
  ```
* **ב-macOS (באמצעות Homebrew):**
  ```bash
  brew install node
  ```

### אפשרות ב': הורדה והתקנה גרפית
מורידים ומתקינים את גרסת ה-LTS מאתר **[Node.js הרשמי](https://nodejs.org/)**.

### בדיקת תקינות ההתקנה:
פותחים חלון טרמינל חדש ומוודאים שהפקודות מזוהות ומוצגת גרסה 18 ומעלה:
```bash
node -v
npm -v
```

---

## 🚀 הוראות התקנה והרצה מלאות (צעד אחר צעד)

### שלב 1: פתיחת הטרמינל בתיקיית הפרויקט
* אם הורדתם קובץ ZIP — חלצו אותו לתיקייה במחשב, פתחו את הטרמינל ונווטו לתיקייה.
* אם משכפלים דרך Git:
  ```bash
  git clone https://github.com/ofekellenbogen/The-College-of-Management-Web-Application-Development-Course-Assignment-3.git
  cd The-College-of-Management-Web-Application-Development-Course-Assignment-3
  ```

### שלב 2: התקנת התלויות והחבילות (`npm install`)
יש להריץ את הפקודה הבאה בטרמינל להורדת כל החבילות הנדרשות לפרויקט:
```bash
npm install
```

### שלב 3: פקודת ההרצה (הפעלת השרת)
להפעלת השרת יש להריץ:
```bash
npm start
```
*(השרת יופעל ויוצג פלט בטרמינל שהשרת מאזין בכתובת המקומית. למצב פיתוח עם רענון אוטומטי ניתן להריץ: `npm run dev`)*

### שלב 4: הכתובת בדפדפן
לאחר שהשרת רץ, פתחו את הדפדפן וגשו לכתובת:
```
http://localhost:3000
```

*(עמוד סכמות הנתונים ב-SSR זמין בכתובת: `http://localhost:3000/schemas`)*

</div>
