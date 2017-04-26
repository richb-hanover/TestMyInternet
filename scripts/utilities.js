
// LogToWindow() - log data to the main GUI window with time stamp, appending to existing text
export function LogToWindow(text) {
  const textarea = document.getElementById("article");
  const curtext = textarea.value;
  const date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text + "\n");
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
