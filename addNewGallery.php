<?php
    $galleryID = $_POST["galleryID"];
    $initGalleryValue = $_POST["initGalleryValue"];
    $initGalleryValueDecoded = json_decode($initGalleryValue, true);

    $jsonData = file_get_contents('data.json');
    $jsonDataDecoded = json_decode($jsonData, true);

    $jsonDataDecoded["{$galleryID}"] = $initGalleryValueDecoded;

    mkdir("{$galleryID}");

    $jsonDataEncoded = json_encode($jsonDataDecoded);
    file_put_contents('data.json', $jsonDataEncoded);
?>