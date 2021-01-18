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
  let galleryListElements = handlers.createGroupOfElements(json, "gallery", "div");
  let keys = Object.keys(json);
  let images = {}

// preloading all images.
  keys.forEach(key => {
    images[key] = {"photos": []};
    json[key]["photos"].forEach(imageFileName => {
      let image = new Image();
      image.src = `./${key}/${imageFileName}`;
      image.classList.add("photo-style")
      images[key]["photos"].push(image);
    })
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

// adding event listneres to each gallery list element, clearing edit view, then adding clicked gallery photos.
  galleryListElements.forEach(element => {
    element.addEventListener("click", () => {
      photosContainer.innerHTML = "";
      selectedGallery = `${element.textContent}`;
      
      images[selectedGallery]["photos"].forEach(image => {
        photosContainer.appendChild(image)
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