/**
* Names: Rawan Saab (213693625), Lareen Kadour (213992431), George Hanna (324090968)
* Date: July / August 2026
* Github URL: https://github.com/rawansaab/ex1b
* Description:
* Server-side code for Exercise 1B.
* The server reads profile information from profiles.db and returns it as JSON.
*
* Imported modules:
* express - creates the web server.
* path - handles file and folder paths.
* sqlite3 - connects to the SQLite database.
*
* Changes from the previous exercise:
* 1. EJS and res.render() were removed.
* 2. The server now returns JSON using res.json().
* 3. The HTML page is now located in public/profile.html.
* 4. Client-side JavaScript will read the JSON using Fetch.
*
*/
const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

// הגדרת תיקיית הקבצים הסטטיים
app.use(express.static(path.join(__dirname, "public")));

const dbPath = path.join(__dirname, "private", "profiles.db");
const db = new sqlite3.Database(dbPath);

/*
* הנתונים של myprofile נשמרים במסד הנתונים.
* הקוד נשאר מהתרגיל הקודם כדי לשמור על הפרופיל הקבוצתי שלנו.
*/

db.serialize(function () {
  // הוספת תיאור הפרופיל הקבוצתי
  db.run(`INSERT OR REPLACE INTO animals (animal_name, description)
  VALUES ('myprofile', 'We are Rawan Saab, Lareen Kadour, and George Hanna.
  Information Systems students at Zefat Academic College,
  creating this dynamic profile for Exercise 1B.')`);

  // הוספת תכונות לצוות
  db.run(`INSERT OR REPLACE INTO animal_traits
  (animal_name, trait_name, trait_value) VALUES
  ('myprofile', 'Names', 'Rawan, Lareen & George'),
  ('myprofile', 'Academic Year', '2026'),
  ('myprofile', 'Specialization', 'Information Systems'),
  ('myprofile', 'Tech Stack', 'Node.js, Express, SQLite')`);

  // הוספת המלצות
  db.run(`INSERT OR REPLACE INTO reviews
  (animal_name, review_number, review_text, reviewer) VALUES
  ('myprofile', 1,
  'Lareen’s technical proficiency and dedication to the front-end design
  made her a vital asset to our team.', 'Rawan Saab'),

  ('myprofile', 2,
  'George’s backend development skills and problem-solving abilities
  were crucial in building our profile’s functionality.', 'Lareen Kadour'),

  ('myprofile', 3,
  'Rawan’s leadership and organizational skills kept our project on track.',
  'George Hanna'),

  ('myprofile', 4,
  'Dr. Boaz Miller helped us improve our Full-Stack development skills.',
  'The Code Warriors (Rawan, Lareen & George)')`);
});

// Route לקבלת נתוני הפרופיל כ-JSON
app.get("/profile", function (req, res) {
  const id = req.query.id;

  // שליפת המידע הבסיסי
  db.get(
    "SELECT animal_name, description FROM animals WHERE animal_name = ?",
    [id],
    function (err, animalRow) {
      if (err) {
        console.error("Error in animals table:", err.message);
        res.status(500).json({ error: "Database error" });
        return;
      }

      if (!animalRow) {
        res.status(404).json({ error: "Profile not found" });
        return;
      }

      // שליפת התכונות
      db.all(
        "SELECT trait_name, trait_value FROM animal_traits WHERE animal_name = ?",
        [id],
        function (err, traitsRows) {
          if (err) {
            console.error("Error in animal_traits table:", err.message);
            res.status(500).json({ error: "Database error" });
            return;
          }

          // שליפת ההמלצות
          db.all(
            "SELECT review_text, reviewer FROM reviews WHERE animal_name = ?",
            [id],
            function (err, reviewsRows) {
              if (err) {
                console.error("Error in reviews table:", err.message);
                res.status(500).json({ error: "Database error" });
                return;
              }

              // שליפת שאר הפרופילים
              db.all(
                "SELECT animal_name FROM animals WHERE animal_name != ?",
                [id],
                function (err, friendsRows) {
                  if (err) {
                    console.error("Error fetching friends:", err.message);
                    res.status(500).json({ error: "Database error" });
                    return;
                  }

                  // קישורים לתמונות הפרופיל
                  const images = {
                    banner: `/${id}/banner.png`,
                    profile: `/${id}/profile.png`
                  };

                  // שליחת כל נתוני הפרופיל כ-JSON
                  res.json({
                    id: id,
                    animal: animalRow,
                    traits: traitsRows,
                    reviews: reviewsRows,
                    friends: friendsRows,
                    images: images
                  });
                }
              );
            }
          );
        }
      );
    }
  );
});

// הפעלת השרת
app.listen(PORT, function () {
  console.log("Server is running!");
  console.log("JSON: http://localhost:3000/profile?id=myprofile");
  console.log("Page: http://localhost:3000/profile.html?id=myprofile");
});