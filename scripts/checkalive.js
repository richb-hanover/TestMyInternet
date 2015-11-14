// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which simply means it's up)
//

import {logToWindow} from "./v4v6mon.js";

export function CheckAlive(host_port) {

  return new Promise(function (resolve, reject) {
    var t;
    var url = "http://" + host_port + "/";

    var req = new XMLHttpRequest();
    req.addEventListener("load"   , () => { resolve('OK   ') });    // Got some kind of response back
    req.addEventListener("error"  , () => { resolve('OK   ') });
    req.addEventListener("abort"  , () => { resolve('Abort') });
    req.addEventListener("timeout", () => { reject ('Down ' ) });   // timed out - presumably couldn't connect

    logToWindow("Testing " + url);
    req.open('GET', url, true);                         // async http GET from host
    req.timeout = 5 * 1000;                             // timeout - make long enough even for bufferbloat
    //req.onreadystatechange = () => checkit(req);
    //req.setRequestHeader('Access-Control-Allow-Origin', url);
    req.send();
  });
}