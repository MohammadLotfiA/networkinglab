
import React, { useState, useRef, useEffect } from 'react';
import { Send, Router, Laptop, Network, Terminal, CheckCircle, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- TYPES ---
interface RouterInterface {
  id: 0 | 1;
  name: string;
  shortName: string;
  ip: string;
  subnet: string;
  status: 'up' | 'admin down';
  side: 'left' | 'right';
}

interface Node {
    id: string;
    label: string;
    ip: string;
    x: number; // Percentage
    y: number; // Percentage
    type: 'pc' | 'switch' | 'router';
    network: 'left' | 'right';
}

const INITIAL_INTERFACES: RouterInterface[] = [
  { id: 0, name: 'GigabitEthernet0/0', shortName: 'Gi0/0', ip: 'unassigned', subnet: '192.168.1.0/24', status: 'admin down', side: 'left' },
  { id: 1, name: 'GigabitEthernet0/1', shortName: 'Gi0/1', ip: 'unassigned', subnet: '10.0.0.0/8', status: 'admin down', side: 'right' },
];

// Topology Nodes
const INITIAL_NODES: Record<string, Node> = {
    // Left LAN
    'pc-a1': { id: 'pc-a1', label: 'PC A1', ip: '192.168.1.10', x: 10, y: 25, type: 'pc', network: 'left' },
    'pc-a2': { id: 'pc-a2', label: 'PC A2', ip: '192.168.1.11', x: 10, y: 75, type: 'pc', network: 'left' },
    'sw-1':  { id: 'sw-1', label: 'Switch 1', ip: '', x: 30, y: 50, type: 'switch', network: 'left' },
    
    // Router (Middle)
    'router': { id: 'router', label: 'Router', ip: '', x: 50, y: 50, type: 'router', network: 'left' }, 

    // Right LAN
    'sw-2':  { id: 'sw-2', label: 'Switch 2', ip: '', x: 70, y: 50, type: 'switch', network: 'right' },
    'pc-b1': { id: 'pc-b1', label: 'PC B1', ip: '10.0.0.5', x: 90, y: 25, type: 'pc', network: 'right' },
    'pc-b2': { id: 'pc-b2', label: 'PC B2', ip: '10.0.0.6', x: 90, y: 75, type: 'pc', network: 'right' },
};

const Layer3Network: React.FC = () => {
  // State
  const [interfaces, setInterfaces] = useState<RouterInterface[]>(INITIAL_INTERFACES);
  const [nodes, setNodes] = useState<Record<string, Node>>(INITIAL_NODES);
  const [lanSubnets, setLanSubnets] = useState({ left: '192.168.1.0/24', right: '10.0.0.0/8' });
  const [history, setHistory] = useState<string[]>([
    "MLATech RouterOS v1.0.4-mlatech",
    "Router> enable",
    "Router# configure terminal",
    "Enter configuration commands, one per line. End with CNTL/Z.",
    "Router(config)#"
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [mode, setMode] = useState<'config' | 'iface'>('config');
  const [selectedIfaceIdx, setSelectedIfaceIdx] = useState<number | null>(null);
  
  // Simulation State
  const [simSource, setSimSource] = useState<string>('pc-a1');
  const [simDest, setSimDest] = useState<string>('pc-b1');
  const [packet, setPacket] = useState<{active: boolean, path: string[], currentStep: number, status: 'traveling' | 'success' | 'failed'}>({
      active: false, path: [], currentStep: 0, status: 'traveling'
  });

  const generateNewScenario = () => {
    const randomByte = () => Math.floor(Math.random() * 254) + 1;
    const newNodes = { ...nodes };
    
    // Left side
    const netL = `192.168.${randomByte()}`;
    const newNetL = `${netL}.0/24`;
    newNodes['pc-a1'] = { ...newNodes['pc-a1'], ip: `${netL}.10` };
    newNodes['pc-a2'] = { ...newNodes['pc-a2'], ip: `${netL}.11` };
    
    // Right side
    const netR = randomByte();
    const newNetR = `${netR}.0.0.0/16`;
    newNodes['pc-b1'] = { ...newNodes['pc-b1'], ip: `${netR}.0.0.5` };
    newNodes['pc-b2'] = { ...newNodes['pc-b2'], ip: `${netR}.0.0.6` };

    setLanSubnets({ left: newNetL, right: newNetR });
    setNodes(newNodes);
    
    // Reset interfaces for fresh lab
    setInterfaces(INITIAL_INTERFACES);
    
    addToHistory(`% SYSTEM: New scenario generated.`);
    addToHistory(`% SYSTEM: LAN A: ${newNetL} | LAN B: ${newNetR}`);
  };

  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll CLI
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // --- CLI LOGIC ---
  const processCommand = (cmd: string) => {
    const args = cmd.trim().split(' ');
    const lowerCmd = cmd.toLowerCase().trim();

    // Navigation
    if (lowerCmd === 'exit' || lowerCmd === 'end') {
        if (mode === 'iface') {
            setMode('config');
            setSelectedIfaceIdx(null);
            addToHistory("Router(config)#");
        } else {
             addToHistory("Router#");
        }
        return;
    }

    // Interface Selection
    if (mode === 'config' && (args[0] === 'interface' || args[0] === 'int')) {
        const name = args[1]?.toLowerCase();
        let idx = -1;
        if (name === 'g0/0' || name === 'gi0/0') idx = 0;
        if (name === 'g0/1' || name === 'gi0/1') idx = 1;

        if (idx !== -1) {
            setSelectedIfaceIdx(idx);
            setMode('iface');
            addToHistory(`Router(config-if)#`);
        } else {
            addToHistory("% Invalid interface");
        }
        return;
    }

    // IP Address
    if (mode === 'iface' && args[0] === 'ip' && args[1] === 'address') {
        if (selectedIfaceIdx === null) return;
        const ip = args[2];
        const mask = args[3];
        
        // Basic validation for educational purposes
        const subnetPrefix = selectedIfaceIdx === 0 ? lanSubnets.left.split('.').slice(0, 3).join('.') : lanSubnets.right.split('.')[0];
        const correctSubnet = selectedIfaceIdx === 0 ? ip.startsWith(subnetPrefix) : ip.startsWith(subnetPrefix);
        
        if (ip && mask) {
            if(correctSubnet) {
                updateInterface(selectedIfaceIdx, { ip });
                addToHistory("");
            } else {
                 addToHistory("% Bad IP address for this subnet/exercise scenario.");
                 addToHistory(selectedIfaceIdx === 0 ? `Hint: Use an IP in ${lanSubnets.left} (e.g. ${subnetPrefix}.1)` : `Hint: Use an IP in ${lanSubnets.right} (e.g. ${subnetPrefix}.0.0.1)`);
            }
        } else {
            addToHistory("% Incomplete command");
        }
        return;
    }

    // No Shutdown
    if (mode === 'iface' && (lowerCmd === 'no shutdown' || lowerCmd === 'no shut')) {
        if (selectedIfaceIdx === null) return;
        updateInterface(selectedIfaceIdx, { status: 'up' });
        addToHistory(`%LINK-3-UPDOWN: Interface ${interfaces[selectedIfaceIdx].name}, changed state to up`);
        addToHistory(`%LINEPROTO-5-UPDOWN: Line protocol on Interface ${interfaces[selectedIfaceIdx].name}, changed state to up`);
        return;
    }

    // Show commands
    if (lowerCmd.includes('show ip int brief') || lowerCmd.includes('sh ip int br')) {
        addToHistory("Interface              IP-Address      OK? Method Status");
        interfaces.forEach(i => {
            addToHistory(`${i.shortName.padEnd(22)} ${i.ip.padEnd(15)} YES manual ${i.status}`);
        });
        return;
    }

    addToHistory("% Invalid input detected at '^' marker.");
  };

  const updateInterface = (idx: number, updates: Partial<RouterInterface>) => {
      setInterfaces(prev => {
          const next = [...prev];
          next[idx] = { ...next[idx], ...updates };
          return next;
      });
  };

  const addToHistory = (txt: string) => setHistory(prev => [...prev, txt]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
        const prompt = mode === 'config' ? "Router(config)#" : "Router(config-if)#";
        setHistory(prev => [...prev, `${prompt} ${currentInput}`]);
        processCommand(currentInput);
        setCurrentInput("");
    }
  };

  // --- SIMULATION LOGIC ---
  const runSimulation = () => {
      if (packet.active) return;

      const startNode = nodes[simSource];
      const endNode = nodes[simDest];
      const startSwitch = startNode.network === 'left' ? 'sw-1' : 'sw-2';
      const endSwitch = endNode.network === 'left' ? 'sw-1' : 'sw-2';
      
      const isLocal = startNode.network === endNode.network;

      // Construct Path
      let path = [simSource, startSwitch];

      if (!isLocal) {
          path.push('router');
          path.push(endSwitch);
      }
      path.push(simDest);

      setPacket({ active: true, path, currentStep: 0, status: 'traveling' });

      // Execute Animation Steps
      let stepIndex = 0;
      
      const stepInterval = setInterval(() => {
          if (stepIndex >= path.length - 1) {
              // Final Step (Arrival)
              setPacket(prev => ({ ...prev, status: 'success' }));
              clearInterval(stepInterval);
              setTimeout(() => setPacket(p => ({ ...p, active: false })), 2000);
              return;
          }

          // Check for router failure
          const currentNodeId = path[stepIndex];
          const nextNodeId = path[stepIndex + 1];

          // If we are moving TO the router, check interfaces
          if (nextNodeId === 'router') {
              const srcSide = nodes[simSource].network;
              const iface = srcSide === 'left' ? interfaces[0] : interfaces[1];
              const destIface = srcSide === 'left' ? interfaces[1] : interfaces[0];

              // FAILURE CONDITIONS
              // 1. Ingress Interface is Down
              if (iface.status !== 'up') {
                   failPacket("Gateway Interface DOWN");
                   clearInterval(stepInterval);
                   return;
              }
              // 2. Gateway IP not set (Can't find gateway)
              if (iface.ip === 'unassigned') {
                  failPacket("Gateway IP Unassigned");
                  clearInterval(stepInterval);
                  return;
              }
              // 3. Egress (Destination) Interface Down
              if (destIface.status !== 'up') {
                  // Packet enters router, but dies inside because it can't exit
                  setPacket(prev => ({ ...prev, currentStep: prev.currentStep + 1 })); // Move to router
                  setTimeout(() => failPacket("Destination Network Unreachable"), 500);
                  clearInterval(stepInterval);
                  return;
              }
          }

          stepIndex++;
          setPacket(prev => ({ ...prev, currentStep: stepIndex }));

      }, 1000); // 1 second per hop
  };

  const failPacket = (reason: string) => {
      setPacket(prev => ({ ...prev, status: 'failed' }));
      addToHistory(`% SIMULATION FAILED: ${reason}`);
      setTimeout(() => setPacket(p => ({ ...p, active: false })), 2000);
  };


  // --- RENDER HELPERS ---
  const renderConnection = (n1: string, n2: string, color: string = "#334155") => {
      const start = nodes[n1];
      const end = nodes[n2];
      return (
        <line 
            x1={`${start.x}%`} y1={`${start.y}%`} 
            x2={`${end.x}%`} y2={`${end.y}%`} 
            stroke={color} strokeWidth="2" 
        />
      );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900">
        
        {/* Header & Controls */}
        <div className="bg-slate-800 p-4 border-b border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-green-500/20 rounded-lg">
                    <Router className="w-6 h-6 text-green-500" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Layer 3: Network</h2>
                    <p className="text-xs text-slate-400">Configure Routing between Networks</p>
                </div>
            </div>

            {/* Traffic Simulator & Tools */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={generateNewScenario}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-lg active:scale-95"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Generate New Scenario
                </button>

                <div className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase px-2">Traffic Sim</span>
                    <select 
                        value={simSource} onChange={(e) => setSimSource(e.target.value)}
                        className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 outline-none"
                    >
                        <option value="pc-a1">PC A1</option>
                        <option value="pc-a2">PC A2</option>
                        <option value="pc-b1">PC B1</option>
                        <option value="pc-b2">PC B2</option>
                    </select>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                    <select 
                        value={simDest} onChange={(e) => setSimDest(e.target.value)}
                        className="bg-slate-800 text-white text-xs p-1 rounded border border-slate-600 outline-none"
                    >
                        <option value="pc-b1">PC B1</option>
                        <option value="pc-b2">PC B2</option>
                        <option value="pc-a1">PC A1</option>
                        <option value="pc-a2">PC A2</option>
                    </select>
                    <button 
                        onClick={runSimulation}
                        disabled={packet.active}
                        className="ml-2 bg-green-600 hover:bg-green-500 disabled:bg-slate-700 text-white p-1.5 rounded transition-colors"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>

        {/* Visual Topology */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden border-b-4 border-slate-700 min-h-[400px]">
            {/* Background Zones */}
            <div className="absolute inset-0 flex">
                <div className="w-1/2 bg-blue-900/10 border-r border-slate-800/50 relative group">
                     <div className="absolute top-4 left-4 flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-blue-500/50 uppercase tracking-widest">LAN A: {lanSubnets.left}</span>
                     </div>
                </div>
                <div className="w-1/2 bg-purple-900/10 relative group">
                     <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                        <span className="text-[10px] font-bold text-purple-500/50 uppercase tracking-widest">LAN B: {lanSubnets.right}</span>
                     </div>
                </div>
            </div>

            {/* SVG Connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {renderConnection('pc-a1', 'sw-1')}
                {renderConnection('pc-a2', 'sw-1')}
                {renderConnection('sw-1', 'router')}
                {renderConnection('router', 'sw-2')}
                {renderConnection('sw-2', 'pc-b1')}
                {renderConnection('sw-2', 'pc-b2')}
            </svg>

            {/* Interface Labels (Dynamic) */}
            <div className="absolute top-1/2 left-[42%] -translate-y-8 flex flex-col items-end z-20">
                 <div className="flex items-center gap-1">
                    <span className="text-[10px] font-mono text-slate-400">Gi0/0</span>
                    <div className={`w-2 h-2 rounded-full ${interfaces[0].status === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                 </div>
                 <span className="text-[9px] font-mono text-blue-300">{interfaces[0].ip === 'unassigned' ? 'no ip' : interfaces[0].ip}</span>
            </div>
            <div className="absolute top-1/2 right-[42%] -translate-y-8 flex flex-col items-start z-20">
                 <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${interfaces[1].status === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-mono text-slate-400">Gi0/1</span>
                 </div>
                 <span className="text-[9px] font-mono text-purple-300">{interfaces[1].ip === 'unassigned' ? 'no ip' : interfaces[1].ip}</span>
            </div>

            {/* Nodes */}
            {Object.values(nodes).map(node => (
                <div 
                    key={node.id} 
                    className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                    <div className={`
                        p-3 rounded-xl border-2 shadow-lg relative z-10 transition-transform hover:scale-110
                        ${node.type === 'router' ? 'bg-slate-800 border-green-500' : 'bg-slate-900 border-slate-700'}
                    `}>
                        {node.type === 'pc' && <Laptop className={`w-6 h-6 ${node.network === 'left' ? 'text-blue-400' : 'text-purple-400'}`} />}
                        {node.type === 'switch' && <Network className="w-6 h-6 text-slate-400" />}
                        {node.type === 'router' && <Router className="w-8 h-8 text-green-500" />}
                    </div>
                    <span className="mt-2 text-xs font-bold text-slate-300 bg-slate-900/80 px-2 rounded">{node.label}</span>
                    {node.ip && <span className="text-[9px] text-slate-500 font-mono">{node.ip}</span>}
                </div>
            ))}

            {/* Packet Animation */}
            <AnimatePresence>
                {packet.active && (
                    <motion.div
                        className={`absolute w-6 h-6 rounded flex items-center justify-center z-50 shadow-lg border border-white/20
                            ${packet.status === 'failed' ? 'bg-red-600' : packet.status === 'success' ? 'bg-green-500' : 'bg-yellow-500'}
                        `}
                        initial={{ 
                            left: `${nodes[packet.path[0]].x}%`, 
                            top: `${nodes[packet.path[0]].y}%` 
                        }}
                        animate={{ 
                            left: `${nodes[packet.path[packet.currentStep]].x}%`, 
                            top: `${nodes[packet.path[packet.currentStep]].y}%` 
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        style={{ x: "-50%", y: "-50%" }}
                    >
                         {packet.status === 'failed' ? <AlertCircle className="w-4 h-4 text-white" /> : <Send className="w-3 h-3 text-white" />}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* CLI */}
        <div className="h-[35%] flex bg-black">
             {/* Sidebar Help */}
              <div className="hidden md:block w-56 bg-slate-900 border-r border-slate-800 p-4 overflow-y-auto">
                 <h3 className="text-xs font-bold text-green-400 uppercase mb-3 flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> LAB MISSION
                 </h3>
                 <div className="space-y-4 text-[10px] font-mono text-slate-400">
                     <div className="p-3 bg-blue-900/10 rounded border border-blue-500/20">
                         <span className="text-blue-400 font-bold block mb-2 uppercase">Step 1: Ingress</span>
                         <p className="mb-2 text-slate-500">Configure Gi0/0 to be the gateway for LAN A.</p>
                         <div className="bg-black/50 p-1.5 rounded text-blue-300">
                            int g0/0<br/>ip add [IP] [MASK]
                         </div>
                     </div>

                     <div className="p-3 bg-purple-900/10 rounded border border-purple-500/20">
                         <span className="text-purple-400 font-bold block mb-2 uppercase">Step 2: Egress</span>
                         <p className="mb-2 text-slate-500">Configure Gi0/1 to be the gateway for LAN B.</p>
                         <div className="bg-black/50 p-1.5 rounded text-purple-300">
                            int g0/1<br/>ip add [IP] [MASK]
                         </div>
                     </div>

                     <div className="p-3 bg-green-900/10 rounded border border-green-500/20">
                         <span className="text-green-400 font-bold block mb-1 uppercase">Step 3: Power</span>
                         <p className="text-slate-500">Remember to use 'no shutdown' on both interfaces!</p>
                     </div>
                 </div>
             </div>

             {/* Terminal Input */}
             <div className="flex-1 p-4 font-mono text-sm text-green-500 overflow-hidden flex flex-col relative shadow-inner">
                 <div className="flex-1 overflow-y-auto custom-scrollbar">
                     {history.map((line, i) => (
                         <div key={i} className={`whitespace-pre-wrap leading-tight ${line.startsWith('%') ? 'text-yellow-500' : ''}`}>{line}</div>
                     ))}
                     <div ref={endRef} />
                 </div>
                 
                 <div className="flex items-center mt-2 border-t border-slate-800 pt-2">
                    <span className="mr-2 text-slate-400">{mode === 'config' ? 'Router(config)#' : 'Router(config-if)#'}</span>
                    <input 
                        className="flex-1 bg-transparent border-none outline-none text-white focus:ring-0"
                        autoFocus
                        value={currentInput}
                        onChange={(e) => setCurrentInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type command..."
                    />
                 </div>
             </div>
        </div>
    </div>
  );
};

export default Layer3Network;
