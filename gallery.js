import * as handlers from "./functions.js"

// defining global variables
let json = "",
    galleriesListPanel = document.querySelector("#galleries-list-panel"),
    photosContainer = document.querySelector("#photos-container"),
    path = "data.json",
    selectedGallery = "",
    addPhotoButton = document.querySelector("#add-photo-button"),
    galleryNameInput = document.querySelector("#gallery-name-input"),
    addNewGalleryButton = document.querySelector("#add-gallery-button");

// getting json data from server
handlers.updateJSON(path)
.then(response => {
  json = response;
  let galleryNames = Object.keys(json);


//creating list elements for each gallery
  let galleryListElements = handlers.createDivGroup(galleryNames, "gallery")
  let galleries = Object.keys(json);
  let images = {};

// preloading all images.
  galleries.forEach(value => {
    images[value] = handlers.createImgGroup(value, json[value]["photos"], "photo-style")
  })

// setting up json - add event listener to button which sends data(creates directory for photos and json properties) to server.
  addNewGalleryButton.addEventListener("click", () => {
    handlers.addNewPropertyToObjectFromInput(`${galleryNameInput.value}`, json, {"photos": []})
    handlers.sendDataToPHP("directoryName", `${galleryNameInput.value}`, "addNewDirectory.php")
    handlers.sendDataToPHP("json", json, "uploadJSON.php")
    .then(() => {
      location.reload();
    })
  });

// adding event listneres to each gallery list element, which is clearing edit view, then adding clicked gallery photos.
  galleryListElements.forEach(element => {
    element.addEventListener("click", () => {
      photosContainer.innerHTML = "";
      selectedGallery = `${element.textContent}`;
      
      images[selectedGallery].forEach(value => {
        photosContainer.appendChild(value)
      })
    })
  })

// appending gallery list elements to galleries panel.
  handlers.appendElements(galleryListElements, galleriesListPanel);

  addPhotoButton.addEventListener("click", () => {
    document.querySelector("#hidden-add-photo-panel").style.display = "flex";
  })
// uploading images to server, setting up json properties.
  document.querySelector("#upload-file-button").addEventListener("click", () => {  
    handlers.addNewValueToArray(json[selectedGallery]["photos"], document.querySelector("#hidden-input-file").files[0].name)
    handlers.sendDataToPHP("json", json, "uploadJSON.php")
    handlers.sendFileToPHP(document.querySelector("#hidden-input-file").files[0], selectedGallery, "uploadFile.php" )
    .then(() => {
      location.reload();
    })
  })
})