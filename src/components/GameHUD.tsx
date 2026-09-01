/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  RotateCcw,
  Volume2,
  VolumeX,
  HelpCircle,
  Home,
  Camera,
  Undo2,
  Sparkles,
  Bot,
  User,
} from 'lucide-react';
import { GameSettings, GameState, Side } from '../game/types';
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
  onMainMenu: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  state,
  settings,
  isAiThinking,
  canUndo,
  onUndo,
  onRestart,
  onToggleSound,
  onResetCamera,
  onOpenRules,
  onMainMenu,
}) => {
  const isTigerTurn = state.turn === 'TIGER';
  const isAiTurn = settings.gameMode === 'AI' && settings.aiSide === state.turn;

  return (
    <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-3 sm:p-5 z-20">
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-2">
        {/* Left: Turn Status Card */}
        <div className="pointer-events-auto flex items-center gap-3 bg-[#fffbf5]/95 border border-amber-900/15 shadow-xl rounded-2xl p-2.5 sm:px-4 sm:py-3 backdrop-blur-xs">
          {/* Avatar Icon */}
          <div
            className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-md transition-all ${
              isTigerTurn
                ? 'bg-amber-100 border border-amber-300 ring-2 ring-amber-500/40'
                : 'bg-emerald-100 border border-emerald-300 ring-2 ring-emerald-500/40'
            }`}
          >
            {isTigerTurn ? '🐯' : '🐮'}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800">
                {isTigerTurn ? 'ខ្លា · Tiger Turn' : 'គោ · Cow Turn'}
              </span>
              {settings.gameMode === 'AI' && (
                <span className="px-1.5 py-0.5 rounded-md bg-stone-200 text-[10px] font-bold text-stone-700 flex items-center gap-0.5">
                  {isAiTurn ? <Bot className="w-3 h-3 text-purple-600" /> : <User className="w-3 h-3" />}
                  {isAiTurn ? 'AI' : 'You'}
                </span>
              )}
            </div>

            <div className="text-xs sm:text-sm font-bold text-stone-800 flex items-center gap-2 mt-0.5">
              {state.phase === 'PLACEMENT' ? (
                <span className="text-emerald-700">
                  Phase 1 · {state.unplacedCows} Cow{state.unplacedCows === 1 ? '' : 's'} to place
                </span>
              ) : (
                <span className="text-blue-700">Phase 2 · Free Movement</span>
              )}
            </div>
          </div>
        </div>

        {/* Center/Right Score Pills & Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Captured Cows Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-[#fffbf5]/90 border border-amber-900/15 shadow-md rounded-2xl text-xs font-bold text-stone-800 backdrop-blur-xs">
            <span className="text-rose-600">💥 Captured:</span>
            <span className="text-stone-900 font-extrabold">{state.capturedCows} / 12</span>
          </div>

          {/* Undo */}
          <button
            onClick={() => {
              sound.playClick();
              onUndo();
            }}
            disabled={!canUndo || isAiThinking}
            title="Undo Move"
            className={`p-2.5 rounded-2xl border shadow-md backdrop-blur-xs transition-all ${
              canUndo && !isAiThinking
                ? 'bg-[#fffbf5]/95 hover:bg-amber-50 text-stone-700 border-amber-900/15 active:scale-95'
                : 'bg-stone-200/50 text-stone-400 border-stone-300/30 cursor-not-allowed opacity-50'
            }`}
          >
            <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Restart */}
          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            title="Restart Game"
            className="p-2.5 rounded-2xl bg-[#fffbf5]/95 hover:bg-amber-50 text-stone-700 border border-amber-900/15 shadow-md backdrop-blur-xs transition-all active:scale-95"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleSound();
              sound.playClick();
            }}
            title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
            className="p-2.5 rounded-2xl bg-[#fffbf5]/95 hover:bg-amber-50 text-stone-700 border border-amber-900/15 shadow-md backdrop-blur-xs transition-all active:scale-95"
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-700" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400" />
            )}
          </button>

          {/* Reset Camera */}
          <button
            onClick={() => {
              sound.playClick();
              onResetCamera();
            }}
            title="Reset Camera Angle"
            className="p-2.5 rounded-2xl bg-[#fffbf5]/95 hover:bg-amber-50 text-stone-700 border border-amber-900/15 shadow-md backdrop-blur-xs transition-all active:scale-95"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Rules / Help */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            title="How to Play"
            className="p-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-md transition-all active:scale-95"
          >
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Main Menu */}
          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            title="Back to Menu"
            className="p-2.5 rounded-2xl bg-[#fffbf5]/95 hover:bg-amber-50 text-stone-700 border border-amber-900/15 shadow-md backdrop-blur-xs transition-all active:scale-95"
          >
            <Home className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Bottom Hint Banner */}
      <div className="flex flex-col items-center gap-2 mb-1">
        {isAiThinking && (
          <div className="pointer-events-auto px-4 py-2 rounded-full bg-purple-900/90 text-purple-200 border border-purple-400/40 text-xs font-bold shadow-lg backdrop-blur-xs flex items-center gap-2 animate-pulse">
            <Bot className="w-4 h-4 text-purple-300" />
            <span>AI is planning a move...</span>
          </div>
        )}

        <div className="pointer-events-auto px-4 py-2 rounded-full bg-[#fffbf5]/95 border border-amber-900/15 text-stone-800 text-xs sm:text-sm font-semibold shadow-xl backdrop-blur-xs text-center max-w-md">
          {state.phase === 'PLACEMENT' && state.turn === 'COW' && (
            <span>🐮 Tap any highlighted empty cell to place a Cow</span>
          )}
          {state.phase === 'PLACEMENT' && state.turn === 'TIGER' && (
            <span>🐯 Tap a Tiger to see legal moves or capture jumps</span>
          )}
          {state.phase === 'MOVEMENT' && state.turn === 'COW' && (
            <span>🐮 Tap a Cow to move 1 step orthogonally</span>
          )}
          {state.phase === 'MOVEMENT' && state.turn === 'TIGER' && (
            <span>🐯 Tap a Tiger to move or jump over adjacent Cows</span>
          )}
        </div>
      </div>
    </div>
  );
};
