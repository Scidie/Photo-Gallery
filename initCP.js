import * as handlers from "./functions.js";

// defining global variables
let galleryData_JSON = "",
    galleryList_Panel = document.querySelector("#gallery-list-panel"),
    photosContainer = document.querySelector("#photos-container"),
    selectedGallery = "",
    galleryName_Input = document.querySelector("#gallery-name-input"),
    addGallery_Button = document.querySelector("#add-gallery-button"),
    showAddGalleryMenu_Button = document.querySelector("#show-add-gallery-menu-button"),
    addPhoto_Button = document.querySelector("#add-photo-button"),
    deletePhoto_Button = document.querySelector("#delete-photo-button"),
    movePhoto_Button = document.querySelector("#move-photo-button"),
    uploadFile_MenuWindow = document.querySelector("#upload-file-menu-window"),
    changeGalleryName_Button = document.querySelector("#change-gallery-name-button"),
    changeGalleryName_Input = document.querySelector("#change-gallery-name-input"),
    deleteGallery_Button = document.querySelector("#delete-gallery-button"),
    movePhotos_MenuWindow = document.querySelector("#move-photos-menu-window"),
    showRenameGalleryMenu_Button = document.querySelector("#show-rename-gallery-menu-button"),
    chooseGallery_MenuWindow = document.querySelector(".choose-gallery-menu"),
    photosOrder_MenuWindow = document.querySelector("#photos-order-menu-window"),
    emptySlotsContainer = document.querySelector("#empty-slots-container"),
    photosToChooseFromContainer = document.querySelector("#photos-to-choose-from-container"),
    showPhotosOrderMenu_Button = document.querySelector("#show-photos-order-menu-button"),
    body = document.querySelector("body"),
    dragSrcElement = "",
    savedSlot = "";

function handleDragStart(event) {
    dragSrcElement = event.target;
    event.target.style.opacity = "0.4";
    event.dataTransfer.effectAllowed = "true";
    event.dataTransfer.setData("text/plain", event.target.accessKey)
}

function handleDragEnd(event) {
    event.preventDefault();
    event.target.style.opacity = "1";
}

