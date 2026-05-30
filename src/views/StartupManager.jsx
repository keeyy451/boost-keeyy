import React, { useState } from 'react';
import { Shield, Power, Search, ChevronRight, Zap, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const MOCK_APPS = [
  { id: 1, name: 'Spotify', path: 'C:\\Users\\User\\AppData\\Roaming\\Spotify\\Spotify.exe', enabled: true, impact: 'Medium', impactColor: '#ffaa00' },
  { id: 2, name: 'Steam', path: 'C:\\Program Files (x86)\\Steam\\steam.exe', enabled: true, impact: 'High', impactColor: '#ff3060' },
  { id: 3, name: 'Discord', path: 'C:\\Users\\User\\AppData\\Local\\Discord\\Update.exe', enabled: true, impact: 'Medium', impactColor: '#ffaa00' },
  { id: 4, name: 'OneDrive', path: 'C:\\Windows\\System32\\OneDrive.exe', enabled: false, impact: 'High', impactColor: '#ff3060' },
  { id: 5, name: 'GeForce Experience', path: 'C:\\Program Files\\NVIDIA Corporation\\NVIDIA GeForce Experience.exe', enabled: true, impact: 'High', impactColor: '#ff3060' },
  { id: 6, name: 'Microsoft Teams', path: 'C:\\Users\\User\\AppData\\Local\\Microsoft\\Teams\\Update.exe', enabled: false, impact: 'High', impactColor: '#ff3060' },
  { id: 7, name: 'Realtek HD Audio Manager', path: 'C:\\Program Files\\Realtek\\Audio\\HDA\\RAVBg64.exe', enabled: true, impact: 'Low', impactColor: '#00ff88' },
];

export default function StartupManager() {
  const [apps, setApps] = useState(MOCK_APPS);
  const [search, setSearch] = useState('');

  const filtered = apps.filter(a => a.name.toLowerCase().includes(search.toLowerCase()));
  const enabledCount = apps.filter(a => a.enabled).length;

  const toggle = (id) => {
    setApps(prev => prev.map(a => {
      if (a.id !== id) return a;
      toast.success(`${a.name} ${a.enabled ? 'disabled' : 'enabled'} at startup`);
      return { ...a, enabled: !a.enabled };
    }));
  };

  const disableAll = () => {
    setApps(prev => prev.map(a => ({ ...a, enabled: false })));
    toast.success('All startup apps disabled');
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
            Startup <span className="neon-text-blue">Manager</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {enabledCount} of {apps.length} apps run at startup
          </p>
        </div>
        <button onClick={disableAll} className="btn-neon-purple px-4 py-2 rounded-xl text-sm font-rajdhani font-bold">
          ⚡ Disable All
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Impact', count: apps.filter(a => a.impact === 'High').length, color: '#ff3060' },
          { label: 'Medium Impact', count: apps.filter(a => a.impact === 'Medium').length, color: '#ffaa00' },
          { label: 'Low Impact', count: apps.filter(a => a.impact === 'Low').length, color: '#00ff88' },
        ].map(c => (
          <div key={c.label} className="glass rounded-xl p-4 text-center" style={{ borderLeft: `3px solid ${c.color}` }}>
            <p className="font-orbitron font-bold text-2xl" style={{ color: c.color }}>{c.count}</p>
            <p className="text-xs text-gray-500 mt-1 font-rajdhani">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search startup applications..."
              className="w-full bg-black/30 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
            />
          </div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.map(app => (
            <div key={app.id} className="flex items-center gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <Shield size={18} className="text-gray-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-rajdhani font-bold text-base">{app.name}</p>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full font-rajdhani"
                    style={{ color: app.impactColor, background: `${app.impactColor}15`, border: `1px solid ${app.impactColor}30` }}
                  >
                    {app.impact}
                  </span>
                </div>
                <p className="text-xs text-gray-600 truncate font-mono mt-0.5">{app.path}</p>
              </div>
              {/* Toggle switch */}
              <button
                onClick={() => toggle(app.id)}
                className="relative w-12 h-6 rounded-full transition-colors shrink-0"
                style={{ background: app.enabled ? 'rgba(0,240,255,0.3)' : 'rgba(255,255,255,0.08)' }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300"
                  style={{
                    left: app.enabled ? '26px' : '2px',
                    boxShadow: app.enabled ? '0 0 8px rgba(0,240,255,0.5)' : 'none'
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
