/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';
import { BoardCoordinate, VisualStyle } from '../game/types';
import { KhmerBoardCorner3D, KbachBorderStrip3D } from './KhmerDecor3D';

export const BOARD_BASE_Y = 0.18;

const PALETTES = {
  CUBE_PETS: {
    woodDark: 0x3d2214, // Handcrafted dark teak base
    woodMedium: 0x613a20, // Carved wooden border
    tileCream: 0xf6ede0, // Inset light wooden tile
    tileCreamAlt: 0xeee3d3, // Subtle alternating tile tone
    roughness: 0.5,
    metalness: 0.02,
  },
  SOFT_CHIBI: {
    woodDark: 0x4a2e22, // Soft warm chestnut base
    woodMedium: 0x7c4d32, // Soft honey wood border
    tileCream: 0xfbf6ee, // Pastel creamy almond tile
    tileCreamAlt: 0xf3ebe0, // Pastel warm biscuit
    roughness: 0.72,
    metalness: 0.01,
  },
  KHMER_WOODEN: {
    woodDark: 0x2e180e, // Deep antique aged rosewood base
    woodMedium: 0x542b16, // Burnished teak border
    tileCream: 0xfaeedd, // Antique warm ivory tile
    tileCreamAlt: 0xefdec6, // Aged rattan tone
    roughness: 0.38,
    metalness: 0.06,
  },
};

const GRID_OFFSET = 1.5; // (4 - 1) / 2
const TILE_SIZE = 1.0;

/**
 * Global helper to compute 3D world position for a board cell index or coordinate.
 */
export function getCellPosition(
  cellIndexOrCoord: number | BoardCoordinate | { row: number; col: number },
  colOverride?: number
): THREE.Vector3 {
  let row = 0;
  let col = 0;

  if (typeof cellIndexOrCoord === 'number') {
    if (typeof colOverride === 'number') {
      row = cellIndexOrCoord;
      col = colOverride;
    } else {
      row = Math.floor(cellIndexOrCoord / 4);
      col = cellIndexOrCoord % 4;
    }
  } else {
    row = cellIndexOrCoord.row;
    col = cellIndexOrCoord.col;
  }

  const x = (col - GRID_OFFSET) * TILE_SIZE;
  const z = (row - GRID_OFFSET) * TILE_SIZE;
  return new THREE.Vector3(x, BOARD_BASE_Y, z);
}

export class Board3D {
  public group: THREE.Group;
  public cellMeshes: THREE.Mesh[] = [];
  private cellMeshMap: Map<string, THREE.Mesh> = new Map();
  private debugMarkersGroup: THREE.Group = new THREE.Group();
  private gridOffset: number = GRID_OFFSET;
  private tileSize: number = TILE_SIZE;
  private tileGap: number = 0.08;

  private baseMat!: THREE.MeshStandardMaterial;
  private frameMat!: THREE.MeshStandardMaterial;
  private tileMats: THREE.MeshStandardMaterial[] = [];
  private currentStyle: VisualStyle = 'CUBE_PETS';

  constructor() {
    this.group = new THREE.Group();
    this.group.name = 'Khmer_Handcrafted_Board';
    this.buildBoard();
    this.buildDebugCoordinates();
  }

