// First cut at monitoring a v4 or v6 address from a SPA
//

import {CheckAlive} from "./checkalive.js";

var HostToGet = "127.0.0.1";
var PortToGet = "80";
var p, hostList, headers;

// set up temporary re-probe button

headers = document.getElementsByTagName("header");
headers[0].onclick = () => CheckHosts();

export function logToWindow(text) {
  var textarea = document.getElementById("article");
  var curtext = textarea.value;
  var date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text + "\n");
  }

// We're starting up
logToWindow("Starting test...");

CheckHosts();         // kick off the test

// queue up a test of all hosts every now and again
setInterval (CheckHosts, 3*60*1000);

// find all the <host> elements on the page, iterate through them

function CheckHosts() {
  var hostList = document.getElementsByTagName("host");
  var i;
  for (i = 0; i < hostList.length; i++) {
    CheckHost(hostList[i]);
  }
}

// CheckHost - aHost is a DOM element; get its text, then set the background color

function CheckHost(aHost) {

  var hostName = aHost.innerHTML;

  CheckAlive(hostName + ":80")
    .then(
    (msg) => UpdateDevice(aHost, msg),
    (err) => UpdateDevice(aHost, err));
}

function UpdateDevice(aHost, text) {

  var color;
  if      (text == "OK   ") color = "green";
  else if (text == "Abort") color = "yellow";
  else if (text == "Down ") color = "red";
  else color = "purple";
  aHost.style.backgroundColor = color;
  logToWindow(text + aHost.innerHTML);
}