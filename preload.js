const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getSystemStats: () => ipcRenderer.invoke('get-system-stats'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  optimizeSystem: () => ipcRenderer.invoke('optimize-system'),
  setGamingMode: (enable) => ipcRenderer.invoke('set-gaming-mode', enable),
  clearTempFiles: () => ipcRenderer.invoke('clear-temp-files'),
  getProcesses: () => ipcRenderer.invoke('get-processes'),
  killProcess: (pid) => ipcRenderer.invoke('kill-process', pid),
  setPriority: (pid, priority) => ipcRenderer.invoke('set-priority', pid, priority),
  runBenchmark: () => ipcRenderer.invoke('run-benchmark'),
  getHistory: () => ipcRenderer.invoke('get-history'),
  tweakGameDVR: () => ipcRenderer.invoke('tweak-game-dvr'),
  tweakDNS: () => ipcRenderer.invoke('tweak-dns'),
  tweakEmulatorBoost: () => ipcRenderer.invoke('tweak-emulator-boost'),
  checkVirtualization: () => ipcRenderer.invoke('check-virtualization'),
  
  // License
  getLicenseStatus: () => ipcRenderer.invoke('get-license-status'),
  activateLicense: (key) => ipcRenderer.invoke('activate-license', key),
  deactivateLicense: () => ipcRenderer.invoke('deactivate-license'),
  
  // Updater
  checkUpdate: () => ipcRenderer.invoke('check-update'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  onUpdaterEvent: (callback) => ipcRenderer.on('updater-event', callback),
  offUpdaterEvent: (callback) => ipcRenderer.removeListener('updater-event', callback)
});
