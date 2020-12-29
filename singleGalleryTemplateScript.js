let addFilesButton = document.querySelector("#add-button");
let mainContainer = document.querySelector("#main-container");
let photosContainer = document.querySelector("#photos-container");
let isWindowClosed = true;
let galleryID = "";
let photosArray = "";
let url = "data.json";

fetch(url)
.then(response => response.json())
.then(json => {
    galleryID = json["currentlyViewedGallery"];
    photosArray = json[galleryID]["photos"];
    addElementsToList(photosArray, galleryID, photosContainer);
    addFilesButton.addEventListener("click", () => {
        if (isWindowClosed) {
            appendUploadSection();
            isWindowClosed = !isWindowClosed;
        }
    });
});

function uploadData(url) {
    return fetch(url)
    .then(response => response.json())
    .then(json => {
        galleryID = json["currentlyViewedGallery"];
        photosArray = json[`${json["currentlyViewedGallery"]}`]["photos"];
    })
}

function appendUploadSection() {
    let newWindow = document.createElement("div");
    let closeWindowButton = document.createElement("button");
    let uploadFileButton = document.createElement("button");
    let inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.id = "input-file";
    uploadFileButton.textContent = "upload";
    closeWindowButton.textContent = "close window";
    newWindow.classList.add("new-window");
    closeWindowButton.addEventListener("click", () => {
        removeChild(mainContainer, 5)
    })
    newWindow.appendChild(inputFile);
    newWindow.appendChild(uploadFileButton)
    newWindow.appendChild(closeWindowButton);
    mainContainer.appendChild(newWindow);
    uploadFileButton.addEventListener("click", () => {
        uploadFile(inputFile);
    });
}

function uploadFile(inputFile) {
    let src = `${galleryID}/`;
    let fd = new FormData();
    fd.append("file", inputFile.files[0]);
    fd.append("src", src);
     
    fetch("upload.php", {
        method: "POST",
        body: fd,
    })
    .then(() => {
        uploadData(url)
        .then(() => {
            createGalleryPage(photosArray)
        })
    })
}

function createGalleryPage(photosArray) {
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

function addElementsToList(photosArray, galleryID, container) {
    photosArray.forEach(name => {
        let photoElement = document.createElement("img");
        photoElement.classList.add("photo");
        photoElement.src = `./${galleryID}/${name}`;
        container.appendChild(photoElement);
    });
}

function removeChild(container, childIndex) {
    container.removeChild(container.childNodes[childIndex])
    isWindowClosed = !isWindowClosed;
}