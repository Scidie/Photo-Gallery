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

export function createGroupOfElements(array, className, type, directory) {
    let elements = [];
    array.forEach(element => {
        switch(type) {
            case "div":
                elements.push(createDivElement(element, className));
                break;
            case "img":
                elements.push(createImgElement(directory, element, className));
                break;
          }
    })
    return elements;
}

export function createDivElement(id, className) {
    let element = document.createElement("div");
    element.id = id;
    element.textContent = id;
    element.classList.add(className)
    return element;
}

export function createImgElement(directory, fileName, className) {
    let imageElement = document.createElement("img");
    imageElement.src = `./${directory}/${fileName}`;
    imageElement.classList.add(className);
    return imageElement;
}

export function appendEventsToElements(elements, action) {
    
}

export function appendTemplate(parent, template) {
    parent.style.display = "flex";
    parent.innerHTML += template;
}

export function addNewValueToArray(array, value) {
    array.push(value);
}

export async function uploadFile(inputFile, directoryName, object) {
    let src = `${directoryName}`;
    let fd = new FormData();
    fd.append("file", inputFile.files[0]);
    fd.append("src", src);
    fd.append("json", JSON.stringify(object))

    await fetch("upload.php", {
        method: "POST",
        body: fd,
    });
}

export function hideElement(element) {
    element.style.display = "none";
}

export function clearAndHideElement(element) {
    element.innerHTML = "";
    element.style.display = "none";
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
