/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameState, Move, Side } from './types';

export const BOARD_SIZE = 4;
export const TOTAL_CELLS = 16;
export const TOTAL_COWS = 12;
export const TOTAL_TIGERS = 4;

export const TIGER_STARTING_CELLS = [0, 3, 12, 15]; // Corners: (0,0), (0,3), (3,0), (3,3)

// Orthogonal directions (Up, Down, Left, Right) - NO DIAGONALS
export const DIRECTIONS = [
  { dRow: -1, dCol: 0, name: 'UP' },
  { dRow: 1, dCol: 0, name: 'DOWN' },
  { dRow: 0, dCol: -1, name: 'LEFT' },
  { dRow: 0, dCol: 1, name: 'RIGHT' },
];

export function indexToRowCol(index: number): { row: number; col: number } {
  return {
    row: Math.floor(index / BOARD_SIZE),
    col: index % BOARD_SIZE,
  };
}

export function rowColToIndex(row: number, col: number): number {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
    return -1;
  }
  return row * BOARD_SIZE + col;
}

export function getOrthogonalNeighbors(index: number): number[] {
  const { row, col } = indexToRowCol(index);
  const neighbors: number[] = [];

  for (const { dRow, dCol } of DIRECTIONS) {
    const nRow = row + dRow;
    const nCol = col + dCol;
    const nIdx = rowColToIndex(nRow, nCol);
    if (nIdx !== -1) {
      neighbors.push(nIdx);
    }
  }

  return neighbors;
}

export function isOrthogonalStep(from: number, to: number): boolean {
  const fromRC = indexToRowCol(from);
  const toRC = indexToRowCol(to);
  const dRow = Math.abs(fromRC.row - toRC.row);
  const dCol = Math.abs(fromRC.col - toRC.col);
  return (dRow === 1 && dCol === 0) || (dRow === 0 && dCol === 1);
}

export function getCaptureTarget(
  from: number,
  to: number,
  board: (string | null)[],
  pieces: GameState['pieces']
): { isValid: boolean; capturedIndex?: number } {
  const fromRC = indexToRowCol(from);
  const toRC = indexToRowCol(to);
  const dRow = toRC.row - fromRC.row;
  const dCol = toRC.col - fromRC.col;

  // Jump must be exactly 2 steps in an orthogonal line (e.g. (+-2, 0) or (0, +-2))
  const isStraightTwoStep =
    (Math.abs(dRow) === 2 && dCol === 0) || (dRow === 0 && Math.abs(dCol) === 2);

  if (!isStraightTwoStep) {
    return { isValid: false };
  }

  // Landing cell must be empty
  if (board[to] !== null) {
    return { isValid: false };
  }

  // The jumped middle cell
  const midRow = fromRC.row + dRow / 2;
  const midCol = fromRC.col + dCol / 2;
  const midIndex = rowColToIndex(midRow, midCol);

  if (midIndex === -1) {
    return { isValid: false };
  }

  const midPieceId = board[midIndex];
  if (!midPieceId) {
    return { isValid: false };
  }

  const midPiece = pieces[midPieceId];
  // Tiger can only capture a COW (cannot jump another Tiger)
  if (!midPiece || midPiece.type !== 'COW') {
    return { isValid: false };
  }

  return { isValid: true, capturedIndex: midIndex };
}
