const path = require('path');
const os = require('os');
const fs = require('fs');

const dbDir = path.join(os.homedir(), '.emuboost');
const dbPath = path.join(dbDir, 'data.json');

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize default JSON structure
let data = {
  logs: [],
  history: [],
  settings: {}
};

// Load data if exists
if (fs.existsSync(dbPath)) {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    data = JSON.parse(raw);
  } catch (err) {
    console.error('Error reading JSON database, resetting:', err);
  }
} else {
  saveData();
}

function saveData() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing JSON database:', err);
  }
}

function logAction(action, details) {
  data.logs.unshift({
    id: Date.now(),
    action,
    details,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last 50 logs
  if (data.logs.length > 50) {
    data.logs = data.logs.slice(0, 50);
  }
  
  saveData();
}

function getLogs(callback) {
  // Return logs asynchronously to match previous sqlite signature
  setTimeout(() => {
    callback(null, data.logs);
  }, 0);
}

function saveHistory(cpu, ram) {
  data.history.push({
    id: Date.now(),
    cpu,
    ram,
    timestamp: new Date().toISOString()
  });
  
  // Keep only the last 100 entries
  if (data.history.length > 100) {
    data.history = data.history.slice(data.history.length - 100);
  }
  
  saveData();
}

function getHistory(callback) {
  // Return history asynchronously to match previous sqlite signature
  setTimeout(() => {
    callback(null, data.history);
  }, 0);
}

function getSetting(key, defaultVal, callback) {
  setTimeout(() => {
    if (data.settings[key] !== undefined) {
      callback(data.settings[key]);
    } else {
      callback(defaultVal);
    }
  }, 0);
}

function setSetting(key, value) {
  data.settings[key] = value;
  saveData();
}

module.exports = {
  logAction,
  getLogs,
  saveHistory,
  getHistory,
  getSetting,
  setSetting
};
