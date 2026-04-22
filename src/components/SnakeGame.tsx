/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(seg => seg.x === newFood.x && seg.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => s + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!gameOver && !isPaused) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center gap-12 w-full max-w-md mx-auto h-full justify-center">
      <div className="flex justify-around w-full items-end pb-4">
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-600 mb-1">Current Score</span>
          <span className="font-mono text-5xl font-black text-neon-cyan leading-none">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase font-mono tracking-[0.2em] text-slate-600 mb-1">High Score</span>
          <div className="flex items-center gap-3">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-mono text-4xl font-bold text-white leading-none">{highScore.toString().padStart(4, '0')}</span>
          </div>
        </div>
      </div>

      <div className="relative aspect-square w-full bg-black rounded-[3rem] shadow-2xl overflow-hidden p-6 ring-1 ring-white/5">
        <div 
          className="grid gap-[2px] h-full w-full"
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;

            return (
              <div 
                key={i} 
                className={`w-full aspect-square rounded-[2px] ${
                  isSnake 
                    ? isHead 
                      ? 'bg-neon-cyan/90 shadow-[0_0_15px_rgba(6,182,212,0.8)] z-10' 
                      : 'bg-neon-cyan/20'
                    : isFood 
                      ? 'bg-neon-magenta shadow-[0_0_15px_rgba(217,70,239,0.8)]'
                      : 'bg-white/[0.01]'
                }`}
              />
            );
          })}
        </div>

        <AnimatePresence>
          {(gameOver || isPaused) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]"
            >
              <div className="flex flex-col items-center gap-8 text-center">
                {gameOver ? (
                  <>
                    <h2 className="text-5xl font-display font-black text-white italic tracking-tighter">GAME OVER</h2>
                    <button 
                      onClick={resetGame}
                      className="px-10 py-4 bg-neon-magenta text-white font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                      <RefreshCw className="w-6 h-6" />
                      RETRY
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-6xl font-display font-black text-white tracking-tight">READY?</h2>
                    <button 
                      onClick={() => setIsPaused(false)}
                      className="flex items-center gap-3 px-12 py-5 bg-[#d946ef] text-white font-black rounded-[2rem] shadow-[0_0_40px_-5px_rgba(217,70,239,0.6)] hover:scale-105 transition-all text-xl"
                    >
                      <Play className="w-8 h-8 fill-current" />
                      START
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 w-full px-4 overflow-x-auto py-2">
        <div className="flex-1 flex flex-col gap-1 glass-panel p-3 border-none bg-white/[0.03]">
          <span className="text-[9px] uppercase tracking-widest text-slate-500">Controls</span>
          <div className="flex gap-2">
             <kbd className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono">WASD</kbd>
             <kbd className="px-2 py-1 rounded bg-white/10 text-[10px] font-mono">ARROWS</kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
