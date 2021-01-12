import * as handlers from "./functions.js"
import * as templates from "./templates.js"

export let json = "";
let galleriesContainer = document.querySelector("#galleries-container");
    photosWindowContainer = document.querySelector("#photos-window-container");
    path = "data.json";

handlers.updateJSON(path)
.then(response => {
  json = response;
  let galleries = handlers.createGroupOfElements(Object.keys(json), "gallery", "div");

  galleries.forEach(gallery => {
    let galleryDiv = document.createElement("div")
    galleryDiv.classList.add("hidden-gallery-window");
    galleryDiv.id = `${gallery.id}`;
    galleryDiv.style.display = "none";
    photosWindowContainer.appendChild(galleryDiv);
  })

  galleries.forEach(gallery => {
    gallery.addEventListener("click", () => {
      let hiddenGalleryWindow = photosWindowContainer.querySelector(`#${gallery.id}`);
      if (hiddenGalleryWindow.innerHTML === "") {
        handlers.appendTemplate(hiddenGalleryWindow, templates.templates["controlPanel"]["popUpWindow"]);
        hiddenGalleryWindow.querySelector("#upload-button").addEventListener("click", () => {
          let inputFile = hiddenGalleryWindow.querySelector("#input-file");
          handlers.addNewValueToArray(json[gallery.id]["photos"], inputFile.files[0].name)
          handlers.sendDataToPHP("json", json, "uploadJSON.php")
          handlers.sendFileToPHP(inputFile.files[0], `${gallery.id}`, "uploadFile.php" )
          .then(() => {
            location.reload();
          })
        })

        hiddenGalleryWindow.querySelector("#close-window-button").addEventListener("click", () => {
          handlers.hideElement(photosWindowContainer);
          handlers.hideElement(hiddenGalleryWindow);
        })

        let photos = handlers.createGroupOfElements(json[gallery.id]["photos"], "photo-style", "img", gallery.id)

        handlers.appendElements(photos, hiddenGalleryWindow.querySelector(".photos-section"));
        photosWindowContainer.style.display = "flex";
        hiddenGalleryWindow.style.display = "flex";
      } else {
          photosWindowContainer.style.display = "flex";
          hiddenGalleryWindow.style.display = "flex";
      }
    })
  })
  
  handlers.appendElements(galleries, galleriesContainer);
})