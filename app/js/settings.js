const settingsForm = document.getElementById("settings-form");
const cpuOverloadField = document.getElementById("cpu-overload");
const alertFrequencyField = document.getElementById("alert-frequency");

// Get settings
ipcRenderer.on("settings:get", (e, settings) => {
  cpuOverloadField.value = settings.cpuOverload;
  alertFrequencyField.value = settings.alertFrequency;
});

// Submit settings
settingsForm.addEventListener("submit", (e) => {
  e.preventDefault();

  ipcRenderer.send("settings:set", {
    cpuOverload: cpuOverloadField.value,
    alertFrequency: alertFrequencyField.value,
  });

  showAlert("Settings have been saved!");
});

function showAlert(msg) {
  const alert = document.getElementById("alert");
  alert.classList.remove("hide");
  alert.classList.add("alert");
  alert.innerText = msg;
  setTimeout(() => alert.classList.add("hide"), 3000);
}
