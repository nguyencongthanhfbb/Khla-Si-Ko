/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bug, CheckCircle2, XCircle, Play, ChevronDown, ChevronUp, Eye, RefreshCw } from 'lucide-react';
import { GameState, Move } from '../game/types';
import { runAllEngineTests, TestResult } from '../game/__tests__/engine.test';
import { sound } from '../audio/SoundEffects';

interface DebugPanelProps {
  state: GameState;
  selectedCell: number | null;
  selectedPieceId: string | null;
  legalMoves: Move[];
  showCoordinates: boolean;
  onToggleCoordinates: () => void;
  onInjectState: (newState: GameState) => void;
}

export const DebugPanel: React.FC<DebugPanelProps> = ({
  state,
  selectedCell,
  selectedPieceId,
  legalMoves,
  showCoordinates,
  onToggleCoordinates,
  onInjectState,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[] | null>(null);

  const handleRunTests = () => {
    sound.playClick();
    const res = runAllEngineTests();
    setTestResults(res.results);
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm sm:max-w-md">
      {/* Floating Toggle Button */}
      <button
        onClick={() => {
          sound.playClick();
          setIsOpen(!isOpen);
        }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-900/90 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold shadow-xl backdrop-blur-xs transition-all active:scale-95"
      >
        <Bug className="w-4 h-4" />
        <span>Debug Engine</span>
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </button>

      {/* Expanded Panel */}
      {isOpen && (
        <div className="mt-2 p-4 bg-stone-900/95 text-stone-200 border border-amber-500/30 rounded-2xl shadow-2xl backdrop-blur-md text-xs space-y-3 max-h-[75vh] overflow-y-auto">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <span className="font-bold text-amber-400">Developer Engine Inspector</span>
            <button
              onClick={onToggleCoordinates}
              className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border ${
                showCoordinates
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : 'bg-stone-800 border-stone-700 text-stone-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              {showCoordinates ? 'Hide 3D IDs' : 'Show 3D IDs'}
            </button>
          </div>

          {/* Key State Info */}
          <div className="grid grid-cols-2 gap-2 bg-stone-950/60 p-2.5 rounded-lg border border-stone-800 font-mono">
            <div>
              <span className="text-stone-500">Turn: </span>
              <strong className={state.turn === 'TIGER' ? 'text-amber-400' : 'text-emerald-400'}>
                {state.turn}
              </strong>
            </div>
            <div>
              <span className="text-stone-500">Phase: </span>
              <strong className="text-blue-400">{state.phase}</strong>
            </div>
            <div>
              <span className="text-stone-500">Unplaced Cows: </span>
              <strong className="text-stone-100">{state.unplacedCows}</strong>
            </div>
            <div>
              <span className="text-stone-500">Captured: </span>
              <strong className="text-rose-400">{state.capturedCows} / 12</strong>
            </div>
            <div>
              <span className="text-stone-500">Selected Cell: </span>
              <strong className="text-yellow-400">{selectedCell !== null ? selectedCell : 'None'}</strong>
            </div>
            <div>
              <span className="text-stone-500">Winner: </span>
              <strong className="text-purple-400">{state.winner || 'None'}</strong>
            </div>
          </div>

          {/* Legal Moves List */}
          <div>
            <span className="text-stone-400 font-semibold block mb-1">
              Active Legal Moves ({legalMoves.length}):
            </span>
            <div className="bg-stone-950/80 p-2 rounded-lg border border-stone-800 font-mono text-[11px] max-h-24 overflow-y-auto space-y-1">
              {legalMoves.length === 0 ? (
                <span className="text-stone-600">No legal moves for current selection</span>
              ) : (
                legalMoves.map((m, idx) => (
                  <div key={idx} className="text-amber-200">
                    [{m.type}] {m.pieceId} {m.from !== undefined ? `cell ${m.from} -> ` : ''}to {m.to}
                    {m.capturedIndex !== undefined ? ` (cap: ${m.capturedIndex})` : ''}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Automated Test Suite Button */}
          <div className="pt-2 border-t border-stone-800">
            <button
              onClick={handleRunTests}
              className="w-full py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Run 15+ Rule Suite Tests
            </button>

            {testResults && (
              <div className="mt-2 bg-stone-950 p-2 rounded-lg border border-stone-800 max-h-40 overflow-y-auto space-y-1 font-mono text-[10px]">
                <span className="text-emerald-400 font-bold block pb-1 border-b border-stone-800">
                  {testResults.filter((t) => t.passed).length} / {testResults.length} Tests Passed
                </span>
                {testResults.map((t, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 py-0.5">
                    {t.passed ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                    )}
                    <span className={t.passed ? 'text-stone-300' : 'text-rose-300'}>
                      {t.name}
                      {!t.passed && t.message && ` (${t.message})`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
