/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { BOARD_SIZE, TOTAL_CELLS } from '../game/Rules';

export const CELL_SPACING = 1.25;
export const BOARD_BASE_Y = 0.22;

export function getCellPosition(index: number): THREE.Vector3 {
  const row = Math.floor(index / BOARD_SIZE);
  const col = index % BOARD_SIZE;
  // Center is at (0,0)
  const x = (col - (BOARD_SIZE - 1) / 2) * CELL_SPACING;
  const z = (row - (BOARD_SIZE - 1) / 2) * CELL_SPACING;
  return new THREE.Vector3(x, BOARD_BASE_Y, z);
}

export class Board3D {
  public group: THREE.Group;
  public cellMeshes: THREE.Mesh[] = [];
  public coordLabelsGroup: THREE.Group;
  private woodMaterial: THREE.MeshStandardMaterial;
  private cellMaterial: THREE.MeshStandardMaterial;
  private cellAltMaterial: THREE.MeshStandardMaterial;
  private goldAccentMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Materials
    this.woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x5c3826, // Warm teak wood
      roughness: 0.55,
      metalness: 0.1,
    });

    this.cellMaterial = new THREE.MeshStandardMaterial({
      color: 0xe0c39e, // Soft light birch tile
      roughness: 0.6,
      metalness: 0.05,
    });

    this.cellAltMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4b28c, // Alternating subtle warm birch tile
      roughness: 0.6,
      metalness: 0.05,
    });

    this.goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Traditional Khmer antique gold
      roughness: 0.3,
      metalness: 0.7,
    });

    this.buildBoard();
    this.coordLabelsGroup = new THREE.Group();
    this.group.add(this.coordLabelsGroup);
  }

  private buildBoard() {
    // 1. Main Board Table Base (Beveled wooden block)
    const baseWidth = 5.8;
    const baseHeight = 0.45;
    const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseWidth);
    const baseMesh = new THREE.Mesh(baseGeo, this.woodMaterial);
    baseMesh.position.y = 0;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // Outer Decorative Border Rim
    const rimWidth = 6.2;
    const rimHeight = 0.2;
    const rimGeo = new THREE.BoxGeometry(rimWidth, rimHeight, rimWidth);
    const rimMesh = new THREE.Mesh(rimGeo, this.woodMaterial);
    rimMesh.position.y = -0.15;
    rimMesh.receiveShadow = true;
    this.group.add(rimMesh);

    // 2. Gold Border Inlay Frame
    const frameGeo = new THREE.BoxGeometry(5.3, 0.02, 5.3);
    const frameMesh = new THREE.Mesh(frameGeo, this.goldAccentMaterial);
    frameMesh.position.y = 0.23;
    this.group.add(frameMesh);

    // 3. Khmer Corner Motifs (Golden Lotus / Ornamental Reliefs at 4 outer corners)
    const cornerOffset = 2.45;
    const corners = [
      [-cornerOffset, -cornerOffset, 0],
      [cornerOffset, -cornerOffset, Math.PI / 2],
      [cornerOffset, cornerOffset, Math.PI],
      [-cornerOffset, cornerOffset, -Math.PI / 2],
    ];

    corners.forEach(([x, z, rot]) => {
      const motifGroup = new THREE.Group();
      motifGroup.position.set(x, 0.24, z);
      motifGroup.rotation.y = rot;

      // Lotus petal triangle
      const petalGeo = new THREE.ConeGeometry(0.18, 0.28, 4);
      petalGeo.rotateX(Math.PI / 2);
      const petalMesh = new THREE.Mesh(petalGeo, this.goldAccentMaterial);
      petalMesh.scale.set(1.2, 0.3, 1.0);
      motifGroup.add(petalMesh);

      // Gold bead
      const beadGeo = new THREE.SphereGeometry(0.06, 8, 8);
      const beadMesh = new THREE.Mesh(beadGeo, this.goldAccentMaterial);
      beadMesh.position.set(0, 0.02, 0.12);
      motifGroup.add(beadMesh);

      this.group.add(motifGroup);
    });

    // 4. Create 16 individual Cells
    for (let i = 0; i < TOTAL_CELLS; i++) {
      const pos = getCellPosition(i);
      const row = Math.floor(i / BOARD_SIZE);
      const col = i % BOARD_SIZE;
      const isAlt = (row + col) % 2 === 1;

      // Cell tile surface
      const cellGeo = new THREE.BoxGeometry(1.12, 0.04, 1.12);
      const cellMesh = new THREE.Mesh(cellGeo, isAlt ? this.cellAltMaterial : this.cellMaterial);
      cellMesh.position.set(pos.x, 0.23, pos.z);
      cellMesh.receiveShadow = true;
      cellMesh.userData = { cellIndex: i };

      // Inner subtle border line
      const innerLineGeo = new THREE.BoxGeometry(1.14, 0.01, 1.14);
      const innerLineMesh = new THREE.Mesh(
        innerLineGeo,
        new THREE.MeshStandardMaterial({ color: 0xbfa07a, roughness: 0.7 })
      );
      innerLineMesh.position.set(pos.x, 0.22, pos.z);
      this.group.add(innerLineMesh);

      this.cellMeshes[i] = cellMesh;
      this.group.add(cellMesh);
    }
  }

  public updateDebugCoordinates(show: boolean) {
    this.coordLabelsGroup.clear();
    if (!show) return;

    // Create 3D canvas textures with cell index numbers
    for (let i = 0; i < TOTAL_CELLS; i++) {
      const pos = getCellPosition(i);
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(74, 40, 20, 0.85)';
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(i), 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(pos.x, 0.5, pos.z);
      sprite.scale.set(0.45, 0.45, 0.45);
      this.coordLabelsGroup.add(sprite);
    }
  }
}
