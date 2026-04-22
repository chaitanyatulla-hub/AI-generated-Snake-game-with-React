/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Activity, Gamepad2, Music, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col p-4 md:p-8 lg:p-12 overflow-y-auto">
      {/* Background purely aesthetic elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] aspect-square bg-[#122c30] blur-[150px] rounded-full opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square bg-[#221020] blur-[150px] rounded-full opacity-60" />
        <div className="absolute top-[40%] right-[20%] w-[30%] aspect-square bg-neon-magenta/5 blur-[120px] rounded-full" />
      </div>

      <header className="relative z-10 flex flex-row items-end justify-between gap-4 mb-20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-neon-cyan/5 border border-neon-cyan/20 rounded-full w-fit">
            <Activity className="w-3 h-3 text-neon-cyan/60 animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-neon-cyan/60 uppercase">System Online: v2.4.0</span>
          </div>
          <h1 className="text-7xl font-display font-black flex items-center leading-none tracking-tight">
            <span className="neon-text-cyan mr-4">NEON</span>
            <span className="text-white">RHYTHM</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2 pr-4">
          <span className="text-sm font-mono text-slate-600 tracking-tighter">USER_SESSION: 0xFACE2026</span>
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
               <Gamepad2 className="w-4 h-4" />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Arcade</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors cursor-pointer">
               <Music className="w-4 h-4" />
               <span className="text-[10px] font-mono uppercase tracking-[0.2em]">Player</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 max-w-7xl mx-auto w-full mb-8">
        {/* Main Game Section */}
        <section className="lg:col-span-12 xl:col-span-7 flex flex-col gap-4">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan to-neon-magenta opacity-30 blur-xl group-hover:opacity-50 transition duration-1000 -z-10" />
            <div className="glass-panel p-8 flex items-center justify-center min-h-[600px]">
              <SnakeGame />
            </div>
          </div>
        </section>

        {/* Sidebar Sections */}
        <aside className="lg:col-span-12 xl:col-span-5 flex flex-col gap-6">
          <div className="flex flex-col gap-6 sticky top-8">
            {/* Music Player */}
            <MusicPlayer />

            {/* Stats / System Info Bento Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-panel p-4 flex flex-col gap-3 group hover:border-neon-cyan/30 transition-colors">
                <div className="flex items-center justify-between">
                  <Terminal className="w-4 h-4 text-neon-cyan" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Engine</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Response Time</p>
                  <p className="text-xl font-mono text-white">12ms</p>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: ['20%', '80%', '40%', '60%'] }}
                    transition={{ repeat: Infinity, duration: 5 }}
                    className="h-full bg-neon-cyan/50" 
                  />
                </div>
              </div>

              <div className="glass-panel p-4 flex flex-col gap-3 group hover:border-neon-magenta/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="w-2 h-2 rounded-full bg-neon-magenta animate-ping" />
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Network</span>
                </div>
                <div>
                  <p className="text-xs text-slate-400 mb-1">Data Stream</p>
                  <p className="text-xl font-mono text-white">Active</p>
                </div>
                <div className="flex gap-[2px] items-end h-4">
                  {[...Array(12)].map((_, i) => (
                    <motion.div 
                      key={i}
                      animate={{ height: [`${20 + Math.random() * 80}%`, `${20 + Math.random() * 80}%`] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                      className="flex-1 bg-neon-magenta/30 rounded-t-[1px]"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Instructions */}
            <div className="glass-panel p-6 bg-transparent border-white/5">
              <h4 className="text-xs font-mono uppercase tracking-[0.3em] text-slate-500 mb-4 border-b border-white/5 pb-2">Transmission Log</h4>
              <ul className="flex flex-col gap-3">
                {[
                  { label: "OBJECTIVE", value: "Consume 'BYTES' (magenta nodes)" },
                  { label: "CAUTION", value: "Wall collision is permitted. Self-collision is terminal." },
                  { label: "SYNC", value: "Play Snake to the rhythm of AI-generated pulses." },
                ].map((item, i) => (
                  <li key={i} className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-neon-cyan/70 uppercase font-mono">{item.label}</span>
                    <span className="text-xs text-slate-400 leading-relaxed font-sans">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </main>

      <footer className="relative z-10 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-mono uppercase tracking-widest text-slate-600 max-w-7xl mx-auto w-full">
        <span>&copy; 2026 DIGITAL_VOID_LABS</span>
        <div className="flex gap-8">
          <a href="#" className="hover:text-neon-cyan transition-colors">Encryption Protocol</a>
          <a href="#" className="hover:text-neon-magenta transition-colors">Neural Sync</a>
          <a href="#" className="hover:text-white transition-colors">Terminals</a>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-lime shadow-[0_0_8px_#84cc16]" />
          <span>Sync Status: Stable</span>
        </div>
      </footer>
    </div>
  );
}
