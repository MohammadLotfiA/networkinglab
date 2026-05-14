
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Lock, Unlock, FileText, Server, ArrowRight, ShieldCheck, Search, UploadCloud, Folder, File, SkipForward, RefreshCw, Terminal, Check, FileBadge, Cog } from 'lucide-react';

type Protocol = 'HTTP' | 'HTTPS' | 'FTP';
type Step = 'IDLE' | 'DNS' | 'TCP' | 'TLS' | 'REQUEST' | 'RESPONSE' | 'RENDER';

const Layer7Application: React.FC = () => {
  const [protocol, setProtocol] = useState<Protocol>('HTTP');
  const [stepIndex, setStepIndex] = useState(0);
  
  // FTP State
  const [ftpLog, setFtpLog] = useState<string[]>([]);
  const [ftpTransferring, setFtpTransferring] = useState(false);
  const [ftpComplete, setFtpComplete] = useState(false);

  // Sub-step Visual States (for sequenced animations)
  const [dnsState, setDnsState] = useState<'IDLE' | 'QUERYING' | 'RESOLVED'>('IDLE');
  const [tlsState, setTlsState] = useState<'NEGOTIATING' | 'CERT'>('NEGOTIATING');

  // --- STEPS DEFINITION ---
  const getSteps = (proto: Protocol): { id: Step; label: string; desc: string }[] => {
      const common = [
          { id: 'IDLE' as Step, label: 'Start', desc: 'Ready to initiate request' },
          { id: 'DNS' as Step, label: 'DNS Lookup', desc: 'Querying DNS Server for IP address' },
          { id: 'TCP' as Step, label: 'TCP Handshake', desc: 'Establishing Connection (SYN, SYN-ACK, ACK)' },
      ];

      if (proto === 'HTTPS') {
          return [
              ...common,
              { id: 'TLS' as Step, label: 'TLS Handshake', desc: 'Key Exchange & Certificate Verification' },
              { id: 'REQUEST' as Step, label: 'Encrypted Request', desc: 'Sending Secure HTTP GET' },
              { id: 'RESPONSE' as Step, label: 'Encrypted Reply', desc: 'Receiving Secure HTML Data' },
              { id: 'RENDER' as Step, label: 'Render', desc: 'Browser rendering content' }
          ];
      } else if (proto === 'HTTP') {
          return [
              ...common,
              { id: 'REQUEST' as Step, label: 'HTTP GET', desc: 'Sending Plaintext Request' },
              { id: 'RESPONSE' as Step, label: 'HTTP Reply', desc: 'Receiving Plaintext HTML Data' },
              { id: 'RENDER' as Step, label: 'Render', desc: 'Browser rendering content' }
          ];
      } else {
          // FTP
          return [
              ...common,
              { id: 'REQUEST' as Step, label: 'Authentication', desc: 'Control Channel: Sending User/Pass' },
              { id: 'RESPONSE' as Step, label: 'Transfer Command', desc: 'Control Channel: PASV & STOR commands' },
              { id: 'RENDER' as Step, label: 'Data Transfer', desc: 'Data Channel: Streaming file chunks' }
          ];
      }
  };

  const currentSteps = getSteps(protocol);
  const currentStep = currentSteps[stepIndex];

  // Logic to handle internal state transitions within steps
  useEffect(() => {
    // DNS Logic
    if (currentStep.id === 'DNS') {
        setDnsState('QUERYING');
        const timer = setTimeout(() => {
            setDnsState('RESOLVED');
        }, 2000); // 2 seconds for full query/response animation
        return () => clearTimeout(timer);
    } else {
        setDnsState('IDLE');
    }

    // TLS Logic
    if (currentStep.id === 'TLS') {
        setTlsState('NEGOTIATING');
        const timer = setTimeout(() => {
            setTlsState('CERT');
        }, 2000); // 2 seconds for handshake animation
        return () => clearTimeout(timer);
    }

  }, [currentStep.id]);


  // Protocol Specific Logic (Logs, etc)
  useEffect(() => {
      const timestamp = new Date().toLocaleTimeString().split(' ')[0];
      
      if(protocol === 'FTP') {
        if (currentStep.id === 'DNS') setFtpLog([`${timestamp} Resolving ftp.server.local...`, `${timestamp} Connected to 192.168.1.50`]);
        if (currentStep.id === 'TCP') setFtpLog(prev => [...prev, `${timestamp} Connection established.`]);
        if (currentStep.id === 'REQUEST') setFtpLog(prev => [...prev, `${timestamp} > USER admin`, `${timestamp} < 331 Password required`, `${timestamp} > PASS ******`, `${timestamp} < 230 User logged in`]);
        if (currentStep.id === 'RESPONSE') setFtpLog(prev => [...prev, `${timestamp} > PASV`, `${timestamp} < 227 Entering Passive Mode`, `${timestamp} > STOR report.pdf`, `${timestamp} < 150 Opening data connection`]);
        
        if (currentStep.id === 'RENDER') {
             setFtpLog(prev => [...prev, `${timestamp} Transferring data...`]);
             setFtpTransferring(true);
             setFtpComplete(false);
             
             const timer = setTimeout(() => {
                 setFtpTransferring(false); // Hide bars
                 setFtpComplete(true);
                 setFtpLog(prev => [...prev, `${timestamp} < 226 Transfer complete`, `${timestamp} Bytes transferred: 2450`]);
             }, 3500);
             return () => clearTimeout(timer);
        }
      }
  }, [stepIndex, protocol, currentStep.id]);

  const handleNext = () => {
      if (stepIndex < currentSteps.length - 1) {
          setStepIndex(prev => prev + 1);
      }
  };

  const handleReset = () => {
      setStepIndex(0);
      setFtpLog([]);
      setFtpTransferring(false);
      setFtpComplete(false);
  };

  const switchTab = (p: Protocol) => {
      setProtocol(p);
      setStepIndex(0);
      setFtpLog([]);
      setFtpTransferring(false);
      setFtpComplete(false);
  };

  return (
    <div className="p-4 md:p-8 h-full flex flex-col items-center w-full">
      <div className="max-w-5xl w-full flex flex-col h-full">
         {/* Header */}
         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                    <Globe className="w-8 h-8 text-purple-500" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white">Layer 7: Application</h2>
                    <p className="text-slate-400">User Interface & Network Services</p>
                </div>
            </div>

            {/* Protocol Tabs */}
            <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
                <button onClick={() => switchTab('HTTP')} className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${protocol === 'HTTP' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                    <Unlock className="w-4 h-4 text-red-400" /> HTTP
                </button>
                <button onClick={() => switchTab('HTTPS')} className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${protocol === 'HTTPS' ? 'bg-green-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                    <Lock className="w-4 h-4 text-green-200" /> HTTPS
                </button>
                <button onClick={() => switchTab('FTP')} className={`px-4 py-2 rounded font-bold text-sm flex items-center gap-2 ${protocol === 'FTP' ? 'bg-orange-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}>
                    <UploadCloud className="w-4 h-4 text-white" /> FTP
                </button>
            </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col md:flex-row gap-6">
            
            {/* LEFT: Simulation Window */}
            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col relative min-h-[400px]">
                
                {/* 1. BROWSER UI (HTTP / HTTPS) */}
                {(protocol === 'HTTP' || protocol === 'HTTPS') && (
                    <>
                        {/* Browser Chrome */}
                        <div className="bg-slate-800 p-2 border-b border-slate-700 flex items-center gap-2">
                            <div className="flex gap-1.5 ml-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                            </div>
                            {/* Address Bar */}
                            <div className="flex-1 bg-slate-900 rounded-md flex items-center px-3 py-1.5 border border-slate-700 mx-2 text-xs md:text-sm">
                                {protocol === 'HTTPS' ? <Lock className="w-3 h-3 text-green-500 mr-2" /> : <Unlock className="w-3 h-3 text-red-500 mr-2" />}
                                <span className={protocol === 'HTTPS' ? 'text-green-500' : 'text-slate-500'}>{protocol.toLowerCase()}://</span>
                                <span className="text-white">google.com</span>
                            </div>
                        </div>

                        {/* Viewport (Dark Mode) */}
                        <div className="flex-1 bg-slate-950 relative flex flex-col items-center justify-center p-4">
                            {currentStep.id === 'IDLE' && <div className="text-slate-400 text-sm">Ready...</div>}
                            
                            {/* DNS Animation */}
                            {currentStep.id === 'DNS' && (
                                <div className="flex flex-col items-center w-full">
                                    <div className="mb-8 font-mono text-sm font-bold h-6">
                                        {dnsState === 'QUERYING' && <span className="text-yellow-500 animate-pulse">Looking for google.com...</span>}
                                        {dnsState === 'RESOLVED' && <span className="text-green-500">Resolved!</span>}
                                    </div>

                                    <div className="flex justify-between w-full max-w-xs items-center mb-6 relative h-12">
                                        <div className="flex flex-col items-center z-10">
                                            <Globe className="w-10 h-10 text-blue-500" />
                                            <span className="text-[10px] text-slate-500 font-bold">Client</span>
                                        </div>
                                        
                                        {/* Packets - Only show/animate during Query Phase */}
                                        {dnsState === 'QUERYING' && (
                                            <>
                                                {/* Query Packet */}
                                                <motion.div 
                                                    initial={{ left: '10%', opacity: 1 }} animate={{ left: '90%', opacity: 0 }} transition={{ duration: 0.8 }}
                                                    className="absolute top-1/2 w-3 h-3 bg-yellow-400 rounded-full"
                                                />
                                                {/* Response Packet */}
                                                <motion.div 
                                                    initial={{ right: '10%', opacity: 0 }} animate={{ right: '90%', opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
                                                    className="absolute top-1/2 w-3 h-3 bg-green-500 rounded-full"
                                                />
                                            </>
                                        )}

                                        <div className="flex flex-col items-center z-10">
                                            <Server className="w-10 h-10 text-slate-500" />
                                            <span className="text-[10px] text-slate-500 font-bold">DNS Server</span>
                                        </div>
                                    </div>
                                    <div className="h-6">
                                        {dnsState === 'RESOLVED' && (
                                            <motion.div 
                                                key="dns-text"
                                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                                className="text-center"
                                            >
                                                <div className="bg-blue-900/50 border border-blue-500/30 text-blue-200 px-4 py-2 rounded-lg font-mono font-bold shadow-sm">
                                                    IP: 142.250.190.46
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* TCP Animation */}
                            {currentStep.id === 'TCP' && (
                                <div className="flex flex-col items-center gap-4 w-full max-w-sm">
                                    <div className="flex items-center justify-between w-full">
                                         <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-500 mb-1">Client</span>
                                            <Globe className="w-10 h-10 text-blue-500" />
                                         </div>
                                         <div className="flex flex-col items-center gap-2 flex-1 mx-4">
                                            {/* Packets */}
                                            <div className="w-full h-8 relative">
                                                <motion.div initial={{ left: '0%', opacity: 0 }} animate={{ left: '100%', opacity: 1 }} transition={{ duration: 1 }} className="absolute top-0 w-6 h-4 bg-blue-500 text-[8px] text-white flex items-center justify-center rounded">SYN</motion.div>
                                                <motion.div initial={{ left: '100%', opacity: 0 }} animate={{ left: '0%', opacity: 1 }} transition={{ delay: 1, duration: 1 }} className="absolute top-0 w-8 h-4 bg-purple-500 text-[8px] text-white flex items-center justify-center rounded">S-ACK</motion.div>
                                                <motion.div initial={{ left: '0%', opacity: 0 }} animate={{ left: '100%', opacity: 1 }} transition={{ delay: 2, duration: 1 }} className="absolute top-0 w-6 h-4 bg-green-500 text-[8px] text-white flex items-center justify-center rounded">ACK</motion.div>
                                            </div>
                                            <div className="h-0.5 w-full bg-slate-700" />
                                         </div>
                                         <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-500 mb-1">Server</span>
                                            <Server className="w-10 h-10 text-slate-500" />
                                         </div>
                                    </div>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }} className="bg-green-900/30 border border-green-500/50 text-green-400 px-4 py-2 rounded text-xs font-mono w-full text-center">
                                        <div className="font-bold flex items-center justify-center gap-2"><Check className="w-3 h-3"/> CONNECTED</div>
                                    </motion.div>
                                </div>
                            )}
                            
                            {/* TLS Animation */}
                            {currentStep.id === 'TLS' && (
                                <div className="flex flex-col items-center gap-4 w-full max-w-xs h-40 justify-center">
                                    <AnimatePresence mode="wait">
                                        {tlsState === 'NEGOTIATING' ? (
                                             <motion.div 
                                                key="negotiating"
                                                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                                                className="flex flex-col items-center"
                                             >
                                                 <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                                                    <Cog className="w-16 h-16 text-blue-500" />
                                                 </motion.div>
                                                 <p className="mt-4 text-slate-400 font-bold text-sm">Establishing Secure Tunnel...</p>
                                                 <p className="text-xs text-slate-500">Exchanging Keys</p>
                                             </motion.div>
                                        ) : (
                                            <motion.div 
                                                key="cert"
                                                initial={{ rotateY: 90, opacity: 0 }}
                                                animate={{ rotateY: 0, opacity: 1 }}
                                                className="bg-slate-800 border-2 border-slate-600 p-4 rounded-lg w-full shadow-lg flex flex-col items-center"
                                            >
                                                <FileBadge className="w-12 h-12 text-yellow-500 mb-2" />
                                                <div className="text-sm font-bold text-white mb-4 border-b border-slate-600 w-full text-center pb-2">Digital Certificate</div>
                                                
                                                <div className="w-full space-y-2 text-[10px] font-mono text-slate-400">
                                                    <div className="flex justify-between">
                                                        <span className="font-bold">Issued To:</span>
                                                        <span>google.com</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-bold">Issued By:</span>
                                                        <span>GTS CA 1C3</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="font-bold">Valid Until:</span>
                                                        <span className="text-green-400">2025-12-31</span>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2 text-green-400 text-[10px] font-bold">
                                                    <Lock className="w-3 h-3" /> Encrypted Tunnel Active
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* Request/Response Animation */}
                            {(currentStep.id === 'REQUEST' || currentStep.id === 'RESPONSE') && (
                                 <div className="flex flex-col items-center w-full max-w-sm">
                                    <motion.div 
                                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        className={`w-full p-4 rounded-lg border-2 shadow-sm ${protocol === 'HTTPS' ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20'}`}
                                    >
                                        <div className="flex items-center gap-2 font-mono text-sm font-bold mb-2 pb-2 border-b border-white/10">
                                            {currentStep.id === 'REQUEST' ? <ArrowRight className="text-slate-400" /> : <ArrowRight className="rotate-180 text-slate-400" />}
                                            <span className="text-white">{currentStep.id === 'REQUEST' ? 'GET / HTTP/1.1' : 'HTTP/1.1 200 OK'}</span>
                                        </div>
                                        <div className="font-mono text-[10px] text-slate-400 space-y-1">
                                            {currentStep.id === 'REQUEST' ? (
                                                <>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Host: google.com</motion.div>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>User-Agent: Mozilla/5.0</motion.div>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>Accept: text/html</motion.div>
                                                </>
                                            ) : (
                                                <>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Content-Type: text/html</motion.div>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Server: gws</motion.div>
                                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>&lt;html&gt;&lt;body&gt;...</motion.div>
                                                </>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {currentStep.id === 'RENDER' && (
                                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full h-full flex flex-col items-center justify-center">
                                    <span className="text-4xl font-bold text-white mb-4 tracking-tighter">Google</span>
                                    <div className="w-full max-w-md h-10 rounded-full bg-slate-800 border border-slate-700 shadow-sm flex items-center px-4 text-slate-400">
                                        <Search className="w-4 h-4 mr-2" /> Search...
                                    </div>
                                    <div className="mt-8 flex gap-2">
                                        <div className="w-24 h-8 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-300 border border-slate-700">Google Search</div>
                                        <div className="w-24 h-8 bg-slate-800 rounded text-xs flex items-center justify-center text-slate-300 border border-slate-700">I'm Feeling Lucky</div>
                                    </div>
                                    {protocol === 'HTTP' && (
                                        <div className="absolute top-4 right-4 bg-red-900/30 text-red-400 px-3 py-1 rounded text-xs font-bold flex items-center gap-1 border border-red-500/30">
                                            <Unlock className="w-3 h-3" /> Not Secure
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>
                    </>
                )}

                {/* 2. FTP UI */}
                {protocol === 'FTP' && (
                    <div className="flex-1 flex flex-col bg-slate-900 font-mono text-xs">
                        
                        {/* Top: Visual Transfer Area */}
                        <div className="flex-1 flex border-b border-slate-700">
                            {/* Local */}
                            <div className="flex-1 bg-slate-800/50 p-4 border-r border-slate-700">
                                <div className="text-center font-bold text-blue-400 mb-4">LOCAL PC</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300"><Folder className="w-4 h-4 text-yellow-500" /> /home/user</div>
                                    <div className="pl-4 opacity-50"><File className="w-4 h-4" /> notes.txt</div>
                                    <div className="pl-4 text-orange-400"><File className="w-4 h-4" /> report.pdf</div>
                                </div>
                            </div>

                            {/* Animation Zone */}
                            <div className="w-32 bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
                                {currentStep.id === 'RENDER' ? (
                                    <>
                                        {/* STRICT CONDITIONAL RENDERING: Only show when actually transferring */}
                                        {ftpTransferring && (
                                            <motion.div 
                                                className="absolute flex gap-1"
                                                animate={{ x: ['-100%', '200%'] }}
                                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                            >
                                                <div className="w-4 h-6 bg-orange-500 rounded-sm opacity-50"></div>
                                                <div className="w-4 h-6 bg-orange-500 rounded-sm opacity-50"></div>
                                                <div className="w-4 h-6 bg-orange-500 rounded-sm opacity-50"></div>
                                            </motion.div>
                                        )}
                                        
                                        {!ftpComplete && !ftpTransferring && <div className="w-px h-full bg-slate-800" />}

                                        {/* Status Text */}
                                        <div className={`text-[9px] mt-8 font-bold z-10 transition-colors ${ftpTransferring ? 'text-green-500 animate-pulse' : ftpComplete ? 'text-blue-500' : 'text-slate-600'}`}>
                                            {ftpTransferring ? 'DATA CHANNEL (20)' : ftpComplete ? 'DONE' : 'IDLE'}
                                        </div>
                                    </>
                                ) : (
                                    <div className="w-px h-full bg-slate-800" />
                                )}
                            </div>

                            {/* Remote */}
                            <div className="flex-1 bg-slate-800/50 p-4 border-l border-slate-700">
                                <div className="text-center font-bold text-green-400 mb-4">REMOTE SERVER</div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-slate-300"><Folder className="w-4 h-4 text-yellow-500" /> /var/www</div>
                                    {currentStep.id === 'RENDER' && ftpComplete && (
                                        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="pl-4 text-orange-400">
                                            <File className="w-4 h-4" /> report.pdf
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Bottom: Command Log (Control Channel) */}
                        <div className="h-40 bg-black p-4 overflow-y-auto font-mono text-green-500 border-t-2 border-slate-700 shadow-inner">
                            <div className="flex items-center gap-2 mb-2 text-slate-500 border-b border-slate-800 pb-1">
                                <Terminal className="w-3 h-3" />
                                <span className="text-[10px] font-bold">FTP CONTROL CHANNEL (PORT 21)</span>
                            </div>
                            <div className="space-y-1">
                                {ftpLog.map((line, i) => (
                                    <div key={i} className={`text-[10px] ${line.includes('>') ? 'text-blue-400' : line.includes('<') ? 'text-green-400' : 'text-slate-500'}`}>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* RIGHT: Controls & Info */}
            <div className="w-full md:w-72 bg-slate-800 border border-slate-700 rounded-xl p-6 flex flex-col">
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Current Step</h3>
                    <div className="text-xl font-bold text-white mb-1">{currentStep.label}</div>
                    <div className="text-sm text-slate-400 leading-relaxed">{currentStep.desc}</div>
                </div>

                <div className="flex-1">
                    {/* Step Indicators */}
                    <div className="space-y-4 relative">
                        <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-slate-700" />
                        {currentSteps.map((s, idx) => (
                            <div key={idx} className="flex items-center gap-3 relative z-10">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-colors ${
                                    idx === stepIndex ? 'bg-blue-600 border-blue-500 text-white' : 
                                    idx < stepIndex ? 'bg-green-500 border-green-500 text-slate-900' :
                                    'bg-slate-900 border-slate-600 text-slate-600'
                                }`}>
                                    {idx + 1}
                                </div>
                                <span className={`text-xs ${idx === stepIndex ? 'text-white font-bold' : 'text-slate-500'}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-700">
                    {stepIndex < currentSteps.length - 1 ? (
                        <button 
                            onClick={handleNext}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-95"
                        >
                            {stepIndex === 0 ? 'Start Request' : 'Next Step'} <SkipForward className="w-4 h-4" />
                        </button>
                    ) : (
                         <button 
                            onClick={handleReset}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            Restart <RefreshCw className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Layer7Application;
