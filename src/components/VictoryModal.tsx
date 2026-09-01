/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Sparkles } from 'lucide-react';
import { Side } from '../game/types';
import { sound } from '../audio/SoundEffects';
import { CharacterPreview3D } from './CharacterPreview3D';
import { KhmerCornerMotif, KbachPattern } from './khmer';

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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: winner === 'TIGER' ? ['#f37f22', '#d4af37', '#d9577e'] : ['#62b570', '#b58252', '#ffffff'],
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
      <div className="relative w-full max-w-md bg-[#fffdf9] border-4 border-[#663c22] rounded-3xl shadow-2xl p-5 sm:p-7 text-center text-stone-800 overflow-hidden">
        {/* Khmer Corner Ornaments */}
        <KhmerCornerMotif position="top-left" className="absolute top-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="top-right" className="absolute top-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />

        {/* Real 3D Winning Character Animation Preview */}
        <div className="relative mx-auto w-40 h-36 sm:w-48 sm:h-40 rounded-2xl overflow-hidden bg-[#faf4ea] border-2 border-[#d8c29d] shadow-inner mb-3">
          <CharacterPreview3D type={isTiger ? 'TIGER' : 'COW'} className="w-full h-full" />
        </div>

        {/* Title in Khmer + English */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f5ebd9] text-[#663c22] text-xs font-black tracking-widest uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{isTiger ? 'ខ្លាឈ្នះ · TIGERS WIN!' : 'គោឈ្នះ · COWS WIN!'}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#422415] font-serif">
          {isTiger ? 'Tigers Win!' : 'Cows Win!'}
        </h2>

        {/* Win Reason */}
        <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium px-4">
          {winReason || (isTiger ? 'All cows were captured or trapped!' : 'All tigers were trapped with no legal moves!')}
        </p>

        {/* Match Statistics */}
        <div className="grid grid-cols-2 gap-2.5 my-4">
          <div className="p-2.5 bg-[#faf4ea] rounded-2xl border border-[#d8c29d] text-center">
            <span className="text-[11px] font-semibold text-stone-500 block">Moves Played</span>
            <span className="text-lg font-extrabold text-[#422415]">{moveCount}</span>
          </div>
          <div className="p-2.5 bg-[#faf4ea] rounded-2xl border border-[#d8c29d] text-center">
            <span className="text-[11px] font-semibold text-stone-500 block">Cows Captured</span>
            <span className="text-lg font-extrabold text-[#b8502d]">{capturedCows} / 12</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 relative z-10">
          <button
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#8a532f] hover:bg-[#663c22] text-white font-bold text-base shadow-lg shadow-[#422415]/25 active:scale-98 transition-all flex items-center justify-center gap-2 border-b-4 border-[#422415]"
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
