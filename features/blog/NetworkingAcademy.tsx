import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Layers, 
  Network, 
  Shield, 
  Terminal, 
  Cpu, 
  Globe, 
  Info, 
  ChevronRight, 
  ArrowLeft,
  ExternalLink,
  Code,
  Zap,
  Activity,
  Box,
  Monitor,
  Calculator,
  ArrowRight
} from 'lucide-react';

interface Article {
  id: string;
  title: string;
  icon: React.ReactNode;
  category: string;
  content: React.ReactNode;
}

interface NetworkingAcademyProps {
  onNavigate?: (view: string) => void;
}

const NetworkingAcademy: React.FC<NetworkingAcademyProps> = ({ onNavigate }) => {
  const [selectedArticle, setSelectedArticle] = useState<string>('intro');

  const articles: Article[] = [
    {
      id: 'intro',
      category: 'Certification Path',
      icon: <Shield className="w-5 h-5" />,
      title: 'Why CCNA & Network+ Matter in 2026',
      content: (
        <article className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white">The Evolving IT Landscape</h2>
            <p className="text-slate-300 leading-relaxed">
              As we navigate through May 2026, the demand for certified networking professionals has reached an all-time high. The shift towards <strong>Distributed Cloud Architectures</strong>, <strong>SASE (Secure Access Service Edge)</strong>, and <strong>Multi-Cloud environments</strong> has not made basic networking obsolete—it has made deep understanding of the fundamentals more critical.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm">
              Today's "Network Engineer" is often a hybrid role, blending traditional CLI knowledge with Python-based automation and AI-driven observability. However, you cannot automate what you don't understand conceptually. This is where CompTIA and Cisco provide the "DNA" of your career.
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
              <h3 className="font-black text-blue-400 mb-3 tracking-widest uppercase text-[10px]">The Generalist: CompTIA Network+</h3>
              <p className="text-xs text-slate-400 leading-loose">
                Exam code <strong>N10-009</strong> covers the vendor-neutral landscape. It is the "What is" of networking. If you are pursuing <strong>CompTIA A+</strong> or <strong>Security+</strong>, this is the bridge that connects hardware to security. 
                <br/><br/>
                <strong className="text-slate-300">Key Focus Areas:</strong> 
                Troubleshooting methodologies, Wireless standards (Wi-Fi 7), and basic security hardening.
              </p>
            </div>
            <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 hover:border-indigo-500/30 transition-colors">
              <h3 className="font-black text-indigo-400 mb-3 tracking-widest uppercase text-[10px]">The Specialist: Cisco CCNA</h3>
              <p className="text-xs text-slate-400 leading-loose">
                Exam code <strong>200-301 v1.1</strong> is the "How to" of networking. It proves you can actually sit in front of a Cisco Catalyst 9000 or Nexus switch and execute.
                <br/><br/>
                <strong className="text-slate-300">Key Focus Areas:</strong> 
                IP Connectivity (OSPFv2), IP Services (NAT, DHCP, NTP), and Automation/Programmability (JSON, Puppet, Chef).
              </p>
            </div>
          </section>

          <section className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-2xl">
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" /> Career Trajectory in 2026
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-1 bg-blue-500 rounded-full" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Security Analyst (Blue Teaming)</h4>
                  <p className="text-[11px] text-slate-500">Must understand packet encapsulation to detect exfiltration in PCAP files.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-indigo-500 rounded-full" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Penetration Tester (Red Teaming)</h4>
                  <p className="text-[11px] text-slate-500">Requires mastery of Layer 2 protocols for ARP poisoning and VLAN hopping attacks.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-cyan-500 rounded-full" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Cloud Architect</h4>
                  <p className="text-[11px] text-slate-500">Direct Connect and VPC Peering rely entirely on BGP and Layer 3 routing logic.</p>
                </div>
              </div>
            </div>
          </section>
        </article>
      )
    },
    {
      id: 'osi',
      category: 'Fundamentals',
      icon: <Layers className="w-5 h-5" />,
      title: 'The OSI Model: 7 Layers of Reality',
      content: (
        <article className="space-y-10">
          <header className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              The Open Systems Interconnection (OSI) model is more than an exam topic; it is a <strong>universal framework for troubleshooting</strong>. When a user says "the internet is slow," a professional engineer starts at Layer 1 and works up.
            </p>
            <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-lg border border-slate-700 w-fit">
               <Info className="w-4 h-4 text-blue-400" />
               <span className="text-[10px] font-mono text-slate-300">MNEMONIC: Please Do Not Throw Sausage Pizza Away</span>
            </div>
          </header>

          <div className="space-y-4">
            {[
              { l: 7, n: 'Application', p: 'HTTP, DNS, SMTP, FTP', d: 'User interface. Data is called "Data".', r: 'Opening a browser and typing mohammadlotfi.com.', c: 'from-pink-500 to-rose-600' },
              { l: 6, n: 'Presentation', p: 'JPEG, GIF, MPEG, TLS', d: 'Encryption & Compression. Data is called "Data".', r: 'The browser decrypting an HTTPS stream into visible text.', c: 'from-purple-500 to-indigo-600' },
              { l: 5, n: 'Session', p: 'NetBIOS, SAP, RPC', d: 'Session Tracking. Data is called "Data".', r: 'The connection staying alive while you switch tabs.', c: 'from-indigo-500 to-blue-600' },
              { l: 4, n: 'Transport', p: 'TCP (Reliable), UDP (Fast)', d: 'Error correction & Port numbers. Data is called "Segments" or "Datagrams".', r: 'A video stream skipping a frame (UDP) or a file transfer retrying a lost block (TCP).', c: 'from-blue-500 to-cyan-600' },
              { l: 3, n: 'Network', p: 'IPv4, IPv6, ICMP, IPSec', d: 'Path determination & Logical addressing. Data is called "Packets".', r: 'A router choosing the fastest path through 10 hops to reachable destination.', c: 'from-cyan-500 to-teal-600' },
              { l: 2, n: 'Data Link', p: 'Ethernet, 802.11, HDLC', d: 'MAC addresses and switching. Data is called "Frames".', r: 'A switch looking at a source MAC and building its CAM table.', c: 'from-teal-500 to-green-600' },
              { l: 1, n: 'Physical', p: 'RJ45, VDSL, Fiber, 5G', d: 'Medium, connectors, and electrical signaling. Data is called "Bits".', r: 'Light traveling through a 100Gbps fiber optic line.', c: 'from-orange-500 to-amber-600' },
            ].map((layer) => (
              <motion.div 
                key={layer.l}
                whileHover={{ x: 5 }}
                className="group relative flex flex-col md:flex-row gap-6 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-600 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${layer.c} flex items-center justify-center font-black text-white shrink-0 shadow-lg`}>
                   {layer.l}
                </div>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <h4 className="text-lg font-bold text-white">{layer.n} Layer</h4>
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{layer.p}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed"><strong className="text-white">PDU:</strong> {layer.d}</p>
                  <p className="text-[11px] text-slate-500 italic"><strong className="font-bold uppercase text-[9px] not-italic mr-2">Real World:</strong> {layer.r}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <section className="bg-indigo-600/10 p-8 rounded-3xl border border-indigo-500/20 text-center">
            <h3 className="text-lg font-bold text-white mb-2">The "Layer 8" Phenomenon</h3>
            <p className="text-sm text-slate-400 italic">"In the industry, when we say it's a Layer 8 issue, we're jokingly referring to the human factor—user error or political hurdles that no firewall can fix."</p>
          </section>
        </article>
      )
    },
    {
      id: 'tcpip',
      category: 'Fundamentals',
      icon: <Network className="w-5 h-5" />,
      title: 'TCP/IP vs OSI: Protocol Wars',
      content: (
        <article className="space-y-8">
          <p className="text-slate-300 leading-relaxed">
            While academic institutions love the OSI model for its granularity, <strong>Modern Networking</strong> runs almost exclusively on the <strong>TCP/IP Model (DoD Model)</strong>. To succeed in 2026, you must understand how these two maps overlap when troubleshooting production incidents.
          </p>

          <div className="bg-slate-950 p-8 rounded-[40px] border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <Network className="w-48 h-48 rotate-12" />
            </div>
            
            <div className="relative z-10 grid grid-cols-2 gap-12">
               <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 text-center">OSI Approach</h5>
                  <div className="h-40 flex items-center justify-center bg-blue-500/5 border border-blue-500/20 rounded-xl text-[10px] text-blue-400 font-bold p-4 text-center">APPLICATION<br/>PRESENTATION<br/>SESSION</div>
                  <div className="h-14 flex items-center justify-center bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-[10px] text-indigo-400 font-bold">TRANSPORT</div>
                  <div className="h-14 flex items-center justify-center bg-cyan-500/5 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-400 font-bold">NETWORK</div>
                  <div className="h-28 flex items-center justify-center bg-green-500/5 border border-green-500/20 rounded-xl text-[10px] text-green-400 font-bold p-4 text-center">DATA LINK<br/>PHYSICAL</div>
               </div>
               <div className="space-y-2">
                  <h5 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-4 text-center">TCP/IP Reality</h5>
                  <div className="h-40 flex items-center justify-center bg-blue-500/20 border border-blue-500/50 rounded-xl text-xs text-white font-black shadow-lg shadow-blue-500/10">APPLICATION</div>
                  <div className="h-14 flex items-center justify-center bg-indigo-500/20 border border-indigo-500/50 rounded-xl text-xs text-white font-black shadow-lg shadow-indigo-500/10">TRANSPORT</div>
                  <div className="h-14 flex items-center justify-center bg-cyan-500/20 border border-cyan-500/50 rounded-xl text-xs text-white font-black shadow-lg shadow-cyan-500/10">INTERNET</div>
                  <div className="h-28 flex items-center justify-center bg-green-500/20 border border-green-500/50 rounded-xl text-xs text-white font-black shadow-lg shadow-green-500/10">NETWORK ACCESS</div>
               </div>
            </div>
          </div>

          <section className="space-y-4">
            <h3 className="text-white font-bold">Why the difference matters?</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Standard routers and switches (Layer 2 and 3) don't care about the difference between a JPEG and a GIF. To them, it's just "Application Data." However, for a <strong>Next-Gen Firewall (NGFW)</strong>, the split between Session and Application is vital for deep packet inspection (DPI).
              <br/><br/>
              If you're studying for <strong>Comptia Network+</strong>, memorize the 4-layer model but troubleshoot with the 7-layer model.
            </p>
          </section>
        </article>
      )
    },
    {
      id: 'subnetting',
      category: 'IPv4 Mastery',
      icon: <Box className="w-5 h-5" />,
      title: 'IP Addressing & Subnetting Basics',
      content: (
        <article className="space-y-10">
          <section className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              An IPv4 address is composed of <strong>32 bits</strong>, organized into four 8-bit <strong>octets</strong>. While we see decimal numbers (192.168.1.1), the computers see binary strings. Subnetting is the art of borrowing bits from the "Host" portion of the address to create more "Networks."
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Class A</h5>
                <p className="text-lg font-black text-white">0.0.0.0 - 127.255.255.255</p>
                <p className="text-[10px] text-slate-500">Default Mask: 255.0.0.0 (/8)</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Class B</h5>
                <p className="text-lg font-black text-white">128.0.0.0 - 191.255.255.255</p>
                <p className="text-[10px] text-slate-500">Default Mask: 255.255.0.0 (/16)</p>
            </div>
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <h5 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Class C</h5>
                <p className="text-lg font-black text-white">192.0.0.0 - 223.255.255.255</p>
                <p className="text-[10px] text-slate-500">Default Mask: 255.255.255.0 (/24)</p>
            </div>
          </div>

          <section className="bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-6">
            <h4 className="text-white font-bold flex items-center gap-2">
               <Calculator className="w-5 h-5 text-blue-400" /> Essential Formulas for Exam day
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[10px] font-black text-slate-500 uppercase mb-2">Number of Subnets</span>
                  <p className="text-xl font-mono text-blue-400">2<sup>n</sup></p>
                  <p className="text-[10px] text-slate-500">n = bits borrowed</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="block text-[10px] font-black text-slate-500 uppercase mb-2">Hosts per Subnet</span>
                  <p className="text-xl font-mono text-indigo-400">2<sup>h</sup> - 2</p>
                  <p className="text-[10px] text-slate-500">h = remaining host bits (-2 for Net ID & Broadcast)</p>
               </div>
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="text-white font-bold">Why the "-2" matters?</h3>
             <p className="text-sm text-slate-400 leading-relaxed">
               Every subnet requires two sacred addresses: The <strong>Network ID</strong> (the first address, identifying the network itself) and the <strong>Broadcast Address</strong> (the last address, used to talk to everyone on that net). If you assign 192.168.1.0 to a PC, it simply won't work.
             </p>
          </section>

          <button 
             onClick={() => onNavigate?.('calculator')}
             className="w-full flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[28px] text-white shadow-2xl group transition-all hover:scale-[1.01] active:scale-95"
          >
             <div className="text-left">
                <h4 className="text-xl font-black italic tracking-tighter">MASTER THE MATH</h4>
                <p className="text-xs opacity-70 font-bold uppercase tracking-widest">Interactive IPv4 & IPv6 Calculator</p>
             </div>
             <div className="bg-white/20 p-4 rounded-2xl group-hover:bg-white/30 transition-colors">
                <ArrowRight className="w-6 h-6" />
             </div>
          </button>
        </article>
      )
    },
    {
      id: 'vlans',
      category: 'Layer 2 Switching',
      icon: <Zap className="w-5 h-5" />,
      title: 'VLANs: Logical Isolation & 802.1Q',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              In a flat network, every device hears every broadcast. This is a security nightmare and a performance bottleneck. <strong>VLANs</strong> allow you to slice a single physical switch into multiple virtual ones, keeping "Marketing" away from "Engineering" without buying new hardware.
            </p>
          </section>

          <div className="space-y-4">
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                  <h4 className="text-indigo-400 font-bold mb-3 flex items-center gap-2">
                     <Shield className="w-4 h-4" /> The Security Angle
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Segmentation is the first step of <strong>Zero Trust</strong>. By isolating Guest Wi-Fi on a separate VLAN, you ensure that a compromised personal phone cannot scan your internal server farm.
                  </p>
              </div>
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl">
                  <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                     <Monitor className="w-4 h-4" /> The Performance Angle
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    By limiting the <strong>Broadcast Domain</strong>, you reduce the "noise" each CPU has to process. In 2026, with high-density IoT devices, this is crucial for maintaining network stability.
                  </p>
              </div>
          </div>

          <section className="bg-slate-950 p-8 rounded-[40px] border border-slate-800">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Essential CLI Cheat Sheet (Cisco)</h4>
             <div className="bg-slate-900 p-6 rounded-2xl font-mono text-xs text-blue-400 space-y-4">
                <div>
                   <p className="text-slate-600 mb-1"># Create a VLAN</p>
                   <p>S1(config)# <span className="text-white">vlan 10</span></p>
                   <p>S1(config-vlan)# <span className="text-white">name SALES</span></p>
                </div>
                <div>
                   <p className="text-slate-600 mb-1"># Assign Port to VLAN</p>
                   <p>S1(config)# <span className="text-white">interface f0/1</span></p>
                   <p>S1(config-if)# <span className="text-white">switchport mode access</span></p>
                   <p>S1(config-if)# <span className="text-white">switchport access vlan 10</span></p>
                </div>
                <div>
                   <p className="text-slate-600 mb-1"># Configure a Trunk Link (802.1Q)</p>
                   <p>S1(config)# <span className="text-white">interface g0/1</span></p>
                   <p>S1(config-if)# <span className="text-white">switchport mode trunk</span></p>
                </div>
             </div>
          </section>

          <div className="p-8 bg-indigo-600/10 rounded-3xl border border-indigo-500/20">
             <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="flex-1 space-y-2">
                   <h4 className="text-white font-bold">Try it Yourself</h4>
                   <p className="text-xs text-slate-400">Our L2 Simulator allows you to simulate switching logic, see MAC table populating, and understand frame flow in real-time.</p>
                </div>
                <button 
                   onClick={() => onNavigate?.('simulator')}
                   className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl whitespace-nowrap"
                >
                   Launch Lab
                </button>
             </div>
          </div>
        </article>
      )
    },
    {
      id: 'routing',
      category: 'Layer 3 Routing',
      icon: <Globe className="w-5 h-5" />,
      title: 'How Routers Rule the World',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              If Switches are the local connectors, Routers are the <strong>Global Navigators</strong>. A router's job is simple but profound: Look at a packet, compare its destination IP to the local Routing Table, and shove it out the "Best" exit. 
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="p-6 bg-slate-800/20 rounded-2xl space-y-4">
                <h4 className="text-blue-400 font-bold text-sm">Static Routing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Hand-coded routes. Perfect for simple networks or small stubs. It never changes unless an admin tells it to. Low overhead, high manual effort.</p>
                <code className="text-[10px] text-white bg-black/40 p-2 block rounded">ip route 10.0.0.0 255.255.0.0 192.168.1.1</code>
             </div>
             <div className="p-6 bg-slate-800/20 rounded-2xl space-y-4">
                <h4 className="text-indigo-400 font-bold text-sm">Dynamic Routing</h4>
                <p className="text-xs text-slate-400 leading-relaxed">Protocols (OSPF, EIGRP, BGP) that allow routers to "talk" to each other and automatically find new paths if a link goes down.</p>
                <div className="flex gap-2">
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold">OSPF</span>
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold">BGP</span>
                   <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[9px] font-bold">IS-IS</span>
                </div>
             </div>
          </div>

          <section className="bg-slate-950 p-8 rounded-[40px] border border-slate-800">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Universal Troubleshooting Commands</h4>
             <table className="w-full text-left text-xs">
                <thead>
                   <tr className="text-slate-600 border-b border-slate-800">
                      <th className="pb-4 px-2">Task</th>
                      <th className="pb-4 px-2">OS (Windows/CLI)</th>
                      <th className="pb-4 px-2">Cisco IOS</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                   <tr className="text-slate-300">
                      <td className="py-4 px-2 font-bold">View Tables</td>
                      <td className="py-4 px-2 font-mono text-[10px]">route print</td>
                      <td className="py-4 px-2 font-mono text-[10px]">show ip route</td>
                   </tr>
                   <tr className="text-slate-300">
                      <td className="py-4 px-2 font-bold">Test Path</td>
                      <td className="py-4 px-2 font-mono text-[10px]">tracert 1.1.1.1</td>
                      <td className="py-4 px-2 font-mono text-[10px]">traceroute 1.1.1.1</td>
                   </tr>
                   <tr className="text-slate-300">
                      <td className="py-4 px-2 font-bold">Verify IP</td>
                      <td className="py-4 px-2 font-mono text-[10px]">ipconfig</td>
                      <td className="py-4 px-2 font-mono text-[10px]">show ip int brief</td>
                   </tr>
                </tbody>
             </table>
          </section>

          <footer className="text-center p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-sm text-slate-400 italic">"Always remember the AD (Administrative Distance). It's the trust level a router has for a routing source. Connected is 0, Static is 1, OSPF is 110."</p>
          </footer>
        </article>
      )
    },
    {
      id: 'ai-networking',
      category: '2026 Trends',
      icon: <Cpu className="w-5 h-5" />,
      title: 'AI, Automation & SDN',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Networking in 2026 is no longer just about "set interface description." <strong>Software-Defined Networking (SDN)</strong> has abstracted the Control Plane away from the Data Plane, allowing for massive scale and AI-driven management.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-6">
                <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-3xl">
                   <h4 className="text-blue-400 font-bold mb-2">Intent-Based Networking</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">Instead of configuring individual routers, you push "Policies" from a central controller (like Cisco DNA Center). The system automatically translates your intent into syntax across 1,000 devices.</p>
                </div>
                <div className="p-6 bg-indigo-600/5 border border-indigo-500/20 rounded-3xl">
                   <h4 className="text-indigo-400 font-bold mb-2">AIOps Observability</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">AI models now analyze telemetry in real-time to detect anomalous patterns that might signify a dDoS attack or a failing transciever hours before it happens.</p>
                </div>
             </div>
             
             <div className="bg-slate-950 p-8 rounded-[40px] border border-slate-800 flex flex-col justify-center">
                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 text-center">Tech Stack for 2026</h5>
                <div className="space-y-3">
                   {[
                     { n: 'Python / Netmiko', l: 'The scripting baseline.' },
                     { n: 'JSON / YAML', l: 'The data language of APIs.' },
                     { n: 'Ansible / Terraform', l: 'Infrastructure as Code.' },
                     { n: 'LLMs for Config', l: 'Generated syntax validation.' }
                   ].map(item => (
                     <div key={item.n} className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-white/5">
                        <span className="text-xs font-bold text-slate-200">{item.n}</span>
                        <span className="text-[9px] text-slate-500 uppercase font-mono">{item.l}</span>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <p className="text-center text-sm text-slate-500 italic">"The future isn't AI replacing pilots; it's AI acting as the autopilot while the Engineer remains the Captain."</p>
        </article>
      )
    },
    {
      id: 'packettracker',
      category: 'Lab Tools',
      icon: <Monitor className="w-5 h-5" />,
      title: 'Packet Tracer: The Proving Grounds',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              Cisco Packet Tracer is the <strong>Flight Simulator</strong> for Network Engineers. It allows you to build complex topologies with zero hardware cost. For anyone serious about the CCNA, this tool is non-negotiable.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="space-y-8">
                <div className="space-y-2">
                   <h4 className="text-white font-bold flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-blue-400" /> Professional Setup
                   </h4>
                   <p className="text-xs text-slate-400 leading-relaxed">Always use the latest version from Cisco's Networking Academy. Ensure you have a NetAcad account to save your `.pkt` lab files.</p>
                </div>
                <div className="space-y-4">
                   <h4 className="text-white font-bold">Key UI Areas to Master</h4>
                   <div className="space-y-2">
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                         <strong className="text-blue-400">Logical View:</strong> Where you draw lines and drag boxes.
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                         <strong className="text-indigo-400">Simulation Mode:</strong> The "Holy Grail" - it slows down time so you can watch PDU headers change at each hop.
                      </div>
                      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                         <strong className="text-green-400">Physical View:</strong> Place your devices in racks and run "patch cables" to simulate real data centers.
                      </div>
                   </div>
                </div>
             </div>
             
             <div className="p-8 bg-blue-600 border border-blue-400 rounded-[40px] text-white shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <Terminal className="w-32 h-32" />
                </div>
                <h4 className="text-2xl font-black italic tracking-tighter mb-4">THE LAB MENTALITY</h4>
                <p className="text-sm font-bold opacity-90 leading-relaxed mb-6">"Don't just follow tutorials. Break things. Turn off an interface. Delete a VLAN. Watch the network fail, and then use the CLI to find out why. That is how you become an Engineer."</p>
                <div className="text-[10px] uppercase font-black tracking-widest opacity-60">MLA ACADEMY PHILOSOPHY</div>
             </div>
          </div>
        </article>
      )
    },
    {
      id: 'lab1',
      category: 'Hands-on Lab',
      icon: <Terminal className="w-5 h-5" />,
      title: 'Lab 1: L2 Switching Mastery',
      content: (
        <article className="space-y-12">
          <header className="p-8 bg-slate-950 border border-slate-800 rounded-[32px] text-center">
             <h2 className="text-2xl font-black text-white mb-2">Baseline Connectivity</h2>
             <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Difficulty: Beginner • Estimated Time: 15 mins</p>
          </header>

          <section className="space-y-6">
             <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-black text-white shrink-0 shadow-lg">1</div>
                <div className="space-y-2">
                   <h4 className="text-white font-bold">Build the Topology</h4>
                   <p className="text-sm text-slate-400">Drag a 2960 switch and two PCs onto the canvass. Connect PC0 to Fa0/1 and PC1 to Fa0/2 using copper straight-through cables.</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center font-black text-white shrink-0 shadow-lg">2</div>
                <div className="space-y-2">
                   <h4 className="text-white font-bold">The Addressing Plan</h4>
                   <p className="text-sm text-slate-400">Set PC0 to 192.168.1.10/24 and PC1 to 192.168.1.11/24. Leave the gateway blank for this lab.</p>
                </div>
             </div>
             <div className="flex gap-6 items-start">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-black text-white shrink-0 shadow-lg">3</div>
                <div className="space-y-2">
                   <h4 className="text-white font-bold">Execution</h4>
                   <p className="text-sm text-slate-400">Open PC0 Desktop {'>'} Command Prompt and type <code className="text-blue-400 font-mono">ping 192.168.1.11</code>. Watch the lights turn green as the STP (Spanning Tree) protocol converges.</p>
                </div>
             </div>
          </section>

          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] leading-relaxed">
             <p className="text-slate-600 mb-2">// Switch Side Verification</p>
             <p className="text-white">Switch# <span className="text-indigo-400">show mac address-table</span></p>
             <p className="text-slate-500">Vlan    Mac Address       Type        Ports</p>
             <p className="text-slate-500">----    -----------       ----        -----</p>
             <p className="text-slate-500">   1    0001.42a1.8d42    DYNAMIC     Fa0/1</p>
             <p className="text-slate-500">   1    0001.42a1.8d43    DYNAMIC     Fa0/2</p>
          </div>
        </article>
      )
    },
    {
      id: 'lab2',
      category: 'Hands-on Lab',
      icon: <Layers className="w-5 h-5" />,
      title: 'Lab 2: The Router Challenge',
      content: (
        <article className="space-y-12">
          <header className="p-8 bg-indigo-950/20 border border-indigo-500/20 rounded-[32px] text-center">
             <h2 className="text-2xl font-black text-white mb-2">Inter-VLAN Routing</h2>
             <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Difficulty: Intermediate • Estimated Time: 30 mins</p>
          </header>

          <section className="space-y-8">
             <div className="space-y-4">
                <h4 className="text-white font-bold">Scenario</h4>
                <p className="text-sm text-slate-400 italic font-mono leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">"The Accounting department (VLAN 10) needs to share files with the HR department (VLAN 20). You must configure a 'Router-on-a-Stick' topology to allow this traffic while maintaining logical isolation."</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Router Config</h5>
                   <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] space-y-1">
                      <p className="text-slate-500">! Sub-interface for VLAN 10</p>
                      <p className="text-white">R1(config)# <span className="text-blue-400">int g0/0.10</span></p>
                      <p className="text-white">R1(config-subif)# <span className="text-blue-400">encap dot1q 10</span></p>
                      <p className="text-white">R1(config-subif)# <span className="text-blue-400">ip add 192.168.10.1 255.255.255.0</span></p>
                      
                      <p className="text-slate-500 mt-4">! Sub-interface for VLAN 20</p>
                      <p className="text-white">R1(config)# <span className="text-blue-400">int g0/0.20</span></p>
                      <p className="text-white">R1(config-subif)# <span className="text-blue-400">encap dot1q 20</span></p>
                      <p className="text-white">R1(config-subif)# <span className="text-blue-400">ip add 192.168.20.1 255.255.255.0</span></p>
                   </div>
                </div>
                <div className="space-y-4">
                   <h5 className="text-xs font-black text-slate-500 uppercase tracking-widest">Switch Config</h5>
                   <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-[10px] space-y-1">
                      <p className="text-slate-500">! Trunk link to Router</p>
                      <p className="text-white">S1(config)# <span className="text-indigo-400">int g0/1</span></p>
                      <p className="text-white">S1(config-if)# <span className="text-indigo-400">switchport mode trunk</span></p>
                      
                      <p className="text-slate-500 mt-4">! Access links to PCs</p>
                      <p className="text-white">S1(config)# <span className="text-indigo-400">int f0/1</span></p>
                      <p className="text-white">S1(config-if)# <span className="text-indigo-400">sw acc vlan 10</span></p>
                      <p className="text-white">S1(config)# <span className="text-indigo-400">int f0/10</span></p>
                      <p className="text-white">S1(config-if)# <span className="text-indigo-400">sw acc vlan 20</span></p>
                   </div>
                </div>
             </div>
          </section>

          <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-3xl">
              <h4 className="text-red-400 font-bold mb-2 uppercase tracking-widest text-[10px]">The #1 Mistake</h4>
              <p className="text-xs text-slate-500">Forgetting to set the PC's Default Gateway to the router's sub-interface IP. If the PC doesn't know where the 'door' is, it can't leave its own subnet!</p>
          </div>
        </article>
      )
    },
    {
      id: 'cybersec',
      category: 'Security Essentials',
      icon: <Shield className="w-5 h-5" />,
      title: 'Cybersecurity Pillars: CIA Triad',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">The CIA Triad</h2>
            <p className="text-slate-300 leading-relaxed">
              Every security professional starts here. Whether you're configuring a firewall or auditing a database, your goal is to protect one of these three metrics.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center text-red-500 font-black">C</div>
                <h3 className="font-bold text-white text-sm">Confidentiality</h3>
                <p className="text-[11px] text-slate-500">Ensuring only authorized eyes see the data. Achieved through <strong>Encryption (AES-256)</strong> and <strong>Access Control Lists (ACLs)</strong>.</p>
             </div>
             <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center text-green-500 font-black">I</div>
                <h3 className="font-bold text-white text-sm">Integrity</h3>
                <p className="text-[11px] text-slate-500">Ensuring data isn't tampered with during transit. Achieved through <strong>Hashing (SHA-256)</strong> and <strong>Digital Signatures</strong>.</p>
             </div>
             <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 font-black">A</div>
                <h3 className="font-bold text-white text-sm">Availability</h3>
                <p className="text-[11px] text-slate-500">Ensuring authorized users have access whenever they need it. Fixed by <strong>Redundancy</strong>, <strong>Load Balancing</strong>, and <strong>DDoS protection</strong>.</p>
             </div>
          </div>

          <section className="bg-slate-950 p-8 rounded-[40px] border border-slate-800">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Threat Actor Taxonomy</h4>
             <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-white/5">
                   <Terminal className="w-6 h-6 text-slate-500 shrink-0" />
                   <div>
                      <h5 className="text-white font-bold text-xs">Script Kiddies</h5>
                      <p className="text-[10px] text-slate-500">Unskilled individuals who use pre-existing tools (like Metasploit) without understanding the underlying logic.</p>
                   </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-white/5">
                   <Globe className="w-6 h-6 text-blue-500 shrink-0" />
                   <div>
                      <h5 className="text-white font-bold text-xs">APT (Advanced Persistent Threat)</h5>
                      <p className="text-[10px] text-slate-500">Nation-state actors with massive funding. They play the "Long Game," remaining quiet in a network for years.</p>
                   </div>
                </div>
                <div className="flex gap-4 p-4 bg-slate-900 rounded-2xl border border-white/5">
                   <Zap className="w-6 h-6 text-yellow-500 shrink-0" />
                   <div>
                      <h5 className="text-white font-bold text-xs">Hacktivists</h5>
                      <p className="text-[10px] text-slate-500">Motivated by social or political causes. Think Anonymous or similar collective movements.</p>
                   </div>
                </div>
             </div>
          </section>
        </article>
      )
    },
    {
      id: 'wi-fi',
      category: 'Wireless Mastery',
      icon: <Layers className="w-5 h-5" />,
      title: 'Wi-Fi 7 and Beyond',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Wireless Standards (802.11)</h2>
            <p className="text-slate-300 leading-relaxed">
              Gone are the days when Wi-Fi was just for browsing. In 2026, Wi-Fi 7 (802.11be) handles multi-gigabit throughput with ultra-low latency, rivaling wired Ethernet for gaming and VR.
            </p>
          </section>

          <div className="space-y-4">
             {[
               { n: 'Wi-Fi 7 (802.11be)', f: '6 GHz Support', d: 'MLO (Multi-Link Operation) allows using multiple bands simultaneously for insane speed.' },
               { n: 'Wi-Fi 6E (802.11ax)', f: 'OFDMA', d: 'Increases efficiency in high-density environments like stadiums.' },
               { n: 'Wi-Fi 5 (802.11ac)', f: '5 GHz Only', d: 'The first standard to break the gigabit barrier reliably for consumers.' }
             ].map(item => (
               <div key={item.n} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col md:flex-row gap-6 items-center">
                  <div className="shrink-0 w-24 text-center">
                     <span className="block text-[10px] font-black text-slate-600 uppercase mb-1">Standard</span>
                     <span className="text-xs font-bold text-blue-400">{item.n}</span>
                  </div>
                  <div className="flex-1 space-y-1">
                     <h5 className="text-white font-bold text-sm tracking-tight">{item.f}</h5>
                     <p className="text-[11px] text-slate-500">{item.d}</p>
                  </div>
               </div>
             ))}
          </div>

          <section className="p-8 bg-blue-600/5 border border-blue-500/20 rounded-[32px]">
             <h4 className="text-white font-bold mb-4">WPA Security Protocols</h4>
             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-4 bg-slate-950 rounded-2xl">
                   <h5 className="text-[10px] font-black text-red-500 uppercase mb-2">WPA2 (PSK)</h5>
                   <p className="text-[10px] text-slate-500">The current standard, but vulnerable to KRACK and dictionary attacks.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl">
                   <h5 className="text-[10px] font-black text-green-500 uppercase mb-2">WPA3 (SAE)</h5>
                   <p className="text-[10px] text-slate-500">Features "Simultaneous Authentication of Equals" to prevent offline brute-forcing.</p>
                </div>
                <div className="p-4 bg-slate-950 rounded-2xl">
                   <h5 className="text-[10px] font-black text-indigo-500 uppercase mb-2">802.1X (Enterprise)</h5>
                   <p className="text-[10px] text-slate-500">Uses a RADIUS server for individual user authentication. No shared passwords.</p>
                </div>
             </div>
          </section>
        </article>
      )
    },
    {
      id: 'nmap',
      category: 'Security Essentials',
      icon: <Terminal className="w-5 h-5" />,
      title: 'Nmap: The Network Mapper',
      content: (
        <article className="space-y-12">
          <section className="space-y-4">
             <h2 className="text-2xl font-bold text-white">Auditing with Nmap</h2>
             <p className="text-slate-300 leading-relaxed">
               Nmap is the "Swiss Army Knife" of hacking and auditing. It allows you to discover hosts, open ports, and even the operating versions running on them.
             </p>
          </section>

          <div className="bg-slate-950 p-8 rounded-[40px] border border-slate-800">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">Nmap Commands for Certification Exams</h4>
             <div className="space-y-4 font-mono text-[11px]">
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group">
                   <div className="flex justify-between items-center mb-1">
                      <code className="text-blue-400 group-hover:text-blue-300 transition-colors">nmap -sS -O 192.168.1.0/24</code>
                      <span className="text-[8px] text-slate-600">STEALTH SCAN</span>
                   </div>
                   <p className="text-slate-500">The "SYN Scan" (Half-open). Doesn't complete the 3-way handshake to avoid being logged.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group">
                   <div className="flex justify-between items-center mb-1">
                      <code className="text-green-400 group-hover:text-green-300 transition-colors">nmap -sV -p 80,443 target.com</code>
                      <span className="text-[8px] text-slate-600">VERSION DETECTION</span>
                   </div>
                   <p className="text-slate-500">Checks specific ports to see if an old, vulnerable version of Apache or Nginx is running.</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-white/5 group">
                   <div className="flex justify-between items-center mb-1">
                      <code className="text-indigo-400 group-hover:text-indigo-300 transition-colors">nmap -T4 -A 10.1.1.5</code>
                      <span className="text-[8px] text-slate-600">AGGRESSIVE</span>
                   </div>
                   <p className="text-slate-500">Enables OS detection, version detection, script scanning, and traceroute. Very noisy on the network.</p>
                </div>
             </div>
          </div>

          <div className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
             <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" /> Legal Disclaimer
             </h4>
             <p className="text-xs text-slate-500">Scanning networks you don't own or have explicit permission to audit can be illegal. Always use your home labs or platforms like MLA Tech to practice.</p>
          </div>
        </article>
      )
    }
  ];

  const currentArticle = articles.find(a => a.id === selectedArticle) || articles[0];

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600/20 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Networking Academy</h2>
              <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Master CompTIA & Cisco Fundamentals • May 2026 Edition</p>
            </div>
          </div>
          <button 
            onClick={() => onNavigate?.('home')}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-80 h-full border-r border-slate-800 bg-slate-900/50 overflow-y-auto hidden lg:block custom-scrollbar">
          <div className="p-6 space-y-8">
            {['Certification Path', 'Fundamentals', 'IPv4 Mastery', 'Layer 2 Switching', 'Layer 3 Routing', 'Security Essentials', 'Wireless Mastery', '2026 Trends', 'Lab Tools', 'Hands-on Lab'].map(cat => (
              <div key={cat}>
                <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4 pl-2">{cat}</h3>
                <div className="space-y-1">
                  {articles.filter(a => a.category === cat).map(article => (
                    <button
                      key={article.id}
                      onClick={() => setSelectedArticle(article.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${selectedArticle === article.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800'}`}
                    >
                      <div className={selectedArticle === article.id ? 'text-white' : 'text-slate-600'}>
                        {article.icon}
                      </div>
                      {article.title}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/5 via-slate-900 to-slate-900 p-6 lg:p-12 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-12 pb-24">
            
            {/* Breadcrumb (Mobile) */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-6 no-scrollbar">
                {articles.map(a => (
                  <button 
                    key={a.id}
                    onClick={() => setSelectedArticle(a.id)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-slate-700 transition-all ${selectedArticle === a.id ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 text-slate-500'}`}
                  >
                    {a.title}
                  </button>
                ))}
            </div>

            <motion.div
              key={selectedArticle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-3">
                 <span className="px-2 py-1 bg-blue-600/10 text-blue-400 rounded text-[10px] font-black uppercase tracking-[0.2em]">
                   {currentArticle.category}
                 </span>
                 <div className="h-px flex-1 bg-slate-800" />
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                  {currentArticle.title}
                </h1>
                <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1.5"><Monitor className="w-3.5 h-3.5" /> MLA Academy Team</span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> 10 min read</span>
                </div>
              </div>

              <div className="prose prose-invert max-w-none">
                {currentArticle.content}
              </div>

              {/* Next/Prev Navigation (Bottom) */}
              <div className="pt-12 border-t border-slate-800 flex items-center justify-between">
                  {(() => {
                    const idx = articles.findIndex(a => a.id === selectedArticle);
                    const prev = articles[idx - 1];
                    const next = articles[idx + 1];

                    return (
                      <>
                        {prev ? (
                          <button 
                            onClick={() => setSelectedArticle(prev.id)}
                            className="flex items-center gap-3 text-left group"
                          >
                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                              <ArrowLeft className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                               <span className="block text-[8px] font-black text-slate-600 uppercase">Previous Lesson</span>
                               <span className="text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors">{prev.title}</span>
                            </div>
                          </button>
                        ) : <div />}

                        {next ? (
                          <button 
                             onClick={() => setSelectedArticle(next.id)}
                             className="flex items-center gap-3 text-right group"
                          >
                            <div>
                               <span className="block text-[8px] font-black text-slate-600 uppercase">Next Lesson</span>
                               <span className="text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors">{next.title}</span>
                            </div>
                            <div className="p-2 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors">
                              <ChevronRight className="w-4 h-4 text-slate-400" />
                            </div>
                          </button>
                        ) : <div />}
                      </>
                    )
                  })()}
              </div>
            </motion.div>

            {/* Academy CTA */}
            <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-[32px] border border-blue-500/20 flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-blue-600/20 rounded-full shadow-2xl">
                   <Shield className="w-8 h-8 text-blue-400" />
                </div>
                <div>
                   <h4 className="text-lg font-bold text-white mb-1">Advance Your Career with MLA Tech</h4>
                   <p className="text-xs text-slate-400 max-w-md">Our high-fidelity labs are updated weekly for the latest CompTIA N10-009 and Security+ SY0-701 objectives.</p>
                </div>
                <div className="flex gap-4">
                   <a href="https://mohammadlotfi.com" target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">Portfolio</a>
                   <button onClick={() => onNavigate?.('simulator')} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-slate-700">Lab Center</button>
                </div>
            </div>

            {/* Hidden SEO Keywords Section */}
            <div className="sr-only">
               <h2>Networking Certification Keywords 2026</h2>
               <p>CompTIA Network+ N10-009 practice labs, Cisco CCNA 200-301 version 1.1 tutorials, OSI Model study guide 2026, Subnetting calculator practice, IPv6 transition strategies, Red Teaming networking skills, Blue Teaming network defense, Wi-Fi 7 wireless security WPA3, Packet Tracer lab guides, Mohammad Lotfi Akbarabadi networking expert, MLA Tech Academy free IT courses.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkingAcademy;
