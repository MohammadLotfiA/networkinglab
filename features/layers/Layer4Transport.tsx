import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Box, RotateCcw, Zap, ShieldAlert, Server, Laptop, Play, SkipForward, AlertTriangle, Activity, Power } from 'lucide-react';

// Types for our simulation
interface Packet {
  id: number;
  type: 'SYN' | 'SYN-ACK' | 'ACK' | 'UDP';
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  origX: number; // Added to return to sender
  origY: number;
  source: string;
  color: string;
}

const Layer4Transport: React.FC = () => {
  const [mode, setMode] = useState<'tcp' | 'udp' | 'dos' | 'ddos'>('tcp');
  
  // Simulation State
  const [packets, setPackets] = useState<Packet[]>([]);
  const [serverBuffer, setServerBuffer] = useState<number>(0);
  const [handshakeStep, setHandshakeStep] = useState(0); // 0: Idle, 1: SYN Sent, 2: SYN Arrived, 3: SYN-ACK Sent, 4: Established
  
  const simulationRef = useRef<number | null>(null);

  // Constants
  const SERVER_CAPACITY = 100;
  const SERVER_X = 80; // Percent
  const SERVER_Y = 50; // Percent
  const CLIENT_X = 15;
  const CLIENT_Y = 50;

  // DDoS Bot Positions
  const BOTS = [
    { id: 'bot1', x: 10, y: 20 },
    { id: 'bot2', x: 10, y: 50 },
    { id: 'bot3', x: 10, y: 80 },
  ];

  const resetSimulation = () => {
    setPackets([]);
    setServerBuffer(0);
    setHandshakeStep(0);
    if (simulationRef.current) cancelAnimationFrame(simulationRef.current);
  };

  const rebootServer = () => {
      setServerBuffer(0);
      setPackets([]);
  };

  const spawnPacket = (type: Packet['type'], source: string, startX: number, startY: number, targetX: number, targetY: number) => {
    const packet: Packet = {
      id: Date.now() + Math.random(),
      type,
      x: startX,
      y: startY,
      targetX,
      targetY,
      origX: startX,
      origY: startY,
      source,
      color: type === 'SYN' ? 'bg-blue-500' : type === 'SYN-ACK' ? 'bg-purple-500' : type === 'ACK' ? 'bg-green-500' : 'bg-orange-500'
    };
    setPackets(prev => [...prev, packet]);
  };

  // --- BUFFER DECAY LOOP ---
  useEffect(() => {
    const decayInterval = setInterval(() => {
        setServerBuffer(prev => {
            if (prev >= 100) return 100; // CRASHED STATE - No decay
            return Math.max(0, prev - 2); // Normal decay
        });
    }, 100);
    return () => clearInterval(decayInterval);
  }, []);

  // --- ANIMATION LOOP ---
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (packets.length > 0) {
        setPackets(prevPackets => {
          const nextPackets: Packet[] = [];
          
          prevPackets.forEach(p => {
             const dx = p.targetX - p.x;
             const dy = p.targetY - p.y;
             const dist = Math.sqrt(dx*dx + dy*dy);
             
             // Speed Adjustment for better visibility
             // TCP: Very slow (15) for step-by-step tracking
             // UDP: Slower (25) for streaming
             // DoS: Medium (35) to show volume but allow tracking
             let speed = 35; 
             if (mode === 'tcp') speed = 15;
             else if (mode === 'udp') speed = 25;
             
             if (dist < 2) {
                handlePacketArrival(p);
             } else {
                const moveX = (dx / dist) * speed * delta;
                const moveY = (dy / dist) * speed * delta;
                nextPackets.push({ ...p, x: p.x + moveX, y: p.y + moveY });
             }
          });
          return nextPackets;
        });
      }
      
      simulationRef.current = requestAnimationFrame(loop);
    };

    simulationRef.current = requestAnimationFrame(loop);
    return () => {
        if(simulationRef.current) cancelAnimationFrame(simulationRef.current);
    };
  }, [mode, packets.length]); 

  const handlePacketArrival = (p: Packet) => {
      // 1. TCP Handshake Logic
      if (mode === 'tcp') {
          if (p.type === 'SYN') {
              setHandshakeStep(2); // Server received SYN
          } else if (p.type === 'SYN-ACK') {
              setHandshakeStep(4); // Client received SYN-ACK, ready to send ACK
          } else if (p.type === 'ACK') {
              setHandshakeStep(5); // Connection established
          }
      }
      
      // 2. DoS / DDoS Logic
      if (mode === 'dos' || mode === 'ddos') {
          if (p.type === 'SYN') {
              setServerBuffer(prev => {
                  const newVal = prev + 5;
                  return Math.min(newVal, SERVER_CAPACITY);
              }); 
              
              // Only respond if server isn't crashed
              setTimeout(() => {
                 setServerBuffer(currentBuffer => {
                     if (currentBuffer < 100) {
                        spawnPacket('SYN-ACK', 'server', SERVER_X, SERVER_Y, p.origX, p.origY);
                     }
                     return currentBuffer;
                 });
              }, Math.random() * 200);
          }
      }
  };

  // --- ACTIONS ---
  const launchDosWave = () => {
    if (serverBuffer >= 100) return; // Can't attack dead server
    // Spawn 5 packets in rapid succession
    for(let i=0; i<5; i++) {
        setTimeout(() => {
            spawnPacket('SYN', 'client', CLIENT_X, CLIENT_Y, SERVER_X, SERVER_Y);
        }, i * 50);
    }
  };

  const launchDdosWave = () => {
    if (serverBuffer >= 100) return; // Can't attack dead server
    // Spawn from all bots
    BOTS.forEach((bot, botIdx) => {
        for(let i=0; i<3; i++) {
             setTimeout(() => {
                spawnPacket('SYN', bot.id, bot.x, bot.y, SERVER_X, SERVER_Y);
            }, i * 50 + (botIdx * 30));
        }
    });
  };

  // TCP Controls
  const tcpStep1 = () => {
      resetSimulation();
      setHandshakeStep(1);
      spawnPacket('SYN', 'client', CLIENT_X, CLIENT_Y, SERVER_X, SERVER_Y);
  };
  const tcpStep2 = () => {
      setHandshakeStep(3);
      spawnPacket('SYN-ACK', 'server', SERVER_X, SERVER_Y, CLIENT_X, CLIENT_Y);
  };
  const tcpStep3 = () => {
      setHandshakeStep(5);
      spawnPacket('ACK', 'client', CLIENT_X, CLIENT_Y, SERVER_X, SERVER_Y);
  };

  return (
    <div className="flex flex-col min-h-[600px] bg-slate-900">
      {/* Header / Tabs */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                    <Box className="w-8 h-8 text-blue-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Layer 4: Transport</h2>
                    <p className="text-slate-400">Connection & Reliability Control</p>
                </div>
            </div>

            <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700 overflow-x-auto">
                <button onClick={() => { setMode('tcp'); resetSimulation(); }} className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${mode === 'tcp' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>TCP Handshake</button>
                <button onClick={() => { setMode('udp'); resetSimulation(); }} className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${mode === 'udp' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'}`}>UDP Streaming</button>
                <button onClick={() => { setMode('dos'); resetSimulation(); }} className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${mode === 'dos' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'}`}>DoS Attack</button>
                <button onClick={() => { setMode('ddos'); resetSimulation(); }} className={`px-4 py-2 rounded-md text-xs md:text-sm font-bold transition-colors whitespace-nowrap ${mode === 'ddos' ? 'bg-red-800 text-white' : 'text-slate-400 hover:text-white'}`}>DDoS Botnet</button>
            </div>
        </div>
      </div>

      {/* Main Simulation Area */}
      <div className="flex-1 relative overflow-hidden bg-slate-950 p-4">
        
        {/* Connection Lines Background */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40">
            {mode === 'ddos' ? (
                BOTS.map((bot, i) => (
                    <line key={i} x1={`${bot.x}%`} y1={`${bot.y}%`} x2={`${SERVER_X}%`} y2={`${SERVER_Y}%`} stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                ))
            ) : (
                <line 
                    x1={`${CLIENT_X}%`} y1={`${CLIENT_Y}%`} 
                    x2={`${SERVER_X}%`} y2={`${SERVER_Y}%`} 
                    stroke={mode === 'tcp' && handshakeStep === 5 ? "#22c55e" : "#94a3b8"} 
                    strokeWidth={mode === 'tcp' && handshakeStep === 5 ? "4" : "2"} 
                    strokeDasharray={mode === 'tcp' && handshakeStep === 5 ? "0" : "5,5"} 
                    className="transition-all duration-700 ease-in-out"
                />
            )}
        </svg>

        {/* --- ACTORS --- */}
        {/* Server */}
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${SERVER_X}%`, top: `${SERVER_Y}%` }}>
            <div className={`relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-300 z-10 ${serverBuffer >= 100 ? 'bg-red-900/50 border-red-500 scale-125 shadow-[0_0_50px_rgba(239,68,68,0.6)]' : 'bg-slate-800 border-slate-600 shadow-xl'}`}>
                <Server className={`w-12 h-12 ${serverBuffer >= 100 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
                <span className="font-bold text-slate-200 text-xs mt-2">Server</span>
                
                {/* Buffer Visualization */}
                {(mode === 'dos' || mode === 'ddos') && (
                    <div className="absolute -right-6 bottom-0 w-3 h-20 bg-slate-900 border border-slate-700 rounded overflow-hidden flex flex-col justify-end">
                         <div 
                            className={`w-full transition-all duration-100 ${serverBuffer > 80 ? 'bg-red-500' : 'bg-blue-500'}`} 
                            style={{ height: `${serverBuffer}%` }} 
                         />
                    </div>
                )}
            </div>
            {(mode === 'dos' || mode === 'ddos') && (
                <div className="absolute top-full mt-2 text-[10px] font-bold text-slate-400 whitespace-nowrap">
                    CPU Load: {serverBuffer}%
                </div>
            )}
        </div>

        {/* Clients / Bots */}
        {mode === 'ddos' ? (
            BOTS.map((bot, i) => (
                <div key={bot.id} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${bot.x}%`, top: `${bot.y}%` }}>
                    <div className="flex flex-col items-center">
                        <div className="p-3 bg-red-900/20 border-2 border-red-600 rounded-full shadow-lg shadow-red-900/20">
                            <Laptop className="w-8 h-8 text-red-500" />
                        </div>
                        <span className="text-red-500 font-bold text-xs mt-1">Bot {i+1}</span>
                    </div>
                </div>
            ))
        ) : (
            <div className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${CLIENT_X}%`, top: `${CLIENT_Y}%` }}>
                 <div className="flex flex-col items-center z-10">
                    <div className={`p-4 rounded-xl border-2 shadow-xl ${mode.includes('os') ? 'bg-red-900/20 border-red-500' : 'bg-blue-900/20 border-blue-500'}`}>
                        {mode.includes('os') ? <ShieldAlert className="w-10 h-10 text-red-500" /> : <Laptop className="w-10 h-10 text-blue-500" />}
                    </div>
                    <span className="font-bold text-slate-200 text-xs mt-2">{mode.includes('os') ? 'Attacker' : 'Client'}</span>
                </div>
            </div>
        )}

        {/* --- PACKETS --- */}
        <AnimatePresence>
            {packets.map(p => (
                <div 
                    key={p.id}
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center shadow-lg z-20 ${p.color}`}
                    style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <span className="text-[6px] font-bold text-white tracking-tighter">{p.type}</span>
                </div>
            ))}
        </AnimatePresence>

        {/* --- CONTROL PANELS --- */}

        {/* TCP CONTROLS */}
        {mode === 'tcp' && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xl">
                <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col items-center">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className={`flex flex-col items-center ${handshakeStep >= 0 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${handshakeStep > 0 ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-500 text-slate-500'}`}>1</div>
                            <span className="text-[10px] mt-1 font-bold">SYN</span>
                        </div>
                        <div className="h-0.5 w-8 bg-slate-600" />
                        <div className={`flex flex-col items-center ${handshakeStep >= 2 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${handshakeStep > 2 ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-500 text-slate-500'}`}>2</div>
                            <span className="text-[10px] mt-1 font-bold">SYN-ACK</span>
                        </div>
                         <div className="h-0.5 w-8 bg-slate-600" />
                        <div className={`flex flex-col items-center ${handshakeStep >= 4 ? 'opacity-100' : 'opacity-30'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${handshakeStep > 4 ? 'bg-green-500 border-green-500 text-white' : 'border-slate-500 text-slate-500'}`}>3</div>
                            <span className="text-[10px] mt-1 font-bold">ACK</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        {handshakeStep === 0 && (
                            <button onClick={tcpStep1} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                <Play className="w-4 h-4" /> Start Handshake
                            </button>
                        )}
                        {handshakeStep === 2 && (
                             <button onClick={tcpStep2} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 animate-bounce">
                                <SkipForward className="w-4 h-4" /> Server Reply (SYN-ACK)
                            </button>
                        )}
                        {handshakeStep === 4 && (
                             <button onClick={tcpStep3} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 animate-bounce">
                                <SkipForward className="w-4 h-4" /> Client Reply (ACK)
                            </button>
                        )}
                         {handshakeStep === 5 && (
                             <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                                 <div className="text-green-400 font-bold mb-2 text-lg drop-shadow-lg">Connection Established!</div>
                                 <button onClick={resetSimulation} className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" /> Reset
                                </button>
                             </div>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* UDP CONTROLS */}
        {mode === 'udp' && (
             <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md text-center">
                 <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-2xl">
                    <p className="text-sm text-slate-300 mb-4">
                        UDP is "Fire and Forget". No Handshake. No confirmation. 
                        Just send packets immediately.
                    </p>
                    <button 
                        onMouseDown={() => { spawnPacket('UDP', 'client', CLIENT_X, CLIENT_Y, SERVER_X, SERVER_Y); }}
                        className="bg-orange-600 hover:bg-orange-500 active:scale-95 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 mx-auto shadow-lg"
                    >
                        <Zap className="w-5 h-5" /> Send UDP Packet
                    </button>
                 </div>
             </div>
        )}

        {/* DoS / DDoS CONTROLS */}
        {(mode === 'dos' || mode === 'ddos') && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md text-center">
                 <div className="bg-slate-800/90 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-2xl">
                    <div className="mb-4">
                        <div className="flex items-center justify-center gap-2 text-red-400 mb-2">
                            {serverBuffer >= 100 ? <AlertTriangle className="w-6 h-6 animate-pulse" /> : <ShieldAlert className="w-6 h-6" />}
                            <h3 className="font-bold text-lg">{mode === 'ddos' ? 'DDoS Attack' : 'DoS Attack'}</h3>
                        </div>
                        <p className="text-xs text-slate-400">
                             {mode === 'ddos' 
                                ? "One click triggers the entire botnet. Massive impact." 
                                : "One attacker. You must click rapidly to crash the server."}
                        </p>
                    </div>
                    
                    {serverBuffer >= 100 ? (
                        <div className="bg-red-500/10 border border-red-500 text-red-200 p-3 rounded-lg mb-4 font-bold animate-pulse">
                            SERVER CRASHED! SYSTEM HALTED.
                        </div>
                    ) : (
                        <button 
                        onMouseDown={mode === 'ddos' ? launchDdosWave : launchDosWave}
                        className="active:scale-95 bg-red-600 hover:bg-red-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg flex items-center gap-2 mx-auto select-none"
                        >
                            <Activity className="w-5 h-5" /> 
                            {mode === 'ddos' ? "Trigger Botnet Wave" : "Send Packet Flood"}
                        </button>
                    )}

                    <div className="mt-4 flex justify-between text-xs text-slate-500 font-mono">
                         {serverBuffer < 100 ? 
                            <span className="text-slate-400 animate-pulse">Server processing requests...</span> :
                            <span className="text-red-500 font-bold">MANUAL REBOOT REQUIRED</span>
                        }
                    </div>

                    {serverBuffer >= 100 && (
                        <button onClick={rebootServer} className="mt-4 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm w-full flex items-center justify-center gap-2">
                             <Power className="w-4 h-4" /> Reboot Server
                        </button>
                    )}
                </div>
            </div>
        )}

      </div>
    </div>
  );
};

export default Layer4Transport;