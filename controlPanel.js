import * as handlers from "./controlPanelFunctions.js"

let galleriesContainer = document.querySelector("#galleries-container");
let json = "";

fetch("data.json")
.then(response => response.json())
.then(response => {
  json = response;
  handlers.createListOfGalleries(json, galleriesContainer);
  handlers.appendEventListenersToGalleries(json);
})

const galleryNameInput = document.querySelector("#gallery-name-input");
const addNewGalleryButton = document.querySelector("#add-gallery-button");

addNewGalleryButton.addEventListener("click", () => {
  addNewGallery(json);
});

function addNewGallery(json) {
  const galleryID = galleryNameInput.value;

  if (galleryID !== "") {
    if(json.hasOwnProperty(galleryID)) {
      alert("Oops! This name is already in use!");
    } else {
      json[galleryID] = {"photos": []};
      let fd = new FormData();
      fd.append("json", JSON.stringify(json))
      fd.append("galleryID", galleryID)

      fetch("addNewGallery.php", {
        method: "POST",
        body: fd,
      })
      .then(() => {
        location.reload();
      })
    }
  } else {
    alert("Oops! The name has not been selected...");
  }
  galleryNameInput.value = "";
}




