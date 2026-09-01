/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAllLegalMovesForSide, makeMove } from './KhlaSiKoEngine';
import { GameState, Move, Side } from './types';

/**
 * Evaluates the board state from the perspective of a specific side.
 */
function evaluateState(state: GameState, aiSide: Side): number {
  if (state.winner === aiSide) return 10000;
  if (state.winner && state.winner !== aiSide) return -10000;

  let score = 0;

  // Tiger perspective
  if (aiSide === 'TIGER') {
    // Tigers want captured cows
    score += state.capturedCows * 150;

    // Tigers want high tiger mobility
    const tigerMoves = getAllLegalMovesForSide(
      { ...state, turn: 'TIGER' },
      'TIGER'
    );
    score += tigerMoves.length * 15;

    // Penalty if cows restrict tiger
    const cowMoves = getAllLegalMovesForSide(
      { ...state, turn: 'COW' },
      'COW'
    );
    score -= cowMoves.length * 5;
  } else {
    // Cow perspective
    // Cows want 0 captured cows
    score -= state.capturedCows * 180;

    // Cows want to restrict tiger mobility
    const tigerMoves = getAllLegalMovesForSide(
      { ...state, turn: 'TIGER' },
      'TIGER'
    );
    score -= tigerMoves.length * 25;

    // Cows want active cows on board with good mobility
    const cowMoves = getAllLegalMovesForSide(
      { ...state, turn: 'COW' },
      'COW'
    );
    score += cowMoves.length * 10;
  }

  return score;
}

/**
 * Returns the best move for the AI using heuristic search or random choice for Easy AI.
 */
export function getAIMove(
  state: GameState,
  difficulty: 'EASY' | 'MEDIUM' = 'EASY'
): Move | null {
  const legalMoves = getAllLegalMovesForSide(state, state.turn);
  if (legalMoves.length === 0) return null;

  if (difficulty === 'EASY') {
    // Easy AI:
    // If Tiger and has a capture move, 80% chance to take it because it's fun!
    if (state.turn === 'TIGER') {
      const captures = legalMoves.filter((m) => m.type === 'CAPTURE');
      if (captures.length > 0 && Math.random() < 0.8) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
    }
    // Otherwise picks a random legal move with slight bias
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // MEDIUM AI: 1-ply / 2-ply heuristic evaluation
  let bestScore = -Infinity;
  let bestMoves: Move[] = [];

  for (const move of legalMoves) {
    try {
      const nextState = makeMove(state, move);
      let score = evaluateState(nextState, state.turn);

      // Immediate win
      if (nextState.winner === state.turn) {
        return move;
      }

      // Bonus for capture
      if (move.type === 'CAPTURE') {
        score += 200;
      }

      // Check opponent's counter-move (1-ply lookahead)
      const oppLegalMoves = getAllLegalMovesForSide(nextState, nextState.turn);
      if (oppLegalMoves.length === 0) {
        score += 5000;
      } else {
        // If opponent has immediate capture on us
        if (state.turn === 'COW' && nextState.turn === 'TIGER') {
          const oppCaptures = oppLegalMoves.filter((m) => m.type === 'CAPTURE');
          score -= oppCaptures.length * 150;
        }
      }

      // Add a tiny random jitter so it doesn't always play the exact same opening
      score += (Math.random() - 0.5) * 5;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (Math.abs(score - bestScore) < 0.1) {
        bestMoves.push(move);
      }
    } catch {
      // Ignore invalid simulation
    }
  }

  if (bestMoves.length > 0) {
    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }

  return legalMoves[0];
}
