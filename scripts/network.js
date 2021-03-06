

// LogCompletion() - completion routine for CheckAlive xhr request
// Params: 
//    text - the text of the event (load, error, abort, timeout)
//    timer - the setTimeout function
//    resolve - the promise's resolve() function
// Actions:
//    clear the timer (if any)
//    resolves the promise, providing the text response

function LogCompletion(text, timer, resolve ) {
  if (timer) {
    clearTimeout(timer);
  }
  // console.log("LogCompletion(): Status was: " + text);
  resolve(text);
}

// CheckAlive(host) - send a http query to the named host
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which also means it's up/working)
// See also: https://italonascimento.github.io/applying-a-timeout-to-your-promises/

// Note: Using carefully-crafted XMLHttpRequest function for the request because
//   browsers handle the timeout condition wildly differently when req.timeout=0:
//    Chrome & others based on Chromium (Opera, Brave) on OSX time out in ~15 seconds
//    Firefox seems to be willing to wait forever
//    MSIE & Edge seem to time out in 7 seconds
// SO... the strategy is to set a timer for less than the desired time and let it
//    end the request. But cleanup is a little messy - See LogCompletion() and
//    the timeout routine for details
// Also need to create a "simple request" that doesn't trigger a pre-flight test.
// See https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Preflighted_requests

let cache = Math.round(Math.random()*1000000);                 // global
export function CheckAlive(host, timeout) {

  return new Promise((resolve, reject) => {
    const url = `http://${host}:80/?cache=${cache}`;
    cache += 1;
    const req = new XMLHttpRequest();       // this is the request we'll use to test the host
    const timer = setTimeout(function () {  // timer that will abort the connection if needed
      // console.log("xhr setTimeout aborting: "+req.readyState);
      LogCompletion('abort', timer, resolve);
      req.onload = undefined;           // clear out all our request handlers
      req.onerror = undefined;
      req.onabort = undefined;
      req.ontimeout = undefined;
      req.onloadstart = undefined;      // clear out all other request handlers
      req.onprogress = undefined;
      req.onloadend = undefined;
      req.abort();                      // abort the xhr request
  //          console.log("Post-abort: readyState " + req.readyState + ", statusText: " + req.statusText);
    }, timeout);

    req.open('GET', url, true);             // async http GET from host
    req.setRequestHeader('Content-Type', 'text/plain');
    req.timeout = 0;                        // Infinite timer - setTimeout() controls length
    req.onload    = function (e) { LogCompletion('load',    timer, resolve)  };
    req.onerror   = function (e) { LogCompletion('error',   timer, resolve)  };
    req.onabort   = function (e) { LogCompletion('abort',   timer, resolve)  };
    req.ontimeout = function (e) { LogCompletion('timeout', timer, resolve)  };
    // console.log(`About to request: ${url}`);
    req.send();
  })
}
