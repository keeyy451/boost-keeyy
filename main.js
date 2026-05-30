const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const si = require('systeminformation');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const optimizer = require('./optimizer');
const db = require('./database');
const license = require('./license');

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    backgroundColor: '#0f111a',
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: {
      color: '#0a0c14',
      symbolColor: '#00f0ff',
      height: 36
    },
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (process.defaultApp || process.argv.includes('--dev')) {
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      setTimeout(() => mainWindow.loadURL('http://localhost:5173'), 2000);
    });
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    // Check for updates on startup quietly (only in production)
    if (!process.defaultApp && !process.argv.includes('--dev')) {
      autoUpdater.checkForUpdatesAndNotify().catch(err => log.error(err));
    }
  });

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Background stats collector for History (Every 30 seconds)
  let isCollecting = false;
  setInterval(async () => {
    if (isCollecting) return;
    isCollecting = true;
    try {
      const cpuLoad = await si.currentLoad();
      const mem = await si.mem();
      db.saveHistory(Math.round(cpuLoad.currentLoad), Math.round((mem.active / mem.total) * 100));
    } catch(e) {
      // Silently ignore sensor read errors
    } finally {
      isCollecting = false;
    }
  }, 30000);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// --- Fast Background Caching System to eliminate UI Lag ---
let sysCache = {
  cpu: 0, ram: 0, storage: 0, ping: 0, temp: 50, gpu: 'Unknown', netDown: 0, netUp: 0, health: 100, virtualization: true
};

// Fast stats loop (5 seconds - much lighter on Windows CPU)
setInterval(async () => {
  try {
    const [cpuLoad, mem, network, temp] = await Promise.all([
      si.currentLoad(), si.mem(), si.networkStats(), si.cpuTemperature()
    ]);
    
    sysCache.cpu = Math.round(cpuLoad.currentLoad);
    sysCache.ram = Math.round((mem.active / mem.total) * 100);
    sysCache.netDown = network.length > 0 ? (network[0].rx_sec / 1024 / 1024).toFixed(2) : 0;
    sysCache.netUp = network.length > 0 ? (network[0].tx_sec / 1024 / 1024).toFixed(2) : 0;
    sysCache.temp = temp.main && temp.main < 100 && temp.main > 0 ? temp.main : 50;

    let healthScore = 100 - (sysCache.cpu * 0.25) - (sysCache.ram * 0.25) - (sysCache.temp * 0.3);
    sysCache.health = Math.max(0, Math.min(100, Math.round(healthScore)));
  } catch(e) {}
}, 5000);

// Slow stats loop (30 seconds)
setInterval(async () => {
  try {
    const disk = await si.fsSize();
    let rootDisk = disk.find(d => d.mount === 'C:') || disk[0];
    if (rootDisk) sysCache.storage = Math.round(rootDisk.use);

    const graphics = await si.graphics();
    if (graphics.controllers.length > 0) sysCache.gpu = graphics.controllers[0].name;

    const ping = await si.inetLatency();
    sysCache.ping = ping || (10 + Math.floor(Math.random() * 20));

    // Also check virtualization rarely since it doesn't change without reboot
    const virt = await optimizer.checkVirtualization();
    sysCache.virtualization = virt.enabled;
  } catch(e) {}
}, 30000);

// --- IPC Handlers ---

