import * as handlers from "./functions.js";

// defining global variables
let galleryData = "",
    galleryListPanel = document.querySelector("#gallery-list-panel"),
    photosContainer = document.querySelector("#photos-container"),
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

export function initControlPanel() {
    // getting json data from server
    handlers.getJSONFromServer("galleryData.json")
        .then(response => {
            galleryData = response;
            let galleryNames = Object.keys(galleryData);

            // preloading all images to object
            let images = {};
            galleryNames.forEach(value => {
                images[value] = handlers.createArrayOfDOMImages("photos", galleryData[value]["photos"], "photo-style");
            })

            //creating DOM elements for each gallery in json
            let galleryListElements = handlers.createArrayOfDOMDivs(galleryNames, "gallery")
            galleryListElements.forEach(value => {
                value.style.backgroundColor = colors[Math.floor((Math.random() * colors.length))]
            })

            let photoElements = []
            galleryListElements.forEach(element => {
                let galleryContainer = handlers.createDivDOMElement("", "gallery-container", element.accessKey)
                let galleryPointerContainer = handlers.createDivDOMElement("", "gallery-pointer-container", element.accessKey)

                galleryContainer.appendChild(galleryPointerContainer)
                galleryContainer.appendChild(element);
                photoElements.push(galleryContainer);
            })

            // appending event listner to button, which updates json by new gallery value from input and sends data to server.
            addGalleryButton.addEventListener("click", () => {
                handlers.addNewPropertyToObjectFromInput(`${inputArea.value}`, galleryData, { "photos": [] })
                handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
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
                        photosContainer.appendChild(imageContainer)
                    })
                })
            })

            deletePhotoButton.addEventListener("click", () => {
                let markedCheckboxes = handlers.filterDOMElements(photosContainer.querySelectorAll("input"), el => el.checked === true)
                let accessKeys = handlers.getAttributesFromDOMElements(markedCheckboxes, "accessKey");

                handlers.removeElementsFromArray(accessKeys, galleryData[selectedGallery]["photos"])
                handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
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
                        handlers.moveValuesFromArrayToArray(accessKeys, galleryData[selectedGallery]["photos"], galleryData[value]["photos"]);
                        handlers.sendJSONToServer(galleryData, "galleryData.json", "updateJSON.php")
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
            handlers.appendDOMElements(photoElements, galleryListPanel);

            addPhotoButton.addEventListener("click", () => {
                document.querySelector("#menu-window").style.display = "flex";
                document.querySelector("#main-window").classList.add("blur");
                handlers.revealDOMElement(document.querySelector("#hidden-add-photo-panel"), "flex")
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
}