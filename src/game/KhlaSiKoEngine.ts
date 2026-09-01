/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getAllLegalMovesForSide, getLegalMovesForPiece, getLegalPlacementMoves } from './MoveGenerator';
import { TIGER_STARTING_CELLS, TOTAL_CELLS, TOTAL_COWS, TOTAL_TIGERS } from './Rules';
import { GameState, Move, Piece, Side } from './types';

/**
 * Creates the initial game state for Khla Si Ko.
 */
export function createInitialState(): GameState {
  const board: (string | null)[] = Array(TOTAL_CELLS).fill(null);
  const pieces: Record<string, Piece> = {};

  // Setup 4 Tigers in the 4 corners
  TIGER_STARTING_CELLS.forEach((cellIdx, i) => {
    const id = `tiger-${i}`;
    pieces[id] = {
      id,
      type: 'TIGER',
      position: cellIdx,
      isCaptured: false,
    };
    board[cellIdx] = id;
  });

  // Setup 12 Cows in reserve
  for (let i = 0; i < TOTAL_COWS; i++) {
    const id = `cow-${i}`;
    pieces[id] = {
      id,
      type: 'COW',
      position: null,
      isCaptured: false,
    };
  }

  return {
    board,
    pieces,
    turn: 'COW',
    phase: 'PLACEMENT',
    unplacedCows: TOTAL_COWS,
    capturedCows: 0,
    moveHistory: [],
    winner: null,
    moveCount: 0,
  };
}

/**
 * Determines whether the given move is a capture move.
 */
export function isCaptureMove(move: Move): boolean {
  return move.type === 'CAPTURE' && move.capturedIndex !== undefined;
}

/**
 * Applies a move to the state and returns a new updated GameState.
 */
export function makeMove(state: GameState, move: Move): GameState {
  if (state.winner !== null) {
    throw new Error('Cannot make a move in a finished game');
  }

  if (state.turn !== move.side) {
    throw new Error(`It is not ${move.side}'s turn`);
  }

  // Deep clone pieces and board
  const nextBoard = [...state.board];
  const nextPieces: Record<string, Piece> = {};
  for (const [id, piece] of Object.entries(state.pieces)) {
    nextPieces[id] = { ...piece };
  }

  let nextUnplacedCows = state.unplacedCows;
  let nextCapturedCows = state.capturedCows;

  if (move.type === 'PLACE') {
    if (state.phase !== 'PLACEMENT') {
      throw new Error('Cannot place cow outside PLACEMENT phase');
    }
    if (nextBoard[move.to] !== null) {
      throw new Error(`Cell ${move.to} is already occupied`);
    }

    const cowPiece = nextPieces[move.pieceId];
    if (!cowPiece || cowPiece.type !== 'COW' || cowPiece.position !== null) {
      throw new Error(`Invalid cow piece ${move.pieceId} for placement`);
    }

    cowPiece.position = move.to;
    nextBoard[move.to] = cowPiece.id;
    nextUnplacedCows -= 1;
  } else if (move.type === 'MOVE') {
    if (move.from === undefined) {
      throw new Error('Move must have a from cell');
    }
    if (nextBoard[move.to] !== null) {
      throw new Error(`Destination cell ${move.to} is already occupied`);
    }

    const movingPiece = nextPieces[move.pieceId];
    if (!movingPiece || movingPiece.position !== move.from) {
      throw new Error(`Piece ${move.pieceId} is not at cell ${move.from}`);
    }

    nextBoard[move.from] = null;
    nextBoard[move.to] = movingPiece.id;
    movingPiece.position = move.to;
  } else if (move.type === 'CAPTURE') {
    if (move.from === undefined || move.capturedIndex === undefined) {
      throw new Error('Capture move must have from and capturedIndex');
    }
    if (nextBoard[move.to] !== null) {
      throw new Error(`Destination cell ${move.to} is already occupied`);
    }

    const tigerPiece = nextPieces[move.pieceId];
    if (!tigerPiece || tigerPiece.type !== 'TIGER' || tigerPiece.position !== move.from) {
      throw new Error(`Tiger ${move.pieceId} is not at cell ${move.from}`);
    }

    const capturedPieceId = nextBoard[move.capturedIndex];
    if (!capturedPieceId) {
      throw new Error(`No piece to capture at cell ${move.capturedIndex}`);
    }

    const capturedPiece = nextPieces[capturedPieceId];
    if (!capturedPiece || capturedPiece.type !== 'COW') {
      throw new Error(`Piece at ${move.capturedIndex} is not a Cow`);
    }

    // Move Tiger
    nextBoard[move.from] = null;
    nextBoard[move.to] = tigerPiece.id;
    tigerPiece.position = move.to;

    // Remove Captured Cow
    nextBoard[move.capturedIndex] = null;
    capturedPiece.position = null;
    capturedPiece.isCaptured = true;
    nextCapturedCows += 1;
  }

  // Update Phase: if all 12 cows have been placed, we are in MOVEMENT phase
  const nextPhase = nextUnplacedCows === 0 ? 'MOVEMENT' : 'PLACEMENT';

  // Next turn
  const nextTurn: Side = state.turn === 'COW' ? 'TIGER' : 'COW';

  const nextState: GameState = {
    board: nextBoard,
    pieces: nextPieces,
    turn: nextTurn,
    phase: nextPhase,
    unplacedCows: nextUnplacedCows,
    capturedCows: nextCapturedCows,
    moveHistory: [...state.moveHistory, move],
    winner: null,
    moveCount: state.moveCount + 1,
  };

  // Check win conditions
  checkAndAssignWinner(nextState);

  return nextState;
}

/**
 * Checks win conditions and updates winner & winReason on the state.
 */
export function checkAndAssignWinner(state: GameState): void {
  // 1. Tiger wins if all 12 cows are captured
  if (state.capturedCows === TOTAL_COWS) {
    state.winner = 'TIGER';
    state.winReason = 'All 12 cows have been captured!';
    return;
  }

  // Check how many cows are on the board
  const activeCows = Object.values(state.pieces).filter(
    (p) => p.type === 'COW' && p.position !== null && !p.isCaptured
  );

  // If in MOVEMENT phase and no active cows left on board
  if (state.phase === 'MOVEMENT' && activeCows.length === 0) {
    state.winner = 'TIGER';
    state.winReason = 'All cows have been captured!';
    return;
  }

  // Check if current side has any legal moves
  const legalMoves = getAllLegalMovesForSide(state, state.turn);

  if (legalMoves.length === 0) {
    if (state.turn === 'TIGER') {
      // All Tigers are trapped/blocked -> COW wins!
      state.winner = 'COW';
      state.winReason = 'All Tigers are trapped and have no legal moves!';
    } else {
      // Cows have no legal moves -> TIGER wins!
      state.winner = 'TIGER';
      state.winReason = 'All Cows are blocked and cannot move!';
    }
  }
}

export function isGameOver(state: GameState): boolean {
  return state.winner !== null;
}

export function getWinner(state: GameState): Side | null {
  return state.winner;
}

export function getPhase(state: GameState) {
  return state.phase;
}

export { getAllLegalMovesForSide, getLegalMovesForPiece, getLegalPlacementMoves };
