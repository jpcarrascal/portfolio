<?php

ob_start();
include_once('index.php');
$html = ob_get_clean();

echo $html;

?>