  private buildBoard() {
    const palette = PALETTES[this.currentStyle];

    // 1. Lower Solid Wooden Foundation Tier (Handcrafted dark teak)
    const baseGeo = new THREE.BoxGeometry(5.4, 0.32, 5.4);
    this.baseMat = new THREE.MeshStandardMaterial({
      color: palette.woodDark,
      roughness: palette.roughness + 0.2,
      metalness: palette.metalness,
      flatShading: true,
    });
    const baseMesh = new THREE.Mesh(baseGeo, this.baseMat);
    baseMesh.position.y = -0.16;
    baseMesh.receiveShadow = true;
    this.group.add(baseMesh);

    // 2. Upper Beveled Wooden Frame Tier
    const frameGeo = new THREE.BoxGeometry(4.8, 0.16, 4.8);
    this.frameMat = new THREE.MeshStandardMaterial({
      color: palette.woodMedium,
      roughness: palette.roughness + 0.1,
      metalness: palette.metalness,
      flatShading: true,
    });
    const frameMesh = new THREE.Mesh(frameGeo, this.frameMat);
    frameMesh.position.y = 0.06;
    frameMesh.receiveShadow = true;
    this.group.add(frameMesh);

    // 3. Carved Kbach Relief Border Strips along 4 edges
    const borderOffset = 2.22;
    const borderY = 0.14;

    // North & South Kbach strips
    const stripN = new KbachBorderStrip3D(3.6);
    stripN.position.set(0, borderY, -borderOffset);
    const stripS = new KbachBorderStrip3D(3.6);
    stripS.position.set(0, borderY, borderOffset);
    stripS.rotation.y = Math.PI;

    // East & West Kbach strips
    const stripE = new KbachBorderStrip3D(3.6);
    stripE.position.set(borderOffset, borderY, 0);
    stripE.rotation.y = -Math.PI / 2;
    const stripW = new KbachBorderStrip3D(3.6);
    stripW.position.set(-borderOffset, borderY, 0);
    stripW.rotation.y = Math.PI / 2;

    this.group.add(stripN, stripS, stripE, stripW);

    // 4. Four Matching Khmer Carved Corner Ornaments
    const cornerOffset = 2.18;
    const cornerY = 0.14;

    const corners = [
      { x: -cornerOffset, z: -cornerOffset, rot: 0 },
      { x: cornerOffset, z: -cornerOffset, rot: -Math.PI / 2 },
      { x: cornerOffset, z: cornerOffset, rot: Math.PI },
      { x: -cornerOffset, z: cornerOffset, rot: Math.PI / 2 },
    ];

    corners.forEach((c) => {
      const cornerMesh = new KhmerBoardCorner3D(1.0);
      cornerMesh.position.set(c.x, cornerY, c.z);
      cornerMesh.rotation.y = c.rot;
      this.group.add(cornerMesh);
    });

    // 5. 4x4 Inset Wooden Playing Tiles (Warm cream / natural light wood)
    const effectiveTileWidth = this.tileSize - this.tileGap;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cellIndex = r * 4 + c;
        const x = (c - this.gridOffset) * this.tileSize;
        const z = (r - this.gridOffset) * this.tileSize;

        const isAlt = (r + c) % 2 === 1;
        const tileMat = new THREE.MeshStandardMaterial({
          color: isAlt ? palette.tileCreamAlt : palette.tileCream,
          roughness: palette.roughness,
          metalness: palette.metalness,
          flatShading: true,
        });
        this.tileMats.push(tileMat);

        const tileGeo = new THREE.BoxGeometry(effectiveTileWidth, 0.06, effectiveTileWidth);
        const tileMesh = new THREE.Mesh(tileGeo, tileMat);
        tileMesh.position.set(x, 0.16, z);
        tileMesh.receiveShadow = true;
        tileMesh.userData = { cellIndex, row: r, col: c, coord: `${r},${c}` };

        this.group.add(tileMesh);
        this.cellMeshes.push(tileMesh);
        this.cellMeshMap.set(`${r},${c}`, tileMesh);
      }
    }

    // 6. Subtle Inset Wooden Grid Groove Borders
    const grooveMat = new THREE.MeshStandardMaterial({
      color: palette.woodDark,
      roughness: 0.8,
    });

    for (let i = 0; i <= 4; i++) {
      const pos = (i - 2) * this.tileSize;
      // Horizontal groove
      const hGroove = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.02, 0.03), grooveMat);
      hGroove.position.set(0, 0.17, pos);
      // Vertical groove
      const vGroove = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 4.0), grooveMat);
      vGroove.position.set(pos, 0.17, 0);

      this.group.add(hGroove, vGroove);
    }
  }

  public setVisualStyle(style: VisualStyle) {
    this.currentStyle = style;
    const palette = PALETTES[style];

    if (this.baseMat) {
      this.baseMat.color.setHex(palette.woodDark);
      this.baseMat.roughness = palette.roughness + 0.2;
      this.baseMat.metalness = palette.metalness;
      this.baseMat.needsUpdate = true;
    }

    if (this.frameMat) {
      this.frameMat.color.setHex(palette.woodMedium);
      this.frameMat.roughness = palette.roughness + 0.1;
      this.frameMat.metalness = palette.metalness;
      this.frameMat.needsUpdate = true;
    }

    this.tileMats.forEach((mat, idx) => {
      const r = Math.floor(idx / 4);
      const c = idx % 4;
      const isAlt = (r + c) % 2 === 1;
      mat.color.setHex(isAlt ? palette.tileCreamAlt : palette.tileCream);
      mat.roughness = palette.roughness;
      mat.metalness = palette.metalness;
      mat.needsUpdate = true;
    });
  }

  private buildDebugCoordinates() {
    this.debugMarkersGroup.visible = false;
    this.group.add(this.debugMarkersGroup);

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const cellIndex = r * 4 + c;
        const pos = getCellPosition(cellIndex);

        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = 'rgba(40, 20, 10, 0.85)';
          ctx.beginPath();
          ctx.arc(64, 64, 52, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#d4af37';
          ctx.lineWidth = 4;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 36px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(`${cellIndex}`, 64, 48);

          ctx.fillStyle = '#f5ebd9';
          ctx.font = '22px sans-serif';
          ctx.fillText(`(${r},${c})`, 64, 86);
        }

        const texture = new THREE.CanvasTexture(canvas);
        const spriteMat = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
          opacity: 0.9,
          depthTest: false,
        });
        const sprite = new THREE.Sprite(spriteMat);
        sprite.position.set(pos.x, pos.y + 0.25, pos.z);
        sprite.scale.set(0.45, 0.45, 0.45);

        this.debugMarkersGroup.add(sprite);
      }
    }
  }

  public updateDebugCoordinates(show: boolean) {
    this.debugMarkersGroup.visible = show;
  }

  public getCellWorldPosition(row: number, col: number): THREE.Vector3 {
    return getCellPosition({ row, col });
  }

  public getCellMesh(coord: BoardCoordinate | number): THREE.Mesh | undefined {
    if (typeof coord === 'number') {
      const r = Math.floor(coord / 4);
      const c = coord % 4;
      return this.cellMeshMap.get(`${r},${c}`);
    }
    return this.cellMeshMap.get(`${coord.row},${coord.col}`);
  }
}
