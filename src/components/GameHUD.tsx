/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Pause,
  RotateCcw,
  Camera,
  Undo2,
  Sparkles,
  Bot,
  User,
  Shield,
  Zap,
} from 'lucide-react';
import { GameSettings, GameState } from '../game/types';
import { sound } from '../audio/SoundEffects';

interface GameHUDProps {
  state: GameState;
  settings: GameSettings;
  isAiThinking: boolean;
  canUndo: boolean;
  onUndo: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
  onResetCamera: () => void;
  onOpenRules: () => void;
  onOpenPause: () => void;
  onMainMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  settings,
  isAiThinking,
  canUndo,
  onUndo,
  onResetCamera,
  onOpenPause,
}) => {
  const isTigerTurn = state.turn === 'TIGER';
  const isAiTurn = settings.gameMode === 'AI' && settings.aiSide === state.turn;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-2.5 sm:p-4 z-20 select-none">
      {/* Top Floating Action Bar */}
      <div className="flex items-start justify-between gap-2">
        {/* Left: Active Turn Card */}
        <div
          className={`pointer-events-auto flex items-center gap-2.5 bg-[#fffdfa]/95 border-2 shadow-xl rounded-2xl p-2 sm:px-3.5 sm:py-2.5 backdrop-blur-md transition-all ${
            isTigerTurn
              ? 'border-amber-500/50 ring-2 ring-amber-500/20'
              : 'border-emerald-500/50 ring-2 ring-emerald-500/20'
          }`}
        >
          {/* 3D Toy Vector Avatar */}
          <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden shadow-xs shrink-0">
            <img
              src={
                isTigerTurn
                  ? '/assets/characters/tiger/tiger_badge.svg'
                  : '/assets/characters/cow/cow_badge.svg'
              }
              alt={isTigerTurn ? 'Tiger Turn' : 'Cow Turn'}
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-950">
                {isTigerTurn ? 'ខ្លា · TIGER TURN' : 'គោ · COW TURN'}
              </span>
              {settings.gameMode === 'AI' && (
                <span className="px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-0.5">
                  {isAiTurn ? <Bot className="w-3 h-3 text-purple-600" /> : <User className="w-3 h-3 text-stone-600" />}
                  {isAiTurn ? 'AI' : 'You'}
                </span>
              )}
            </div>

            <div className="text-[11px] sm:text-xs font-bold text-stone-600 flex items-center gap-2">
              {state.phase === 'PLACEMENT' ? (
                <span className="text-emerald-700 font-bold">
                  Phase 1 · Place ({state.unplacedCows} left)
                </span>
              ) : (
                <span className="text-blue-700 font-bold">Phase 2 · Move</span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Score Counter & Actions */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Captured Cows Badge */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-[#fffdfa]/95 border border-amber-900/15 shadow-md rounded-2xl text-[11px] sm:text-xs font-extrabold text-stone-800 backdrop-blur-md">
            <span className="text-rose-600 font-black">Captured:</span>
            <span className="text-stone-900 font-black">{state.capturedCows} / 12</span>
          </div>

          {/* Undo Button */}
          <button
            onClick={() => {
              sound.playClick();
              onUndo();
            }}
            disabled={!canUndo || isAiThinking}
            title="Undo Move"
            className={`p-2 sm:p-2.5 rounded-2xl border shadow-md backdrop-blur-md transition-all ${
              canUndo && !isAiThinking
                ? 'bg-[#fffdfa]/95 hover:bg-amber-50 text-stone-700 border-amber-900/15 active:scale-95'
                : 'bg-stone-200/50 text-stone-400 border-stone-300/30 cursor-not-allowed opacity-50'
            }`}
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Reset Camera Button */}
          <button
            onClick={() => {
              sound.playClick();
              onResetCamera();
            }}
            title="Reset Camera View"
            className="p-2 sm:p-2.5 rounded-2xl bg-[#fffdfa]/95 hover:bg-amber-50 text-stone-700 border border-amber-900/15 shadow-md backdrop-blur-md transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Pause Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenPause();
            }}
            title="Pause Game"
            className="p-2 sm:px-3.5 sm:py-2.5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-950/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <Pause className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Pause</span>
          </button>
        </div>
      </div>

      {/* Bottom Hint Banner */}
      <div className="flex flex-col items-center gap-1.5 mb-1 pointer-events-none">
        {isAiThinking && (
          <div className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-purple-900/90 text-purple-200 border border-purple-400/40 text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-2 animate-pulse">
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>AI is thinking...</span>
          </div>
        )}

        <div className="pointer-events-auto px-3.5 py-1.5 rounded-full bg-[#fffdfa]/95 border border-amber-900/15 text-stone-800 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md text-center max-w-md flex items-center gap-2">
          {state.phase === 'PLACEMENT' && state.turn === 'COW' && (
            <>
              <img src="/assets/characters/cow/cow_badge.svg" alt="Cow" className="w-4 h-4 rounded-full inline" />
              <span>Tap highlighted cell to place a Cow</span>
            </>
          )}
          {state.phase === 'PLACEMENT' && state.turn === 'TIGER' && (
            <>
              <img src="/assets/characters/tiger/tiger_badge.svg" alt="Tiger" className="w-4 h-4 rounded-full inline" />
              <span>Tap a Tiger to move or capture jump</span>
            </>
          )}
          {state.phase === 'MOVEMENT' && state.turn === 'COW' && (
            <>
              <img src="/assets/characters/cow/cow_badge.svg" alt="Cow" className="w-4 h-4 rounded-full inline" />
              <span>Tap a Cow to move 1 step orthogonally</span>
            </>
          )}
          {state.phase === 'MOVEMENT' && state.turn === 'TIGER' && (
            <>
              <img src="/assets/characters/tiger/tiger_badge.svg" alt="Tiger" className="w-4 h-4 rounded-full inline" />
              <span>Tap a Tiger to move or capture jump</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
