const fs = require('fs');
const path = require('path');
const { app } = require('electron');

// We store the license status locally in appData
const LICENSE_FILE = path.join(app.getPath('userData'), 'emuboost_license.json');

// Simple local verification (Format: EMU-PRO-XXXX)
// In a real production environment, this would call your REST API
function validateKeyFormat(key) {
  if (!key) return false;
  const regex = /^EMU-PRO-[A-Z0-9]{4}$/;
  return regex.test(key.trim().toUpperCase());
}

function checkLicense() {
  try {
    if (fs.existsSync(LICENSE_FILE)) {
      const data = JSON.parse(fs.readFileSync(LICENSE_FILE, 'utf-8'));
      if (data.isPro && validateKeyFormat(data.key)) {
        return { isPro: true, key: data.key };
      }
    }
  } catch (err) {
    console.error("License read error:", err);
  }
  return { isPro: false, key: null };
}

function activateLicense(key) {
  const formattedKey = key ? key.trim().toUpperCase() : '';
  
  if (validateKeyFormat(formattedKey)) {
    const data = { isPro: true, key: formattedKey, activatedAt: new Date().toISOString() };
    fs.writeFileSync(LICENSE_FILE, JSON.stringify(data));
    return { success: true, message: "PRO License Activated Successfully!" };
  }
  return { success: false, message: "Invalid License Key format. Example: EMU-PRO-1234" };
}

function deactivateLicense() {
  if (fs.existsSync(LICENSE_FILE)) {
    fs.unlinkSync(LICENSE_FILE);
  }
  return { success: true, message: "License removed. Returned to FREE version." };
}

module.exports = {
  checkLicense,
  activateLicense,
  deactivateLicense
};
