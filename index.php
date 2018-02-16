
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
<?php
    $files = scandir("gallery/");
    if($_FILES["myFile"]['size'] > 1000000)
    {
        echo "FILE IS TOO LARGE";
    } else{
        $flag = true;
        for ($i = count($files); $i > 1; $i--) 
        {
            print($files[$i]);
            if(substr($files[$i],strpos($files[$i],']')+1)==$_FILES["myFile"]["name"])
            {
                print_r(substr($files[$i],1,strpos($files[$i],']')-1));
                $flag = false;
                $inter = (int)substr($files[$i],1,strpos($files[$i],']')-1);
                move_uploaded_file($_FILES["myFile"]["tmp_name"], "gallery/[".($inter+1)."]" . $_FILES["myFile"]["name"] );
                break;
            }
        }
        if($flag)
        {
            move_uploaded_file($_FILES["myFile"]["tmp_name"], "gallery/[0]" . $_FILES["myFile"]["name"] );
        }
        
  
        $files = scandir("gallery/", 1);
        
          
         
    }
     for ($i = 0; $i < count($files) - 2; $i++) 
     {
             echo "<p id='". $files[$i] ."'  width='50' class='pic' >" .   $files[$i] ."</p>";
        }
  
  
  

?>

    </body>
</html>