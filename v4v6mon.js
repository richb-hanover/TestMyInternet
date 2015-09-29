// First cut at monitoring a v4 or v6 address from a SPA
//

'use strict'; // shouldn't be necessary for ES6

// Promisified GET from http://www.html5rocks.com/en/tutorials/es6/promises/#toc-promise-terminology

function getbare(url){
  var req = new XMLHttpRequest();
  gReq = req;
  req.addEventListener("timeout",  nocompletion);   // timed out - presumably couldn't connect
  req.addEventListener("load",     anycompletion);  // Got some kind of response back
  req.addEventListener("error",    anycompletion);
  req.addEventListener("abort",    anycompletion);
  req.open('GET', url, true);
  req.setRequestHeader('Access-Control-Allow-Origin', URLtoGet);
  req.send();
  return req;
}


function anycompletion(evt){
  console.log (evt);
}

function nocompletion(evt){
  console.log (evt);
}

function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url, true);
    req.setRequestHeader('Access-Control-Allow-Origin', URLtoGet);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      if (req.status == 405) {
        resolve(req.response);
      }
      else {
        reject(Error("Network Error"));
      }
    };

    // Make the request
    req.send();
  });
}

var URLtoGet = "http://gstatic.com/";

// var p = get("https://gfblip.appspot.com/mindelay?callback=?");
// var p = get(URLtoGet);

var gReq = getbare(URLtoGet);