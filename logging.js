import * as handlers from "./functions.js"
import * as controlPanel from "./initCP.js"

// defining global variables
let userData = "",
  index = "",
  ipAddress = "",
  userLogged = false,
  editGalleriesSection = document.querySelector("#edit-galleries-section"),
  loggingSection = document.querySelector("#logging-section"),
  password = document.querySelector("#password"),
  signInButton = document.querySelector("#sign-in-button"),
  singOutButton = document.querySelector(".logout-button");

handlers.getJSONFromServer("userData.json")
  .then(response => {
    userData = response;

    handlers.getIpAddress("fetchIp.php")
      .then(ip => {
        ipAddress = ip;
        for (let i = 0; i < userData["loggedUsers"].length; i++) {
          if (userData["loggedUsers"][i]["ipAddress"] === ip && handlers.calcTime(userData["loggedUsers"][i]["timeLogged"]) < 6) {
            singOutButton.style.backgroundColor = "#00b839";
            editGalleriesSection.style.display = "flex";
            userData["loggedUsers"][i]["ipAddress"] = ip;
            userData["loggedUsers"][i]["timeLogged"] = new Date().getTime();
            index = i;
            handlers.sendJSONToServer(userData, "userData.json", "updateJSON.php")
            controlPanel.initControlPanel();
            userLogged = true;
            break;
          }
        }
      })
      .then(() => {
        if (userLogged === false) {
          initLoggingSection(ipAddress);
        }
      })
      .then(() => {
        singOutButton.addEventListener("click", () => {
          if (userLogged === true) {
            userData["loggedUsers"].splice(index, 1)
            handlers.sendJSONToServer(userData, "userData.json", "updateJSON.php")
              .then(() => {
                location.reload();
              })
          } else {
            alert("You are not logged in!")
          }
        })
      })
  })

function initLoggingSection(ip) {
  loggingSection.style.display = "flex";
  signInButton.addEventListener("click", () => {
    if (password.value === userData["accessCode"]) {
      singOutButton.style.backgroundColor = "green";
      userLogged = true;
      handlers.addNewValueToArray(userData["loggedUsers"], { "ipAddress": ip, "timeLogged": new Date().getTime() })
      handlers.sendJSONToServer(userData, "userData.json", "updateJSON.php")
      for (let i = 0; i < userData["loggedUsers"].length; i++) {
        if (userData["loggedUsers"][i]["ipAddress"] === ip) {
          index = i;
          break;
        }
      }
      loggingSection.style.display = "none";
      editGalleriesSection.style.display = "flex";
      controlPanel.initControlPanel();
    }
  })
}