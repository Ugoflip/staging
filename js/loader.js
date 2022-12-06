function progress(){
    console.log('start progress bar')
    setInterval(function () {
        var $bar =  document.getElementById("bar");
    
        let newWidth=parseInt($bar.style.width.replace("%","").replace("px",""))
        if (newWidth >= 500) {
            clearInterval(progress);
        } else {
            $bar.style.width=(newWidth + 60)+'px';
        }
        $bar.innerHTML=(parseInt($bar.style.width.replace("%","").replace("px","")) / 6 + "%");
        if (parseInt($bar.style.width.replace("%","").replace("px","")) / 5 == 100){
          $bar.innerHTML=("Still working ... " + parseInt($bar.style.width.replace("%","").replace("px","")) / 5 + "%");
        }
    }, 800)
} 
