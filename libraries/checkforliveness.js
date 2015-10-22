// livenessMediator - pub/sub pattern.
// Hosts subscribe to the mediator; it periodically runs and
//  tests all the hosts.
// Each time a test completes (either responds or fails to respond)
//  the mediator publishes that host's info (Up/Down, response time, etc)
// Channel for pub/sub is "Host:Port" (where :Port is optional)

'use strict'; // shouldn't be necessary for ES6

// from http://addyosmani.com/largescalejavascript/#mediatorpattern
var mediator = (function(){
  var channels = [];
  var subscribe = function(channel, fn){
        if (!channels[channel]) {
          channels[channel] = [];
        }
        channels[channel].push({ context: this, callback: fn });
        return this;
      },

      publish = function(channel){
        if (!channels[channel]) return false;
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = channels[channel].length; i < l; i++) {
          var subscription = channels[channel][i];
          subscription.callback.apply(subscription.context, args);
        }
        return this;
      };

  return {
    publish: publish,
    subscribe: subscribe,
    installTo: function(obj){
      obj.subscribe = subscribe;
      obj.publish = publish;
    },
    CheckAllForLiveness: CheckAll,
  };

  function CheckAll(){
    var l = channels.length;
    //for (var i=0; i < l; i++) {
    //  CheckForLiveness(channels[i]);
    //}
    for (var ch in channels)
    {
      CheckForLiveness(ch);
    }
  }

// Check For Liveness - send a http query to the named host and port
// Detect whether it timed out (non-responsive) or returned some other
//    response/error (most likely will give CORS error, which simply means it's up)
//
  function CheckForLiveness(host_port){
    var url = "http://" + host_port + "/";
    var req = new XMLHttpRequest();
    req.addEventListener("timeout",  nocompletion);   // timed out - presumably couldn't connect
    req.addEventListener("load",     anycompletion);  // Got some kind of response back
    req.addEventListener("error",    anycompletion);
    req.addEventListener("abort",    anycompletion);
    req.open('GET', url, true);                       // async http GET from host
    req.timeout = 2000;                               // 2 sec timeout - long enough even for bufferbloat
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


}());

// Kick off all the excitement...

setInterval(mediator.CheckAllForLiveness, 5000);

