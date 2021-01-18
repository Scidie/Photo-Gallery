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


export function createGroupOfElements(object, className, type, directory) {
    let elements = [];
    let array = Object.keys(object);
    array.forEach(element => {
        switch(type) {
            case "div":
                elements.push(createDivElement(className, element));
                break;
            case "img":
                elements.push(createImgElement(directory, element, className));
                break;
          }
    })
    return elements;
}

export function createDivElement(className, textContent) {
    let div = document.createElement("div");
    div.textContent = textContent;
    div.classList.add(className)
    return div;
}

export function createImgElement(directory, fileName, className) {
    let imageElement = document.createElement("img");
    imageElement.src = `./${directory}/${fileName}`;
    imageElement.classList.add(className);
    return imageElement;
}


export function appendTemplate(parent, template) {
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



    // export function generateID(array) {
    //     if(array.length === 0) {
    //         return 0;
    //     } else {
    //         if(Math.max(...array) > array.length - 1) {
    //             for(let i = 0; i < array.length; i++) {
    //                 if (array.includes(i) === false) {
    //                     return i;
    //                 }
    //             }
    //         } else {
    //             return Math.max(...array) + 1;
    //         }
    //     }
    // }
