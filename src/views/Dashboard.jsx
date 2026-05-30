import React, { useState, useEffect, useCallback } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Cpu, MemoryStick, HardDrive, Wifi, Thermometer, Shield, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const COLORS = {
  cpu:     { main: '#00f0ff', bg: 'rgba(0, 240, 255, 0.1)', border: '#00f0ff33' },
  ram:     { main: '#b026ff', bg: 'rgba(176, 38, 255, 0.1)', border: '#b026ff33' },
  storage: { main: '#00ff88', bg: 'rgba(0, 255, 136, 0.1)', border: '#00ff8833' },
  ping:    { main: '#ffaa00', bg: 'rgba(255, 170, 0, 0.1)', border: '#ffaa0033' },
};

const MetricCard = ({ title, value, unit, icon, colorKey, desc }) => {
  const color = COLORS[colorKey];
  const pct = unit === '%' ? value : Math.min(100, value / 2);

  return (
    <div
      className="stat-card glass"
      style={{ borderLeft: `3px solid ${color.main}`, borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Top Row */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-rajdhani font-bold tracking-widest text-gray-500 uppercase">{title}</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-orbitron font-bold" style={{ color: color.main }}>
              {value ?? '—'}
            </span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        <div className="p-2 rounded-xl" style={{ background: color.bg }}>
          <span style={{ color: color.main }}>{icon}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color.main}88, ${color.main})`
          }}
        />
      </div>
      <p className="text-[11px] text-gray-600 mt-2">{desc}</p>
    </div>
  );
};

const HealthRing = ({ score }) => {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score > 70 ? '#00ff88' : score > 40 ? '#ffaa00' : '#ff3060';
  const label = score > 70 ? 'Good' : score > 40 ? 'Fair' : 'Poor';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="130" height="130" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
          style={{
            transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease',
            filter: `drop-shadow(0 0 6px ${color})`
          }}
        />
        <text x="60" y="55" textAnchor="middle" fill={color} fontSize="22" fontWeight="bold" fontFamily="Orbitron">
          {score}
        </text>
        <text x="60" y="72" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Rajdhani">
          HEALTH
        </text>
      </svg>
      <span className="font-rajdhani font-bold text-sm tracking-wider" style={{ color }}>
        {label}
      </span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-3 py-2 text-xs">
        <p className="text-gray-400 mb-1">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
            <span style={{ color: p.color }}>{p.name}: {p.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const getMockStats = () => ({
  cpu: Math.floor(30 + Math.random() * 40),
  ram: Math.floor(40 + Math.random() * 30),
  storage: 52,
  ping: Math.floor(10 + Math.random() * 15),
  temp: Math.floor(55 + Math.random() * 15),
  health: Math.floor(65 + Math.random() * 25),
  netDown: (Math.random() * 5).toFixed(1),
  netUp: (Math.random() * 2).toFixed(1),
  gpu: 'NVIDIA RTX',
  virtualization: true
});

export default function Dashboard() {
  const [stats, setStats] = useState(getMockStats());
  const [history, setHistory] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      time: `${i}s`, cpu: Math.floor(30 + Math.random() * 40), ram: Math.floor(40 + Math.random() * 30)
    }))
  );
  const [gamingMode, setGamingMode] = useState(false);
  const [lastOptimized, setLastOptimized] = useState('Never');

  const fetchStats = useCallback(async () => {
    let data;
    if (window.electron?.getSystemStats) {
      data = await window.electron.getSystemStats();
    } else {
      data = getMockStats();
    }
    setStats(data);
    setHistory(prev => {
      const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const next = [...prev.slice(-29), { time: now, cpu: data.cpu, ram: data.ram }];
      return next;
    });
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 5000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const handleQuickOptimize = async () => {
    toast.loading('Running quick optimization...', { id: 'opt' });
    if (window.electron?.optimizeSystem) {
      const res = await window.electron.optimizeSystem();
      toast.success(res.details || 'Optimization complete!', { id: 'opt' });
    } else {
      await new Promise(r => setTimeout(r, 1200));
      toast.success('Cleared 430MB from Standby RAM', { id: 'opt' });
    }
    setLastOptimized(new Date().toLocaleTimeString());
  };

  const handleGamingMode = async () => {
    const next = !gamingMode;
    if (window.electron?.setGamingMode) {
      const res = await window.electron.setGamingMode(next);
      toast.success(res.message);
    } else {
      toast.success(next ? 'Gaming Mode ACTIVATED 🎮' : 'Gaming Mode deactivated');
    }
    setGamingMode(next);
  };

  return (
    <div className="flex flex-col gap-5 pb-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
            System <span className="neon-text-blue">Dashboard</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Real-time performance monitoring</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleQuickOptimize} className="btn-neon-blue px-4 py-2 rounded-xl text-sm font-rajdhani font-bold tracking-wide">
            ⚡ Quick Optimize
          </button>
          <button
            onClick={handleGamingMode}
            className={gamingMode ? 'btn-neon-green px-4 py-2 rounded-xl text-sm font-rajdhani font-bold tracking-wide' : 'btn-neon-purple px-4 py-2 rounded-xl text-sm font-rajdhani font-bold tracking-wide'}
          >
            🎮 {gamingMode ? 'Gaming ON' : 'Gaming OFF'}
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard title="CPU Load" value={stats.cpu} unit="%" icon={<Cpu size={20} />} colorKey="cpu" desc={`Temp: ${stats.temp ?? 'N/A'}°C`} />
        <MetricCard title="RAM Usage" value={stats.ram} unit="%" icon={<MemoryStick size={20} />} colorKey="ram" desc="Active memory" />
        <MetricCard title="Disk Usage" value={stats.storage} unit="%" icon={<HardDrive size={20} />} colorKey="storage" desc="C: drive" />
        <MetricCard title="Latency" value={stats.ping} unit="ms" icon={<Wifi size={20} />} colorKey="ping" desc={`↓ ${stats.netDown} MB/s  ↑ ${stats.netUp} MB/s`} />
      </div>

      {/* Chart + Health + Status */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Live Chart */}
        <div className="xl:col-span-2 glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-rajdhani font-bold text-lg">
              <Activity className="inline mr-2 text-neon-blue" size={18} />
              Performance Graph
            </h3>
            <div className="flex gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-blue inline-block rounded" /> CPU</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-neon-purple inline-block rounded" /> RAM</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={history} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
              <defs>
                <linearGradient id="cpuGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00f0ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="ramGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b026ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#b026ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fill: '#374151', fontSize: 10 }} interval="preserveStartEnd" />
              <YAxis domain={[0, 100]} tick={{ fill: '#374151', fontSize: 10 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="cpu" stroke="#00f0ff" fill="url(#cpuGrad)" strokeWidth={2} name="CPU" dot={false} />
              <Area type="monotone" dataKey="ram" stroke="#b026ff" fill="url(#ramGrad)" strokeWidth={2} name="RAM" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Health + Quick Status */}
        <div className="flex flex-col gap-4">
          <div className="glass rounded-2xl p-5 flex flex-col items-center justify-center flex-1">
            <h3 className="font-rajdhani font-bold text-base mb-3 self-start">
              <Shield className="inline mr-2 text-neon-green" size={16} />
              System Health
            </h3>
            <HealthRing score={stats.health ?? 75} />
          </div>

          <div className="glass rounded-2xl p-4">
            <h3 className="font-rajdhani font-bold text-sm text-gray-400 uppercase tracking-wider mb-3">Quick Status</h3>
            <div className="space-y-2.5 text-sm">
              {[
                { label: 'Virtualization (VT-x)', value: stats.virtualization ? 'Enabled' : 'Disabled', color: stats.virtualization ? '#00ff88' : '#ff3060' },
                { label: 'Gaming Mode', value: gamingMode ? 'Active' : 'Inactive', color: gamingMode ? '#00ff88' : '#64748b' },
                { label: 'CPU Temp', value: `${stats.temp ?? 'N/A'}°C`, color: (stats.temp ?? 0) > 80 ? '#ff3060' : '#00ff88' },
                { label: 'GPU', value: stats.gpu ?? 'Detecting...', color: '#b026ff' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center pb-2 border-b border-white/5 last:border-0">
                  <span className="text-gray-500 text-xs">{row.label}</span>
                  <span className="font-rajdhani font-semibold text-xs" style={{ color: row.color }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
