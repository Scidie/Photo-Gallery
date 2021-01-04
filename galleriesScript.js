import * as handlers from "./controlPanelFunctions.js"

let galleriesContainer = document.querySelector("#galleries-container")

fetch("data.json")
.then(response => response.json())
.then(json => {
    handlers.createListOfGalleries(json, galleriesContainer);
    handlers.appendEventListenersToGalleries(json)
})
