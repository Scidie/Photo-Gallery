<?php
    $HTMLContent = $_POST["HTMLContent"];
    $galleryID = $_POST["galleryID"];

    $handle = fopen("{$galleryID}.html", "w+");
    fwrite($handle, $HTMLContent);
    fclose($handle);
?>