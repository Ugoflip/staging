let intervalId = setInterval(progress, 800);

function progress(){
  var $bar = document.getElementById("bar");
  var newWidth = parseInt($bar.style.width.replace("%","").replace("px",""));
  if (newWidth >= 500) {
    clearInterval(intervalId);
  } else {
    $bar.style.width = (newWidth + 60) + "px";
  }
  $bar.innerHTML = (parseInt($bar.style.width.replace("%","").replace("px","")) / 6) + "%";
  if (parseInt($bar.style.width.replace("%","").replace("px","")) / 5 == 100) {
    $bar.innerHTML = "Still working ... " + (parseInt($bar.style.width.replace("%","").replace("px","")) / 5) + "%";
  }
}
