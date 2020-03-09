	 var x= document.getElementById("samah");
	  x.onclick=function(){
              if((x.checked)){
               	document.getElementById('ss').setAttribute("d","M 150 200 Q 225 100 300 200");
		document.getElementById('sam').innerHTML="sad";}
              else{
              document.getElementById('ss').setAttribute("d","M 150 200 Q 225 300 300 200");
	      document.getElementById('sam').innerHTML="Happy";}
            }