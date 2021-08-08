<?php

function sortByOrderDateFolder($x, $y) {
    if ( isset($x->order) && isset($y->order) )
        return ($x->order - $y->order);
    elseif ( isset($x->date) && isset($y->date) )
        return strcmp($y->date, $x->date);
    else
        return strcmp($x->project_folder, $y->project_folder);
}

function debug_this($p) {
    echo "<br /><br /><br /><br /><br /><br /><br /><br /><br />";
    echo "<pre>";
    echo $p;
    echo "</pre>";
}

if( isset($_SERVER["REQUEST_URI"]) && !isset($basedir) )
    $basedir = $_SERVER["REQUEST_URI"];
elseif( isset($argv[1]) )
    $basedir = $argv[1];
else
    $basedir = "";

if( isset($_SERVER["DOCUMENT_ROOT"]) && !isset($docroot) )
    $docroot = $_SERVER["DOCUMENT_ROOT"];
else
    $docroot = "";

$is_project = false;
$path_array = preg_split("/\//", $basedir);
$breadcrumbs = Array();
$path_len = count($path_array);

if( $path_len > 0 )
{
    $path_walk = "";
    for($i = 0; $i < $path_len; $i++)
    {
        if($path_array[$i] !== "")
        {
            $breadcrumb = Array();
            
    //        if( !is_file($path_walk."info.json") )
    //            die     ("No info file found!\n");
            $path_walk .= $path_array[$i]."/";
            $breadcrumb["url"] = "/".$path_walk;
            $json_path = $docroot.$breadcrumb["url"]."info.json";
            $tmp = json_decode(file_get_contents($json_path));
  
            $breadcrumb["title"] = $tmp->title;
            //$breadcrumb["title"] = $json_path;
            
            if($tmp->title != "Portfolio")
                $breadcrumbs[] = $breadcrumb;
        }
    }
}

$json_string = file_get_contents("./info.json");
$dir_info = json_decode($json_string);
if( count($dir_info->items) > 0 )
{
    $is_project = true;
    $items = $dir_info->items;
}
else
{
    if($basedir !== "/") $basedir .= "/";
    $files = preg_grep('/^([^.])/', scandir(__DIR__));
    $items = Array();
    foreach($files as $f)
    {
    //preg_match("/^[0-9,a-z,A-Z]+/", $f) !== 0 &&
        $file_path = __DIR__."/".$f;
        $json_file = $file_path."/info.json";
        if( is_dir($file_path) && $f !== "images" && file_exists($json_file))
        {          
            $item_info = json_decode( file_get_contents($json_file) );
            $item_info->project_folder = $f;
            $items[$f] = $item_info;
        }
    }
    usort($items, 'sortByOrderDateFolder');
}


$bg_colors = ["#4abdac", "#fc4a14", "#f7b733", "#dfdce3", "#aaaaaa"];

$bg_colors_trans = ["rgba(74,189,172,0.85)", "rgba(252,74,20,0.85)", "rgba(247,183,51,0.85)", "rgba(170,170,170,0.85)", "rgba(103,100,107,0.85)"];


// "rgba(223,220,227,0.8)"
//shuffle($bg_colors);
//shuffle($bg_colors_trans);
?>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>

<?php 
if ( isset($_SERVER["SERVER_NAME"]) && strpos($_SERVER["SERVER_NAME"], "localhost")  === false):
?>
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-15242862-1"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'UA-15242862-1');
</script>

<?php endif; ?>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width,user-scalable =no" />
<meta name="description" content="Porfolio—JP Carrascal.">
<meta name="apple-mobile-web-app-capable" content="yes" />

<!--
WEB:
- MobileHCI
- Spacebarman
- TuneMap
GRAPHIC:
- Unfulfilled
- Spacebarman
INTERACTION DESIGN:
- BlueMo
- BLESync
- Lockdown
- Haptic Cylinder
- ReFlex
- Multitouch mixer
- MixPerceptions
HCI/UX RESEARCH:
- Microsoft: .NET website
- HML: Flexible Emoticons
- HML: Haptic Cylinder
- Yahoo: Mobile Search
- Telefonica: Privacy
- Telefonica: Annotation
MUSIC+SOUND DESIGN:
- MixPerceptions
- Picu
- Dunas
- Los Ciclos
-->

<title>Portfolio—JP Carrascal</title>


<script src="/jquery-3.3.1.min.js"></script>
<link href="https://fonts.googleapis.com/css?family=Lato:700|Lato" rel="stylesheet">
<script src="/scripts.js" type="text/javascript"></script>
<link  href="/reset.css" type="text/css" rel="stylesheet"/>
<link  href="/style.css" type="text/css" rel="stylesheet"/>
</head>



<body>

<div id="veil">
    <div class="close">&times;</div>
<!--    <div class="nav prev">&#9667;</div> -->
    <div id="show">
        <img id="show-image" src="" />
    </div>

<!--    <div class="nav next"><div style="transform:rotate(180deg)">&#9667;</div></div> -->
</div>

    
<div class="header">
    <div class="title">
        <div class="letter-wrapper"><div class="title-letter">P</div></div>
        <div class="letter-wrapper"><div class="title-letter">O</div></div>
        <div class="letter-wrapper"><div class="title-letter">R</div></div>
        <div class="letter-wrapper"><div class="title-letter">T</div></div>
        <div class="letter-wrapper"><div class="title-letter">F</div></div>
        <div class="letter-wrapper"><div class="title-letter">O</div></div>
        <div class="letter-wrapper"><div class="title-letter">L</div></div>
        <div class="letter-wrapper"><div class="title-letter">I</div></div>
        <div class="letter-wrapper"><div class="title-letter">O</div></div>
    </div>
    <div class="project_title">
    <?php
    /*
        if( !isset($_GET["dir"]) )
            echo "";
        else
            echo $dir_info->title;
    */
    ?>
    </div>
