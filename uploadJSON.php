<?php
    $initGalleryValue = $_POST["json"];
    $initGalleryValueDecoded = json_decode($initGalleryValue, true);

    $jsonData = file_get_contents('data.json');
    $jsonDataDecoded = json_decode($jsonData, true);

    $jsonDataDecoded = $initGalleryValueDecoded;

    $jsonDataEncoded = json_encode($jsonDataDecoded);
    file_put_contents('data.json', $jsonDataEncoded);
?>