export function initControlPanel() {
    handlers.getJSONFromServer("galleryData.json")
        .then(response => {
            // body.addEventListener("mouseover", event => {
            //     console.log(event.target);
            // })

            galleryData_JSON = response;
            let galleryNames = [];

            galleryData_JSON["galleries"].forEach(value => {
                galleryNames.push(value["galleryName"]);
            })

            // preloading all images to an object
            let photos = {};
            galleryData_JSON["galleries"].forEach(value => {
                photos[value["galleryName"]] = handlers.createArrayOfDOMImages("photos", value["photos"], "photo-style");
            })

            //creating DOM elements based on each gallery name in json
            let galleryDOMElements = handlers.createArrayOfDOMDivs(galleryNames, "gallery");

            // appending event listner to "add-gallery" button, which updates json by new gallery value from input and sends data to server.
            addGallery_Button.addEventListener("click", () => {
                galleryData_JSON["galleries"].push({"photos": [], "galleryName": galleryName_Input.value});
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        location.reload();
                    })
            })

            showAddGalleryMenu_Button.addEventListener("click", () => {
                document.querySelector("#add-gallery-menu-window").style.display = "flex";
                document.querySelector("#main-window").classList.add("blur");
            })




























            showPhotosOrderMenu_Button.addEventListener("click", () => {
                // find the right array of photos names
                let photosToChooseFrom_Names =  handlers.getArrayPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", value => {
                    return value["galleryName"] === selectedGallery;
                })

                //copying images based on array variable
                let copiedImages = []

                photos[selectedGallery].forEach(photo => {
                    let singleCopiedImage = photo.cloneNode(true);
                    singleCopiedImage.classList.add("photo-style2")
                    singleCopiedImage.setAttribute("draggable", "true")
                    copiedImages.push(singleCopiedImage)
                })

                

                copiedImages.forEach(photo => {
                    photo.addEventListener("dragover", handlers.handleDragOver, false)
                    photo.addEventListener("dragstart", event => {
                        savedSlot = event.target.parentNode;
                        event.target.style.opacity = "0.4";
                        event.dataTransfer.setData("text/plain", event.target.accessKey)
                    })

                    photo.addEventListener("dragend", event => {
                        event.target.style.opacity = "1";
                    })
                    
                    photosToChooseFromContainer.appendChild(photo);
                })

                photosToChooseFrom_Names.forEach(name => {
                    let emptySlot = handlers.createDivDOMElement(photosToChooseFrom_Names.indexOf(name) + 1, "empty-slot", photosToChooseFrom_Names.indexOf(name) + 1)
                    emptySlot.addEventListener("dragover", handlers.handleDragOver, false)
                    emptySlot.addEventListener("drop", event => {
                        if (emptySlot.firstElementChild !== null) {
                            savedSlot.appendChild(emptySlot.firstElementChild);
                        }

                        for (let i = 0; i < copiedImages.length; i++) {
                            if (copiedImages[i].accessKey === event.dataTransfer.getData("text/plain")) {
                                emptySlot.appendChild(copiedImages[i])
                                event.dataTransfer.clearData()
                                break;
                            }
                        }
                    })

                    emptySlotsContainer.appendChild(emptySlot);
                })

                photosOrder_MenuWindow.style.display = "flex";
            })






























            deleteGallery_Button.addEventListener("click", () => {
                handlers.deleteObjectFromArray(galleryData_JSON["galleries"], el => {
                    return el["galleryName"] === selectedGallery;
                })
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                .then(() => {
                    location.reload();
                })
            })

            showRenameGalleryMenu_Button.addEventListener("click", () => {
                document.querySelector("#gallery-menu-window").style.display = "flex";
                document.querySelector("#main-window").classList.add("blur");
            })
            
            changeGalleryName_Button.addEventListener("click", () => {
                handlers.findAndEditArrayProperty(galleryData_JSON["galleries"], "galleryName", changeGalleryName_Input.value, el => {
                    return el["galleryName"] === selectedGallery;
                })
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                .then(() => {
                    location.reload();
                })
            })

            // adding event listneres to each gallery element, which is clearing "edit view" section and then adding clicked gallery photos from object with preloader earlier images
            galleryDOMElements.forEach(element => {
                element.addEventListener("click", () => {
                    galleryDOMElements.forEach(element => {
                        element.classList.remove("gallery-selected");
                    })
                    element.classList.add("gallery-selected")
                    photosContainer.innerHTML = "";

                    selectedGallery = element.textContent;

                    photos[selectedGallery].forEach(value => {
                        let imageContainer = handlers.createDivDOMElement("", "image-container", value.accessKey);
                        let shadowBox = handlers.createDivDOMElement("", "shadow-box", value.accessKey);
                        let simbol = handlers.createDivDOMElement("", "inside-image-simbol", value.accessKey)

                        imageContainer.appendChild(value);
                        imageContainer.appendChild(handlers.createInsideImageButton(value.accessKey, "inside-image-button"))
                        imageContainer.appendChild(shadowBox)
                        imageContainer.appendChild(simbol)
                        simbol.style.display = "none";

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

            deletePhoto_Button.addEventListener("click", () => {
                let markedPhotos = handlers.filterDOMElements(photosContainer.querySelectorAll(".inside-image-simbol"), el => {
                    return el.style.display === "flex";
                })

                let accessKeys = handlers.getAttributesFromDOMElements(markedPhotos, "accessKey");

                let photosArray = handlers.getArrayPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                    return el["galleryName"] === selectedGallery;
                })

                handlers.removeElementsFromArray(accessKeys, photosArray)
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        handlers.removeDOMElementsFromArrayByAttribute(accessKeys, "accessKey", photos[selectedGallery])
                        handlers.removeDOMElementsByAttribute(accessKeys, "accessKey", photosContainer.querySelectorAll(".image-container"))
                    })
            })

            movePhoto_Button.addEventListener("click", () => {
                let markedPhotos = handlers.filterDOMElements(photosContainer.querySelectorAll(".inside-image-simbol"), el => {
                    return el.style.display === "flex";
                })
                let accessKeys = handlers.getAttributesFromDOMElements(markedPhotos, "accessKey");
                chooseGallery_MenuWindow.innerHTML = "";
                movePhotos_MenuWindow.style.display = "flex"

                galleryNames.forEach(value => {
                    let gallery = handlers.createDivDOMElement(value, "blue-button")
                    let photosArray = handlers.getArrayPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                        return el["galleryName"] === selectedGallery;
                    })
                    let newLocation = handlers.getArrayPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                        return el["galleryName"] === value;
                    })

                    chooseGallery_MenuWindow.appendChild(gallery)
                    gallery.addEventListener("click", () => {
                        handlers.moveValuesFromArrayToArray(accessKeys, photosArray, newLocation);
                        handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                            .then(() => {
                                let DOMElementsToMove = handlers.filterDOMElements(photosContainer.querySelectorAll(".image-container"), el => {
                                    return el.querySelector(".inside-image-simbol").style.display === "flex";
                                })

                                DOMElementsToMove.forEach(element => {
                                    element.remove();
                                    photos[selectedGallery] = handlers.arrayRemove(photos[selectedGallery], element.querySelector("img"))
                                    photos[value].push(element.querySelector("img"));
                                })
                                movePhotos_MenuWindow.style.display = "none";
                            })
                    })
                })
            })

            // appending gallery list elements to galleries panel.
            handlers.appendDOMElements(galleryDOMElements, galleryList_Panel);

            addPhoto_Button.addEventListener("click", () => {
                document.querySelector("#upload-file-menu-window").style.display = "flex";
                document.querySelector("#main-window").classList.add("blur");
            })

            // uploading images and json properties to server, updating DOM dynamically.
            document.querySelector("#upload-file-button").addEventListener("click", () => {
                let fileName = document.querySelector("#hidden-input-file").files[0].name;
                let loadingAnimation = document.createElement("div")
                loadingAnimation.classList.add("loading-animation");
                uploadFile_MenuWindow.appendChild(loadingAnimation);
                handlers.pushValueToArrayInObject(galleryData_JSON["galleries"], "photos", document.querySelector("#hidden-input-file").files[0].name, el => {
                    return el["galleryName"] === selectedGallery;
                })
                // handlers.addNewValueToArray(galleryData[selectedGallery]["photos"], document.querySelector("#hidden-input-file").files[0].name)
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                handlers.sendFileToPHP(document.querySelector("#hidden-input-file").files[0], selectedGallery, "uploadFile.php")
                    .then(() => {
                        uploadFile_MenuWindow.removeChild(loadingAnimation);
                        document.querySelector("#upload-file-menu-window").style.display = "none";
                        document.querySelector("#main-window").classList.remove("blur");

                        let image = handlers.createImageDOMElement("photos", fileName, "photo-style");
                        let imageContainer = handlers.createDivDOMElement("", "image-container", fileName)
                        let shadowBox = handlers.createDivDOMElement("", "shadow-box", fileName);
                        let simbol = handlers.createInsideImageSimbol(fileName, "inside-image-simbol");
                        simbol.style.display = "none";

                        imageContainer.appendChild(image);
                        imageContainer.appendChild(handlers.createInsideImageButton(fileName, "inside-image-button"))
                        imageContainer.appendChild(shadowBox);
                        imageContainer.appendChild(simbol)

                        imageContainer.addEventListener("click", event => {
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

                        photos[selectedGallery].push(image);
                    })
            })


        })
}