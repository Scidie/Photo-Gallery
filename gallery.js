//TODO:
// - add delete gallery option
// - add change name of gallery option
// - add quick option feature (activated by pencil button) which will inlcude:
//      - editing descriptions of photographies
//      - deleting single elements
//      - moving photo to different gallery
// - add rearrange order of photos feature (This one is something more complicated which needs to be designed)

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
    colors = ["#558055", "#9a6666", "#7e78d8", "#d86a6a", "#e0b412", "#5788e2", "#9a6899", "#52bdae", "#888fa0", "#58b2ce"],
    menuWindow = document.querySelector("#menu-window");

let pointerImage = new Image();
pointerImage.src = "./images/fingerPointer.png";
pointerImage.classList.add("pointer-img")

// getting json data from server
handlers.updateJSON(path)
.then(response => {
  json = response;
  let galleryNames = Object.keys(json);


//creating DOM elements for each gallery in json
  let galleryListElements = handlers.createArrayOfDOMDivs(galleryNames, "gallery")
  galleryListElements.forEach(value => {
    value.style.backgroundColor = colors[Math.floor((Math.random() * colors.length))]
  })

  let galleryListElementsInContainers = []
  galleryListElements.forEach(element => {
    let galleryContainer = handlers.createDivDOMElement("", "gallery-container", element.accessKey)
    let galleryPointerContainer = handlers.createDivDOMElement("", "gallery-pointer-container", element.accessKey)
    
    galleryContainer.appendChild(galleryPointerContainer)
    galleryContainer.appendChild(element);
    galleryListElementsInContainers.push(galleryContainer);
  })

// preloading all images to object
  let images = {};
  galleryNames.forEach(value => {
    images[value] = handlers.createArrayOfDOMImages("photos", json[value]["photos"], "photo-style");
  })

// appending event listner to button, which updates json by new gallery value from input and sends data to server.
  addGalleryButton.addEventListener("click", () => {
    handlers.addNewPropertyToObjectFromInput(`${inputArea.value}`, json, {"photos": []})
    handlers.sendDataToPHP("json", json, "uploadJSON.php")
    .then(() => {
      location.reload();
    })
  });

// adding event listneres to each gallery list element, which is clearing edit view and then adding clicked gallery photos from preloaded object
  galleryListElements.forEach(element => {
    element.addEventListener("click", () => {
      document.querySelectorAll(".gallery").forEach(gallery => {
        gallery.classList.remove("gallery-selected")
      })
      element.classList.add("gallery-selected")
      galleryListPanel.querySelectorAll(".gallery-pointer-container").forEach(container => {
        if (container.accessKey === element.accessKey) {
          container.appendChild(pointerImage)
        } else if (container.hasChildNodes(pointerImage)) {
          container.removeChild(pointerImage);
        }
      })
      
      photosContainer.innerHTML = "";
      selectedGallery = `${element.textContent}`;
      
      images[selectedGallery].forEach(value => {
        let imageContainer = document.createElement("div")
        imageContainer.classList.add("image-container");
        imageContainer.accessKey = value.accessKey;
        imageContainer.appendChild(value);
        imageContainer.appendChild(handlers.createDOMCheckbox(value.accessKey, "checkbox"))
        // imageContainer.appendChild(handlers.createInsideImageButton(value.accessKey, "inside-image-button"))
        photosContainer.appendChild(imageContainer)
      })
    })
  })

deletePhotoButton.addEventListener("click", () => {
  let markedCheckboxes = handlers.filterDOMElements(photosContainer.querySelectorAll("input"), el => el.checked === true)
  let accessKeys = handlers.getAttributesFromDOMElements(markedCheckboxes, "accessKey");

  handlers.removeElementsFromArray(accessKeys, json[selectedGallery]["photos"])
  handlers.sendDataToPHP("json", json, "uploadJSON.php")
  .then(() => {
    handlers.removeDOMElementsFromArrayByAttribute(accessKeys, "accessKey", images[selectedGallery])
    handlers.removeDOMElementsByAttribute(accessKeys, "accessKey", photosContainer.querySelectorAll(".image-container"))
  })
})

movePhotoButton.addEventListener("click", () => {
  let markedCheckboxes = handlers.filterDOMElements(photosContainer.querySelectorAll("input"), el => el.checked === true);
  let accessKeys = handlers.getAttributesFromDOMElements(markedCheckboxes, "accessKey");
  let chooseGalleryMenu = document.createElement("div");
  chooseGalleryMenu.classList.add("choose-gallery-menu");
  photosContainer.appendChild(chooseGalleryMenu);

  galleryNames.forEach(value => {
    let gallery = handlers.createDivDOMElement(value, "destination-gallery")
    chooseGalleryMenu.appendChild(gallery);
    gallery.addEventListener("click", () => {
      handlers.moveValuesFromArrayToArray(accessKeys, json[selectedGallery]["photos"], json[value]["photos"]);
      handlers.sendDataToPHP("json", json, "uploadJSON.php")
      .then(() => {
        let DOMElementsToDelete = handlers.filterDOMElements(photosContainer.querySelectorAll(".image-container"), el => el.querySelector("input").checked === true);
        DOMElementsToDelete.forEach(element => {
          element.remove();
          images[selectedGallery] = handlers.arrayRemove(images[selectedGallery], element.querySelector("img"))
          images[value].push(element.querySelector("img"));
        })
      })
    })
  })
})


// appending gallery list elements to galleries panel.
  handlers.appendDOMElements(galleryListElementsInContainers, galleryListPanel);

  addPhotoButton.addEventListener("click", () => {
    document.querySelector("#menu-window").style.display = "flex";
    document.querySelector("#main-window").classList.add("blur");
    handlers.revealDOMElement(document.querySelector("#hidden-add-photo-panel"), "flex")
  })
  
// uploading images to server, setting up json properties.
  document.querySelector("#upload-file-button").addEventListener("click", () => {  
    let fileName = document.querySelector("#hidden-input-file").files[0].name;
    let loadingAnimation = document.createElement("div")
    loadingAnimation.classList.add("loading-animation");
    menuWindow.appendChild(loadingAnimation);
    handlers.addNewValueToArray(json[selectedGallery]["photos"], document.querySelector("#hidden-input-file").files[0].name)
    handlers.sendDataToPHP("json", json, "uploadJSON.php")
    handlers.sendFileToPHP(document.querySelector("#hidden-input-file").files[0], selectedGallery, "uploadFile.php" )
    .then(() => {
      menuWindow.removeChild(loadingAnimation);
      handlers.hideDOMElement(document.querySelector("#menu-window"));
      document.querySelector("#main-window").classList.remove("blur");

      let image = handlers.createImageDOMElement("photos", fileName, "photo-style");
      let imageContainer = handlers.createDivDOMElement("", "image-container", fileName)
      
      imageContainer.appendChild(image);
      imageContainer.appendChild(handlers.createDOMCheckbox(fileName, "checkbox"))
      imageContainer.appendChild(handlers.createInsideImageButton(fileName, "inside-image-button"))
      photosContainer.appendChild(imageContainer)

      images[selectedGallery].push(image);
    })
  })
})