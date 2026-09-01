/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

export const PALETTE = {
  woodDark: 0x3d2214, // Handcrafted dark teak & rosewood base
  woodMedium: 0x613a20, // Carved wooden border
  woodTeak: 0x7c4524, // Warm carved teak relief
  woodLight: 0xb58252, // Wooden stilts & railings
  woodBamboo: 0xd8c29d, // Bamboo texture
  woodCream: 0xf5ebd9, // Inset tile cream
  terracotta: 0xb8502d, // Cambodian clay roof tile & water pots
  terracottaDark: 0x8c361a,
  khmerGold: 0xd4af37, // Subtle restrained gold accent
  lotusPink: 0xe6739f, // Subtle lotus blossom accent
};

function createMat(colorHex: number, roughness = 0.7, metalness = 0.03) {
  return new THREE.MeshStandardMaterial({
    color: colorHex,
    roughness,
    metalness,
    flatShading: true,
  });
}

/**
 * Authentic Handcrafted Kbach Leaf / Petal Relief (Kbach Phni Tes / Phni Phka).
 * Symmetrical carved wooden leaf with gentle curving tip and organic relief bevels.
 */
export class KbachLeafRelief3D extends THREE.Group {
  constructor(scale = 1.0) {
    super();
    this.name = 'Kbach_Leaf_Relief';

    const teakMat = createMat(PALETTE.woodTeak, 0.65);
    const darkWoodMat = createMat(PALETTE.woodMedium, 0.7);

    // Carved center flame petal
    const centerShape = new THREE.Shape();
    centerShape.moveTo(0, -0.16);
    centerShape.quadraticCurveTo(0.12, 0, 0.06, 0.22);
    centerShape.quadraticCurveTo(0, 0.16, -0.06, 0.22);
    centerShape.quadraticCurveTo(-0.12, 0, 0, -0.16);

    const extrudeSettings = {
      depth: 0.05,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.02,
      bevelThickness: 0.02,
    };

    const centerGeo = new THREE.ExtrudeGeometry(centerShape, extrudeSettings);
    const centerMesh = new THREE.Mesh(centerGeo, teakMat);
    centerMesh.rotation.x = Math.PI / 2;
    centerMesh.position.y = 0.02;
    this.add(centerMesh);

    // Symmetrical carved side scrolls
    [-0.11, 0.11].forEach((x) => {
      const scrollShape = new THREE.Shape();
      scrollShape.moveTo(0, -0.08);
      scrollShape.quadraticCurveTo(x * 0.8, 0.02, x * 0.4, 0.14);
      scrollShape.quadraticCurveTo(0, 0.06, 0, -0.08);

      const scrollGeo = new THREE.ExtrudeGeometry(scrollShape, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelSize: 0.015,
        bevelThickness: 0.015,
      });
      const scrollMesh = new THREE.Mesh(scrollGeo, darkWoodMat);
      scrollMesh.rotation.x = Math.PI / 2;
      scrollMesh.position.set(x, 0.015, 0.02);
      this.add(scrollMesh);
    });

    this.scale.set(scale, scale, scale);
  }
}

/**
 * Continuous Carved Wooden Kbach Frieze Strip along the board borders.
 * Rhythmic repeating carved wooden petals in warm teak wood.
 */
export class KbachBorderStrip3D extends THREE.Group {
  constructor(length = 3.6) {
    super();
    this.name = 'Kbach_Border_Strip';

    const step = 0.44;
    const count = Math.floor(length / step);
    const startX = -((count - 1) * step) / 2;

    for (let i = 0; i < count; i++) {
      const x = startX + i * step;
      const motif = new KbachLeafRelief3D(0.85);
      motif.position.set(x, 0.02, 0);
      this.add(motif);
    }
  }
}

/**
 * Handcrafted Khmer Wooden Board Corner Ornament (Kbach Angkur / Lotus bracket).
 * Carved L-bracket with undulating swan-neck curve and single subtle gold bead.
 */
export class KhmerBoardCorner3D extends THREE.Group {
  constructor(scale = 1.0) {
    super();
    this.name = 'Khmer_Board_Corner';

    const darkWoodMat = createMat(PALETTE.woodDark, 0.7);
    const teakMat = createMat(PALETTE.woodTeak, 0.65);
    const goldMat = createMat(PALETTE.khmerGold, 0.4, 0.6);

    // Corner L-bracket base
    const arm1 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.09, 0.18), darkWoodMat);
    arm1.position.set(-0.16, 0.04, 0.1);
    const arm2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.09, 0.58), darkWoodMat);
    arm2.position.set(0.1, 0.04, -0.16);
    this.add(arm1, arm2);

    // Carved diagonal lotus / Naga scroll bracket
    const scroll = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.12, 0.46, 6), teakMat);
    scroll.position.set(-0.06, 0.08, -0.06);
    scroll.rotation.z = Math.PI / 4;
    scroll.rotation.x = Math.PI / 4;
    this.add(scroll);

    // Single restrained gold bead accent
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 8), goldMat);
    bead.position.set(0.02, 0.09, 0.02);
    this.add(bead);

    this.scale.set(scale, scale, scale);
  }
}

/**
 * Handcrafted Traditional Khmer Rural Stilt House (Phteah Khmer).
 * Features:
 * - Solid wooden stilts with ground foundation
 * - Raised timber floorboards & veranda with railings
 * - Entrance ladder / wooden stairs
 * - Traditional high sloped gable terracotta roof with curved eave crests
 */
