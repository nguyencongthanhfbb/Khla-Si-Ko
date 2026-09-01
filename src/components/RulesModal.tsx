/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, ShieldAlert, Sparkles, Trophy, HelpCircle } from 'lucide-react';
import { sound } from '../audio/SoundEffects';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fffbf5] border border-amber-900/20 rounded-2xl shadow-2xl p-6 sm:p-8 text-stone-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-amber-900/10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">Traditional Khmer Game</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              ខ្លាស៊ីគោ · Khla Si Ko Rules
            </h2>
            <p className="text-sm text-stone-600 mt-0.5">Khmer Tiger &amp; Cow Board Game</p>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Sections */}
        <div className="space-y-6 mt-6 text-sm sm:text-base leading-relaxed">
          {/* 1. Board & Pieces */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/60">
            <h3 className="font-bold text-amber-950 flex items-center gap-2 mb-2 text-base">
              <Sparkles className="w-5 h-5 text-amber-600" />
              1. Board Setup
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li><strong>4 × 4 Board</strong> with 16 cells (numbered 0 to 15).</li>
              <li><strong>4 Tigers</strong> begin in the 4 corners (cells 0, 3, 12, 15).</li>
              <li><strong>12 Cows</strong> start off-board in reserve.</li>
            </ul>
          </div>

          {/* 2. Phase 1 */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200/60">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2 mb-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              2. Phase 1: Cow Placement
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li><strong>Cows play first</strong>. On each Cow turn, place 1 Cow onto any empty cell.</li>
              <li>Cows <em>cannot move</em> during Phase 1.</li>
              <li>After Cow places a piece, Tigers take their turn.</li>
              <li>Tigers may make a normal 1-cell move OR jump capture during Phase 1.</li>
              <li>Continues until all 12 Cows have entered the board.</li>
            </ul>
          </div>

          {/* 3. Phase 2 */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/60">
            <h3 className="font-bold text-blue-950 flex items-center gap-2 mb-2 text-base">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              3. Phase 2: Movement
            </h3>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li>Once all 12 Cows are placed, both sides take turns moving.</li>
              <li>Move <strong>1 cell orthogonally</strong> (Up, Down, Left, or Right).</li>
              <li><strong className="text-red-700">Diagonal movement is never allowed</strong>.</li>
            </ul>
          </div>

          {/* 4. Capture Rules */}
          <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200/60">
            <h3 className="font-bold text-rose-950 flex items-center gap-2 mb-2 text-base">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              4. Tiger Capture Rules
            </h3>
            <ul className="list-disc list-inside space-y-1.5 text-stone-700">
              <li>
                <strong>Straight Jump:</strong> Tiger jumps over 1 adjacent Cow into the empty cell directly behind it.
              </li>
              <li>The jumped Cow is removed from the board.</li>
              <li><strong>Capture is OPTIONAL:</strong> A Tiger can choose a normal move instead of capturing.</li>
              <li><strong>NO Multiple/Chained Jumps:</strong> Only 1 capture per turn. Turn ends immediately.</li>
              <li>Tigers cannot jump over Tigers. Cows cannot capture.</li>
            </ul>
          </div>

          {/* 5. Win Conditions */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/60">
            <h3 className="font-bold text-purple-950 flex items-center gap-2 mb-2 text-base">
              <Trophy className="w-5 h-5 text-purple-600" />
              5. How to Win
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
              <div className="p-3 bg-white/80 rounded-lg border border-purple-100">
                <span className="font-bold text-amber-800">🐯 Tigers Win if:</span>
                <p className="text-xs text-stone-600 mt-1">
                  All Cows are captured OR all remaining Cows are blocked with no legal moves.
                </p>
              </div>
              <div className="p-3 bg-white/80 rounded-lg border border-purple-100">
                <span className="font-bold text-emerald-800">🐮 Cows Win if:</span>
                <p className="text-xs text-stone-600 mt-1">
                  All 4 Tigers are completely surrounded and trapped with no legal moves!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-amber-900/10 flex justify-end">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold transition-all shadow-md active:scale-95"
          >
            Got it, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
