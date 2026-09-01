/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { sound } from '../audio/SoundEffects';

interface TutorialProps {
  onClose: () => void;
  onStartGame: () => void;
}

interface Lesson {
  titleKhmer: string;
  titleEnglish: string;
  subtitle: string;
  description: string[];
  boardIllustration: {
    tigers: number[];
    cows: number[];
    highlightCells?: number[];
    arrows?: { from: number; to: number; type: 'move' | 'jump' }[];
  };
  tip: string;
}

const LESSONS: Lesson[] = [
  {
    titleKhmer: '១. ស្គាល់តួអង្គខ្លា និងគោ',
    titleEnglish: 'Lesson 1: Meet Tigers and Cows',
    subtitle: 'The 4 Tigers start in 4 corners; 12 Cows enter one by one',
    description: [
      'Tigers (4 pieces) begin in the four corner cells (0, 3, 12, 15).',
      'Cows (12 pieces) start in reserve and enter during Phase 1.',
      'Cows always make the first move in the game!',
    ],
    boardIllustration: {
      tigers: [0, 3, 12, 15],
      cows: [],
      highlightCells: [5, 6, 9, 10],
    },
    tip: 'Tip: Central squares (5, 6, 9, 10) are strong control points for Cows.',
  },
  {
    titleKhmer: '២. ការដាក់គោ (ដំណាក់កាលទី ១)',
    titleEnglish: 'Lesson 2: Placing Cows',
    subtitle: 'Phase 1 begins with Cows placing 1 by 1',
    description: [
      'On each Cow turn, place 1 Cow into any empty square.',
      'Cows cannot slide or move yet during Phase 1 (only place).',
      'After each Cow is placed, Tigers take their turn (move or jump).',
    ],
    boardIllustration: {
      tigers: [0, 3, 12, 15],
      cows: [5, 6],
      highlightCells: [9, 10],
    },
    tip: 'Place Cows close together so they can protect each other from Tiger jump lines!',
  },
  {
    titleKhmer: '៣. ការដើរត្រង់ (ចលនា ១ ជំហាន)',
    titleEnglish: 'Lesson 3: Straight Movement',
    subtitle: 'Pieces move 1 cell orthogonally (Up, Down, Left, Right)',
    description: [
      'Both Tigers and Cows move exactly 1 step in orthogonal directions.',
      'Diagonal movement is NEVER allowed.',
      'Phase 2 begins once all 12 Cows are on the board, allowing Cows to move.',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [5],
      highlightCells: [1, 4],
      arrows: [
        { from: 0, to: 1, type: 'move' },
        { from: 0, to: 4, type: 'move' },
      ],
    },
    tip: 'Always look for open orthogonal pathways before committing your move.',
  },
  {
    titleKhmer: '៤. ខ្លាលោតស៊ីគោ (ការស៊ី)',
    titleEnglish: 'Lesson 4: Tiger Capture Jump',
    subtitle: 'Jump over 1 adjacent Cow into an empty cell behind it',
    description: [
      'When a Cow is directly next to a Tiger and the space behind it is empty...',
      'The Tiger jumps over the Cow into that empty space!',
      'The jumped Cow is captured and removed from the board.',
      'Capture is optional and no chained double jumps are allowed.',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [1],
      highlightCells: [2],
      arrows: [{ from: 0, to: 2, type: 'jump' }],
    },
    tip: 'Cows cannot capture Tigers. Only Tigers can jump and capture.',
  },
  {
    titleKhmer: '៥. លក្ខខណ្ឌឈ្នះ (ការឈ្នះ)',
    titleEnglish: 'Lesson 5: Win Conditions',
    subtitle: 'How either side achieves victory',
    description: [
      'Tigers Win: When all 12 Cows are captured, or remaining Cows cannot move.',
      'Cows Win: When all 4 Tigers are completely surrounded and boxed in with zero legal moves!',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [1, 4],
      highlightCells: [],
    },
    tip: 'As Cows, build coordinate walls to corner all 4 Tigers and trap them!',
  },
];

export const InteractiveTutorial: React.FC<TutorialProps> = ({ onClose, onStartGame }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const lesson = LESSONS[currentStep];

  const handleNext = () => {
    sound.playClick();
    if (currentStep < LESSONS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      onStartGame();
    }
  };

  const handlePrev = () => {
    sound.playClick();
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto bg-[#fffdfa] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-800 flex flex-col">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-2.5 border-b border-amber-900/10 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-800">
              Interactive Tutorial · Lesson {currentStep + 1} of {LESSONS.length}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs font-bold text-stone-500 hover:text-stone-800 p-1"
          >
            Exit
          </button>
        </div>

        {/* Lesson Header */}
        <div className="mb-2">
          <span className="text-xs font-bold text-amber-600 block">{lesson.titleKhmer}</span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 font-serif">{lesson.titleEnglish}</h2>
          <p className="text-xs sm:text-sm text-stone-600 font-medium">{lesson.subtitle}</p>
        </div>

        {/* Interactive Mini-Board Diagram */}
        <div className="my-2 p-3 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex flex-col items-center">
          <div className="grid grid-cols-4 gap-1.5 w-56 h-56 sm:w-64 sm:h-64 p-2 bg-[#543220] rounded-xl shadow-inner border border-amber-900/30">
            {Array.from({ length: 16 }).map((_, idx) => {
              const hasTiger = lesson.boardIllustration.tigers.includes(idx);
              const hasCow = lesson.boardIllustration.cows.includes(idx);
              const isHighlight = lesson.boardIllustration.highlightCells?.includes(idx);
              const arrow = lesson.boardIllustration.arrows?.find((a) => a.to === idx);

              return (
                <div
                  key={idx}
                  className={`relative flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                    isHighlight
                      ? 'bg-amber-300 ring-2 ring-amber-500 shadow-md animate-pulse'
                      : 'bg-[#e0c39e] text-stone-600'
                  }`}
                >
                  <span className="absolute top-0.5 left-1 text-[8px] text-stone-500 opacity-60">{idx}</span>
                  {hasTiger && (
                    <img
                      src="/assets/characters/tiger/tiger_badge.svg"
                      alt="Tiger"
                      className="w-8 h-8 rounded-full shadow-xs pointer-events-none"
                    />
                  )}
                  {hasCow && (
                    <img
                      src="/assets/characters/cow/cow_badge.svg"
                      alt="Cow"
                      className="w-8 h-8 rounded-full shadow-xs pointer-events-none"
                    />
                  )}
                  {!hasTiger && !hasCow && isHighlight && (
                    <span className="text-[10px] font-black text-amber-950">
                      {arrow?.type === 'jump' ? '🎯 JUMP' : '✨'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Descriptions */}
        <ul className="space-y-1.5 text-xs sm:text-sm text-stone-700 my-2">
          {lesson.description.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-700 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Tip Box */}
        <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-300/60 text-xs text-amber-950 font-medium my-1.5">
          {lesson.tip}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-3 border-t border-amber-900/10 mt-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Previous
          </button>

          <div className="flex gap-1.5">
            {LESSONS.map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all ${
                  i === currentStep ? 'bg-amber-700 w-5' : 'bg-stone-300 w-2'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            {currentStep === LESSONS.length - 1 ? (
              <>
                Start Playing <Check className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
