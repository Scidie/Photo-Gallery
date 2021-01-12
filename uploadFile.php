<?php
    $targetPath = "{$_POST['directoryName']}/" . basename($_FILES['file']['name']);
    move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath);
?>

