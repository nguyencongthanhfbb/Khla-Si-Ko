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
    titleKhmer: '១. ការដាក់គោ (ដំណាក់កាលទី ១)',
    titleEnglish: 'Lesson 1: Placing Cows',
    subtitle: 'Phase 1 begins with Cows entering the board',
    description: [
      'The 4 Tigers start in the 4 corner cells (0, 3, 12, 15).',
      'Cows play first! On each Cow turn, place 1 Cow onto any empty square.',
      'Cows cannot move yet during Phase 1.',
      'After Cow places a piece, Tigers take their turn (move 1 step or capture).',
    ],
    boardIllustration: {
      tigers: [0, 3, 12, 15],
      cows: [5],
      highlightCells: [5],
    },
    tip: 'Tip: Place cows in central cells to avoid getting cornered early!',
  },
  {
    titleKhmer: '២. ការដើររបស់ខ្លា (ចលនាត្រង់)',
    titleEnglish: 'Lesson 2: Tiger Movement',
    subtitle: 'Tigers move 1 cell orthogonally (Up, Down, Left, Right)',
    description: [
      'Tigers move exactly 1 step in straight horizontal or vertical directions.',
      'Diagonal movement is NEVER allowed.',
      'Tigers can move during both Phase 1 and Phase 2.',
    ],
    boardIllustration: {
      tigers: [0, 3, 12, 15],
      cows: [5],
      highlightCells: [1, 4],
      arrows: [
        { from: 0, to: 1, type: 'move' },
        { from: 0, to: 4, type: 'move' },
      ],
    },
    tip: 'Tigers can explore adjacent open cells to hunt or gain strategic positioning.',
  },
  {
    titleKhmer: '៣. ខ្លាលោតស៊ីគោ (ការស៊ី)',
    titleEnglish: 'Lesson 3: Tiger Capture Jump',
    subtitle: 'Jump over 1 adjacent Cow into the empty cell behind it',
    description: [
      'When a Cow is directly adjacent to a Tiger, AND the cell behind the Cow is empty...',
      'The Tiger can JUMP over the Cow into that empty space!',
      'The jumped Cow is captured and removed from the board.',
      'Tigers cannot jump over other Tigers.',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [1],
      highlightCells: [2],
      arrows: [{ from: 0, to: 2, type: 'jump' }],
    },
    tip: 'Only single straight jumps are allowed. Cows cannot jump or capture Tigers.',
  },
  {
    titleKhmer: '៤. ការស៊ីគឺស្រេចចិត្ត & គ្មានការស៊ីបន្ត',
    titleEnglish: 'Lesson 4: Optional Capture & No Chained Jumps',
    subtitle: 'Capture is optional; only 1 capture per turn',
    description: [
      'Capture is 100% OPTIONAL: A player can choose a normal 1-cell move instead of jumping.',
      'No chained / double captures: After making 1 capture jump, the turn ends immediately.',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [1],
      highlightCells: [2, 4],
      arrows: [
        { from: 0, to: 2, type: 'jump' },
        { from: 0, to: 4, type: 'move' },
      ],
    },
    tip: 'You are never forced to jump into a dangerous trap!',
  },
  {
    titleKhmer: '៥. លក្ខខណ្ឌឈ្នះ (ការឈ្នះ)',
    titleEnglish: 'Lesson 5: Win Conditions',
    subtitle: 'How either side achieves victory',
    description: [
      '🐯 Tigers Win: When all 12 Cows have been captured, or remaining Cows cannot move.',
      '🐮 Cows Win: When all 4 Tigers are completely surrounded and trapped with no legal moves!',
    ],
    boardIllustration: {
      tigers: [0],
      cows: [1, 4],
      highlightCells: [],
    },
    tip: 'As Cows, work together to build a wall and box the Tigers into corners!',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-[#fffdfa] border border-amber-900/20 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-800 flex flex-col">
        {/* Step Indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-900/10 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
              Interactive Tutorial · Step {currentStep + 1} of {LESSONS.length}
            </span>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800"
          >
            Exit Tutorial
          </button>
        </div>

        {/* Lesson Header */}
        <div className="mb-4">
          <span className="text-xs font-bold text-amber-600 block">{lesson.titleKhmer}</span>
          <h2 className="text-2xl font-extrabold text-stone-900 font-serif">{lesson.titleEnglish}</h2>
          <p className="text-sm text-stone-600 font-medium">{lesson.subtitle}</p>
        </div>

        {/* Interactive Mini-Board Diagram */}
        <div className="my-3 p-4 bg-amber-50/70 border border-amber-200/70 rounded-2xl flex flex-col items-center">
          <div className="grid grid-cols-4 gap-2 w-64 h-64 sm:w-72 sm:h-72 p-2 bg-[#5c3826] rounded-xl shadow-inner border border-amber-900/30">
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
                  <span className="absolute top-0.5 left-1 text-[9px] text-stone-400 opacity-60">{idx}</span>
                  {hasTiger && <span className="text-2xl sm:text-3xl select-none">🐯</span>}
                  {hasCow && <span className="text-2xl sm:text-3xl select-none">🐮</span>}
                  {!hasTiger && !hasCow && isHighlight && (
                    <span className="text-xs font-extrabold text-amber-900">
                      {arrow?.type === 'jump' ? '🎯 JUMP' : '✨'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Descriptions */}
        <ul className="space-y-2 text-sm sm:text-base text-stone-700 my-2">
          {lesson.description.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-700 font-bold mt-0.5">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {/* Tip Box */}
        <div className="p-3 bg-amber-100/60 rounded-xl border border-amber-300/60 text-xs sm:text-sm text-amber-950 font-medium my-2">
          {lesson.tip}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-amber-900/10 mt-auto">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
              currentStep === 0
                ? 'opacity-40 cursor-not-allowed text-stone-400'
                : 'bg-stone-200 hover:bg-stone-300 text-stone-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex gap-1.5">
            {LESSONS.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStep ? 'bg-amber-700 w-5' : 'bg-stone-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl text-sm font-bold bg-amber-700 hover:bg-amber-800 text-white shadow-md flex items-center gap-1.5 active:scale-95 transition-all"
          >
            {currentStep === LESSONS.length - 1 ? (
              <>
                Start Playing <Check className="w-4 h-4" />
              </>
            ) : (
              <>
                Next <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
