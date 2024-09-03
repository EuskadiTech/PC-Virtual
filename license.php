<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
$base = "/mnt/storage/Annapurna/License/" . $_GET["user"] . ".json";
if ($_GET["user"] == "") {
    return;
}

readfile($base);