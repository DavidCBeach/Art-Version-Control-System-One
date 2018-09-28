<?php
$files = scandir("gallery/");
    if($_FILES["myFile"]['size'] > 1000000)
    {
        echo "FILE IS TOO LARGE";
    } else{
        //checks if older version of file
        $flag = true;

        for ($i = count($files); $i > 1; $i--)
        {
            //print($files[$i]);
            if(substr($files[$i],strpos($files[$i],']')+1)==$_FILES["myFile"]["name"])
            {
                //adds as new interation of file
                $flag = false;
                $inter = (int)substr($files[$i],1,strpos($files[$i],']')-1);
                move_uploaded_file($_FILES["myFile"]["tmp_name"], "gallery/[".($inter+1)."]" . $_FILES["myFile"]["name"] );
                break;
            }
        }
        //if new file adds as [0]fileName
        if($flag)
        {
            move_uploaded_file($_FILES["myFile"]["tmp_name"], "gallery/[0]" . $_FILES["myFile"]["name"] );
        }






    }
?>
