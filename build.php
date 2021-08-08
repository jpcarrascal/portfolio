<?php

$abspath = realpath('.');
$path = ".";

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


copy("source.php", "index.php");

$objects = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path), RecursiveIteratorIterator::SELF_FIRST);
foreach($objects as $name => $object){
    if( is_dir($name) && !endsWith($name, ".") && strpos($name, "/.") === false ) {
        echo "$name\n";
        //$basedir = substr( $name, 1 );
        copy("source.php", $name."/index.php");
        //chdir($name);

        /*
        ob_start();
        include_once('index.php');
        $html = ob_get_clean();
        if( file_exists("index.html") ) unlink("index.html");
        file_put_contents("index.html", $html);
        */

        //shell_exec("/usr/bin/php index.php ".$basedir."> index.html");
        //if( file_exists("index.php") ) unlink("index.php");
        //if( file_exists("index.html") ) unlink("index.html");
        //chdir($abspath);
    }
     
}

?>