// First cut at monitoring a v4 or v6 address from a SPA
//

'use strict'; // shouldn't be necessary for ES6
//var logger = require('libraries/loglevel.js');
//var checker = require('libraries/checkforliveness.js');

var HostToGet = "127.0.0.1";
var PortToGet = "80";


logToWindow("\nStarting test...\n")
function logToWindow(text) {
  var textarea = document.getElementById("results");
  var curtext = textarea.value;
  var date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text);
  }

function redgreen(obj){
  var elem = documents.getElementById("statusarea");
  elem.value = obj.state;
}

mediator.subscribe("gstatic.com:80", redgreen);
mediator.subscribe("richb-hanover.com:80", redgreen);
mediator.subscribe("127.0.0.10:80", redgreen);