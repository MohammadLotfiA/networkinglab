
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Monitor, ZapOff, ShieldCheck, AlertTriangle } from 'lucide-react';

const Layer1Physical: React.FC = () => {
  const [medium, setMedium] = useState<'copper' | 'fiber'>('copper');
  const [noise, setNoise] = useState(0); // 0 to 100
  const [isTransmitting, setIsTransmitting] = useState(false);
  const [text, setText] = useState("HELLO");
  const [receivedText, setReceivedText] = useState("");

  const binary = text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');

  const transmit = () => {
      setIsTransmitting(true);
      setReceivedText("");
      
      setTimeout(() => {
          setIsTransmitting(false);
          
          // PHYSICS CORRECTION: Fiber is immune to EMI (Noise)
          // We only apply corruption if the medium is Copper.
          const effectiveNoise = medium === 'fiber' ? 0 : noise;

          if (effectiveNoise > 50) {
              setReceivedText("??#@!");
          } else if (effectiveNoise > 20) {
              setReceivedText(text.replace(/[AEIOU]/g, '*')); // Partial corruption
          } else {
              setReceivedText(text);
          }
      }, 3000);
  };

  return (
    <div className="p-6 md:p-12 h-full flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-orange-500/20 rounded-xl">
                <Cpu className="w-8 h-8 text-orange-500" />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Layer 1: Physical</h2>
                <p className="text-slate-400">Transmission of raw bits over a physical medium.</p>
            </div>
        </div>

        {/* Control Panel */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 mb-8 grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Data to Send</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            maxLength={8}
                            value={text}
                            onChange={(e) => setText(e.target.value.toUpperCase())}
                            className="bg-slate-900 border border-slate-600 rounded px-3 py-2 text-white font-mono w-full"
                        />
                        <button 
                            onClick={transmit}
                            disabled={isTransmitting}
                            className="bg-green-600 hover:bg-green-500 disabled:bg-slate-600 px-4 py-2 rounded font-bold text-white transition-colors"
                        >
                            SEND
                        </button>
                    </div>
                </div>
                
                <div>
                     <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex justify-between">
                        <span>Environment Noise (EMI/RFI)</span>
                        <span className={noise > 50 ? 'text-red-500' : 'text-slate-400'}>{noise}%</span>
                     </label>
                     <input 
                        type="range" min="0" max="100" 
                        value={noise} 
                        onChange={(e) => setNoise(Number(e.target.value))}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                     />
                     <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                         <span>Clean Environment</span>
                         <span>Heavy Interference</span>
                     </div>
                </div>
            </div>

            <div>
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Physical Medium</label>
                <div className="flex bg-slate-900 rounded p-1 border border-slate-600 mb-4">
                    <button 
                        onClick={() => setMedium('copper')}
                        className={`flex-1 py-1 rounded text-sm font-bold transition-colors ${medium === 'copper' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Copper (Electric)
                    </button>
                    <button 
                        onClick={() => setMedium('fiber')}
                        className={`flex-1 py-1 rounded text-sm font-bold transition-colors ${medium === 'fiber' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                        Fiber (Light)
                    </button>
                </div>

                {/* Educational Context for Selection */}
                <div className="bg-slate-900 p-3 rounded border border-slate-700 text-xs">
                     {medium === 'copper' ? (
                         <div className="flex gap-2 items-start text-orange-200">
                             <AlertTriangle className="w-4 h-4 shrink-0" />
                             <p>Copper cables use electrical voltage. They are susceptible to electromagnetic interference (EMI) which can corrupt data.</p>
                         </div>
                     ) : (
                         <div className="flex gap-2 items-start text-cyan-200">
                             <ShieldCheck className="w-4 h-4 shrink-0" />
                             <p>Fiber optic cables use pulses of light. They are completely immune to electromagnetic interference (EMI).</p>
                         </div>
                     )}
                </div>
            </div>
        </div>

        {/* Visualization Stage */}
        <div className="bg-black rounded-xl border border-slate-700 p-8 relative min-h-[300px] flex items-center justify-between overflow-hidden">
            
            {/* Sender */}
            <div className="z-10 flex flex-col items-center gap-2">
                <Monitor className="w-12 h-12 text-blue-500" />
                <div className="bg-slate-800 px-3 py-1 rounded border border-slate-600 text-xs font-mono">
                    SENDER
                </div>
            </div>

            {/* Wire */}
            <div className="flex-1 h-0.5 bg-slate-800 mx-4 relative">
                
                {/* Visual Representation of EMI (External Noise) */}
                {noise > 0 && (
                     <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                        {/* The static exists in the environment regardless of cable type */}
                        <ZapOff className={`text-red-500 ${noise > 50 ? 'w-16 h-16 animate-pulse' : 'w-8 h-8'}`} />
                     </div>
                )}

                {/* Signal Traveling */}
                {isTransmitting && (
                    <motion.div 
                        className="absolute top-1/2 left-0 -translate-y-1/2"
                        initial={{ left: '0%' }}
                        animate={{ left: '100%' }}
                        transition={{ duration: 3, ease: "linear" }}
                    >
                        {medium === 'copper' ? (
                             // Sine Wave for Copper (Susceptible to Noise)
                             <div className="w-24 h-12 -mt-6">
                                <svg viewBox="0 0 100 50" className="w-full h-full">
                                    <path d="M0,25 Q12.5,0 25,25 T50,25 T75,25 T100,25" fill="none" stroke={noise > 50 ? '#ef4444' : '#f97316'} strokeWidth="2">
                                        <animate attributeName="d" dur="0.5s" repeatCount="indefinite"
                                            values={noise > 20 
                                                ? "M0,25 Q12.5,50 25,25 T50,0 T75,50 T100,25; M0,25 Q12.5,0 25,25 T50,50 T75,0 T100,25" // Jagged/Erratic if noise
                                                : "M0,25 Q12.5,0 25,25 T50,25 T75,25 T100,25; M0,25 Q12.5,50 25,25 T50,25 T75,25 T100,25; M0,25 Q12.5,0 25,25 T50,25 T75,25 T100,25" // Smooth
                                            } 
                                        />
                                    </path>
                                </svg>
                             </div>
                        ) : (
                             // Light Pulse for Fiber (Immune to Noise)
                             // Even if noise > 50, the color remains Cyan and shape remains clean
                             <div className="w-24 h-4 rounded-full blur-md shadow-[0_0_20px] bg-cyan-400 shadow-cyan-400"></div>
                        )}
                    </motion.div>
                )}
            </div>

            {/* Receiver */}
            <div className="z-10 flex flex-col items-center gap-2">
                <Monitor className={`w-12 h-12 ${receivedText ? (
                    // Logic: If Copper and Noise > 50 -> Red (Error)
                    // If Fiber -> Green (Success) always, because immune
                    (medium === 'copper' && noise > 50) ? 'text-red-500' : 'text-green-500'
                ) : 'text-slate-600'}`} />
                 
                 <div className="bg-slate-800 px-3 py-1 rounded border border-slate-600 text-xs font-mono min-w-[60px] text-center min-h-[26px]">
                    {receivedText}
                </div>
            </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
             <div className="bg-slate-800 p-4 rounded-lg">
                 <h4 className="font-bold text-white mb-1">Encoding</h4>
                 <p className="text-xs text-slate-400">Text &rarr; Binary</p>
                 <div className="mt-2 text-[10px] font-mono text-slate-500">{binary.slice(0, 16)}...</div>
             </div>
             <div className="bg-slate-800 p-4 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                 <h4 className="font-bold text-blue-400 mb-1">Signaling</h4>
                 <p className="text-xs text-slate-400">Binary &rarr; {medium === 'copper' ? 'Voltage' : 'Light'}</p>
                 
                 {/* Dynamic Feedback based on Medium + Noise */}
                 {noise > 20 && (
                     medium === 'copper' ? (
                        <p className="text-[10px] text-red-400 mt-1 font-bold animate-pulse">Signal Degraded by EMI!</p>
                     ) : (
                        <p className="text-[10px] text-green-400 mt-1 font-bold">Signal Immune to EMI</p>
                     )
                 )}
             </div>
             <div className="bg-slate-800 p-4 rounded-lg">
                 <h4 className="font-bold text-white mb-1">Decoding</h4>
                 <p className="text-xs text-slate-400">Signal &rarr; Text</p>
             </div>
        </div>
      </div>
    </div>
  );
};

export default Layer1Physical;
