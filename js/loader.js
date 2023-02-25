let intervalId = setInterval(progress, 800);

function progress(){
  var $bar = document.getElementById("bar");
  var newWidth = parseInt($bar.style.width.replace("%","").replace("px",""));
  if (newWidth >= 500) {
    clearInterval(intervalId);
  } else {
    $bar.style.width = (newWidth + 60) + "px";
  }
  $bar.innerHTML = Math.round(parseInt($bar.style.width.replace("%","").replace("px","")) / 5) + "%";
  if (Math.round(parseInt($bar.style.width.replace("%","").replace("px","")) / 5) >= 20) {
    $bar.innerHTML = "Still working ... " + Math.round(parseInt($bar.style.width.replace("%","").replace("px","")) / 5) + "%";
  }
}
