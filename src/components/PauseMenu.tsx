/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, RotateCcw, BookOpen, Home, Volume2, VolumeX, Smartphone, Palette, Box, Sparkles, TreePine } from 'lucide-react';
import { sound } from '../audio/SoundEffects';
import { KhmerCornerMotif } from './khmer';
import { VisualStyle } from '../game/types';

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
  visualStyle?: VisualStyle;
  onChangeVisualStyle?: (style: VisualStyle) => void;
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
  visualStyle = 'CUBE_PETS',
  onChangeVisualStyle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#fffdf9] border-4 border-[#663c22] rounded-3xl shadow-2xl p-5 sm:p-7 text-center text-stone-800">
        {/* Khmer Corner Ornaments */}
        <KhmerCornerMotif position="top-left" className="absolute top-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="top-right" className="absolute top-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-left" className="absolute bottom-2 left-2 w-7 h-7 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-right" className="absolute bottom-2 right-2 w-7 h-7 opacity-75 pointer-events-none" />

        {/* Title */}
        <div className="mb-4 mt-1">
          <span className="text-xs font-bold tracking-widest uppercase text-[#8a532f] block">
            បានផ្អាក · PAUSED
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#422415] font-serif">
            Khla Si Ko
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 relative z-10">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-[#8a532f] hover:bg-[#663c22] text-white font-bold text-base shadow-lg shadow-[#422415]/25 active:scale-98 transition-all flex items-center justify-center gap-2 border-b-4 border-[#422415]"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Game
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 px-6 rounded-2xl bg-[#f5ebd9] hover:bg-[#ebdcc4] text-[#422415] font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-98 border border-[#d8c29d]"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Match
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenRules();
            }}
            className="w-full py-2.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <BookOpen className="w-4 h-4" />
            How to Play
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onMainMenu();
            }}
            className="w-full py-2.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>

        {/* Visual Style Selector inside Pause Menu */}
        {onChangeVisualStyle && (
          <div className="mt-4 pt-3 border-t border-[#8a532f]/15 relative z-10 text-left">
            <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-stone-700">
              <Palette className="w-3.5 h-3.5 text-[#8a532f]" />
              <span>3D Visual Style:</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeVisualStyle('CUBE_PETS');
                }}
                className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold border transition-all ${
                  visualStyle === 'CUBE_PETS'
                    ? 'bg-[#8a532f] text-white border-[#422415]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Cube Pets
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeVisualStyle('SOFT_CHIBI');
                }}
                className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold border transition-all ${
                  visualStyle === 'SOFT_CHIBI'
                    ? 'bg-[#8a532f] text-white border-[#422415]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Soft Chibi
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onChangeVisualStyle('KHMER_WOODEN');
                }}
                className={`py-1.5 px-1 rounded-xl text-center text-[10px] font-bold border transition-all ${
                  visualStyle === 'KHMER_WOODEN'
                    ? 'bg-[#8a532f] text-white border-[#422415]'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Khmer Toy
              </button>
            </div>
          </div>
        )}

        {/* Quick Toggles */}
        <div className="mt-4 pt-3 border-t border-[#8a532f]/15 flex items-center justify-center gap-6 relative z-10">
          <button
            onClick={onToggleMute}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              !isMuted
                ? 'bg-[#faf4ea] text-[#8a532f] border-[#d8c29d]'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{!isMuted ? 'Sound' : 'Muted'}</span>
          </button>

          <button
            onClick={onToggleHaptics}
            className={`p-2 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold ${
              haptics
                ? 'bg-[#faf4ea] text-[#8a532f] border-[#d8c29d]'
                : 'bg-stone-100 text-stone-400 border-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{haptics ? 'Haptics' : 'Off'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
