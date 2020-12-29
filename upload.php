<?php

$targetPath = "{$_POST['src']}" . basename($_FILES['file']['name']);

move_uploaded_file($_FILES["file"]["tmp_name"], $targetPath);

$jsonData= file_get_contents("data.json");
$jsonDataDecoded = json_decode($jsonData, true);

$currentViewedGallery = $jsonDataDecoded["currentlyViewedGallery"];

// $jsonDataDecoded["galleries"][0]["title"] = "test";

// echo $jsonDataDecoded["galleries"][0]["title"];

array_push($jsonDataDecoded[$currentViewedGallery]["photos"], basename($_FILES['file']['name']));

// TO DO: how to get access to value of object inside array inside object? :(

// array_push($jsonDataDecoded["galleries"], $someObject);
$jsonDataEncoded = json_encode($jsonDataDecoded);
file_put_contents("data.json", $jsonDataEncoded);

?>

