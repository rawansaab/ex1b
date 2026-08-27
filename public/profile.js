/**
* Names: Rawan Saab (213693625), Lareen Kadour (213992431), George Hanna (324090968)
* Date: July / August 2026
* Github URL: https://github.com/rawansaab/ex1b
* Description:
* Client-side code for the dynamic animal profile page.
* The script reads the profile id from the URL and will use Fetch
* to receive profile information from the server.
*/

// קריאת מזהה הפרופיל מה-URL
const urlParams = new URLSearchParams(window.location.search);
const profileId = urlParams.get("id");

// קבלת נתוני הפרופיל מהשרת
async function loadProfile() {
  try {
    const response = await fetch(`/profile?id=${encodeURIComponent(profileId)}`);
    const profileData = await response.json();

    displayProfile(profileData);
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// הכנת פונקציה להצגת נתוני הפרופיל
function displayProfile(profileData) {
  console.log("Profile data ready to display:", profileData);
}

loadProfile();