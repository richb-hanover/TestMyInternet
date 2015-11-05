// First cut at monitoring a v4 or v6 address from a SPA
//


import {CheckAlive} from "./checkalive.js";

var HostToGet = "127.0.0.1";
var PortToGet = "80";
var p;


export function logToWindow(text) {
  var textarea = document.getElementById("article");
  var curtext = textarea.value;
  var date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text + "\n");
  }

function redgreen(obj){
  var elem = documents.getElementById("statusarea");
  elem.value = obj.state;
}

logToWindow("Starting test...");

p = CheckAlive("gstatic.com:80")
  .then(
  (msg) => logToWindow(msg),
  (err) => logToWindow(err));

