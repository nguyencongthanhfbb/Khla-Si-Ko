/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Side } from '../game/types';
import { sound } from '../audio/SoundEffects';

interface VictoryModalProps {
  winner: Side | null;
  winReason?: string;
  moveCount: number;
  capturedCows: number;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  winner,
  winReason,
  moveCount,
  capturedCows,
  onPlayAgain,
  onMainMenu,
}) => {
  useEffect(() => {
    if (winner) {
      sound.playVictory(winner);

      // Launch cheerful confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: winner === 'TIGER' ? ['#f38224', '#ffd32a', '#ff4757'] : ['#2ed573', '#1e90ff', '#ffffff'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [winner]);

  if (!winner) return null;

  const isTiger = winner === 'TIGER';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fffdfa] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-stone-800 overflow-hidden">
        {/* Decorative Top Accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-3 ${
            isTiger
              ? 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-600'
              : 'bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600'
          }`}
        />

        {/* Winner Icon & Avatar */}
        <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-5xl sm:text-6xl shadow-xl mb-4 bg-amber-50 border border-amber-200 animate-bounce">
          {isTiger ? '🐯' : '🐮'}
        </div>

        {/* Title in Khmer + English */}
        <span className="text-xs font-bold tracking-widest uppercase text-amber-700">
          {isTiger ? 'ខ្លាឈ្នះ' : 'គោឈ្នះ'} · VICTORY
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif mt-1">
          {isTiger ? 'Tigers Win!' : 'Cows Win!'}
        </h2>

        {/* Win Reason */}
        <p className="text-sm sm:text-base text-stone-600 mt-2 font-medium px-4">
          {winReason || (isTiger ? 'All cows were captured or trapped!' : 'All tigers were trapped!')}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-3 my-6">
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs font-semibold text-stone-500 block">Moves Played</span>
            <span className="text-xl font-bold text-amber-900">{moveCount}</span>
          </div>
          <div className="p-3 bg-amber-50/80 rounded-2xl border border-amber-100 text-center">
            <span className="text-xs font-semibold text-stone-500 block">Cows Captured</span>
            <span className="text-xl font-bold text-rose-700">{capturedCows} / 12</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-base shadow-lg shadow-amber-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
