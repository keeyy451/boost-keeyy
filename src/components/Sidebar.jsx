import React from 'react';
import {
  LayoutDashboard, Zap, Cpu, Activity, FlaskConical,
  Shield, Settings as SettingsIcon, Gauge, Circle,
  Download, RefreshCw, Key, Crown
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isPro, appVersion }) => {
  const navGroups = [
    {
      label: 'MONITORING',
      items: [
        { id: 'dashboard', label: 'Dashboard',    icon: <LayoutDashboard size={18} /> },
        { id: 'hardware',  label: 'Hardware',     icon: <Gauge size={18} /> },
        { id: 'processes', label: 'Processes',    icon: <Activity size={18} /> },
      ]
    },
    {
      label: 'TOOLS',
      items: [
        { id: 'optimizer', label: 'Optimizer',    icon: <Zap size={18} />,           pro: true },
        { id: 'benchmark', label: 'Benchmark',    icon: <FlaskConical size={18} /> },
        { id: 'startup',   label: 'Startup Apps', icon: <Shield size={18} /> },
        { id: 'downloads', label: 'Downloads',    icon: <Download size={18} /> },
      ]
    },
    {
      label: 'SYSTEM',
      items: [
        { id: 'updates',   label: 'Updates',      icon: <RefreshCw size={18} /> },
        { id: 'license',   label: 'License',      icon: <Key size={18} /> },
        { id: 'settings',  label: 'Settings',     icon: <SettingsIcon size={18} /> },
      ]
    }
  ];

  return (
    <div
      className="glass w-60 h-full flex flex-col z-20 shrink-0"
      style={{ borderRight: '1px solid rgba(0, 240, 255, 0.07)' }}
    >
      {/* Draggable Title Bar area */}
      <div className="h-9 shrink-0" style={{ WebkitAppRegion: 'drag' }} />

      {/* Logo */}
      <div className="px-4 pb-5 flex flex-col items-center border-b border-white/5">
        <div className="relative mb-3">
          <img
            src="/logo.jpeg"
            alt="EmuBoost"
            className="w-20 h-20 rounded-2xl object-contain"
            style={{ boxShadow: '0 0 30px rgba(0,240,255,0.2), 0 0 60px rgba(0,240,255,0.05)' }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          {/* Fallback icon if no logo */}
          <div
            className="w-20 h-20 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 items-center justify-center hidden"
            style={{ boxShadow: '0 0 30px rgba(0,240,255,0.2)' }}
          >
            <Zap size={32} className="text-neon-blue" />
          </div>
        </div>
        <h1 className="font-orbitron font-bold text-lg tracking-widest neon-text-blue">
          EMUBOOST
        </h1>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[10px] text-gray-500 font-rajdhani tracking-wider">
            v{appVersion || '2.0.0'}
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded-full font-rajdhani font-bold tracking-wider"
            style={{
              background: isPro ? 'rgba(0,255,136,0.15)' : 'rgba(255,255,255,0.08)',
              color: isPro ? '#00ff88' : '#64748b',
              border: `1px solid ${isPro ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.1)'}`
            }}
          >
            {isPro ? '✦ PRO' : 'FREE'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] font-bold tracking-widest text-gray-600 px-2 mb-2">
              {group.label}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`nav-item w-full text-left ${activeTab === item.id ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.pro && !isPro && (
                    <Crown size={12} className="ml-auto text-[#ffaa00] opacity-60" />
                  )}
                  {activeTab === item.id && (
                    <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-neon-blue glow-blue ${item.pro && !isPro ? 'ml-1' : ''}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Status */}
      <div className="px-4 pb-4 border-t border-white/5 pt-4">
        <div
          className="rounded-xl p-3"
          style={{
            background: 'rgba(0, 255, 136, 0.05)',
            border: '1px solid rgba(0, 255, 136, 0.15)'
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <Circle size={8} className="text-neon-green fill-neon-green animate-pulse" />
            <span className="text-xs font-rajdhani font-bold text-neon-green tracking-wider">
              SYSTEM ONLINE
            </span>
          </div>
          <p className="text-[11px] text-gray-500 pl-4">All services active</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
