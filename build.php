<?php

$path = realpath('.');

// These 2 functions from: https://stackoverflow.com/questions/834303/startswith-and-endswith-functions-in-php
function startsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    return substr( $haystack, 0, $length ) === $needle;
}

function endsWith( $haystack, $needle ) {
    $length = strlen( $needle );
    if( !$length ) {
        return true;
    }
    return substr( $haystack, -$length ) === $needle;
}



$objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::SELF_FIRST);
foreach($objects as $name => $object){
    if( is_dir($name) && !endsWith($name, ".") && strpos($name, "/.") === false ) {
        echo "$name\n";
        copy("index.php", $name."/index.php");
    }
     
}

?>