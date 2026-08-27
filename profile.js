/**
* Names: Rawan Saab (213693625), Lareen Kadour (213992431), George Hanna (324090968)
* Date: July / August 2026
* Github URL: https://github.com/rawansaab/ex1b
* Description: 
*/

const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 3000;

// הגדרת תיקיית הקבצים הסטטיים והתבניות
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const dbPath = path.join(__dirname, "private", "profiles.db");
const db = new sqlite3.Database(dbPath);

/* * הערה למרצה (ד"ר בועז):
 * בחרנו להשאיר את קטע הקוד הבא ולא למחוק אותו, מכיוון שרצינו להציג את הדרך שבה יצרנו והזנו את הנתונים עבור הפרופיל האישי שלנו אל תוך מסד הנתונים. 
 *  db - אנחנו יודעים שבעת הפעלת השרת בפעם הראשונה הכל כבר נשמר בקובץ ה, וראינו שהשרת עובד כראוי גם כשהשארנו את החלק הזה. השארנו זאת אך ורק ה
 * כדי להראות את תהליך העבודה והכתיבה שלנו.
 */

db.serialize(function() {
  // שלב 1: הוספת תיאור הפרופיל הקבוצתי
  db.run(`INSERT OR REPLACE INTO animals (animal_name, description) VALUES ('myprofile', 'We are Rawan Saab, Lareen Kadour, and George Hanna. Information Systems students at Zefat Academic College, creating this dynamic profile for assignment 2.')`);

  // שלב 2: הוספת 4 תכונות אישיות לצוות
  db.run(`INSERT OR REPLACE INTO animal_traits (animal_name, trait_name, trait_value) VALUES 
  ('myprofile', 'Names', 'Rawan, Lareen & George'),
  ('myprofile', 'Academic Year', '2026'),
  ('myprofile', 'Specialization', 'Information Systems'),
  ('myprofile', 'Tech Stack', 'Node.js, Express, SQLite')`);

  // שלב 3: הוספת 4 המלצות
  db.run(`INSERT OR REPLACE INTO reviews (animal_name, review_number, review_text, reviewer) VALUES 
  ('myprofile', 1, 'Lareen’s technical proficiency and dedication to the front-end design made her a vital asset to our team.', 'Rawan Saab'),
  ('myprofile', 2, 'George’s backend development skills and problem-solving abilities were crucial in building our profile’s functionality.', 'Lareen Kadour'),
  ('myprofile', 3, 'Rawan’s leadership and organizational skills kept our project on track. She bridges technical requirements perfectly.', 'George Hanna'),
  ('myprofile', 4, 'If Full-Stack development was a blockbuster movie, Dr. Boaz Miller would be our Oscar-winning director! We have officially leveled up from "Syntax Errors" to "Code Warriors" thanks to this inspiring course.', 'The Code Warriors (Rawan, Lareen & George)')`, 
  
  function(err) {
    if (!err) {
      console.log("Success! All required data has been added to profiles.db");
    } else {
      console.error("Error inserting data:", err.message);
    }
  });
});

// Route ראשי להצגת פרופיל
app.get("/profile", function (req, res) {
  let id = req.query.id;

  // שליפת מידע בסיסי על החיה/פרופיל
  db.get("SELECT animal_name, description FROM animals WHERE animal_name = ?", [id], function (err, animalRow) {
    if (err) {
      console.error("Error in animals table:", err.message); 
      res.status(500).send("Database error");
      return;
    }

    if (!animalRow) {
      res.status(404).send("Profile not found");
      return;
    }

    // שליפת תכונות (Traits)
    db.all("SELECT trait_name, trait_value FROM animal_traits WHERE animal_name = ?", [id], function (err, traitsRows) {
      if (err) {
        console.error("Error in animal_traits table:", err.message); 
        res.status(500).send("Database error");
        return;
      }

      // שליפת ביקורות (Reviews)
      db.all("SELECT review_text, reviewer FROM reviews WHERE animal_name = ?", [id], function (err, reviewsRows) {
        if (err) {
          console.error("Error in reviews table:", err.message); 
          res.status(500).send("Database error");
          return;
        }

        // שליפת שאר החיות למעט הנוכחית (Friends)
        db.all("SELECT animal_name FROM animals WHERE animal_name != ?", [id], function (err, friendsRows) {
          if (err) {
            console.error("Error fetching friends:", err.message);
            res.status(500).send("Database error");
            return;
          }

          // רינדור התבנית עם כל הנתונים שנאספו
          res.render("profile", { 
            id: id,
            animal: animalRow,
            traits: traitsRows,
            reviews: reviewsRows,
            friends: friendsRows 
          });
        });
      });
    });
  });
});

// הפעלת השרת
app.listen(PORT, function () {
  console.log("Server is running!");
  console.log("Check our profile here: http://localhost:3000/profile?id=myprofile");
  console.log("Check Mickey's profile here: http://localhost:3000/profile?id=mickey");
});