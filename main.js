const galleryNameInput = document.querySelector("#gallery-name-input");
const addNewGalleryButton = document.querySelector("#add-gallery-button");

addNewGalleryButton.addEventListener("click", addNewGallery);

function addNewGallery() {
  const galleryID = galleryNameInput.value;
  let initGalleryValue = {
    "photos": []
  }
  initGalleryValue = JSON.stringify(initGalleryValue);

  let fd = new FormData();
  fd.append("initGalleryValue", initGalleryValue)
  fd.append("galleryID", galleryID)

  fetch("addNewGallery.php", {
    method: "POST",
    body: fd,
  })
  
  galleryNameInput.value = "";
}


