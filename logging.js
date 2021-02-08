import * as handlers from "./functions.js"
import * as controlPanel from "./initCP.js"

// defining global variables
let userData = "",
    accessGranted = false,
    editGalleriesSection = document.querySelector("#edit-galleries-section"),
    loggingSection = document.querySelector("#logging-section"),
    password = document.querySelector("#password"),
    signInButton = document.querySelector("#sign-in-button");

handlers.getJSONFromServer("userData.json")
.then(response => {
  userData = response;
})
.then(() => {
  handlers.getIpAddress("fetchIp.php")
  .then(ip => {
    console.log(ip)
    for(let i = 0; i < userData["loggedUsers"].length; i++) {
      if(userData["loggedUsers"][i]["ipAddress"] === ip && handlers.calcTime(userData["loggedUsers"][i]["timeLogged"]) < 6) {
        accessGranted = true;
        editGalleriesSection.style.display = "flex";
        userData["loggedUsers"][i]["ipAddress"] = ip;
        userData["loggedUsers"][i]["timeLogged"] = new Date().getTime();
        handlers.sendJSONToServer(userData, "userData.json", "updateJSON.php")
        controlPanel.initControlPanel();
        break;
      }
    }

    if (accessGranted === false) {
      loggingSection.style.display = "flex";
      signInButton.addEventListener("click", () => {
        if(password.value === userData["accessCode"]) {
          handlers.addNewValueToArray(userData["loggedUsers"], {"ipAddress": ip, "timeLogged": new Date().getTime()})
          handlers.sendJSONToServer(userData, "userData.json", "updateJSON.php")
          loggingSection.style.display = "none";
          editGalleriesSection.style.display = "flex";
          controlPanel.initControlPanel();
        }
      })
    }
  })
})



