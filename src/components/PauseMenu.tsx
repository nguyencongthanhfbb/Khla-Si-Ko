/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, BookOpen, Home, Volume2, VolumeX, Smartphone } from 'lucide-react';
import { sound } from '../audio/SoundEffects';
import { KhmerCornerMotif } from './khmer';

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
      <div className="relative w-full max-w-sm bg-[#fffdf9] border-4 border-[#663c22] rounded-3xl shadow-2xl p-6 sm:p-8 text-center text-stone-800">
        {/* Khmer Corner Ornaments */}
        <KhmerCornerMotif position="top-left" className="absolute top-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="top-right" className="absolute top-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />

        {/* Title */}
        <div className="mb-6 mt-1">
          <span className="text-xs font-bold tracking-widest uppercase text-[#8a532f] block">
            បានផ្អាក · PAUSED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#422415] font-serif">
            Khla Si Ko
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 relative z-10">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#8a532f] hover:bg-[#663c22] text-white font-bold text-base shadow-lg shadow-[#422415]/25 active:scale-98 transition-all flex items-center justify-center gap-2 border-b-4 border-[#422415]"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Game
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-[#f5ebd9] hover:bg-[#ebdcc4] text-[#422415] font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 border border-[#d8c29d]"
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
            Main Menu
          </button>
        </div>

        {/* Quick Toggles */}
        <div className="mt-6 pt-4 border-t border-[#8a532f]/15 flex items-center justify-center gap-6 relative z-10">
          <button
            onClick={onToggleMute}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              !isMuted
                ? 'bg-[#faf4ea] text-[#8a532f] border-[#d8c29d]'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span>{!isMuted ? 'Sound On' : 'Muted'}</span>
          </button>

          <button
            onClick={onToggleHaptics}
            className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-bold ${
              haptics
                ? 'bg-[#faf4ea] text-[#8a532f] border-[#d8c29d]'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>{haptics ? 'Haptics On' : 'Off'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
