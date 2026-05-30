import React, { useState } from 'react';
import { Download, ExternalLink, Star, Monitor, Smartphone, Globe, HardDrive, Users, ChevronRight, Shield, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const EMULATORS = [
  {
    id: 'ldplayer',
    name: 'LDPlayer 9',
    version: 'v9.0.75',
    size: '380 MB',
    downloads: '50M+',
    rating: 4.7,
    color: '#00f0ff',
    category: 'Android',
    icon: '🎮',
    description: 'Emulator Android terbaik untuk gaming dengan performa tinggi dan kompatibilitas luas.',
    features: ['Multi-Instance', 'Keyboard Mapping', 'High FPS Support', 'Low Resource Usage'],
    url: 'https://www.ldplayer.net/',
    github: null,
    recommended: true
  },
  {
    id: 'bluestacks',
    name: 'BlueStacks 5',
    version: 'v5.21.150',
    size: '510 MB',
    downloads: '100M+',
    rating: 4.5,
    color: '#4285F4',
    category: 'Android',
    icon: '💎',
    description: 'Emulator Android paling populer di dunia dengan fitur lengkap dan dukungan game terbaru.',
    features: ['Eco Mode', 'Multi-Instance', 'Macro Recorder', 'Translation'],
    url: 'https://www.bluestacks.com/',
    github: null,
    recommended: false
  },
  {
    id: 'memu',
    name: 'MEmu Play',
    version: 'v9.1.3',
    size: '440 MB',
    downloads: '30M+',
    rating: 4.4,
    color: '#b026ff',
    category: 'Android',
    icon: '🚀',
    description: 'Emulator Android ringan yang cocok untuk PC spesifikasi rendah.',
    features: ['GPS Simulation', 'Shared Folder', 'Key Mapping', 'Android 12'],
    url: 'https://www.memuplay.com/',
    github: null,
    recommended: false
  },
  {
    id: 'noxplayer',
    name: 'NoxPlayer',
    version: 'v7.0.5.9',
    size: '400 MB',
    downloads: '25M+',
    rating: 4.3,
    color: '#ffaa00',
    category: 'Android',
    icon: '⚡',
    description: 'Emulator dengan stabilitas tinggi, cocok untuk farming game dan multi-instance.',
    features: ['Multi-Drive', 'Root Access', 'Script Recording', 'Controller Support'],
    url: 'https://www.bignox.com/',
    github: null,
    recommended: false
  },
  {
    id: 'gameloop',
    name: 'GameLoop',
    version: 'v4.1.112',
    size: '420 MB',
    downloads: '40M+',
    rating: 4.6,
    color: '#00ff88',
    category: 'Android',
    icon: '🎯',
    description: 'Emulator resmi dari Tencent, dioptimalkan khusus untuk PUBG Mobile dan Call of Duty.',
    features: ['Tencent Official', 'Anti-Cheat Compatible', 'Smart Keymapping', 'GPU Optimization'],
    url: 'https://www.gameloop.com/',
    github: null,
    recommended: false
  },
  {
    id: 'msi-app-player',
    name: 'MSI App Player',
    version: 'v5.15',
    size: '490 MB',
    downloads: '5M+',
    rating: 4.2,
    color: '#ff3060',
    category: 'Android',
    icon: '🔥',
    description: 'Versi kustomisasi BlueStacks oleh MSI, dioptimalkan untuk hardware MSI.',
    features: ['MSI Optimized', 'Low Latency', 'Hardware Accel.', 'Overclocking Support'],
    url: 'https://www.msi.com/Landing/appplayer',
    github: null,
    recommended: false
  }
];

const StarRating = ({ rating, color }) => {
  const fullStars = Math.floor(rating);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < fullStars ? 'fill-current' : 'opacity-20'}
          style={{ color: i < fullStars ? color : '#64748b' }}
        />
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating}</span>
    </div>
  );
};