</div>

<div class="container <?php echo ($is_project?"grid":"list"); ?>">
    <div class="content">
        <?php
            $i = count($breadcrumbs);
            if($is_project)
            {
                echo "<div class='item item-main project-description'>\n";
                    echo "<h3 class='item-title'>".$dir_info->title."</h3>\n";
                    echo "<p class='item-description'>".$dir_info->description."</p>\n";
                echo "</div>\n";
                foreach($items as $project)
                {
                    echo "<div class='item item-project'>\n";
                    if($project->img_small != "")
                    {
                        $img_src = $basedir.$project->project_folder."/".$project->img_small;
                        $img_loc = __DIR__.$project->project_folder."/".$project->img_small;
                        $big = $project->img_big;
                        $img_src_big = ( $big==""?$img_src:($basedir.$project->project_folder."/".$project->img_big) );
                        list($width, $height, $type, $attr) = getimagesize($img_loc);
                        echo "<img class='item-img-bg greyscale-ish' src='".$img_src."' />\n";
                    }
                    $has_ext_link = false;
                    if(isset($project->ext_link) && preg_match("/^((https?|ftp)\:\/\/)/",$project->ext_link))
                        $has_ext_link = true;
                    echo "<div class='".($has_ext_link?"":"view")."' img='".$img_src_big."' url='".$project->url."' >\n";
                    if($has_ext_link)
                        echo "<a href='".$project->ext_link."' target=_blank>";
                    echo "<div class='item-text darken'>\n";
                    echo "<div class='item-text-wrapper'>\n";
                    echo "<h3 class='item-title'>".$project->title."</h3>\n";
                    if( $project->date != "" )
                        $date_string = " (".$project->date.")";
                    else
                        $date_string = "";
                    echo "<p class='item-description'>".$project->description.$date_string."</p>\n";
                    echo "</div>\n";
                    echo "</div>\n";
                    if($has_ext_link)
                        echo "</a>";
                    echo "</div>";
                    echo "</div>\n";
                    $max = count($bg_colors_trans)-2;
                    if($i>$max)
                        $i = 0;
                    else
                        $i++;
                }
            }
            else
            {
                foreach($items as $project)
                {
                    echo "<div class='item item-main'>\n";// style='background-color:".$bg_colors[$i]."'>\n";
                    if($project->img_small != "")
                    {
                        $img_src = $basedir.$project->project_folder."/".$project->img_small;
                        $img_loc = __DIR__."/".$project->project_folder."/".$project->img_small;
                        list($width, $height, $type, $attr) = getimagesize($img_loc);
                        echo "<img class='item-img-bg greyscale fill-wide' src='".$img_src."' />\n";
                    }
                    if( preg_match("/^((https?|ftp)\:\/\/)/",$project->img_big) )
                        echo "<a href='".$project->img_big."' target=_blank>\n";
                    else
                        echo "<a href='".$basedir.$project->project_folder."'>\n";
                    echo "<div class='item-text' style='background-color:".$bg_colors_trans[$i]."'>\n";
                    echo "<div class='item-text-wrapper'>\n";
                    echo "<h3 class='item-title'>".$project->title."</h3>\n";
                    echo "<p class='item-description'>".$project->description."</p>\n";
                    echo "</div>\n";
                    echo "</div>\n";
                    echo "</a>";
                    echo "</div>\n";
                    $max = count($bg_colors_trans)-2;
                    if($i>$max)
                        $i = 0;
                    else
                        $i++;
                }            
            }

            echo "<div class='item item-main' style='height:1.5em'></div>";
        ?>
    </div>
</div>

<div class="footer">
<!--
    <div class="jp">
        <div class="letter-wrapper"><div class="title-letter-jp">J</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">P</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp"> </div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">C</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">A</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">R</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">R</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">A</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">S</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">C</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">A</div></div>
        <div class="letter-wrapper"><div class="title-letter-jp">L</div></div>
    </div>
    -->
    <div id="breadcrumbs">
    <?php
        $bc_len = count($breadcrumbs);
        if($bc_len > 0)
        {
            echo "<a href='./'>Portfolio</a>";
            for($i=0; $i < ($bc_len - 1); $i++)
            {
                echo "<span class='sep'>&#9667;</span>";
                echo "<a href='".$breadcrumbs[$i]["url"]."'>".$breadcrumbs[$i]["title"]."</a>";
            }
            echo "<span class='sep'>&#9667;</span>";
            echo "<a href='#'>".$breadcrumbs[$bc_len-1]["title"]."</a>";
        }
    ?>

    </div>
    <div id="credit">
    <span>
    Designed and coded by <a href="http://www.jpcarrascal.com">JP Carrascal</a>
    </span>
    </div>
</div>




</body>
</html>

<?php
echo "<br /><br /><br /><br /><br /><br /><br /><br /><br /><pre>";

//var_dump(preg_split("/portfolio/", __DIR__));

//var_dump($_SERVER);
?>