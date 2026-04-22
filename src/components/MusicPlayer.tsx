/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, ListMusic } from 'lucide-react';
import { DUMMY_TRACKS, Track } from '../constants';

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.error("Playback failed", e));
    } else {
      audioRef.current?.pause();
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleSkip = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    } else {
      setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    }
    // Set playing to true immediately when skipping
    setIsPlaying(true);
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTrackSelect = (index: number) => {
    setCurrentIndex(index);
    setIsPlaying(true);
    setShowQueue(false);
  };

  return (
    <div className="w-full max-w-md mx-auto glass-panel neon-border-magenta p-6 flex flex-col gap-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={() => handleSkip('next')}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm uppercase tracking-[0.2em] text-slate-500 font-mono">Current Rhythm</h3>
        <button 
          onClick={() => setShowQueue(!showQueue)}
          className={`p-2 rounded-full transition-colors ${showQueue ? 'bg-neon-magenta text-white shadow-[0_0_10px_rgba(217,70,239,0.5)]' : 'text-slate-400 hover:text-white'}`}
        >
          <ListMusic className="w-5 h-5" />
        </button>
      </div>

      <div className="relative aspect-square w-48 mx-auto group">
        <div className="absolute inset-0 bg-neon-magenta/20 blur-2xl rounded-full scale-75 group-hover:scale-90 transition-transform duration-700 opacity-50" />
        <motion.div 
          key={currentTrack.id}
          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-10"
        >
          <img 
            src={currentTrack.cover} 
            alt={currentTrack.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {isPlaying && (
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-[2px] h-8 z-20">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [10, 32, 10] }}
                transition={{ 
                  duration: 0.6, 
                  repeat: Infinity, 
                  delay: i * 0.1,
                  ease: "easeInOut"
                }}
                className="w-1 bg-neon-magenta rounded-full shadow-[0_0_8px_rgba(217,70,239,0.6)]"
              />
            ))}
          </div>
        )}
      </div>

      <div className="text-center flex flex-col gap-2 items-center">
         <motion.h2 
           key={`title-${currentTrack.id}`}
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="text-3xl font-display font-bold neon-text-magenta tracking-tight"
         >
           {currentTrack.title}
         </motion.h2>
         <motion.p 
           key={`artist-${currentTrack.id}`}
           initial={{ y: 10, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           className="text-sm font-mono tracking-[0.2em] text-slate-500 uppercase"
         >
           {currentTrack.artist}
         </motion.p>
      </div>

      <div className="flex flex-col gap-3 mt-4">
        <div className="relative h-1 w-full bg-white/5 rounded-full">
          <motion.div 
            className="absolute left-0 top-0 h-full bg-slate-400 rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between text-[10px] font-mono text-slate-600 tracking-widest">
          <span>{formatTime(audioRef.current?.currentTime || 0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 mt-2">
        <button onClick={() => handleSkip('prev')} className="p-2 text-slate-500 hover:text-white transition-colors">
          <SkipBack className="w-10 h-10 fill-current" />
        </button>
        <button 
          onClick={togglePlay}
          className="w-20 h-20 flex items-center justify-center bg-white text-dark-obsidian rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          {isPlaying ? <Pause className="w-10 h-10 fill-current" /> : <Play className="w-10 h-10 fill-current translate-x-1" />}
        </button>
        <button onClick={() => handleSkip('next')} className="p-2 text-slate-500 hover:text-white transition-colors">
          <SkipForward className="w-10 h-10 fill-current" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-slate-600 mt-4 px-2">
        <Volume2 className="w-5 h-5" />
        <div className="flex-1 h-1 bg-white/5 rounded-full relative">
          <div className="absolute left-0 top-0 h-full w-[70%] bg-slate-600 rounded-full" />
        </div>
      </div>

      <AnimatePresence>
        {showQueue && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute inset-0 z-30 bg-dark-obsidian/95 p-6 flex flex-col gap-4 overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="font-display font-bold">Up Next</h3>
              <button 
                onClick={() => setShowQueue(false)}
                className="text-sm font-mono text-slate-500 hover:text-white"
              >
                CLOSE
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {DUMMY_TRACKS.map((track, idx) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(idx)}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                    currentIndex === idx 
                      ? 'bg-neon-magenta/20 border border-neon-magenta/40' 
                      : 'hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <img src={track.cover} className="w-12 h-12 rounded-lg object-cover" alt="" referrerPolicy="no-referrer" />
                  <div className="text-left flex-1 min-w-0">
                    <p className={`font-medium truncate ${currentIndex === idx ? 'text-neon-magenta' : 'text-white'}`}>{track.title}</p>
                    <p className="text-xs text-slate-500 font-mono truncate">{track.artist}</p>
                  </div>
                  {currentIndex === idx && isPlaying && (
                    <div className="flex gap-1 h-3">
                      {[1, 2, 3].map(i => (
                        <motion.div 
                          key={i} 
                          animate={{ height: [4, 12, 4] }} 
                          transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                          className="w-1 bg-neon-magenta rounded-full"
                        />
                      ))}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
