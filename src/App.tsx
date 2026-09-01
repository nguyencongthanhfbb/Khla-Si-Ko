/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  createInitialState,
  getLegalMovesForPiece,
  getLegalPlacementMoves,
  makeMove,
} from './game/KhlaSiKoEngine';
import { getAIMove } from './game/AI';
import { GameSettings, GameState, Move, Side } from './game/types';
import { SceneManager } from './3d/SceneManager';
import { sound } from './audio/SoundEffects';
import { MainMenu } from './components/MainMenu';
import { GameHUD } from './components/GameHUD';
import { PauseMenu } from './components/PauseMenu';
import { VictoryModal } from './components/VictoryModal';
import { RulesModal } from './components/RulesModal';
import { InteractiveTutorial } from './components/InteractiveTutorial';
import { DebugPanel } from './components/DebugPanel';

export default function App() {
  // Navigation & Screen View
  const [view, setView] = useState<'MENU' | 'GAME'>('MENU');
  const [showTutorial, setShowTutorial] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [showPause, setShowPause] = useState(false);

  // Game Engine State
  const [gameState, setGameState] = useState<GameState>(createInitialState);
  const [history, setHistory] = useState<GameState[]>([]);

  // Selection & Legal Moves
  const [selectedCell, setSelectedCell] = useState<number | null>(null);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [activeLegalMoves, setActiveLegalMoves] = useState<Move[]>([]);

  // Settings
  const [settings, setSettings] = useState<GameSettings>({
    gameMode: 'PVP',
    aiSide: 'TIGER',
    aiDifficulty: 'EASY',
    soundEnabled: true,
    hapticsEnabled: true,
    showCoordinates: false,
    developerMode: false,
  });

  const [isAiThinking, setIsAiThinking] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 3D Canvas Ref & Scene Manager
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneManagerRef = useRef<SceneManager | null>(null);

  // Initialize or update 3D Scene when entering GAME view
  useEffect(() => {
    if (view !== 'GAME' || !containerRef.current) return;

    const manager = new SceneManager(containerRef.current);
    sceneManagerRef.current = manager;
    manager.syncWithState(gameState);
    manager.setDebugCoordinates(settings.showCoordinates);

    return () => {
      manager.destroy();
      sceneManagerRef.current = null;
    };
  }, [view]);

  // Handle Board / Piece Interaction
  const handleInteraction = useCallback(
    (cellIndex: number, clickedPieceId?: string) => {
      if (isAnimating || isAiThinking || gameState.winner !== null || showPause) return;

      const side = gameState.turn;
      const isAiTurn = settings.gameMode === 'AI' && settings.aiSide === side;
      if (isAiTurn) return;

      const manager = sceneManagerRef.current;

      // 1. Phase 1: Cow Placement
      if (gameState.phase === 'PLACEMENT' && side === 'COW') {
        const placementMoves = getLegalPlacementMoves(gameState);
        const targetMove = placementMoves.find((m) => m.to === cellIndex);

        if (targetMove) {
          sound.playCowPlace();
          executePlayerMove(targetMove);
        } else {
          sound.playIllegal();
        }
        return;
      }

      // 2. Normal Piece Selection / Movement
      const occupantId = clickedPieceId || gameState.board[cellIndex];
      const occupant = occupantId ? gameState.pieces[occupantId] : null;

      // If user clicks one of their own movable pieces
      if (occupant && occupant.type === side) {
        if (selectedPieceId === occupant.id) {
          // Deselect
          sound.playClick();
          setSelectedPieceId(null);
          setSelectedCell(null);
          setActiveLegalMoves([]);
          manager?.setSelectedPiece(null, null);
          manager?.setLegalMoves([]);
        } else {
          // Select piece & calculate legal moves
          sound.playClick();
          const moves = getLegalMovesForPiece(gameState, occupant.id);
          setSelectedPieceId(occupant.id);
          setSelectedCell(cellIndex);
          setActiveLegalMoves(moves);
          manager?.setSelectedPiece(occupant.id, cellIndex);
          manager?.setLegalMoves(moves);
        }
        return;
      }

      // If user has a selected piece and clicks a destination cell
      if (selectedPieceId && selectedCell !== null) {
        const matchingMove = activeLegalMoves.find((m) => m.to === cellIndex);

        if (matchingMove) {
          // Execute Move
          if (matchingMove.type === 'CAPTURE') {
            sound.playCapture();
          } else if (matchingMove.side === 'TIGER') {
            sound.playTigerMove();
          } else {
            sound.playCowMove();
          }

          executePlayerMove(matchingMove);
        } else {
          // Clicked an invalid/unrelated square -> clear selection
          sound.playClick();
          setSelectedPieceId(null);
          setSelectedCell(null);
          setActiveLegalMoves([]);
          manager?.setSelectedPiece(null, null);
          manager?.setLegalMoves([]);
        }
      }
    },
    [gameState, selectedPieceId, selectedCell, activeLegalMoves, isAnimating, isAiThinking, settings, showPause]
  );

  // Hook interaction callback to 3D Scene
  useEffect(() => {
    if (sceneManagerRef.current) {
      sceneManagerRef.current.onInteraction(handleInteraction);
    }
  }, [handleInteraction]);

  // Execute Move Helper
  const executePlayerMove = (move: Move) => {
    try {
      setIsAnimating(true);
      const nextState = makeMove(gameState, move);

      setHistory((prev) => [...prev, gameState]);
      setGameState(nextState);

      setSelectedPieceId(null);
      setSelectedCell(null);
      setActiveLegalMoves([]);

      const manager = sceneManagerRef.current;
      if (manager) {
        manager.setSelectedPiece(null, null);
        manager.setLegalMoves([]);
        manager.syncWithState(nextState, move, () => {
          setIsAnimating(false);
          if (nextState.winner) {
            manager.setWinner(nextState.winner);
          }
        });
      } else {
        setIsAnimating(false);
      }
    } catch (err) {
      console.error('Move error:', err);
      setIsAnimating(false);
    }
  };

  // AI Turn Handler
  useEffect(() => {
    if (
      view !== 'GAME' ||
      settings.gameMode !== 'AI' ||
      gameState.winner !== null ||
      gameState.turn !== settings.aiSide ||
      isAnimating ||
      isAiThinking ||
      showPause
    ) {
      return;
    }

    setIsAiThinking(true);
    const timer = setTimeout(() => {
      const aiMove = getAIMove(gameState, settings.aiDifficulty);
      setIsAiThinking(false);

      if (aiMove) {
        if (aiMove.type === 'PLACE') {
          sound.playCowPlace();
        } else if (aiMove.type === 'CAPTURE') {
          sound.playCapture();
        } else if (aiMove.side === 'TIGER') {
          sound.playTigerMove();
        } else {
          sound.playCowMove();
        }

        executePlayerMove(aiMove);
      }
    }, 550);

    return () => clearTimeout(timer);
  }, [gameState, settings, isAnimating, isAiThinking, view, showPause]);

  // Undo Move
  const handleUndo = () => {
    if (history.length === 0 || isAnimating || isAiThinking) return;

    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setGameState(prev);

    setSelectedPieceId(null);
    setSelectedCell(null);
    setActiveLegalMoves([]);

    const manager = sceneManagerRef.current;
    if (manager) {
      manager.setSelectedPiece(null, null);
      manager.setLegalMoves([]);
      manager.setWinner(null);
      manager.syncWithState(prev);
    }
  };

  // Restart Game
  const handleRestart = () => {
    const freshState = createInitialState();
    setGameState(freshState);
    setHistory([]);
    setSelectedPieceId(null);
    setSelectedCell(null);
    setActiveLegalMoves([]);
    setShowPause(false);

    const manager = sceneManagerRef.current;
    if (manager) {
      manager.setSelectedPiece(null, null);
      manager.setLegalMoves([]);
      manager.setWinner(null);
      manager.syncWithState(freshState);
    }
  };

  // Start Game from Menu
  const handleStartGame = (
    mode: 'PVP' | 'AI',
    aiSide: Side = 'TIGER',
    aiDiff: 'EASY' | 'MEDIUM' = 'EASY'
  ) => {
    setSettings((s) => ({
      ...s,
      gameMode: mode,
      aiSide,
      aiDifficulty: aiDiff,
    }));
    handleRestart();
    setView('GAME');
  };

  const handleToggleSound = () => {
    const next = !settings.soundEnabled;
    sound.setMuted(!next);
    setSettings((s) => ({ ...s, soundEnabled: next }));
  };

  const handleToggleHaptics = () => {
    const next = !settings.hapticsEnabled;
    sound.setHaptics(next);
    setSettings((s) => ({ ...s, hapticsEnabled: next }));
  };

  const handleToggleCoordinates = () => {
    const next = !settings.showCoordinates;
    setSettings((s) => ({ ...s, showCoordinates: next }));
    sceneManagerRef.current?.setDebugCoordinates(next);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden select-none bg-[#271912]">
      {/* 1. Main Menu Screen */}
      {view === 'MENU' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenTutorial={() => setShowTutorial(true)}
          onOpenRules={() => setShowRules(true)}
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings((s) => ({ ...s, ...newSettings }))}
        />
      )}

      {/* 2. 3D Game Play Screen */}
      {view === 'GAME' && (
        <>
          {/* 3D WebGL Canvas Viewport */}
          <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-pointer touch-none" />

          {/* Game HUD (Turn indicator, score, action buttons) */}
          <GameHUD
            state={gameState}
            settings={settings}
            isAiThinking={isAiThinking}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            onRestart={handleRestart}
            onToggleSound={handleToggleSound}
            onResetCamera={() => sceneManagerRef.current?.resetCamera()}
            onOpenRules={() => setShowRules(true)}
            onOpenPause={() => setShowPause(true)}
            onMainMenu={() => {
              sound.playClick();
              setView('MENU');
            }}
          />

          {/* Developer Debug Panel (Only in Developer Mode) */}
          {settings.developerMode && (
            <DebugPanel
              state={gameState}
              selectedCell={selectedCell}
              selectedPieceId={selectedPieceId}
              legalMoves={activeLegalMoves}
              showCoordinates={settings.showCoordinates}
              onToggleCoordinates={handleToggleCoordinates}
              onInjectState={(newState) => {
                setGameState(newState);
                sceneManagerRef.current?.syncWithState(newState);
              }}
            />
          )}

          {/* Dedicated Pause Menu Overlay */}
          <PauseMenu
            isOpen={showPause}
            onResume={() => setShowPause(false)}
            onRestart={handleRestart}
            onOpenRules={() => {
              setShowPause(false);
              setShowRules(true);
            }}
            onMainMenu={() => {
              setShowPause(false);
              setView('MENU');
            }}
            isMuted={!settings.soundEnabled}
            onToggleMute={handleToggleSound}
            haptics={settings.hapticsEnabled}
            onToggleHaptics={handleToggleHaptics}
          />

          {/* Victory Celebration Modal */}
          <VictoryModal
            winner={gameState.winner}
            winReason={gameState.winReason}
            moveCount={gameState.moveCount}
            capturedCows={gameState.capturedCows}
            onPlayAgain={handleRestart}
            onMainMenu={() => setView('MENU')}
          />
        </>
      )}

      {/* Interactive Step-by-step Tutorial */}
      {showTutorial && (
        <InteractiveTutorial
          onClose={() => setShowTutorial(false)}
          onStartGame={() => {
            setShowTutorial(false);
            handleStartGame('PVP');
          }}
        />
      )}

      {/* Full Rules & Strategy Modal */}
      <RulesModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </main>
  );
}
