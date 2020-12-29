<?php
    $galleryID = $_POST["galleryID"];
    $initGalleryValue = $_POST["initGalleryValue"];
    $initGalleryValueDecoded = json_decode($initGalleryValue, true);

    echo $initGalleryValue;     

    $jsonData = file_get_contents('data.json');
    $jsonDataDecoded = json_decode($jsonData, true);

    $jsonDataDecoded["{$galleryID}"] = $initGalleryValueDecoded;

    mkdir("{$galleryID}");

    $htmlTemplate = file_get_contents('singleGalleryTemplate.html');

    fopen("{$galleryID}.html",'w+');

    $jsonDataEncoded = json_encode($jsonDataDecoded);

    file_put_contents('data.json', $jsonDataEncoded);

    
?>