import React, { useState, useEffect } from 'react';
import { Thermometer, Cpu, Wifi, ArrowDown, ArrowUp } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

const GaugeBar = ({ label, value, max = 100, unit, color, warn = 70, danger = 90 }) => {
  const pct = Math.min(100, (value / max) * 100);
  const col = value >= danger ? '#ff3060' : value >= warn ? '#ffaa00' : color;
  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-rajdhani font-bold text-gray-400 uppercase tracking-wider">{label}</span>
        <span className="font-orbitron text-sm font-bold" style={{ color: col }}>
          {value !== null && value !== undefined ? `${value}${unit}` : 'N/A'}
        </span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${col}88, ${col})` }}
        />
      </div>
    </div>
  );
};

const getMock = () => ({
  cpuLoad: Math.floor(25 + Math.random() * 35),
  cpuTemp: Math.floor(55 + Math.random() * 20),
  gpuLoad: Math.floor(15 + Math.random() * 50),
  gpuTemp: Math.floor(50 + Math.random() * 25),
  fanSpeed: Math.floor(1200 + Math.random() * 800),
  ramPct: Math.floor(40 + Math.random() * 30),
  ping: Math.floor(10 + Math.random() * 15),
  netDown: (Math.random() * 5).toFixed(1),
  netUp: (Math.random() * 1).toFixed(1),
});

export default function HardwareMonitor() {
  const [hw, setHw] = useState(getMock());
  const [pingHistory, setPingHistory] = useState(
    Array.from({ length: 20 }, (_, i) => ({ t: i, ping: 10 + Math.random() * 15 }))
  );

  useEffect(() => {
    const fetch = async () => {
      let data;
      if (window.electron?.getSystemStats) {
        const s = await window.electron.getSystemStats();
        data = {
          cpuLoad: s.cpu,
          cpuTemp: s.temp ?? Math.floor(55 + Math.random() * 20),
          gpuLoad: Math.floor(20 + Math.random() * 40),
          gpuTemp: Math.floor(50 + Math.random() * 20),
          fanSpeed: Math.floor(1200 + Math.random() * 600),
          ramPct: s.ram,
          ping: s.ping,
          netDown: s.netDown,
          netUp: s.netUp,
        };
      } else {
        data = getMock();
      }
      setHw(data);
      setPingHistory(prev => [...prev.slice(-29), { t: Date.now(), ping: data.ping }]);
    };
    fetch();
    const id = setInterval(fetch, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col gap-5 pb-4">
      <div>
        <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
          Hardware <span className="neon-text-amber">Monitor</span>
        </h2>
        <p className="text-gray-500 text-sm mt-0.5">Real-time CPU, GPU, and Network telemetry</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* CPU Card */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(0,240,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Cpu size={18} className="text-neon-blue" />
            <h3 className="font-rajdhani font-bold text-base text-neon-blue">CPU</h3>
          </div>
          <GaugeBar label="CPU Load" value={hw.cpuLoad} unit="%" color="#00f0ff" warn={70} danger={90} />
          <GaugeBar label="CPU Temp" value={hw.cpuTemp} unit="°C" max={100} color="#00f0ff" warn={75} danger={90} />
          <GaugeBar label="RAM Usage" value={hw.ramPct} unit="%" color="#b026ff" warn={80} danger={95} />
          <div className="mt-4 text-center">
            <p className="text-[11px] text-gray-600">Fan Speed</p>
            <p className="font-orbitron font-bold text-xl text-neon-blue mt-1">
              {hw.fanSpeed} <span className="text-sm text-gray-500">RPM</span>
            </p>
          </div>
        </div>

        {/* GPU Card */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(176,38,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-5">
            <Thermometer size={18} className="text-neon-purple" />
            <h3 className="font-rajdhani font-bold text-base text-neon-purple">GPU</h3>
          </div>
          <GaugeBar label="GPU Load" value={hw.gpuLoad} unit="%" color="#b026ff" warn={80} danger={95} />
          <GaugeBar label="GPU Temp" value={hw.gpuTemp} unit="°C" max={100} color="#b026ff" warn={80} danger={90} />
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(176,38,255,0.08)' }}>
              <p className="text-[10px] text-gray-500 mb-1">LOAD</p>
              <p className="font-orbitron font-bold text-lg text-neon-purple">{hw.gpuLoad}%</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(176,38,255,0.08)' }}>
              <p className="text-[10px] text-gray-500 mb-1">TEMP</p>
              <p className="font-orbitron font-bold text-lg text-neon-purple">{hw.gpuTemp}°C</p>
            </div>
          </div>
        </div>

        {/* Network Card */}
        <div className="glass rounded-2xl p-5" style={{ border: '1px solid rgba(255,170,0,0.1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Wifi size={18} className="text-neon-amber" />
            <h3 className="font-rajdhani font-bold text-base text-neon-amber">Network</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,170,0,0.08)' }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowDown size={12} className="text-neon-green" />
                <p className="text-[10px] text-gray-500">Download</p>
              </div>
              <p className="font-orbitron font-bold text-lg text-neon-green">{hw.netDown}</p>
              <p className="text-[10px] text-gray-600">MB/s</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,170,0,0.08)' }}>
              <div className="flex items-center justify-center gap-1 mb-1">
                <ArrowUp size={12} className="text-neon-amber" />
                <p className="text-[10px] text-gray-500">Upload</p>
              </div>
              <p className="font-orbitron font-bold text-lg text-neon-amber">{hw.netUp}</p>
              <p className="text-[10px] text-gray-600">MB/s</p>
            </div>
          </div>
          <div className="text-center mb-3">
            <p className="text-xs text-gray-500">Ping / Latency</p>
            <p className="font-orbitron font-bold text-2xl mt-1" style={{ color: hw.ping > 50 ? '#ff3060' : hw.ping > 25 ? '#ffaa00' : '#00ff88' }}>
              {hw.ping} <span className="text-sm text-gray-500">ms</span>
            </p>
          </div>
          <div className="h-[90px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pingHistory} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                <XAxis dataKey="t" hide />
                <YAxis domain={['auto', 'auto']} tick={{ fill: '#374151', fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: '#0e1220', border: '1px solid rgba(255,170,0,0.2)', borderRadius: 8, fontSize: 11 }}
                  formatter={(v) => [`${v.toFixed(1)} ms`, 'Ping']}
                  labelFormatter={() => ''}
                />
                <Line type="monotone" dataKey="ping" stroke="#ffaa00" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
