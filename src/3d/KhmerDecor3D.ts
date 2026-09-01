/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * 1. Khmer Corner Ornament (Lotus bud + stylized Naga curve)
 * Handcrafted wooden toy aesthetic with antique gold highlights.
 */
export class KhmerCornerOrnament3D extends THREE.Group {
  constructor(goldMat: THREE.Material, woodMat: THREE.Material) {
    super();

    // Base carved lotus bracket
    const bracketGeo = new THREE.BoxGeometry(0.38, 0.08, 0.38);
    const bracketMesh = new THREE.Mesh(bracketGeo, woodMat);
    bracketMesh.position.y = 0.04;
    this.add(bracketMesh);

    // Stylized Khmer Naga crest / Lotus petal horn
    const petalGeo = new THREE.ConeGeometry(0.16, 0.32, 6);
    petalGeo.rotateX(Math.PI / 2.2);
    const petalMesh = new THREE.Mesh(petalGeo, goldMat);
    petalMesh.position.set(0, 0.08, 0.06);
    petalMesh.scale.set(1.1, 0.45, 1.0);
    this.add(petalMesh);

    // Flanking lotus wings
    [-0.09, 0.09].forEach((x) => {
      const wingGeo = new THREE.ConeGeometry(0.08, 0.22, 5);
      wingGeo.rotateX(Math.PI / 2.5);
      const wingMesh = new THREE.Mesh(wingGeo, goldMat);
      wingMesh.position.set(x, 0.06, 0.02);
      wingMesh.rotation.z = x > 0 ? -0.4 : 0.4;
      wingMesh.scale.set(0.9, 0.4, 0.9);
      this.add(wingMesh);
    });

    // Antique Gold Bead Finial
    const beadGeo = new THREE.SphereGeometry(0.075, 10, 10);
    const beadMesh = new THREE.Mesh(beadGeo, goldMat);
    beadMesh.position.set(0, 0.08, 0.18);
    this.add(beadMesh);
  }
}

/**
 * 2. Khmer Board Border (Traditional geometric carved relief along the rim)
 */
export class KhmerBoardBorder3D extends THREE.Group {
  constructor(goldMat: THREE.Material, woodMat: THREE.Material) {
    super();

    const frameSize = 5.48;
    const borderThickness = 0.09;
    const borderHeight = 0.028;

    // 4 Border strips
    const sides = [
      { x: 0, z: -(frameSize / 2), rotY: 0, length: frameSize },
      { x: 0, z: frameSize / 2, rotY: 0, length: frameSize },
      { x: -(frameSize / 2), z: 0, rotY: Math.PI / 2, length: frameSize },
      { x: frameSize / 2, z: 0, rotY: Math.PI / 2, length: frameSize },
    ];

    sides.forEach((s) => {
      const stripGroup = new THREE.Group();
      stripGroup.position.set(s.x, 0.235, s.z);
      stripGroup.rotation.y = s.rotY;

      // Base gold inlay track
      const baseGeo = new THREE.BoxGeometry(s.length, borderHeight, borderThickness);
      const baseMesh = new THREE.Mesh(baseGeo, goldMat);
      stripGroup.add(baseMesh);

      // Carved repeating diamond/lotus rhythm along the strip
      const diamondCount = 9;
      const step = (s.length - 0.8) / (diamondCount - 1);
      for (let i = 0; i < diamondCount; i++) {
        const dx = -(s.length - 0.8) / 2 + i * step;
        const dGeo = new THREE.OctahedronGeometry(0.045);
        dGeo.scale(1.2, 0.35, 1.0);
        const dMesh = new THREE.Mesh(dGeo, woodMat);
        dMesh.position.set(dx, borderHeight / 2 + 0.005, 0);
        stripGroup.add(dMesh);
      }

      this.add(stripGroup);
    });
  }
}

/**
 * 3. Khmer Naga Motif Finial (Stylized handcrafted 3D wooden Naga element)
 */
export class KhmerNagaMotif3D extends THREE.Group {
  constructor(goldMat: THREE.Material) {
    super();

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0.22, 0.15),
      new THREE.Vector3(0, 0.42, 0.05)
    );
    const nagaGeo = new THREE.TubeGeometry(curve, 12, 0.035, 6, false);
    const nagaMesh = new THREE.Mesh(nagaGeo, goldMat);
    this.add(nagaMesh);

    // Crown crest
    const crestGeo = new THREE.ConeGeometry(0.06, 0.14, 5);
    const crestMesh = new THREE.Mesh(crestGeo, goldMat);
    crestMesh.position.set(0, 0.44, 0.04);
    crestMesh.rotation.x = -0.2;
    this.add(crestMesh);
  }
}

/**
 * 4. Khmer Roof Miniature (Miniature traditional Cambodian wooden pavilion / Sala Chan silhouette)
 * Stylized wooden toy architecture: curved swept gables, terracotta tile roof, raised wooden stilts.
 */
