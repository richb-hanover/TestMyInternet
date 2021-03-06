// First cut at monitoring websites from a web page application
//

import { LogToWindow, RestoreLogArea, SaveLogArea, ClearLocalStorage, consolelog, rgb2hex } from "./utilities.js";
import { CheckHost, GetLocalIP, CheckAlive  } from "./network.js";

const checkInterval = 30 * 1000;      // msec
const spinnerTimeout = 6 * 1000;
const requestTimeout = 6 * 1000;
let averageResponse = 0;
let lastTestTick = new Date();        // holds time of last test

// We're starting up - set up handlers

const header = document.getElementsByTagName("header")[0];
header.onclick = () => {
  const spinner = document.getElementById("spinner");
  if (spinner.style.visibility === "visible") {
    consolelog("Already testing...");
  }
  else {
    consolelog("Manual check...")
    UpdateHosts();  
  }
};

// get the version, and also set up its onclick handler
const version = document.getElementById('version');
version.onclick = () => {     // clear out localStorage if clicked (debugging)
  ClearLocalStorage();
}

// call SaveLogArea() whenever window/tab is about to close, or browser about to exit
window.addEventListener("beforeunload", SaveLogArea); 

RestoreLogArea();           // we're starting this page again: restore the LogArea
AddInitialHosts();          // add in the list of hosts (actually, only one now)
// AddRouter();
UpdateHosts();              // test the hosts

// queue up a test of all hosts every now and again
setInterval (UpdateHosts, checkInterval);    // every 30 sec

// AddInitialHosts() - make a list of <host> elements on the page to start
function AddInitialHosts() {
  let initialHosts = [
    'TestMyInter.net'
  ];
  initialHosts.forEach((elem) => AddHost(elem));
}

// AddHost(host_to_add) - add a <host> element to the page, as a child of the <hosts> div
function AddHost(hostStr) {
  const hosts = document.getElementById('hosts');
  const host = document.createElement('host');
  host.innerHTML = hostStr;
  host.classList.add("jumbotron");
  hosts.appendChild(host);
}

// AddRouter() - request the local IP address, divine the router's address (".1"), and add it
// function AddRouter() {
//   GetLocalIP()
//     .then ((ip) => {
//       let segments = ip.split(".");
//       segments[3] = "1";
//       const routerIP = segments.join(".");
//       AddHost(routerIP);
//     })
//     .then (() => {
//       UpdateHosts();         // kick off the test run
//     })
//     .catch ((e) => {
//       consolelog(`GetLocalIP returned error: ${e}`);
//   })
// }

// UpdateHosts() - test all the hosts, and update their status
// find all the <host> elements on the page, iterate through them
function UpdateHosts() {

  // Start the spinner, with a timeout
  spinner.style.display = "block";

  // Get the host to test
  const hostList = document.getElementsByTagName("host");
  const host = hostList[0];
  const hostName = host.innerHTML;

  // Detect if the computer has gone to sleep (and consequently hasn't run a test recently)
  // We log this because we can't know if there has been a failure while we were asleep
  // If we find we were asleep, we skip the test this time around, 
  // to give Wi-Fi/network time to wake up and avoid spurious outage reports 

  // Heuristic: Use delta > 4*checkInterval to declare a sleep/resume event
  //    delta's of 50 .. 69 seconds were observed occasionally using Safari on OSX
  //    Setting it to 4x the check interval still ignores outages of < 2 min, which seems reasonable

  const startTime = new Date();
  const delta = startTime - lastTestTick;         // delta since previous test

  if ( delta > 4*checkInterval ) {
    consolelog(`Skipping test from wakeup... Last test: ${lastTestTick} Delta: ${delta/1000}`);
    LogToWindow('Sleep', lastTestTick);
    LogToWindow('Awake');      
    lastTestTick = startTime;                 
  }
  else {                        // test the (single) host
    CheckAlive(hostName, requestTimeout)
      .then((status) => {
        lastTestTick = new Date();                  // remember this test's time
        const elapsed = lastTestTick - startTime;
        UpdateDevice(host, status, delta, elapsed);
      })
      .then(() => {
        $("#spinner").fadeOut(1000);
      })
  }
}

// UpdateAverage(elapsed)
// Weighted average of averageResponse time: 7/8 of current average + 1/8 of new reading
function UpdateAverage(elapsed) {
  averageResponse = Math.round(averageResponse*0.875 + elapsed*0.125);
}

// UpdateDevice(aHost, status) - update the DOM element, based on the status
function UpdateDevice(aHost, status, delta, elapsed) {

  const hostName = aHost.innerHTML;
  
  if (averageResponse == 0) {           // initial setting...
        averageResponse = elapsed;
  }

  let displayedText = "Down: ";
  if (status === 'load') {
    displayedText   = "OK:   ";
    UpdateAverage(elapsed);
  }
  else if (status === 'error' && elapsed < 4*averageResponse) {
    displayedText   = "OK:   ";  
    UpdateAverage(elapsed);
  }

  let curColor = aHost.style.backgroundColor;
  if (curColor) {
    curColor = rgb2hex(curColor).toUpperCase();
  }

  let color;
  if      (displayedText.indexOf("OK:") === 0)    color = "#4CAF50"; // material.io 500 green
  else if (displayedText.indexOf("Abort:") === 0) color = "#FFEB3B"; // material.io 500 yellow
  else if (displayedText.indexOf("Down:") === 0)  color = "#F44336"; // material.io 500 red
  else                                            color = "#9C27B0"; // material.io 500 purple
  aHost.style.backgroundColor = color;
  if (color !== curColor) {
    LogToWindow(displayedText + hostName);
    // consolelog(`color: ${color}, curColor: ${curColor}`);
    // beep();
  }
  consolelog(`${hostName}: "${displayedText}", ${status}, Elapsed: ${elapsed}, Average: ${averageResponse}, Delta: ${delta/1000}`);
}

// Play a short beep
// http://stackoverflow.com/questions/879152/how-do-i-make-javascript-beep
function beep()
{ const snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
  snd.play();
}
