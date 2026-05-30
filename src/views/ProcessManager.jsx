import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const BLOCKED = ['System', 'Registry', 'smss.exe', 'csrss.exe', 'wininit.exe', 'winlogon.exe', 'lsass.exe', 'svchost.exe'];

const getMockProcs = () => [
  { pid: 4, name: 'System', cpu: 0.1, mem: 0.2 },
  { pid: 7104, name: 'LDPlayer.exe', cpu: 35.4, mem: 14.2 },
  { pid: 5432, name: 'HD-Player.exe', cpu: 28.1, mem: 22.6 },
  { pid: 3812, name: 'chrome.exe', cpu: 12.3, mem: 8.5 },
  { pid: 6220, name: 'discord.exe', cpu: 2.4, mem: 3.1 },
  { pid: 1104, name: 'explorer.exe', cpu: 1.2, mem: 1.8 },
  { pid: 2208, name: 'steam.exe', cpu: 0.8, mem: 5.2 },
  { pid: 8800, name: 'msedge.exe', cpu: 5.7, mem: 4.3 },
  { pid: 4512, name: 'notepad.exe', cpu: 0.0, mem: 0.2 },
  { pid: 5500, name: 'spotify.exe', cpu: 1.5, mem: 4.8 },
].map(p => ({ ...p, cpu: p.cpu + (Math.random() - 0.5) * 2 }));

const PRIORITY_OPTS = [
  { label: 'Realtime', value: 256, color: '#ff3060' },
  { label: 'High',     value: 128, color: '#ffaa00' },
  { label: 'Normal',   value: 32,  color: '#00ff88' },
  { label: 'Low',      value: 64,  color: '#64748b' },
];

export default function ProcessManager() {
  const [procs, setProcs] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('cpu');
  const [sortDir, setSortDir] = useState('desc');
  const [menuPid, setMenuPid] = useState(null);

  useEffect(() => {
    const load = async () => {
      if (window.electron?.getProcesses) {
        const list = await window.electron.getProcesses();
        setProcs(list);
      } else {
        setProcs(getMockProcs());
      }
    };
    load();
    const id = setInterval(load, 10000);
    return () => clearInterval(id);
  }, []);

  const sorted = useMemo(() => {
    let list = procs.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    list = [...list].sort((a, b) => {
      const diff = (a[sortBy] ?? 0) - (b[sortBy] ?? 0);
      return sortDir === 'desc' ? -diff : diff;
    });
    return list;
  }, [procs, search, sortBy, sortDir]);

  const toggleSort = (col) => {
    if (sortBy === col) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(col); setSortDir('desc'); }
  };

  const killProc = async (pid, name) => {
    if (BLOCKED.includes(name)) {
      toast.error(`Cannot kill protected process: ${name}`);
      return;
    }
    if (window.electron?.killProcess) {
      const res = await window.electron.killProcess(pid);
      if (res.success) {
        setProcs(p => p.filter(x => x.pid !== pid));
        toast.success(`Killed ${name}`);
      } else {
        toast.error(res.message || 'Failed to kill process');
      }
    } else {
      setProcs(p => p.filter(x => x.pid !== pid));
      toast.success(`Killed ${name} (mock)`);
    }
    setMenuPid(null);
  };

  const setPrio = async (pid, name, prio) => {
    if (window.electron?.setPriority) {
      await window.electron.setPriority(pid, prio.value);
    }
    toast.success(`${name} → ${prio.label} priority`);
    setMenuPid(null);
  };

  const SortIcon = ({ col }) => sortBy === col
    ? (sortDir === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)
    : null;

  const cpuColor = (v) => v > 50 ? '#ff3060' : v > 20 ? '#ffaa00' : '#00ff88';

  return (
    <div className="flex flex-col gap-5 pb-4 h-full">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
            Process <span className="neon-text-blue">Manager</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">{procs.length} active processes</p>
        </div>
        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search process..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-neon-blue/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden flex flex-col flex-1" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-rajdhani font-bold tracking-widest text-gray-500 uppercase border-b border-white/5">
          <div className="col-span-5">Process Name</div>
          <div className="col-span-2 text-center">PID</div>
          <button className="col-span-2 flex items-center justify-center gap-1 hover:text-white transition-colors" onClick={() => toggleSort('cpu')}>
            CPU % <SortIcon col="cpu" />
          </button>
          <button className="col-span-2 flex items-center justify-center gap-1 hover:text-white transition-colors" onClick={() => toggleSort('mem')}>
            MEM % <SortIcon col="mem" />
          </button>
          <div className="col-span-1 text-center">Actions</div>
        </div>

        {/* Table Body */}
        <div className="flex-1 overflow-y-auto">
          {sorted.map(p => {
            const isBlocked = BLOCKED.includes(p.name);
            return (
              <div
                key={p.pid}
                className="grid grid-cols-12 gap-2 px-4 py-2.5 text-sm border-b border-white/5 hover:bg-white/3 transition-colors relative items-center"
              >
                <div className="col-span-5 flex items-center gap-2">
                  {isBlocked && <AlertTriangle size={12} className="text-amber-500 shrink-0" />}
                  <span className={`font-medium truncate ${isBlocked ? 'text-gray-500' : 'text-white'}`}>{p.name}</span>
                </div>
                <div className="col-span-2 text-center text-gray-500 font-mono text-xs">{p.pid}</div>
                <div className="col-span-2 text-center font-orbitron font-bold text-sm" style={{ color: cpuColor(p.cpu) }}>
                  {(p.cpu ?? 0).toFixed(1)}
                </div>
                <div className="col-span-2 text-center text-gray-400 font-mono text-xs">
                  {(p.mem ?? 0).toFixed(1)}
                </div>
                <div className="col-span-1 flex justify-center">
                  <div className="relative">
                    <button
                      onClick={() => setMenuPid(menuPid === p.pid ? null : p.pid)}
                      className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-colors text-lg leading-none"
                    >
                      ⋮
                    </button>
                    {menuPid === p.pid && (
                      <div className="absolute right-0 top-8 z-50 glass rounded-xl p-1.5 min-w-[160px] shadow-xl border border-white/10">
                        {PRIORITY_OPTS.map(prio => (
                          <button
                            key={prio.label}
                            onClick={() => setPrio(p.pid, p.name, prio)}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/10 text-xs transition-colors"
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: prio.color }} />
                            Set {prio.label}
                          </button>
                        ))}
                        <div className="border-t border-white/10 mt-1 pt-1">
                          <button
                            onClick={() => killProc(p.pid, p.name)}
                            disabled={isBlocked}
                            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-red-500/20 text-xs text-red-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <X size={12} /> End Task
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
