import React, { useState } from 'react';
import { Save, RefreshCw, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const PROFILES = [
  { id: 'gaming',   label: 'Gaming',   color: '#00f0ff', desc: 'Max performance, disable background tasks' },
  { id: 'emulator', label: 'Emulator', color: '#b026ff', desc: 'Prioritize emulator processes & memory' },
  { id: 'fps',      label: 'FPS Boost', color: '#00ff88', desc: 'Maximum frames per second, low input lag' },
  { id: 'custom',   label: 'Custom',   color: '#ffaa00', desc: 'User-defined optimization preferences' },
];

const Toggle = ({ value, onChange, color = '#00f0ff' }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative w-12 h-6 rounded-full transition-colors shrink-0"
    style={{ background: value ? `${color}40` : 'rgba(255,255,255,0.08)' }}
  >
    <div
      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
      style={{ left: value ? '26px' : '2px', boxShadow: value ? `0 0 8px ${color}80` : 'none' }}
    />
  </button>
);

export default function Settings({ isPro }) {
  const [profile, setProfile] = useState('emulator');
  const [autoOptimize, setAutoOptimize] = useState(false);
  const [startWithWindows, setStartWithWindows] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [autoMaintenance, setAutoMaintenance] = useState(false);
  const [schedule, setSchedule] = useState('daily');

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
          System <span className="neon-text-purple">Settings</span>
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">Configure EmuBoost Pro preferences</p>
      </div>

      {/* Profile Selector */}
      <div className="glass rounded-2xl p-5">
        <h3 className="font-rajdhani font-bold text-base mb-4 text-gray-300 uppercase tracking-widest text-sm">
          Optimization Profile
        </h3>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {PROFILES.map(p => (
            <button
              key={p.id}
              onClick={() => { setProfile(p.id); toast.success(`Profile changed to ${p.label}`); }}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                border: `1px solid ${profile === p.id ? p.color : 'rgba(255,255,255,0.06)'}`,
                background: profile === p.id ? `${p.color}0f` : 'rgba(255,255,255,0.02)',
                boxShadow: profile === p.id ? `0 0 20px ${p.color}20` : 'none'
              }}
            >
              <p className="font-rajdhani font-bold" style={{ color: profile === p.id ? p.color : '#e2e8f0' }}>{p.label}</p>
              <p className="text-[11px] text-gray-500 mt-1 leading-tight">{p.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Behavior */}
      <div className="glass rounded-2xl p-5 max-w-2xl">
        <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-widest mb-4">Behavior</h3>
        <div className="space-y-5">
          {[
            {
              label: 'Auto-Optimize on Start',
              desc: 'Automatically flush RAM when EmuBoost launches',
              value: autoOptimize,
              set: setAutoOptimize,
              color: '#00f0ff'
            },
            {
              label: 'Launch with Windows',
              desc: 'Start EmuBoost automatically when Windows boots',
              value: startWithWindows,
              set: setStartWithWindows,
              color: '#b026ff'
            },
            {
              label: 'Performance Notifications',
              desc: 'Show alerts when CPU/RAM usage is critically high',
              value: notifications,
              set: setNotifications,
              color: '#00ff88'
            },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0">
              <div>
                <p className="font-rajdhani font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <Toggle value={item.value} onChange={item.set} color={item.color} />
            </div>
          ))}
        </div>
      </div>

      {/* Auto Maintenance */}
      <div className="glass rounded-2xl p-5 max-w-2xl relative overflow-hidden" style={{ opacity: isPro ? 1 : 0.6 }}>
        {!isPro && (
          <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold z-10"
            style={{ background: 'rgba(255,170,0,0.15)', color: '#ffaa00', border: '1px solid rgba(255,170,0,0.3)' }}>
            PRO
          </div>
        )}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-widest">Auto Maintenance</h3>
          <Toggle 
            value={autoMaintenance} 
            onChange={(val) => {
              if (!isPro) {
                toast('🔒 Fitur PRO — Buka halaman License untuk mengaktifkan.', { icon: '👑' });
                return;
              }
              setAutoMaintenance(val);
            }} 
            color="#ffaa00" 
          />
        </div>
        {(autoMaintenance || !isPro) && (
          <div className="flex gap-3" style={{ pointerEvents: isPro ? 'auto' : 'none' }}>
            {['daily', 'weekly', 'monthly'].map(s => (
              <button
                key={s}
                onClick={() => setSchedule(s)}
                className="flex-1 py-2 rounded-xl text-sm font-rajdhani font-bold capitalize transition-all"
                style={{
                  border: `1px solid ${schedule === s ? '#ffaa00' : 'rgba(255,255,255,0.08)'}`,
                  background: schedule === s ? 'rgba(255,170,0,0.1)' : 'transparent',
                  color: schedule === s ? '#ffaa00' : '#64748b'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-600 mt-3 flex items-center gap-1">
          <Info size={11} /> Auto-clean temp files and optimize on the selected schedule
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 max-w-2xl">
        <button onClick={handleSave} className="btn-neon-blue flex items-center gap-2 px-6 py-3 rounded-xl font-rajdhani font-bold">
          <Save size={16} /> Save Settings
        </button>
        <button
          onClick={() => toast('Checking for updates...', { icon: '🔄' })}
          className="glass flex items-center gap-2 px-6 py-3 rounded-xl font-rajdhani font-bold text-gray-300 hover:text-white transition-colors border border-white/10"
        >
          <RefreshCw size={16} /> Check for Updates
        </button>
      </div>
    </div>
  );
}
