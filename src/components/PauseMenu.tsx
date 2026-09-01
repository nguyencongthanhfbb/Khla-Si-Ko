/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, BookOpen, Home, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { sound } from '../audio/SoundEffects';

interface PauseMenuProps {
  isOpen: boolean;
  onResume: () => void;
  onRestart: () => void;
  onOpenRules: () => void;
  onMainMenu: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  haptics: boolean;
  onToggleHaptics: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  isOpen,
  onResume,
  onRestart,
  onOpenRules,
  onMainMenu,
  isMuted,
  onToggleMute,
  haptics,
  onToggleHaptics,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#fffdfa] border-2 border-amber-500/40 rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-stone-800">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-linear-to-r from-amber-500 via-orange-500 to-amber-600 rounded-t-3xl" />

        {/* Title */}
        <div className="mb-6 mt-1">
          <span className="text-xs font-bold tracking-widest uppercase text-amber-700 block">
            បានផ្អាក · PAUSED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Khla Si Ko
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-base shadow-lg shadow-amber-900/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Game
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-amber-100/80 hover:bg-amber-200/80 text-amber-950 font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Match
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            How to Play
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Home className="w-4 h-4" />
            Quit to Main Menu
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center justify-center gap-4 mt-6 pt-4 border-t border-amber-900/10">
          <button
            onClick={() => {
              sound.playClick();
              onToggleMute();
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              isMuted
                ? 'bg-rose-50 border-rose-200 text-rose-700'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'Muted' : 'Sound ON'}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onToggleHaptics();
            }}
            className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold transition-all ${
              !haptics
                ? 'bg-stone-100 border-stone-200 text-stone-500'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
            title="Toggle Haptics"
          >
            <Smartphone className="w-4 h-4" />
            {haptics ? 'Vibration ON' : 'Vibration OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
