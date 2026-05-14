import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Laptop, Server, Play, Pause, SkipForward, RefreshCw } from 'lucide-react';

const TCPHandshake: React.FC = () => {
  const [step, setStep] = useState(0); // 0: Idle, 1: SYN, 2: SYN-ACK, 3: ACK, 4: Established
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setStep(prev => {
          if (prev >= 4) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const reset = () => {
    setIsPlaying(false);
    setStep(0);
  };

  const getStatusText = () => {
    switch (step) {
      case 0: return "Ready to connect. Client wants to talk to Server.";
      case 1: return "Step 1: Client sends SYN (Synchronize) packet to init connection.";
      case 2: return "Step 2: Server receives SYN, replies with SYN-ACK.";
      case 3: return "Step 3: Client receives SYN-ACK, sends final ACK (Acknowledge).";
      case 4: return "Connection Established! Data can now flow.";
      default: return "";
    }
  };

  return (
    <div className="p-6 md:p-12 h-full flex flex-col items-center">
      <div className="w-full max-w-4xl text-center mb-12">
        <h2 className="text-2xl font-bold mb-2">TCP 3-Way Handshake</h2>
        <p className="text-slate-400">Reliable connection establishment process</p>
      </div>

      <div className="relative flex justify-between w-full max-w-3xl items-start h-64">
        
        {/* Client */}
        <div className="flex flex-col items-center z-10 w-32">
          <div className={`p-4 rounded-2xl transition-colors duration-500 ${step >= 4 ? 'bg-green-500/20 border-green-500' : 'bg-slate-800 border-slate-600'} border-2`}>
            <Laptop className={`w-12 h-12 ${step >= 4 ? 'text-green-400' : 'text-blue-400'}`} />
          </div>
          <span className="mt-4 font-mono font-bold">Client</span>
          <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-700">
            State: {step === 0 ? 'CLOSED' : step === 1 ? 'SYN_SENT' : 'ESTABLISHED'}
          </div>
        </div>

        {/* Server */}
        <div className="flex flex-col items-center z-10 w-32">
           <div className={`p-4 rounded-2xl transition-colors duration-500 ${step >= 4 ? 'bg-green-500/20 border-green-500' : 'bg-slate-800 border-slate-600'} border-2`}>
            <Server className={`w-12 h-12 ${step >= 4 ? 'text-green-400' : 'text-purple-400'}`} />
          </div>
          <span className="mt-4 font-mono font-bold">Server</span>
          <div className="mt-2 text-xs text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-700">
             State: {step < 2 ? 'LISTEN' : step === 2 ? 'SYN_RCVD' : 'ESTABLISHED'}
          </div>
        </div>

        {/* Animations Area */}
        <div className="absolute top-10 left-32 right-32 h-20">
            {/* Connection Lines */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-700 -z-10" />

            {/* SYN Packet */}
            {step === 1 && (
                <motion.div 
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0"
                >
                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-blue-500/50">SYN</div>
                </motion.div>
            )}

            {/* SYN-ACK Packet */}
            {step === 2 && (
                <motion.div 
                    initial={{ x: "100%", opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-8 left-0 w-full flex justify-end"
                >
                    <div className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-purple-500/50">SYN / ACK</div>
                </motion.div>
            )}

            {/* ACK Packet */}
            {step === 3 && (
                <motion.div 
                    initial={{ x: 0, opacity: 0 }}
                    animate={{ x: "100%", opacity: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute top-16 left-0"
                >
                    <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-green-500/50">ACK</div>
                </motion.div>
            )}
        </div>
      </div>

      <div className="mt-12 bg-slate-800 p-6 rounded-xl border border-slate-700 w-full max-w-2xl text-center shadow-inner">
        <p className="text-lg font-medium text-blue-200 min-h-[3rem] flex items-center justify-center">
            {getStatusText()}
        </p>
      </div>

      <div className="mt-8 flex gap-4">
        <button 
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={step >= 4}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? "Pause" : "Auto Play"}
        </button>
        <button 
            onClick={() => setStep(prev => Math.min(prev + 1, 4))}
            disabled={step >= 4 || isPlaying}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <SkipForward className="w-5 h-5" />
            Step
        </button>
        <button 
            onClick={reset}
            className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg font-bold text-slate-300"
        >
            <RefreshCw className="w-5 h-5" />
            Reset
        </button>
      </div>
    </div>
  );
};

export default TCPHandshake;