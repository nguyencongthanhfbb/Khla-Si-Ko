/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles } from 'lucide-react';
import { Side } from '../game/types';
import { sound } from '../audio/SoundEffects';
import { CharacterPreview3D } from './CharacterPreview3D';

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

      // Launch cheerful celebration confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-[#fffdfa] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-center text-stone-800 overflow-hidden">
        {/* Decorative Top Accent */}
        <div
          className={`absolute top-0 left-0 right-0 h-3 ${
            isTiger
              ? 'bg-linear-to-r from-amber-500 via-orange-500 to-amber-600'
              : 'bg-linear-to-r from-emerald-400 via-teal-500 to-emerald-600'
          }`}
        />

        {/* Real 3D Winning Character Animation Preview (No Emoji) */}
        <div className="relative mx-auto w-40 h-36 sm:w-48 sm:h-40 rounded-2xl overflow-hidden bg-linear-to-b from-amber-50/70 to-orange-50/30 border border-amber-200/70 shadow-inner mb-3">
          <CharacterPreview3D type={isTiger ? 'TIGER' : 'COW'} className="w-full h-full" />
        </div>

        {/* Title in Khmer + English */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-900 text-xs font-black tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{isTiger ? 'ខ្លាឈ្នះ · TIGERS WIN!' : 'គោឈ្នះ · COWS WIN!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-1">
          {isTiger ? 'Tigers Win!' : 'Cows Win!'}
        </h2>

        {/* Win Reason */}
        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium px-4">
          {winReason || (isTiger ? 'All cows were captured or trapped!' : 'All tigers were trapped with no legal moves!')}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-2.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-center">
            <span className="text-[11px] font-semibold text-stone-500 block">Moves Played</span>
            <span className="text-lg font-extrabold text-amber-950">{moveCount}</span>
          </div>
          <div className="p-2.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-center">
            <span className="text-[11px] font-semibold text-stone-500 block">Cows Captured</span>
            <span className="text-lg font-extrabold text-rose-700">{capturedCows} / 12</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
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
            className="w-full py-2.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};
