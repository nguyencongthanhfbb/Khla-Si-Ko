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
  private gridLineMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.group = new THREE.Group();

    // 1. Warm Handcrafted Materials
    this.woodMaterial = new THREE.MeshStandardMaterial({
      color: 0x5a3520, // Warm rich teak wood
      roughness: 0.52,
      metalness: 0.08,
    });

    this.cellMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5ebd9, // Soft creamy birch tile
      roughness: 0.58,
      metalness: 0.04,
    });

    this.cellAltMaterial = new THREE.MeshStandardMaterial({
      color: 0xebdcbf, // Alternating warm maple birch tile
      roughness: 0.58,
      metalness: 0.04,
    });

    this.goldAccentMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Traditional Khmer antique gold inlay
      roughness: 0.28,
      metalness: 0.72,
    });

    this.gridLineMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a6242, // Warm carved groove line
      roughness: 0.65,
    });

    this.buildBoard();
    this.coordLabelsGroup = new THREE.Group();
    this.group.add(this.coordLabelsGroup);
  }

  private buildBoard() {
    // 1. Main Beveled Wooden Block Base
    const baseWidth = 5.85;
    const baseHeight = 0.46;
    const baseGeo = new THREE.BoxGeometry(baseWidth, baseHeight, baseWidth);
    const baseMesh = new THREE.Mesh(baseGeo, this.woodMaterial);
    baseMesh.position.y = 0;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // Outer Layered Tier Rim
    const rimWidth = 6.25;
    const rimHeight = 0.22;
    const rimGeo = new THREE.BoxGeometry(rimWidth, rimHeight, rimWidth);
    const rimMesh = new THREE.Mesh(rimGeo, this.woodMaterial);
    rimMesh.position.y = -0.16;
    rimMesh.receiveShadow = true;
    this.group.add(rimMesh);

    // 2. Khmer Gold Border Inlay Frame
    const frameGeo = new THREE.BoxGeometry(5.35, 0.025, 5.35);
    const frameMesh = new THREE.Mesh(frameGeo, this.goldAccentMaterial);
    frameMesh.position.y = 0.232;
    this.group.add(frameMesh);

    // 3. Khmer Lotus Relief Motifs at 4 Outer Corners
    const cornerOffset = 2.48;
    const corners = [
      [-cornerOffset, -cornerOffset, 0],
      [cornerOffset, -cornerOffset, Math.PI / 2],
      [cornerOffset, cornerOffset, Math.PI],
      [-cornerOffset, cornerOffset, -Math.PI / 2],
    ];

    corners.forEach(([x, z, rot]) => {
      const motifGroup = new THREE.Group();
      motifGroup.position.set(x, 0.245, z);
      motifGroup.rotation.y = rot;

      // Stylized lotus bud petal
      const petalGeo = new THREE.ConeGeometry(0.18, 0.28, 4);
      petalGeo.rotateX(Math.PI / 2);
      const petalMesh = new THREE.Mesh(petalGeo, this.goldAccentMaterial);
      petalMesh.scale.set(1.2, 0.35, 1.0);
      motifGroup.add(petalMesh);

      // Gold bead finial
      const beadGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const beadMesh = new THREE.Mesh(beadGeo, this.goldAccentMaterial);
      beadMesh.position.set(0, 0.02, 0.12);
      motifGroup.add(beadMesh);

      this.group.add(motifGroup);
    });

    // 4. Carved Orthogonal Grid Lines (Up, Down, Left, Right)
    for (let r = 0; r < BOARD_SIZE; r++) {
      const z = (r - (BOARD_SIZE - 1) / 2) * CELL_SPACING;
      // Horizontal line
      const hLine = new THREE.Mesh(new THREE.BoxGeometry(4.95, 0.015, 0.06), this.gridLineMaterial);
      hLine.position.set(0, 0.225, z);
      this.group.add(hLine);

      const x = (r - (BOARD_SIZE - 1) / 2) * CELL_SPACING;
      // Vertical line
      const vLine = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.015, 4.95), this.gridLineMaterial);
      vLine.position.set(x, 0.225, 0);
      this.group.add(vLine);
    }

    // 5. Create 16 individual Board Cells
    for (let i = 0; i < TOTAL_CELLS; i++) {
      const pos = getCellPosition(i);
      const row = Math.floor(i / BOARD_SIZE);
      const col = i % BOARD_SIZE;
      const isAlt = (row + col) % 2 === 1;

      // Cell tile surface with gentle rounded beveled edge
      const cellGeo = new THREE.BoxGeometry(1.12, 0.045, 1.12);
      const cellMesh = new THREE.Mesh(cellGeo, isAlt ? this.cellAltMaterial : this.cellMaterial);
      cellMesh.position.set(pos.x, 0.235, pos.z);
      cellMesh.receiveShadow = true;
      cellMesh.userData = { cellIndex: i };

      // Inner subtle border line
      const innerLineGeo = new THREE.BoxGeometry(1.15, 0.012, 1.15);
      const innerLineMesh = new THREE.Mesh(innerLineGeo, this.gridLineMaterial);
      innerLineMesh.position.set(pos.x, 0.222, pos.z);
      this.group.add(innerLineMesh);

      this.cellMeshes[i] = cellMesh;
      this.group.add(cellMesh);
    }
  }

  public updateDebugCoordinates(show: boolean) {
    this.coordLabelsGroup.clear();
    if (!show) return;

    for (let i = 0; i < TOTAL_CELLS; i++) {
      const pos = getCellPosition(i);
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = 'rgba(74, 40, 20, 0.88)';
      ctx.beginPath();
      ctx.arc(32, 32, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#ffd32a';
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(i.toString(), 32, 33);

      const texture = new THREE.CanvasTexture(canvas);
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(pos.x, pos.y + 0.35, pos.z);
      sprite.scale.set(0.45, 0.45, 0.45);
      this.coordLabelsGroup.add(sprite);
    }
  }
}