export class KhmerStiltHouse3D extends THREE.Group {
  constructor() {
    super();
    this.name = 'Traditional_Khmer_Stilt_House';

    const stiltMat = createMat(PALETTE.woodDark, 0.75);
    const wallMat = createMat(PALETTE.woodTeak, 0.7);
    const floorMat = createMat(PALETTE.woodMedium, 0.75);
    const roofMat = createMat(PALETTE.terracotta, 0.72);
    const roofTrimMat = createMat(PALETTE.terracottaDark, 0.65);
    const railMat = createMat(PALETTE.woodLight, 0.65);
    const jarMat = createMat(PALETTE.terracotta, 0.8);

    // 1. Raised Timber Stilts (6 solid timber pillars)
    const stiltHeight = 1.4;
    const stiltGeo = new THREE.CylinderGeometry(0.065, 0.08, stiltHeight, 8);
    const stiltCoords = [
      { x: -1.2, z: -0.8 },
      { x: 0, z: -0.8 },
      { x: 1.2, z: -0.8 },
      { x: -1.2, z: 0.8 },
      { x: 0, z: 0.8 },
      { x: 1.2, z: 0.8 },
    ];

    stiltCoords.forEach((coord) => {
      const stilt = new THREE.Mesh(stiltGeo, stiltMat);
      stilt.position.set(coord.x, stiltHeight / 2, coord.z);
      stilt.castShadow = true;
      stilt.receiveShadow = true;
      this.add(stilt);
    });

    // 2. Raised Wooden Platform Floor (Main room + Open veranda)
    const floorGeo = new THREE.BoxGeometry(2.9, 0.12, 2.1);
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.set(0, stiltHeight + 0.06, 0);
    floorMesh.castShadow = true;
    floorMesh.receiveShadow = true;
    this.add(floorMesh);

    // 3. Wooden House Walls (Enclosed back & side quarters)
    const wallHeight = 1.2;
    const wallGeo = new THREE.BoxGeometry(2.6, wallHeight, 1.4);
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(0, stiltHeight + 0.12 + wallHeight / 2, -0.25);
    wallMesh.castShadow = true;
    this.add(wallMesh);

    // Doorway opening
    const doorMat = createMat(PALETTE.woodDark, 0.8);
    const doorMesh = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.85, 0.04), doorMat);
    doorMesh.position.set(0.3, stiltHeight + 0.12 + 0.425, 0.46);
    this.add(doorMesh);

    // Window shutters
    const windowMesh = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.04), doorMat);
    windowMesh.position.set(-0.65, stiltHeight + 0.12 + 0.65, 0.46);
    this.add(windowMesh);

    // 4. Veranda Railings (Front porch)
    const railPostGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.45, 6);
    const railPositions = [-1.3, -0.6, 0.8, 1.3];
    railPositions.forEach((rx) => {
      const post = new THREE.Mesh(railPostGeo, railMat);
      post.position.set(rx, stiltHeight + 0.12 + 0.22, 0.95);
      this.add(post);
    });

    const railTopGeo = new THREE.BoxGeometry(2.8, 0.04, 0.04);
    const railTop = new THREE.Mesh(railTopGeo, railMat);
    railTop.position.set(0, stiltHeight + 0.12 + 0.42, 0.95);
    this.add(railTop);

    // 5. Wooden Entrance Ladder / Stairs to Porch
    const stairGroup = new THREE.Group();
    const stairBeamGeo = new THREE.BoxGeometry(0.05, 1.6, 0.05);
    const beamL = new THREE.Mesh(stairBeamGeo, railMat);
    beamL.position.set(-0.2, 0.7, 0);
    beamL.rotation.x = -0.38;
    const beamR = new THREE.Mesh(stairBeamGeo, railMat);
    beamR.position.set(0.2, 0.7, 0);
    beamR.rotation.x = -0.38;
    stairGroup.add(beamL, beamR);

    // Steps
    for (let s = 1; s <= 4; s++) {
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.12), floorMat);
      stepMesh.position.set(0, s * 0.28, s * 0.12);
      stairGroup.add(stepMesh);
    }
    stairGroup.position.set(0.3, 0, 0.98);
    this.add(stairGroup);

    // 6. Traditional Sloped Terracotta Gable Roof with Eaves
    const roofY = stiltHeight + 0.12 + wallHeight;
    const roofGroup = new THREE.Group();

    // Main Gable Slope Left & Right
    const roofSlopeGeo = new THREE.BoxGeometry(1.9, 0.1, 2.7);

    const slopeL = new THREE.Mesh(roofSlopeGeo, roofMat);
    slopeL.position.set(-0.75, 0.55, -0.2);
    slopeL.rotation.z = 0.65;
    slopeL.castShadow = true;

    const slopeR = new THREE.Mesh(roofSlopeGeo, roofMat);
    slopeR.position.set(0.75, 0.55, -0.2);
    slopeR.rotation.z = -0.65;
    slopeR.castShadow = true;

    // Roof Ridge Crest & Finials
    const ridgeMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 2.85), roofTrimMat);
    ridgeMesh.position.set(0, 1.15, -0.2);

    // Curved gable finials at both ends of roof ridge
    [-1.6, 1.2].forEach((fz) => {
      const finial = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.35, 5), roofTrimMat);
      finial.position.set(0, 1.35, fz);
      finial.rotation.x = fz > 0 ? 0.4 : -0.4;
      roofGroup.add(finial);
    });

    roofGroup.add(slopeL, slopeR, ridgeMesh);
    roofGroup.position.set(0, roofY, 0);
    this.add(roofGroup);

    // 7. Small Terracotta Water Storage Jar (K'am) at the base of the stairs
    const jarMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 8), jarMat);
    jarMesh.position.set(0.85, 0.24, 1.2);
    jarMesh.scale.set(1, 1.15, 1);
    jarMesh.castShadow = true;
    this.add(jarMesh);
  }
}
