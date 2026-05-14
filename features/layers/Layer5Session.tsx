
import React, { useState, useEffect } from 'react';
import { Activity, Lock, Clock, LogOut, RefreshCw, Hourglass, User, Key, Eye, EyeOff, Copy, ShieldAlert, Fingerprint, ArrowRight, CheckCircle, CreditCard, DollarSign, MapPin, Mail, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ViewMode = 'CLIENT' | 'ATTACKER';
type AuthState = 'LOGIN' | 'AUTHENTICATING' | 'ACTIVE' | 'EXPIRED';

const Layer5Session: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('CLIENT');
  const [authState, setAuthState] = useState<AuthState>('LOGIN');
  
  // Session Data
  const [username, setUsername] = useState('user1');
  const [password, setPassword] = useState('password123');
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  
  // Timer Data
  const [configTtl, setConfigTtl] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);

  // Attacker Data
  const [hackerInput, setHackerInput] = useState('');
  const [hackerError, setHackerError] = useState<string | null>(null);
  const [isHijacked, setIsHijacked] = useState(false);

  // UI State
  const [showCard, setShowCard] = useState(false);

  // --- TIMER LOGIC ---
  useEffect(() => {
    let interval: any;
    if (authState === 'ACTIVE') {
        interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    handleSessionExpire();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }
    return () => clearInterval(interval);
  }, [authState]);

  // Sync Hijack Status: If session dies, hacker loses access
  useEffect(() => {
      if (authState !== 'ACTIVE') {
          setIsHijacked(false);
      }
  }, [authState]);

  const generateToken = () => {
      const chars = 'abcdef0123456789';
      let token = 'sess_';
      for(let i=0; i<16; i++) token += chars[Math.floor(Math.random() * chars.length)];
      return token;
  };

  const handleLogin = () => {
      setAuthState('AUTHENTICATING');
      setTimeout(() => {
          const newToken = generateToken();
          setSessionToken(newToken);
          setAuthState('ACTIVE');
          setTimeLeft(configTtl);
          setShowCard(false); // Reset card visibility on login
      }, 2000); // 2s animation
  };

  const handleSessionExpire = () => {
      setAuthState('EXPIRED');
      setSessionToken(null);
      setTimeout(() => setAuthState('LOGIN'), 3000);
  };

  const handleLogout = () => {
      setAuthState('LOGIN');
      setSessionToken(null);
      setIsHijacked(false);
  };

  const handleRefresh = () => {
      if (authState === 'ACTIVE') setTimeLeft(configTtl);
  };

  const attemptHijack = () => {
      setHackerError(null);
      if (authState === 'ACTIVE' && hackerInput === sessionToken) {
          setIsHijacked(true);
      } else {
          setIsHijacked(false);
          setHackerError("Invalid or Expired Session Token!");
          setTimeout(() => setHackerError(null), 3000);
      }
  };

  // Shared component for the sensitive data to ensure Client and Attacker see the EXACT same thing
  const SensitiveDashboard = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {/* Profile Card */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase border-b border-slate-700 pb-2">
                <User className="w-4 h-4" /> User Profile
            </div>
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <div className="text-white font-bold">John Doe</div>
                        <div className="text-xs text-slate-500">Premium Member</div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Mail className="w-3 h-3 text-slate-500" /> john.doe@example.com
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <MapPin className="w-3 h-3 text-slate-500" /> 742 Evergreen Terrace
                </div>
            </div>
        </div>

        {/* Financial Card */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase border-b border-slate-700 pb-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Financial Data
                </div>
                <button 
                    onClick={() => setShowCard(!showCard)}
                    className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                    {showCard ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            </div>
            
            <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-800 p-2 rounded">
                    <span className="text-xs text-slate-400">Balance</span>
                    <span className="text-green-400 font-mono font-bold flex items-center"><DollarSign className="w-3 h-3" />54,230.00</span>
                </div>
                
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-3 rounded border border-slate-700 relative">
                    <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-xs italic text-slate-500">VISA</span>
                        <CreditCard className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="text-sm font-mono text-slate-200 tracking-wider mb-2">
                        {showCard ? "4532 1234 5678 9012" : "**** **** **** 4242"}
                    </div>
                    <div className="flex gap-4 text-[10px] text-slate-400 font-mono">
                        <div>
                            <span className="block text-[8px] uppercase">Exp</span>
                            {showCard ? "12/28" : "**/**"}
                        </div>
                        <div>
                            <span className="block text-[8px] uppercase">CVV</span>
                            {showCard ? "123" : "***"}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-red-400 bg-red-900/10 p-2 rounded border border-red-900/30">
                     <ShieldAlert className="w-3 h-3 shrink-0" />
                     <span className="font-bold">Highly Sensitive Data!</span>
                     <span className="text-red-300/70">Don't share with anyone.</span>
                </div>
            </div>
        </div>
    </div>
  );

  return (
    <div className="p-4 md:p-8 h-full flex flex-col items-center w-full">
         <div className="max-w-5xl w-full flex flex-col h-full">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl">
                        <Activity className="w-8 h-8 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Layer 5: Session</h2>
                        <p className="text-slate-400">Authentication, Authorization & Session Management.</p>
                    </div>
                </div>

                {/* View Switcher */}
                <div className="bg-slate-800 p-1 rounded-lg border border-slate-700 flex">
                    <button 
                        onClick={() => setViewMode('CLIENT')}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all ${viewMode === 'CLIENT' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <User className="w-4 h-4" /> Legitimate User
                    </button>
                    <button 
                        onClick={() => setViewMode('ATTACKER')}
                        className={`flex items-center gap-2 px-4 py-2 rounded font-bold text-sm transition-all ${viewMode === 'ATTACKER' ? 'bg-red-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ShieldAlert className="w-4 h-4" /> Session Hijacker
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl relative min-h-[500px]">
                
                {/* --- CLIENT VIEW --- */}
                {viewMode === 'CLIENT' && (
                    <div className="h-full flex flex-col items-center justify-center p-8">
                        
                        <AnimatePresence mode="wait">
                            {/* 1. LOGIN FORM */}
                            {authState === 'LOGIN' && (
                                <motion.div 
                                    key="login"
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, y: -20 }}
                                    className="w-full max-w-md bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-xl"
                                >
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <Lock className="w-5 h-5 text-indigo-400" /> Secure Login
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Username</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded pl-10 pr-3 py-2 text-white outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Password</label>
                                            <div className="relative">
                                                <Key className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-900 border border-slate-600 rounded pl-10 pr-3 py-2 text-white outline-none focus:border-indigo-500" />
                                            </div>
                                        </div>
                                        <div className="pt-4">
                                            <label className="text-xs font-bold text-slate-500 uppercase">Session TTL (Seconds)</label>
                                            <input type="range" min="10" max="60" value={configTtl} onChange={(e) => setConfigTtl(Number(e.target.value))} className="w-full accent-indigo-500" />
                                            <div className="text-right text-xs text-indigo-400">{configTtl}s</div>
                                        </div>
                                        <button onClick={handleLogin} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg transition-colors mt-4">
                                            Authenticate
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* 2. AUTHENTICATING ANIMATION */}
                            {authState === 'AUTHENTICATING' && (
                                <motion.div 
                                    key="auth"
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex flex-col items-center w-full max-w-2xl"
                                >
                                    <div className="flex justify-between w-full items-center mb-12">
                                        <div className="flex flex-col items-center"><User className="w-12 h-12 text-slate-400" /><span className="font-bold mt-2">Client</span></div>
                                        
                                        <div className="flex-1 h-1 bg-slate-800 mx-8 relative">
                                            {/* Credentials Packet */}
                                            <motion.div 
                                                className="absolute top-1/2 -translate-y-1/2 bg-yellow-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded"
                                                initial={{ left: '0%' }} animate={{ left: '100%' }} transition={{ duration: 0.8, ease: "easeInOut" }}
                                            >
                                                Credentials
                                            </motion.div>
                                            {/* Token Packet Return */}
                                            <motion.div 
                                                className="absolute top-1/2 -translate-y-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded"
                                                initial={{ left: '100%', opacity: 0 }} animate={{ left: '0%', opacity: 1 }} transition={{ delay: 1, duration: 0.8, ease: "easeInOut" }}
                                            >
                                                Session Token
                                            </motion.div>
                                        </div>

                                        <div className="flex flex-col items-center"><Activity className="w-12 h-12 text-slate-400" /><span className="font-bold mt-2">Server</span></div>
                                    </div>
                                    <div className="text-indigo-400 animate-pulse font-mono">Verifying Credentials...</div>
                                </motion.div>
                            )}

                            {/* 3. ACTIVE SESSION DASHBOARD */}
                            {authState === 'ACTIVE' && sessionToken && (
                                <motion.div 
                                    key="active"
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                                    className="w-full max-w-3xl bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-2xl"
                                >
                                    <div className="bg-green-600/20 p-4 border-b border-green-500/30 flex justify-between items-center">
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle className="w-5 h-5" />
                                            <span className="font-bold">Session Established</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1 rounded-full border border-green-500/30">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            <span className="text-xs font-mono text-green-400">LIVE</span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        
                                        {/* Sensitive Data Area */}
                                        <SensitiveDashboard />

                                        {/* Token Display */}
                                        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 relative group">
                                            <div className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-2">
                                                <Fingerprint className="w-4 h-4" /> Active Session Token
                                            </div>
                                            <div className="text-lg font-mono text-indigo-400 tracking-wider break-all">
                                                {sessionToken}
                                            </div>
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(sessionToken)}
                                                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                                                title="Copy Token"
                                            >
                                                <Copy className="w-5 h-5" />
                                            </button>
                                            <div className="mt-2 text-[10px] text-slate-600">
                                                The server uses this token to unlock the data above. If hijacked, the attacker sees everything here.
                                            </div>
                                        </div>

                                        {/* Timer */}
                                        <div className="flex items-center justify-between border-t border-slate-700 pt-6">
                                            <div>
                                                <div className="text-xs text-slate-400 mb-1 font-bold uppercase">Time To Live (TTL)</div>
                                                <div className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                                    00:{timeLeft.toString().padStart(2, '0')}
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <button onClick={handleRefresh} className="flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-400 transition-colors">
                                                    <div className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
                                                        <RefreshCw className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold">Keep Alive</span>
                                                </button>
                                                <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                                                    <div className="p-3 bg-slate-700 rounded-full hover:bg-slate-600 transition-colors">
                                                        <LogOut className="w-5 h-5" />
                                                    </div>
                                                    <span className="text-[10px] font-bold">Logout</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* 4. EXPIRED STATE */}
                            {authState === 'EXPIRED' && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                                    <Hourglass className="w-16 h-16 text-red-500 mx-auto mb-4" />
                                    <h3 className="text-2xl font-bold text-white">Session Timed Out</h3>
                                    <p className="text-slate-400">The server invalidated the token due to inactivity.</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* --- ATTACKER VIEW --- */}
                {viewMode === 'ATTACKER' && (
                    <div className="h-full bg-slate-950 p-8 flex flex-col items-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                        
                        {!isHijacked ? (
                            <div className="w-full max-w-md bg-black border border-red-900/50 p-8 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.2)] z-10">
                                <h3 className="text-red-500 font-mono font-bold text-xl mb-6 flex items-center gap-2">
                                    <ShieldAlert className="w-6 h-6" /> SESSION_HIJACK_TOOL
                                </h3>
                                
                                <div className="space-y-4">
                                    <p className="text-xs text-red-400/80 font-mono">
                                        TARGET: Web Server Layer 5<br/>
                                        STATUS: Listening for Tokens...
                                    </p>
                                    
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase">Input Stolen Session ID</label>
                                        <input 
                                            type="text" 
                                            value={hackerInput}
                                            onChange={(e) => setHackerInput(e.target.value)}
                                            placeholder="sess_xxxxxxxxxxxxxxxx"
                                            className="w-full bg-slate-900 border border-red-900/50 rounded p-3 text-red-500 font-mono outline-none focus:border-red-500"
                                        />
                                    </div>

                                    <button 
                                        onClick={attemptHijack}
                                        className="w-full bg-red-900/20 hover:bg-red-900/40 border border-red-800 text-red-500 font-mono font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Eye className="w-4 h-4" /> ATTEMPT_ACCESS
                                    </button>
                                    
                                    <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-800 text-[10px] text-slate-500">
                                        {hackerError && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                                                className="mb-2 p-2 bg-red-900/30 border border-red-500/50 text-red-400 font-bold rounded"
                                            >
                                                {hackerError}
                                            </motion.div>
                                        )}
                                        <p><strong>Educational Note:</strong> If an attacker obtains a valid session token (via XSS, sniffing, etc.), the server cannot distinguish them from the real user.</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // HIJACK SUCCESS VIEW
                            <motion.div 
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="w-full max-w-3xl bg-black border border-red-500 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(220,38,38,0.5)] z-10"
                            >
                                <div className="bg-red-600 p-2 text-black font-bold font-mono text-center animate-pulse">
                                    *** ACCESS GRANTED - SESSION HIJACKED ***
                                </div>
                                <div className="p-8 opacity-75 grayscale hover:grayscale-0 transition-all duration-500 relative">
                                    
                                    <div className="mb-6 flex justify-between items-end">
                                        <h3 className="text-2xl font-bold text-white">Dashboard Access</h3>
                                        <p className="text-green-400 font-mono text-xs">Logged in via Token: {sessionToken}</p>
                                    </div>

                                    {/* Render the EXACT same dashboard as the user */}
                                    <SensitiveDashboard />

                                    {/* Attacker Overlay Text */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <div className="bg-black/80 text-red-500 font-mono font-bold text-4xl border-4 border-red-500 p-4 -rotate-12 opacity-0 hover:opacity-100 transition-opacity">
                                            OWNED
                                        </div>
                                    </div>
                                    
                                </div>
                                <div className="bg-slate-900 p-2 text-center text-red-500 font-mono text-xs border-t border-red-900">
                                    Viewing live session (Expires in: {timeLeft}s)
                                </div>
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
         </div>
    </div>
  );
};

export default Layer5Session;
