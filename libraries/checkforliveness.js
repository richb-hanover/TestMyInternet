// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which simply means it's up)
//

'use strict'; // shouldn't be necessary for ES6

function CheckForLiveness(host, port){
  var url = "http://" + host + ":" + port + "/";
  var req = new XMLHttpRequest();
  req.addEventListener("timeout",  nocompletion);   // timed out - presumably couldn't connect
  req.addEventListener("load",     anycompletion);  // Got some kind of response back
  req.addEventListener("error",    anycompletion);
  req.addEventListener("abort",    anycompletion);
  req.open('GET', url, true);                       // async http GET from host
  req.timeout = 5000;                               // 5 sec timeout - long enough even for bufferbloat
  req.setRequestHeader('Access-Control-Allow-Origin', url);
  // req.setRequestHeader('Host', host);
  req.send();
  return req;
}


function anycompletion(evt){
  logToWindow ("GOT A RESPONSE!\n");
}

function nocompletion(evt){
  logToWindow ("No response...\n");
}