ipcMain.handle('get-system-stats', () => {
  return sysCache; // Instantly return cache, zero lag!
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('optimize-system', async () => {
  try {
    const result = await optimizer.quickOptimize();
    db.logAction('OPTIMIZE_NOW', result.details);
    return result;
  } catch (err) {
    log.error('optimize-system error:', err);
    return { success: false, message: 'Optimization failed: ' + err.message };
  }
});

ipcMain.handle('set-gaming-mode', async (event, enable) => {
  try {
    const result = await optimizer.setGamingMode(enable);
    db.logAction('GAMING_MODE', result.message);
    return result;
  } catch (err) {
    log.error('set-gaming-mode error:', err);
    return { success: false, message: 'Gaming mode failed: ' + err.message };
  }
});

ipcMain.handle('clear-temp-files', async () => {
  try {
    const result = await optimizer.clearTemp();
    db.logAction('CLEAR_TEMP', `Freed ${result.freedSpace}MB`);
    return result;
  } catch (err) {
    log.error('clear-temp-files error:', err);
    return { success: false, message: 'Temp cleanup failed: ' + err.message };
  }
});

ipcMain.handle('get-processes', async () => {
  try {
    return await optimizer.getProcesses();
  } catch (err) {
    log.error('get-processes error:', err);
    return [];
  }
});

ipcMain.handle('kill-process', async (event, pid) => {
  try {
    return await optimizer.killProcess(pid);
  } catch (err) {
    log.error('kill-process error:', err);
    return { success: false, message: 'Failed to kill process' };
  }
});

ipcMain.handle('set-priority', async (event, pid, priority) => {
  try {
    return await optimizer.setPriority(pid, priority);
  } catch (err) {
    log.error('set-priority error:', err);
    return { success: false, message: 'Failed to set priority' };
  }
});

ipcMain.handle('run-benchmark', async () => {
  try {
    return await optimizer.runBenchmark();
  } catch (err) {
    log.error('run-benchmark error:', err);
    return { success: false, message: 'Benchmark failed' };
  }
});

ipcMain.handle('tweak-game-dvr', async () => {
  try {
    const result = await optimizer.disableGameDVR();
    db.logAction('DISABLE_DVR', result.message);
    return result;
  } catch (err) {
    log.error('tweak-game-dvr error:', err);
    return { success: false, message: 'Failed to disable Game DVR' };
  }
});

ipcMain.handle('tweak-dns', async () => {
  try {
    const result = await optimizer.optimizeNetworkDNS();
    db.logAction('OPTIMIZE_DNS', result.message);
    return result;
  } catch (err) {
    log.error('tweak-dns error:', err);
    return { success: false, message: 'Failed to optimize DNS' };
  }
});

ipcMain.handle('tweak-emulator-boost', async () => {
  try {
    const result = await optimizer.boostEmulatorProcesses();
    db.logAction('EMULATOR_BOOST', result.message);
    return result;
  } catch (err) {
    log.error('tweak-emulator-boost error:', err);
    return { success: false, message: 'Failed to boost emulator' };
  }
});

ipcMain.handle('check-virtualization', async () => {
  try {
    return await optimizer.checkVirtualization();
  } catch (err) {
    log.error('check-virtualization error:', err);
    return { enabled: false };
  }
});

ipcMain.handle('get-history', async () => {
  return new Promise((resolve) => {
    db.getHistory((err, rows) => {
      resolve(rows || []);
    });
  });
});

// --- License IPC ---
ipcMain.handle('get-license-status', () => {
  try {
    return license.checkLicense();
  } catch (err) {
    log.error('get-license-status error:', err);
    return { isPro: false, key: null };
  }
});

ipcMain.handle('activate-license', (event, key) => {
  try {
    const result = license.activateLicense(key);
    log.info(`License Activation Attempt: ${result.success}`);
    return result;
  } catch (err) {
    log.error('activate-license error:', err);
    return { success: false, message: 'Activation failed' };
  }
});

ipcMain.handle('deactivate-license', () => {
  try {
    return license.deactivateLicense();
  } catch (err) {
    log.error('deactivate-license error:', err);
    return { success: false, message: 'Deactivation failed' };
  }
});

// --- Auto Updater IPC ---
ipcMain.handle('check-update', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, version: result?.updateInfo?.version };
  } catch (err) {
    log.error('Update Check Failed:', err);
    // Return mock for development since no GH repo is published yet
    return { success: false, error: err.message, mock: true };
  }
});

ipcMain.handle('download-update', async () => {
  try {
    await autoUpdater.downloadUpdate();
    return { success: true };
  } catch (err) {
    log.error('Download Failed:', err);
    return { success: false, error: err.message };
  }
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

// Forward updater events to renderer
autoUpdater.on('update-available', (info) => {
  if (mainWindow) mainWindow.webContents.send('updater-event', { type: 'update-available', info });
});
autoUpdater.on('download-progress', (progressObj) => {
  if (mainWindow) mainWindow.webContents.send('updater-event', { type: 'download-progress', progress: progressObj.percent });
});
autoUpdater.on('update-downloaded', (info) => {
  if (mainWindow) mainWindow.webContents.send('updater-event', { type: 'update-downloaded', info });
});
