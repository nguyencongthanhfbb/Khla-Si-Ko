/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { getCellPosition } from './Board3D';
import { Move } from '../game/types';

export class Indicators3D {
  public group: THREE.Group;
  private selectionRing: THREE.Mesh;
  private legalIndicators: THREE.Group[] = [];
  private animTime: number = 0;

  constructor() {
    this.group = new THREE.Group();

    // 1. Selection Ring (Soft warm golden amber halo around selected piece)
    const ringGeo = new THREE.TorusGeometry(0.48, 0.032, 12, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xe6c55c, // Warm restrained gold
      transparent: true,
      opacity: 0.9,
    });
    this.selectionRing = new THREE.Mesh(ringGeo, ringMat);
    this.selectionRing.visible = false;
    this.selectionRing.position.y = 0.22;
    this.group.add(this.selectionRing);
  }

  public setSelection(cellIndex: number | null) {
    if (cellIndex === null) {
      this.selectionRing.visible = false;
    } else {
      const pos = getCellPosition(cellIndex);
      this.selectionRing.position.set(pos.x, 0.22, pos.z);
      this.selectionRing.visible = true;
    }
  }

  public setLegalMoves(moves: Move[]) {
    // Clear previous indicators
    this.legalIndicators.forEach((ind) => {
      this.group.remove(ind);
    });
    this.legalIndicators = [];

    // Add indicator for each legal destination
    moves.forEach((move) => {
      const pos = getCellPosition(move.to);
      const isCapture = move.type === 'CAPTURE';
      const indGroup = new THREE.Group();
      indGroup.position.set(pos.x, 0.22, pos.z);

      if (isCapture) {
        // Capture jump indicator: Terracotta / lotus rose playful ring + center wooden star
        const ringGeo = new THREE.TorusGeometry(0.46, 0.038, 12, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xd9577e, // Warm lotus rose
          transparent: true,
          opacity: 0.92,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        indGroup.add(ringMesh);

        // Center wooden diamond
        const diamondGeo = new THREE.OctahedronGeometry(0.1);
        const diamondMat = new THREE.MeshBasicMaterial({
          color: 0xd4af37, // Gold accent
        });
        const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
        diamondMesh.position.y = 0.1;
        indGroup.add(diamondMesh);

        indGroup.userData = { isCapture: true, ringMesh, diamondMesh };
      } else {
        // Normal move / placement indicator: Soft leaf green / warm teak amber ring
        const ringGeo = new THREE.TorusGeometry(0.42, 0.028, 12, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringColor = move.type === 'PLACE' ? 0x62b570 : 0xb58252; // Soft leaf green for place, warm teak amber for move
        const ringMat = new THREE.MeshBasicMaterial({
          color: ringColor,
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        indGroup.add(ringMesh);

        // Central soft dot
        const dotGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
        const dotMat = new THREE.MeshBasicMaterial({
          color: ringColor,
          transparent: true,
          opacity: 0.7,
        });
        const dotMesh = new THREE.Mesh(dotGeo, dotMat);
        dotMesh.position.y = 0.01;
        indGroup.add(dotMesh);

        indGroup.userData = { isCapture: false, ringMesh, dotMesh };
      }

      this.legalIndicators.push(indGroup);
      this.group.add(indGroup);
    });
  }

  public update(delta: number) {
    this.animTime += delta * 3.2;

    // Pulse selection ring
    if (this.selectionRing.visible) {
      const scale = 1 + Math.sin(this.animTime) * 0.06;
      this.selectionRing.scale.set(scale, 1, scale);
      this.selectionRing.rotation.y += delta * 0.6;
    }

    // Animate legal indicators
    this.legalIndicators.forEach((ind) => {
      const isCap = ind.userData?.isCapture;
      const pulse = Math.sin(this.animTime * (isCap ? 1.3 : 0.9));
      const scale = 1 + pulse * (isCap ? 0.1 : 0.05);
      ind.scale.set(scale, 1, scale);

      if (isCap && ind.userData.diamondMesh) {
        ind.userData.diamondMesh.rotation.y += delta * 2.0;
        ind.userData.diamondMesh.position.y = 0.1 + Math.abs(pulse) * 0.05;
      }
    });
  }
}
