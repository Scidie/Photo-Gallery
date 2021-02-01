export async function updateJSON(path) {
    const response = await fetch(path);
    const json = await response.json();
    return json;
}

export function appendDOMElements(elements, parent) {
    elements.forEach(element => {
        parent.appendChild(element);
    })
}

export function createDOMCheckbox(accessKey, className) {
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

export function createDivDOMElement(value, className, accessKey) {
    let div = document.createElement("div");
    div.textContent = value;
    div.className = className;
    if (accessKey !== undefined) {
        div.accessKey = accessKey;
    } else {
        div.accessKey = value;
    }
    return div;
}

export function createImageDOMElement(directory, fileName, className) {
    let image = document.createElement("img");
    image.src = `./${directory}/${fileName}`;
    image.classList.add(className)
    image.accessKey = `${fileName}`;
    return image;
}

export function createArrayOfDOMDivs(array, className) {
    let divs = [];
    array.forEach(value => {
         divs.push(createDivDOMElement(value, className))
    })
    return divs;
}

export function createArrayOfDOMImages(directory, array, className) {
    let images = [];
    array.forEach(value => {
        images.push(createImageDOMElement(directory, value, className))
    })
    return images;
}

export function appendHTMLValue(parent, value) {
    parent.innerHTML += value;
}

export function addNewValueToArray(array, value) {
    array.push(value);
}

export function hideDOMElement(element) {
    element.style.display = "none";
}

export function revealDOMElement(element, cssDisplayValue) {
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

//DOM manipulation functions
export function removeDOMElementFromArrayByAttribute(value, attribute, DOMArray) {
    DOMArray.forEach(element => {
        if (element.getAttribute(attribute) === value) {
            DOMArray.splice(DOMArray.indexOf(element), 1)
        }
    })
}

export function removeDOMElementsFromArrayByAttribute(values, attribute, DOMArray) {
    values.forEach(value => {
        removeDOMElementFromArrayByAttribute(value, attribute, DOMArray)
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


export function moveValuesFromArrayToArray(elementsToMove, originalArray, destinationArray) {
    removeElementsFromArray(elementsToMove, originalArray);
    elementsToMove.forEach(element => {
        destinationArray.push(element);
    })
}

export function filterDOMElements(arrayOfDOMElements, callback) {
    let filteredArray = []
    arrayOfDOMElements.forEach(element => {
        if (callback(element) === true) {
            filteredArray.push(element)
        }
    })
    return filteredArray;
}

export function filterDOMElementsAttributes(arrayOfDOMElements, attributeName, callback) {
    let filteredAttributesArray = []
    arrayOfDOMElements.forEach(element => {
        if (callback(element) === true) {
            filteredAttributesArray.push(element.getAttribute(attributeName))
        }
    })

    return filteredAttributesArray;
}

export function getAttributesFromDOMElements(arrayOfDOMElements, attributeName) {
    let filteredArray = []
    arrayOfDOMElements.forEach(element => {
        filteredArray.push(element.getAttribute(attributeName))
    })
    return filteredArray;
}
    
//returns new array without one indicated value
export function arrayRemove(array, value) {
    let newArray = array.filter(element => element != value);
    return newArray;
}