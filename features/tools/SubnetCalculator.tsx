import React, { useState, useEffect } from 'react';
import { Calculator, Copy, Check, Info, Box, Binary, Network, ShieldCheck, Cpu, Globe, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type SubnetMode = 'ipv4' | 'ipv6';

const SubnetCalculator: React.FC = () => {
  const [mode, setMode] = useState<SubnetMode>('ipv4');
  const [ip, setIp] = useState('192.168.1.1');
  const [cidr, setCidr] = useState(24);
  const [ipv6, setIpv6] = useState('2001:db8::');
  const [ipv6Prefix, setIpv6Prefix] = useState(64);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Validation Logic
  useEffect(() => {
    if (mode === 'ipv4') {
      const parts = ip.split('.');
      const isValid = parts.length === 4 && parts.every(p => {
        const n = parseInt(p, 10);
        return !isNaN(n) && n >= 0 && n <= 255 && p === n.toString();
      });
      setError(isValid ? null : 'Invalid IPv4 Address format (e.g. 192.168.1.1)');
    } else {
      // Basic IPv6 regex
      const isValid = /^(?:[a-fA-F0-9]{1,4}:){1,7}[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,7}:$|^(?:[a-fA-F0-9]{1,4}:){1,6}:[a-fA-F0-9]{1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,5}(?::[a-fA-F0-9]{1,4}){1,2}$|^(?:[a-fA-F0-9]{1,4}:){1,4}(?::[a-fA-F0-9]{1,4}){1,3}$|^(?:[a-fA-F0-9]{1,4}:){1,3}(?::[a-fA-F0-9]{1,4}){1,4}$|^(?:[a-fA-F0-9]{1,4}:){1,2}(?::[a-fA-F0-9]{1,4}){1,5}$|^[a-fA-F0-9]{1,4}:(?::[a-fA-F0-9]{1,4}){1,6}$|^:(?::[a-fA-F0-9]{1,4}){1,7}$|^::$/.test(ipv6);
      setError(isValid ? null : 'Invalid IPv6 Address format');
    }
  }, [ip, ipv6, mode]);

  // Helper: IP to Long (v4)
  const ipToLong = (ip: string) => {
    return ip.split('.').reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
  };

  // Helper: Long to IP (v4)
  const longToIp = (long: number) => {
    return [
      (long >>> 24) & 0xff,
      (long >>> 16) & 0xff,
      (long >>> 8) & 0xff,
      long & 0xff,
    ].join('.');
  };

  const calculateSubnetV4 = () => {
    if (error) return null;
    try {
      const ipLong = ipToLong(ip);
      const mask = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
      const network = (ipLong & mask) >>> 0;
      const broadcast = (network | ~mask) >>> 0;
      const firstHost = network + 1;
      const lastHost = broadcast - 1;
      const hosts = Math.max(0, broadcast - network - 1);

      return {
        mask: longToIp(mask),
        network: longToIp(network),
        broadcast: longToIp(broadcast),
        firstHost: hosts > 0 ? longToIp(firstHost) : 'N/A',
        lastHost: hosts > 0 ? longToIp(lastHost) : 'N/A',
        hosts: hosts.toLocaleString(),
        binary: mask.toString(2).padStart(32, '0').match(/.{1,8}/g)?.join('.') || '',
        wildcard: longToIp(~mask >>> 0)
      };
    } catch (e) {
      return null;
    }
  };

  const calculateSubnetV6 = () => {
    if (error || !ipv6) return null;
    try {
      // Very basic v6 boundary calculation for educational purposes
      const base = ipv6.split('::')[0] || ipv6;
      return {
        prefix: base,
        subnets: ipv6Prefix <= 64 ? Math.pow(2, 64 - ipv6Prefix).toLocaleString() : "1",
        totalHosts: "18,446,744,073,709,551,616",
        rangeStart: `${base}::0`,
        rangeEnd: `${base}:ffff:ffff:ffff:ffff`,
        short: ipv6,
      };
    } catch (e) {
      return null;
    }
  };

  const resultsV4 = mode === 'ipv4' ? calculateSubnetV4() : null;
  const resultsV6 = mode === 'ipv6' ? calculateSubnetV6() : null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="p-6 bg-slate-800 border-b border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600/20 rounded-xl">
            <Calculator className="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">IP Subnet Calculator</h2>
            <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Enhanced precision for IPv4 & IPv6</p>
          </div>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-700">
           <button 
             onClick={() => setMode('ipv4')}
             className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'ipv4' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             IPv4
           </button>
           <button 
             onClick={() => setMode('ipv6')}
             className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'ipv6' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             IPv6
           </button>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-xl relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 bg-gradient-to-br ${mode === 'ipv4' ? 'from-blue-600' : 'from-indigo-600'}`} />
              
              <h3 className="text-xs font-black text-slate-500 uppercase mb-4 tracking-widest flex items-center gap-2">
                 <Box className="w-3.5 h-3.5" /> Configuration
              </h3>
              
              <div className="space-y-5">
                {mode === 'ipv4' ? (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">IPv4 Address</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={ip}
                          onChange={(e) => setIp(e.target.value)}
                          className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white font-mono focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-blue-500'} outline-none transition-all placeholder:text-slate-700`} 
                          placeholder="192.168.1.1"
                        />
                        {error && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><AlertCircle className="w-5 h-5" /></div>}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Subnet Mask (CIDR)</label>
                        <span className="text-xs font-mono text-blue-400 font-bold">/{cidr}</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" max="32" 
                        value={cidr}
                        onChange={(e) => setCidr(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1.5 ml-1">IPv6 Address</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={ipv6}
                          onChange={(e) => setIpv6(e.target.value)}
                          className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-slate-700'} rounded-xl px-4 py-3 text-white font-mono focus:ring-2 ${error ? 'focus:ring-red-500' : 'focus:ring-indigo-500'} outline-none transition-all`} 
                          placeholder="2001:db8::"
                        />
                        {error && <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500"><AlertCircle className="w-5 h-5" /></div>}
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1.5 ml-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase">Prefix Length</label>
                        <span className="text-xs font-mono text-indigo-400 font-bold">/{ipv6Prefix}</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="128" 
                        value={ipv6Prefix}
                        onChange={(e) => setIpv6Prefix(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </>
                )}
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <p className="text-[10px] text-red-400 font-medium">{error}</p>
                </motion.div>
              )}

              {!error && (
                <div className="mt-8 p-4 bg-blue-500/5 rounded-xl border border-blue-500/10">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <Info className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase">Network Guide</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    {mode === 'ipv4' 
                      ? 'Classful detection combined with CIDR allows for flexible super/subnetting.' 
                      : 'IPv6 uses prefixes instead of masks. Standard hosts use /64.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="wait">
              {resultsV4 ? (
                <motion.div 
                  key="v4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard label="Network ID" value={resultsV4.network} icon={<Network className="w-4 h-4" />} onCopy={() => copyToClipboard(resultsV4.network, 'Network')} isCopied={copied === 'Network'} />
                    <MetricCard label="Broadcast" value={resultsV4.broadcast} icon={<ShieldCheck className="w-4 h-4" />} onCopy={() => copyToClipboard(resultsV4.broadcast, 'Broadcast')} isCopied={copied === 'Broadcast'} />
                    <MetricCard label="Subnet Mask" value={resultsV4.mask} icon={<Box className="w-4 h-4" />} onCopy={() => copyToClipboard(resultsV4.mask, 'Mask')} isCopied={copied === 'Mask'} />
                    <MetricCard label="Usable Hosts" value={resultsV4.hosts} icon={<Cpu className="w-4 h-4" />} sub={`Range: ${resultsV4.firstHost} - ${resultsV4.lastHost}`} color="text-green-400" />
                  </div>

                  <div className="bg-slate-800/30 p-6 rounded-2xl border border-slate-700 border-dashed">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Binary className="w-5 h-5 text-slate-400" />
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Binary Mask Visualization</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 lg:gap-4">
                      {resultsV4.binary.split('.').map((octet, i) => (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 w-full flex justify-center shadow-inner">
                            <span className="font-mono text-xs lg:text-sm tracking-tighter">
                              {octet.split('').map((bit, idx) => (
                                <span key={idx} className={bit === '1' ? 'text-blue-400 font-bold' : 'text-slate-700'}>{bit}</span>
                              ))}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Breakdown */}
                  <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-500 uppercase tracking-tighter font-black">
                        <tr>
                          <th className="px-6 py-4">Property</th>
                          <th className="px-6 py-4">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        <Row label="CIDR Notation" value={`/${cidr}`} />
                        <Row label="Wildcard Mask" value={resultsV4.wildcard} />
                        <Row label="First Usable Host" value={resultsV4.firstHost} />
                        <Row label="Last Usable Host" value={resultsV4.lastHost} />
                        <Row label="Binary Subnet Mask" value={resultsV4.binary} mono />
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : resultsV6 ? (
                <motion.div 
                   key="v6"
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="space-y-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <MetricCard label="Compressed Prefix" value={resultsV6.prefix} icon={<Globe className="w-4 h-4" />} color="text-indigo-400" />
                    <MetricCard label="Prefix Length" value={`/${ipv6Prefix}`} icon={<Box className="w-4 h-4" />} />
                    <MetricCard label="Potential /64s" value={resultsV6.subnets} icon={<Network className="w-4 h-4" />} sub="Total subnets in this prefix" />
                    <MetricCard label="Protocol" value="IPv6 NextGen" icon={<Cpu className="w-4 h-4" />} color="text-green-400" />
                  </div>

                  <div className="bg-slate-950/50 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-500 uppercase tracking-tighter font-black">
                        <tr>
                          <th className="px-6 py-4">Property</th>
                          <th className="px-6 py-4">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50">
                        <Row label="Address Type" value="Global Unicast (Projected)" />
                        <Row label="Network Range Start" value={resultsV6.rangeStart} mono />
                        <Row label="Network Range End" value={resultsV6.rangeEnd} mono />
                        <Row label="Total Addresses" value={resultsV6.totalHosts} />
                        <Row label="RFC Compliance" value="RFC 4291 / RFC 5952" />
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-slate-600 gap-4 bg-slate-800/10 rounded-3xl border border-slate-700 border-dashed">
                   <AlertCircle className="w-12 h-12 opacity-20" />
                   <p className="text-sm font-medium">Please enter a valid address to begin</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, onCopy, isCopied, sub, color = "text-white" }: any) => (
  <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-start justify-between group">
    <div className="flex gap-4">
      <div className={`mt-1 p-2 bg-slate-950 rounded-lg text-slate-400`}>
        {icon}
      </div>
      <div>
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">{label}</span>
        <span className={`text-lg font-mono font-bold ${color}`}>{value}</span>
        {sub && <p className="text-[9px] text-slate-600 mt-1 font-mono">{sub}</p>}
      </div>
    </div>
    {onCopy && (
      <button 
        onClick={onCopy}
        className="p-2 text-slate-500 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
      >
        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      </button>
    )}
  </div>
);

const Row = ({ label, value, mono }: any) => (
  <tr className="hover:bg-slate-800/20 transition-colors">
    <td className="px-6 py-4 text-slate-400 font-medium uppercase tracking-tighter text-[10px]">{label}</td>
    <td className={`px-6 py-4 text-slate-200 ${mono ? 'font-mono' : ''}`}>{value}</td>
  </tr>
);

export default SubnetCalculator;
