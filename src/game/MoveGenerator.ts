/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DIRECTIONS, getCaptureTarget, getOrthogonalNeighbors, indexToRowCol, rowColToIndex, TOTAL_CELLS } from './Rules';
import { GameState, Move, Piece, Side } from './types';

/**
 * Generates all legal moves for a specific piece.
 */
export function getLegalMovesForPiece(state: GameState, pieceId: string): Move[] {
  if (state.winner !== null) return [];

  const piece = state.pieces[pieceId];
  if (!piece || piece.position === null || piece.isCaptured) return [];

  const moves: Move[] = [];
  const from = piece.position;

  if (piece.type === 'COW') {
    // Cows can only move during Phase 2 (MOVEMENT phase)
    if (state.phase !== 'MOVEMENT' || state.turn !== 'COW') {
      return [];
    }

    // Cows move 1 cell orthogonally to an empty cell. (NO diagonal, NO capture)
    const neighbors = getOrthogonalNeighbors(from);
    for (const to of neighbors) {
      if (state.board[to] === null) {
        moves.push({
          type: 'MOVE',
          side: 'COW',
          from,
          to,
          pieceId,
        });
      }
    }
  } else if (piece.type === 'TIGER') {
    // Tigers can move in both Phase 1 and Phase 2 on TIGER turn
    if (state.turn !== 'TIGER') {
      return [];
    }

    // 1. Normal 1-cell orthogonal moves
    const neighbors = getOrthogonalNeighbors(from);
    for (const to of neighbors) {
      if (state.board[to] === null) {
        moves.push({
          type: 'MOVE',
          side: 'TIGER',
          from,
          to,
          pieceId,
        });
      }
    }

    // 2. Jump/Capture moves over adjacent cows
    const { row, col } = indexToRowCol(from);
    for (const { dRow, dCol } of DIRECTIONS) {
      const landRow = row + dRow * 2;
      const landCol = col + dCol * 2;
      const landIndex = rowColToIndex(landRow, landCol);

      if (landIndex !== -1) {
        const captureCheck = getCaptureTarget(from, landIndex, state.board, state.pieces);
        if (captureCheck.isValid && captureCheck.capturedIndex !== undefined) {
          moves.push({
            type: 'CAPTURE',
            side: 'TIGER',
            from,
            to: landIndex,
            capturedIndex: captureCheck.capturedIndex,
            pieceId,
          });
        }
      }
    }
  }

  return moves;
}

/**
 * Generates all legal placement moves for Cows during Phase 1.
 */
export function getLegalPlacementMoves(state: GameState): Move[] {
  if (state.winner !== null || state.phase !== 'PLACEMENT' || state.turn !== 'COW' || state.unplacedCows <= 0) {
    return [];
  }

  // Find next unplaced cow id
  const nextCowId = Object.keys(state.pieces).find((id) => {
    const p = state.pieces[id];
    return p.type === 'COW' && p.position === null && !p.isCaptured;
  });

  if (!nextCowId) return [];

  const moves: Move[] = [];
  for (let idx = 0; idx < TOTAL_CELLS; idx++) {
    if (state.board[idx] === null) {
      moves.push({
        type: 'PLACE',
        side: 'COW',
        to: idx,
        pieceId: nextCowId,
      });
    }
  }

  return moves;
}

/**
 * Returns all legal moves for a given side in the current state.
 */
export function getAllLegalMovesForSide(state: GameState, side: Side): Move[] {
  if (state.winner !== null || state.turn !== side) return [];

  if (side === 'COW') {
    if (state.phase === 'PLACEMENT') {
      return getLegalPlacementMoves(state);
    }
    // Phase 2 (Movement)
    const moves: Move[] = [];
    for (const p of Object.values(state.pieces)) {
      if (p.type === 'COW' && p.position !== null && !p.isCaptured) {
        moves.push(...getLegalMovesForPiece(state, p.id));
      }
    }
    return moves;
  }

  // TIGER side
  const moves: Move[] = [];
  for (const p of Object.values(state.pieces)) {
    if (p.type === 'TIGER' && p.position !== null) {
      moves.push(...getLegalMovesForPiece(state, p.id));
    }
  }
  return moves;
}
