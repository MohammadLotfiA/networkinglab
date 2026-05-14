
import React from 'react';
import { Layers, Calculator, Play, ArrowRight, ShieldCheck, Globe, Cpu, Server, Network, Bot, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

interface HomePageProps {
  onNavigate: (view: 'simulator' | 'calculator' | 'ailab' | 'academy') => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-full bg-slate-900 text-slate-100 flex flex-col items-center p-6 lg:p-12 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] translate-y-1/2" />

      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center mt-12 mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/10 border border-blue-500/20 mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-blue-500/50" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400/80">Interactive Learning Environment</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-bold tracking-tighter mb-6 leading-[0.9]"
        >
          Understand the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Infrastructures</span> <br />
          that connect us.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Explore CompTIA A+, Network+, and Security+ concepts through simple, hands-on simulations.
          Created by <a href="https://mohammadlotfi.com/video-tutorials/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Mohammad Lotfi Akbarabadi</a> to help bridge the gap between theory and practice.
        </motion.p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl relative z-10 px-4">
        <Card
          icon={<Layers className="w-10 h-10 text-white" />}
          title="Network Simulator"
          description="The ultimate OSI model simulator. Master Layer 2 and Layer 3 protocols essential for Network+ and CCNA certifications."
          onClick={() => onNavigate('simulator')}
          features={['CompTIA Labs', 'Router CLI']}
          primaryColor="from-blue-600 to-indigo-600"
          shadowColor="shadow-blue-500/20"
        />

        <Card
          icon={<Calculator className="w-10 h-10 text-white" />}
          title="Subnet Calculator"
          description="Real-time IPv4 & IPv6 calculations. Binary visualization and CIDR analysis for students."
          onClick={() => onNavigate('calculator')}
          features={['IPv4 / IPv6', 'Binary Viz']}
          primaryColor="from-indigo-600 to-purple-600"
          shadowColor="shadow-indigo-500/20"
        />

        <Card
          icon={<Bot className="w-10 h-10 text-white" />}
          title="AI Config Lab"
          description="Craft optimized prompts for AI models to generate production-ready Cisco, Juniper, and Arista configs."
          onClick={() => onNavigate('ailab')}
          features={['Prompt Engineering', 'Multiple Vendors']}
          primaryColor="from-purple-600 to-pink-600"
          shadowColor="shadow-purple-500/20"
        />

        <Card
          icon={<BookOpen className="w-10 h-10 text-white" />}
          title="Networking Academy"
          description="Comprehensive guide for 2026 certification goals. From OSI basics to Packet Tracer labs."
          onClick={() => onNavigate('academy')}
          features={['Network+ / CCNA', 'Study Guides']}
          primaryColor="from-orange-500 to-red-600"
          shadowColor="shadow-orange-500/20"
        />
      </div>

      {/* Trust Badges */}
      <div className="mt-32 w-full max-w-5xl border-t border-white/5 pt-12 flex flex-wrap justify-center gap-12 text-slate-500 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
        <Badge icon={<ShieldCheck className="w-5 h-5" />} label="CompTIA Prep" />
        <Badge icon={<Globe className="w-5 h-5" />} label="Red & Blue Team" />
        <Badge icon={<Cpu className="w-5 h-5" />} label="Interactive Labs" />
        <Badge icon={<Server className="w-5 h-5" />} label="Enterprise Ready" />
        <Badge icon={<Network className="w-5 h-5" />} label="Career Driven" />
      </div>

      {/* SEO Content Section */}
      <div className="mt-32 max-w-5xl text-center space-y-16 relative z-10 px-6">
        <section className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-2">Build Your IT Foundation</h2>
          <p className="text-slate-400 text-base max-w-3xl mx-auto leading-relaxed">
            Whether you are just starting your <strong>CompTIA A+</strong> journey or curious about <strong>Cisco networking</strong>, these tools are designed to help you visualize what happens behind the screen.
            Our simulation focus on core objectives from <strong>N10-009</strong>, <strong>SY0-701</strong>, and <strong>200-301</strong>.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          <div className="group p-10 bg-white/5 rounded-[40px] border border-white/5 hover:bg-white/[0.07] transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
              <Network className="w-6 h-6" />
            </div>
            <h4 className="text-blue-400 font-black mb-4 uppercase tracking-[0.2em] text-[11px]">How to Master Networking?</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              "Visualization is the catalyst for intuition. By seeing the literal encapsulation of data across the <strong>OSI Layers</strong>, students at MLA Tech internalize core concepts. Mastering <strong>NAT</strong>, <strong>VLAN Trunking</strong>, and <strong>Spanning Tree Protocol</strong> happens 3x faster when you can 'see' the frames moving through the switch's CAM table. In 2026, the complexity of IPv6 transition makes this visual approach a non-negotiable requirement for high-level certification success."
            </p>
          </div>
          <div className="group p-10 bg-white/5 rounded-[40px] border border-white/5 hover:bg-white/[0.07] transition-all hover:scale-[1.02]">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 text-indigo-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-indigo-400 font-black mb-4 uppercase tracking-[0.2em] text-[11px]">Best Red Team Labs 2026</h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              "Offensive security is built on a foundation of defensive infrastructure. Our <strong>Red Team Labs</strong> focus on the technical exploitation of networking misconfigurations. Learn how to perform <strong>ARP Poisoning</strong>, bypass <strong>Port Security</strong>, and navigate <strong>VLAN Hopping</strong> attacks. By understanding the weaknesses in traditional Layer 2 environments, security professionals can architect truly resilient Blue Team defenses.Practical expertise is the only currency that matters in the high-stakes cybersecurity market of 2026."
            </p>
          </div>
        </div>

        <section className="bg-slate-950 p-12 rounded-[56px] border border-slate-800 text-left space-y-10 shadow-3xl">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-800" />
            <h3 className="text-2xl font-bold text-white tracking-widest uppercase text-center px-4">Common Questions</h3>
            <div className="h-px flex-1 bg-slate-800" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h5 className="text-blue-400 font-bold text-[10px] uppercase tracking-widest border-l-2 border-blue-500 pl-4">Network+ Strategy</h5>
              <p className="text-sm text-slate-400 leading-relaxed">
                The <strong>N10-009</strong> curriculum covers a lot of ground. Understanding <strong>SASE</strong> and cloud networking is important, and using visual tools can make these abstract concepts much easier to digest.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest border-l-2 border-indigo-500 pl-4">CCNA and AI</h5>
              <p className="text-sm text-slate-400 leading-relaxed">
                While tools can now generate configurations, troubleshooting remains a human skill. A deep understanding of <strong>OSPF</strong> or <strong>trunking</strong> is still the foundation that makes you a reliable engineer.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest border-l-2 border-cyan-500 pl-4">Understanding Security</h5>
              <p className="text-sm text-slate-400 leading-relaxed">
                Security isn't just about firewalls; it's also about human awareness. Our <strong>Security+</strong> focused content looks at how technical controls (IDS/IPS) work alongside administrative policies.
              </p>
            </div>
            <div className="space-y-4">
              <h5 className="text-purple-400 font-bold text-[10px] uppercase tracking-widest border-l-2 border-purple-500 pl-4">IPv6 Transition</h5>
              <p className="text-sm text-slate-400 leading-relaxed">
                Global IPv4 exhaustion has made <strong>IPv6</strong> a necessity. You can use our tools to visualize how these addresses are structured and practice segmenting prefixes.
              </p>
            </div>
          </div>
        </section>

        <footer className="space-y-4 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            {['CompTIA N10-009', 'Security+ SY0-701', 'Cisco 200-301', 'Labs', 'Defense', 'OSI Model', 'VLANs', 'BGP'].map(tag => (
              <span key={tag} className="text-[10px] font-mono text-slate-700 bg-black/20 px-3 py-1 rounded-full">{tag}</span>
            ))}
          </div>
          <p className="text-xs text-slate-600 font-mono italic">A companion for your networking journey.</p>
        </footer>
      </div>

    </div>
  );
};

const Card = ({ icon, title, description, onClick, features, primaryColor, shadowColor }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="group bg-slate-800/40 backdrop-blur-md rounded-[32px] border border-white/10 p-8 flex flex-col h-full hover:bg-slate-800/60 transition-all cursor-pointer overflow-hidden relative shadow-2xl"
    onClick={onClick}
  >
    <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${primaryColor} opacity-10 blur-3xl`} />

    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${primaryColor} flex items-center justify-center mb-8 shadow-xl ${shadowColor} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>

    <h3 className="text-2xl font-bold mb-4 tracking-tight">{title}</h3>
    <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">{description}</p>

    <div className="flex flex-wrap gap-2 mb-8">
      {features.map((f: string) => (
        <span key={f} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/5 text-slate-300">
          {f}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-2 text-white font-bold group-hover:gap-4 transition-all">
      <span>Get Started</span>
      <ArrowRight className="w-4 h-4" />
    </div>
  </motion.div>
);

const Badge = ({ icon, label }: any) => (
  <div className="flex items-center gap-2">
    {icon}
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </div>
);

export default HomePage;
