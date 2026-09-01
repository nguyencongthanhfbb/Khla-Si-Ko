/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { Tiger3D } from './Tiger3D';
import { Cow3D } from './Cow3D';
import { getCellPosition, BOARD_BASE_Y } from './Board3D';
import { PieceType, VisualStyle } from '../game/types';

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

  constructor(id: string, type: PieceType, variationIndex: number = 0) {
    this.id = id;
    this.type = type;
    this.group = new THREE.Group();

    if (type === 'TIGER') {
      this.tigerModel = new Tiger3D();
      this.group.add(this.tigerModel.group);
    } else {
      this.cowModel = new Cow3D(variationIndex);
      this.group.add(this.cowModel.group);
    }

    this.group.userData = { pieceId: id, type };
  }

  public setVisualStyle(style: VisualStyle) {
    this.tigerModel?.setVisualStyle(style);
    this.cowModel?.setVisualStyle(style);
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
      this.tigerModel?.setExpression('idle');
      this.cowModel?.setExpression('idle');
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

    // Start off-board at the wooden reserve tray
    const offX = dest.x >= 0 ? 3.8 : -3.8;
    const offZ = dest.z >= 0 ? 3.2 : -3.2;
    this.startPos.set(offX, BOARD_BASE_Y + 1.8, offZ);
    this.group.position.copy(this.startPos);

    this.animState = 'PLACING';
    this.animProgress = 0;
    this.animDuration = 0.38;
    this.group.visible = true;
    this.isVisible = true;
    this.group.scale.set(0.6, 0.6, 0.6);
    this.cowModel?.setExpression('placed');
    this.onAnimComplete = onComplete;
  }

  public animateMove(toCell: number, onComplete?: () => void) {
    this.currentCell = toCell;
    this.startPos.copy(this.group.position);
    this.targetPos.copy(getCellPosition(toCell));

    this.animState = 'MOVING';
    this.animProgress = 0;
    this.animDuration = 0.28; // Responsive and brisk (target 0.25-0.35s)
    this.tigerModel?.setExpression('moving');
    this.cowModel?.setExpression('moving' as any);
    this.onAnimComplete = onComplete;
  }

  public animateCaptureJump(toCell: number, onComplete?: () => void) {
    this.currentCell = toCell;
    this.startPos.copy(this.group.position);
    this.targetPos.copy(getCellPosition(toCell));

    this.animState = 'CAPTURING';
    this.animProgress = 0;
    this.animDuration = 0.48;
    this.tigerModel?.setExpression('capturing');
    this.onAnimComplete = onComplete;
  }

  public animateCapturedDie(onComplete?: () => void) {
    this.animState = 'CAPTURED_DYING';
    this.animProgress = 0;
    this.animDuration = 0.42;
    this.startPos.copy(this.group.position);
    this.cowModel?.setExpression('surprised');
    this.onAnimComplete = onComplete;
  }

  public update(delta: number) {
    if (!this.isVisible) return;

    if (this.animState !== 'IDLE') {
      this.animProgress += delta / this.animDuration;
      const t = Math.min(1, this.animProgress);

      if (this.animState === 'PLACING') {
        // Drop in with landing bounce
        const ease = 1 - Math.pow(1 - t, 3);
        this.group.position.lerpVectors(this.startPos, this.targetPos, ease);
        // Parabolic arc
        const hopY = Math.sin(t * Math.PI) * 0.9;
        this.group.position.y = this.targetPos.y + (1 - ease) * 1.8 + hopY;

        // Squash & stretch on landing
        if (t > 0.75) {
          const bounce = Math.sin((t - 0.75) * 4 * Math.PI) * 0.16;
          this.group.scale.set(1 + bounce, 1 - bounce, 1 + bounce);
        } else {
          const s = 0.6 + ease * 0.4;
          this.group.scale.set(s, s, s);
        }
      } else if (this.animState === 'MOVING') {
        // Smooth hop move
        const ease = 0.5 - Math.cos(t * Math.PI) * 0.5;
        this.group.position.x = THREE.MathUtils.lerp(this.startPos.x, this.targetPos.x, ease);
        this.group.position.z = THREE.MathUtils.lerp(this.startPos.z, this.targetPos.z, ease);

        // Parabolic hop
        const hopY = Math.sin(t * Math.PI) * 0.55;
        this.group.position.y = this.targetPos.y + hopY;

        // Squash & stretch
        const stretch = Math.sin(t * Math.PI) * 0.18;
        this.group.scale.set(1 - stretch * 0.8, 1 + stretch * 1.4, 1 - stretch * 0.8);
      } else if (this.animState === 'CAPTURING') {
        // High acrobatic capture jump over the middle cow
        const ease = t * t * (3 - 2 * t);
        this.group.position.x = THREE.MathUtils.lerp(this.startPos.x, this.targetPos.x, ease);
        this.group.position.z = THREE.MathUtils.lerp(this.startPos.z, this.targetPos.z, ease);

        // High apex jump (1.4 units high)
        const hopY = Math.sin(t * Math.PI) * 1.35;
        this.group.position.y = this.targetPos.y + hopY;

        // Acrobatic pitch tilt
        this.group.rotation.x = Math.sin(t * Math.PI * 2) * 0.3;

        // Stretch at apex, squash on landing
        if (t > 0.8) {
          const squash = Math.sin((t - 0.8) * 5 * Math.PI) * 0.22;
          this.group.scale.set(1 + squash, 1 - squash * 1.2, 1 + squash);
        } else {
          const stretch = Math.sin(t * Math.PI) * 0.2;
          this.group.scale.set(1 - stretch, 1 + stretch, 1 - stretch);
        }
      } else if (this.animState === 'CAPTURED_DYING') {
        // Comical cartoon surprise pop & cheerful fade/run off
        const spin = t * Math.PI * 2;
        this.group.rotation.y = spin;

        // Pop up and shrink
        const popY = Math.sin(t * Math.PI) * 0.8;
        this.group.position.y = this.startPos.y + popY;

        const scale = Math.max(0.001, 1 - Math.pow(t, 2));
        this.group.scale.set(scale, scale, scale);
      }

      if (t >= 1) {
        this.animState = 'IDLE';
        this.group.position.copy(this.targetPos);
        this.group.rotation.set(0, 0, 0);

        if (this.animState as any === 'CAPTURED_DYING' || this.group.scale.x < 0.1) {
          this.group.visible = false;
          this.isVisible = false;
        } else {
          this.group.scale.set(1, 1, 1);
        }

        this.tigerModel?.setExpression('idle');
        this.cowModel?.setExpression('idle');

        if (this.onAnimComplete) {
          const cb = this.onAnimComplete;
          this.onAnimComplete = undefined;
          cb();
        }
      }
    }

    // Pass delta to models for idle/expression updates
    this.tigerModel?.update(delta, this.isSelected, this.isVictory);
    this.cowModel?.update(delta, this.isSelected, this.isVictory);
  }
}
