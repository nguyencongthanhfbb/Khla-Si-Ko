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
import { GameState, Move, PieceType, Side, VisualStyle } from '../game/types';
import { TOTAL_COWS, TOTAL_TIGERS } from '../game/Rules';

export class SceneManager {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private ambientLight!: THREE.AmbientLight;
  private dirLight!: THREE.DirectionalLight;
  private fillLight!: THREE.DirectionalLight;
  private currentStyle: VisualStyle = 'CUBE_PETS';

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

  private cameraTarget: THREE.Vector3 = new THREE.Vector3(0, 0.2, -0.35);
  private defaultCameraPos: THREE.Vector3 = new THREE.Vector3(0, 6.2, 5.0);
  private cameraShake: number = 0;

  constructor(container: HTMLElement) {
    this.container = container;

    // 1. Scene with warm Cambodian terracotta/wood atmosphere
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x271912); // Deep warm amber-brown

    // 2. Camera: 3/4 top-down view (ideal for mobile and desktop)
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const aspect = width / height;

    this.camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 50);
    this.setCameraPosition(aspect);

    // 3. High Performance WebGL Renderer with Soft Shadows
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // 4. Warm Sun & Studio Lighting
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

    // 6. Instantiate 4 Tigers and 12 Cows (with varied patch patterns)
    for (let i = 0; i < TOTAL_TIGERS; i++) {
      const id = `tiger-${i}`;
      const tiger = new GamePiece3D(id, 'TIGER');
      this.pieceMap.set(id, tiger);
      this.scene.add(tiger.group);
    }

    for (let i = 0; i < TOTAL_COWS; i++) {
      const id = `cow-${i}`;
      const cow = new GamePiece3D(id, 'COW', i);
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
    if (aspect < 0.75) {
      // Tall mobile portrait
      this.defaultCameraPos.set(0, 8.4, 6.2);
    } else if (aspect < 1.1) {
      // Tablet / Square
      this.defaultCameraPos.set(0, 7.2, 5.4);
    } else {
      // Desktop
      this.defaultCameraPos.set(0, 6.2, 4.9);
    }
    this.camera.position.copy(this.defaultCameraPos);
    this.camera.lookAt(this.cameraTarget);
  }

  private setupLighting() {
    // Warm ambient light
    this.ambientLight = new THREE.AmbientLight(0xfff6ea, 1.25);
    this.scene.add(this.ambientLight);

    // Main warm sunlight
    this.dirLight = new THREE.DirectionalLight(0xfffaee, 1.65);
    this.dirLight.position.set(5.5, 11, 4.5);
    this.dirLight.castShadow = true;
    this.dirLight.shadow.mapSize.width = 1024;
    this.dirLight.shadow.mapSize.height = 1024;
    this.dirLight.shadow.camera.near = 0.5;
    this.dirLight.shadow.camera.far = 25;
    this.dirLight.shadow.camera.left = -4.6;
    this.dirLight.shadow.camera.right = 4.6;
    this.dirLight.shadow.camera.top = 4.6;
    this.dirLight.shadow.camera.bottom = -4.6;
    this.dirLight.shadow.bias = -0.0005;
    this.scene.add(this.dirLight);

    // Soft sky fill light
    this.fillLight = new THREE.DirectionalLight(0xa5c9ff, 0.42);
    this.fillLight.position.set(-5, 6, -4);
    this.scene.add(this.fillLight);

    // Subtle center warm sparkle point light
    const pointLight = new THREE.PointLight(0xffd32a, 0.55, 8);
    pointLight.position.set(0, 2.5, 0);
    this.scene.add(pointLight);
  }

  public setVisualStyle(style: VisualStyle) {
    this.currentStyle = style;

    if (style === 'CUBE_PETS') {
      this.scene.background = new THREE.Color(0x271912);
      this.ambientLight.color.setHex(0xfff6ea);
      this.ambientLight.intensity = 1.25;
      this.dirLight.color.setHex(0xfffaee);
      this.dirLight.intensity = 1.65;
      this.fillLight.color.setHex(0xa5c9ff);
      this.fillLight.intensity = 0.42;
    } else if (style === 'SOFT_CHIBI') {
      this.scene.background = new THREE.Color(0x241a22);
      this.ambientLight.color.setHex(0xfff0fa);
      this.ambientLight.intensity = 1.4;
      this.dirLight.color.setHex(0xfff5ee);
      this.dirLight.intensity = 1.45;
      this.fillLight.color.setHex(0xc8d8ff);
      this.fillLight.intensity = 0.55;
    } else if (style === 'KHMER_WOODEN') {
      this.scene.background = new THREE.Color(0x1a0f08);
      this.ambientLight.color.setHex(0xffeacc);
      this.ambientLight.intensity = 1.15;
      this.dirLight.color.setHex(0xffe0a8);
      this.dirLight.intensity = 1.75;
      this.fillLight.color.setHex(0x8a7050);
      this.fillLight.intensity = 0.35;
    }

    this.board3D.setVisualStyle(style);
    this.environment.setVisualStyle(style);
    this.pieceMap.forEach((piece) => {
      piece.setVisualStyle(style);
    });
  }

  private setupEventListeners() {
    const el = this.renderer.domElement;

    const handlePointerDown = (clientX: number, clientY: number) => {
      const rect = el.getBoundingClientRect();
      this.pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);

      // Check intersections with cells
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
          const dest = getCellPosition(move.to);
          this.captureEffects.spawnPlacementSparkle(dest);
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

        let capturedCow: GamePiece3D | undefined;
        if (capturedPieceId) {
          capturedCow = this.pieceMap.get(capturedPieceId);
        } else if (move.capturedIndex !== undefined) {
          this.pieceMap.forEach((p) => {
            if (p.type === 'COW' && p.currentCell === move.capturedIndex) {
              capturedCow = p;
            }
          });
        }

        // Camera micro-shake on capture for delightful tactile impact
        this.cameraShake = 0.12;

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
      // Instant synchronization
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

    if (winner) {
      // Spawn victory confetti bursts in 3D scene
      this.captureEffects.spawnVictoryCelebration();
    }
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

      // Update camera shake
      if (this.cameraShake > 0) {
        this.cameraShake -= delta * 0.8;
        const shakeX = (Math.random() - 0.5) * this.cameraShake * 0.4;
        const shakeY = (Math.random() - 0.5) * this.cameraShake * 0.4;
        this.camera.position.set(
          this.defaultCameraPos.x + shakeX,
          this.defaultCameraPos.y + shakeY,
          this.defaultCameraPos.z
        );
      } else {
        this.camera.position.lerp(this.defaultCameraPos, 0.1);
      }
      this.camera.lookAt(this.cameraTarget);

      // Update pieces
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
