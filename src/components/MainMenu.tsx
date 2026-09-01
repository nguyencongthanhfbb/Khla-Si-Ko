/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Bot,
  BookOpen,
  HelpCircle,
  Volume2,
  VolumeX,
  Smartphone,
  Settings,
  X,
  Play,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { GameSettings, Side } from '../game/types';
import { sound } from '../audio/SoundEffects';
import { CharacterPreview3D } from './CharacterPreview3D';
import { KbachPattern, KhmerCornerMotif } from './khmer';

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
  // Navigation: 'HOME' | 'MODE_SELECT'
  const [currentScreen, setCurrentScreen] = useState<'HOME' | 'MODE_SELECT'>('HOME');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // AI Configuration State
  const [selectedPlayType, setSelectedPlayType] = useState<'PVP' | 'AI'>('PVP');
  const [aiSide, setAiSide] = useState<Side>('TIGER'); // Player plays as COW by default
  const [aiDifficulty, setAiDifficulty] = useState<'EASY' | 'MEDIUM'>('EASY');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-3 sm:p-4 bg-[#2b180d] text-stone-100 overflow-hidden select-none">
      {/* Warm Ambient Subtle Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-amber-700/10 blur-3xl pointer-events-none" />

      {/* Handcrafted Cream Wooden Toy Box Frame */}
      <div className="relative w-full max-w-lg bg-[#fffdf9] border-4 border-[#663c22] rounded-3xl shadow-2xl p-5 sm:p-7 text-stone-800 backdrop-blur-md overflow-hidden">
        {/* Khmer Carved Corner Motifs */}
        <KhmerCornerMotif position="top-left" className="absolute top-2 left-2 w-8 h-8 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="top-right" className="absolute top-2 right-2 w-8 h-8 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-left" className="absolute bottom-2 left-2 w-8 h-8 opacity-75 pointer-events-none" />
        <KhmerCornerMotif position="bottom-right" className="absolute bottom-2 right-2 w-8 h-8 opacity-75 pointer-events-none" />

        {currentScreen === 'HOME' ? (
          /* ================= SCREEN 1: TITLE SCREEN ================= */
          <div className="space-y-4 pt-1 animate-fade-in relative z-10">
            {/* Header / Title */}
            <div className="text-center space-y-1">
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="w-12 h-2 opacity-60">
                  <KbachPattern variant="strip" color="#8A532F" />
                </div>
                <span className="text-[11px] font-bold tracking-widest text-[#8a532f] uppercase">
                  Traditional Khmer Game
                </span>
                <div className="w-12 h-2 opacity-60 rotate-180">
                  <KbachPattern variant="strip" color="#8A532F" />
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl font-black text-[#422415] font-serif tracking-tight">
                ខ្លាស៊ីគោ
              </h1>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#8a532f] tracking-wide font-sans">
                Khla Si Ko
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-widest">
                Khmer Tiger &amp; Cow Game
              </p>
            </div>

            {/* Real 3D Character Hero Showcase (Tiger + Cow around Miniature Khmer Courtyard) */}
            <div className="relative rounded-2xl bg-[#faf4ea] border-2 border-[#d8c29d] shadow-inner overflow-hidden">
              <CharacterPreview3D type="HERO_DUO" className="w-full h-44 sm:h-52" />
              
              {/* Character labels */}
              <div className="absolute bottom-2 left-3 right-3 flex justify-between pointer-events-none">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-amber-300/80 shadow-xs text-[11px] font-extrabold text-amber-950">
                  <img src="/assets/characters/tiger/tiger_badge.svg" alt="Tiger" className="w-4 h-4 rounded-full" />
                  <span>4 Tigers</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/95 border border-emerald-300/80 shadow-xs text-[11px] font-extrabold text-emerald-950">
                  <img src="/assets/characters/cow/cow_badge.svg" alt="Cow" className="w-4 h-4 rounded-full" />
                  <span>12 Cows</span>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Primary PLAY Button */}
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentScreen('MODE_SELECT');
                }}
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#8a532f] hover:bg-[#663c22] text-white font-extrabold text-lg sm:text-xl shadow-lg shadow-[#422415]/30 active:scale-98 transition-all flex items-center justify-center gap-3 group border-b-4 border-[#422415]"
              >
                <Play className="w-6 h-6 fill-current text-amber-200 group-hover:scale-110 transition-transform" />
                <span>PLAY GAME</span>
              </button>

              {/* Interactive Tutorial */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenTutorial();
                }}
                className="w-full py-3 px-5 rounded-2xl bg-white hover:bg-amber-50/60 text-stone-800 font-bold text-sm sm:text-base border border-[#8a532f]/20 shadow-xs active:scale-98 transition-all flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-[#8a532f]" />
                  <span>How to Play (Tutorial)</span>
                </div>
                <span className="text-xs font-semibold text-[#8a532f] bg-[#f5ebd9] px-2.5 py-0.5 rounded-full">
                  5 Lessons
                </span>
              </button>

              {/* Full Rules */}
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenRules();
                }}
                className="w-full py-2.5 px-5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <HelpCircle className="w-4 h-4 text-stone-600" />
                <span>Full Game Rules</span>
              </button>
            </div>

            {/* Bottom Quick Controls & Settings Trigger */}
            <div className="pt-2 border-t border-[#8a532f]/15 flex items-center justify-between text-xs text-stone-600">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowSettingsModal(true);
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-amber-100 text-stone-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Settings className="w-4 h-4 text-[#8a532f]" />
                <span>Settings</span>
              </button>

              <span className="text-[11px] text-stone-400 font-mono">Khmer Wooden Toy v0.4</span>
            </div>
          </div>
        ) : (
          /* ================= SCREEN 2: GAME MODE SELECT ================= */
          <div className="space-y-4 pt-1 animate-fade-in relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-[#8a532f]/15">
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentScreen('HOME');
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 text-xs font-bold transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>

              <h2 className="text-lg font-extrabold text-[#422415]">Select Game Mode</h2>

              <div className="w-8" />
            </div>

            {/* Mode Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Local 2-Player Card */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedPlayType('PVP');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedPlayType === 'PVP'
                    ? 'bg-[#fcf5ec] border-[#8a532f] shadow-md ring-2 ring-[#8a532f]/20'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5ebd9] text-[#663c22] flex items-center justify-center mb-2.5">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-base">Play with Friend</h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  Local 2-Player pass &amp; play on one device
                </p>
              </button>

              {/* Play vs AI Card */}
              <button
                onClick={() => {
                  sound.playClick();
                  setSelectedPlayType('AI');
                }}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  selectedPlayType === 'AI'
                    ? 'bg-[#fcf5ec] border-[#8a532f] shadow-md ring-2 ring-[#8a532f]/20'
                    : 'bg-white border-stone-200 hover:border-amber-300'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5ebd9] text-[#663c22] flex items-center justify-center mb-2.5">
                  <Bot className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-stone-900 text-base">Play vs AI</h3>
                <p className="text-xs text-stone-500 mt-1 font-medium">
                  Challenge the smart computer engine
                </p>
              </button>
            </div>

            {/* AI Customization Sub-panel (Shown when AI selected) */}
            {selectedPlayType === 'AI' && (
              <div className="p-3.5 bg-[#faf4ea] rounded-2xl border border-[#d8c29d] space-y-3 animate-fade-in">
                {/* Choose Your Side */}
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    Your Character:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiSide('TIGER'); // AI is Tiger, player is Cow
                      }}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                        aiSide === 'TIGER'
                          ? 'bg-emerald-700 text-white border-emerald-800 shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      <img src="/assets/characters/cow/cow_badge.svg" alt="Cow" className="w-5 h-5 rounded-full" />
                      <span>Play as Cows</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiSide('COW'); // AI is Cow, player is Tiger
                      }}
                      className={`py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all ${
                        aiSide === 'COW'
                          ? 'bg-[#8a532f] text-white border-[#663c22] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      <img src="/assets/characters/tiger/tiger_badge.svg" alt="Tiger" className="w-5 h-5 rounded-full" />
                      <span>Play as Tigers</span>
                    </button>
                  </div>
                </div>

                {/* Choose AI Difficulty */}
                <div>
                  <label className="text-xs font-bold text-stone-600 uppercase block mb-1.5">
                    AI Difficulty:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiDifficulty('EASY');
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                        aiDifficulty === 'EASY'
                          ? 'bg-[#422415] text-white border-[#422415] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      Friendly (Easy)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setAiDifficulty('MEDIUM');
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
                        aiDifficulty === 'MEDIUM'
                          ? 'bg-[#422415] text-white border-[#422415] shadow-xs'
                          : 'bg-white text-stone-700 border-stone-200'
                      }`}
                    >
                      Tactical (Smart)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Launch Match Button */}
            <button
              onClick={() => {
                sound.playClick();
                if (selectedPlayType === 'PVP') {
                  onStartGame('PVP');
                } else {
                  onStartGame('AI', aiSide, aiDifficulty);
                }
              }}
              className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-[#8a532f] hover:bg-[#663c22] text-white font-extrabold text-base sm:text-lg shadow-lg shadow-[#422415]/25 active:scale-98 transition-all flex items-center justify-center gap-2 border-b-4 border-[#422415]"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>START MATCH</span>
            </button>
          </div>
        )}
      </div>

      {/* ================= SETTINGS MODAL ================= */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-sm bg-[#fffdf9] border-3 border-[#663c22] rounded-3xl shadow-2xl p-5 sm:p-6 text-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-[#8a532f]/20">
              <div className="flex items-center gap-2 font-extrabold text-[#422415] text-base">
                <Settings className="w-5 h-5 text-[#8a532f]" />
                <span>Settings</span>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-full hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3.5">
              {/* Sound Audio Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf4ea] border border-[#d8c29d]">
                <div className="flex items-center gap-2.5">
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-[#8a532f]" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-stone-400" />
                  )}
                  <div>
                    <div className="font-bold text-sm text-stone-800">Game Audio</div>
                    <div className="text-[11px] text-stone-500">Wooden toy sound effects</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.soundEnabled;
                    sound.setMuted(!next);
                    onUpdateSettings({ soundEnabled: next });
                  }}
                  className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    settings.soundEnabled ? 'bg-[#8a532f]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.soundEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Haptics Vibration Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf4ea] border border-[#d8c29d]">
                <div className="flex items-center gap-2.5">
                  <Smartphone className="w-5 h-5 text-[#8a532f]" />
                  <div>
                    <div className="font-bold text-sm text-stone-800">Haptic Feedback</div>
                    <div className="text-[11px] text-stone-500">Vibration on taps &amp; moves</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const next = !settings.hapticsEnabled;
                    sound.setHaptics(next);
                    onUpdateSettings({ hapticsEnabled: next });
                  }}
                  className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    settings.hapticsEnabled ? 'bg-[#8a532f]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.hapticsEnabled ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Debug Coordinates Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf4ea] border border-[#d8c29d]">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-5 h-5 text-[#8a532f]" />
                  <div>
                    <div className="font-bold text-sm text-stone-800">Cell Coordinates</div>
                    <div className="text-[11px] text-stone-500">Show 0–15 board index markers</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ showCoordinates: !settings.showCoordinates });
                  }}
                  className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    settings.showCoordinates ? 'bg-[#8a532f]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.showCoordinates ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Developer Engine Mode Toggle */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#faf4ea] border border-[#d8c29d]">
                <div className="flex items-center gap-2.5">
                  <Settings className="w-5 h-5 text-[#8a532f]" />
                  <div>
                    <div className="font-bold text-sm text-stone-800">Developer Engine</div>
                    <div className="text-[11px] text-stone-500">Enable test runner &amp; state injector</div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onUpdateSettings({ developerMode: !settings.developerMode });
                  }}
                  className={`w-12 h-6.5 rounded-full transition-colors relative flex items-center p-0.5 ${
                    settings.developerMode ? 'bg-[#8a532f]' : 'bg-stone-300'
                  }`}
                >
                  <div
                    className={`w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform ${
                      settings.developerMode ? 'translate-x-5.5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#422415] text-white font-bold text-xs active:scale-98 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
