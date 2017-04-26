// First cut at monitoring websites from a web page application
//

import {LogToWindow} from "./utilities.js";

const CheckInterval = 30 * 1000; // msec
const requestTimeout = 3 * 1000; // msec

const headers = document.getElementsByTagName("header");
headers[0].onclick = () => {
  LogToWindow("Manual check...");
  CheckHosts();
};

// We're starting up
LogToWindow("Starting TestMyInter.net - Leave the window open");

CheckHosts();         // kick off the test

// queue up a test of all hosts every now and again
setInterval (CheckHosts, CheckInterval);    // every 30 sec

// find all the <host> elements on the page, iterate through them

function CheckHosts() {

  const spinner = document.getElementById("spinner");
  spinner.style.visibility = "visible";
  setTimeout(() => { spinner.style.visibility = "hidden"; }, requestTimeout);

  const hostList = document.getElementsByTagName("host");
  for (let i = 0; i < hostList.length; i++) {
    CheckHost(hostList[i]);
  }
}

// CheckHost - aHost is a DOM element; get its text, then set the background color

function CheckHost(aHost) {

  const hostName = aHost.innerHTML;

  CheckAlive(hostName + ":80")
    .then(
      (msg) => UpdateDevice(aHost, msg, "Success"),
      (err) => UpdateDevice(aHost, err, "Timeout"))
    .catch((err) => UpdateDevice(aHost, err, "Catch"));
}

function UpdateDevice(aHost, text, status) {

  let color;
  const curColor = aHost.style.backgroundColor;
  if      (text.indexOf("OK:") === 0)    color = "green";
  else if (text.indexOf("Abort:") === 0) color = "yellow";
  else if (text.indexOf("Down:") === 0)  color = "red";
  else color = "purple";
  aHost.style.backgroundColor = color;
  if (color !== curColor) {
    LogToWindow(text + aHost.innerHTML);
  }
  // console.log(`Request returned: ${status}`);
}

// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which also means it's up)
//

function CheckAlive(host_port) {

  return new Promise(function (resolve, reject) {
    const myurl = encodeURI('http://TestMyInter.net/');
    const url = "http://" + host_port + "/?page="+ myurl;

    const req = new XMLHttpRequest();
    req.addEventListener("load"   , () => { resolve('OK:    ') });    // Got some kind of response back
    req.addEventListener("error"  , () => { resolve('OK:    ') });    // CORS errors show the server is there
    req.addEventListener("abort"  , () => { resolve('Abort: ') });    // Somebody aborted test (don't know how)
    req.addEventListener("timeout", () => { reject ('Down:  ') });    // timed out - presumably couldn't connect

    // LogToWindow("Testing " + url);
    req.open('GET', url, true);                         // async http GET from host
    req.timeout = requestTimeout;                       // timeout - make long enough even for bufferbloat
    req.send();
  });
}
