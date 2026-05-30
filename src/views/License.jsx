import React, { useState } from 'react';
import { Key, CheckCircle2, XCircle, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function License({ isPro, licenseKey, refreshLicense }) {
  const [inputKey, setInputKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!inputKey.trim()) return toast.error("Please enter a license key.");
    
    setLoading(true);
    if (window.electron?.activateLicense) {
      const res = await window.electron.activateLicense(inputKey);
      if (res.success) {
        toast.success(res.message);
        setInputKey('');
        if (refreshLicense) refreshLicense();
      } else {
        toast.error(res.message);
      }
    } else {
      // Mocking for browser dev
      if (inputKey.includes('PRO')) {
        toast.success("Mock Pro Activated!");
        if (refreshLicense) refreshLicense();
      } else {
        toast.error("Invalid mock key.");
      }
    }
    setLoading(false);
  };

  const handleDeactivate = async () => {
    if (window.electron?.deactivateLicense) {
      const res = await window.electron.deactivateLicense();
      if (res.success) {
        toast.success(res.message);
        if (refreshLicense) refreshLicense();
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="p-8 h-full flex flex-col relative text-white">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b026ff] rounded-full blur-[150px] opacity-10 pointer-events-none" />
      
      <div className="mb-8">
        <h1 className="font-orbitron text-3xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#b026ff] to-[#00f0ff]">LICENSE & PLAN</h1>
        <p className="text-gray-400 mt-2">Manage your EmuBoost subscription and unlock Pro features.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Status Card */}
        <div className="glass rounded-3xl p-8 relative overflow-hidden flex flex-col items-center text-center">
          {isPro ? (
            <>
              <div className="absolute inset-0 bg-[#00ff88] blur-3xl opacity-5 pointer-events-none" />
              <ShieldCheck size={80} className="text-[#00ff88] mb-4" />
              <h2 className="font-orbitron text-2xl font-bold text-[#00ff88] mb-2">PRO EDITION ACTIVATED</h2>
              <p className="text-gray-400 mb-6">All premium features are unlocked and ready to use.</p>
              
              <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 mb-6 w-full max-w-sm flex justify-between items-center">
                <span className="text-gray-500 text-sm">License Key</span>
                <span className="font-mono font-bold text-gray-200">{licenseKey || 'EMU-PRO-XXXX'}</span>
              </div>
              
              <button onClick={handleDeactivate} className="text-xs text-gray-500 hover:text-[#ff3060] transition-colors underline">
                Remove License / Deactivate
              </button>
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-white blur-3xl opacity-5 pointer-events-none" />
              <Lock size={80} className="text-gray-500 mb-4" />
              <h2 className="font-orbitron text-2xl font-bold text-gray-300 mb-2">FREE EDITION</h2>
              <p className="text-gray-400 mb-6">You are currently using the limited free version.</p>
              
              <div className="w-full max-w-sm">
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Key size={18} className="text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value.toUpperCase())}
                    placeholder="Enter License Key (e.g. EMU-PRO-1234)"
                    className="w-full bg-[#0f111a]/50 border border-white/10 focus:border-[#b026ff] rounded-xl py-3 pl-12 pr-4 text-white font-mono placeholder-gray-600 outline-none transition-colors"
                  />
                </div>
                <button
                  onClick={handleActivate}
                  disabled={loading}
                  className="w-full bg-[#b026ff]/20 hover:bg-[#b026ff]/40 border border-[#b026ff]/50 text-[#b026ff] font-rajdhani font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(176,38,255,0.2)]"
                >
                  {loading ? 'VERIFYING...' : 'ACTIVATE PRO'}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Feature Comparison */}
        <div className="glass rounded-3xl p-8 flex flex-col">
          <h3 className="font-rajdhani font-bold text-xl mb-6">Feature Comparison</h3>
          
          <div className="space-y-4 flex-1">
            <FeatureRow title="Dashboard Monitoring" free={true} pro={true} />
            <FeatureRow title="Hardware Information" free={true} pro={true} />
            <FeatureRow title="Process & Startup Manager" free={true} pro={true} />
            <FeatureRow title="Smart Optimize" free={false} pro={true} />
            <FeatureRow title="Turbo Boost (1-Click)" free={false} pro={true} />
            <FeatureRow title="Advanced Emulator Tweaks" free={false} pro={true} />
            <FeatureRow title="Auto Maintenance" free={false} pro={true} />
          </div>

          {!isPro && (
            <div className="mt-8 pt-6 border-t border-white/10 text-center">
              <p className="text-sm text-gray-400 mb-4">Need a license key?</p>
              <button onClick={() => window.open('https://example.com/buy', '_blank')} className="px-8 py-3 bg-[#00f0ff] hover:bg-[#00f0ff]/80 text-[#0f111a] rounded-xl font-rajdhani font-bold tracking-wider transition-all">
                PURCHASE PRO NOW
              </button>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}

function FeatureRow({ title, free, pro }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-300">{title}</span>
      <div className="flex space-x-6 w-24 justify-end">
        {free ? <CheckCircle2 size={18} className="text-[#00ff88]" /> : <XCircle size={18} className="text-gray-700" />}
        {pro ? <CheckCircle2 size={18} className="text-[#00ff88]" /> : <XCircle size={18} className="text-gray-700" />}
      </div>
    </div>
  );
}
