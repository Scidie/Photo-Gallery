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
    editDescription_MenuWindow = document.querySelector("#edit-description-menu-window"),
    editDescription_InnerContainer = document.querySelector("#edit-description-inner-container"),
    editDescriptionTitle = document.querySelector("#edit-description-title"),
    editDescription_InputArea = document.querySelector("#edit-description-input-area"),
    saveDescription_Button = document.querySelector("#save-description-button"),
    selectedPhoto = "",
    savedSlot = "";

export function initControlPanel() {
    handlers.getJSONFromServer("galleryData.json")
        .then(response => {
            galleryData_JSON = response;
            let galleryNames = [];

            galleryData_JSON["galleries"].forEach(value => {
                galleryNames.push(value["galleryName"]);
            })

            // preload all images to an object
            let photos = {};
            galleryData_JSON["galleries"].forEach(value => {
                photos[value["galleryName"]] = handlers.createArrayOfDOMImages("photos", value["photos"], "photo-style");
            })

            //create DOM elements based on each gallery name in json
            let galleryDOMElements = handlers.createArrayOfDOMDivs(galleryNames, "gallery");

            // append event listner to "add-gallery" button, which updates json by new gallery value from input and sends data to server.
            addGallery_Button.addEventListener("click", () => {
                galleryData_JSON["galleries"].push({ "photos": [], "description": "", "galleryName": galleryName_Input.value });
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        location.reload();
                    })
            })

            showAddGalleryMenu_Button.addEventListener("click", () => {
                document.querySelector("#add-gallery-menu-window").style.display = "flex";
            })

            showPhotosOrderMenu_Button.addEventListener("click", () => {
                photosToChooseFromContainer.innerHTML = "";
                emptySlotsContainer.innerHTML = "";

                // find the right array of photos names
                let photosToChooseFrom_Names = handlers.getPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", value => {
                    return value["galleryName"] === selectedGallery;
                })

                //copy images based on array variable
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
                        let allSlotsTaken = "";
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

                        let slots = emptySlotsContainer.querySelectorAll(".empty-slot");
                        for (let i = 0; i < slots.length; i++) {
                            allSlotsTaken = true;
                            if (slots[i].firstElementChild === null) {
                                allSlotsTaken = false;
                                break;
                            }
                        }

                        if (allSlotsTaken === true) {
                            let insideButton = handlers.createDivDOMElement("zapisz", "blue-button", "")
                            insideButton.addEventListener("click", () => {
                                let photosNames = handlers.getPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", element => {
                                    return element["galleryName"] === selectedGallery;
                                })

                                photosNames.length = 0;

                                slots.forEach(slot => {
                                    photosNames.push(slot.firstElementChild.accessKey);
                                })

                                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                                    .then(() => {
                                        photosContainer.innerHTML = "";
                                        photos[selectedGallery] = handlers.createArrayOfDOMImages("photos", photosNames, "photo-style")

                                        photos[selectedGallery].forEach(photo => {
                                            let imageContainer = handlers.createDivDOMElement("", "image-container", photo.accessKey)
                                            let shadowBox = handlers.createDivDOMElement("", "shadow-box", photo.accessKey);
                                            let simbol = handlers.createDivDOMElement("", "inside-image-simbol", photo.accessKey)

                                            imageContainer.appendChild(photo);
                                            imageContainer.appendChild(handlers.createInsideImageButton(photo.accessKey, "inside-image-button"))
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
                                            photosOrder_MenuWindow.style.display = "none";
                                        })
                                    })
                            })
                            photosToChooseFromContainer.appendChild(insideButton)
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
            })

            changeGalleryName_Button.addEventListener("click", () => {
                for (let i = 0; i < galleryData_JSON["photoDescriptions"].length; i++) {
                    if (galleryData_JSON["photoDescriptions"][i]["galleryName"] === selectedGallery) {
                        galleryData_JSON["photoDescriptions"][i]["galleryName"] = changeGalleryName_Input.value;
                    }
                }

                handlers.findAndEditArrayProperty(galleryData_JSON["galleries"], "galleryName", changeGalleryName_Input.value, el => {
                    return el["galleryName"] === selectedGallery;
                })
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        location.reload();
                    })
            })

            // add event listneres to each gallery element, which is clearing "edit view" section and then adding clicked gallery photos from object with preloader earlier images
            galleryDOMElements.forEach(element => {
                element.addEventListener("click", () => {
                    galleryDOMElements.forEach(element => {
                        element.classList.remove("gallery-selected");
                    })
                    element.classList.add("gallery-selected")
                    photosContainer.innerHTML = "";

                    selectedGallery = element.textContent;

                    photos[selectedGallery].forEach(photo => {
                        let imageContainer = handlers.createDivDOMElement("", "image-container", photo.accessKey);
                        let shadowBox = handlers.createDivDOMElement("", "shadow-box", photo.accessKey);
                        let simbol = handlers.createDivDOMElement("", "inside-image-simbol", photo.accessKey)
                        let insideImageButton = handlers.createInsideImageButton(photo.accessKey, "inside-image-button")

                        insideImageButton.addEventListener("click", event => {
                            selectedPhoto = photo.accessKey;
                            editDescription_MenuWindow.style.display = "flex";
                            editDescriptionTitle.textContent = selectedGallery;
                            let photoDescriptionObject = handlers.getObjectFromArrayByItsProperty(galleryData_JSON["photoDescriptions"], value => {
                                return value["photoName"] === photo.accessKey && value["galleryName"] === selectedGallery;
                            })

                            if (photoDescriptionObject !== undefined) {
                                editDescription_InputArea.value = photoDescriptionObject["photoDescription"]
                            } else {
                                console.log("Object doesn't exist")
                            }
                        })

                        imageContainer.appendChild(photo);
                        imageContainer.appendChild(insideImageButton)
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

            saveDescription_Button.addEventListener("click", () => {
                let gallery = handlers.getObjectFromArrayByItsProperty(galleryData_JSON["photoDescriptions"], value => {
                    return value["photoName"] === selectedPhoto && value["galleryName"] === selectedGallery;
                })

                gallery["photoDescription"] = editDescription_InputArea.value;
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                    .then(() => {
                        location.reload();
                    })
            })

            deletePhoto_Button.addEventListener("click", () => {
                let markedPhotos = handlers.filterDOMElements(photosContainer.querySelectorAll(".inside-image-simbol"), el => {
                    return el.style.display === "flex";
                })

                let accessKeys = handlers.getAttributesFromDOMElements(markedPhotos, "accessKey");

                let photosArray = handlers.getPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                    return el["galleryName"] === selectedGallery;
                })

                accessKeys.forEach(key => {
                    let photoDescriptionObject = handlers.getObjectFromArrayByItsProperty(galleryData_JSON["photoDescriptions"], element => {
                        return element["photoName"] === key && element["galleryName"] === selectedGallery;
                    })
                    console.log("index", galleryData_JSON["photoDescriptions"].indexOf(photoDescriptionObject))
                    galleryData_JSON["photoDescriptions"].splice(galleryData_JSON["photoDescriptions"].indexOf(photoDescriptionObject), 1)
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
                    let photosArray = handlers.getPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                        return el["galleryName"] === selectedGallery;
                    })
                    let newLocation = handlers.getPropertyFromObjectInArray(galleryData_JSON["galleries"], "photos", el => {
                        return el["galleryName"] === value;
                    })

                    chooseGallery_MenuWindow.appendChild(gallery)
                    gallery.addEventListener("click", () => {
                        accessKeys.forEach(key => {
                            let photoDescriptionObject = handlers.getObjectFromArrayByItsProperty(galleryData_JSON["photoDescriptions"], element => {
                                console.log("____________________")
                                console.log(element["photoName"], "=", key + "?")
                                console.log(element["galleryName"], "=", selectedGallery + "?")
                                console.log("____________________")
                                return element["photoName"] === key && element["galleryName"] === selectedGallery;
                            })

                            photoDescriptionObject["galleryName"] = gallery.innerText;
                        })


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

            // append gallery list elements to galleries panel.
            handlers.appendDOMElements(galleryDOMElements, galleryList_Panel);

            addPhoto_Button.addEventListener("click", () => {
                document.querySelector("#upload-file-menu-window").style.display = "flex";
            })

            // upload images and json properties to server, updating DOM dynamically.
            document.querySelector("#upload-file-button").addEventListener("click", () => {
                let fileName = document.querySelector("#hidden-input-file").files[0].name;
                let loadingAnimation = document.createElement("div")
                loadingAnimation.classList.add("loading-animation");
                uploadFile_MenuWindow.appendChild(loadingAnimation);
                handlers.pushValueToArrayInObject(galleryData_JSON["galleries"], "photos", document.querySelector("#hidden-input-file").files[0].name, el => {
                    return el["galleryName"] === selectedGallery;
                })
                galleryData_JSON["photoDescriptions"].push({"photoName": fileName, "galleryName": selectedGallery, "photoDescription": ""})
                handlers.sendJSONToServer(galleryData_JSON, "galleryData.json", "updateJSON.php")
                handlers.sendFileToPHP(document.querySelector("#hidden-input-file").files[0], selectedGallery, "uploadFile.php")
                    .then(() => {
                        uploadFile_MenuWindow.removeChild(loadingAnimation);
                        document.querySelector("#upload-file-menu-window").style.display = "none";

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