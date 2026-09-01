/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Tiger3D } from './Tiger3D';
import { Cow3D } from './Cow3D';
import { getCellPosition, BOARD_BASE_Y } from './Board3D';
import { PieceType } from '../game/types';

export type PieceAnimState = 'IDLE' | 'PLACING' | 'MOVING' | 'CAPTURING' | 'CAPTURED_DYING';

export class GamePiece3D {
  public id: string;
  public type: PieceType;
  public group: THREE.Group;
  public tigerModel?: Tiger3D;
  public cowModel?: Cow3D;

  public currentCell: number | null = null;
  public targetPos: THREE.Vector3 = new THREE.Vector3();
  public startPos: THREE.Vector3 = new THREE.Vector3();

  public animState: PieceAnimState = 'IDLE';
  public animProgress: number = 1;
  public animDuration: number = 0.35;
  public isSelected: boolean = false;
  public isVictory: boolean = false;
  public isDefeated: boolean = false;
  public isVisible: boolean = true;

  public onAnimComplete?: () => void;

  constructor(id: string, type: PieceType) {
    this.id = id;
    this.type = type;
    this.group = new THREE.Group();

    if (type === 'TIGER') {
      this.tigerModel = new Tiger3D();
      this.group.add(this.tigerModel.group);
    } else {
      this.cowModel = new Cow3D();
      this.group.add(this.cowModel.group);
    }

    this.group.userData = { pieceId: id, type };
  }

  public setCellInstant(cellIndex: number | null) {
    this.currentCell = cellIndex;
    if (cellIndex !== null) {
      const pos = getCellPosition(cellIndex);
      this.group.position.copy(pos);
      this.targetPos.copy(pos);
      this.startPos.copy(pos);
      this.group.visible = true;
      this.isVisible = true;
      this.group.scale.set(1, 1, 1);
    } else {
      this.group.visible = false;
      this.isVisible = false;
    }
    this.animState = 'IDLE';
    this.animProgress = 1;
  }

  public animatePlacement(toCell: number, onComplete?: () => void) {
    this.currentCell = toCell;
    const dest = getCellPosition(toCell);
    this.targetPos.copy(dest);

    // Start slightly outside & above the board
    this.startPos.set(dest.x * 1.5, BOARD_BASE_Y + 2.5, dest.z * 1.5);
    this.group.position.copy(this.startPos);

    this.animState = 'PLACING';
    this.animProgress = 0;
    this.animDuration = 0.42;
    this.group.visible = true;
    this.isVisible = true;
    this.group.scale.set(0.6, 0.6, 0.6);
    this.onAnimComplete = onComplete;
  }

  public animateMove(toCell: number, onComplete?: () => void) {
    this.currentCell = toCell;
    this.startPos.copy(this.group.position);
    this.targetPos.copy(getCellPosition(toCell));

    this.animState = 'MOVING';
    this.animProgress = 0;
    this.animDuration = 0.32;
    this.onAnimComplete = onComplete;
  }

  public animateCaptureJump(toCell: number, onComplete?: () => void) {
    this.currentCell = toCell;
    this.startPos.copy(this.group.position);
    this.targetPos.copy(getCellPosition(toCell));

    this.animState = 'CAPTURING';
    this.animProgress = 0;
    this.animDuration = 0.55;
    this.onAnimComplete = onComplete;
  }

  public animateCapturedDie(onComplete?: () => void) {
    this.animState = 'CAPTURED_DYING';
    this.animProgress = 0;
    this.animDuration = 0.45;
    this.startPos.copy(this.group.position);
    this.onAnimComplete = onComplete;
  }

  public update(delta: number) {
    if (!this.isVisible) return;

    if (this.animState !== 'IDLE') {
      this.animProgress += delta / this.animDuration;
      const t = Math.min(1, this.animProgress);

      if (this.animState === 'PLACING') {
        // Drop in with landing bounce
        // Cubic ease out
        const ease = 1 - Math.pow(1 - t, 3);
        this.group.position.lerpVectors(this.startPos, this.targetPos, ease);
        // Arch height
        const jumpY = Math.sin(t * Math.PI) * 0.8;
        this.group.position.y = this.targetPos.y + (1 - ease) * 2.5 + jumpY;

        const scale = 0.6 + ease * 0.4;
        // Landing squash on final 20%
        if (t > 0.8) {
          const squash = Math.sin((t - 0.8) * 5 * Math.PI) * 0.18;
          this.group.scale.set(1 + squash, 1 - squash, 1 + squash);
        } else {
          this.group.scale.set(scale, scale, scale);
        }
      } else if (this.animState === 'MOVING') {
        // Normal hop move
        const ease = 0.5 - Math.cos(t * Math.PI) * 0.5; // Smooth step
        this.group.position.x = THREE.MathUtils.lerp(this.startPos.x, this.targetPos.x, ease);
        this.group.position.z = THREE.MathUtils.lerp(this.startPos.z, this.targetPos.z, ease);

        // Parabolic jump arc
        const hopY = Math.sin(t * Math.PI) * 0.45;
        this.group.position.y = this.targetPos.y + hopY;

        // Squash & stretch
        const stretch = Math.sin(t * Math.PI) * 0.15;
        this.group.scale.set(1 - stretch, 1 + stretch * 1.5, 1 - stretch);
      } else if (this.animState === 'CAPTURING') {
        // High acrobatic capture jump over middle piece
        const ease = t * t * (3 - 2 * t);
        this.group.position.x = THREE.MathUtils.lerp(this.startPos.x, this.targetPos.x, ease);
        this.group.position.z = THREE.MathUtils.lerp(this.startPos.z, this.targetPos.z, ease);

        // High arc
        const jumpY = Math.sin(t * Math.PI) * 1.1;
        this.group.position.y = this.targetPos.y + jumpY;

        // Rotation flair during apex
        this.group.rotation.x = Math.sin(t * Math.PI) * 0.3;
      } else if (this.animState === 'CAPTURED_DYING') {
        // Surprised pop up, spin, and shrink
        this.group.position.y = this.startPos.y + Math.sin(t * Math.PI) * 0.8;
        this.group.rotation.y += delta * 12;
        const shrink = Math.max(0.001, 1 - t);
        this.group.scale.set(shrink, shrink, shrink);
      }

      if (t >= 1) {
        if (this.animState === 'CAPTURED_DYING') {
          this.isVisible = false;
          this.group.visible = false;
        } else {
          this.group.position.copy(this.targetPos);
          this.group.scale.set(1, 1, 1);
          this.group.rotation.set(0, 0, 0);
        }

        const cb = this.onAnimComplete;
        this.animState = 'IDLE';
        this.onAnimComplete = undefined;
        if (cb) cb();
      }
    }

    // Update child model idle/victory animations
    if (this.tigerModel) {
      this.tigerModel.update(delta, this.isSelected, this.isVictory);
    }
    if (this.cowModel) {
      this.cowModel.update(delta, this.isSelected, this.isVictory);
    }
  }
}
