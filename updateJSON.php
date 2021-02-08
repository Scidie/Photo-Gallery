<?php
    $updatedJSON = $_POST["json"];
    $path = $_POST["path"];
    file_put_contents($path, $updatedJSON);
?>