"use strict";

function copyLink() {
  var copyText = document.getElementById("ref_field");

  copyText.select();
  copyText.setSelectionRange(0, 99999); /* For mobile devices */

  navigator.clipboard.writeText(copyText.value);
  document.getElementById("link_button").innerHTML = "Copied!"
  document.getElementById("link_button").style.backgroundImage = ""
}

window.addEventListener('load', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  var uid = urlParams.get('uid');
  var ref = "bitprofile.io?r=" + uid
  document.getElementById("ref_field").value = ref
  document.querySelector("#link_button").addEventListener("click", copyLink);
});











