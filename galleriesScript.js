let galleriesContainer = document.querySelector("#galleries-container");

fetch("data.json")
.then(response => response.json())
.then(json => {
    createListOfGalleries(json);
    addEventListnersToAllGalleries(json);
})
.catch(er => console.log("error: " + er))

function createListOfGalleries(json) {
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

function addEventListnersToAllGalleries(json) {
    let galleries = document.querySelectorAll(".gallery");
    galleries.forEach(gallery => {
        gallery.addEventListener("click", () => {
            fetch("setCurrentlyViewedGallery.php", {
                method: "POST",
                body: JSON.stringify(gallery.id)
            })
            .then(() => {
                fetch("data.json")
                .then(response => response.json())
                .then(() => {
                    document.location.href = "./singleGalleryTemplate.html"
                })
            })
        })
    })
}