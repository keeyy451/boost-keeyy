import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Optimizer from './views/Optimizer';
import ProcessManager from './views/ProcessManager';
import HardwareMonitor from './views/HardwareMonitor';
import Benchmark from './views/Benchmark';
import StartupManager from './views/StartupManager';
import UpdateManager from './views/UpdateManager';
import DownloadCenter from './views/DownloadCenter';
import License from './views/License';
import Settings from './views/Settings';

const pageVariants = {
  initial: { opacity: 0, y: 12, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -8, scale: 0.99, transition: { duration: 0.15, ease: 'easeIn' } },
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [license, setLicense] = useState({ isPro: false, key: null });
  const [appVersion, setAppVersion] = useState('2.0.0');

  const fetchLicense = async () => {
    if (window.electron?.getLicenseStatus) {
      const res = await window.electron.getLicenseStatus();
      setLicense({ isPro: res.isPro, key: res.key });
    }
  };

  useEffect(() => {
    fetchLicense();
    // Fetch app version from Electron
    if (window.electron?.getAppVersion) {
      window.electron.getAppVersion().then(v => { if (v) setAppVersion(v); });
    }
  }, []);

  const views = {
    dashboard: <Dashboard isPro={license.isPro} />,
    optimizer: <Optimizer isPro={license.isPro} />,
    processes: <ProcessManager />,
    hardware:  <HardwareMonitor />,
    benchmark: <Benchmark />,
    startup:   <StartupManager />,
    downloads: <DownloadCenter />,
    updates:   <UpdateManager />,
    license:   <License isPro={license.isPro} licenseKey={license.key} refreshLicense={fetchLicense} />,
    settings:  <Settings isPro={license.isPro} />,
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-game-bg text-white select-none">
      {/* Scanline CRT effect */}
      <div className="scanline-overlay" />

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0e1220',
            color: '#e2e8f0',
            border: '1px solid rgba(0, 240, 255, 0.2)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.1)',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 600,
            letterSpacing: '0.02em',
          },
          success: { iconTheme: { primary: '#00ff88', secondary: '#0e1220' } },
          error:   { iconTheme: { primary: '#ff3060', secondary: '#0e1220' } },
          duration: 3000,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPro={license.isPro}
        appVersion={appVersion}
      />

      {/* Main Content */}
      <main className="flex-1 relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-20%] right-[10%] w-[500px] h-[500px] bg-neon-purple/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-neon-blue/5 rounded-full blur-[120px]" />
          <div className="absolute inset-0 bg-grid-pattern opacity-100" />
        </div>

        <div className="relative z-10 h-full overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="h-full"
            >
              {views[activeTab] || <Dashboard />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
