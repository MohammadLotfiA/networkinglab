import React, { useState } from 'react';
import { Bot, Terminal, Send, Cpu, ShieldCheck, Zap, Copy, Check, RefreshCw, Layers, Server, Shield, Globe, MessageSquareQuote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VENDORS = ['Cisco', 'Juniper', 'Arista', 'Generic Linux'];
const TASKS = [
  { id: 'vlan', label: 'VLAN Configuration', icon: <Layers className="w-4 h-4" /> },
  { id: 'routing', label: 'Dynamic Routing (OSPF/BGP)', icon: <Globe className="w-4 h-4" /> },
  { id: 'acl', label: 'Access Control Lists (ACL)', icon: <Shield className="w-4 h-4" /> },
  { id: 'nat', label: 'Network Address Translation', icon: <Zap className="w-4 h-4" /> },
  { id: 'stp', label: 'Spanning Tree (STP)', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'portsec', label: 'Port Security', icon: <ShieldCheck className="w-4 h-4" /> },
];

const AILab: React.FC = () => {
  const [vendor, setVendor] = useState('Cisco');
  const [task, setTask] = useState('vlan');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const generateConfig = async () => {
    if (!requirements.trim()) return;
    
    setLoading(true);
    // Simulate a brief "synthesis" period for UX
    setTimeout(() => {
      const currentYear = new Date().getFullYear();
      const prompt = `[SYSTEM_ROLE]: You are a Level 3 Senior Network Infrastructure Architect (CCIE/JNCIE/ACE) with 20+ years of experience in global enterprise environments.
[CURRENT_CONTEXT]: Date May ${currentYear}. Focus on modern, highly secure, and performance-optimized syntax.

[GOAL]: Generate a complete, production-grade CLI configuration for a ${vendor} device.
[TASK]: ${task.toUpperCase()}
[SPECIFIC_REQUIREMENTS]: ${requirements || "Use standard configuration baseline for this hardware type."}

[CONSTRAINTS & BEST PRACTICES]:
1. SECURITY: Enforce the Principle of Least Privilege. Include management plane security where applicable.
2. OBSERVABILITY: Every interface and logical entity MUST have a descriptive 'description' field.
3. ADHERENCE: Strictly follow ${vendor} proprietary syntax conventions (e.g., set vs. no set, hierarchy vs. flat).
4. VALIDATION: Include common 'show' and 'verify' commands as a post-config checklist.
5. EXPLANATION: Use internal comments (! or #) to explain the logic of complex logic blocks.

[OUTPUT_FORMAT]:
- Provide the raw CLI configuration first in a clean code block.
- Follow the code with a brief 'Architect Note' explaining any non-obvious design choices.
- End with a 'Verification Roadmap' list of CLI commands to ensure convergence.

[USER_INPUT_SUMMARY]: The user requires ${task} handling specifically for ${vendor} logic with the following custom inputs: "${requirements}".

[EXECUTION]: Commence high-fidelity configuration generation now.`;

      setConfig(prompt);
      setLoading(false);
    }, 1200);
  };

  const copyToClipboard = () => {
    if (config) {
      navigator.clipboard.writeText(config);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      <div className="p-6 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600/20 rounded-xl">
            <MessageSquareQuote className="w-8 h-8 text-indigo-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">AI Config Prompt Generator</h2>
            <p className="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Optimized for Gemini, GPT-4, and Claude</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Configuration Space */}
          <div className="lg:col-span-12 xl:col-span-4 space-y-6">
            <div className="bg-slate-800/50 p-6 rounded-[32px] border border-slate-700 shadow-2xl">
              <h3 className="text-xs font-black text-slate-500 uppercase mb-6 tracking-widest italic">Lab Parameters</h3>
              
              <div className="space-y-6">
                {/* Vendor Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1 tracking-widest">Hardware Vendor</label>
                  <div className="grid grid-cols-2 gap-2">
                    {VENDORS.map(v => (
                      <button
                        key={v}
                        onClick={() => setVendor(v)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${vendor === v ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg' : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-600'}`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Task Grid */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1 tracking-widest">Target Task</label>
                  <div className="space-y-2">
                    {TASKS.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTask(t.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border ${task === t.id ? 'bg-slate-800 border-indigo-500/50 text-white ring-1 ring-indigo-500/20' : 'bg-slate-950 border-slate-800 text-slate-500 hover:bg-slate-900'}`}
                      >
                        <div className={`${task === t.id ? 'text-indigo-400' : 'text-slate-600'}`}>{t.icon}</div>
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Requirements input */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-3 ml-1 tracking-widest">Specific Details</label>
                  <textarea 
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="e.g. VLAN 10 named 'Sales', VLAN 20 with IP 10.0.0.1/24..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-slate-200 text-sm h-32 focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none placeholder:text-slate-700"
                  />
                </div>

                <button
                  onClick={generateConfig}
                  disabled={loading || !requirements.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-2xl shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  {loading ? 'Generating...' : 'Create Optimized AI Prompt'}
                </button>
              </div>
            </div>
          </div>

          {/* Console / Output */}
          <div className="lg:col-span-12 xl:col-span-8 flex flex-col h-full min-h-[600px]">
            <div className="flex-1 bg-slate-950 rounded-[32px] border border-slate-800 shadow-inner flex flex-col overflow-hidden relative">
              
              {/* Console Header */}
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">AI_Prompt_Export.txt</span>
                </div>
                
                {config && (
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-300 transition-all uppercase tracking-widest"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied Prompt' : 'Copy Prompt'}
                  </button>
                )}
              </div>

              {/* Console Body */}
              <div className="flex-1 p-6 font-mono text-sm overflow-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-slate-600 gap-4"
                    >
                      <Cpu className="w-12 h-12 animate-pulse text-indigo-500/30" />
                      <div className="text-center">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] mb-1">Optimizing Prompt Engineering</p>
                        <p className="text-[10px] italic opacity-50">Structuring network logic for {vendor}...</p>
                      </div>
                    </motion.div>
                  ) : config ? (
                    <motion.div
                      key="config"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-indigo-400 whitespace-pre-wrap leading-relaxed"
                    >
                      {config}
                    </motion.div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-slate-700 gap-4 text-center">
                      <MessageSquareQuote className="w-16 h-16 opacity-10" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest opacity-30">Prompt Generator Ready</p>
                        <p className="text-[10px] italic opacity-20">Select vendor and task to create an AI-optimized prompt</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Console Footer Overlay */}
              <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none opacity-50" />
            </div>

            {/* Pro Tip */}
            <div className="mt-6 flex items-start gap-4 p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 border-dashed">
                <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">How to Use</h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">
                        Generate the prompt, copy it, and paste it into your favorite AI model (Gemini, ChatGPT, Claude). This tool ensures your prompt follows industry-standard networking terminology for the best results.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILab;
