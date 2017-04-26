// First cut at monitoring a v4 or v6 address from a SPA
//

import {CheckAlive} from "./checkalive.js";
import {LogToWindow} from "./utilities.js";

const HostToGet = "127.0.0.1";
const PortToGet = "80";
var p, hostList, headers;

// set up temporary re-probe button

headers = document.getElementsByTagName("header");
headers[0].onclick = () => CheckHosts();

// We're starting up
LogToWindow("Starting test...");

CheckHosts();         // kick off the test

// queue up a test of all hosts every now and again
setInterval (CheckHosts, 30*1000);    // every 30 sec

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

  let color;
  const curColor = aHost.style.backgroundColor;
  if      (text.indexOf("OK:") == 0)    color = "green";
  else if (text.indexOf("Abort:") == 0) color = "yellow";
  else if (text.indexOf("Down:") == 0) color = "red";
  else color = "purple";
  aHost.style.backgroundColor = color;
  if (color !== curColor) {
    LogToWindow(text + aHost.innerHTML);
  }
}
