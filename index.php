
<!DOCTYPE html>
<html>
    <head>
        <title> Space 1</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body>
         <h2 class="title"> AVCS </h2>
    <form method="POST" enctype="multipart/form-data"> 


        <input type="file" name="myFile" /> 
        
        <input id ="submit"type="submit" value="Upload File!" />

    </form>
    
    <ul>
        <?=displayFiles()?>
    </ul>
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
    //just prints out all files in gallery
    
    //plans: only show most recent version of file as link to gallery showing all versions with ability to download
  function displayFiles(){

      $files = scandir("gallery/", 1);
      //print_r($files);
      $arr = array();
      for ($i = 0; $i < count($files) - 2; $i++) 
        {
            $new = true;
            for($ii = 0; $ii < count($arr);$ii++)
            {
                if(substr($files[$i],strpos($files[$i],']')+1)==$arr[$ii])
                {
                    $new = false;
                }
            }
            if($new)
            {
                echo "<li id='". $files[$i] ."'   width='50' class='pic' ><a href='expand.php/".substr($files[$i],strpos($files[$i],']')+1)."'>" .   substr($files[$i],strpos($files[$i],']')+1) ."</li>";
                $arr[] = substr($files[$i],strpos($files[$i],']')+1);
            }
            
        }
  }
  

?>

    </body>
</html>