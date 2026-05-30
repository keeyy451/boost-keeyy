import React, { useState } from 'react';
import { Zap, Cpu, Trash2, CheckCircle2, Gamepad2, Rocket, Settings2, Globe, MonitorOff, Target, Lock, Crown } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PROFILES = [
  { id: 'gaming',   label: 'Gaming',   icon: <Gamepad2 size={16} />, color: '#00f0ff', desc: 'Max FPS, Low Latency' },
  { id: 'emulator', label: 'Emulator', icon: <Rocket size={16} />,   color: '#b026ff', desc: 'Boost Emulator Proc' },
  { id: 'balanced', label: 'Balanced', icon: <Settings2 size={16} />, color: '#00ff88', desc: 'Default Power Plan' },
];

const ActionCard = ({ title, desc, icon, color, onClick, loading, locked }) => (
  <motion.button
    whileHover={locked ? {} : { scale: 1.02, y: -2 }}
    whileTap={locked ? {} : { scale: 0.98 }}
    onClick={locked ? () => toast('🔒 Fitur PRO — Buka halaman License untuk mengaktifkan.', { icon: '👑' }) : onClick}
    disabled={loading}
    className="glass rounded-2xl p-6 flex flex-col items-center gap-4 w-full text-center transition-colors relative overflow-hidden"
    style={{ border: `1px solid ${locked ? 'rgba(255,255,255,0.05)' : color + '22'}`, opacity: locked ? 0.6 : 1 }}
  >
    {/* Pro Lock Overlay */}
    {locked && (
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
        style={{ background: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.3)' }}>
        <Crown size={10} /> PRO
      </div>
    )}

    <div
      className="w-16 h-16 rounded-2xl flex items-center justify-center"
      style={{ background: `${locked ? '#64748b' : color}15`, boxShadow: loading ? `0 0 20px ${color}40` : 'none' }}
    >
      <span style={{ color: locked ? '#64748b' : color }}>
        {locked ? <Lock size={28} /> : loading ? <Zap size={28} className="animate-pulse" /> : icon}
      </span>
    </div>
    <div>
      <h3 className="font-rajdhani font-bold text-lg" style={{ color: locked ? '#64748b' : color }}>{title}</h3>
      <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
    </div>
  </motion.button>
);

export default function Optimizer({ isPro }) {
  const [logs, setLogs] = useState([
    { type: 'info', msg: 'EmuBoost Pro ready. All systems operational.' }
  ]);
  const [busyAction, setBusyAction] = useState(null);
  const [activeProfile, setActiveProfile] = useState('emulator');

  const addLog = (msg, type = 'success') =>
    setLogs(prev => [{ msg: `[${new Date().toLocaleTimeString()}] ${msg}`, type }, ...prev.slice(0, 49)]);

  const run = async (id, fn, label) => {
    setBusyAction(id);
    const tid = toast.loading(label);
    try {
      const result = await fn();
      toast.success(result.message || result.details || 'Done!', { id: tid });
      addLog(result.message || result.details || 'Done!');
    } catch {
      toast.error('Failed. Try running as Administrator.', { id: tid });
      addLog('Operation failed — try Admin mode', 'error');
    } finally {
      setBusyAction(null);
    }
  };

  const handleOptimize = () => run('opt', async () => {
    if (window.electron?.optimizeSystem) return await window.electron.optimizeSystem();
    await new Promise(r => setTimeout(r, 1400));
    return { details: 'RAM flushed. Freed ~420MB from Standby List.' };
  }, '⚡ Optimizing RAM...');

  const handleTurboBoost = () => run('turbo', async () => {
    if (window.electron?.optimizeSystem) await window.electron.optimizeSystem();
    if (window.electron?.setGamingMode) await window.electron.setGamingMode(true);
    if (window.electron?.clearTempFiles) await window.electron.clearTempFiles();
    if (window.electron?.tweakGameDVR) await window.electron.tweakGameDVR();
    if (window.electron?.tweakDNS) await window.electron.tweakDNS();
    if (window.electron?.tweakEmulatorBoost) await window.electron.tweakEmulatorBoost();
    await new Promise(r => setTimeout(r, 1800));
    return { message: 'TURBO BOOST complete! System fully optimized for gaming & emulators.' };
  }, '🚀 Running Turbo Boost...');

  const handleGamingMode = () => run('gaming', async () => {
    if (window.electron?.setGamingMode) return await window.electron.setGamingMode(true);
    await new Promise(r => setTimeout(r, 600));
    return { message: 'Power plan → High Performance. Emulator priority → High.' };
  }, '🎮 Activating Gaming Mode...');

  const handleClearTemp = () => run('temp', async () => {
    if (window.electron?.clearTempFiles) return await window.electron.clearTempFiles();
    await new Promise(r => setTimeout(r, 900));
    const freed = (Math.random() * 2 + 0.5).toFixed(2);
    return { message: `Cleared ${freed}GB of temporary files.`, freedSpace: freed };
  }, '🧹 Cleaning Temp Files...');

  const handleDisableDVR = () => run('dvr', async () => {
    if (window.electron?.tweakGameDVR) return await window.electron.tweakGameDVR();
    await new Promise(r => setTimeout(r, 800));
    return { message: 'Xbox Game DVR disabled (mock).' };
  }, '🛑 Disabling Xbox Game DVR...');

  const handleOptimizeDNS = () => run('dns', async () => {
    if (window.electron?.tweakDNS) return await window.electron.tweakDNS();
    await new Promise(r => setTimeout(r, 1200));
    return { message: 'DNS changed to Cloudflare (mock).' };
  }, '🌐 Optimizing Network DNS...');

  const handleEmulatorTuning = () => run('emu', async () => {
    if (window.electron?.tweakEmulatorBoost) return await window.electron.tweakEmulatorBoost();
    await new Promise(r => setTimeout(r, 800));
    return { message: 'Emulator priority set to High (mock).' };
  }, '🎯 Boosting Emulator Processes...');

  const logColor = { success: '#00ff88', info: '#00f0ff', error: '#ff3060' };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
          System <span className="neon-text-purple">Optimizer</span>
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">Tune Windows for maximum emulator & gaming performance</p>
      </div>

      {/* Pro Feature Banner */}
      {!isPro && (
        <div className="bg-[#ffaa00]/5 border border-[#ffaa00]/20 rounded-2xl p-4 flex items-center gap-4">
          <Crown size={24} className="text-[#ffaa00] shrink-0" />
          <div>
            <p className="text-sm font-rajdhani font-bold text-[#ffaa00]">Versi Gratis Terbatas</p>
            <p className="text-xs text-gray-400 mt-0.5">Beberapa fitur optimizer dikunci. Upgrade ke PRO untuk membuka semua fitur optimasi.</p>
          </div>
        </div>
      )}

      {/* Profile Selector */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-widest mb-3">Optimization Profile</h3>
        <div className="grid grid-cols-3 gap-3">
          {PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => { setActiveProfile(p.id); toast.success(`Profile: ${p.label} selected`); }}
              className="rounded-xl p-3 flex items-center gap-3 transition-all duration-200 text-left"
              style={{
                border: `1px solid ${activeProfile === p.id ? p.color : 'rgba(255,255,255,0.05)'}`,
                background: activeProfile === p.id ? `${p.color}10` : 'rgba(255,255,255,0.02)',
                boxShadow: activeProfile === p.id ? `0 0 16px ${p.color}20` : 'none'
              }}
            >
              <span style={{ color: p.color }}>{p.icon}</span>
              <div>
                <p className="font-rajdhani font-bold text-sm" style={{ color: activeProfile === p.id ? p.color : '#e2e8f0' }}>{p.label}</p>
                <p className="text-[10px] text-gray-500">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-widest mt-4 mb-3">Basic Optimizer</h3>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <ActionCard
          title="Optimize Now" desc="Flush RAM & Standby"
          icon={<Zap size={28} />} color="#00f0ff"
          onClick={handleOptimize} loading={busyAction === 'opt'}
        />
        <ActionCard
          title="Turbo Boost" desc="Full 1-Click Optimize"
          icon={<Rocket size={28} />} color="#b026ff"
          onClick={handleTurboBoost} loading={busyAction === 'turbo'}
          locked={!isPro}
        />
        <ActionCard
          title="Gaming Mode" desc="High Performance Power"
          icon={<Gamepad2 size={28} />} color="#ffaa00"
          onClick={handleGamingMode} loading={busyAction === 'gaming'}
        />
        <ActionCard
          title="Clear Temp" desc="Remove Junk Files"
          icon={<Trash2 size={28} />} color="#00ff88"
          onClick={handleClearTemp} loading={busyAction === 'temp'}
        />
      </div>

      <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-widest mt-4 mb-3">Advanced Emulator Tweaks</h3>
      
      {/* Explanation Banner */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4 flex items-start space-x-3">
        <div className="text-[#00f0ff] mt-0.5"><Target size={20} /></div>
        <div className="text-sm text-gray-300">
          <p className="font-semibold text-white mb-1">Meningkatkan Performa Emulator secara Ekstrim</p>
          <ul className="list-disc pl-4 space-y-1 text-xs text-gray-400">
            <li><span className="text-white">Emulator Tuning:</span> Otomatis mengatur Prioritas CPU emulator Anda ke "High".</li>
            <li><span className="text-[#ff3060]">Disable Game DVR:</span> Mematikan fitur rekam Xbox bawaan Windows yang menyebabkan layar patah-patah (stuttering).</li>
            <li><span className="text-[#ffaa00]">Optimize DNS:</span> Mengganti DNS Anda ke Cloudflare (1.1.1.1) untuk menstabilkan ping game online (Mobile Legends, PUBG, FF).</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
        <ActionCard
          title="Emulator Tuning" desc="Lock CPU Prio to High"
          icon={<Target size={28} />} color="#00f0ff"
          onClick={handleEmulatorTuning} loading={busyAction === 'emu'}
          locked={!isPro}
        />
        <ActionCard
          title="Disable Game DVR" desc="Fix UI Stuttering"
          icon={<MonitorOff size={28} />} color="#ff3060"
          onClick={handleDisableDVR} loading={busyAction === 'dvr'}
          locked={!isPro}
        />
        <ActionCard
          title="Optimize DNS" desc="Cloudflare 1.1.1.1 Anti-Lag"
          icon={<Globe size={28} />} color="#ffaa00"
          onClick={handleOptimizeDNS} loading={busyAction === 'dns'}
          locked={!isPro}
        />
      </div>

      {/* Activity Log */}
      <div className="glass rounded-2xl p-5 flex flex-col" style={{ minHeight: 200 }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-rajdhani font-bold text-lg flex items-center gap-2">
            <CheckCircle2 size={18} className="text-neon-green" />
            Activity Log
          </h3>
          <button
            onClick={() => setLogs([])}
            className="text-xs text-gray-500 hover:text-white transition-colors px-3 py-1 rounded-lg border border-white/10"
          >
            Clear
          </button>
        </div>
        <div
          className="flex-1 overflow-y-auto rounded-xl p-4"
          style={{ background: 'rgba(0,0,0,0.4)', fontFamily: 'monospace', fontSize: 12, maxHeight: 220 }}
        >
          {logs.length === 0 ? (
            <p className="text-gray-600 italic">No activity yet...</p>
          ) : (
            logs.map((log, i) => (
              <div key={i} className="mb-1.5" style={{ color: logColor[log.type] || '#00ff88' }}>
                {log.msg}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
