
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, Shield, FileArchive, ArrowRight, Binary, Lock, Unlock, Percent, Key, RefreshCw } from 'lucide-react';

type Tab = 'translate' | 'encrypt' | 'compress';

const Layer6Presentation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('translate');
  
  // Translation State
  const [transInput, setTransInput] = useState("Hello");
  
  // Encryption State
  const [encInput, setEncInput] = useState("Confidential Data");
  const [encKey, setEncKey] = useState("secret");
  const [isEncrypted, setIsEncrypted] = useState(false);
  
  // Compression State
  const [compInput, setCompInput] = useState("AAAAABBBBBCCCCC");
  const [isCompressed, setIsCompressed] = useState(false);

  // Helpers
  const toBinary = (str: string) => str.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  const toHex = (str: string) => str.split('').map(char => char.charCodeAt(0).toString(16).toUpperCase()).join(' ');
  
  // Actual Caesar Cipher Logic
  const caesarCipher = (text: string, key: string) => {
      if (!text) return "";
      // Calculate a shift based on the key (sum of chars) to make it deterministic but dynamic
      const shift = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
      
      return text.replace(/[a-zA-Z]/g, (char) => {
          const base = char <= 'Z' ? 65 : 97;
          // (char - base + shift) % 26 + base
          return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
      });
  };

  const getCompressionStats = (text: string) => {
      const original = text.length * 8; // 8 bits per char
      // primitive RLE simulation for visuals
      const compressed = Math.ceil(original * (text.length > 10 ? 0.6 : 0.9)); 
      return { original, compressed, ratio: Math.round((1 - compressed/original) * 100) };
  };

  return (
    <div className="p-6 md:p-12 h-full flex flex-col items-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-pink-500/20 rounded-xl">
                <FileCode className="w-8 h-8 text-pink-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Layer 6: Presentation</h2>
                <p className="text-slate-400">Data Formatting, Encryption, and Compression.</p>
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 border-b border-slate-700 pb-1">
            <button 
                onClick={() => setActiveTab('translate')}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'translate' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
                <Binary className="w-4 h-4" /> Translation
            </button>
            <button 
                onClick={() => setActiveTab('encrypt')}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'encrypt' ? 'border-green-500 text-green-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
                <Shield className="w-4 h-4" /> Encryption
            </button>
             <button 
                onClick={() => setActiveTab('compress')}
                className={`flex items-center gap-2 px-4 py-2 font-bold text-sm transition-colors border-b-2 ${activeTab === 'compress' ? 'border-pink-500 text-pink-400' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
            >
                <FileArchive className="w-4 h-4" /> Compression
            </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 min-h-[400px] relative overflow-hidden shadow-2xl">
            
            <AnimatePresence mode="wait">
                
                {/* TRANSLATION TAB */}
                {activeTab === 'translate' && (
                    <motion.div 
                        key="translate"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="flex-1 w-full space-y-4">
                                <label className="text-xs font-bold text-slate-500 uppercase">Input Text (ASCII)</label>
                                <textarea 
                                    value={transInput}
                                    onChange={(e) => setTransInput(e.target.value)}
                                    className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                />
                            </div>
                            
                            <div className="hidden md:flex flex-col items-center justify-center pt-10">
                                <ArrowRight className="text-slate-600 w-8 h-8" />
                            </div>

                            <div className="flex-1 w-full space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-blue-400 uppercase mb-2 block">Binary Output</label>
                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-blue-300 h-24 overflow-y-auto break-all">
                                        {toBinary(transInput)}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-yellow-400 uppercase mb-2 block">Hexadecimal Output</label>
                                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 font-mono text-xs text-yellow-300 h-24 overflow-y-auto break-all">
                                        {toHex(transInput)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-lg text-sm text-slate-400">
                            <p><strong>Concept:</strong> Computers don't understand "Hello". Layer 6 translates application data (ASCII) into machine-readable formats (Binary/Hex) before sending it down the stack.</p>
                        </div>
                    </motion.div>
                )}

                {/* ENCRYPTION TAB */}
                {activeTab === 'encrypt' && (
                    <motion.div 
                        key="encrypt"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center"
                    >
                        <div className="w-full max-w-2xl bg-slate-800 p-6 rounded-2xl border border-slate-700">
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Plaintext Message</label>
                                <input 
                                    type="text" 
                                    value={encInput}
                                    onChange={(e) => { setEncInput(e.target.value); setIsEncrypted(false); }}
                                    className="w-full bg-slate-900 border border-slate-600 rounded p-3 text-white font-mono outline-none"
                                    placeholder="Enter text to encrypt..."
                                />
                            </div>

                            <div className="flex flex-col md:flex-row items-end gap-4 mb-6 bg-slate-900 p-4 rounded-lg">
                                <div className="flex-1 w-full">
                                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                        <Key className="w-3 h-3" /> Secret Key
                                    </label>
                                    <input 
                                        type="text" 
                                        value={encKey}
                                        onChange={(e) => { setEncKey(e.target.value); setIsEncrypted(false); }}
                                        className="w-full bg-slate-800 border border-slate-600 rounded p-2 text-green-400 font-mono text-sm outline-none focus:border-green-500 transition-colors"
                                        placeholder="Enter secret key..."
                                    />
                                    <div className="text-[10px] text-slate-500 mt-1">Key determines the substitution shift.</div>
                                </div>
                                <button 
                                    onClick={() => setIsEncrypted(!isEncrypted)}
                                    disabled={!encInput || !encKey}
                                    className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2 rounded-lg font-bold transition-colors h-10 flex items-center gap-2"
                                >
                                    {isEncrypted ? <RefreshCw className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                                    {isEncrypted ? 'Reset' : 'Encrypt'}
                                </button>
                            </div>

                            <div className="relative h-32 bg-black rounded-lg border border-green-900 flex items-center justify-center overflow-hidden p-4">
                                <AnimatePresence mode='wait'>
                                    {isEncrypted ? (
                                        <motion.div 
                                            key="encrypted"
                                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                                            className="text-center w-full"
                                        >
                                            <div className="flex items-center justify-center gap-2 text-green-500 mb-2">
                                                <Lock className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Ciphertext (Scrambled)</span>
                                            </div>
                                            <div className="text-xl font-mono text-green-400 tracking-wider break-all leading-tight">
                                                {caesarCipher(encInput, encKey)}
                                            </div>
                                            <div className="mt-2 text-[10px] text-slate-600">Algorithm: Caesar Cipher (Shifted by Key)</div>
                                        </motion.div>
                                    ) : (
                                        <motion.div 
                                            key="plain"
                                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                                            className="text-center w-full"
                                        >
                                            <div className="flex items-center justify-center gap-2 text-slate-500 mb-2">
                                                <Unlock className="w-4 h-4" /> <span className="text-xs font-bold uppercase">Plaintext Preview</span>
                                            </div>
                                            <div className="text-xl font-mono text-white tracking-widest break-all">
                                                {encInput || <span className="text-slate-700 italic">Enter text...</span>}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                        <p className="mt-6 text-sm text-slate-400 text-center max-w-lg">
                            Layer 6 handles <strong>Encryption</strong>. In this demo, we use a <strong>Caesar Cipher</strong>, shifting letters based on your secret key so the text becomes unreadable without the key.
                        </p>
                    </motion.div>
                )}

                {/* COMPRESSION TAB */}
                {activeTab === 'compress' && (
                    <motion.div 
                        key="compress"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        className="flex flex-col items-center"
                    >
                         <div className="w-full max-w-2xl">
                             <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Data to Compress (Try repeating characters)</label>
                             <div className="flex gap-4 mb-8">
                                <input 
                                    type="text" 
                                    value={compInput}
                                    onChange={(e) => { setCompInput(e.target.value); setIsCompressed(false); }}
                                    className="flex-1 bg-slate-800 border border-slate-600 rounded p-3 text-white font-mono outline-none focus:ring-2 focus:ring-pink-500"
                                />
                                <button 
                                    onClick={() => setIsCompressed(true)}
                                    className="bg-pink-600 hover:bg-pink-500 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Zip It!
                                </button>
                             </div>

                             <div className="grid grid-cols-2 gap-8 relative">
                                {/* Original */}
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center">
                                    <div className="text-slate-400 font-bold mb-4">Original Size</div>
                                    <div className="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center relative">
                                        <FileCode className="w-16 h-16 text-slate-500" />
                                        <div className="absolute bottom-2 right-2 text-xs font-mono bg-black/50 px-2 rounded text-white">
                                            {getCompressionStats(compInput).original} bits
                                        </div>
                                    </div>
                                </div>

                                {/* Compressed */}
                                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col items-center relative overflow-hidden">
                                     <div className="text-pink-400 font-bold mb-4">Compressed Size</div>
                                     <div className="w-32 h-32 flex items-center justify-center relative">
                                        <AnimatePresence>
                                            {isCompressed ? (
                                                <motion.div 
                                                    initial={{ scale: 1.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    className="w-24 h-24 bg-pink-900/40 border-2 border-pink-500 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.3)]"
                                                >
                                                    <FileArchive className="w-12 h-12 text-pink-500" />
                                                    <div className="absolute bottom-1 right-1 text-xs font-mono bg-pink-600 px-2 rounded text-white">
                                                         {getCompressionStats(compInput).compressed} bits
                                                    </div>
                                                </motion.div>
                                            ) : (
                                                <div className="text-slate-600 text-sm">Waiting...</div>
                                            )}
                                        </AnimatePresence>
                                     </div>
                                </div>
                                
                                {isCompressed && (
                                    <motion.div 
                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-slate-900 font-bold px-4 py-1 rounded-full shadow-xl z-10 flex items-center gap-1"
                                    >
                                        <Percent className="w-3 h-3" /> 
                                        {getCompressionStats(compInput).ratio}% Saved
                                    </motion.div>
                                )}
                             </div>
                         </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Layer6Presentation;
