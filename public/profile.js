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
    displayTraits(profileData.traits);
  } catch (error) {
    console.error("Error loading profile:", error);
  }
}

// הצגת שם ותיאור הפרופיל
function displayProfile(profileData) {
  const profileName = document.getElementById("profile-name");
  const profileDescription = document.getElementById("profile-description");

  profileName.textContent = profileData.animal.animal_name;
  profileDescription.textContent = profileData.animal.description;
}

// הצגת תכונות הפרופיל
function displayTraits(traits) {
  const traitsList = document.getElementById("traits-list");

  traits.forEach(function (trait) {
    const traitItem = document.createElement("div");
    traitItem.classList.add("trait-item");

    const traitName = document.createElement("strong");
    traitName.textContent = `${trait.trait_name}: `;

    const traitValue = document.createElement("span");
    traitValue.textContent = trait.trait_value;

    traitItem.appendChild(traitName);
    traitItem.appendChild(traitValue);
    traitsList.appendChild(traitItem);
  });
}

loadProfile();