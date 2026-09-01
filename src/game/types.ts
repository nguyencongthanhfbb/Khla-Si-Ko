/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Side = 'COW' | 'TIGER';
export type Phase = 'PLACEMENT' | 'MOVEMENT';
export type PieceType = 'COW' | 'TIGER';
export type MoveType = 'PLACE' | 'MOVE' | 'CAPTURE';

export interface Piece {
  id: string;
  type: PieceType;
  position: number | null; // 0-15 or null if in reserve or captured
  isCaptured?: boolean;
}

export interface Move {
  type: MoveType;
  side: Side;
  from?: number; // cell 0-15 (undefined for placement)
  to: number; // cell 0-15
  capturedIndex?: number; // cell 0-15 if capture move
  pieceId: string;
}

export interface GameState {
  board: (string | null)[]; // 16 cells (0-15), stores pieceId or null
  pieces: Record<string, Piece>;
  turn: Side;
  phase: Phase;
  unplacedCows: number; // starts at 12
  capturedCows: number; // starts at 0
  moveHistory: Move[];
  winner: Side | null;
  winReason?: string;
  moveCount: number;
}

export interface GameSettings {
  gameMode: 'PVP' | 'AI';
  aiSide: Side;
  aiDifficulty: 'EASY' | 'MEDIUM';
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  showCoordinates: boolean;
  developerMode: boolean;
}
