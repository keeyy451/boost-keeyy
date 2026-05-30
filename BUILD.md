# EmuBoost Pro v2.0 - Build & Release Documentation

## 📋 Prerequisites

- **Node.js**: v18+ (LTS recommended)
- **npm**: v9+
- **Windows 10/11** (for building Windows installers)
- **Git**: Latest version

## 🚀 Quick Start (Development)

```bash
# Install dependencies
npm install

# Start development server (Vite + Electron)
npm run dev
```

This will:
1. Start Vite dev server on `http://localhost:5173`
2. Wait for Vite to be ready
3. Launch Electron in development mode with `--dev` flag

## 🏗️ Build for Production

```bash
# Step 1: Build the Vite frontend
npm run build

# Step 2: Package with Electron Builder (creates installer)
npm run package
```

Output will be in `dist-electron/` directory.

### Build Output
- `EmuBoost Setup x.x.x.exe` — NSIS installer
- `EmuBoost x.x.x.exe` — Portable executable

## 📁 Project Structure

```
EmuBoost/
├── main.js              # Electron main process
├── preload.js           # Context bridge (IPC APIs)
├── database.js          # SQLite database module
├── optimizer.js         # Windows optimization functions
├── license.js           # License key validation
├── package.json         # Dependencies & build config
├── vite.config.js       # Vite bundler configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
├── index.html           # HTML entry point
├── public/
│   └── logo.png         # Application logo
├── src/
│   ├── main.jsx         # React entry point
│   ├── App.jsx          # Root component with routing
│   ├── index.css        # Global styles & design system
│   ├── components/
│   │   └── Sidebar.jsx  # Navigation sidebar
│   └── views/
│       ├── Dashboard.jsx       # Real-time monitoring [FREE]
│       ├── HardwareMonitor.jsx # Hardware details [FREE]
│       ├── ProcessManager.jsx  # Task manager [FREE]
│       ├── Benchmark.jsx       # System benchmark [FREE]
│       ├── StartupManager.jsx  # Startup apps [FREE]
│       ├── Optimizer.jsx       # System optimizer [PRO/FREE]
│       ├── DownloadCenter.jsx  # Emulator downloads
│       ├── UpdateManager.jsx   # Auto-updater
│       ├── License.jsx         # License management
│       └── Settings.jsx        # App settings
└── dist-electron/       # Build output (generated)
```

## 🔑 License System

### Free Features
- Dashboard Monitoring
- Hardware Information  
- Process Manager
- Benchmark
- Startup Manager

### Pro Features (Requires License Key)
- Turbo Boost (1-Click Full Optimize)
- Advanced Emulator Tweaks
- Auto Maintenance

### License Key Format
```
EMU-PRO-XXXX
```
Example: `EMU-PRO-1234`, `EMU-PRO-ABCD`

License data is stored in: `%APPDATA%/emuboost/emuboost_license.json`

## 🔄 Auto-Update System

The app uses `electron-updater` integrated with GitHub Releases.

### For Publishing Updates:
1. Update version in `package.json`
2. Build: `npm run package`
3. Create a GitHub Release with the built installer
4. Tag the release with the version number (e.g., `v2.1.0`)

### Update Flow:
1. On startup, app checks GitHub Releases for new version
2. If update available, user gets notification in Update Manager
3. User can download and install from within the app
4. App restarts with the new version

## 📝 Release Checklist

### Pre-Release
- [ ] Update version in `package.json`
- [ ] Test all features in development mode (`npm run dev`)
- [ ] Verify no console errors
- [ ] Test license activation / deactivation
- [ ] Test all optimizer functions (requires Admin for some)
- [ ] Verify Dashboard real-time stats work

### Build
- [ ] Run `npm run build` — Vite frontend build succeeds
- [ ] Run `npm run package` — Electron Builder completes
- [ ] Test the installer on a clean Windows machine
- [ ] Verify uninstaller works properly

### Post-Release
- [ ] Create GitHub Release with changelog
- [ ] Upload installer to GitHub Release assets
- [ ] Verify auto-update detects new version
- [ ] Update official website download link

## ⚠️ Known Notes

1. **Windows Defender**: Unsigned executables may trigger SmartScreen warnings. 
   To resolve: Purchase a code signing certificate and add to `electron-builder` config.
   
2. **Admin Rights**: Some optimizer features (Game DVR, DNS changes) require 
   the app to be run as Administrator.

3. **SQLite**: The `sqlite3` native module requires a rebuild for the target 
   Electron version. `electron-builder` handles this automatically.

## 🔧 Configuration

### electron-builder (in package.json)
```json
{
  "build": {
    "appId": "com.emuboost.app",
    "productName": "EmuBoost",
    "win": { "target": "nsis" },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true
    }
  }
}
```

### Adding Code Signing (Future)
```json
{
  "build": {
    "win": {
      "certificateFile": "./cert.pfx",
      "certificatePassword": "YOUR_PASSWORD"
    }
  }
}
```
