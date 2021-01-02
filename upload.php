<?php

$targetPath = "{$_POST['src']}/" . basename($_FILES['file']['name']);

move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath);

$jsonData= file_get_contents("data.json");
$jsonDataDecoded = json_decode($jsonData, true);

array_push($jsonDataDecoded["{$_POST['src']}"]["photos"], basename($_FILES['file']['name']));

$jsonDataEncoded = json_encode($jsonDataDecoded);
file_put_contents("data.json", $jsonDataEncoded);

?>

