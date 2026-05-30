import React, { useState, useEffect } from 'react';
import { DownloadCloud, RefreshCw, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function UpdateManager() {
  const [status, setStatus] = useState('idle'); // idle, checking, available, downloading, ready, error
  const [progress, setProgress] = useState(0);
  const [versionInfo, setVersionInfo] = useState({ current: 'v2.0.0', latest: 'Checking...' });

  useEffect(() => {
    if (!window.electron) return;
    
    // Listen for updater events
    const handleEvent = (event, data) => {
      if (data.type === 'update-available') {
        setStatus('available');
        setVersionInfo(prev => ({ ...prev, latest: data.info.version }));
        toast.success('Update available!');
      } else if (data.type === 'download-progress') {
        setStatus('downloading');
        setProgress(Math.round(data.progress));
      } else if (data.type === 'update-downloaded') {
        setStatus('ready');
        setProgress(100);
        toast.success('Update ready to install!');
      }
    };
    
    window.electron.onUpdaterEvent(handleEvent);
    return () => window.electron.offUpdaterEvent(handleEvent);
  }, []);

  const handleCheckUpdate = async () => {
    setStatus('checking');
    if (window.electron?.checkUpdate) {
      const res = await window.electron.checkUpdate();
      if (res.mock) {
        // Mocking for development environment
        setTimeout(() => {
          setStatus('available');
          setVersionInfo(prev => ({ ...prev, latest: 'v2.1.0' }));
          toast('Mock Update Available (Dev Mode)', { icon: '🛠️' });
        }, 1500);
      } else if (!res.success) {
        setStatus('error');
        toast.error(res.error || 'Failed to check for updates');
      }
    }
  };

  const handleDownload = async () => {
    setStatus('downloading');
    setProgress(0);
    if (window.electron?.downloadUpdate) {
      // If we are mocking
      if (versionInfo.latest === 'v2.1.0') {
        let p = 0;
        const int = setInterval(() => {
          p += 5;
          setProgress(p);
          if (p >= 100) {
            clearInterval(int);
            setStatus('ready');
            toast.success('Mock update ready!');
          }
        }, 200);
        return;
      }
      
      const res = await window.electron.downloadUpdate();
      if (!res.success) {
        setStatus('error');
        toast.error('Download failed');
      }
    }
  };

  const handleInstall = () => {
    if (window.electron?.installUpdate) {
      window.electron.installUpdate();
    } else {
      toast.success('Restarting app (mock)...');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-8 h-full flex flex-col relative text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#00f0ff] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      
      <div className="mb-8">
        <h1 className="font-orbitron text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#b026ff]">UPDATE CENTER</h1>
        <p className="text-gray-400 mt-2">Manage EmuBoost software updates and release notes.</p>
      </div>

      <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center flex-1 max-w-3xl mx-auto w-full relative overflow-hidden">
        
        {/* Big Icon */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-[#00f0ff] blur-2xl opacity-20 rounded-full" />
          <div className="h-24 w-24 bg-white/5 border border-white/10 rounded-full flex items-center justify-center relative z-10">
            {status === 'idle' || status === 'error' ? <DownloadCloud size={40} className="text-[#00f0ff]" /> :
             status === 'checking' || status === 'downloading' ? <RefreshCw size={40} className="text-[#00f0ff] animate-spin" /> :
             <CheckCircle2 size={40} className="text-[#00ff88]" />}
          </div>
        </div>

        {/* Status Text */}
        <h2 className="text-2xl font-rajdhani font-bold mb-2">
          {status === 'idle' && 'System is Up to Date (Assuming)'}
          {status === 'checking' && 'Checking for updates...'}
          {status === 'available' && 'New Update Available!'}
          {status === 'downloading' && 'Downloading Update...'}
          {status === 'ready' && 'Update Ready to Install!'}
          {status === 'error' && 'Failed to Check Updates'}
        </h2>
        
        <div className="flex space-x-8 mt-6 mb-10 text-center">
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Current Version</p>
            <p className="font-mono text-xl text-gray-300">{versionInfo.current}</p>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Latest Version</p>
            <p className={`font-mono text-xl ${status === 'available' ? 'text-[#00ff88]' : 'text-gray-300'}`}>{versionInfo.latest}</p>
          </div>
        </div>

        {/* Progress Bar */}
        {status === 'downloading' && (
          <div className="w-full max-w-md mb-8">
            <div className="flex justify-between text-xs text-[#00f0ff] mb-2 font-mono">
              <span>Downloading...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-[#00f0ff] transition-all duration-300 shadow-[0_0_10px_#00f0ff]" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-4">
          {(status === 'idle' || status === 'error') && (
            <button onClick={handleCheckUpdate} className="flex items-center space-x-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-rajdhani font-bold tracking-wider transition-all">
              <RefreshCw size={18} />
              <span>CHECK FOR UPDATES</span>
            </button>
          )}
          
          {status === 'available' && (
            <button onClick={handleDownload} className="flex items-center space-x-2 px-6 py-3 bg-[#00f0ff]/20 hover:bg-[#00f0ff]/30 text-[#00f0ff] border border-[#00f0ff]/50 rounded-xl font-rajdhani font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <ArrowDown size={18} />
              <span>DOWNLOAD NOW</span>
            </button>
          )}

          {status === 'ready' && (
            <button onClick={handleInstall} className="flex items-center space-x-2 px-6 py-3 bg-[#00ff88]/20 hover:bg-[#00ff88]/30 text-[#00ff88] border border-[#00ff88]/50 rounded-xl font-rajdhani font-bold tracking-wider transition-all shadow-[0_0_15px_rgba(0,255,136,0.2)]">
              <CheckCircle2 size={18} />
              <span>RESTART & INSTALL</span>
            </button>
          )}
        </div>

        {/* Release Notes Placeholder */}
        {status === 'available' && (
          <div className="mt-12 w-full max-w-md text-left bg-white/5 border border-white/10 p-5 rounded-xl">
            <h4 className="font-rajdhani font-bold text-[#00f0ff] mb-2">Release Notes ({versionInfo.latest})</h4>
            <ul className="list-disc pl-4 space-y-1 text-sm text-gray-400">
              <li>Improved Auto-Updater functionality</li>
              <li>Added Monetization and License architecture</li>
              <li>Fixed minor UI bugs in Dashboard</li>
              <li>Performance enhancements for background tasks</li>
            </ul>
          </div>
        )}

      </div>
    </motion.div>
  );
}
