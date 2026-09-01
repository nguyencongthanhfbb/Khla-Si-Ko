/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Board3D, getCellPosition } from './Board3D';
import { DioramaEnvironment } from './DioramaEnvironment';
import { Indicators3D } from './Indicators3D';
import { CaptureEffects3D } from './CaptureEffects3D';
import { GamePiece3D } from './GamePiece3D';
import { GameState, Move, PieceType, Side } from '../game/types';
import { TOTAL_COWS, TOTAL_TIGERS } from '../game/Rules';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;

  public board3D: Board3D;
  public environment: DioramaEnvironment;
  public indicators: Indicators3D;
  public captureEffects: CaptureEffects3D;

  public pieceMap: Map<string, GamePiece3D> = new Map();
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private isDestroyed: boolean = false;
  private reqId: number | null = null;
  private lastTime: number = performance.now();

  private isInteracting: boolean = false;
  private onInteractCallback?: (cellIndex: number, pieceId?: string) => void;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x2d1f18); // Warm dark terracotta atmosphere

    // 2. Camera: 3/4 top-down view (approx 50 degrees)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 50);
    this.setCameraPosition(aspect);

    // 3. Renderer with soft shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // 4. Lighting (Warm sun & soft shadows)
    this.setupLighting();

    // 5. Scene Objects
    this.environment = new DioramaEnvironment();
    this.scene.add(this.environment.group);

    this.board3D = new Board3D();
    this.scene.add(this.board3D.group);

    this.indicators = new Indicators3D();
    this.scene.add(this.indicators.group);

    this.captureEffects = new CaptureEffects3D();
    this.scene.add(this.captureEffects.group);

    // 6. Instantiate 4 Tigers and 12 Cows
    for (let i = 0; i < TOTAL_TIGERS; i++) {
      const id = `tiger-${i}`;
      const tiger = new GamePiece3D(id, 'TIGER');
      this.pieceMap.set(id, tiger);
      this.scene.add(tiger.group);
    }

    for (let i = 0; i < TOTAL_COWS; i++) {
      const id = `cow-${i}`;
      const cow = new GamePiece3D(id, 'COW');
      this.pieceMap.set(id, cow);
      this.scene.add(cow.group);
    }

    // 7. Raycasting & Events
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();

    this.setupEventListeners();
    this.startLoop();
  }

  private setCameraPosition(aspect: number) {
    if (aspect < 0.8) {
      // Mobile portrait: Zoom out slightly
      this.camera.position.set(0, 8.8, 6.4);
    } else if (aspect < 1.2) {
      // Mobile landscape / Square
      this.camera.position.set(0, 7.5, 5.8);
    } else {
      // Desktop
      this.camera.position.set(0, 6.8, 5.2);
    }
    this.camera.lookAt(0, 0.2, 0);
  }

  private setupLighting() {
    // Warm ambient light
    const ambientLight = new THREE.AmbientLight(0xfff4e6, 1.2);
    this.scene.add(ambientLight);

    // Main directional sunlight
    const dirLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    dirLight.position.set(5, 10, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    dirLight.shadow.camera.left = -4.5;
    dirLight.shadow.camera.right = 4.5;
    dirLight.shadow.camera.top = 4.5;
    dirLight.shadow.camera.bottom = -4.5;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    // Soft blue sky fill light
    const fillLight = new THREE.DirectionalLight(0xa0c4ff, 0.45);
    fillLight.position.set(-5, 6, -4);
    this.scene.add(fillLight);

    // Subtle center warm point light for sparkle
    const pointLight = new THREE.PointLight(0xffd32a, 0.6, 8);
    pointLight.position.set(0, 2.5, 0);
    this.scene.add(pointLight);
  }

  private setupEventListeners() {
    const el = this.renderer.domElement;

    const handlePointerDown = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      // Check intersections with cells and pieces
      const cellIntersects = this.raycaster.intersectObjects(this.board3D.cellMeshes, false);

      if (cellIntersects.length > 0) {
        const hit = cellIntersects[0];
        const cellIndex = hit.object.userData.cellIndex;
        if (cellIndex !== undefined && this.onInteractCallback) {
          this.onInteractCallback(cellIndex);
          return;
        }
      }

      // Check piece group intersection
      const pieceObjects: THREE.Object3D[] = [];
      this.pieceMap.forEach((piece) => {
        if (piece.isVisible && piece.group.visible) {
          pieceObjects.push(piece.group);
        }
      });

      const pieceIntersects = this.raycaster.intersectObjects(pieceObjects, true);
      if (pieceIntersects.length > 0) {
        let curr: THREE.Object3D | null = pieceIntersects[0].object;
        while (curr && !curr.userData.pieceId && curr.parent) {
          curr = curr.parent;
        }
        if (curr && curr.userData.pieceId) {
          const piece = this.pieceMap.get(curr.userData.pieceId);
          if (piece && piece.currentCell !== null && this.onInteractCallback) {
            this.onInteractCallback(piece.currentCell, piece.id);
          }
        }
      }
    };

    el.addEventListener('pointerdown', (e) => {
      handlePointerDown(e.clientX, e.clientY);
    });

    window.addEventListener('resize', this.onResize);
  }

  public onResize = () => {
    if (this.isDestroyed || !this.container) return;
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera.aspect = aspect;
    this.setCameraPosition(aspect);
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  public onInteraction(callback: (cellIndex: number, pieceId?: string) => void) {
    this.onInteractCallback = callback;
  }

  /**
   * Synchronizes 3D pieces with the GameState.
   * If a move is provided, plays smooth animation. Otherwise snaps pieces.
   */
  public syncWithState(state: GameState, move?: Move, onAnimComplete?: () => void) {
    if (move) {
      if (move.type === 'PLACE') {
        const piece = this.pieceMap.get(move.pieceId);
        if (piece) {
          piece.animatePlacement(move.to, onAnimComplete);
        } else if (onAnimComplete) {
          onAnimComplete();
        }
      } else if (move.type === 'MOVE') {
        const piece = this.pieceMap.get(move.pieceId);
        if (piece) {
          piece.animateMove(move.to, onAnimComplete);
        } else if (onAnimComplete) {
          onAnimComplete();
        }
      } else if (move.type === 'CAPTURE') {
        const tiger = this.pieceMap.get(move.pieceId);
        const capturedPieceId =
          move.capturedIndex !== undefined ? state.board[move.capturedIndex] : undefined;

        // Find the captured cow if it's already cleared in state board
        let capturedCow: GamePiece3D | undefined;
        if (capturedPieceId) {
          capturedCow = this.pieceMap.get(capturedPieceId);
        } else if (move.capturedIndex !== undefined) {
          // Search which cow was on that cell
          this.pieceMap.forEach((p) => {
            if (p.type === 'COW' && p.currentCell === move.capturedIndex) {
              capturedCow = p;
            }
          });
        }

        if (tiger) {
          tiger.animateCaptureJump(move.to, () => {
            if (onAnimComplete) onAnimComplete();
          });
        }

        if (capturedCow) {
          if (move.capturedIndex !== undefined) {
            const capPos = getCellPosition(move.capturedIndex);
            this.captureEffects.spawnBurst(capPos);
          }
          capturedCow.animateCapturedDie();
        }
      }
    } else {
      // Instant synchronization (e.g. init, restart, undo)
      const boardOccupants = new Set<string>();

      state.board.forEach((pieceId, cellIdx) => {
        if (pieceId) {
          boardOccupants.add(pieceId);
          const piece = this.pieceMap.get(pieceId);
          if (piece) {
            piece.setCellInstant(cellIdx);
          }
        }
      });

      // Hide all unplaced or captured pieces
      this.pieceMap.forEach((piece, id) => {
        if (!boardOccupants.has(id)) {
          piece.setCellInstant(null);
        }
      });

      if (onAnimComplete) onAnimComplete();
    }
  }

  public setSelectedPiece(pieceId: string | null, cellIndex: number | null) {
    this.pieceMap.forEach((piece) => {
      piece.isSelected = piece.id === pieceId;
    });
    this.indicators.setSelection(cellIndex);
  }

  public setLegalMoves(moves: Move[]) {
    this.indicators.setLegalMoves(moves);
  }

  public setWinner(winner: Side | null) {
    this.pieceMap.forEach((piece) => {
      piece.isVictory = piece.type === winner;
    });
  }

  public setDebugCoordinates(show: boolean) {
    this.board3D.updateDebugCoordinates(show);
  }

  public resetCamera() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    this.setCameraPosition(width / height);
  }

  private startLoop() {
    const animate = (time: number) => {
      if (this.isDestroyed) return;
      const delta = Math.min(0.1, (time - this.lastTime) / 1000);
      this.lastTime = time;

      // Update pieces animations
      this.pieceMap.forEach((piece) => {
        piece.update(delta);
      });

      // Update visual indicators
      this.indicators.update(delta);

      // Update particle effects
      this.captureEffects.update(delta);

      this.renderer.render(this.scene, this.camera);
      this.reqId = requestAnimationFrame(animate);
    };

    this.reqId = requestAnimationFrame(animate);
  }

  public destroy() {
    this.isDestroyed = true;
    if (this.reqId) cancelAnimationFrame(this.reqId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
  }
}
