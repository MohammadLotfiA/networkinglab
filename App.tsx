import React, { useState } from 'react';
import { Layers, Activity, Server, Terminal, ShieldCheck, Cpu, Radio, Globe, Lock, FileCode, Box, Send, Home, Calculator as CalculatorIcon, ChevronLeft, Bot } from 'lucide-react';
import Layer1Physical from './features/layers/Layer1Physical';
import Layer2DataLink from './features/layers/Layer2DataLink';
import Layer3Network from './features/layers/Layer3Network';
import Layer4Transport from './features/layers/Layer4Transport';
import Layer5Session from './features/layers/Layer5Session';
import Layer6Presentation from './features/layers/Layer6Presentation';
import Layer7Application from './features/layers/Layer7Application';
import HomePage from './features/home/HomePage';
import SubnetCalculator from './features/tools/SubnetCalculator';
import AILab from './features/tools/AILab';
import NetworkingAcademy from './features/blog/NetworkingAcademy';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'simulator' | 'calculator' | 'ailab' | 'academy'>('home');
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={(view) => setCurrentView(view as any)} />;
      case 'calculator':
        return <SubnetCalculator />;
      case 'ailab':
        return <AILab />;
      case 'academy':
        return <NetworkingAcademy onNavigate={(view) => setCurrentView(view as any)} />;
      case 'simulator':
        return (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Simulator Layer Nav */}
            <div className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700/50 p-2 flex overflow-x-auto items-center gap-1 scrollbar-hide">
              <button
                onClick={() => setCurrentView('home')}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors mr-2 border-r border-slate-700 pr-3"
              >
                <Home className="w-4 h-4" />
              </button>
              <NavButton layer={1} active={activeLayer === 1} onClick={() => setActiveLayer(1)} icon={<Cpu className="w-4 h-4" />} label="L1 Physical" color="border-orange-500" />
              <NavButton layer={2} active={activeLayer === 2} onClick={() => setActiveLayer(2)} icon={<Radio className="w-4 h-4" />} label="L2 Data Link" color="border-yellow-500" />
              <NavButton layer={3} active={activeLayer === 3} onClick={() => setActiveLayer(3)} icon={<Send className="w-4 h-4" />} label="L3 Network" color="border-green-500" />
              <NavButton layer={4} active={activeLayer === 4} onClick={() => setActiveLayer(4)} icon={<Box className="w-4 h-4" />} label="L4 Transport" color="border-blue-500" />
              <NavButton layer={5} active={activeLayer === 5} onClick={() => setActiveLayer(5)} icon={<Activity className="w-4 h-4" />} label="L5 Session" color="border-indigo-500" />
              <NavButton layer={6} active={activeLayer === 6} onClick={() => setActiveLayer(6)} icon={<FileCode className="w-4 h-4" />} label="L6 Present" color="border-pink-500" />
              <NavButton layer={7} active={activeLayer === 7} onClick={() => setActiveLayer(7)} icon={<Globe className="w-4 h-4" />} label="L7 App" color="border-purple-500" />
            </div>

            <div className="flex-1 overflow-hidden">
              {activeLayer === 1 && <Layer1Physical />}
              {activeLayer === 2 && <Layer2DataLink />}
              {activeLayer === 3 && <Layer3Network />}
              {activeLayer === 4 && <Layer4Transport />}
              {activeLayer === 5 && <Layer5Session />}
              {activeLayer === 6 && <Layer6Presentation />}
              {activeLayer === 7 && <Layer7Application />}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Universal Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-lg px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => setCurrentView('home')}
          >
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
                MLA TECH
              </h1>
              <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Interactive Networking Lab
              </p>
            </div>
          </div>

          <nav className="flex items-center gap-2 lg:gap-4 overflow-hidden">
            <div className="flex items-center text-[10px] uppercase font-bold tracking-[0.2em] text-slate-500 whitespace-nowrap">
              <button
                onClick={() => setCurrentView('home')}
                className="hover:text-blue-400 transition-colors cursor-pointer"
              >
                ACADEMY
              </button>
              {currentView !== 'home' && (
                <>
                  <span className="mx-3 opacity-20 text-lg font-light">/</span>
                  <span className="text-white">
                    {currentView === 'simulator' ? 'OSI SIMULATOR' : currentView === 'calculator' ? 'SUBNET CALCULATOR' : currentView === 'ailab' ? 'AI CONFIG LAB' : 'NETWORKING ACADEMY'}
                  </span>
                </>
              )}
              {currentView === 'simulator' && (
                <>
                  <span className="mx-3 opacity-20 text-lg font-light">/</span>
                  <span className="text-blue-400">LAYER {activeLayer}</span>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Dynamic Content */}
      <main className={`flex-1 w-full flex flex-col ${currentView === 'home' ? '' : 'p-4 md:p-8 max-w-7xl mx-auto'}`}>
        <div className={`${currentView === 'home' ? '' : 'bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden min-h-[700px] backdrop-blur-sm relative flex flex-col'}`}>
          {currentView !== 'home' && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50 z-10" />}
          {renderContent()}
        </div>
      </main>

      {/* Footer */}
      <footer className="p-8 bg-slate-800/30 border-t border-slate-800/50 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-500 text-[10px] uppercase font-bold tracking-widest">
          <div className="flex items-center gap-3">
            <span className="text-slate-400">© {new Date().getFullYear()} MLA TECH Academy</span>
            <span className="opacity-20 text-lg">|</span>
            <span>Design by Mohammad Lotfi Akbarabadi</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://mohammadlotfi.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">mohammadlotfi.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Nav Button Component
const NavButton: React.FC<{ layer: number; active: boolean; onClick: () => void; icon: React.ReactNode; label: string; color: string }> = ({ layer, active, onClick, icon, label, color }) => (
  <button
    onClick={onClick}
    className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg text-[10px] uppercase font-black transition-all duration-300 whitespace-nowrap border-b-2
        ${active
        ? `bg-slate-900/50 text-white shadow-xl ${color}`
        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-slate-700/50'}
    `}
  >
    <span className={`${active ? 'text-white' : 'opacity-50'}`}>{icon}</span>
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden font-mono">L{layer}</span>
  </button>
);

export default App;

