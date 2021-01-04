import * as handlers from "./controlPanelFunctions.js"

let galleriesContainer = document.querySelector("#galleries-container");

fetch("data.json")
.then(response => response.json())
.then(json => {
  handlers.createListOfGalleries(json, galleriesContainer);
  handlers.appendEventListenersToGalleries(json);
})

const galleryNameInput = document.querySelector("#gallery-name-input");
const addNewGalleryButton = document.querySelector("#add-gallery-button");

addNewGalleryButton.addEventListener("click", addNewGallery);

function addNewGallery() {
  const galleryID = galleryNameInput.value;
  let initGalleryValue = {
    "photos": []
  }
  initGalleryValue = JSON.stringify(initGalleryValue);

  let fd = new FormData();
  fd.append("initGalleryValue", initGalleryValue)
  fd.append("galleryID", galleryID)

  fetch("addNewGallery.php", {
    method: "POST",
    body: fd,
  })
  .then(() => {
    location.reload();
  })
  
  galleryNameInput.value = "";
}




