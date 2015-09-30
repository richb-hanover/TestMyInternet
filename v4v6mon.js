// First cut at monitoring a v4 or v6 address from a SPA
//

'use strict'; // shouldn't be necessary for ES6
//var logger = require('libraries/loglevel.js');
//var checker = require('libraries/checkforliveness.js');

var HostToGet = "127.0.0.1";
var PortToGet = "80";

// var p = get("https://gfblip.appspot.com/mindelay?callback=?");
// var p = get(HostToGet);

// setInterval(CheckAllForLiveness, 10000 );

//function CheckAllForLiveness() {
//  var host = document.querySelector('input[name="adrs"]:checked').value;
//  CheckForLiveness(host, PortToGet);
//}

logToWindow("\nStarting test...\n")
function logToWindow(text) {
  var textarea = document.getElementById("results");
  var curtext = textarea.value;
  var date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text);
  }