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