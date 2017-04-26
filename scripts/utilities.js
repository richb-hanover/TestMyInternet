export function LogToWindow(text) {
  const textarea = document.getElementById("article");
  const curtext = textarea.value;
  const date = new Date().toLocaleString();
  textarea.value = (curtext + date + " " + text + "\n");
}

