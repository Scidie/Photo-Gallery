<?php
    $json = file_get_contents('php://input');
    $jsonDecoded = json_decode($json, true);


    $contents = file_get_contents('data.json');
    $contentsDecoded = json_decode($contents, true);

    $contentsDecoded['currentlyViewedGallery'] = $jsonDecoded;
    $contentsEncoded = json_encode($contentsDecoded);

    file_put_contents('data.json', $contentsEncoded);
?>