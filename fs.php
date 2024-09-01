<?php
  $base = "/mnt/storage/Annapurna/L1/" . $_GET["user"] . "/";
  if ($_GET["cmd"] = "download") {
    readfile($base . $_GET["file"]);
  };
  if ($_GET["cmd"] = "upload") {
    $bufsz = 4096;
    
    $fi = fopen("php://input", "rb");
    $fo = fopen($base . $_GET["file"], "wb");
    
    while( $buf = fread($fi, $bufsz) ) {
      fwrite($fo, $buf);
    }
    
    fclose($fi);
    fclose($fo);
  }
?>