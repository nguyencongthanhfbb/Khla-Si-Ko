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

    // 1. Selection Ring (Glowing golden halo around selected piece)
    const ringGeo = new THREE.TorusGeometry(0.5, 0.035, 12, 32);
    ringGeo.rotateX(Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffd32a,
      transparent: true,
      opacity: 0.9,
    });
    this.selectionRing = new THREE.Mesh(ringGeo, ringMat);
    this.selectionRing.visible = false;
    this.selectionRing.position.y = 0.26;
    this.group.add(this.selectionRing);
  }

  public setSelection(cellIndex: number | null) {
    if (cellIndex === null) {
      this.selectionRing.visible = false;
    } else {
      const pos = getCellPosition(cellIndex);
      this.selectionRing.position.set(pos.x, 0.26, pos.z);
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
      indGroup.position.set(pos.x, 0.26, pos.z);

      if (isCapture) {
        // Capture jump indicator: Glowing coral ring + center diamond
        const ringGeo = new THREE.TorusGeometry(0.48, 0.04, 12, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xff4757, // Bright coral red
          transparent: true,
          opacity: 0.95,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        indGroup.add(ringMesh);

        // Center diamond / star
        const diamondGeo = new THREE.OctahedronGeometry(0.12);
        const diamondMat = new THREE.MeshBasicMaterial({
          color: 0xffa502,
        });
        const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
        diamondMesh.position.y = 0.12;
        indGroup.add(diamondMesh);

        indGroup.userData = { isCapture: true, ringMesh, diamondMesh };
      } else {
        // Normal move / placement indicator: Soft emerald green / warm amber ring + soft pulse dot
        const ringGeo = new THREE.TorusGeometry(0.42, 0.03, 12, 32);
        ringGeo.rotateX(Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: move.type === 'PLACE' ? 0x2ed573 : 0x1e90ff, // Emerald green for place, Azure blue for move
          transparent: true,
          opacity: 0.85,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        indGroup.add(ringMesh);

        // Central soft dot
        const dotGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.02, 16);
        const dotMat = new THREE.MeshBasicMaterial({
          color: move.type === 'PLACE' ? 0x2ed573 : 0x1e90ff,
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
    this.animTime += delta * 3.5;

    // Pulse selection ring
    if (this.selectionRing.visible) {
      const scale = 1 + Math.sin(this.animTime) * 0.08;
      this.selectionRing.scale.set(scale, 1, scale);
      this.selectionRing.rotation.y += delta * 0.8;
    }

    // Animate legal indicators
    this.legalIndicators.forEach((ind) => {
      const isCap = ind.userData?.isCapture;
      const pulse = Math.sin(this.animTime * (isCap ? 1.4 : 1.0));
      const scale = 1 + pulse * (isCap ? 0.12 : 0.06);
      ind.scale.set(scale, 1, scale);

      if (isCap && ind.userData.diamondMesh) {
        ind.userData.diamondMesh.rotation.y += delta * 2.5;
        ind.userData.diamondMesh.position.y = 0.12 + Math.abs(pulse) * 0.06;
      }
    });
  }
}
