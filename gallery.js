import * as handlers from "./functions.js"

// defining global variables
let json = "",
    galleryListPanel = document.querySelector("#gallery-list-panel"),
    photosContainer = document.querySelector("#photos-container"),
    path = "data.json",
    selectedGallery = "",
    inputArea = document.querySelector("#gallery-name-input"),
    addGalleryButton = document.querySelector("#add-gallery-button"),
    addPhotoButton = document.querySelector("#add-photo-button"),
    deletePhotoButton = document.querySelector("#delete-photo-button"),
    movePhotoButton = document.querySelector("#move-photo-button"),
    colors = ["#558055", "#9a6666", "#7e78d8", "#d86a6a", "#e0b412", "#5788e2", "#9a6899", "#52bdae", "#888fa0", "#58b2ce"];

// getting json data from server
handlers.updateJSON(path)
.then(response => {
  json = response;
  let galleryNames = Object.keys(json);


//creating elements for each gallery
  let galleryListElements = handlers.createArrayOfDivs(galleryNames, "gallery")
  galleryListElements.forEach(value => {
    value.style.backgroundColor = colors[Math.floor((Math.random() * colors.length))]
  })

// preloading all images to object
  let images = {};
  galleryNames.forEach(value => {
    images[value] = handlers.createArrayOfImages(value, json[value]["photos"], "photo-style")
  })

// appending event listner to button, which updates json by new gallery value from input and sends data to server.
  addGalleryButton.addEventListener("click", () => {
    handlers.addNewPropertyToObjectFromInput(`${inputArea.value}`, json, {"photos": []})
    handlers.sendDataToPHP("directoryName", `${inputArea.value}`, "addNewDirectory.php")
    handlers.sendDataToPHP("json", json, "uploadJSON.php")
    .then(() => {
      location.reload();
    })
  });

// adding event listneres to each gallery list element, which is clearing edit view and then adding clicked gallery photos.
  galleryListElements.forEach(element => {
    element.addEventListener("click", () => {
      photosContainer.innerHTML = "";
      selectedGallery = `${element.textContent}`;
      
      images[selectedGallery].forEach(value => {
        let imageContainer = document.createElement("div")
        imageContainer.classList.add("image-container");
        imageContainer.appendChild(value);
        imageContainer.appendChild(handlers.createCheckbox(value.accessKey, "checkbox"))
        imageContainer.appendChild(handlers.createInsideImageButton(value.accessKey, "inside-image-button"))
        photosContainer.appendChild(imageContainer)
      })
    })
  })

// adding event listener for deleting elements form galleries
deletePhotoButton.addEventListener("click", () => {
  let checkBoxes = photosContainer.querySelectorAll("input");
  let markedCheckBoxes = [];
  checkBoxes.forEach(element => {
    element.checked === true ? markedCheckBoxes.push(element.accessKey) : console.log("box is not checked");
  })
 
  handlers.removeElementsFromArray(markedCheckBoxes, json[selectedGallery]["photos"])
  handlers.sendDataToPHP("json", json, "uploadJSON.php")
  .then(() => {
    location.reload();
  })
})

movePhotoButton.addEventListener("click", () => {
  let checkBoxes = photosContainer.querySelectorAll("input");
  let markedCheckBoxes = [];
  checkBoxes.forEach(element => {
    element.checked === true ? markedCheckBoxes.push(element.accessKey) : console.log("box is not checked");
  })
  
  let moveMenuElement = document.createElement("div");
  moveMenuElement.classList.add("move-menu-element")
  photosContainer.appendChild(moveMenuElement);
  galleryNames.forEach(value => {
    let gallery = document.createElement("div");
    gallery.classList.add("destination-gallery")
    gallery.innerText = value;
    moveMenuElement.appendChild(gallery);
    gallery.addEventListener("click", () => {
      handlers.moveElements(markedCheckBoxes, json[selectedGallery]["photos"], json[value]["photos"]);
      handlers.sendDataToPHP("json", json, "uploadJSON.php")
      .then(() => {
        location.reload();
      })
    })
  })

  // handlers.moveElements(markedCheckBoxes, )
  // handlers.removeElementsFromArray(markedCheckBoxes, json[selectedGallery]["photos"])
  // handlers.sendDataToPHP("json", json, "uploadJSON.php")
  // .then(() => {
  //   location.reload();
  // })
})


// appending gallery list elements to galleries panel.
  handlers.appendElements(galleryListElements, galleryListPanel);

  addPhotoButton.addEventListener("click", () => {
    handlers.revealElement(document.querySelector("#hidden-add-photo-panel"), "flex")
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