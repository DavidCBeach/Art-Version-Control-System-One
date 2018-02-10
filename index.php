
<!DOCTYPE html>
<html>
    <head>
        <title> Space 1</title>
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    </head>
    <body>
         <h2 class="title"> Photo Gallery </h2>
    <form method="POST" enctype="multipart/form-data"> 


        <input type="file" name="myFile" /> 
        
        <input id ="submit"type="submit" value="Upload File!" />

    </form>
<?php

    if($_FILES["myFile"]['size'] > 1000000)
    {
        echo "FILE IS TOO LARGE";
    } else{
        move_uploaded_file($_FILES["myFile"]["tmp_name"], "gallery/" . $_FILES["myFile"]["name"] );
  
          $files = scandir("gallery/", 1);
        
          
         
    }
     for ($i = 0; $i < count($files) - 2; $i++) {
             echo "<a id='". $files[$i] ."'  width='50' class='pic' >" .   $files[$i] ."</a>";
        }
  
  
  

?>
<script>
        function expand(ims)
        {
            if($(ims).css('width')=='250px')
            {
                $(ims).css('width','50px');
                return;
            }
            $(ims).css('width','250px');
            
        }
            $("img").click(function(){
                console.log("wow");
                expand(this);
            });
        </script>
    </body>
</html>