export async function updateJSON(path) {
    const response = await fetch(path);
    const json = await response.json();
    return json;
}

export function appendElements(elements, parent) {
    elements.forEach(element => {
        parent.appendChild(element);
    })
}

export function createCheckbox(accessKey, className) {
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.accessKey = accessKey;
    checkbox.classList.add(className);
    return checkbox;
}

export function createInsideImageButton(accessKey, className) {
    let button = document.createElement("button");
    button.classList.add(className);
    button.accessKey = accessKey;
    return button;
}

export function createDivElement(value, className) {
    let div = document.createElement("div");
    div.accessKey = value;
    div.textContent = value;
    div.className = className;  
    return div;
}

export function createImageElement(fileName, directory, className) {
    let image = document.createElement("img");
    image.src = `./${directory}/${fileName}`;
    image.classList.add(className)
    image.accessKey = `${fileName}`;
    return image;
}

export function createArrayOfDivs(array, className) {
    let divs = [];
    array.forEach(value => {
         divs.push(createDivElement(value, className))
    })
    return divs;
}

export function createArrayOfImages(directory, array, className) {
    let images = [];
    array.forEach(value => {
        images.push(createImageElement(value, directory, className))
    })
    return images;
}

export function appendTemplate(parent, template) {
    parent.innerHTML += template;
}

export function addNewValueToArray(array, value) {
    array.push(value);
}

export function hideElement(element) {
    element.style.display = "none";
}

export function revealElement(element, cssDisplayValue) {
    element.style.display = cssDisplayValue;
}

export function addNewPropertyToObjectFromInput(input, object, value) {
    object[input] = value;
}

export function sendDataToPHP(label, data, PHPScript) {
    let fd = new FormData();
    switch(typeof data) {
        case "object":
            fd.append(label, JSON.stringify(data))
            return fetch(PHPScript, {
            method: "POST",
            body: fd,
        })
        case "string":
            fd.append(label, data)
            return fetch(PHPScript, {
            method: "POST",
            body: fd,
        })
    }
}

export function sendFileToPHP(inputFile, directoryName, PHPScript) {
    let fd = new FormData();
        fd.append("file", inputFile)
        fd.append("directoryName", directoryName)
        return fetch(PHPScript, {
        method: "POST",
        body: fd,
    })
}

export function removeElementsFromArray(elementsToRemove, array) {
    elementsToRemove.forEach(value => {
        let indexOfValue = array.indexOf(value)
        array.splice(indexOfValue, 1)
    })
}

export function moveElements(elementsToMove, originalArray, destinationArray) {
    removeElementsFromArray(elementsToMove, originalArray);
    elementsToMove.forEach(element => {
        destinationArray.push(element);
    })
}
