export function createListOfGalleries(json, galleriesContainer) {
    const keys = Object.keys(json);
    for (let i = 0; i < keys.length; i++) {
        if (i !== 0) {
            let gallery = document.createElement("div");
            gallery.classList.add("gallery");
            gallery.textContent = `${keys[i]}`;
            gallery.id = `${keys[i]}`;
            galleriesContainer.appendChild(gallery)
        }  
    }
}

export function appendEditPhotosWindowEventToElements(json) {
    let galleries = document.querySelectorAll(".gallery")
    galleries.forEach(gallery => {
        gallery.addEventListener("click", () => {
            createEditPhotosWindowElement(gallery.id, json)
        })
    })
}

export function createEditPhotosWindowElement(galleryID, json) {
    console.log(galleryID)
    let window = document.createElement("div");
    window.classList.add("edit-photos-window");

    let topSection = document.createElement("div");
    topSection.classList.add("top-section");

    let inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.id = "input-file";

    let uploadPhotoButton = document.createElement("button");
    uploadPhotoButton.textContent = "upload";
    uploadPhotoButton.addEventListener("click", () => {
        let inputFile = document.querySelector("#input-file")
        uploadFile(inputFile, galleryID);
    });

    let closeWindowButton = document.createElement("button")
    closeWindowButton.classList.add("close-window-button");
    closeWindowButton.textContent = "close window";
    closeWindowButton.textContent = "close window";
    closeWindowButton.addEventListener("click", () => {
        let parent = document.querySelector("#global-container")
        let child = document.querySelector(".edit-photos-window")
        parent.removeChild(child)
    })

    let photosSection = document.createElement("div");
    photosSection.classList.add("photos-section");

   
    topSection.appendChild(inputFile)
    topSection.appendChild(uploadPhotoButton)
    topSection.appendChild(closeWindowButton)

    window.appendChild(topSection)
    window.appendChild(photosSection)

    document.querySelector("#global-container").appendChild(window);

    appendElementsToEditPhotosWindow(json, galleryID, photosSection);
}

export function appendElementsToEditPhotosWindow(json, galleryID, photosContainer) {
    let photos = json[galleryID]["photos"];
    console.log("I got here!")
    photos.forEach(photo => {
        let photoElement = document.createElement("img")
        photoElement.id = photo;
        photoElement.src = `./${galleryID}/${photo}`
        photosContainer.appendChild(photoElement);
    })
}

export function uploadFile(inputFile, galleryID) {
    console.log("this: " + galleryID)
    let src = `${galleryID}`;
    let fd = new FormData();
    fd.append("file", inputFile.files[0]);
    fd.append("src", src);
     
    fetch("upload.php", {
        method: "POST",
        body: fd,
    })
    .then(() => {
        fetch("data.json")
        .then(response => response.json())
        .then(json => {
            let photosArray = json[galleryID]["photos"];
            console.log(photosArray);
            createGalleryPage(photosArray, galleryID)
        })
    })
}

export function createGalleryPage(photosArray, galleryID) {
    let markup = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="galleryTemplate.css">
    </head>
    <body>
    <div id="gallery-container">`;
    photosArray.forEach(photo => {
        markup += `<img src="./${galleryID}/${photo}" class="gallery-element"></img>`
    })

    markup += `</div>
    </body>
    </html>`

    let fd = new FormData();
    fd.append("HTMLContent", markup);
    fd.append("galleryID", galleryID);
    fetch("uploadHTML.php", {
        method: "POST",
        body: fd,
    })
    .then(() => {
        location.reload();
    })
}
