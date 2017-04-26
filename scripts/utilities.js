export function LogToWindow(text) {
  var textarea = document.getElementById("article");
  var curtext = textarea.value;
  var date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text + "\n");
}

