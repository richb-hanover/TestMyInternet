// CheckHost - hostName is the name/IPaddress
//  Return: ajax function that will complete in caller

const requestTimeout = 1000;

export function CheckHost(hostName) {

  return $.ajax({
    url: `http://${hostName}:80/`,
    crossDomain: false,
    timeout: requestTimeout,
    // cache: false,
    data: {
      name : "http://TestMyInter.net"
    }
  })
}

// GetLocalIP() - return the machine's local IP address
// uses webRTC for the answer
// http://stackoverflow.com/questions/391979/get-client-ip-using-just-javascript/32841164#32841164
// Usage:
//   GetLocalIP
//   .then(ip => document.write('your ip: ', ip))
//   .catch(e => console.error(e))

export function GetLocalIP() {
    return new Promise(r => {
    const w = window,
          a = new (w.RTCPeerConnection || w.mozRTCPeerConnection || w.webkitRTCPeerConnection)({
            iceServers: []
          }),
          b = () => {
          };
    a.createDataChannel("");
    a.createOffer(c => a.setLocalDescription(c, b, b), b);
    a.onicecandidate = c => {
      try {
        c.candidate.candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g).forEach(r)
      } catch (e) {
      }
    }
  });
}
// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which also means it's up)
// See also: https://italonascimento.github.io/applying-a-timeout-to-your-promises/

// Not used in version 0.1.0 in favor of ajax() code

function CheckAlive(host_port) {

  const req = new XMLHttpRequest();             // this is the request we'll use to test host_port

  // promise to run the timer that checks for a connection
  const timerPromise = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      req.abort();                              // abort the reqPromise so it doesn't re-surface later
      reject('Down: timeout ');
    }, requestTimeout);
  });

  // promise to attempt to connect - it never times out on its own
  const reqPromise = new Promise(function (resolve, reject) {
    const myurl = encodeURI('http://TestMyInter.net/');
    const url = "http://" + host_port + "/?page="+ myurl;

    req.addEventListener("load"   , () => { resolve('OK:    ') });    // Got some kind of response back
    req.addEventListener("error"  , () => { resolve('OK:    ') });    // CORS errors show the server is there
    // req.addEventListener("abort"  , () => { reject ('Abort: ') });    // Somebody aborted test (don't know how)
    // req.addEventListener("timeout", () => { reject ('Down:  ') });    // timed out - presumably couldn't connect

    // LogToWindow("Testing " + url);
    req.open('GET', url, true);                         // async http GET from host
    req.timeout = 0;                                    // Don't let XMLHttpRequest time out on its own
    // req.ontimeout = (e) => { reject ('Down:  ') };
    req.send();
  });

  // Returns a race between our timeout and request promises
  return Promise.race([
    timerPromise,
    reqPromise
  ]);
}
