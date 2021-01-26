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

export function createImageElement(directory, fileName, className) {
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
        images.push(createImageElement(directory, value, className))
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
export function removeArrayElementByAttribute(value, attribute, DOMArray) {
    DOMArray.forEach(element => {
        if (element.getAttribute(attribute) === value) {
            DOMArray.splice(DOMArray.indexOf(element), 1)
        }
    })
}

export function removeArrayElementsByAttribute(values, attribute, DOMArray) {
    values.forEach(value => {
        removeArrayElementByAttribute(value, attribute, DOMArray)
    })
}

export function removeDOMElementByAttribute(value, attribute, DOMArray) {
    DOMArray.forEach(element => {
        if (element.getAttribute(attribute) === value) {
            element.remove()
        }
    })
}

export function removeDOMElementsByAttribute(values, attribute, DOMArray) {
    values.forEach(value => {
        removeDOMElementByAttribute(value, attribute, DOMArray)
    })
}


export function moveElements(elementsToMove, originalArray, destinationArray) {
    removeElementsFromArray(elementsToMove, originalArray);
    elementsToMove.forEach(element => {
        destinationArray.push(element);
    })
}

export function filterELements(arrayOfDOMElements, callback) {
    let filteredArray = []
    arrayOfDOMElements.forEach(element => {
        if (callback(element) === true) {
            filteredArray.push(element)
        }
    })
    return filteredArray;
}

export function filterAttributesFromElements(arrayOfDOMElements, attributeName, callback) {
    let filteredArray = []
    arrayOfDOMElements.forEach(element => {
        if (callback(element) === true) {
            filteredArray.push(element.getAttribute(attributeName))
        }
    })

    return filteredArray;
}

export function getAttributesFromElements(arrayOfDOMElements, attributeName) {
    let filteredArray = []
    arrayOfDOMElements.forEach(element => {
        filteredArray.push(element.getAttribute(attributeName))
    })
    return filteredArray;
}

export function arrayRemove(array, value) {
    let newArray = array.filter(element => element != value);
    return newArray;
}