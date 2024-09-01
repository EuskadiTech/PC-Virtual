<?php
  $base = "/mnt/storage/Annapurna/L1/" . $_GET["user"] . "/";
  if ($_GET["cmd"] == "download") {
    readfile($base . $_GET["file"]);
  };
  if ($_GET["cmd"] == "upload") {
    $bufsz = 4096;
    
    $fi = fopen("php://input", "rb");
    $fo = fopen($base . $_GET["file"], "wb");
    
    while( $buf = fread($fi, $bufsz) ) {
      fwrite($fo, $buf);
    }
    
    fclose($fi);
    fclose($fo);
  }
  function dir_tree($dir_path) {
    $rdi = new \RecursiveDirectoryIterator($dir_path);
  
    $rii = new \RecursiveIteratorIterator($rdi);
  
    $tree = [];
  
    foreach ($rii as $splFileInfo) {
      $file_name = $splFileInfo->getFilename();
  
      // Skip hidden files and directories.
      if ($file_name[0] === '.') {
        continue;
      }
  
      $path = $splFileInfo->isDir() ? array($file_name => array($file_name)) : array($file_name);
  
      for ($depth = $rii->getDepth() - 1; $depth >= 0; $depth--) {
        $path = array($rii->getSubIterator($depth)->current()->getFilename() => $path);
      }
  
      $tree = array_merge_recursive($tree, $path);
    }
    return $tree;
  }
  if ($_GET["cmd"] == "list") {
    header('Content-Type: application/json');

    echo json_encode(dir_tree($base));
  }
?>