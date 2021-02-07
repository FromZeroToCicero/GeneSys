const path = require("path");
const osu = require("node-os-utils");
const { ipcRenderer } = require("electron");
const { cpu, mem, os, drive } = osu;

const cpuProgress = document.getElementById("cpu-progress");
const cpuProgressContainer = document.getElementById("cpu-progress-container");
const cpuUsage = document.getElementById("cpu-usage");
const cpuUsageContainer = document.getElementById("cpu-usage-container");
const cpuFree = document.getElementById("cpu-free");
const cpuFreeContainer = document.getElementById("cpu-free-container");
const cpuCount = document.getElementById("cpu-count");
const cpuModel = document.getElementById("cpu-model");
const computerName = document.getElementById("comp-name");
const originalOs = document.getElementById("orig-os");
const originalOsContainer = document.getElementById("orig-os-container");
const osSystem = document.getElementById("os");
const systemUptime = document.getElementById("sys-uptime");
const ipAddress = document.getElementById("ip-address");
const systemUsedMemory = document.getElementById("mem-used");
const systemUsedMemoryContainer = document.getElementById("mem-used-container");
const systemFreeMemory = document.getElementById("mem-free");
const systemFreeMemoryContainer = document.getElementById("mem-free-container");
const driverUsedMemory = document.getElementById("driver-used");
const driverUsedMemoryContainer = document.getElementById("driver-used-container");
const driverFreeMemory = document.getElementById("driver-free");
const driverFreeMemoryContainer = document.getElementById("driver-free-container");

let cpuOverload;
let alertFrequency;

// Get settings
ipcRenderer.on("settings:get", (e, settings) => {
  cpuOverload = +settings.cpuOverload;
  alertFrequency = +settings.alertFrequency;
});

// Set CPU Model
cpuModel.innerText = cpu.model();

// Set CPU Count
cpuCount.innerText = cpu.count();

// Set computer name
computerName.innerText = os.hostname();

// Set original OS
os.oos().then((info) => {
  if (osu.isNotSupported(info)) {
    originalOsContainer.style.display = "none";
  } else {
    originalOs.innerText = info;
  }
}).catch(err => {
  originalOsContainer.style.display = "none";
});

// Set OS
osSystem.innerText = `${os.type()} ${os.arch()}`;

// Set IP Address
ipAddress.innerText = os.ip();

// Run every 2 seconds
setInterval(() => {
  // CPU usage
  cpu.usage().then((info) => {
    cpuUsage.innerText = `${info.toFixed(2)}%`;
    cpuProgress.style.width = `${info.toFixed(2)}%`;

    // Make progress bar red if CPU overload
    if (info.toFixed(2) >= cpuOverload) {
      cpuProgress.style.background = "red";
    } else {
      cpuProgress.style.background = "#30c88b";
    }

    // Check overload
    if (info.toFixed(2) >= cpuOverload && runNotify(alertFrequency)) {
      notifyUser({
        title: "CPU Overload",
        body: `CPU is over ${cpuOverload}%!`,
        icon: path.join(__dirname, "img", "icon.png"),
      });

      localStorage.setItem("lastNotify", +new Date());
    }
  }).catch(err => {
    cpuUsageContainer.style.display = "none";
    cpuProgressContainer.style.display = "none";
  });

  // CPU free
  cpu.free().then((info) => {
    cpuFree.innerText = `${info.toFixed(2)}%`;
  }).catch(err => {
    cpuFreeContainer.style.display = "none";
  });;

  // System uptime
  systemUptime.innerText = formatUptime(os.uptime());

  // Set memory used and free
  mem.info().then((info) => {
    systemUsedMemory.innerText = `${info.usedMemMb} MB`;
    systemFreeMemory.innerText = `${info.freeMemMb} MB`;
  }).catch(err => {
    systemUsedMemoryContainer.style.display = "none";
    systemFreeMemoryContainer.style.display = "none";
  });;

  // Set drive space used and free
  drive.info().then((info) => {
    driverUsedMemory.innerText = `${info.usedGb} GB`;
    driverFreeMemory.innerText = `${info.freeGb} GB`;
  }).catch(err => {
    driverUsedMemoryContainer.style.display = "none";
    driverFreeMemoryContainer.style.display = "none";
  });
}, 2000);

// Show uptime formatted as days,hours,mins,sec
function formatUptime(seconds) {
  seconds = +seconds;
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${d}d, ${h}h, ${m}m, ${s}s`;
}

// Send notification in case of overload
function notifyUser(options) {
  new Notification(options.title, options);
}

// Check how much time has passed from last notification
function runNotify(alertFrequency) {
  if (localStorage.getItem("lastNotify") === null) {
    localStorage.setItem("lastNotify", +new Date());
    return true;
  }

  const notifyTime = new Date(parseInt(localStorage.getItem("lastNotify")));
  const now = new Date();
  const diffTime = Math.abs(now - notifyTime);
  const minutesPassed = Math.ceil(diffTime / (1000 * 60));

  if (minutesPassed > alertFrequency) {
    return true;
  } else {
    return false;
  }
}
