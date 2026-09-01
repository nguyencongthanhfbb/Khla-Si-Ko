/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Users, Bot, BookOpen, HelpCircle, Volume2, VolumeX, Smartphone, Sparkles, Trophy } from 'lucide-react';
import { GameSettings, Side } from '../game/types';
import { sound } from '../audio/SoundEffects';

interface MainMenuProps {
  onStartGame: (mode: 'PVP' | 'AI', aiSide?: Side, aiDiff?: 'EASY' | 'MEDIUM') => void;
  onOpenTutorial: () => void;
  onOpenRules: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenTutorial,
  onOpenRules,
  settings,
  onUpdateSettings,
}) => {
  const [showAiConfig, setShowAiConfig] = useState(false);
  const [aiSide, setAiSide] = useState<Side>('TIGER'); // Player plays as COW by default
  const [aiDifficulty, setAiDifficulty] = useState<'EASY' | 'MEDIUM'>('EASY');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-linear-to-b from-[#2d1c14] via-[#3a251a] to-[#251710] text-stone-100 overflow-hidden">
      {/* Decorative Golden Lotus Background Aura */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-lg bg-[#fffdfa]/95 border-2 border-amber-500/30 rounded-3xl shadow-2xl p-6 sm:p-8 text-stone-800 backdrop-blur-md">
        {/* Khmer Decorative Top Banner */}
        <div className="text-center space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-300 text-amber-900 text-xs font-bold uppercase tracking-widest mb-1 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Traditional Khmer Board Game
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-amber-950 font-serif tracking-tight">
            ខ្លាស៊ីគោ
          </h1>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-700 tracking-wide font-sans">
            Khla Si Ko
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-widest">
            Khmer Tiger &amp; Cow Game
          </p>
        </div>

        {/* Cute 3D Character Toy Preview Badges */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50/60 border border-amber-200/80 shadow-xs">
            <span className="text-4xl sm:text-5xl mb-1">🐯</span>
            <span className="text-xs font-bold text-amber-900">4 Tigers</span>
            <span className="text-[11px] text-stone-500 text-center">Start in 4 corners</span>
          </div>

          <div className="flex flex-col items-center p-3 rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/60 border border-emerald-200/80 shadow-xs">
            <span className="text-4xl sm:text-5xl mb-1">🐮</span>
            <span className="text-xs font-bold text-emerald-900">12 Cows</span>
            <span className="text-[11px] text-stone-500 text-center">Enter one by one</span>
          </div>
        </div>

        {/* Main Menu Action Buttons */}
        {!showAiConfig ? (
          <div className="space-y-3">
            {/* Local 2-Player */}
            <button
              onClick={() => {
                sound.playClick();
                onStartGame('PVP');
              }}
              className="w-full py-4 px-5 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-amber-950/20 active:scale-98 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-600/60 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Local 2 Players</div>
                  <div className="text-xs font-medium text-amber-200">Pass &amp; Play on 1 screen</div>
                </div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {/* Play vs AI */}
            <button
              onClick={() => {
                sound.playClick();
                setShowAiConfig(true);
              }}
              className="w-full py-4 px-5 rounded-2xl bg-[#f4ebd9] hover:bg-[#ede0c8] text-stone-800 font-extrabold text-base sm:text-lg border border-amber-900/15 shadow-md active:scale-98 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="leading-tight">Play vs AI</div>
                  <div className="text-xs font-medium text-stone-500">Practice against computer</div>
                </div>
              </div>
              <span className="text-xl group-hover:translate-x-1 transition-transform text-stone-500">→</span>
            </button>

            {/* Interactive Tutorial */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenTutorial();
              }}
              className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-amber-50/50 text-stone-800 font-bold text-sm sm:text-base border border-amber-900/15 shadow-sm active:scale-98 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <span>Interactive Tutorial</span>
              </div>
              <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                5 Lessons
              </span>
            </button>

            {/* How to Play Rules */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenRules();
              }}
              className="w-full py-3 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-stone-600" />
              <span>Full Rules &amp; Strategy</span>
            </button>
          </div>
        ) : (
          /* AI Match Customization Panel */
          <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200 space-y-4 animate-fade-in">
            <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-600" />
              Configure AI Opponent
            </h3>

            {/* Select Side */}
            <div>
              <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">You Play As:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAiSide('TIGER'); // AI is Tiger, so user is Cow
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                    aiSide === 'TIGER'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <span>🐮</span> Play as Cows
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAiSide('COW'); // AI is Cow, so user is Tiger
                  }}
                  className={`py-2.5 px-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                    aiSide === 'COW'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  <span>🐯</span> Play as Tigers
                </button>
              </div>
            </div>

            {/* Select Difficulty */}
            <div>
              <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">Difficulty:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAiDifficulty('EASY');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                    aiDifficulty === 'EASY'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  😊 Easy
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setAiDifficulty('MEDIUM');
                  }}
                  className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                    aiDifficulty === 'MEDIUM'
                      ? 'bg-stone-800 text-white border-stone-800 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  🧠 Smart
                </button>
              </div>
            </div>

            {/* Start AI Match */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setShowAiConfig(false);
                }}
                className="flex-1 py-3 rounded-xl bg-stone-200 hover:bg-stone-300 font-bold text-sm text-stone-700"
              >
                Back
              </button>

              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onStartGame('AI', aiSide, aiDifficulty);
                }}
                className="flex-2 py-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-sm shadow-md"
              >
                Start Match
              </button>
            </div>
          </div>
        )}

        {/* Bottom Audio / Haptics Toggle Settings */}
        <div className="mt-6 pt-4 border-t border-amber-900/10 flex items-center justify-between text-xs text-stone-600 font-medium">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                const next = !settings.soundEnabled;
                sound.setMuted(!next);
                onUpdateSettings({ soundEnabled: next });
                sound.playClick();
              }}
              className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
            >
              {settings.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-700" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-400" />
              )}
              <span>Sound {settings.soundEnabled ? 'ON' : 'OFF'}</span>
            </button>

            <button
              onClick={() => {
                const next = !settings.hapticsEnabled;
                sound.setHaptics(next);
                onUpdateSettings({ hapticsEnabled: next });
                sound.playClick();
              }}
              className="flex items-center gap-1.5 hover:text-amber-800 transition-colors"
            >
              <Smartphone className={`w-4 h-4 ${settings.hapticsEnabled ? 'text-amber-700' : 'text-stone-400'}`} />
              <span>Haptics {settings.hapticsEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>

          <span className="text-[11px] text-stone-400 font-mono">v1.0 · 3D Engine</span>
        </div>
      </div>
    </div>
  );
};
