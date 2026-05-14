
import React, { useState, useEffect } from 'react';
import { Radio, Monitor, Hash, Database, Send, RotateCcw, AlertTriangle, Info, CheckCircle2, Search, ShieldAlert, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MacTableEntry, Frame } from '../../types';

// --- CONSTANTS ---
const PORTS = [1, 2, 3, 4, 5, 6, 7, 8];
const DEVICES = [
  { id: 'pc1', label: 'PC-1', mac: '00:0A:95:9D:68:10', port: 1 },
  { id: 'pc2', label: 'PC-2', mac: '00:0A:95:9D:68:20', port: 2 },
  { id: 'pc3', label: 'PC-3', mac: '00:0A:95:9D:68:30', port: 3 },
  { id: 'pc4', label: 'PC-4', mac: '00:0A:95:9D:68:40', port: 4 },
];

const VLANS = [
  { id: 1, name: 'Default', color: 'bg-slate-400', stroke: '#94a3b8' },
  { id: 10, name: 'Sales', color: 'bg-blue-500', stroke: '#3b82f6' },
  { id: 20, name: 'Eng', color: 'bg-green-500', stroke: '#22c55e' },
];

const Layer2DataLink: React.FC = () => {
  // State
  const [portConfigs, setPortConfigs] = useState<{ [key: number]: number }>({
    1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 1, 7: 1, 8: 1
  });
  const [macTable, setMacTable] = useState<MacTableEntry[]>([]);
  const [selectedSource, setSelectedSource] = useState('pc1');
  const [targetId, setTargetId] = useState('pc2'); 
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState<string>('');
  const [simResult, setSimResult] = useState<{ type: 'success' | 'warning' | 'error', msg: string } | null>(null);
  const [floodingPorts, setFloodingPorts] = useState<number[]>([]);
  const [deliveringPorts, setDeliveringPorts] = useState<number[]>([]);

  // Simulation Logic
  const runSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimResult(null);
    setFloodingPorts([]);
    setDeliveringPorts([]);
    
    const srcDevice = DEVICES.find(d => d.id === selectedSource)!;
    const destDevice = targetId === 'broadcast' ? null : DEVICES.find(d => d.id === targetId);
    
    const srcVlan = portConfigs[srcDevice.port];
    const destMac = targetId === 'broadcast' ? 'FF:FF:FF:FF:FF:FF' : (destDevice?.mac || '00:DE:AD:BE:EF:00');
    
    const frame: Frame = {
      srcMac: srcDevice.mac,
      destMac: destMac,
      srcPort: srcDevice.port,
      vlan: srcVlan,
      data: "VLAN Packet"
    };

    // 1. Learning Phase
    setStep('LEARNING: Switch reads Source MAC');
    await wait(800);
    
    setMacTable(prev => {
        const existing = prev.find(e => e.mac === frame.srcMac);
        if (existing) {
            if (existing.port === frame.srcPort) return prev;
            return prev.map(e => e.mac === frame.srcMac ? { ...e, port: frame.srcPort } : e);
        }
        return [...prev, { mac: frame.srcMac, port: frame.srcPort, vlan: frame.vlan }];
    });
    
    // 2. VLAN Check & Forwarding Logic
    setStep('FILTERING: Checking VLAN Member List');
    await wait(800);

    if (targetId === 'broadcast') {
        setStep('FLOODING: Sending to all members of VLAN ' + frame.vlan);
        const activePorts = DEVICES
            .filter(d => d.id !== selectedSource && portConfigs[d.port] === frame.vlan)
            .map(d => d.port);
        
        setFloodingPorts(activePorts);
        await wait(1200);
        setSimResult({ 
            type: 'success', 
            msg: `Broadcast success! Only the ${activePorts.length} devices in VLAN ${frame.vlan} received the frame.` 
        });
    } else if (destDevice) {
        const destVlan = portConfigs[destDevice.port];
        
        if (srcVlan !== destVlan) {
            setStep('BLOCKED: Destination is in a different VLAN!');
            await wait(1200);
            setSimResult({ 
                type: 'error', 
                msg: `Communication Refused. PC-1 (VLAN ${srcVlan}) and ${destDevice.label} (VLAN ${destVlan}) are isolated.` 
            });
        } else {
            setStep('FORWARDING: Delivering to Port Fa0/' + destDevice.port);
            setDeliveringPorts([destDevice.port]);
            await wait(1200);
            setSimResult({ 
                type: 'success', 
                msg: `Unicast Success! Both devices are in VLAN ${srcVlan}.` 
            });
        }
    } else {
        setStep('UNKNOWN: Flooding VLAN ' + frame.vlan + ' to find MAC');
        const activePorts = DEVICES
            .filter(d => d.id !== selectedSource && portConfigs[d.port] === frame.vlan)
            .map(d => d.port);
        setFloodingPorts(activePorts);
        await wait(1200);
        setSimResult({ 
            type: 'warning', 
            msg: 'MAC Unknown. Flooded all ports in source VLAN only.' 
        });
    }

    setIsSimulating(false);
    setStep('');
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const resetAll = () => {
    setMacTable([]);
    setSimResult(null);
    setFloodingPorts([]);
    setDeliveringPorts([]);
    setIsSimulating(false);
  };

  const togglePortVlan = (port: number) => {
    if (isSimulating) return;
    setPortConfigs(prev => {
      const currentVlan = prev[port];
      const nextIdx = (VLANS.findIndex(v => v.id === currentVlan) + 1) % VLANS.length;
      return { ...prev, [port]: VLANS[nextIdx].id };
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-800 border-b border-slate-700 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Radio className="w-5 h-5 text-yellow-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white leading-tight">Layer 2: VLAN Segmentation</h2>
            <p className="text-[10px] text-slate-400 font-mono italic">Switching boundaries & MAC isolation</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            <div className="flex-1 lg:flex-none flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-1">From</span>
                <select 
                    value={selectedSource}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    disabled={isSimulating}
                    className="bg-slate-800 text-white text-xs p-1 rounded outline-none w-full"
                >
                    {DEVICES.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
            </div>
            
            <div className="flex-1 lg:flex-none flex items-center gap-1.5 p-1.5 bg-slate-900 rounded-lg border border-slate-700">
                <span className="text-[10px] font-bold text-slate-500 uppercase px-1">To</span>
                <select 
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    disabled={isSimulating}
                    className="bg-slate-800 text-white text-xs p-1 rounded outline-none w-full"
                >
                    <option value="broadcast">Broadcast (All in VLAN)</option>
                    {DEVICES.map(d => d.id !== selectedSource && <option key={d.id} value={d.id}>{d.label}</option>)}
                    <option value="unknown">Unknown Device</option>
                </select>
            </div>

            <div className="flex gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="flex-1 lg:flex-none bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40"
                >
                    <Send className="w-4 h-4" /> Run Traffic
                </button>
                <button 
                    onClick={resetAll}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center"
                >
                    <RotateCcw className="w-4 h-4" />
                </button>
            </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Topology View */}
        <div className="flex-1 relative bg-slate-950 p-4 lg:p-8 flex flex-col justify-between overflow-hidden">
          
          {/* PCs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 z-10 w-full">
            {DEVICES.map(device => {
              const vlanId = portConfigs[device.port];
              const vlan = VLANS.find(v => v.id === vlanId)!;
              const isFlooding = floodingPorts.includes(device.port);
              const isDelivering = deliveringPorts.includes(device.port);
              const isSource = selectedSource === device.id;
              const isTarget = targetId === device.id;
              
              return (
                <div key={device.id} className="flex flex-col items-center">
                  <motion.div 
                    onClick={() => togglePortVlan(device.port)}
                    whileHover={{ scale: 1.05 }}
                    animate={isFlooding ? { scale: [1, 1.1, 1], backgroundColor: 'rgba(234, 179, 8, 0.2)' } : isDelivering ? { scale: [1, 1.1, 1], backgroundColor: 'rgba(34, 197, 94, 0.2)' } : {}}
                    className={`p-3 lg:p-5 rounded-2xl border-2 transition-all cursor-pointer relative group flex flex-col items-center
                        ${isSource ? 'border-blue-500 bg-blue-500/10' : isTarget ? 'border-purple-500 bg-purple-500/5' : 'border-slate-800 bg-slate-900'}
                    `}
                  >
                    <Monitor className={`w-8 h-8 lg:w-12 lg:h-12 ${isSource ? 'text-blue-400' : isTarget ? 'text-purple-400' : 'text-slate-500'}`} />
                    <div className={`absolute -top-2 -right-2 px-2 py-0.5 rounded-full ${vlan.color} border-2 border-slate-950 flex items-center justify-center text-[10px] font-bold text-white shadow-xl`}>
                        VLAN {vlanId}
                    </div>
                  </motion.div>
                  <span className="mt-3 text-xs font-bold text-slate-400 uppercase tracking-tighter">{device.label}</span>
                  <span className="text-[9px] font-mono text-slate-600">{device.mac}</span>
                </div>
              );
            })}
          </div>

          {/* Switch in Center */}
          <div className="flex flex-col items-center justify-center py-6 lg:py-12 relative flex-1">
            <div className="w-full max-w-lg bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-4 lg:p-6 flex flex-col items-center relative z-20">
              <div className="w-full flex items-center justify-between mb-4 border-b border-slate-700 pb-3">
                 <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">MLA-Core-SW01</span>
                 </div>
                 <div className="flex gap-2">
                    {VLANS.map(v => (
                        <div key={v.id} className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-0.5 rounded-md border border-slate-700">
                            <div className={`w-2 h-2 rounded-sm ${v.color}`} />
                            <span className="text-[9px] text-slate-400 font-bold">{v.id}</span>
                        </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-4 gap-3 lg:gap-4 bg-slate-900 p-4 lg:p-6 rounded-xl border border-slate-950 shadow-inner w-full">
                {PORTS.map(port => {
                    const vlanId = portConfigs[port];
                    const vlan = VLANS.find(v => v.id === vlanId)!;
                    const isPortActive = DEVICES.some(d => d.port === port);
                    const isBusy = (isSimulating && DEVICES.find(d => d.id === selectedSource)?.port === port) || floodingPorts.includes(port) || deliveringPorts.includes(port);

                    return (
                        <button 
                            key={port}
                            onClick={() => togglePortVlan(port)}
                            disabled={isSimulating}
                            className={`
                                w-full aspect-square border rounded-lg flex flex-col items-center justify-center transition-all relative group
                                ${isPortActive ? 'cursor-pointer hover:bg-slate-800' : 'opacity-30 cursor-not-allowed'}
                                ${isBusy ? 'ring-2 ring-yellow-400 border-yellow-400 bg-yellow-400/5' : 'border-slate-800 bg-slate-900'}
                            `}
                        >
                            <div className={`w-3 h-1 mb-1 rounded-full ${isPortActive ? 'bg-green-500' : 'bg-slate-700'} shadow-[0_0_5px_currentColor]`} />
                            <div className={`absolute inset-0 flex items-center justify-center rounded-lg opacity-10 ${vlan.color}`} />
                            <span className="text-[10px] font-bold text-slate-500 z-10">{port}</span>
                        </button>
                    );
                })}
              </div>
              <p className="mt-4 text-[9px] text-slate-500 uppercase tracking-widest font-black opacity-50">Enterprise 8-Port Desktop Switch</p>
            </div>

            {/* SVG Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               {DEVICES.map(d => {
                   const vlanId = portConfigs[d.port];
                   const vlan = VLANS.find(v => v.id === vlanId)!;
                   const xPos = d.id === 'pc1' ? 12.5 : d.id === 'pc2' ? 37.5 : d.id === 'pc3' ? 62.5 : 87.5;
                   
                   return (
                        <motion.line 
                            key={d.id} 
                            x1={`${xPos}%`} 
                            y1="10%" 
                            x2={`${d.id === 'pc1' ? 30 : d.id === 'pc2' ? 40 : d.id === 'pc3' ? 60 : 70}%`} 
                            y2="50%" 
                            stroke={vlan.stroke} 
                            strokeWidth="2" 
                            strokeDasharray="4"
                            animate={isSimulating ? { strokeDashoffset: [0, -10] } : {}}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        />
                   );
               })}
            </svg>

            {/* Frame Animation */}
            <AnimatePresence>
                {isSimulating && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute bottom-4 lg:bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-600 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-4 z-40 whitespace-nowrap"
                    >
                        <div className="flex items-center gap-2">
                             <Cpu className="w-3 h-3 text-blue-400 animate-spin" />
                             <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-wider">{step}</span>
                        </div>
                        <div className="h-4 w-px bg-slate-700" />
                        <div className="flex gap-1.5 items-center">
                            <span className="text-[10px] text-slate-500 font-bold uppercase">VLAN:</span>
                            <span className={`text-[10px] font-mono font-bold px-1.5 rounded ${VLANS.find(v => v.id === portConfigs[DEVICES.find(d => d.id === selectedSource)!.port])?.color}`}>
                                {portConfigs[DEVICES.find(d => d.id === selectedSource)!.port]}
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* Results Area */}
          <div className="h-28 bg-slate-900/50 rounded-2xl border border-slate-800 flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-30" />
                {simResult ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-5 max-w-2xl"
                    >
                        {simResult.type === 'success' && <div className="p-3 bg-green-500/20 rounded-xl"><CheckCircle2 className="w-8 h-8 text-green-500" /></div>}
                        {simResult.type === 'warning' && <div className="p-3 bg-yellow-500/20 rounded-xl"><AlertTriangle className="w-8 h-8 text-yellow-500" /></div>}
                        {simResult.type === 'error' && <div className="p-3 bg-red-500/20 rounded-xl"><ShieldAlert className="w-8 h-8 text-red-500" /></div>}
                        
                        <div>
                            <h4 className={`font-black text-base uppercase tracking-tight ${simResult.type === 'success' ? 'text-green-400' : simResult.type === 'error' ? 'text-red-400' : 'text-yellow-400'}`}>
                                {simResult.msg}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {simResult.type === 'error' 
                                    ? "Layer 2 switches do not allow traffic to cross VLAN boundaries. This is known as segmentation." 
                                    : "Traffic was delivered based on members of the same broadcast domain (VLAN)."}
                            </p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="flex flex-col items-center opacity-20">
                         <Search className="w-10 h-10 mb-2 text-slate-400" />
                         <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Awaiting Network Traffic...</span>
                    </div>
                )}
          </div>
        </div>

        {/* Sidebar: Table & Info */}
        <div className="w-full md:w-80 lg:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">MAC Table (CAM)</h3>
                </div>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[9px] text-slate-500 font-bold uppercase">Live</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
                {/* Table Content */}
                <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl shrink-0">
                    <div className="grid grid-cols-4 bg-slate-900/80 border-b border-slate-800 text-[10px] font-black text-slate-500 p-3 uppercase tracking-tighter">
                        <span>VLAN</span>
                        <span className="col-span-2 text-center">MAC ADDRESS</span>
                        <span className="text-right">PORT</span>
                    </div>
                    {macTable.length === 0 ? (
                        <div className="p-10 flex flex-col items-center justify-center opacity-10 text-center">
                            <Cpu className="w-12 h-12 mb-3" />
                            <p className="text-[10px] font-bold">Switch memory is empty</p>
                        </div>
                    ) : (
                        macTable.map((entry, idx) => (
                            <motion.div 
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                key={idx} 
                                className="grid grid-cols-4 p-3 text-[11px] font-mono border-b border-slate-900 last:border-0 hover:bg-slate-900/30 transition-colors"
                            >
                                <span className="text-yellow-500 font-bold">{entry.vlan}</span>
                                <span className="col-span-2 text-slate-300 text-center">{entry.mac.slice(-8)}</span>
                                <span className="text-right text-blue-400 font-bold">Fa0/{entry.port}</span>
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Educational Section */}
                <div className="space-y-4">
                    <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <Hash className="w-4 h-4 text-blue-400" />
                            <h4 className="text-[11px] font-black text-blue-300 uppercase">Lesson: Segmentation</h4>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            A <strong>VLAN</strong> creates separate broadcast domains. Even though all PCs are plugged into the same physical switch, they cannot "see" each other unless they share a VLAN ID.
                        </p>
                    </div>

                    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                        <h4 className="text-[11px] font-black text-slate-500 uppercase mb-3 tracking-widest">Lab Exercises</h4>
                        <ul className="text-[11px] space-y-3">
                           <li className="flex gap-3">
                               <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-slate-500">1</div>
                               <span className="text-slate-400">Put <strong>PC-1</strong> and <strong>PC-4</strong> in VLAN 10. Verify they can communicate.</span>
                           </li>
                           <li className="flex gap-3">
                               <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-slate-500">2</div>
                               <span className="text-slate-400">Send a <strong>Broadcast</strong> from PC-1 (VLAN 10). Notice which PCs ignore it.</span>
                           </li>
                           <li className="flex gap-3">
                               <div className="w-5 h-5 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-[9px] font-bold text-slate-500">3</div>
                               <span className="text-slate-400">Try to ping <strong>PC-2</strong> (VLAN 1) from PC-1 (VLAN 10). Observe the rejection.</span>
                           </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Layer2DataLink;
