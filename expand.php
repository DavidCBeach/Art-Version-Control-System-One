<?php
    function getFiles()
    {
         $file = $_GET['file'];
        $files = scandir("gallery/", 1);
        for ($i = 0; $i < count($files) - 2; $i++) 
        {
            //print_r($file);
            if(substr($files[$i],strpos($files[$i],']')+1)==$file)
            {
                echo "<img class = 'historyimg' id='". $files[$i] ."' src='gallery/". $files[$i] ."'>";
            }
        }
    }
   
    

?>

<html>
    <head>
        <style>
            @import url("css/styles.css");
        </style>
    </head>
    <body>
        <ul>
            <?=getFiles()?>
        </ul>
    </body>
</html>