export class KhmerRoofMiniature3D extends THREE.Group {
  constructor() {
    super();

    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d, // Dark teak wood
      roughness: 0.7,
    });
    const terracottaMat = new THREE.MeshStandardMaterial({
      color: 0xba4a29, // Warm Cambodian terracotta tile
      roughness: 0.65,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Antique gold roof ridge finials
      roughness: 0.3,
      metalness: 0.6,
    });

    // 1. Raised Wooden Stilt Platform
    const platformGeo = new THREE.BoxGeometry(1.6, 0.12, 1.3);
    const platformMesh = new THREE.Mesh(platformGeo, woodMat);
    platformMesh.position.y = 0.38;
    platformMesh.castShadow = true;
    this.add(platformMesh);

    // 4 Wooden Pillars
    const pillarPositions = [
      [-0.65, -0.5],
      [0.65, -0.5],
      [-0.65, 0.5],
      [0.65, 0.5],
    ];
    pillarPositions.forEach(([px, pz]) => {
      const pGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.45, 8);
      const pMesh = new THREE.Mesh(pGeo, woodMat);
      pMesh.position.set(px, 0.18, pz);
      pMesh.castShadow = true;
      this.add(pMesh);
    });

    // 2. Main Pavilion Columns supporting roof
    pillarPositions.forEach(([px, pz]) => {
      const colGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.55, 8);
      const colMesh = new THREE.Mesh(colGeo, woodMat);
      colMesh.position.set(px * 0.85, 0.72, pz * 0.85);
      this.add(colMesh);
    });

    // 3. Lower Tier Curved Eaves
    const lowerRoofGeo = new THREE.ConeGeometry(1.3, 0.52, 4);
    lowerRoofGeo.rotateY(Math.PI / 4);
    const lowerRoofMesh = new THREE.Mesh(lowerRoofGeo, terracottaMat);
    lowerRoofMesh.position.set(0, 1.05, 0);
    lowerRoofMesh.scale.set(1.2, 0.4, 1.0);
    lowerRoofMesh.castShadow = true;
    this.add(lowerRoofMesh);

    // 4. Upper Tier Steep Traditional Gable
    const upperRoofGeo = new THREE.ConeGeometry(0.85, 0.65, 4);
    upperRoofGeo.rotateY(Math.PI / 4);
    const upperRoofMesh = new THREE.Mesh(upperRoofGeo, terracottaMat);
    upperRoofMesh.position.set(0, 1.32, 0);
    upperRoofMesh.scale.set(1.15, 0.6, 0.95);
    upperRoofMesh.castShadow = true;
    this.add(upperRoofMesh);

    // 5. Khmer Curved Ridge Finials (Chorfa / Naga roof horn finials at gable peaks)
    [-0.52, 0.52].forEach((x) => {
      const chorfaGroup = new THREE.Group();
      chorfaGroup.position.set(x, 1.48, 0);

      const finialGeo = new THREE.ConeGeometry(0.04, 0.24, 5);
      finialGeo.rotateZ(x > 0 ? -0.5 : 0.5);
      const finialMesh = new THREE.Mesh(finialGeo, goldMat);
      chorfaGroup.add(finialMesh);

      const tipGeo = new THREE.SphereGeometry(0.035, 6, 6);
      const tipMesh = new THREE.Mesh(tipGeo, goldMat);
      tipMesh.position.set(x > 0 ? 0.06 : -0.06, 0.12, 0);
      chorfaGroup.add(tipMesh);

      this.add(chorfaGroup);
    });

    // Center Spire
    const spireGeo = new THREE.CylinderGeometry(0.02, 0.05, 0.28, 6);
    const spireMesh = new THREE.Mesh(spireGeo, goldMat);
    spireMesh.position.set(0, 1.62, 0);
    this.add(spireMesh);
  }
}

/**
 * 5. Khmer Village Garden Props (Traditional clay water pots / K'am, bamboo fences)
 */
export class KhmerGardenProps3D extends THREE.Group {
  constructor() {
    super();

    const clayMat = new THREE.MeshStandardMaterial({
      color: 0xb55a30, // Traditional Cambodian terracotta earthenware
      roughness: 0.75,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x4a2c1d,
      roughness: 0.8,
    });

    // 1. Traditional Khmer Clay Water Jar (K'am) on Wooden Stand
    const jarStandGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.16, 8);
    const jarStandMesh = new THREE.Mesh(jarStandGeo, woodMat);
    jarStandMesh.position.set(0, 0.08, 0);
    this.add(jarStandMesh);

    // Round belly clay pot
    const potBellyGeo = new THREE.SphereGeometry(0.24, 14, 14);
    potBellyGeo.scale(1.1, 0.95, 1.1);
    const potMesh = new THREE.Mesh(potBellyGeo, clayMat);
    potMesh.position.set(0, 0.32, 0);
    potMesh.castShadow = true;
    this.add(potMesh);

    // Pot neck & rim
    const potNeckGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.1, 12);
    const potNeckMesh = new THREE.Mesh(potNeckGeo, clayMat);
    potNeckMesh.position.set(0, 0.52, 0);
    this.add(potNeckMesh);

    const potRimGeo = new THREE.TorusGeometry(0.125, 0.025, 8, 16);
    potRimGeo.rotateX(Math.PI / 2);
    const potRimMesh = new THREE.Mesh(potRimGeo, clayMat);
    potRimMesh.position.set(0, 0.57, 0);
    this.add(potRimMesh);
  }
}
