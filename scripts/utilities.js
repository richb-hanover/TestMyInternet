
// LogToWindow() - log data to the main GUI window with time stamp, appending to existing text
// If the (optional) date timestamp is supplied, it overrides the current time.
//  This routine always appends "\n" to the end of the string so new entries start their own line
export function LogToWindow(text, date = new Date()) {
  const textarea = document.getElementById("LogArea");
  const curtext = textarea.value;
  const dateStr = date.toLocaleString();
  textarea.value = (curtext + dateStr + " " + text + "\n");
  textarea.scrollTop = textarea.scrollHeight;
}

// RestoreLogArea() - read the contents of localStorage, and place into LogArea <textarea>
export function RestoreLogArea() {
  var str = "";
  const versionInfo = document.getElementById('version').innerHTML;

  if (typeof(Storage) !== "undefined") {
    str = localStorage.getItem("LogArea");
    if (! str) {    // not a truthy value
      str = "";
    }
    // consolelog(`localStorage held: \n${str}`);
  }
  document.getElementById("LogArea").value = str;
  if (str === "") {
    LogToWindow(`Starting TestMyInter.net ${versionInfo}`);
  }
  else {
    LogToWindow(`----: Testing resumed with ${versionInfo}`);
  }
}

// SaveLogArea() - save the contents of the LogArea textarea back into localStorage
export function SaveLogArea() {
  var str = "";

  if (document.getElementById("LogArea").value !== "") {
    LogToWindow('----: Testing paused...');
  }
  if (typeof(Storage) !== "undefined") {
    str = document.getElementById("LogArea").value;
    localStorage.setItem("LogArea", str);
    // consolelog(`Saving LogArea: \n${str}`);
  }
}

// ClearLocalStorage() - remove the "LogArea" item from localStorage
export function ClearLocalStorage() {
  if (typeof(Storage) !== "undefined") {
    localStorage.removeItem("LogArea");
    document.getElementById("LogArea").value = '';
  }
}

// consolelog() - log data with time stamp to console.log
export function consolelog(text) {
  const date = new Date().toLocaleString();
  console.log(`${date} ${text}`);
}

// rgb2hex() - convert rgb color to hex format
// Ignore any alpha channel info
// rgb(1, 2, 3) -> #010203
// http://jsfiddle.net/Mottie/xcqpF/1/light
export function rgb2hex(rgb){
  rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
  return (rgb && rgb.length === 4) ? "#" +
    ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
    ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

