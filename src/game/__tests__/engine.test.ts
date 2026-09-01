/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createInitialState,
  makeMove,
  getLegalMovesForPiece,
  getAllLegalMovesForSide,
  getLegalPlacementMoves,
  isGameOver,
  checkAndAssignWinner,
} from '../KhlaSiKoEngine';
import { GameState, Move } from '../types';

export interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runAllEngineTests(): { results: TestResult[]; allPassed: boolean } {
  const results: TestResult[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, message: err.message || String(err) });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  // 1. Initial Setup & Corners
  test('Initial setup has 4 Tigers in corners & 12 unplaced Cows', () => {
    const s = createInitialState();
    assert(s.board.length === 16, 'Board must have 16 cells');
    assert(s.unplacedCows === 12, 'Must have 12 unplaced cows');
    assert(s.capturedCows === 0, 'Captured cows must start at 0');
    assert(s.turn === 'COW', 'Cow plays first');
    assert(s.phase === 'PLACEMENT', 'Starts in PLACEMENT phase');
    assert(s.board[0] === 'tiger-0', 'Corner 0 must have Tiger');
    assert(s.board[3] === 'tiger-1', 'Corner 3 must have Tiger');
    assert(s.board[12] === 'tiger-2', 'Corner 12 must have Tiger');
    assert(s.board[15] === 'tiger-3', 'Corner 15 must have Tiger');
  });

  // 2. Cow Placement
  test('Phase 1: Cow placement places cow, decrements count, and flips turn', () => {
    let s = createInitialState();
    const placementMoves = getLegalPlacementMoves(s);
    assert(placementMoves.length === 12, '12 empty cells should be available for placement');
    
    // Place at cell 5
    const move = placementMoves.find((m) => m.to === 5)!;
    s = makeMove(s, move);
    assert(s.board[5] !== null, 'Cell 5 should have a Cow');
    assert(s.unplacedCows === 11, 'Unplaced cows should now be 11');
    assert(s.turn === 'TIGER', 'Turn should switch to TIGER');
  });

  // 3. Cows cannot move during Phase 1
  test('Phase 1: Cows cannot move during PLACEMENT phase', () => {
    let s = createInitialState();
    const cowMove = getLegalPlacementMoves(s).find((m) => m.to === 5)!;
    s = makeMove(s, cowMove); // Cow placed at 5, now Tiger's turn
    
    // Even if it were Cow's turn in Phase 1, getLegalMovesForPiece on cow returns empty
    const placedCowId = s.board[5]!;
    const stateCowTurn: GameState = { ...s, turn: 'COW' };
    const moves = getLegalMovesForPiece(stateCowTurn, placedCowId);
    assert(moves.length === 0, 'Cows must not move during PLACEMENT phase');
  });

  // 4. Tiger movement in Phase 1 (1-cell orthogonal)
  test('Tiger can move 1-cell orthogonally in Phase 1', () => {
    let s = createInitialState();
    s = makeMove(s, getLegalPlacementMoves(s).find((m) => m.to === 5)!); // Cow at 5
    
    // Tiger at 0 can move to 1 or 4
    const tiger0Moves = getLegalMovesForPiece(s, 'tiger-0');
    assert(tiger0Moves.some((m) => m.to === 1), 'Tiger at 0 should be able to move to 1');
    assert(tiger0Moves.some((m) => m.to === 4), 'Tiger at 0 should be able to move to 4');
    assert(!tiger0Moves.some((m) => m.to === 5), 'Tiger at 0 cannot move diagonally to 5');
  });

  // 5. Illegal diagonal movement
  test('Diagonal movement is strictly forbidden for both Tigers and Cows', () => {
    const s = createInitialState();
    const tiger0Moves = getLegalMovesForPiece({ ...s, turn: 'TIGER' }, 'tiger-0');
    assert(!tiger0Moves.some((m) => m.to === 5), 'Diagonal move from 0 to 5 is forbidden');
  });

  // 6. Valid Capture Jump
  test('Valid Tiger jump capture removes Cow and lands 2 cells away', () => {
    let s = createInitialState();
    // Setup: Tiger at 0, Cow at 1, cell 2 empty
    // Place cow at 1
    s = makeMove(s, { type: 'PLACE', side: 'COW', to: 1, pieceId: 'cow-0' });
    
    // Tiger at 0's turn
    const tigerMoves = getLegalMovesForPiece(s, 'tiger-0');
    const captureMove = tigerMoves.find((m) => m.type === 'CAPTURE' && m.to === 2);
    assert(captureMove !== undefined, 'Tiger should have capture jump to cell 2');
    assert(captureMove?.capturedIndex === 1, 'Capture must target cell 1');

    s = makeMove(s, captureMove!);
    assert(s.board[0] === null, 'Original cell 0 is now empty');
    assert(s.board[1] === null, 'Captured Cow at cell 1 was removed');
    assert(s.board[2] === 'tiger-0', 'Tiger landed at cell 2');
    assert(s.capturedCows === 1, 'Captured cow count should increment to 1');
    assert(s.turn === 'COW', 'Turn ends immediately after single capture');
  });

  // 7. Occupied landing cell prevents capture
  test('Occupied landing cell prevents Tiger capture', () => {
    let s = createInitialState();
    // Tiger at 0, Cow at 1, Tiger at 2 (or another Cow at 2)
    s = makeMove(s, { type: 'PLACE', side: 'COW', to: 1, pieceId: 'cow-0' });
    s.board[2] = 'cow-1'; // Put another cow at 2
    s.pieces['cow-1'] = { id: 'cow-1', type: 'COW', position: 2 };
    
    const tigerMoves = getLegalMovesForPiece(s, 'tiger-0');
    const captureMove = tigerMoves.find((m) => m.type === 'CAPTURE' && m.to === 2);
    assert(captureMove === undefined, 'Cannot capture if landing cell is occupied');
  });

  // 8. Tiger cannot jump another Tiger
  test('Tiger cannot jump another Tiger', () => {
    let s = createInitialState();
    // Place tiger at 1
    s.board[1] = 'tiger-1';
    s.pieces['tiger-1'].position = 1;
    
    const tigerMoves = getLegalMovesForPiece({ ...s, turn: 'TIGER' }, 'tiger-0');
    const jumpMove = tigerMoves.find((m) => m.to === 2);
    assert(jumpMove === undefined, 'Tiger cannot jump over another Tiger');
  });

  // 9. Cow cannot capture
  test('Cow cannot capture any pieces', () => {
    const s = createInitialState();
    s.phase = 'MOVEMENT';
    s.board[5] = 'cow-0';
    s.pieces['cow-0'].position = 5;
    const cowMoves = getLegalMovesForPiece(s, 'cow-0');
    assert(cowMoves.every((m) => m.type === 'MOVE'), 'Cow moves must strictly be MOVE type');
  });

  // 10. Capture is optional
  test('Capture is optional: Tiger may choose normal move instead', () => {
    let s = createInitialState();
    s = makeMove(s, { type: 'PLACE', side: 'COW', to: 1, pieceId: 'cow-0' });
    const tigerMoves = getLegalMovesForPiece(s, 'tiger-0');
    const normalMove = tigerMoves.find((m) => m.type === 'MOVE' && m.to === 4);
    const captureMove = tigerMoves.find((m) => m.type === 'CAPTURE' && m.to === 2);
    assert(normalMove !== undefined, 'Normal move to 4 must be available');
    assert(captureMove !== undefined, 'Capture move to 2 must be available');
  });

  // 11. No chained captures / Turn ends immediately
  test('Turn ends immediately after single capture, no chained captures', () => {
    let s = createInitialState();
    s = makeMove(s, { type: 'PLACE', side: 'COW', to: 1, pieceId: 'cow-0' });
    s = makeMove(s, { type: 'CAPTURE', side: 'TIGER', from: 0, to: 2, capturedIndex: 1, pieceId: 'tiger-0' });
    assert(s.turn === 'COW', 'Must switch to COW immediately after capture');
  });

  // 12. Phase transition to MOVEMENT after 12 cows placed
  test('Phase transitions to MOVEMENT once all 12 cows are placed', () => {
    let s = createInitialState();
    // Simulate placing 12 cows
    let emptyCells = [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 13, 14];
    for (let i = 0; i < 12; i++) {
      const cell = emptyCells[i];
      const cowId = `cow-${i}`;
      s = makeMove(s, { type: 'PLACE', side: 'COW', to: cell, pieceId: cowId });
      if (i < 11) {
        // Dummy tiger move or stay for simulation: just pass turn back to cow
        s.turn = 'COW';
      }
    }
    assert(s.unplacedCows === 0, 'Unplaced cows should be 0');
    assert(s.phase === 'MOVEMENT', 'Phase must be MOVEMENT after 12 cows placed');
  });

  // 13. Phase 2 Cow Movement
  test('Phase 2: Cows can move 1 orthogonal step', () => {
    let s = createInitialState();
    s.phase = 'MOVEMENT';
    s.unplacedCows = 0;
    s.board[5] = 'cow-0';
    s.pieces['cow-0'].position = 5;
    s.board[6] = null;
    
    const cowMoves = getLegalMovesForPiece(s, 'cow-0');
    assert(cowMoves.some((m) => m.to === 6), 'Cow at 5 can move to empty orthogonal cell 6');
  });

  // 14. Cow Win when all Tigers are blocked
  test('Cow wins when all Tigers have no legal moves', () => {
    let s = createInitialState();
    s.phase = 'MOVEMENT';
    s.turn = 'TIGER';
    s.unplacedCows = 0;
    
    // Surround Tiger at 0 with cows at 1, 4, and block landing at 2, 8
    s.board[1] = 'cow-0'; s.pieces['cow-0'].position = 1;
    s.board[2] = 'cow-1'; s.pieces['cow-1'].position = 2;
    s.board[4] = 'cow-2'; s.pieces['cow-2'].position = 4;
    s.board[8] = 'cow-3'; s.pieces['cow-3'].position = 8;
    
    // Remove other 3 tigers for test setup or trap all 4
    delete s.pieces['tiger-1']; s.board[3] = null;
    delete s.pieces['tiger-2']; s.board[12] = null;
    delete s.pieces['tiger-3']; s.board[15] = null;

    // Check winner
    const tigerMoves = getAllLegalMovesForSide(s, 'TIGER');
    assert(tigerMoves.length === 0, 'Tiger has 0 legal moves');
    
    // Trigger winner check by calling makeMove or direct check
    checkAndAssignWinner(s);
    assert(s.winner === 'COW', 'Cow should win when all Tigers are trapped');
  });

  // 15. Tiger Win when all cows captured
  test('Tiger wins when all 12 cows are captured', () => {
    const s = createInitialState();
    s.capturedCows = 12;
    checkAndAssignWinner(s);
    assert(s.winner === 'TIGER', 'Tiger wins when all 12 cows are captured');
  });

  const allPassed = results.every((r) => r.passed);
  return { results, allPassed };
}
