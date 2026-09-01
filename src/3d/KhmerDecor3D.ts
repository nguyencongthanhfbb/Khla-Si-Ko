/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

const PALETTE = {
  woodDark: 0x422415,
  woodMedium: 0x663c22,
  woodTeak: 0x8a532f,
  woodLight: 0xb58252,
  woodCream: 0xf5ebd9,
  khmerGold: 0xd4af37,
  lotusRose: 0xd9577e,
  terracotta: 0xb8502d,
};

function mat(colorHex: number, roughness = 0.65, metalness = 0.04) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness,
    metalness,
    flatShading: true,
  });
}

/**
 * Handcrafted Kbach Leaf Motif carved from teak wood.
 * Uses organic rhythmic curves, flowing symmetry, and a central gold accent bead.
 */
export class KbachCarvedMotif3D extends THREE.Group {
  constructor(scale = 1.0) {
    super();
    this.name = 'Kbach_Carved_Motif';

    const woodMat = mat(PALETTE.woodTeak, 0.6);
    const goldMat = mat(PALETTE.khmerGold, 0.35, 0.7);

    // Central curved flame/leaf relief
    const leafGeo = new THREE.ConeGeometry(0.12, 0.45, 5);
    const leafMesh = new THREE.Mesh(leafGeo, woodMat);
    leafMesh.position.y = 0.22;
    leafMesh.rotation.x = -Math.PI / 2;
    this.add(leafMesh);

    // Symmetrical flanking carved scroll curls
    [-0.14, 0.14].forEach((x) => {
      const curl = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.03, 6, 8, Math.PI * 1.2), woodMat);
      curl.position.set(x, 0.04, 0.12);
      curl.rotation.x = Math.PI / 2;
      curl.rotation.z = x > 0 ? 0.3 : -0.3;
      this.add(curl);
    });

    // Restrained gold center bead
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), goldMat);
    bead.position.set(0, 0.06, 0.08);
    this.add(bead);

    this.scale.set(scale, scale, scale);
  }
}

/**
 * Handcrafted Khmer Wooden Board Corner Ornament.
 * Features carved Kbach corner relief with subtle lotus curve.
 */
export class KhmerBoardCorner3D extends THREE.Group {
  constructor(scale = 1.0) {
    super();
    this.name = 'Khmer_Board_Corner';

    const woodDarkMat = mat(PALETTE.woodDark, 0.65);
    const woodTeakMat = mat(PALETTE.woodTeak, 0.6);
    const goldMat = mat(PALETTE.khmerGold, 0.35, 0.65);

    // Corner L-bracket wooden trim
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.16), woodDarkMat);
    arm1.position.set(-0.16, 0.04, 0.1);
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.55), woodDarkMat);
    arm2.position.set(0.1, 0.04, -0.16);
    this.add(arm1, arm2);

    // Carved diagonal Kbach leaf scroll
    const scroll = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.42, 5), woodTeakMat);
    scroll.position.set(-0.06, 0.09, -0.06);
    scroll.rotation.y = Math.PI / 4;
    scroll.rotation.x = -Math.PI / 2.2;
    this.add(scroll);

    // Corner gold accent bead
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), goldMat);
    bead.position.set(0.04, 0.1, 0.04);
    this.add(bead);

    this.scale.set(scale, scale, scale);
  }
}

/**
 * Continuous Kbach relief strip for the board frame.
 */
export class KbachBorderStrip3D extends THREE.Group {
  constructor(length = 4.0) {
    super();
    this.name = 'Kbach_Border_Strip';

    const woodMat = mat(PALETTE.woodTeak, 0.6);
    const goldMat = mat(PALETTE.khmerGold, 0.35, 0.65);

    const step = 0.55;
    const count = Math.floor(length / step);
    const startX = -((count - 1) * step) / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * step;

      // Small alternating carved diamond relief
      const diamond = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.14, 4), woodMat);
      diamond.position.set(x, 0.04, 0);
      diamond.rotation.y = Math.PI / 4;
      diamond.rotation.x = Math.PI / 2;
      this.add(diamond);

      // Gold center bead
      if (i % 2 === 0) {
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.028, 6, 6), goldMat);
        bead.position.set(x, 0.06, 0);
        this.add(bead);
      }
    }
  }
}
