// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which also means it's up)
//

// import {LogToWindow} from "./utilities.js";

export function CheckAlive(host_port) {

  const requestTimeout = 5 * 1000; // msec

  return new Promise(function (resolve, reject) {
    const myurl = encodeURI('http://TestMyInter.net/');
    const url = "http://" + host_port + "/?page="+ myurl;

    const req = new XMLHttpRequest();
    req.addEventListener("load"   , () => { resolve('OK:    ') });    // Got some kind of response back
    req.addEventListener("error"  , () => { resolve('OK:    ') });    // CORS errors show the server is there
    req.addEventListener("abort"  , () => { resolve('Abort: ') });    // Somebody aborted test (don't know how)
    req.addEventListener("timeout", () => { reject ('Down:  ') });   // timed out - presumably couldn't connect

    // LogToWindow("Testing " + url);
    req.open('GET', url, true);                         // async http GET from host
    req.timeout = requestTimeout;                       // timeout - make long enough even for bufferbloat
    req.send();
  });
}