export default function DownloadCenter() {
  const [selectedEmu, setSelectedEmu] = useState(null);
  const [filter, setFilter] = useState('all');

  const handleDownload = (emu) => {
    window.open(emu.url, '_blank');
    toast.success(`Membuka halaman download ${emu.name}...`);
  };

  const filteredEmulators = filter === 'all' 
    ? EMULATORS 
    : EMULATORS.filter(e => e.category.toLowerCase() === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-5 pb-4"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-rajdhani font-bold text-3xl tracking-wide">
            Download <span className="neon-text-blue">Center</span>
          </h2>
          <p className="text-gray-500 text-sm mt-0.5">Download emulator Android terbaik untuk PC Anda</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {['all', 'android'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg font-rajdhani font-bold uppercase tracking-wider transition-all"
              style={{
                border: `1px solid ${filter === f ? '#00f0ff' : 'rgba(255,255,255,0.08)'}`,
                background: filter === f ? 'rgba(0,240,255,0.1)' : 'transparent',
                color: filter === f ? '#00f0ff' : '#64748b'
              }}
            >
              {f === 'all' ? 'All' : 'Android'}
            </button>
          ))}
        </div>
      </div>

      {/* Emulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredEmulators.map((emu) => (
          <motion.div
            key={emu.id}
            whileHover={{ scale: 1.01, y: -2 }}
            className="glass rounded-2xl p-5 flex flex-col relative overflow-hidden cursor-pointer group"
            style={{ border: `1px solid ${selectedEmu === emu.id ? emu.color + '60' : 'rgba(255,255,255,0.06)'}` }}
            onClick={() => setSelectedEmu(selectedEmu === emu.id ? null : emu.id)}
          >
            {/* Recommended badge */}
            {emu.recommended && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: 'rgba(0,255,136,0.15)', color: '#00ff88', border: '1px solid rgba(0,255,136,0.3)' }}
              >
                <CheckCircle2 size={10} /> RECOMMENDED
              </div>
            )}

            {/* Top Section */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                style={{ background: `${emu.color}15`, border: `1px solid ${emu.color}30` }}
              >
                {emu.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-rajdhani font-bold text-lg" style={{ color: emu.color }}>{emu.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <StarRating rating={emu.rating} color={emu.color} />
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">{emu.description}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { icon: <Monitor size={12} />, label: 'Version', value: emu.version },
                { icon: <HardDrive size={12} />, label: 'Size', value: emu.size },
                { icon: <Users size={12} />, label: 'Downloads', value: emu.downloads },
              ].map(stat => (
                <div key={stat.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center justify-center gap-1 text-gray-500 mb-0.5">
                    {stat.icon}
                    <span className="text-[9px] uppercase tracking-wider">{stat.label}</span>
                  </div>
                  <p className="text-xs font-rajdhani font-bold text-gray-300">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Expanded Features */}
            <AnimatePresence>
              {selectedEmu === emu.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/5 pt-4 mb-4">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">Key Features</p>
                    <div className="flex flex-wrap gap-1.5">
                      {emu.features.map(f => (
                        <span
                          key={f}
                          className="text-[10px] px-2 py-0.5 rounded-full font-rajdhani font-bold"
                          style={{ background: `${emu.color}15`, color: emu.color, border: `1px solid ${emu.color}30` }}
                        >
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-2 mt-auto">
              <button
                onClick={(e) => { e.stopPropagation(); handleDownload(emu); }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-rajdhani font-bold text-sm tracking-wider transition-all"
                style={{
                  background: `${emu.color}20`,
                  border: `1px solid ${emu.color}50`,
                  color: emu.color,
                }}
              >
                <Download size={14} /> DOWNLOAD
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); window.open(emu.url, '_blank'); }}
                className="flex items-center justify-center px-3 py-2.5 rounded-xl transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                <ExternalLink size={14} className="text-gray-400" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info Banner */}
      <div className="glass rounded-2xl p-5 flex items-start gap-4">
        <div className="p-3 rounded-xl bg-[#00f0ff]/10">
          <Shield size={24} className="text-[#00f0ff]" />
        </div>
        <div>
          <h4 className="font-rajdhani font-bold text-base mb-1">Tips Keamanan</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Selalu download emulator dari situs resmi untuk menghindari malware. 
            Link di atas mengarah langsung ke halaman resmi masing-masing emulator. 
            Setelah menginstal emulator, kembali ke EmuBoost dan gunakan fitur <span className="text-[#b026ff] font-semibold">Optimizer</span> untuk 
            memaksimalkan performa emulator Anda.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
