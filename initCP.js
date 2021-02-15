import * as handlers from "./functions.js";

// defining global variables
let galleryData = "",
    galleryListPanel = document.querySelector("#gallery-list-panel"),
    photosContainer = document.querySelector("#photos-container"),
    selectedGallery = "",
    inputArea = document.querySelector("#gallery-name-input"),
    addGalleryButton = document.querySelector("#add-gallery-button"),
    addGallery = document.querySelector("#add-gallery"),
    addPhotoButton = document.querySelector("#add-photo-button"),
    deletePhotoButton = document.querySelector("#delete-photo-button"),
    movePhotoButton = document.querySelector("#move-photo-button"),
    menuWindow = document.querySelector("#menu-window");

let pointerImage = new Image();
pointerImage.src = "./images/fingerPointer.png";
pointerImage.classList.add("pointer-img")

export function initControlPanel() {
    handlers.getJSONFromServer("galleryData.json")
        .then(response => {
            galleryData = response;
            let galleryNames = Object.keys(galleryData);

            // preloading all images to an object
            let images = {};
            galleryNames.forEach(value => {
                images[value] = handlers.createArrayOfDOMImages("photos", galleryData[value]["photos"], "photo-style");
            })

            //creating DOM elements for each gallery in json
            let galleryListElements = handlers.createArrayOfDOMDivs(galleryNames, "gallery")

            // appending event listner to "add-gallery" button, which updates json by new gallery value from input and sends data to server.
            addGallery.addEventListener("click", () => {
                handlers.addNewPropertyToObjectFromInput(`${inputArea.value}`, galleryData, { "photos": [] })
                handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        location.reload();
                    })
            })

            // adding event listneres to each gallery list element, which is clearing edit view and then adding clicked gallery photos from preloaded object
            galleryListElements.forEach(element => {
                element.addEventListener("click", () => {
                    galleryListElements.forEach(element => {
                        element.classList.remove("gallery-selected");
                    })
                    element.classList.add("gallery-selected")
                    photosContainer.innerHTML = "";
                    selectedGallery = `${element.textContent}`;

                    images[selectedGallery].forEach(value => {
                        let imageContainer = handlers.createDivDOMElement("", "image-container", value.accessKey);
                        let shadowBox = handlers.createDivDOMElement("", "shadow-box", value.accessKey);
                        let simbol = handlers.createDivDOMElement("", "inside-image-simbol", value,accessKey)

                        imageContainer.appendChild(value);
                        imageContainer.appendChild(handlers.createInsideImageButton(value.accessKey, "inside-image-button"))
                        imageContainer.appendChild(shadowBox)
                        imageContainer.appendChild(simbol)

                        imageContainer.addEventListener("click", event => {
                            if (event.target.classList.contains("inside-image-button") === false) {
                                if (simbol.style.display === "none") {
                                    simbol.style.display = "flex";
                                    shadowBox.style.display = "flex";
                                } else {
                                    simbol.style.display = "none";
                                    shadowBox.style.display = "none";
                                }
                            }
                        })

                        photosContainer.appendChild(imageContainer)
                    })
                })
            })

            deletePhotoButton.addEventListener("click", () => {
                let markedPhotos = handlers.filterDOMElements(photosContainer.querySelectorAll(".inside-image-simbol"), el => {
                    return el.style.display === "flex";
                })

                let accessKeys = handlers.getAttributesFromDOMElements(markedPhotos, "accessKey");

                handlers.removeElementsFromArray(accessKeys, galleryData[selectedGallery]["photos"])
                handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        handlers.removeDOMElementsFromArrayByAttribute(accessKeys, "accessKey", images[selectedGallery])
                        handlers.removeDOMElementsByAttribute(accessKeys, "accessKey", photosContainer.querySelectorAll(".image-container"))
                    })
            })

            movePhotoButton.addEventListener("click", () => {
                let markedCheckboxes = handlers.filterDOMElements(photosContainer.querySelectorAll(".inside-image-simbol"), el => {
                    return el.style.display === "flex";
                })
                let accessKeys = handlers.getAttributesFromDOMElements(markedCheckboxes, "accessKey");
                let chooseGalleryMenu = document.createElement("div");
                chooseGalleryMenu.classList.add("choose-gallery-menu");
                photosContainer.appendChild(chooseGalleryMenu);

                galleryNames.forEach(value => {
                    let gallery = handlers.createDivDOMElement(value, "destination-gallery")
                    chooseGalleryMenu.appendChild(gallery);
                    gallery.addEventListener("click", () => {
                        handlers.moveValuesFromArrayToArray(accessKeys, galleryData[selectedGallery]["photos"], galleryData[value]["photos"]);
                        handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
                            .then(() => {
                                let DOMElementsToMove = handlers.filterDOMElements(photosContainer.querySelectorAll(".image-container"), el => {
                                    return el.querySelector(".inside-image-simbol").style.display === "flex";
                                })

                                DOMElementsToMove.forEach(element => {
                                    element.remove();
                                    images[selectedGallery] = handlers.arrayRemove(images[selectedGallery], element.querySelector("img"))
                                    images[value].push(element.querySelector("img"));
                                })
                            })
                    })
                })
            })

            // appending gallery list elements to galleries panel.
            handlers.appendDOMElements(galleryListElements, galleryListPanel);

            addPhotoButton.addEventListener("click", () => {
                document.querySelector("#menu-window").style.display = "flex";
                document.querySelector("#main-window").classList.add("blur");
            })

            // uploading images and json properties to server, updating DOM dynamically.
            document.querySelector("#upload-file-button").addEventListener("click", () => {
                let fileName = document.querySelector("#hidden-input-file").files[0].name;
                let loadingAnimation = document.createElement("div")
                loadingAnimation.classList.add("loading-animation");
                menuWindow.appendChild(loadingAnimation);
                handlers.addNewValueToArray(galleryData[selectedGallery]["photos"], document.querySelector("#hidden-input-file").files[0].name)
                handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
                handlers.sendFileToPHP(document.querySelector("#hidden-input-file").files[0], selectedGallery, "uploadFile.php")
                    .then(() => {
                        menuWindow.removeChild(loadingAnimation);
                        document.querySelector("#menu-window").style.display = "none";
                        document.querySelector("#main-window").classList.remove("blur");

                        let image = handlers.createImageDOMElement("photos", fileName, "photo-style");
                        let imageContainer = handlers.createDivDOMElement("", "image-container", fileName)
                        let shadowBox = handlers.createDivDOMElement("", "shadow-box", fileName);
                        let simbol = handlers.createInsideImageSimbol(fileName, "inside-image-simbol");

                        imageContainer.appendChild(image);
                        imageContainer.appendChild(handlers.createInsideImageButton(fileName, "inside-image-button"))
                        imageContainer.appendChild(shadowBox);
                        imageContainer.appendChild(simbol)

                        imageContainer.addEventListener("click", event => {
                            console.log(event.target)
                            let simbol = imageContainer.querySelector(".inside-image-simbol");
                            if (event.target.classList.contains("inside-image-button") === false) {
                                if (simbol.style.display === "none") {
                                    simbol.style.display = "flex";
                                    shadowBox.style.display = "flex";
                                } else {
                                    simbol.style.display = "none";
                                    shadowBox.style.display = "none";
                                }
                            }
                        })
                        photosContainer.appendChild(imageContainer)

                        images[selectedGallery].push(image);
                    })
            })
        })
}