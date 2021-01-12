import * as handlers from "./functions.js"
import {json} from "./gallery.js"

let galleryNameInput = document.querySelector("#gallery-name-input");
let addNewGalleryButton = document.querySelector("#add-gallery-button");

addNewGalleryButton.addEventListener("click", () => {
  handlers.addNewPropertyToObjectFromInput(`${galleryNameInput.value}`, json, {"photos": []})
  handlers.sendDataToPHP("directoryName", `${galleryNameInput.value}`, "addNewDirectory.php")
  handlers.sendDataToPHP("json", json, "uploadJSON.php")
  .then(() => {
    location.reload();
  })
});






